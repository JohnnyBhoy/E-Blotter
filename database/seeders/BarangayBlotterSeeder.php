<?php

namespace Database\Seeders;

use App\Models\User;
use Faker\Factory as Faker;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

/**
 * Blotter entries for every barangay account, so the levels above barangay have
 * something to roll up.
 *
 * A barangay with no entries is invisible everywhere above it: blotters carry no
 * jurisdiction column of their own, so a station's console is nothing more than
 * the entries of the barangay accounts sharing its `city_code` (see
 * App\Support\Jurisdiction). Signing in as a municipal account against an empty
 * `blotters` table shows empty cards, an empty chart and an empty table — which
 * is what this seeder fixes.
 *
 * What one entry gets:
 *
 *   - a disposition (`blotters.remarks`) drawn from a fixed mix, so every
 *     barangay carries all five — For Hearing, Amicably Settled, Pending,
 *     Referred to PNP, Others. The mix is dealt out and shuffled rather than
 *     rolled per row, so /referred is never empty by bad luck.
 *   - one complainant and one respondent. BlotterRepository::getAll() drops any
 *     blotter whose complainant family name is blank, so an entry without them
 *     would never appear in the listing.
 *   - a purok on the complainant, from a short list — the barangay console's
 *     area breakdown groups by `complainant_village`.
 *   - `created_at` backdated to the reported date. The console date filters and
 *     the trend chart read `created_at`, so leaving it at "now" would pile every
 *     seeded entry into today.
 *
 * Run:
 *   php artisan db:seed --class=BarangayBlotterSeeder
 *
 * Idempotent, and a top-up rather than an append: a barangay already holding the
 * target number of entries is skipped, one holding fewer is filled to the target,
 * with `entry_number` continuing after its highest existing one.
 *
 * Env knobs (all optional):
 *   BLOTTER_SEED_PER_BARANGAY  entries each barangay should end up with, default 100
 *   BLOTTER_SEED_MONTHS        how far back to spread the entries, default 12
 *   BLOTTER_SEED_CITY          only barangays under this PSGC city code, e.g. 60601
 */
class BarangayBlotterSeeder extends Seeder
{
    private const DEFAULT_PER_BARANGAY = 100;
    private const DEFAULT_MONTHS = 12;

    /** Rows written per INSERT. */
    private const CHUNK = 250;

    /**
     * Share of each disposition, keyed by the id in
     * resources/js/utils/data/disposition.ts. Weights are relative; they do not
     * have to add up to anything in particular.
     */
    private const DISPOSITION_MIX = [
        1 => 25,   // For Hearing
        2 => 25,   // Amicably Settled
        3 => 20,   // Pending
        4 => 20,   // Referred to PNP
        5 => 10,   // Others
    ];

    /** Highest id in resources/js/utils/data/incidentTypes.ts. */
    private const INCIDENT_TYPES = 45;

    /** Drives the barangay console's area breakdown, so it is a short list. */
    private const PUROKS = ['Purok Uno', 'Purok Dos', 'Purok Tres', 'Purok Kuatro', 'Purok Singko', 'Purok Sais'];

    private int $perBarangay;
    private int $months;

    /** Pre-generated pools, so 59k rows do not mean 59k Faker calls per field. */
    private array $firstNames = [];
    private array $lastNames = [];
    private array $narratives = [];
    private array $streets = [];
    private array $cityNames = [];

    public function run(): void
    {
        $this->perBarangay = max(1, $this->option('BLOTTER_SEED_PER_BARANGAY', self::DEFAULT_PER_BARANGAY));
        $this->months = max(1, $this->option('BLOTTER_SEED_MONTHS', self::DEFAULT_MONTHS));
        $city = $this->option('BLOTTER_SEED_CITY', 0);

        $barangays = $this->barangayAccounts($city);

        if ($barangays->isEmpty()) {
            $this->command->warn('No barangay accounts with an address row found — nothing to seed.');
            $this->command->warn('Run: php artisan db:seed --class=AntiqueProvinceSeeder');

            return;
        }

        $this->pools();

        $existing = $this->existingEntries($barangays->pluck('id')->all());

        $this->command->info("Target: {$this->perBarangay} entries per barangay, across {$barangays->count()} barangays.");

        $bar = $this->command->getOutput()->createProgressBar($barangays->count());
        $bar->start();

        $written = 0;
        $skipped = 0;

        foreach ($barangays as $barangay) {
            $state = $existing[$barangay->id] ?? null;
            $have = intval($state->total ?? 0);
            $needed = $this->perBarangay - $have;

            if ($needed <= 0) {
                $skipped++;
                $bar->advance();

                continue;
            }

            $written += $this->seedBarangay($barangay, $needed, intval($state->highest ?? 0));
            $bar->advance();
        }

        $bar->finish();
        $this->command->newLine(2);
        $this->command->info("Wrote {$written} blotter entries ({$skipped} barangays were already at target).");
        $this->command->info('Dispositions dealt per barangay: ' . $this->mixSummary());
    }

    /**
     * Barangay accounts that a jurisdiction above them can actually see — the
     * ones with a `user_addresses` row. An account without one resolves to an
     * empty scope, so entries under it would be invisible everywhere.
     */
    private function barangayAccounts(int $city)
    {
        return DB::table('users')
            ->join('user_addresses', 'user_addresses.user_id', '=', 'users.id')
            ->where('users.role', User::ROLE_BARANGAY)
            ->where('user_addresses.barangay_code', '>', 0)
            ->when($city > 0, fn ($query) => $query->where('user_addresses.city_code', $city))
            ->orderBy('users.id')
            ->get([
                'users.id',
                'users.name',
                'user_addresses.barangay_code',
                'user_addresses.city_code',
                'user_addresses.province_code',
                'user_addresses.region_code',
            ]);
    }

    /**
     * How many entries each account already holds, and its highest
     * `entry_number`, so a top-up run continues the numbering instead of
     * colliding with it.
     *
     * @param array<int,int> $userIds
     */
    private function existingEntries(array $userIds): array
    {
        return DB::table('blotters')
            ->select('user_id', DB::raw('COUNT(*) as total'), DB::raw('MAX(entry_number) as highest'))
            ->whereIn('user_id', $userIds)
            ->groupBy('user_id')
            ->get()
            ->keyBy('user_id')
            ->all();
    }

    /** One barangay's entries, complainants and respondents. */
    private function seedBarangay(object $barangay, int $needed, int $highestEntry): int
    {
        $name = $this->barangayName($barangay->name);
        $dispositions = $this->dispositions($needed);
        $timestamps = $this->timestamps($needed);

        $blotters = [];

        for ($i = 0; $i < $needed; $i++) {
            $reported = $timestamps[$i];
            // Incidents are reported the same day or a few days later.
            $incident = (clone $reported)->subDays(random_int(0, 3))->subHours(random_int(0, 12));

            $blotters[] = [
                'user_id' => $barangay->id,
                'entry_number' => $highestEntry + $i + 1,
                'barangay' => $name,
                'date_reported' => $reported->format('Y-m-d'),
                'time_of_report' => $reported->format('H:i'),
                'date_of_incident' => $incident->format('Y-m-d'),
                'time_of_incident' => $incident->format('H:i'),
                'incident_type' => strval(random_int(1, self::INCIDENT_TYPES)),
                'narrative' => $this->pick($this->narratives),
                'remarks' => strval($dispositions[$i]),
                'complainant_signature' => null,
                'recorded_by' => $this->pick($this->firstNames) . ' ' . $this->pick($this->lastNames),
                'recorded_by_signature' => null,
                'uploaded_file' => null,
                'created_at' => $reported,
                'updated_at' => $reported,
            ];
        }

        DB::transaction(function () use ($barangay, $blotters, $highestEntry, $needed) {
            foreach (array_chunk($blotters, self::CHUNK) as $chunk) {
                DB::table('blotters')->insert($chunk);
            }

            // Ids of the rows just written, keyed by entry number, so the
            // complainant and respondent rows can point at them.
            $ids = DB::table('blotters')
                ->where('user_id', $barangay->id)
                ->whereBetween('entry_number', [$highestEntry + 1, $highestEntry + $needed])
                ->pluck('id', 'entry_number');

            $complainants = [];
            $respondents = [];

            foreach ($blotters as $blotter) {
                $blotterId = $ids[$blotter['entry_number']] ?? null;

                if (!$blotterId) {
                    continue;
                }

                $shared = [
                    'blotter_id' => $blotterId,
                    'user_id' => $barangay->id,
                    'entry_number' => $blotter['entry_number'],
                    'created_at' => $blotter['created_at'],
                    'updated_at' => $blotter['updated_at'],
                ];

                // Complainant and respondent live in the same purok often enough
                // that sharing one keeps the area breakdown believable.
                $purok = $this->pick(self::PUROKS);

                $complainants[] = $shared + $this->person('complainant', $barangay, $purok);
                $respondents[] = $shared + $this->person('respondent', $barangay, $this->pick(self::PUROKS));
            }

            foreach (array_chunk($complainants, self::CHUNK) as $chunk) {
                DB::table('complainants')->insert($chunk);
            }

            foreach (array_chunk($respondents, self::CHUNK) as $chunk) {
                DB::table('respondents')->insert($chunk);
            }
        });

        return $needed;
    }

    /**
     * Complainants and respondents share an identical column set under
     * different prefixes.
     *
     * @return array<string,mixed>
     */
    private function person(string $prefix, object $barangay, string $purok): array
    {
        $family = $this->pick($this->lastNames);
        $first = $this->pick($this->firstNames);

        return [
            "{$prefix}_family_name" => $family,
            "{$prefix}_first_name" => $first,
            "{$prefix}_middle_name" => $this->pick($this->lastNames),
            "{$prefix}_birth_date" => $this->birthDate(),
            "{$prefix}_place_of_birth" => $this->pick($this->cityNames),
            // Filipino most of the time; the lookup runs to 20 citizenships.
            "{$prefix}_citizenship" => random_int(1, 12) === 1 ? random_int(2, 20) : 1,
            "{$prefix}_gender" => random_int(1, 2),
            "{$prefix}_civil_status" => random_int(1, 7),
            "{$prefix}_occupation" => random_int(1, 64),
            "{$prefix}_education" => random_int(1, 14),
            "{$prefix}_email_address" => strtolower($first . '.' . $family) . '@example.test',
            "{$prefix}_street" => $this->pick($this->streets),
            "{$prefix}_village" => $purok,
            "{$prefix}_barangay" => intval($barangay->barangay_code),
            "{$prefix}_city" => intval($barangay->city_code),
            "{$prefix}_province" => intval($barangay->province_code),
            "{$prefix}_region" => intval($barangay->region_code),
            "{$prefix}_work_street" => $this->pick($this->streets),
            "{$prefix}_work_village" => $purok,
            "{$prefix}_work_barangay" => intval($barangay->barangay_code),
            "{$prefix}_work_city" => intval($barangay->city_code),
            "{$prefix}_work_province" => intval($barangay->province_code),
            "{$prefix}_work_region" => intval($barangay->region_code),
        ];
    }

    /**
     * $count disposition ids following DISPOSITION_MIX, shuffled. Dealing them
     * out rather than rolling each row means every barangay ends up with entries
     * in all five states — including "Referred to PNP", which has its own page.
     *
     * @return array<int,int>
     */
    private function dispositions(int $count): array
    {
        $weightTotal = array_sum(self::DISPOSITION_MIX);
        $dealt = [];

        foreach (self::DISPOSITION_MIX as $id => $weight) {
            $share = intval(floor($count * $weight / $weightTotal));

            for ($i = 0; $i < $share; $i++) {
                $dealt[] = $id;
            }
        }

        // Rounding leaves a few short; hand them to the busiest dispositions.
        $ids = array_keys(self::DISPOSITION_MIX);

        while (count($dealt) < $count) {
            $dealt[] = $ids[count($dealt) % count($ids)];
        }

        shuffle($dealt);

        return $dealt;
    }

    /**
     * $count reporting timestamps spread over the window, oldest first, so
     * `entry_number` runs in the same order as the calendar.
     *
     * @return array<int,Carbon>
     */
    private function timestamps(int $count): array
    {
        $start = Carbon::now()->subMonths($this->months);
        $seconds = max(1, intval($start->diffInSeconds(Carbon::now())));
        $stamps = [];

        for ($i = 0; $i < $count; $i++) {
            $stamps[] = (clone $start)->addSeconds(random_int(0, $seconds))
                // Blotters are filed during office hours far more often than at 3am.
                ->setTime(random_int(7, 21), random_int(0, 59));
        }

        usort($stamps, fn ($a, $b) => $a <=> $b);

        return $stamps;
    }

    /**
     * The barangay's own name, out of the account name the province seeder
     * writes: "Brgy. Bayo Grande, Anini-y" -> "Bayo Grande".
     */
    private function barangayName(string $accountName): string
    {
        $name = preg_replace('/^Brgy\.\s*/i', '', trim($accountName));
        $name = explode(',', $name)[0];

        return trim($name) ?: $accountName;
    }

    /** Value pools, drawn once so the per-row cost is an array lookup. */
    private function pools(): void
    {
        $faker = Faker::create();

        for ($i = 0; $i < 400; $i++) {
            $this->firstNames[] = $faker->firstName;
            $this->lastNames[] = $faker->lastName;
            $this->streets[] = $faker->streetAddress;
        }

        for ($i = 0; $i < 120; $i++) {
            $this->narratives[] = $faker->paragraph(4);
            $this->cityNames[] = $faker->city;
        }
    }

    /**
     * One numeric knob, from the real environment first so it can be set for a
     * single run — BLOTTER_SEED_CITY=60601 php artisan db:seed ... — and from
     * .env otherwise.
     */
    private function option(string $key, int $default): int
    {
        $value = getenv($key);

        if ($value === false || $value === '') {
            $value = env($key, $default);
        }

        return intval($value);
    }

    /** @param array<int,mixed> $pool */
    private function pick(array $pool)
    {
        return $pool[array_rand($pool)];
    }

    private function birthDate(): string
    {
        return Carbon::now()
            ->subYears(random_int(18, 70))
            ->subDays(random_int(0, 364))
            ->format('Y-m-d');
    }

    /** "For Hearing 25, Amicably Settled 25, ..." for the closing summary. */
    private function mixSummary(): string
    {
        $labels = [1 => 'For Hearing', 2 => 'Amicably Settled', 3 => 'Pending', 4 => 'Referred to PNP', 5 => 'Others'];
        $counts = array_count_values($this->dispositions($this->perBarangay));
        $parts = [];

        foreach ($labels as $id => $label) {
            $parts[] = "{$label} " . ($counts[$id] ?? 0);
        }

        return implode(', ', $parts);
    }
}

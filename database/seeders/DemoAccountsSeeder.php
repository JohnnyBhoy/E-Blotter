<?php

namespace Database\Seeders;

use App\Models\Blotter;
use App\Models\Complainant;
use App\Models\Respondent;
use App\Models\User;
use App\Models\UserAddress;
use Faker\Factory as Faker;
use Illuminate\Database\Seeder;

/**
 * One demo login per role level (1-5), plus a jurisdiction tree wide enough that
 * each level's rollup is visibly different from the one below it.
 *
 *   Region VI ─ Antique ─ Anini-y  ─ Bayo Grande     ← the barangay login
 *             │         │          └ Bayo Pequeño
 *             │         └ Barbaza  ─ Baghari
 *             └ Aklan   ─ Altavas  ─ Cabangila
 *   Region VII ─ Bohol  ─ Alburquerque ─ Bahi
 *
 * So the same console shows: the barangay its own entries, the Anini-y station
 * two barangays, Antique three, Region VI four, and the super admin all five.
 *
 * Idempotent — matches on email, so re-running refreshes the accounts instead of
 * duplicating them, and skips barangays that already have entries.
 */
class DemoAccountsSeeder extends Seeder
{
    private const PASSWORD = 'Password@123';

    private const REGION_6 = 6;         // Region VI (Western Visayas)
    private const ANTIQUE = 606;
    private const AKLAN = 604;
    private const ANINIY = 60601;
    private const BARBAZA = 60602;
    private const ALTAVAS = 60401;

    private const REGION_7 = 7;         // Region VII (Central Visayas)
    private const BOHOL = 712;
    private const ALBURQUERQUE = 71201;

    /**
     * The five logins, one per level. Each is pinned to the deepest jurisdiction
     * it covers; Jurisdiction resolves the rest from the PSGC codes.
     */
    private const ACCOUNTS = [
        [
            'name' => 'Super Admin (Demo)',
            'email' => 'admin@demo.test',
            'role' => User::ROLE_SUPER_ADMIN,
            'is_admin' => true,
            'barangay_code' => 0,
            'city_code' => 0,
            'province_code' => 0,
            'region_code' => 0,
        ],
        [
            'name' => 'Brgy. Bayo Grande (Demo)',
            'email' => 'barangay@demo.test',
            'role' => User::ROLE_BARANGAY,
            'is_admin' => false,
            'barangay_code' => 60601001,
            'city_code' => self::ANINIY,
            'province_code' => self::ANTIQUE,
            'region_code' => self::REGION_6,
        ],
        [
            'name' => 'Anini-y PNP Station (Demo)',
            'email' => 'station@demo.test',
            'role' => User::ROLE_STATION,
            'is_admin' => false,
            'barangay_code' => 0,
            'city_code' => self::ANINIY,
            'province_code' => self::ANTIQUE,
            'region_code' => self::REGION_6,
        ],
        [
            'name' => 'Antique Provincial Office (Demo)',
            'email' => 'province@demo.test',
            'role' => User::ROLE_PROVINCE,
            'is_admin' => false,
            'barangay_code' => 0,
            'city_code' => self::ANINIY,
            'province_code' => self::ANTIQUE,
            'region_code' => self::REGION_6,
        ],
        [
            'name' => 'Region VI Office (Demo)',
            'email' => 'region@demo.test',
            'role' => User::ROLE_REGION,
            'is_admin' => false,
            'barangay_code' => 0,
            'city_code' => self::ANINIY,
            'province_code' => self::ANTIQUE,
            'region_code' => self::REGION_6,
        ],
    ];

    /**
     * Barangay accounts that carry the blotter entries. The first one is the
     * barangay login above; the rest exist so the levels above have more than
     * one unit to roll up.
     */
    private const BARANGAYS = [
        [
            'name' => 'Brgy. Bayo Grande (Demo)',
            'email' => 'barangay@demo.test',
            'barangay' => 'Bayo Grande',
            'barangay_code' => 60601001,
            'city_code' => self::ANINIY,
            'province_code' => self::ANTIQUE,
            'region_code' => self::REGION_6,
            'entries' => 25,
        ],
        [
            'name' => 'Brgy. Bayo Pequeño (Demo)',
            'email' => 'bayo.pequeno@demo.test',
            'barangay' => 'Bayo Pequeño',
            'barangay_code' => 60601002,
            'city_code' => self::ANINIY,
            'province_code' => self::ANTIQUE,
            'region_code' => self::REGION_6,
            'entries' => 10,
        ],
        [
            'name' => 'Brgy. Baghari (Demo)',
            'email' => 'baghari@demo.test',
            'barangay' => 'Baghari',
            'barangay_code' => 60602002,
            'city_code' => self::BARBAZA,
            'province_code' => self::ANTIQUE,
            'region_code' => self::REGION_6,
            'entries' => 8,
        ],
        [
            'name' => 'Brgy. Cabangila (Demo)',
            'email' => 'cabangila@demo.test',
            'barangay' => 'Cabangila',
            'barangay_code' => 60401001,
            'city_code' => self::ALTAVAS,
            'province_code' => self::AKLAN,
            'region_code' => self::REGION_6,
            'entries' => 9,
        ],
        [
            'name' => 'Brgy. Bahi (Demo)',
            'email' => 'bahi@demo.test',
            'barangay' => 'Bahi',
            'barangay_code' => 71201001,
            'city_code' => self::ALBURQUERQUE,
            'province_code' => self::BOHOL,
            'region_code' => self::REGION_7,
            'entries' => 7,
        ],
    ];

    public function run(): void
    {
        foreach (self::ACCOUNTS as $account) {
            $user = $this->account($account);

            $this->command->info("  {$account['email']} — role {$account['role']} — {$account['name']}");
        }

        foreach (self::BARANGAYS as $barangay) {
            $user = $this->account($barangay + [
                'role' => User::ROLE_BARANGAY,
                'is_admin' => false,
            ]);

            $this->seedBlotters($user, $barangay);
        }
    }

    /**
     * Create or refresh one account and its address row.
     *
     * @param array<string,mixed> $account
     */
    private function account(array $account): User
    {
        $user = User::updateOrCreate(
            ['email' => $account['email']],
            [
                'name' => $account['name'],
                'password' => self::PASSWORD, // hashed by the model cast
                'role' => $account['role'],
                'email_verified_at' => now(),
            ]
        );

        // `is_admin` is not in $fillable — set it directly.
        $user->is_admin = $account['is_admin'];
        $user->save();

        UserAddress::updateOrCreate(
            ['user_id' => $user->id],
            [
                'barangay_code' => $account['barangay_code'],
                'city_code' => $account['city_code'],
                'province_code' => $account['province_code'],
                'region_code' => $account['region_code'],
            ]
        );

        return $user;
    }

    /**
     * Blotter entries for one demo barangay. Every entry gets one complainant
     * and one respondent — BlotterRepository::getAll() filters out rows with no
     * complainant name, so a blotter without them is invisible in the listing.
     *
     * `created_at` is backdated to the reported date on purpose: the console
     * filters and the trend chart both read `created_at`, so leaving it at "now"
     * would pile every demo entry into today.
     *
     * @param array<string,mixed> $barangay
     */
    private function seedBlotters(User $user, array $barangay): void
    {
        if (Blotter::where('user_id', $user->id)->exists()) {
            $this->command->info("  Blotters already seeded for {$user->email} — skipping.");

            return;
        }

        $faker = Faker::create();
        $count = intval($barangay['entries']);
        $puroks = ['Purok Uno', 'Purok Dos', 'Purok Tres', 'Purok Kuatro'];

        for ($entryNumber = 1; $entryNumber <= $count; $entryNumber++) {
            $reported = $faker->dateTimeBetween('-10 months', 'now');

            $blotter = Blotter::create([
                'user_id' => $user->id,
                'entry_number' => $entryNumber,
                'barangay' => $barangay['barangay'],
                'date_reported' => $reported->format('Y-m-d'),
                'time_of_report' => $reported->format('H:i'),
                'date_of_incident' => $reported->format('Y-m-d'),
                'time_of_incident' => $reported->format('H:i'),
                'incident_type' => $faker->numberBetween(1, 45),
                'narrative' => $faker->paragraph(4),
                'remarks' => $faker->numberBetween(1, 6),
                'recorded_by' => $faker->name,
            ]);

            $blotter->forceFill([
                'created_at' => $reported,
                'updated_at' => $reported,
            ])->save();

            $shared = [
                'blotter_id' => $blotter->id,
                'user_id' => $user->id,
                'entry_number' => $entryNumber,
            ];

            $purok = $faker->randomElement($puroks);

            Complainant::create($shared + $this->person($faker, 'complainant', $barangay, $purok));
            Respondent::create($shared + $this->person($faker, 'respondent', $barangay, $purok));
        }

        $this->command->info("  Seeded {$count} blotter entries for {$user->email}.");
    }

    /**
     * Complainants and respondents share an identical column set under
     * different prefixes.
     *
     * @param array<string,mixed> $barangay
     */
    private function person($faker, string $prefix, array $barangay, string $purok): array
    {
        return [
            "{$prefix}_family_name" => $faker->lastName,
            "{$prefix}_first_name" => $faker->firstName,
            "{$prefix}_middle_name" => $faker->lastName,
            "{$prefix}_birth_date" => $faker->date(),
            "{$prefix}_place_of_birth" => $faker->city,
            "{$prefix}_citizenship" => 1,
            "{$prefix}_gender" => $faker->numberBetween(1, 2),
            "{$prefix}_civil_status" => $faker->numberBetween(1, 7),
            "{$prefix}_occupation" => $faker->numberBetween(1, 63),
            "{$prefix}_education" => $faker->numberBetween(1, 14),
            "{$prefix}_email_address" => $faker->safeEmail,
            "{$prefix}_street" => $faker->streetAddress,
            // The purok drives the barangay console's area breakdown, so it is a
            // short list of real-looking puroks rather than a random street name.
            "{$prefix}_village" => $purok,
            "{$prefix}_barangay" => $barangay['barangay_code'],
            "{$prefix}_city" => $barangay['city_code'],
            "{$prefix}_province" => $barangay['province_code'],
            "{$prefix}_region" => $barangay['region_code'],
            "{$prefix}_work_street" => $faker->streetAddress,
            "{$prefix}_work_village" => $purok,
            "{$prefix}_work_barangay" => $barangay['barangay_code'],
            "{$prefix}_work_city" => $barangay['city_code'],
            "{$prefix}_work_province" => $barangay['province_code'],
            "{$prefix}_work_region" => $barangay['region_code'],
        ];
    }
}

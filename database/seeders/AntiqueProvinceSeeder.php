<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\UserAddress;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * Every login in the province of Antique, as one tree.
 *
 *   Super admin (role 1)
 *     └ Antique Provincial Office (role 4)
 *         ├ Anini-y Municipal Station (role 3)
 *         │   ├ Brgy. Bayo Grande (role 2)
 *         │   └ ... 23 barangays
 *         └ ... 18 municipalities, 590 barangays
 *
 * 609 accounts in total. The tree is recorded twice, on purpose:
 *
 *   - `users.parent_id` — the literal chain of command, walkable from any
 *     account via ->parent() / ->children().
 *   - `user_addresses` PSGC codes — what App\Support\Jurisdiction actually
 *     reads to scope blotter queries. A station sees the barangays sharing its
 *     `city_code`, a province the barangays sharing its `province_code`.
 *
 * Names and codes come from database/data/antique-psgc.json, generated from the
 * same PSGC dataset the UI uses (resources/js/utils/data/{cities,barangays}.ts),
 * so a seeded account's codes always resolve to a real entry in the dropdowns.
 *
 * Run:
 *   php artisan db:seed --class=AntiqueProvinceSeeder
 *
 * Idempotent — matched on email, so a re-run refreshes names, roles, codes and
 * parents instead of duplicating accounts. Passwords of accounts that already
 * exist are left alone unless ANTIQUE_SEED_RESET_PASSWORDS=true.
 *
 * Env knobs (all optional):
 *   ANTIQUE_SEED_EMAIL_DOMAIN     default antique.eblotter.gov.ph
 *   ANTIQUE_SEED_PASSWORD         default Antique@2026, shared by every account
 *   ANTIQUE_SEED_RANDOM_PASSWORDS true = a distinct random password per account
 *   ANTIQUE_SEED_RESET_PASSWORDS  true = also reset existing accounts' passwords
 *
 * Every credential it sets is written to storage/app/antique-accounts.csv, which
 * is the list to hand out. Bcrypt at 12 rounds means a first full run takes a
 * few minutes; later runs are quick because unchanged passwords are not rehashed.
 */
class AntiqueProvinceSeeder extends Seeder
{
    private const DATA = 'database/data/antique-psgc.json';
    private const CSV = 'antique-accounts.csv';

    private string $domain;
    private string $password;
    private bool $randomPasswords;
    private bool $resetPasswords;

    /** Credential rows collected for the CSV. */
    private array $credentials = [];

    public function run(): void
    {
        $this->domain = strtolower(env('ANTIQUE_SEED_EMAIL_DOMAIN', 'antique.eblotter.gov.ph'));
        $this->password = env('ANTIQUE_SEED_PASSWORD', 'Antique@2026');
        $this->randomPasswords = filter_var(env('ANTIQUE_SEED_RANDOM_PASSWORDS', false), FILTER_VALIDATE_BOOLEAN);
        $this->resetPasswords = filter_var(env('ANTIQUE_SEED_RESET_PASSWORDS', false), FILTER_VALIDATE_BOOLEAN);

        $data = $this->data();
        $region = intval($data['region']['code']);
        $province = $data['province'];

        // The root. SuperAdminSeeder owns the credentials for it; this seeder
        // only needs the account to exist so the province can hang off it.
        $this->call(SuperAdminSeeder::class);
        $superAdmin = $this->superAdmin();
        $this->command->info("Root: {$superAdmin->email} (role 1)");

        $provinceAccount = null;
        $stations = 0;
        $barangays = 0;

        DB::transaction(function () use ($data, $region, $province, $superAdmin, &$provinceAccount, &$stations, &$barangays) {
            $provinceAccount = $this->account(
                name: "{$province['name']} Provincial Office",
                email: "{$province['slug']}@{$this->domain}",
                role: User::ROLE_PROVINCE,
                parent: $superAdmin,
                codes: [
                    'barangay_code' => 0,
                    'city_code' => 0,
                    'province_code' => intval($province['code']),
                    'region_code' => $region,
                ],
                psgc: intval($province['code']),
            );

            $bar = $this->command->getOutput()->createProgressBar(count($data['municipalities']));
            $bar->start();

            foreach ($data['municipalities'] as $municipality) {
                $station = $this->account(
                    name: "{$municipality['name']} Municipal Station",
                    email: "{$municipality['slug']}@{$this->domain}",
                    role: User::ROLE_STATION,
                    parent: $provinceAccount,
                    codes: [
                        'barangay_code' => 0,
                        'city_code' => intval($municipality['code']),
                        'province_code' => intval($province['code']),
                        'region_code' => $region,
                    ],
                    psgc: intval($municipality['code']),
                );
                $stations++;

                foreach ($municipality['barangays'] as $barangay) {
                    $this->account(
                        name: "Brgy. {$barangay['name']}, {$municipality['name']}",
                        email: "{$barangay['slug']}.{$municipality['slug']}@{$this->domain}",
                        role: User::ROLE_BARANGAY,
                        parent: $station,
                        codes: [
                            'barangay_code' => intval($barangay['code']),
                            'city_code' => intval($municipality['code']),
                            'province_code' => intval($province['code']),
                            'region_code' => $region,
                        ],
                        psgc: intval($barangay['code']),
                    );
                    $barangays++;
                }

                $bar->advance();
            }

            $bar->finish();
            $this->command->newLine(2);
        });

        $path = $this->writeCredentials();

        $this->command->info("Antique seeded — 1 province, {$stations} municipal stations, {$barangays} barangays.");
        $this->command->info("Province login: {$provinceAccount->email}");
        $this->command->info("Credentials written to {$path}");

        if (!$this->randomPasswords) {
            $this->command->warn('  Every seeded account shares one password. Require a change on first login.');
        }
    }

    /**
     * The root of the tree.
     *
     * Prefer the account SuperAdminSeeder owns — several role 1 accounts can
     * exist (the demo chain seeds one of its own), and picking the lowest id
     * would silently hang the whole province off whichever was created first.
     */
    private function superAdmin(): User
    {
        $email = env('SUPER_ADMIN_EMAIL', 'superadmin@eblotter.gov.ph');

        return User::where('email', $email)->where('role', User::ROLE_SUPER_ADMIN)->first()
            ?? User::where('role', User::ROLE_SUPER_ADMIN)->orderBy('id')->firstOrFail();
    }

    /**
     * The PSGC tree this seeder provisions from.
     *
     * @return array<string,mixed>
     */
    private function data(): array
    {
        $path = base_path(self::DATA);

        if (!is_file($path)) {
            throw new \RuntimeException('Missing PSGC data file: ' . self::DATA);
        }

        $data = json_decode(file_get_contents($path), true);

        if (!is_array($data) || empty($data['municipalities'])) {
            throw new \RuntimeException('Unreadable PSGC data file: ' . self::DATA);
        }

        return $data;
    }

    /**
     * Create or refresh one account, its address row and its place in the tree.
     *
     * @param array<string,int> $codes
     */
    private function account(
        string $name,
        string $email,
        int $role,
        ?User $parent,
        array $codes,
        int $psgc,
    ): User {
        $existing = User::where('email', $email)->first();
        $password = $this->randomPasswords ? Str::password(14, symbols: false) : $this->password;
        $setsPassword = !$existing || $this->resetPasswords;

        $attributes = [
            'name' => $name,
            'role' => $role,
            'email_verified_at' => now(),
        ];

        if ($setsPassword) {
            $attributes['password'] = $password; // hashed by the model cast
        }

        $user = User::updateOrCreate(['email' => $email], $attributes);

        // Neither column is mass assignable — is_admin is a plain flag and
        // parent_id is structural.
        $user->is_admin = false;
        $user->parent_id = $parent?->id;
        $user->save();

        UserAddress::updateOrCreate(['user_id' => $user->id], $codes);

        $this->credentials[] = [
            'level' => $this->levelLabel($role),
            'psgc_code' => $psgc,
            'name' => $name,
            'email' => $email,
            'password' => $setsPassword ? $password : '(unchanged — account already existed)',
            'reports_to' => $parent?->email ?? '',
        ];

        return $user;
    }

    private function levelLabel(int $role): string
    {
        return match ($role) {
            User::ROLE_PROVINCE => 'Province',
            User::ROLE_STATION => 'Municipality / Station',
            User::ROLE_BARANGAY => 'Barangay',
            default => 'Other',
        };
    }

    /**
     * The handout list. Written under storage/app, which git ignores — it holds
     * plaintext passwords and must not be committed.
     */
    private function writeCredentials(): string
    {
        $path = storage_path('app/' . self::CSV);

        $handle = fopen($path, 'w');
        fputcsv($handle, ['level', 'psgc_code', 'name', 'email', 'password', 'reports_to']);

        foreach ($this->credentials as $row) {
            fputcsv($handle, $row);
        }

        fclose($handle);
        chmod($path, 0600);

        return $path;
    }
}

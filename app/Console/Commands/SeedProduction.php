<?php

namespace App\Console\Commands;

use Database\Seeders\AntiqueProvinceSeeder;
use Database\Seeders\BarangayBlotterSeeder;
use Database\Seeders\DemoAccountsSeeder;
use Database\Seeders\SuperAdminSeeder;
use Illuminate\Console\Command;
use Illuminate\Console\ConfirmableTrait;
use Illuminate\Support\Facades\DB;

/**
 * One entry point for provisioning a deployed environment.
 *
 * `db:seed` alone runs DatabaseSeeder, which is deliberately only the super
 * admin — everything that writes accounts or sample records is opt-in there, so
 * a stray seed run can never repopulate production by accident. That leaves the
 * real provisioning spread across four `--class=` invocations, which is what
 * this command collapses.
 *
 * Every seeder it calls is idempotent: accounts match on email
 * (updateOrCreate), and the blotter entries are a top-up to a target per
 * barangay rather than an append. Re-running is safe.
 *
 * BlotterSeeder is deliberately not called — it writes a `complainant_signature`
 * column that does not exist, hardcodes `user_id`, and loops far past the
 * barangay list. Use BarangayBlotterSeeder (the --blotters flag) instead.
 *
 * On Laravel Cloud, run it as:
 *
 *   php artisan eblotter:seed --all --force
 */
class SeedProduction extends Command
{
    use ConfirmableTrait;

    protected $signature = 'eblotter:seed
                            {--demo : also create the five demo logins, one per role}
                            {--blotters : also fill every barangay account with sample blotter entries}
                            {--all : everything — the Antique tree, the demo logins and the blotter entries}
                            {--force : skip the confirmation prompt (required in production)}';

    protected $description = 'Provision an environment: super admin, the Antique account tree, and optionally demo logins and blotter entries';

    public function handle(): int
    {
        if (! $this->confirmToProceed()) {
            return self::FAILURE;
        }

        $all = $this->option('all');

        // The super admin and the Antique tree are the real provisioning run —
        // 609 accounts the app cannot create for itself, since registration
        // hardcodes barangay level.
        $seeders = [
            SuperAdminSeeder::class => 'Super admin',
            AntiqueProvinceSeeder::class => 'Antique tree — 1 province, 18 stations, 590 barangays',
        ];

        if ($all || $this->option('demo')) {
            $seeders[DemoAccountsSeeder::class] = 'Demo logins, one per role';
        }

        if ($all || $this->option('blotters')) {
            $seeders[BarangayBlotterSeeder::class] = 'Blotter entries behind every barangay';
        }

        foreach ($seeders as $class => $label) {
            $this->newLine();
            $this->components->info($label);

            $this->call('db:seed', [
                '--class' => $class,
                '--force' => true,
            ]);
        }

        $this->summarise();

        return self::SUCCESS;
    }

    /**
     * What the environment holds afterwards. Counts rather than a "done"
     * message, because the seeders top up silently — this is the only way to
     * see whether a run actually landed anything.
     */
    private function summarise(): void
    {
        $roles = DB::table('users')
            ->select('role', DB::raw('COUNT(*) as total'))
            ->groupBy('role')
            ->pluck('total', 'role');

        $labels = [
            1 => 'Super admin',
            2 => 'Barangay',
            3 => 'Station',
            4 => 'Province',
            5 => 'Region',
        ];

        $rows = [];

        foreach ($labels as $role => $label) {
            $rows[] = [$label, number_format($roles[$role] ?? 0)];
        }

        $rows[] = ['—', ''];
        $rows[] = ['Blotter entries', number_format(DB::table('blotters')->count())];
        $rows[] = ['Addresses', number_format(DB::table('user_addresses')->count())];

        $this->newLine();
        $this->table(['', 'Rows'], $rows);
    }
}

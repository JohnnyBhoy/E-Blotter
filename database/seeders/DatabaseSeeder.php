<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * Only the super admin, which the app cannot create for itself:
     * registration hardcodes barangay level. The demo chain of one account per
     * level, with blotter entries behind it, is opt-in because it writes sample
     * records:
     *
     *   php artisan db:seed --class=DemoAccountsSeeder
     *
     * The real provisioning run for the pilot — the whole Antique tree, 609
     * accounts (1 province, 18 municipal stations, 590 barangays), is opt-in for
     * the same reason:
     *
     *   php artisan db:seed --class=AntiqueProvinceSeeder
     *
     * Blotter entries behind those accounts — 100 per barangay, dispositions
     * dealt so every barangay carries all five including "Referred to PNP" — are
     * opt-in too, and are what makes a station, provincial or regional login show
     * anything at all:
     *
     *   php artisan db:seed --class=BarangayBlotterSeeder
     */
    public function run(): void
    {
        $this->call([
            SuperAdminSeeder::class,
        ]);
    }
}

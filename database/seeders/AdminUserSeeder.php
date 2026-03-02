<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\UserAddress;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run database seeds.
     */
    public function run(): void
    {
        // Create Super Admin user
        $superAdmin = User::create([
            'name' => 'Super Administrator',
            'email' => 'superadmin@eblotter.gov.ph',
            'password' => Hash::make('superadmin123'), // Change this in production
            'role' => 1, // 1 = Super Admin role
            'is_admin' => true,
            'lang' => null,
            'lat' => null,
            'avatar' => null,
            'banner' => null,
            'email_verified_at' => now(),
        ]);

        {/* Create Province user
        $province = User::create([
            'name' => 'Province Officer',
            'email' => 'province@eblotter.gov.ph',
            'password' => Hash::make('province123'),
            'role' => 2, // 2 = Province role
            'is_admin' => false,
            'province_id' => null, // Top level
            'municipality_id' => null,
            'station_id' => null,
            'lang' => null,
            'lat' => null,
            'avatar' => null,
            'banner' => null,
            'email_verified_at' => now(),
        ]);

        // Create Municipality user
        $municipality = User::create([
            'name' => 'Municipality Officer',
            'email' => 'municipality@eblotter.gov.ph',
            'password' => Hash::make('municipality123'),
            'role' => 3, // 3 = Municipality role
            'is_admin' => false,
            'province_id' => $province->id, // Belongs to province
            'municipality_id' => null,
            'station_id' => null,
            'lang' => null,
            'lat' => null,
            'avatar' => null,
            'banner' => null,
            'email_verified_at' => now(),
        ]);

        // Create Station user
        $station = User::create([
            'name' => 'PNP Station Officer',
            'email' => 'station@eblotter.gov.ph',
            'password' => Hash::make('station123'),
            'role' => 4, // 4 = Station role
            'is_admin' => false,
            'province_id' => $province->id, // Belongs to province
            'municipality_id' => null,
            'station_id' => null,
            'lang' => null,
            'lat' => null,
            'avatar' => null,
            'banner' => null,
            'email_verified_at' => now(),
        ]);

        // Create Barangay user
        $barangay = User::create([
            'name' => 'Barangay Captain',
            'email' => 'barangay@eblotter.gov.ph',
            'password' => Hash::make('barangay123'),
            'role' => 5, // 5 = Barangay role
            'is_admin' => false,
            'province_id' => $province->id, // Belongs to province
            'municipality_id' => $municipality->id, // Belongs to municipality
            'station_id' => $station->id, // Belongs to station
            'lang' => null,
            'lat' => null,
            'avatar' => null,
            'banner' => null,
            'email_verified_at' => now(),
        ]);

        // Create address records for all users
        UserAddress::create([
            'user_id' => $superAdmin->id,
            'barangay_code' => null,
            'city_code' => null,
            'province_code' => 'PH-0001',
            'region_code' => 'PH-01',
        ]);

        UserAddress::create([
            'user_id' => $province->id,
            'barangay_code' => null,
            'city_code' => null,
            'province_code' => 'PH-0001',
            'region_code' => 'PH-01',
        ]);

        UserAddress::create([
            'user_id' => $municipality->id,
            'barangay_code' => null,
            'city_code' => 'PH-0001001',
            'province_code' => 'PH-0001',
            'region_code' => 'PH-01',
        ]);

        UserAddress::create([
            'user_id' => $station->id,
            'barangay_code' => null,
            'city_code' => 'PH-0001001', // Same city as municipality
            'province_code' => 'PH-0001',
            'region_code' => 'PH-01',
        ]);

        UserAddress::create([
            'user_id' => $barangay->id,
            'barangay_code' => 'PH-0001001001',
            'city_code' => 'PH-0001001',
            'province_code' => 'PH-0001',
            'region_code' => 'PH-01',
        ]);
        */}

        $this->command->info('✅ E-Blotter users created successfully!');
        $this->command->info('');
        $this->command->info('👑 Super Admin Email: superadmin@eblotter.gov.ph');
        $this->command->info('🔑 Super Admin Password: superadmin123');
        $this->command->info('');
        $this->command->info('🏛️ Province Email: province@eblotter.gov.ph');
        $this->command->info('🔑 Province Password: province123');
        $this->command->info('');
        $this->command->info('🏢 Municipality Email: municipality@eblotter.gov.ph');
        $this->command->info('🔑 Municipality Password: municipality123');
        $this->command->info('');
        $this->command->info('🚔 Station Email: station@eblotter.gov.ph');
        $this->command->info('🔑 Station Password: station123');
        $this->command->info('');
        $this->command->info('🏘️ Barangay Email: barangay@eblotter.gov.ph');
        $this->command->info('🔑 Barangay Password: barangay123');
        $this->command->info('');
        $this->command->info('🔗 Hierarchy Setup:');
        $this->command->info('   Province → Municipality, Station');
        $this->command->info('   Municipality → Barangay');
        $this->command->info('   Station → Barangay');
        $this->command->info('');
        $this->command->info('⚠️  Please change these passwords in production!');
    }
}

<?php

namespace Database\Seeders;

use App\Models\Complainant;
use App\Models\Respondent;
use App\Models\User;
use App\Models\Blotter;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class NormalizedDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('🌱 Starting normalized data seeding with string-based addresses...');
        
        // Clear existing data
        $this->clearExistingData();
        
        // Get existing blotter records
        $blotters = Blotter::all();
        
        if ($blotters->isEmpty()) {
            $this->command->error('❌ No blotter records found. Please run ComprehensiveDataSeeder first.');
            return;
        }
        
        // Sample realistic Filipino names
        $complainantNames = [
            ['Juan', 'Santos', 'Cruz'],
            ['Maria', 'Reyes', 'Garcia'],
            ['Jose', 'Lopez', 'Martinez'],
            ['Ana', 'Torres', 'Rivera'],
            ['Carlos', 'Gonzalez', 'Ramirez'],
            ['Elena', 'Flores', 'Morales'],
            ['Roberto', 'Sanchez', 'Castillo'],
            ['Sofia', 'Diaz', 'Ortiz'],
            ['Miguel', 'Vargas', 'Silva'],
            ['Isabella', 'Mendoza', 'Paredes'],
            ['Antonio', 'Del Rosario', 'Santos'],
            ['Carmen', 'De la Cruz', 'Reyes'],
            ['Francisco', 'Aquino', 'Mendoza'],
            ['Lourdes', 'Villanueva', 'Fernando'],
            ['Ricardo', 'Macapagal', 'Lim']
        ];

        $respondentNames = [
            ['Pedro', 'Hernandez', 'Ramos'],
            ['Rosa', 'Jimenez', 'Cruz'],
            ['Antonio', 'Navarro', 'Medina'],
            ['Carmen', 'Salazar', 'Castro'],
            ['Luis', 'Paredes', 'Vargas'],
            ['Patricia', 'Mendoza', 'Rojas'],
            ['Diego', 'Silva', 'Flores'],
            ['Gabriela', 'Torres', 'Santos'],
            ['Ricardo', 'Lopez', 'Garcia'],
            ['Valentina', 'Reyes', 'Martinez'],
            ['Manuel', 'Aquino', 'Santos'],
            ['Teresa', 'Gomez', 'Reyes'],
            ['Fernando', 'Pineda', 'Castillo'],
            ['Beatriz', 'Villanueva', 'Mendoza'],
            ['Alberto', 'Cruz', 'Sanchez']
        ];

        // Realistic locations
        $barangays = [
            'San Antonio', 'Santa Cruz', 'San Jose', 'San Miguel', 'San Pedro',
            'San Juan', 'San Pablo', 'San Roque', 'San Carlos', 'San Isidro',
            'San Francisco', 'San Bartolome', 'San Andres', 'San Nicolas', 'San Vicente'
        ];

        $cities = [
            'Manila', 'Quezon City', 'Caloocan', 'Makati', 'Pasay',
            'Pasig', 'Mandaluyong', 'San Juan', 'Taguig', 'Paranaque'
        ];

        $provinces = [
            'Metro Manila', 'Cavite', 'Laguna', 'Batangas', 'Rizal',
            'Quezon', 'Bulacan', 'Pampanga', 'Tarlac', 'Zambales'
        ];

        $regions = [
            'NCR - National Capital Region', 'CALABARZON', 'MIMAROPA', 'Central Luzon', 'Ilocos Region'
        ];

        // Demographic options (string-based)
        $citizenshipOptions = ['Filipino', 'American', 'Chinese', 'Japanese', 'Korean'];
        $genderOptions = ['Male', 'Female'];
        $civilStatusOptions = ['Single', 'Married', 'Widowed', 'Separated', 'Divorced'];
        $occupationOptions = [
            'Employee', 'Business Owner', 'Student', 'Retired', 'Unemployed',
            'Freelancer', 'Self-Employed', 'Government Employee', 'Private Sector', 'Professional'
        ];
        $educationOptions = [
            'Elementary', 'High School', 'College', 'Postgraduate', 'Vocational', 'Master\'s Degree', 'PhD'
        ];

        foreach ($blotters as $index => $blotter) {
            // Create complainant record with string-based data
            $complainantName = $complainantNames[array_rand($complainantNames)];
            $complainantBirthDate = now()->subYears(rand(18, 65))->subDays(rand(0, 365));
            $selectedBarangay = $barangays[array_rand($barangays)];
            $selectedCity = $cities[array_rand($cities)];
            $selectedProvince = $provinces[array_rand($provinces)];
            $selectedRegion = $regions[array_rand($regions)];
            
            Complainant::create([
                'blotter_id' => $blotter->id,
                'user_id' => $blotter->user_id,
                'entry_number' => $blotter->entry_number,
                'complainant_family_name' => $complainantName[2],
                'complainant_first_name' => $complainantName[0],
                'complainant_middle_name' => $complainantName[1],
                'complainant_birth_date' => $complainantBirthDate->toDateString(),
                'complainant_place_of_birth' => 'Manila, Philippines',
                'complainant_citizenship' => $citizenshipOptions[array_rand($citizenshipOptions)],
                'complainant_gender' => $genderOptions[array_rand($genderOptions)],
                'complainant_civil_status' => $civilStatusOptions[array_rand($civilStatusOptions)],
                'complainant_occupation' => $occupationOptions[array_rand($occupationOptions)],
                'complainant_education' => $educationOptions[array_rand($educationOptions)],
                'complainant_email_address' => strtolower(str_replace(' ', '', $complainantName[0])) . '.' . strtolower(str_replace(' ', '', $complainantName[2])) . '@email.com',
                'complainant_street' => rand(100, 999) . ' ' . ['Main St', 'Mabini St', 'Rizal Ave', 'Bonifacio St'][rand(0, 3)],
                'complainant_village' => 'Purok ' . rand(1, 8),
                'complainant_barangay' => $selectedBarangay,
                'complainant_city' => $selectedCity,
                'complainant_province' => $selectedProvince,
                'complainant_region' => $selectedRegion,
                'complainant_work_street' => rand(100, 999) . ' ' . ['Business Ave', 'Commercial St', 'Office Blvd', 'Corporate Rd'][rand(0, 3)],
                'complainant_work_village' => ['Business District', 'Commercial Center', 'Industrial Park', 'Office Complex'][rand(0, 3)],
                'complainant_work_barangay' => $barangays[array_rand($barangays)],
                'complainant_work_city' => $cities[array_rand($cities)],
                'complainant_work_province' => $provinces[array_rand($provinces)],
                'complainant_work_region' => $regions[array_rand($regions)],
            ]);

            // Create respondent record with string-based data
            $respondentName = $respondentNames[array_rand($respondentNames)];
            $respondentBirthDate = now()->subYears(rand(18, 65))->subDays(rand(0, 365));
            $respondentBarangay = $barangays[array_rand($barangays)];
            $respondentCity = $cities[array_rand($cities)];
            $respondentProvince = $provinces[array_rand($provinces)];
            $respondentRegion = $regions[array_rand($regions)];
            
            Respondent::create([
                'blotter_id' => $blotter->id,
                'user_id' => $blotter->user_id,
                'entry_number' => $blotter->entry_number,
                'respondent_family_name' => $respondentName[2],
                'respondent_first_name' => $respondentName[0],
                'respondent_middle_name' => $respondentName[1],
                'respondent_birth_date' => $respondentBirthDate->toDateString(),
                'respondent_place_of_birth' => 'Manila, Philippines',
                'respondent_citizenship' => $citizenshipOptions[array_rand($citizenshipOptions)],
                'respondent_gender' => $genderOptions[array_rand($genderOptions)],
                'respondent_civil_status' => $civilStatusOptions[array_rand($civilStatusOptions)],
                'respondent_occupation' => $occupationOptions[array_rand($occupationOptions)],
                'respondent_education' => $educationOptions[array_rand($educationOptions)],
                'respondent_email_address' => strtolower(str_replace(' ', '', $respondentName[0])) . '.' . strtolower(str_replace(' ', '', $respondentName[2])) . '@email.com',
                'respondent_street' => rand(100, 999) . ' ' . ['Side St', 'Cross St', 'Corner St', 'Inner St'][rand(0, 3)],
                'respondent_village' => 'Purok ' . rand(1, 8),
                'respondent_barangay' => $respondentBarangay,
                'respondent_city' => $respondentCity,
                'respondent_province' => $respondentProvince,
                'respondent_region' => $respondentRegion,
                'respondent_work_street' => rand(100, 999) . ' ' . ['Work Rd', 'Labor St', 'Factory Ave', 'Industrial Blvd'][rand(0, 3)],
                'respondent_work_village' => ['Industrial Area', 'Factory Zone', 'Work Complex', 'Labor District'][rand(0, 3)],
                'respondent_work_barangay' => $barangays[array_rand($barangays)],
                'respondent_work_city' => $cities[array_rand($cities)],
                'respondent_work_province' => $provinces[array_rand($provinces)],
                'respondent_work_region' => $regions[array_rand($regions)],
            ]);
        }

        $this->command->info('📊 Created ' . Blotter::count() . ' blotter reports');
        $this->command->info('👤 Created ' . Complainant::count() . ' complainant records');
        $this->command->info('👤 Created ' . Respondent::count() . ' respondent records');
        $this->command->info('✅ Normalized data seeding with string-based addresses completed!');
    }

    /**
     * Clear existing complainant and respondent data
     */
    private function clearExistingData(): void
    {
        $this->command->info('🧹 Clearing existing complainant and respondent data...');
        
        // Disable foreign key checks temporarily
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        
        // Clear the tables
        DB::table('complainants')->delete();
        DB::table('respondents')->delete();
        
        // Re-enable foreign key checks
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        
        $this->command->info('✅ Existing data cleared');
    }
}

<?php

namespace Database\Seeders;

use App\Models\Blotter;
use App\Models\Complainant;
use App\Models\Respondent;
use App\Models\User;
use App\Models\UserAddress;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class BlotterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $brgyName = array('Atabay', 'Badiang', 'Barangay 1 (Pob.)', 'Barangay 2 (Pob.)', 'Barangay 3 (Pob.)', 'Barangay 4 (Pob.)', 'Barangay 5 (Pob.)', 'Barangay 6 (Pob.)', 'Barangay 7 (Pob.)', 'Barangay 8 (Pob.)', 'Bariri', 'Bugarot (Catungan-Bugarot)', 'Cansadan (Cansadan-Tubudan)', 'Durog', 'Funda-Dalipe', 'Igbonglo', 'Inabasan', 'Madrangca', 'Magcalon', 'Malaiba', 'Maybato Norte', 'Maybato Sur', 'Mojon', 'Pantao', 'San Angel', 'San Fernando', 'San Pedro', 'Supa');

        $brgyCode = array('060613001', '060613002', '060613003', '060613004', '060613005', '060613006', '060613007', '060613008', '060613009', '060613010', '060613011', '060613014', '060613015', '060613016', '060613017', '060613018', '060613019', '060613020', '060613021', '060613022', '060613023', '060613024', '060613025', '060613026', '060613027', '060613028', '060613029', '060613030');

        // Seed 100 blotter entries
        $faker = Faker::create();


        for ($i = 0; $i <= count($brgyName); $i++) {
            $sanitizeBrgyName = str_replace(" ", "", $brgyName[$i]);

            User::create([
                'name' => $brgyName[$i],
                'email' => $sanitizeBrgyName . '_sanjose@gmail.com',
                'email_verified_at' => $faker->dateTime,
                'password' => 'P@ssw0rd',
                'role' => 2,
                'remember_token' => null,
            ]);


            UserAddress::create([
                'user_id' => $i + 1,
                'barangay_code' => intval($brgyCode[$i]),
                'city_code'  => 60613,
                'province_code' => 606,
                'region_code'  => 6,
            ]);

            for ($y = 1; $y <= 2400; $y++) {
                Blotter::create([
                    'user_id' => $i + 1,
                    'entry_number' => $y,
                    'barangay' => $sanitizeBrgyName,
                    'date_reported' => $faker->dateTime,
                    'time_of_report' => $faker->time,
                    'incident_type' => $faker->randomElement([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45]),
                    'narrative' => $faker->paragraph,
                    'remarks' => $faker->randomElement([1, 2, 3, 4, 5, 6]),
                    'complainant_signature' => null,
                    'recorded_by' => $faker->lastName,
                    'recorded_by_signature' => null,
                ]);

                $blotter = Blotter::where('user_id', $i + 1)->where('entry_number', $y)->first();

                Complainant::create([
                    'blotter_id' => $blotter->id,
                    'user_id' => $i + 1,
                    'entry_number' => $y,
                    'complainant_family_name' => $faker->lastName,
                    'complainant_first_name' => $faker->firstName,
                    'complainant_middle_name' => $faker->lastName,
                    'complainant_birth_date' => $faker->dateTime,
                    'complainant_place_of_birth' => $faker->city,
                    'complainant_citizenship' => $faker->randomElement([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]),
                    'complainant_gender' =>  $faker->randomElement([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]),
                    'complainant_civil_status' => $faker->randomElement([1, 2, 3, 4, 5, 6, 7]),
                    'complainant_occupation' =>   $faker->randomElement([
                        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63,
                    ]),
                    'complainant_education' => $faker->randomElement([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]),
                    'complainant_email_address' => $faker->email,
                    'complainant_street' => $faker->streetAddress,
                    'complainant_village' => $faker->streetName,
                    'complainant_barangay' => $faker->randomElement([60601001, 60601002, 60601003, 60601004, 60601005, 60601006, 60601007, 60601008, 60601009]),
                    'complainant_city' => $faker->randomElement([60601, 60602, 60603, 60604, 60605, 6606, 60607, 60608, 60609, 60610, 60611, 60612, 60613, 60614, 60615, 60616, 60617, 60618, 60619, 60620, 60621, 60622, 60623, 60624]),
                    'complainant_province' => 606,
                    'complainant_region' => 06,
                    'complainant_work_street' => $faker->streetAddress,
                    'complainant_work_village' => $faker->streetName,
                    'complainant_work_barangay' => $faker->randomElement([60601001, 60601002, 60601003, 60601004, 60601005, 60601006, 60601007, 60601008, 60601009]),
                    'complainant_work_city' => $faker->randomElement([60601, 60602, 60603, 60604, 60605, 6606, 60607, 60608, 60609, 60610, 60611, 60612, 60613, 60614, 60615, 60616, 60617, 60618, 60619, 60620, 60621, 60622, 60623, 60624]),
                    'complainant_work_province' => 606,
                    'complainant_work_region' => 06,
                ]);

                Respondent::create([
                    'blotter_id' => $blotter->id,
                    'user_id' => $i + 1,
                    'entry_number' => $y,
                    'respondent_family_name' => $faker->lastName,
                    'respondent_first_name' => $faker->firstName,
                    'respondent_middle_name' => $faker->lastName,
                    'respondent_birth_date' => $faker->dateTime,
                    'respondent_place_of_birth' => $faker->city,
                    'respondent_citizenship' => $faker->randomElement([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]),
                    'respondent_gender' =>  $faker->randomElement([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]),
                    'respondent_civil_status' => $faker->randomElement([1, 2, 3, 4, 5, 6, 7]),
                    'respondent_occupation' =>   $faker->randomElement([
                        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63,
                    ]),
                    'respondent_education' => $faker->randomElement([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]),
                    'respondent_email_address' => $faker->email,
                    'respondent_street' => $faker->streetAddress,
                    'respondent_village' => $faker->streetName,
                    'respondent_barangay' => $faker->randomElement([60601001, 60601002, 60601003, 60601004, 60601005, 60601006, 60601007, 60601008, 60601009]),
                    'respondent_city' => $faker->randomElement([60601, 60602, 60603, 60604, 60605, 6606, 60607, 60608, 60609, 60610, 60611, 60612, 60613, 60614, 60615, 60616, 60617, 60618, 60619, 60620, 60621, 60622, 60623, 60624]),
                    'respondent_province' => 606,
                    'respondent_region' => 06,
                    'respondent_work_street' => $faker->streetAddress,
                    'respondent_work_village' => $faker->streetName,
                    'respondent_work_barangay' => $faker->randomElement([60601001, 60601002, 60601003, 60601004, 60601005, 60601006, 60601007, 60601008, 60601009]),
                    'respondent_work_city' => $faker->randomElement([60601, 60602, 60603, 60604, 60605, 6606, 60607, 60608, 60609, 60610, 60611, 60612, 60613, 60614, 60615, 60616, 60617, 60618, 60619, 60620, 60621, 60622, 60623, 60624]),
                    'respondent_work_province' => 606,
                    'respondent_work_region' => 06,
                ]);
            }
        }
    }
}

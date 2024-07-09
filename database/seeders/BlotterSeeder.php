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
        // Seed 100 blotter entries
        $faker = Faker::create();

        for ($i = 1; $i <= 20; $i++) {
            User::create([
                'name' => $faker->firstName,
                'email' => $faker->email,
                'email_verified_at' => null,
                'password' => $faker->password,
                'role' => 2,
                'remember_token' => null,
            ]);

            UserAddress::create([
                'user_id' => $i,
                'barangay_code' => $faker->randomElement([1, 100000]),
                'city_code'  => $faker->randomElement([1, 100000]),
                'province_code' => $faker->randomElement([1, 100000]),
                'region_code'  => $faker->randomElement([1, 100000]),
            ]);

            for ($j = 1; $j <= 1000; $j++) {
                Blotter::create([
                    'user_id' => $i,
                    'entry_number' => $j,
                    'barangay' => $faker->city,
                    'date_reported' => $faker->dateTime,
                    'time_of_report' => $faker->time,
                    'incident_type' => $faker->randomElement([1, 45]),
                    'narrative' => $faker->paragraph,
                    'remarks' => $faker->randomElement(['Settled', 'Pending', 'In-Process']),
                    'complainant_signature' => $faker->filePath,
                    'recorded_by' => $faker->firstName . ' ' . $faker->lastName,
                    'recorded_by_signature' => $faker->filePath,
                ]);

                $iD = Blotter::orderBy('id', 'desc')
                    ->limit(1)
                    ->first();

                Complainant::create([
                    'blotter_id' => $iD->id,
                    'complainant_family_name' => $faker->lastName,
                    'complainant_first_name' => $faker->firstName,
                    'complainant_middle_name' => $faker->lastName,
                    'complainant_birth_date' => $faker->lastName,
                    'complainant_place_of_birth' => $faker->city,
                    'complainant_citizenship' => $faker->randomElement([1, 20]),
                    'complainant_gender' =>  $faker->randomElement([1, 15]),
                    'complainant_civil_status' => $faker->randomElement([1, 7]),
                    'complainant_occupation' =>   $faker->randomElement([1, 63]),
                    'complainant_education' => $faker->randomElement([1, 14]),
                    'complainant_email_address' => $faker->email,
                    'complainant_street' => $faker->streetAddress,
                    'complainant_village' => $faker->streetName,
                    'complainant_barangay' => $faker->randomElement([1, 100000]),
                    'complainant_city' => $faker->randomElement([1, 100000]),
                    'complainant_province' => $faker->randomElement([1, 100000]),
                    'complainant_region' => $faker->randomElement([1, 100000]),
                    'complainant_work_street' => $faker->randomElement([1, 100000]),
                    'complainant_work_village' => $faker->randomElement([1, 100000]),
                    'complainant_work_barangay' => $faker->randomElement([1, 100000]),
                    'complainant_work_city' => $faker->randomElement([1, 100000]),
                    'complainant_work_province' => $faker->randomElement([1, 100000]),
                    'complainant_work_region' => $faker->randomElement([1, 100000]),
                ]);

                Respondent::create([
                    'blotter_id' => $iD->id,
                    'respondent_family_name' => $faker->lastName,
                    'respondent_first_name' => $faker->firstName,
                    'respondent_middle_name' => $faker->lastName,
                    'respondent_birth_date' => $faker->lastName,
                    'respondent_place_of_birth' => $faker->city,
                    'respondent_citizenship' => $faker->randomElement([1, 20]),
                    'respondent_gender' =>  $faker->randomElement([1, 15]),
                    'respondent_civil_status' => $faker->randomElement([1, 7]),
                    'respondent_occupation' =>   $faker->randomElement([1, 63]),
                    'respondent_education' => $faker->randomElement([1, 14]),
                    'respondent_email_address' => $faker->email,
                    'respondent_street' => $faker->streetAddress,
                    'respondent_village' => $faker->streetName,
                    'respondent_barangay' => $faker->randomElement([1, 100000]),
                    'respondent_city' => $faker->randomElement([1, 100000]),
                    'respondent_province' => $faker->randomElement([1, 100000]),
                    'respondent_region' => $faker->randomElement([1, 100000]),
                    'respondent_work_street' => $faker->randomElement([1, 100000]),
                    'respondent_work_village' => $faker->randomElement([1, 100000]),
                    'respondent_work_barangay' => $faker->randomElement([1, 100000]),
                    'respondent_work_city' => $faker->randomElement([1, 100000]),
                    'respondent_work_province' => $faker->randomElement([1, 100000]),
                    'respondent_work_region' => $faker->randomElement([1, 100000]),
                ]);
            }
        }
    }
}

<?php

namespace Database\Seeders;

use App\Models\Complainant;
use App\Models\Respondent;
use App\Models\User;
use App\Models\UserAddress;
use App\Models\Blotter;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Model\Province;


class ComprehensiveDataSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('🌱 Starting comprehensive data seeding...');
        
        // Clear existing data to avoid conflicts
        $this->command->info('🧹 Clearing existing data...');
        Blotter::query()->delete();
        UserAddress::query()->delete();
        User::where('role', '>=', 2)->delete(); // Keep only super admin (role 1)
        
        // Create Provinces
        $provinces = $this->createProvinces();
        
        // Create Municipalities and Stations
        $municipalities = $this->createMunicipalities($provinces);
        $stations = $this->createStations($provinces);
        
        // Create Barangays
        $barangays = $this->createBarangays($municipalities, $stations);
        
        // Create Users
        $users = $this->createUsers($provinces, $municipalities, $stations, $barangays);
        
        // Create Address Records
        $this->createAddresses($users);
        
        // Create Blotter Data
        $this->createBlotters($barangays);
        
        $this->command->info('✅ Comprehensive data seeding completed!');
        $this->command->info('');
        $this->command->info('📊 Created Data Summary:');
        $this->command->info("   Provinces: " . count($provinces));
        $this->command->info("   Municipalities: " . count($municipalities));
        $this->command->info("   Stations: " . count($stations));
        $this->command->info("   Barangays: " . count($barangays));
        $this->command->info("   Users: " . count($users));
        $this->command->info("   Blotters: " . Blotter::count());
        
        $this->command->info('');
        $this->command->info('🔑 Login Credentials:');
        $this->command->info('   Station: station@station.gov.ph / station123');
        $this->command->info('   Municipality: municipality@municipality.gov.ph / municipality123');
        $this->command->info('   Province: province@province.gov.ph / province123');
        $this->command->info('   Barangay: barangay1@barangay.gov.ph / barangay123');
        $this->command->info('   (Additional barangays: barangay2@barangay.gov.ph, etc.)');
    }

    private function createProvinces(): array
    {
        $this->command->info('🏛️ Creating provinces...');
        
        // Only create Antique province administrator
        $province = User::create([
            'name' => 'Antique Provincial Administrator',
            'email' => 'antique@province.gov.ph',
            'password' => Hash::make('province123'),
            'role' => 2, // Province role
            'is_admin' => false,
            'province_id' => null,
            'municipality_id' => null,
            'station_id' => null,
            'lang' => null,
            'lat' => null,
            'avatar' => null,
            'banner' => null,
            'email_verified_at' => now(),
        ]);

        return ['VI' => $province];
    }

    private function createMunicipalities(array $provinces): array
    {
        $this->command->info('🏢 Creating municipalities...');
        
        $municipalityData = [
            'VI' => [
                ['San Jose', 'San Jose de Buenavista', 65345, 48.45],
                ['Sibalom', 'Sibalom', 60305, 126.15],
                ['Patnongon', 'Patnongon', 37776, 261.84],
                ['Bugasong', 'Bugasong', 29765, 301.23],
                ['Valderrama', 'Valderrama', 19461, 273.91],
                ['Laua-an', 'Laua-an', 25498, 363.42],
                ['Sebaste', 'Sebaste', 17894, 337.23],
                ['Tibiao', 'Tibiao', 28015, 109.65],
                ['Culasi', 'Culasi', 41319, 226.35],
                ['Pandan', 'Pandan', 34578, 119.89],
                ['Libertad', 'Libertad', 15854, 287.23],
                ['Belison', 'Belison', 5946, 48.55],
                ['San Remigio', 'San Remigio', 31621, 406.96],
                ['Barbaza', 'Barbaza', 25259, 396.45],
                ['Hamtic', 'Hamtic', 54123, 112.84],
                [' Tobias Fornier', 'Tobias Fornier', 33816, 185.01],
                ['Caluya', 'Caluya', 30223, 80.24]
            ]
        ];

        $municipalities = [];
        foreach ($municipalityData as $provinceCode => $cities) {
            foreach ($cities as $index => $cityData) {
                $municipality = User::create([
                    'name' => $cityData[0] . ' Municipal Administrator',
                    'email' => strtolower(str_replace([' ', "'"], '', $cityData[0])) . ($index + 1) . '@municipality.gov.ph',
                    'password' => Hash::make('municipality123'),
                    'role' => 3, // Municipality role
                    'is_admin' => false,
                    'province_id' => $provinces[$provinceCode]->id,
                    'municipality_id' => null,
                    'station_id' => null,
                    'lang' => null,
                    'lat' => null,
                    'avatar' => null,
                    'banner' => null,
                    'email_verified_at' => now(),
                ]);
                $municipalities[] = $municipality;
            }
        }

        return $municipalities;
    }

    private function createStations(array $provinces): array
    {
        $this->command->info('🚔 Creating police stations...');
        
        $stationData = [
            'VI' => [
                ['Antique Provincial Police Office', 'San Jose', 'APPO'],
                ['San Jose Police Station', 'San Jose', 'SJPS'],
                ['Sibalom Police Station', 'Sibalom', 'SPS'],
                ['Patnongon Police Station', 'Patnongon', 'PPS'],
                ['Bugasong Police Station', 'Bugasong', 'BPS'],
                ['Valderrama Police Station', 'Valderrama', 'VPS'],
                ['Laua-an Police Station', 'Laua-an', 'LPS'],
                ['Sebaste Police Station', 'Sebaste', 'SPS'],
                ['Tibiao Police Station', 'Tibiao', 'TPS'],
                ['Culasi Police Station', 'Culasi', 'CPS'],
                ['Pandan Police Station', 'Pandan', 'PAPS'],
                ['Libertad Police Station', 'Libertad', 'LIPS'],
                ['Belison Police Station', 'Belison', 'BPS'],
                ['San Remigio Police Station', 'San Remigio', 'SRPS'],
                ['Barbaza Police Station', 'Barbaza', 'BPS'],
                ['Hamtic Police Station', 'Hamtic', 'HPS'],
                ['Tobias Fornier Police Station', 'Tobias Fornier', 'TFPS'],
                ['Caluya Police Station', 'Caluya', 'CPS']
            ]
        ];

        $stations = [];
        foreach ($stationData as $provinceCode => $stationList) {
            foreach ($stationList as $index => $stationInfo) {
                $station = User::create([
                    'name' => $stationInfo[0],
                    'email' => strtolower(str_replace([' ', "'"], '', $stationInfo[0])) . ($index + 1) . '@station.gov.ph',
                    'password' => Hash::make('station123'),
                    'role' => 4, // Station role
                    'is_admin' => false,
                    'province_id' => $provinces[$provinceCode]->id,
                    'municipality_id' => null,
                    'station_id' => null, // Will be set after creation
                    'lang' => null,
                    'lat' => null,
                    'avatar' => null,
                    'banner' => null,
                    'email_verified_at' => now(),
                ]);
                
                // Set station_id to self-reference for proper jurisdiction
                $station->station_id = $station->id;
                $station->save();
                
                $stations[] = $station;
            }
        }

        return $stations;
    }

    private function createBarangays(array $municipalities, array $stations): array
    {
        $this->command->info('🏘️ Creating barangays...');
        
        $barangayData = [
            'San Jose' => [
                ['San Jose North', 'San Jose North District'],
                ['San Jose South', 'San Jose South District'],
                ['San Jose East', 'San Jose East District'],
                ['San Jose West', 'San Jose West District'],
                ['Poblacion', 'Poblacion San Jose'],
                ['Malaiba', 'Malaiba'],
                ['Maybato', 'Maybato'],
                ['San Pedro', 'San Pedro']
            ],
            'Sibalom' => [
                ['Sibalom Proper', 'Sibalom Proper'],
                ['Bato', 'Bato'],
                ['Catmon', 'Catmon'],
                ['Igpalge', 'Igpalge'],
                ['La Union', 'La Union'],
                ['Mali-ao', 'Mali-ao'],
                ['Narujo', 'Narujo'],
                ['Villavert', 'Villavert']
            ],
            'Patnongon' => [
                ['Patnongon Proper', 'Patnongon Proper'],
                ['Amdus', 'Amdus'],
                ['Auring', 'Auring'],
                ['Culasi', 'Culasi'],
                ['Ilaures', 'Ilaures'],
                ['Mali', 'Mali'],
                ['Napo', 'Napo'],
                ['Pangpang', 'Pangpang']
            ],
            'Bugasong' => [
                ['Bugasong Proper', 'Bugasong Proper'],
                ['Bagtac', 'Bagtac'],
                ['Cubay', 'Cubay'],
                ['Igbalangao', 'Igbalangao'],
                ['Jinalinan', 'Jinalinan'],
                ['Marirong', 'Marirong'],
                ['Palanas', 'Palanas'],
                ['Tigbawan', 'Tigbawan']
            ],
            'Culasi' => [
                ['Culasi Proper', 'Culasi Proper'],
                ['Bacong', 'Bacong'],
                ['Baga', 'Baga'],
                ['Balading', 'Balading'],
                ['Bato', 'Bato'],
                ['Camalig', 'Camalig'],
                ['Fe', 'Fe'],
                ['Flores', 'Flores']
            ],
            'Pandan' => [
                ['Pandan Proper', 'Pandan Proper'],
                ['Bagumbayan', 'Bagumbayan'],
                ['Bayang', 'Bayang'],
                ['Caguyuman', 'Caguyuman'],
                ['Culasi', 'Culasi'],
                ['Duyong', 'Duyong'],
                ['Giangan', 'Giangan'],
                ['Maasi', 'Maasi']
            ]
        ];

        $barangays = [];
        $globalIndex = 1;
        $stationIndex = 0;
        
        foreach ($barangayData as $municipalityName => $barangayList) {
            // Assign barangays to appropriate station based on municipality
            $assignedStation = $this->getStationForMunicipality($municipalityName, $stations);
            
            // Get the municipality for this barangay
            $assignedMunicipality = $this->getMunicipalityForName($municipalityName, $municipalities);
            
            foreach ($barangayList as $barangayInfo) {
                $barangayName = $barangayInfo[1];
                $barangayEmail = strtolower(str_replace([' ', '-'], '', $barangayName)) . $globalIndex . '@barangay.gov.ph';
                $barangayPassword = strtolower(str_replace([' ', '-'], '', $barangayName));
                
                $barangay = User::create([
                    'name' => $barangayName . ' Barangay Captain',
                    'email' => $barangayEmail,
                    'password' => Hash::make($barangayPassword),
                    'role' => 5, // Barangay role
                    'is_admin' => false,
                    'province_id' => $assignedStation->province_id,
                    'municipality_id' => $assignedMunicipality->id, // Properly assign municipality
                    'station_id' => $assignedStation->id,
                    'lang' => null,
                    'lat' => null,
                    'avatar' => null,
                    'banner' => null,
                    'email_verified_at' => now(),
                ]);
                $barangays[] = $barangay;
                $globalIndex++;
            }
        }

        return $barangays;
    }

    /**
     * Get the appropriate station for a municipality
     */
    private function getStationForMunicipality(string $municipalityName, array $stations): User
    {
        $stationMapping = [
            'San Jose' => 'San Jose Police Station',
            'Sibalom' => 'Sibalom Police Station',
            'Patnongon' => 'Patnongon Police Station',
            'Bugasong' => 'Bugasong Police Station',
            'Culasi' => 'Culasi Police Station',
            'Pandan' => 'Pandan Police Station'
        ];

        $stationName = $stationMapping[$municipalityName] ?? 'Antique Provincial Police Office';
        
        $station = collect($stations)->firstWhere('name', $stationName);
        
        return $station ?: $stations[0]; // Fallback to first station
    }

    /**
     * Get the appropriate municipality for a name
     */
    private function getMunicipalityForName(string $municipalityName, array $municipalities): User
    {
        $municipalityRecord = collect($municipalities)->first(function ($municipal) use ($municipalityName) {
            $cleanName = str_replace(' Municipal Administrator', '', $municipal->name);
            return $cleanName === $municipalityName;
        });
        
        return $municipalityRecord ?: $municipalities[0]; // Fallback to first municipality
    }

    private function createUsers(array $provinces, array $municipalities, array $stations, array $barangays): array
    {
        $this->command->info('👥 Creating additional users...');
        
        // Create additional barangay users for more data
        $additionalBarangays = [];
        $startFrom = count($barangays) + 1;
        for ($i = $startFrom; $i <= $startFrom + 19; $i++) {
            $barangay = User::create([
                'name' => 'Barangay Captain ' . chr(64 + ($i - $startFrom + 1)),
                'email' => 'barangay' . $i . '@barangay.gov.ph',
                'password' => Hash::make('barangay123'),
                'role' => 5,
                'is_admin' => false,
                'province_id' => $barangays[0]->province_id,
                'municipality_id' => $barangays[0]->municipality_id,
                'station_id' => $barangays[0]->station_id,
                'lang' => null,
                'lat' => null,
                'avatar' => null,
                'banner' => null,
                'email_verified_at' => now(),
            ]);
            $additionalBarangays[] = $barangay;
        }

        return array_merge($barangays, $additionalBarangays);
    }

    private function createAddresses(array $users): void
    {
        $this->command->info('📍 Creating address records...');
        
        foreach ($users as $index => $user) {
            UserAddress::create([
                'user_id' => $user->id,
                'barangay_code' => 1000000 + $index + 1,
                'city_code' => 1000 + ($user->municipality_id ?? 1),
                'province_code' => 1,
                'region_code' => 1,
            ]);
        }
    }

    private function createBlotters(array $barangays): void
    {
        $this->command->info('📋 Creating blotter reports...');
        
        $incidentTypes = [
            'Theft', 'Robbery', 'Physical Injury', 'Homicide', 'Rape',
            'Estafa', 'Swindling', 'Malversation', 'Alarms and Scandals',
            'Other Threats', 'Violation of Special Laws', 'Illegal Gambling',
            'Vagrancy and Mendicancy', 'Prostitution and White Slavery',
            'Disorderly Conduct', 'Use of Illegal Drugs', 'Illegal Possession of Firearms'
        ];

        $remarks = [
            'Pending - Under investigation',
            'Resolved - No charges filed',
            'Settled amicably',
            'Referred to higher authority',
            'Under legal review',
            'Awaiting court appearance',
            'Closed - Case dismissed',
            'Other'
        ];

        // Sample names for complainants and respondents
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
            ['Isabella', 'Mendoza', 'Paredes']
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
            ['Valentina', 'Reyes', 'Martinez']
        ];

        foreach ($barangays as $index => $barangay) {
            // Create 5-10 blotter reports per barangay
            $blotterCount = rand(5, 10);
            
            for ($i = 0; $i < $blotterCount; $i++) {
                $entryNumber = str_pad(($index * 100 + $i + 1), 6, '0', STR_PAD_LEFT);
                
                // Random date within last 3 months
                $dateReported = now()->subDays(rand(0, 90));
                $dateOfIncident = $dateReported->copy()->subDays(rand(0, 7));
                
                // Create the blotter record
                $blotter = Blotter::create([
                    'user_id' => $barangay->id,
                    'entry_number' => $entryNumber,
                    'barangay' => $barangay->name,
                    'date_reported' => $dateReported->toDateString(),
                    'time_of_report' => $dateReported->toTimeString(),
                    'date_of_incident' => $dateOfIncident->toDateString(),
                    'time_of_incident' => $dateOfIncident->toTimeString(),
                    'incident_type' => $incidentTypes[array_rand($incidentTypes)],
                    'narrative' => $this->generateNarrative($incidentTypes[array_rand($incidentTypes)]),
                    'remarks' => $remarks[array_rand($remarks)],
                    'complainant_signature' => 'Digital Signature',
                    'recorded_by' => $barangay->name,
                    'recorded_by_signature' => 'Digital Signature',
                    'uploaded_file' => null,
                    'created_at' => $dateReported,
                    'updated_at' => $dateReported,
                ]);

                // Create complainant record
                $complainantName = $complainantNames[array_rand($complainantNames)];
                $complainantBirthDate = now()->subYears(rand(18, 65))->subDays(rand(0, 365));
                
                Complainant::create([
                    'blotter_id' => $blotter->id,
                    'user_id' => $barangay->id,
                    'entry_number' => $entryNumber,
                    'complainant_family_name' => $complainantName[2],
                    'complainant_first_name' => $complainantName[0],
                    'complainant_middle_name' => $complainantName[1],
                    'complainant_birth_date' => $complainantBirthDate->toDateString(),
                    'complainant_place_of_birth' => 'Manila',
                    'complainant_citizenship' => 1, // 1 = Filipino
                    'complainant_gender' => rand(0, 1), // 0 = Male, 1 = Female
                    'complainant_civil_status' => rand(1, 3), // 1 = Single, 2 = Married, 3 = Widowed
                    'complainant_occupation' => rand(1, 4), // 1 = Employee, 2 = Business Owner, 3 = Student, 4 = Retired
                    'complainant_education' => rand(1, 3), // 1 = High School, 2 = College, 3 = Postgraduate
                    'complainant_email_address' => strtolower(str_replace(' ', '', $complainantName[0])) . '.' . strtolower(str_replace(' ', '', $complainantName[2])) . '@email.com',
                    'complainant_street' => rand(100, 999) . ' Main St',
                    'complainant_village' => 'Purok ' . rand(1, 8),
                    'complainant_barangay' => $index + 1,
                    'complainant_city' => $index + 1,
                    'complainant_province' => $index + 1,
                    'complainant_region' => $index + 1,
                    'complainant_work_street' => rand(100, 999) . ' Business Ave',
                    'complainant_work_village' => 'Business District',
                    'complainant_work_barangay' => $index + 1,
                    'complainant_work_city' => $index + 1,
                    'complainant_work_province' => $index + 1,
                    'complainant_work_region' => $index + 1,
                ]);

                // Create respondent record
                $respondentName = $respondentNames[array_rand($respondentNames)];
                $respondentBirthDate = now()->subYears(rand(18, 65))->subDays(rand(0, 365));
                
                Respondent::create([
                    'blotter_id' => $blotter->id,
                    'user_id' => $barangay->id,
                    'entry_number' => $entryNumber,
                    'respondent_family_name' => $respondentName[2],
                    'respondent_first_name' => $respondentName[0],
                    'respondent_middle_name' => $respondentName[1],
                    'respondent_birth_date' => $respondentBirthDate->toDateString(),
                    'respondent_place_of_birth' => 'Manila',
                    'respondent_citizenship' => 1, // 1 = Filipino
                    'respondent_gender' => rand(0, 1), // 0 = Male, 1 = Female
                    'respondent_civil_status' => rand(1, 3), // 1 = Single, 2 = Married, 3 = Widowed
                    'respondent_occupation' => rand(1, 4), // 1 = Employee, 2 = Business Owner, 3 = Student, 4 = Unemployed
                    'respondent_education' => rand(1, 3), // 1 = High School, 2 = College, 3 = Postgraduate
                    'respondent_email_address' => strtolower(str_replace(' ', '', $respondentName[0])) . '.' . strtolower(str_replace(' ', '', $respondentName[2])) . '@email.com',
                    'respondent_street' => rand(100, 999) . ' Side St',
                    'respondent_village' => 'Purok ' . rand(1, 8),
                    'respondent_barangay' => $index + 1,
                    'respondent_city' => $index + 1,
                    'respondent_province' => $index + 1,
                    'respondent_region' => $index + 1,
                    'respondent_work_street' => rand(100, 999) . ' Work Rd',
                    'respondent_work_village' => 'Industrial Area',
                    'respondent_work_barangay' => $index + 1,
                    'respondent_work_city' => $index + 1,
                    'respondent_work_province' => $index + 1,
                    'respondent_work_region' => $index + 1,
                ]);
            }
        }

        $this->command->info('📊 Created ' . Blotter::count() . ' blotter reports');
        $this->command->info('👤 Created ' . Complainant::count() . ' complainant records');
        $this->command->info('👤 Created ' . Respondent::count() . ' respondent records');
    }

    private function generateNarrative(string $incidentType): string
    {
        $narratives = [
            'Theft' => [
                'Unknown person(s) stole personal belongings from the victim while they were distracted.',
                'Victim reported that their wallet was stolen while shopping at the market.',
                'Unknown perpetrator entered the victim\'s residence and stole valuable items.',
                'Bicycle theft reported near the barangay hall. Victim was away for only a few minutes.'
            ],
            'Robbery' => [
                'Victim was confronted by armed individuals who demanded cash and valuables.',
                'Robbery incident occurred at the commercial establishment. Suspects fled with stolen items.',
                'Victim was walking home when approached by suspects who threatened them with weapons.',
                'Store robbery reported. Suspects took cash and merchandise from the establishment.'
            ],
            'Physical Injury' => [
                'Victim sustained injuries during a physical altercation with unknown individuals.',
                'Physical injury resulting from a domestic dispute between family members.',
                'Victim was injured during a fight at a local establishment.',
                'Physical injury reported from a vehicular accident along the main road.'
            ],
            'Homicide' => [
                'Victim was found dead with apparent gunshot wounds. Investigation ongoing.',
                'Homicide investigation underway. Victim was discovered at their residence.',
                'Fatal shooting incident reported. Police are investigating the circumstances.',
                'Victim was declared dead at the scene. Investigation continuing.'
            ],
            'Rape' => [
                'Victim reported sexual assault by unknown perpetrator. Investigation ongoing.',
                'Sexual assault case reported. Victim is receiving medical and legal assistance.',
                'Victim was attacked while walking alone at night. Police are investigating.',
                'Sexual violence incident reported. Victim is under protective custody.'
            ],
            'Estafa' => [
                'Victim was deceived into giving money through false promises and misrepresentation.',
                'Online scam reported. Victim lost money to fraudulent investment scheme.',
                'Victim was tricked into paying for non-existent services or products.',
                'Fraudulent transaction reported. Victim was deceived by false documents.'
            ],
            'Swindling' => [
                'Victim was defrauded through deceptive business practices.',
                'Investment scam reported. Victim lost money to fraudulent scheme.',
                'Victim was misled into paying for fake services.',
                'Commercial fraud reported. Victim was deceived by false promises.'
            ],
            'Malversation' => [
                'Public official accused of misappropriating government funds.',
                'Government employee reported for misuse of public funds.',
                'Financial misconduct reported involving public resources.',
                'Misappropriation of government funds under investigation.'
            ],
            'Alarms and Scandals' => [
                'Person caused public disturbance through loud and scandalous behavior.',
                'Public nuisance reported due to disruptive behavior.',
                'Individual created disturbance in public area causing alarm.',
                'Scandalous conduct reported in public place.'
            ],
            'Other Threats' => [
                'Victim received threats from unknown individuals.',
                'Harassment and intimidation reported.',
                'Threatening messages sent to victim.',
                'Verbal threats reported during dispute.'
            ],
            'Violation of Special Laws' => [
                'Violation of special laws reported. Case under investigation.',
                'Special law violation involving regulated activities.',
                'Legal violation of specific statutes reported.',
                'Regulatory compliance issue under investigation.'
            ],
            'Illegal Gambling' => [
                'Illegal gambling operation discovered in the area.',
                'Unauthorized betting activities reported.',
                'Gambling den raided by authorities.',
                'Illegal card games and betting activities reported.'
            ],
            'Vagrancy and Mendicancy' => [
                'Vagrancy reported in public area.',
                'Individuals found loitering without visible means of support.',
                'Mendicancy reported in commercial district.',
                'Public nuisance due to vagrancy activities.'
            ],
            'Prostitution and White Slavery' => [
                'Prostitution activities reported in the area.',
                'Human trafficking investigation underway.',
                'Illegal prostitution operation discovered.',
                'White slavery case under investigation.'
            ],
            'Disorderly Conduct' => [
                'Disorderly conduct reported in public place.',
                'Public disturbance due to unruly behavior.',
                'Individual causing disturbance in commercial area.',
                'Public nuisance due to disorderly activities.'
            ],
            'Use of Illegal Drugs' => [
                'Illegal drug use reported in the area.',
                'Drug possession case under investigation.',
                'Narcotics violation reported.',
                'Illegal substance use discovered during routine check.'
            ],
            'Illegal Possession of Firearms' => [
                'Unauthorized firearm possession reported.',
                'Illegal weapons discovered during search.',
                'Firearms violation under investigation.',
                'Unlicensed gun possession case filed.'
            ]
        ];

        return $narratives[$incidentType][array_rand($narratives[$incidentType])] ?? 'Incident reported and under investigation.';
    }
}

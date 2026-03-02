<?php

namespace App\Repositories;

use App\Models\Complainant;
use App\Models\UserAddress;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class BarangayRepository
{
    /**
     * Get all provinces
     * @param int $cityCode ID of the City / Municipality
     * @return array arrays of barangay in the city
     */
    public function get(Int $cityCode)
    {
        $remarks = [1, 2, 3, 4, 5];

        $query =  DB::table('user_addresses')
            ->leftJoin('blotters', 'user_addresses.user_id', '=', 'blotters.user_id')
            ->select('user_addresses.user_id', 'user_addresses.barangay_code', 'user_addresses.city_code', 'blotters.remarks', DB::raw('count(blotters.id) as count'));

        if ($cityCode > 0) {
            $query  = $query->where('user_addresses.city_code', $cityCode);
        }

        return $query->groupBy('user_addresses.user_id', 'user_addresses.barangay_code', 'user_addresses.city_code', 'blotters.remarks')
            ->get()
            ->groupBy('barangay_code')
            ->map(function ($barangayGroup)  use ($remarks) {
                // Initialize the remarks counts with 0
                $remarkCounts = array_fill_keys($remarks, 0);

                // Aggregate counts for remarks greater than 5
                $additionalCount = 0;

                foreach ($barangayGroup as $item) {
                    if ($item->remarks <= 5) {
                        $remarkCounts[$item->remarks] = $item->count;
                    } else {
                        $additionalCount += $item->count;
                    }
                }

                // Add the additional counts to remark 5
                $remarkCounts[5] += $additionalCount;

                // Calculate the total count for the barangay
                $totalCount = $barangayGroup->sum('count');

                return [
                    'user_id' => $barangayGroup->first()->user_id,
                    'barangay_code' => $barangayGroup->first()->barangay_code,
                    'city_code' => $barangayGroup->first()->city_code,
                    'total' => $totalCount,
                    'blotters' => array_map(function ($remarks) use ($remarkCounts) {
                        return [
                            'remark' => $remarks,
                            'count' => $remarkCounts[$remarks]
                        ];
                    }, $remarks)
                ];
            })->values()
            ->toArray();
    }


    /**
     * Get all cities in city
     * @param int $cityId ID of the city where cities need to fetch
     * @return array Collection of the cities within given city
     */
    public function getBarangays(Int $cityId)
    {
        return DB::table('user_addresses')
            ->leftJoin('blotters', 'user_addresses.user_id', '=', 'blotters.user_id')
            ->select(
                'user_addresses.user_id',
                'user_addresses.barangay_code',
                'user_addresses.city_code',
                'user_addresses.province_code',
                DB::raw('COUNT(blotters.id) as blotters_count')
            )
            ->where('user_addresses.city_code', $cityId)
            ->groupBy(
                'user_addresses.user_id',
                'user_addresses.barangay_code',
                'user_addresses.city_code',
                'user_addresses.province_code'
            )
            ->get()
            ->map(function ($item) {
                return [
                    'userId' => $item->user_id,
                    'barangayCode' => $item->barangay_code,
                    'cityCode' => $item->city_code,
                    'provinceCode' => $item->province_code,
                    'noOfBlotters' => $item->blotters_count,
                ];
            })
            ->toArray();
    }

    /**
     * Get all barangays
     * @param string|null $search Search term
     * @param string|null $province Province filter
     * @param string|null $city City filter
     * @return array All barangays
     */
    public function getAll($search = null, $province = null, $city = null)
    {
        $query = DB::table('user_addresses')
            ->join('users', 'user_addresses.user_id', '=', 'users.id')
            ->select(
                'users.id as user_id',
                'user_addresses.id',
                'users.name as brgy_name',
                'user_addresses.barangay_code',
                'user_addresses.city_code',
                'user_addresses.province_code',
                'user_addresses.region_code'
            )
            ->where('users.role', 5); // Only barangay users

        // Apply search filter if provided
        if ($search) {
            $searchTerm = '%' . $search . '%';
            $query->where(function ($q) use ($searchTerm) {
                $q->where('users.name', 'like', $searchTerm)
                    ->orWhere('user_addresses.barangay_code', 'like', $searchTerm)
                    ->orWhere('user_addresses.city_code', 'like', $searchTerm)
                    ->orWhere('user_addresses.province_code', 'like', $searchTerm)
                    // Search in city names by joining with cities data
                    ->orWhereExists(function ($subQuery) use ($searchTerm) {
                        $subQuery->select(DB::raw(1))
                            ->from('cities')
                            ->whereRaw('cities.city_code = user_addresses.city_code')
                            ->where('cities.city_name', 'like', $searchTerm);
                    })
                    // Search in province names by joining with provinces data
                    ->orWhereExists(function ($subQuery) use ($searchTerm) {
                        $subQuery->select(DB::raw(1))
                            ->from('provinces')
                            ->whereRaw('provinces.province_code = user_addresses.province_code')
                            ->where('provinces.province_name', 'like', $searchTerm);
                    });
            });
        }

        // Apply province filter if provided
        if ($province) {
            $query->where('user_addresses.province_code', $province);
        }

        // Apply city filter if provided
        if ($city) {
            $query->where('user_addresses.city_code', $city);
        }

        return $query->distinct()
            ->orderBy('users.name', 'asc')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'user_id' => $item->user_id,
                    'brgy_name' => $item->brgy_name,
                    'brgy_code' => $item->barangay_code,
                    'city_code' => $item->city_code,
                    'province_code' => $item->province_code,
                    'region_code' => $item->region_code,
                ];
            })
            ->toArray();
    }

    /**
     * Create new barangay
     * @param array $data Barangay data
     * @return array Created barangay data
     */
    public function create(array $data)
    {
        // Start a transaction to ensure data integrity
        return DB::transaction(function () use ($data) {
            // Create the user for the barangay
            $userId = DB::table('users')->insertGetId([
                'name' => $data['brgy_name'],
                'email' => $data['email'] ?? null,
                'password' => isset($data['password']) ? Hash::make($data['password']) : null,
                'role' => 5, // Role for barangay
                'lang' => $data['lang'] ?? null,
                'lat' => $data['lat'] ?? null,
                'avatar' => $data['avatar'] ?? null,
                'banner' => $data['banner'] ?? null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Create the user address for the barangay
            $addressId = DB::table('user_addresses')->insertGetId([
                'user_id' => $userId,
                'barangay_code' => (int) $data['brgy_code'],
                'city_code' => (int) $data['city_code'],
                'province_code' => (int) $data['province_code'],
                'region_code' => (int) $data['region_code'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            return [
                'user_id' => $userId,
                'address_id' => $addressId
            ];
        });
    }

    /**
     * Find barangay by ID
     * @param int $id Barangay ID
     * @return Model|null Found barangay
     */
    public function findById(int $id)
    {
        return DB::table('user_addresses')
            ->where('id', $id)
            ->first();
    }

    /**
     * Update barangay
     * @param int $id Barangay ID
     * @param array $data Updated data
     * @return int Number of affected rows
     */
    public function update(int $id, array $data)
    {
        // Get the current barangay to get user_id
        $currentBarangay = $this->findById($id);
        if (!$currentBarangay) {
            return 0;
        }

        // Update user_addresses table
        $addressData = [
            'barangay_code' => (int) $data['brgy_code'],
            'city_code' => (int) $data['city_code'],
            'province_code' => (int) $data['province_code'],
            'region_code' => (int) $data['region_code'],
            'updated_at' => now(),
        ];

        DB::table('user_addresses')
            ->where('id', $id)
            ->update($addressData);

        // Prepare user data
        $userData = [
            'name' => $data['brgy_name'],
            'updated_at' => now(),
        ];

        // Add optional fields if provided
        if (isset($data['email']) && $data['email']) {
            $userData['email'] = $data['email'];
        }

        if (isset($data['password']) && $data['password']) {
            $userData['password'] = Hash::make($data['password']);
        }

        if (isset($data['lang'])) {
            $userData['lang'] = $data['lang'];
        }

        if (isset($data['lat'])) {
            $userData['lat'] = $data['lat'];
        }

        if (isset($data['avatar'])) {
            $userData['avatar'] = $data['avatar'];
        }

        if (isset($data['banner'])) {
            $userData['banner'] = $data['banner'];
        }

        // Update users table
        return DB::table('users')
            ->where('id', $currentBarangay->user_id)
            ->update($userData);
    }

    /**
     * Delete barangay
     * @param int $id Barangay ID
     * @return int Number of affected rows
     */
    public function delete(int $id)
    {
        return DB::table('user_addresses')
            ->where('id', $id)
            ->delete();
    }
}

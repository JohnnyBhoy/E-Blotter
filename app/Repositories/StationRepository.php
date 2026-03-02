<?php

namespace App\Repositories;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class StationRepository
{
    /**
     * Get all stations
     * @param string|null $search Search term
     * @param string|null $province Province filter
     * @param string|null $city City filter
     * @return array All stations
     */
    public function getAll($search = null, $province = null, $city = null)
    {
        $query = DB::table('user_addresses')
            ->join('users', 'user_addresses.user_id', '=', 'users.id')
            ->select(
                'users.id as user_id',
                'user_addresses.id',
                'users.name as station_name',
                'user_addresses.barangay_code',
                'user_addresses.city_code',
                'user_addresses.province_code',
                'user_addresses.region_code'
            )
            ->where('users.role', 4); // Station users

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
                    'station_name' => $item->station_name,
                    'barangay_code' => $item->barangay_code,
                    'city_code' => $item->city_code,
                    'province_code' => $item->province_code,
                    'region_code' => $item->region_code,
                ];
            })
            ->toArray();
    }

    /**
     * Create new station
     * @param array $data Station data
     * @return array Created station data
     */
    public function create(array $data)
    {
        // Create user for station
        $userData = [
            'name' => $data['station_name'],  // Use station_name as user name
            'email' => $data['email'] ?? null,
            'password' => $data['password'] ? Hash::make($data['password']) : Hash::make('station123'),
            'role' => 4, // Station role
            'is_admin' => 0,
            'lang' => $data['lang'] ?? null,
            'lat' => $data['lat'] ?? null,
            'avatar' => $data['avatar'] ?? null,
            'banner' => $data['banner'] ?? null,
        ];

        $user = DB::table('users')->insertGetId($userData);

        // Create user address for station
        $addressData = [
            'user_id' => $user,
            'barangay_code' => $data['barangay_code'],
            'city_code' => $data['city_code'],
            'province_code' => $data['province_code'],
            'region_code' => $data['region_code'],
        ];

        $address = DB::table('user_addresses')->insert($addressData);

        return [
            'user_id' => $user,
            'station_name' => $data['station_name'],
            'barangay_code' => $data['barangay_code'],
            'city_code' => $data['city_code'],
            'province_code' => $data['province_code'],
            'region_code' => $data['region_code'],
        ];
    }

    /**
     * Find station by ID
     * @param int $id Station ID
     * @return array|null Found station
     */
    public function findById(int $id)
    {
        $station = DB::table('user_addresses')
            ->join('users', 'user_addresses.user_id', '=', 'users.id')
            ->select(
                'users.id as user_id',
                'user_addresses.id',
                'users.name as station_name',
                'users.email',
                'users.lang',
                'users.lat',
                'users.avatar',
                'users.banner',
                'user_addresses.barangay_code',
                'user_addresses.city_code',
                'user_addresses.province_code',
                'user_addresses.region_code'
            )
            ->where('users.role', 4) // Station users
            ->where('user_addresses.id', $id)
            ->first();

        if (!$station) {
            return null;
        }

        return [
            'id' => $station->id,
            'user_id' => $station->user_id,
            'station_name' => $station->station_name,
            'barangay_code' => $station->barangay_code,
            'city_code' => $station->city_code,
            'province_code' => $station->province_code,
            'region_code' => $station->region_code,
            'email' => $station->email,
            'lang' => $station->lang,
            'lat' => $station->lat,
            'avatar' => $station->avatar,
            'banner' => $station->banner,
        ];
    }

    /**
     * Update station
     * @param int $id Station ID
     * @param array $data Updated data
     * @return array Updated station
     */
    public function update(int $id, array $data)
    {
        // Find the station
        $station = $this->findById($id);
        if (!$station) {
            throw new \Exception('Station not found');
        }

        // Update user data
        $userData = [
            'name' => $data['station_name'] ?? $station['station_name'],
            'email' => $data['email'] ?? $station['email'],
            'lang' => $data['lang'] ?? $station['lang'],
            'lat' => $data['lat'] ?? $station['lat'],
            'avatar' => $data['avatar'] ?? $station['avatar'],
            'banner' => $data['banner'] ?? $station['banner'],
        ];

        // Update password if provided
        if (!empty($data['password'])) {
            $userData['password'] = Hash::make($data['password']);
        }

        DB::table('users')
            ->where('id', $station['user_id'])
            ->update($userData);

        // Update address data if provided
        $addressData = [];
        if (isset($data['station_code'])) {
            $addressData['barangay_code'] = $data['station_code'];
        }
        if (isset($data['city_code'])) {
            $addressData['city_code'] = $data['city_code'];
        }
        if (isset($data['province_code'])) {
            $addressData['province_code'] = $data['province_code'];
        }
        if (isset($data['region_code'])) {
            $addressData['region_code'] = $data['region_code'];
        }

        if (!empty($addressData)) {
            DB::table('user_addresses')
                ->where('id', $id)
                ->update($addressData);
        }

        return $this->findById($id);
    }

    /**
     * Delete station
     * @param int $id Station ID
     * @return bool Success status
     */
    public function delete(int $id)
    {
        // Find the station
        $station = $this->findById($id);
        if (!$station) {
            return false;
        }

        // Delete user address
        DB::table('user_addresses')
            ->where('id', $id)
            ->delete();

        // Delete user
        DB::table('users')
            ->where('id', $station['user_id'])
            ->delete();

        return true;
    }
}

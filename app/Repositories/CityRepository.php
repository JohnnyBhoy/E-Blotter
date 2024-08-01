<?php

namespace App\Repositories;

use App\Models\Complainant;
use App\Models\UserAddress;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class CityRepository
{
    /**
     * Get all cities
     */
    public function get()
    {
        return UserAddress::selectRaw('DISTINCT city_code, province_code')
            ->get()
            ->toArray();
    }

    /**
     * Get all cities in Province
     * @param int $provinceId ID of the province where cities need to fetch
     * @return array Collection of the cities within given province
     */
    public function getCities(Int $provinceId)
    {
        return DB::table('user_addresses')
            ->leftJoin('blotters', 'user_addresses.user_id', '=', 'blotters.user_id')
            ->select(
                'user_addresses.city_code',
                'user_addresses.province_code',
                DB::raw('COUNT(DISTINCT user_addresses.user_id) as no_of_barangay'),
                DB::raw('COUNT(blotters.id) as blotters')
            )
            ->where('user_addresses.province_code', $provinceId)
            ->groupBy('user_addresses.city_code', 'user_addresses.province_code')
            ->get()
            ->map(function ($item) {
                return [
                    'cityCode' => $item->city_code,
                    'provinceCode' => $item->province_code,
                    'noOfBarangays' => $item->no_of_barangay,
                    'noOfBlotters' => $item->blotters,
                ];
            })
            ->toArray();
    }
}

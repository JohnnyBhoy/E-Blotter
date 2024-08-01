<?php

namespace App\Repositories;

use App\Models\Complainant;
use App\Models\UserAddress;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class BarangayRepository
{
    /**
     * Get all provinces
     */
    public function get()
    {
        return UserAddress::selectRaw('DISTINCT barangay_code,city_code')
            ->get()
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
}

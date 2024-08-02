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
}

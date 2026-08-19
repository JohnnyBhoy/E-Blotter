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
        return $this->aggregateByArea($cityCode > 0 ? 'city_code' : null, $cityCode);
    }

    /**
     * Same aggregation as get(), scoped to a province instead of a city.
     * @param int $provinceCode PSGC code of the province
     * @return array arrays of barangay within the province
     */
    public function getByProvince(Int $provinceCode)
    {
        return $this->aggregateByArea($provinceCode > 0 ? 'province_code' : null, $provinceCode);
    }

    /**
     * Blotter counts per barangay, bucketed by disposition remark.
     * @param string|null $column user_addresses column to filter on, null for no filter
     * @param int $value value for $column
     * @return array
     */
    private function aggregateByArea(?string $column, Int $value)
    {
        $remarks = [1, 2, 3, 4, 5];

        $query =  DB::table('user_addresses')
            ->leftJoin('blotters', 'user_addresses.user_id', '=', 'blotters.user_id')
            ->select('user_addresses.user_id', 'user_addresses.barangay_code', 'user_addresses.city_code', 'blotters.remarks', DB::raw('count(blotters.id) as count'));

        if ($column !== null) {
            $query  = $query->where("user_addresses.{$column}", $value);
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
                    // A barangay with no blotters yet comes back from the LEFT
                    // JOIN with a null remark — it belongs in no bucket.
                    if ($item->remarks === null) {
                        continue;
                    }

                    $remark = intval($item->remarks);

                    if ($remark >= 1 && $remark <= 5) {
                        $remarkCounts[$remark] = $item->count;
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

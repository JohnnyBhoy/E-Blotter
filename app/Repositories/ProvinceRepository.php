<?php

namespace App\Repositories;

use App\Models\Complainant;
use App\Models\UserAddress;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

class ProvinceRepository
{
    /**
     * Get all provinces
     */
    public function get()
    {
        return UserAddress::selectRaw('DISTINCT province_code, region_code')
            ->get()
            ->toArray();
    }

    /**
     * Method to get all cities and municipalities
     * based on the given province code
     * @param $provinceCode  Province code
     * @return array Array of City user id
     */
    public function getAllCitiesByProvinceCode(Int $provinceCode): array
    {
        return UserAddress::where('province_code', $provinceCode)
            ->pluck('user_id')
            ->toArray();
    }
}

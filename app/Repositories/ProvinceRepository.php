<?php

namespace App\Repositories;

use App\Models\Complainant;
use App\Models\UserAddress;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class ProvinceRepository
{
    /**
     * Get all provinces
     */
    public function get()
    {
        return DB::table('users as u')
            ->join('user_addresses as ua', 'u.id', '=', 'ua.user_id')
            ->select(
                'u.id',
                'u.name',
                'ua.province_code',
            )
            ->where('u.role', 3)
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

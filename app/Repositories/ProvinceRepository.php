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
}

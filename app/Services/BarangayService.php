<?php

namespace App\Services;

use App\Repositories\BarangayRepository;

class BarangayService
{
    protected $barangayRepository;

    public function __construct(BarangayRepository $barangayRepository)
    {
        $this->barangayRepository = $barangayRepository;
    }

    /**
     * Get all Barangays
     * @param int $cityCode Code of the city / Municipality
     * @return array Arrays of the barangay and their blotters count
     */
    public function get(Int $cityCode)
    {
        return $this->barangayRepository->get($cityCode);
    }

    /**
     * Get Barangays by
     * @param int $cityId ID of the City
     * @return array Collection of barangays within the given city
     */
    public  function getBarangays(Int $cityId)
    {
        return $this->barangayRepository->getBarangays($cityId);
    }
}

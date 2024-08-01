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
     */
    public function get()
    {
        return $this->barangayRepository->get();
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

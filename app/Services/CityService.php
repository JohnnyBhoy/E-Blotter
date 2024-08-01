<?php

namespace App\Services;

use App\Repositories\CityRepository;

class CityService
{
    protected $cityRepository;

    public function __construct(CityRepository $cityRepository)
    {
        $this->cityRepository = $cityRepository;
    }

    /**
     * Get all Citys
     */
    public function get()
    {
        return $this->cityRepository->get();
    }

    /**
     * Get cities by
     * @param int $provinceId ID of the province
     * @return array Collection of cities within the given provinces
     */
    public  function getCities(Int $provinceId)
    {
        return $this->cityRepository->getCities($provinceId);
    }
}

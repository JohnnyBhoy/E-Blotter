<?php

namespace App\Services;

use App\Repositories\ProvinceRepository;

class ProvinceService
{
    protected $provinceRepository;

    public function __construct(ProvinceRepository $provinceRepository)
    {
        $this->provinceRepository = $provinceRepository;
    }

    /**
     * Get all Provinces
     */
    public function get()
    {
        return $this->provinceRepository->get();
    }
}

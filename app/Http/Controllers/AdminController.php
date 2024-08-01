<?php

namespace App\Http\Controllers;

use App\Services\BarangayService;
use App\Services\BlotterService;
use App\Services\CityService;
use App\Services\ProvinceService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    protected $provinceService;
    protected $cityService;
    protected $barangayService;
    protected $blotterService;

    /** Constructor */
    public function __construct(
        ProvinceService $provinceService,
        CityService $cityService,
        BarangayService $barangayService,
        BlotterService $blotterService,
    ) {
        $this->provinceService = $provinceService;
        $this->cityService = $cityService;
        $this->barangayService = $barangayService;
        $this->blotterService = $blotterService;
    }

    /** Dashboard */
    public function dashboard()
    {
        $provinces = $this->provinceService->get();
        $cities = $this->cityService->get();
        $barangays = $this->barangayService->get();
        $blotters = $this->blotterService->getCount();

        return Inertia::render('Admin/Dashboard', [
            'provinces' => $provinces,
            'cities' => $cities,
            'barangays' => $barangays,
            'blotters' => $blotters,
        ]);
    }

    /**
     * Get Cities of Province
     * @param \Illuminate\Http\Request $request The HTTP request
     * @return Response  array of cities
     */
    public function getCities(Request $request)
    {
        $provinceId = $request->get('province_id');

        try {
            $citiesOfProvince = $this->cityService->getCities($provinceId);

            return Inertia::render('Cities', ['cities' => $citiesOfProvince]);
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    /**
     * Get Barangays of City
     * @param \Illuminate\Http\Request $request The HTTP request
     * @return Response  array of barangays
     */
    public function getBarangays(Request $request)
    {
        $cityId = $request->get('city_id');

        try {
            $barangaysOfCity = $this->barangayService->getBarangays($cityId);

            return Inertia::render('Barangays', ['barangays' => $barangaysOfCity]);
        } catch (\Throwable $th) {
            throw $th;
        }
    }
}

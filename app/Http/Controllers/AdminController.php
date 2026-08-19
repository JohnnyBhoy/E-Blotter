<?php

namespace App\Http\Controllers;

use App\Services\BarangayService;
use App\Services\CityService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Super admin lookups. The super admin dashboard is now ConsoleController — the
 * same console every other level uses, unscoped — so only the nationwide city
 * and barangay drill-downs remain here.
 */
class AdminController extends Controller
{
    protected $cityService;
    protected $barangayService;

    /** Constructor */
    public function __construct(
        CityService $cityService,
        BarangayService $barangayService,
    ) {
        $this->cityService = $cityService;
        $this->barangayService = $barangayService;
    }

    /**
     * Get Cities of Province
     * @param \Illuminate\Http\Request $request The HTTP request
     * @return Response  array of cities
     */
    public function getCities(Request $request)
    {
        $request->validate(['province_id' => 'required|integer']);

        $citiesOfProvince = $this->cityService->getCities(intval($request->get('province_id')));

        return Inertia::render('Cities', ['cities' => $citiesOfProvince]);
    }

    /**
     * Get Barangays of City
     * @param \Illuminate\Http\Request $request The HTTP request
     * @return Response  array of barangays
     */
    public function getBarangays(Request $request)
    {
        $request->validate(['city_id' => 'required|integer']);

        $barangaysOfCity = $this->barangayService->getBarangays(intval($request->get('city_id')));

        return Inertia::render('Barangays', ['barangays' => $barangaysOfCity]);
    }
}

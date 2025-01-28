<?php

namespace App\Http\Controllers;

use App\Models\Blotter;
use App\Models\UserAddress;
use App\Services\BarangayService;
use App\Services\BlotterService;
use App\Services\CityService;
use App\Services\ProvinceService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProvinceController extends Controller
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
        $id = auth()->user()->id;
        $cityCode = 0;
        $provinces = $this->provinceService->get();
        $barangays = $this->barangayService->get($cityCode);
        $blotters = $this->blotterService->getCount();

        $provinceCode = UserAddress::where('user_id', $id)->first();

        $citiesId = UserAddress::where('province_code', $provinceCode->province_code)->pluck('user_id')->toArray();

        $cities = $this->cityService->getCities($provinceCode->province_code);

        $provinceTotalBlotterCount = Blotter::whereIn('user_id', $citiesId)->count();

        $forHearingCount = Blotter::whereIn('user_id', $citiesId)
            ->where('remarks', 1)
            ->count();

        $amicablySettledCount = Blotter::whereIn('user_id', $citiesId)
            ->where('remarks', 2)
            ->count();

        $pendingCount = Blotter::whereIn('user_id', $citiesId)
            ->where('remarks', 3)
            ->count();

        $referredToPnpCount = Blotter::whereIn('user_id', $citiesId)
            ->where('remarks', 4)
            ->count();

        return Inertia::render('Province/Dashboard', [
            'provinces' => $provinces,
            'cities' => $cities,
            'barangays' => $barangays,
            'blotters' => $blotters,
            'totalBlotters' => $provinceTotalBlotterCount,
            'counts' =>  [
                'for_hearing' => $forHearingCount,
                'amicably_settled' => $amicablySettledCount,
                'pending' => $pendingCount,
                'referred_to_pnp' => $referredToPnpCount,
            ],
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

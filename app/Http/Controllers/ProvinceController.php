<?php

namespace App\Http\Controllers;

use App\Models\UserAddress;
use App\Services\BarangayService;
use App\Services\CityService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Provincial lookups. The provincial dashboard itself is now ConsoleController,
 * which serves every level from one page; what is left here are the city and
 * barangay drill-down pages, both scoped to the caller's own province.
 */
class ProvinceController extends Controller
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
        // A provincial account may only browse its own province, whatever
        // province_id the client asks for.
        $address = UserAddress::where('user_id', auth()->user()->id)->first();

        if (!$address) {
            return Inertia::render('Cities', ['cities' => []]);
        }

        $citiesOfProvince = $this->cityService->getCities(intval($address->province_code));

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

        $cityId = intval($request->get('city_id'));
        $address = UserAddress::where('user_id', auth()->user()->id)->first();

        // Reject cities outside the caller's province.
        $cityInProvince = $address && UserAddress::where('city_code', $cityId)
            ->where('province_code', $address->province_code)
            ->exists();

        if (!$cityInProvince) {
            abort(403, 'That city is outside your province.');
        }

        $barangaysOfCity = $this->barangayService->getBarangays($cityId);

        return Inertia::render('Barangays', ['barangays' => $barangaysOfCity]);
    }
}

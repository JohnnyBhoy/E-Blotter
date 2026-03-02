<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserAddress;
use App\Services\BarangayService;
use App\Services\BlotterService;
use App\Services\CityService;
use App\Services\ProvinceService;
use App\Services\StationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AdminController
{
    protected $provinceService;
    protected $cityService;
    protected $barangayService;
    protected $blotterService;
    protected $stationService;

    /** Constructor */
    public function __construct(
        ProvinceService $provinceService,
        CityService $cityService,
        BarangayService $barangayService,
        BlotterService $blotterService,
        StationService $stationService,
    ) {
        $this->provinceService = $provinceService;
        $this->cityService = $cityService;
        $this->barangayService = $barangayService;
        $this->blotterService = $blotterService;
        $this->stationService = $stationService;
    }

    /** Dashboard */
    public function dashboard()
    {
        $cityCode = 0;
        $provinces = $this->provinceService->get();
        $cities = $this->cityService->get();
        $barangays = $this->barangayService->get($cityCode);
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

    // ========== BARANGAY MANAGEMENT ==========
    /**
     * Get all barangays in city
     * @param int $cityCode Code of the city where barangays need to fetch
     * @return array Collection of the barangays within given city
     */
    /** Barangay Index */
    public function barangayIndex(Request $request)
    {
        $search = $request->get('search');
        $province = $request->get('province');
        $city = $request->get('city');

        $barangays = $this->barangayService->getAll($search, $province, $city);

        // Get blotters count for each barangay
        foreach ($barangays as &$barangay) { // Use reference to modify array
            $barangay['blotter_count'] = $this->blotterService->getCountByBarangay($barangay['user_id']); // Use user_id to match barangay user
        }

        return Inertia::render('Admin/Barangay/Index', [
            'barangays' => $barangays,
            'filters' => [
                'search' => $search,
                'province' => $province,
                'city' => $city
            ]
        ]);
    }

    /** Barangay Create */
    public function barangayCreate()
    {
        return Inertia::render('Admin/Barangay/Create');
    }

    /** Barangay Store */
    public function barangayStore(Request $request)
    {
        $validated = $request->validate([
            'brgy_name' => 'required|string|max:255',
            'city_code' => 'required|string',
            'brgy_code' => 'required|string|unique:user_addresses,barangay_code',
            'email' => 'nullable|email|unique:users,email',
            'password' => 'nullable|string|min:6',
            'lang' => 'nullable|string',
            'lat' => 'nullable|numeric',
            'avatar' => 'nullable|string',
            'banner' => 'nullable|string',
            'province_code' => 'required|string',
            'region_code' => 'required|string',
        ]);

        try {
            $this->barangayService->create($validated);
            return redirect()->route('admin.barangay')->with('success', 'Barangay created successfully.');
        } catch (\Throwable $th) {
            \Log::error('Barangay creation failed:', ['error' => $th->getMessage()]);
            return redirect()->back()->with('error', 'Failed to create barangay: ' . $th->getMessage());
        }
    }

    /** Barangay Edit */
    public function barangayEdit($id)
    {
        $barangay = $this->barangayService->findById($id);

        if (!$barangay) {
            return redirect()->route('admin.barangay')->with('error', 'Barangay not found.');
        }

        // Get complete barangay data including user information
        $completeBarangay = DB::table('user_addresses')
            ->join('users', 'user_addresses.user_id', '=', 'users.id')
            ->select(
                'user_addresses.id',
                'user_addresses.user_id',
                'users.name as brgy_name',
                'user_addresses.barangay_code',
                'user_addresses.city_code',
                'user_addresses.province_code',
                'user_addresses.region_code',
                'users.email',
                'users.lang',
                'users.lat',
                'users.avatar',
                'users.banner',
                'user_addresses.created_at',
                'user_addresses.updated_at'
            )
            ->where('user_addresses.id', $id)
            ->first();

        return Inertia::render('Admin/Barangay/Edit', [
            'barangay' => $completeBarangay
        ]);
    }

    /** Barangay Update */
    public function barangayUpdate(Request $request, $id)
    {
        $validated = $request->validate([
            'brgy_name' => 'required|string|max:255',
            'city_code' => 'required|string',
            'brgy_code' => 'required|string|unique:user_addresses,barangay_code,' . $id,
            'province_code' => 'required|string',
            'region_code' => 'required|string',
            'email' => 'nullable|email|unique:users,email,' . $id,
            'password' => 'nullable|string|min:6',
            'lang' => 'nullable|string',
            'lat' => 'nullable|numeric',
            'avatar' => 'nullable|string',
            'banner' => 'nullable|string',
        ]);

        try {
            $this->barangayService->update($id, $validated);
            return redirect()->route('admin.barangay')->with('success', 'Barangay updated successfully.');
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Failed to update barangay: ' . $th->getMessage());
        }
    }

    /** Barangay Destroy */
    public function barangayDestroy($id)
    {
        try {
            $this->barangayService->delete($id);
            return redirect()->route('admin.barangay')->with('success', 'Barangay deleted successfully.');
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Failed to delete barangay.');
        }
    }

    // ========== STATION MANAGEMENT ==========

    /** Station Index */
    public function stationIndex(Request $request)
    {
        $search = $request->get('search');
        $province = $request->get('province');
        $city = $request->get('city');

        $stations = $this->stationService->getAll($search, $province, $city);

        // Get blotters count for each station
        foreach ($stations as &$station) { // Use reference to modify array
            $station['blotter_count'] = $this->blotterService->getCountByStation($station['user_id']); // Use user_id to match station user
        }

        return Inertia::render('Admin/Station/Index', [
            'stations' => $stations,
            'filters' => [
                'search' => $search,
                'province' => $province,
                'city' => $city
            ]
        ]);
    }

    /** Station Create */
    public function stationCreate()
    {
        return Inertia::render('Admin/Station/Create');
    }

    /** Station Store */
    public function stationStore(Request $request)
    {
        // Validate incoming data
        $user = $request->get('user');
        $userAddress = $request->get('user_address');

        $validated = $request->validate([
            'user.name' => 'required|string|max:255',
            'user.email' => 'nullable|email|unique:users,email',
            'user.password' => 'nullable|string|min:6',
            'user.lang' => 'nullable|string',
            'user.lat' => 'nullable|numeric',
            'user.avatar' => 'nullable|string',
            'user.banner' => 'nullable|string',
            'user_address.barangay_code' => 'nullable|string',
            'user_address.city_code' => 'required|string',
            'user_address.province_code' => 'required|string',
            'user_address.region_code' => 'required|string',
        ]);

        try {
            $userId = User::insertGetId($user);

            $userAddress['user_id'] = $userId;

            UserAddress::create($userAddress);

            return redirect()->route('admin.station')->with('success', 'Station created successfully.');
        } catch (\Throwable $th) {
            \Log::error('Station creation failed:', ['error' => $th->getMessage()]);
            return redirect()->back()->with('error', 'Failed to create station: ' . $th->getMessage());
        }
    }

    /** Station Edit */
    public function stationEdit($id)
    {
        $station = $this->stationService->findById($id);

        if (!$station) {
            return redirect()->route('admin.station')->with('error', 'Station not found.');
        }

        return Inertia::render('Admin/Station/Edit', [
            'station' => $station
        ]);
    }

    /** Station Update */
    public function stationUpdate(Request $request, $id)
    {
        $validated = $request->validate([
            'station_name' => 'required|string|max:255',
            'city_code' => 'required|string',
            'station_code' => 'required|string|unique:user_addresses,station_code,' . $id,
            'email' => 'nullable|email|unique:users,email,' . $id,
            'password' => 'nullable|string|min:6',
            'lang' => 'nullable|string',
            'lat' => 'nullable|numeric',
            'avatar' => 'nullable|string',
            'banner' => 'nullable|string',
            'province_code' => 'required|string',
            'region_code' => 'required|string',
        ]);

        try {
            $this->stationService->update($id, $validated);
            return redirect()->route('admin.station')->with('success', 'Station updated successfully.');
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Failed to update station: ' . $th->getMessage());
        }
    }

    /** Station Destroy */
    public function stationDestroy($id)
    {
        try {
            $this->stationService->delete($id);
            return redirect()->route('admin.station')->with('success', 'Station deleted successfully.');
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Failed to delete station: ' . $th->getMessage());
        }
    }

    // ========== PROVINCE MANAGEMENT ==========

    /** Province Index */
    public function provinceIndex()
    {
        $provinces = $this->provinceService->get();

        return Inertia::render('Admin/Province/Index', [
            'provinces' => $provinces
        ]);
    }

    /** Province Create */
    public function provinceCreate()
    {
        return Inertia::render('Admin/Province/Create');
    }

    /** Province Store */
    public function provinceStore(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|integer|unique:provinces,code',
        ]);

        try {
            $this->provinceService->create($validated);
            return redirect()->route('admin.province')->with('success', 'Province created successfully.');
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Failed to create province.');
        }
    }

    /** Province Edit */
    public function provinceEdit($id)
    {
        $province = $this->provinceService->findById($id);

        if (!$province) {
            return redirect()->route('admin.province')->with('error', 'Province not found.');
        }

        return Inertia::render('Admin/Province/Edit', [
            'province' => $province
        ]);
    }

    /** Province Update */
    public function provinceUpdate(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|integer|unique:provinces,code,' . $id,
        ]);

        try {
            $this->provinceService->update($id, $validated);
            return redirect()->route('admin.province')->with('success', 'Province updated successfully.');
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Failed to update province.');
        }
    }

    /** Province Destroy */
    public function provinceDestroy($id)
    {
        try {
            $this->provinceService->delete($id);
            return redirect()->route('admin.province')->with('success', 'Province deleted successfully.');
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Failed to delete province.');
        }
    }
}

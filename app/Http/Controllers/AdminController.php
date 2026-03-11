<?php

namespace App\Http\Controllers;

use App\Models\Blotter;
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
        $cityCode  = 0;
        $provinces = $this->provinceService->get();
        $cities    = $this->cityService->get();
        $barangays = $this->barangayService->get($cityCode);

        // ── KPI Counts ──────────────────────────────────────────────────────
        $totalBlotters    = Blotter::count();
        $totalActiveUsers = User::where('role', 5)->count();
        $totalStations    = User::where('role', 4)->count();

        $thisMonthBlotters = Blotter::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();
        $lastMonthBlotters = Blotter::whereMonth('created_at', now()->subMonth()->month)
            ->whereYear('created_at', now()->subMonth()->year)
            ->count();
        $thisWeekBlotters = Blotter::where('created_at', '>=', now()->startOfWeek())->count();

        // ── Disposition Counts (1=Hearing, 2=Settled, 3=Pending, 4=Referred) ──
        $dispositionCounts = DB::table('blotters')
            ->select('remarks', DB::raw('COUNT(id) as total'))
            ->groupBy('remarks')
            ->get()
            ->keyBy('remarks')
            ->map(fn($item) => $item->total);

        $hearingCount  = (int) $dispositionCounts->get(1, 0);
        $settledCount  = (int) $dispositionCounts->get(2, 0);
        $pendingCount  = (int) $dispositionCounts->get(3, 0);
        $referredCount = (int) $dispositionCounts->get(4, 0);

        // ── Monthly Trend: This Year vs Last Year ────────────────────────────
        $currentYear   = now()->year;
        $buildMonthly  = function (int $year) {
            $rows = DB::table('blotters')
                ->select(DB::raw('MONTH(created_at) as month'), DB::raw('COUNT(id) as total'))
                ->whereYear('created_at', $year)
                ->groupBy(DB::raw('MONTH(created_at)'))
                ->get()
                ->keyBy('month');
            return array_map(fn($m) => (int) ($rows->get($m)?->total ?? 0), range(1, 12));
        };
        $monthlyThisYear = $buildMonthly($currentYear);
        $monthlyLastYear = $buildMonthly($currentYear - 1);

        // ── Incident Type Breakdown (top 10) ────────────────────────────────
        $incidentTypeBreakdown = Blotter::query()
            ->select('incident_type', DB::raw('count(*) as total'))
            ->groupBy('incident_type')
            ->orderBy('total', 'desc')
            ->limit(10)
            ->get();

        // ── Top 10 Barangays by Blotter Count ───────────────────────────────
        $topBarangayUsers = DB::table('blotters as b')
            ->join('users as u', 'b.user_id', '=', 'u.id')
            ->select('u.id', 'u.name', DB::raw('COUNT(b.id) as total'))
            ->where('u.role', 5)
            ->groupBy('u.id', 'u.name')
            ->orderBy('total', 'desc')
            ->limit(10)
            ->get();

        // ── Blotters Over Time (last 30 days) ───────────────────────────────
        $blottersOverTime = Blotter::query()
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('count(*) as total'))
            ->where('created_at', '>=', now()->subDays(30))
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get();

        // ── Recent Blotters (10, with complainant + barangay name) ──────────
        $recentBlotters = DB::table('blotters as b')
            ->leftJoin('complainants as c', 'b.id', '=', 'c.blotter_id')
            ->leftJoin('users as u', 'b.user_id', '=', 'u.id')
            ->select(
                'b.id',
                'b.entry_number',
                'b.incident_type',
                'b.date_reported',
                'b.remarks',
                'b.created_at',
                'u.name as barangay_name',
                'c.complainant_family_name',
                'c.complainant_first_name',
            )
            ->orderBy('b.created_at', 'desc')
            ->limit(10)
            ->get();

        // ── Recent Registrations (barangay officers) ─────────────────────────
        $recentRegistrations = User::where('role', 5)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get(['id', 'name', 'email', 'created_at']);

        return Inertia::render('Admin/Dashboard', [
            'provinces' => $provinces,
            'cities'    => $cities,
            'barangays' => $barangays,
            'blotters'  => $totalBlotters,
            'reports'   => [
                // KPIs
                'totalBlotters'      => $totalBlotters,
                'totalActiveUsers'   => $totalActiveUsers,
                'totalStations'      => $totalStations,
                'thisMonthBlotters'  => $thisMonthBlotters,
                'lastMonthBlotters'  => $lastMonthBlotters,
                'thisWeekBlotters'   => $thisWeekBlotters,
                'hearingCount'       => $hearingCount,
                'settledCount'       => $settledCount,
                'pendingCount'       => $pendingCount,
                'referredCount'      => $referredCount,
                // Charts
                'monthlyThisYear'       => $monthlyThisYear,
                'monthlyLastYear'       => $monthlyLastYear,
                'incidentTypeBreakdown' => $incidentTypeBreakdown,
                'topBarangayUsers'      => $topBarangayUsers,
                'blottersOverTime'      => $blottersOverTime,
                // Tables
                'recentBlotters'      => $recentBlotters,
                'recentRegistrations' => $recentRegistrations,
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

        // Build user_id list for batch stats query
        $userIds = collect($barangays)->pluck('user_id')->filter()->values()->toArray();

        // Single batch query: counts grouped by user_id and remarks
        $blotterStats = DB::table('blotters')
            ->whereIn('user_id', $userIds)
            ->selectRaw('user_id, COUNT(*) as total, SUM(remarks = 3) as pending, SUM(remarks = 1) as hearing, SUM(remarks = 2) as settled, SUM(remarks = 4) as referred, MAX(created_at) as last_blotter_at')
            ->groupBy('user_id')
            ->get()
            ->keyBy('user_id');

        // Attach stats to each barangay
        foreach ($barangays as &$barangay) {
            $uid = $barangay['user_id'];
            $stats = $blotterStats->get($uid);
            $barangay['blotter_count']  = $stats ? (int) $stats->total    : 0;
            $barangay['pending_count']  = $stats ? (int) $stats->pending   : 0;
            $barangay['hearing_count']  = $stats ? (int) $stats->hearing   : 0;
            $barangay['settled_count']  = $stats ? (int) $stats->settled   : 0;
            $barangay['referred_count'] = $stats ? (int) $stats->referred  : 0;
            $barangay['last_blotter_at']= $stats ? $stats->last_blotter_at : null;
        }

        // Summary stats for the index page header
        $totalBarangays   = count($barangays);
        $activeBarangays  = collect($barangays)->filter(fn($b) => !empty($b['email']))->count();
        $totalBlotters    = collect($barangays)->sum('blotter_count');
        $inactiveBarangays = $totalBarangays - $activeBarangays;

        return Inertia::render('Admin/Barangay/Index', [
            'barangays' => $barangays,
            'summary'   => [
                'total'    => $totalBarangays,
                'active'   => $activeBarangays,
                'inactive' => $inactiveBarangays,
                'blotters' => $totalBlotters,
            ],
            'filters' => [
                'search'   => $search,
                'province' => $province,
                'city'     => $city,
            ],
        ]);
    }

    /** Barangay Show — per-barangay blotter detail view */
    public function barangayShow(Request $request, $id)
    {
        $barangay = DB::table('user_addresses as ua')
            ->join('users as u', 'ua.user_id', '=', 'u.id')
            ->select('ua.id', 'ua.user_id', 'u.name as brgy_name', 'u.email',
                     'ua.barangay_code', 'ua.city_code', 'ua.province_code', 'ua.region_code')
            ->where('ua.id', $id)
            ->first();

        if (!$barangay) {
            return redirect()->route('admin.barangay')->with('error', 'Barangay not found.');
        }

        $userId   = $barangay->user_id;
        $perPage  = (int) $request->get('per_page', 15);
        $keyword  = $request->get('search', '');
        $remark   = (int) $request->get('remark', 0);

        // Blotters for this barangay with complainant/respondent
        $blottersQuery = DB::table('blotters as b')
            ->leftJoin('complainants as c', 'b.id', '=', 'c.blotter_id')
            ->leftJoin('respondents as r', 'b.id', '=', 'r.blotter_id')
            ->where('b.user_id', $userId)
            ->select('b.id', 'b.entry_number', 'b.incident_type', 'b.remarks',
                     'b.date_reported', 'b.date_of_incident', 'b.narrative', 'b.created_at',
                     'c.complainant_family_name', 'c.complainant_first_name',
                     'r.respondent_family_name', 'r.respondent_first_name')
            ->distinct();

        if ($keyword) {
            $blottersQuery->where(function ($q) use ($keyword) {
                $q->where('b.entry_number', 'like', "%{$keyword}%")
                  ->orWhere('c.complainant_family_name', 'like', "%{$keyword}%")
                  ->orWhere('r.respondent_family_name', 'like', "%{$keyword}%");
            });
        }
        if ($remark > 0) {
            $blottersQuery->where('b.remarks', $remark);
        }

        $blotters = $blottersQuery->orderByDesc('b.created_at')->paginate($perPage);

        // Aggregate stats for this barangay
        $stats = DB::table('blotters')
            ->where('user_id', $userId)
            ->selectRaw('COUNT(*) as total, SUM(remarks = 3) as pending, SUM(remarks = 1) as hearing, SUM(remarks = 2) as settled, SUM(remarks = 4) as referred')
            ->first();

        // Monthly trend (last 6 months)
        $trend = DB::table('blotters')
            ->where('user_id', $userId)
            ->where('created_at', '>=', now()->subMonths(6))
            ->selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month, COUNT(*) as count')
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        return Inertia::render('Admin/Barangay/Show', [
            'barangay' => $barangay,
            'blotters' => $blotters,
            'stats'    => [
                'total'    => (int) ($stats->total    ?? 0),
                'pending'  => (int) ($stats->pending  ?? 0),
                'hearing'  => (int) ($stats->hearing  ?? 0),
                'settled'  => (int) ($stats->settled  ?? 0),
                'referred' => (int) ($stats->referred ?? 0),
            ],
            'trend'   => $trend,
            'filters' => ['search' => $keyword, 'remark' => $remark, 'per_page' => $perPage],
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
        $search   = $request->get('search');
        $province = $request->get('province');
        $city     = $request->get('city');

        $stations = $this->stationService->getAll($search, $province, $city);

        // Collect distinct city codes from all stations
        $cityCodes = collect($stations)->pluck('city_code')->filter()->unique()->values()->toArray();

        // Batch: blotter stats per city (stations own the city jurisdiction; barangays in city own blotters)
        $blotterStatsByCity = DB::table('blotters as b')
            ->join('users as u', 'b.user_id', '=', 'u.id')
            ->join('user_addresses as ua', 'u.id', '=', 'ua.user_id')
            ->where('u.role', 5)
            ->whereIn('ua.city_code', $cityCodes)
            ->selectRaw('ua.city_code, COUNT(*) as total, SUM(b.remarks = 3) as pending, SUM(b.remarks = 1) as hearing, SUM(b.remarks = 2) as settled, SUM(b.remarks = 4) as referred, MAX(b.created_at) as last_blotter_at')
            ->groupBy('ua.city_code')
            ->get()
            ->keyBy('city_code');

        // Batch: barangay count per city
        $barangayCountByCity = DB::table('user_addresses as ua')
            ->join('users as u', 'ua.user_id', '=', 'u.id')
            ->where('u.role', 5)
            ->whereIn('ua.city_code', $cityCodes)
            ->selectRaw('ua.city_code, COUNT(*) as count')
            ->groupBy('ua.city_code')
            ->get()
            ->keyBy('city_code');

        // Attach stats to each station
        foreach ($stations as &$station) {
            $cc  = $station['city_code'];
            $s   = $blotterStatsByCity->get($cc);
            $b   = $barangayCountByCity->get($cc);
            $station['blotter_count']   = $s ? (int) $s->total    : 0;
            $station['pending_count']   = $s ? (int) $s->pending   : 0;
            $station['hearing_count']   = $s ? (int) $s->hearing   : 0;
            $station['settled_count']   = $s ? (int) $s->settled   : 0;
            $station['referred_count']  = $s ? (int) $s->referred  : 0;
            $station['last_blotter_at'] = $s ? $s->last_blotter_at : null;
            $station['barangay_count']  = $b ? (int) $b->count     : 0;
        }

        $totalStations   = count($stations);
        $activeStations  = collect($stations)->filter(fn($s) => !empty($s['email']))->count();
        $totalBlotters   = collect($stations)->sum('blotter_count');

        return Inertia::render('Admin/Station/Index', [
            'stations' => $stations,
            'summary'  => [
                'total'    => $totalStations,
                'active'   => $activeStations,
                'inactive' => $totalStations - $activeStations,
                'blotters' => $totalBlotters,
            ],
            'filters' => [
                'search'   => $search,
                'province' => $province,
                'city'     => $city,
            ],
        ]);
    }

    /** Station Show — per-station jurisdiction blotter detail view */
    public function stationShow(Request $request, $id)
    {
        $station = DB::table('user_addresses as ua')
            ->join('users as u', 'ua.user_id', '=', 'u.id')
            ->select('ua.id', 'ua.user_id', 'u.name as station_name', 'u.email',
                     'ua.city_code', 'ua.province_code', 'ua.region_code')
            ->where('ua.id', $id)
            ->where('u.role', 4)
            ->first();

        if (!$station) {
            return redirect()->route('admin.station')->with('error', 'Station not found.');
        }

        $cityCode = $station->city_code;
        $perPage  = (int) $request->get('per_page', 15);
        $keyword  = $request->get('search', '');
        $remark   = (int) $request->get('remark', 0);

        // Barangays under this station's city
        $barangays = DB::table('user_addresses as ua')
            ->join('users as u', 'ua.user_id', '=', 'u.id')
            ->where('u.role', 5)
            ->where('ua.city_code', $cityCode)
            ->select('u.id as user_id', 'u.name as brgy_name', 'ua.barangay_code',
                DB::raw('(SELECT COUNT(*) FROM blotters WHERE user_id = u.id) as blotter_count'))
            ->get();

        $barangayUserIds = $barangays->pluck('user_id')->toArray();

        // Blotters for this station jurisdiction
        $blottersQuery = DB::table('blotters as b')
            ->leftJoin('complainants as c', 'b.id', '=', 'c.blotter_id')
            ->leftJoin('respondents as r', 'b.id', '=', 'r.blotter_id')
            ->leftJoin('users as u', 'b.user_id', '=', 'u.id')
            ->whereIn('b.user_id', $barangayUserIds)
            ->select('b.id', 'b.entry_number', 'b.incident_type', 'b.remarks',
                     'b.date_reported', 'b.created_at', 'u.name as barangay_name',
                     'c.complainant_family_name', 'c.complainant_first_name',
                     'r.respondent_family_name', 'r.respondent_first_name')
            ->distinct();

        if ($keyword) {
            $blottersQuery->where(function ($q) use ($keyword) {
                $q->where('b.entry_number', 'like', "%{$keyword}%")
                  ->orWhere('c.complainant_family_name', 'like', "%{$keyword}%")
                  ->orWhere('u.name', 'like', "%{$keyword}%");
            });
        }
        if ($remark > 0) {
            $blottersQuery->where('b.remarks', $remark);
        }

        $blotters = $blottersQuery->orderByDesc('b.created_at')->paginate($perPage);

        // Aggregate stats
        $stats = DB::table('blotters')
            ->whereIn('user_id', $barangayUserIds)
            ->selectRaw('COUNT(*) as total, SUM(remarks = 3) as pending, SUM(remarks = 1) as hearing, SUM(remarks = 2) as settled, SUM(remarks = 4) as referred')
            ->first();

        // 6-month trend
        $trend = DB::table('blotters')
            ->whereIn('user_id', $barangayUserIds)
            ->where('created_at', '>=', now()->subMonths(6))
            ->selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month, COUNT(*) as count')
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        return Inertia::render('Admin/Station/Show', [
            'station'   => $station,
            'barangays' => $barangays,
            'blotters'  => $blotters,
            'stats'     => [
                'total'    => (int) ($stats->total    ?? 0),
                'pending'  => (int) ($stats->pending  ?? 0),
                'hearing'  => (int) ($stats->hearing  ?? 0),
                'settled'  => (int) ($stats->settled  ?? 0),
                'referred' => (int) ($stats->referred ?? 0),
            ],
            'trend'   => $trend,
            'filters' => ['search' => $keyword, 'remark' => $remark, 'per_page' => $perPage],
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
    public function provinceIndex(Request $request)
    {
        $search   = $request->get('search', '');
        $provinces = $this->provinceService->get();

        // Collect distinct province codes
        $provinceCodes = collect($provinces)->pluck('province_code')->filter()->unique()->values()->toArray();

        // Batch: blotter stats per province (from barangay users)
        $blotterStatsByProvince = DB::table('blotters as b')
            ->join('users as u', 'b.user_id', '=', 'u.id')
            ->join('user_addresses as ua', 'u.id', '=', 'ua.user_id')
            ->where('u.role', 5)
            ->whereIn('ua.province_code', $provinceCodes)
            ->selectRaw('ua.province_code, COUNT(*) as total, SUM(b.remarks = 3) as pending, SUM(b.remarks = 1) as hearing, SUM(b.remarks = 2) as settled, SUM(b.remarks = 4) as referred, MAX(b.created_at) as last_blotter_at')
            ->groupBy('ua.province_code')
            ->get()
            ->keyBy('province_code');

        // Batch: barangay count per province
        $barangayCountByProvince = DB::table('user_addresses as ua')
            ->join('users as u', 'ua.user_id', '=', 'u.id')
            ->where('u.role', 5)
            ->whereIn('ua.province_code', $provinceCodes)
            ->selectRaw('ua.province_code, COUNT(*) as count')
            ->groupBy('ua.province_code')
            ->get()
            ->keyBy('province_code');

        // Batch: station count per province
        $stationCountByProvince = DB::table('user_addresses as ua')
            ->join('users as u', 'ua.user_id', '=', 'u.id')
            ->where('u.role', 4)
            ->whereIn('ua.province_code', $provinceCodes)
            ->selectRaw('ua.province_code, COUNT(*) as count')
            ->groupBy('ua.province_code')
            ->get()
            ->keyBy('province_code');

        // Attach stats and filter by search
        $enriched = [];
        foreach ($provinces as $province) {
            $pc = $province['province_code'] ?? null;
            if ($search && !str_contains(strtolower($province['name'] ?? ''), strtolower($search))) continue;
            $s  = $blotterStatsByProvince->get($pc);
            $b  = $barangayCountByProvince->get($pc);
            $st = $stationCountByProvince->get($pc);
            $enriched[] = array_merge($province, [
                'blotter_count'   => $s  ? (int) $s->total    : 0,
                'pending_count'   => $s  ? (int) $s->pending   : 0,
                'hearing_count'   => $s  ? (int) $s->hearing   : 0,
                'settled_count'   => $s  ? (int) $s->settled   : 0,
                'referred_count'  => $s  ? (int) $s->referred  : 0,
                'last_blotter_at' => $s  ? $s->last_blotter_at : null,
                'barangay_count'  => $b  ? (int) $b->count     : 0,
                'station_count'   => $st ? (int) $st->count    : 0,
            ]);
        }

        $totalBlotters = array_sum(array_column($enriched, 'blotter_count'));

        return Inertia::render('Admin/Province/Index', [
            'provinces' => $enriched,
            'summary'   => [
                'total'    => count($enriched),
                'blotters' => $totalBlotters,
                'stations' => array_sum(array_column($enriched, 'station_count')),
                'barangays'=> array_sum(array_column($enriched, 'barangay_count')),
            ],
            'filters' => ['search' => $search],
        ]);
    }

    /** Province Show — per-province detail view */
    public function provinceShow(Request $request, $id)
    {
        // Province users are role=3 entries in user_addresses
        $province = DB::table('user_addresses as ua')
            ->join('users as u', 'ua.user_id', '=', 'u.id')
            ->select('ua.id', 'ua.user_id', 'u.name as province_name', 'u.email',
                     'ua.province_code', 'ua.region_code')
            ->where('ua.id', $id)
            ->where('u.role', 3)
            ->first();

        if (!$province) {
            return redirect()->route('admin.province')->with('error', 'Province not found.');
        }

        $provinceCode = $province->province_code;
        $perPage      = (int) $request->get('per_page', 15);
        $keyword      = $request->get('search', '');
        $remark       = (int) $request->get('remark', 0);

        // Stations in this province
        $stations = DB::table('user_addresses as ua')
            ->join('users as u', 'ua.user_id', '=', 'u.id')
            ->where('u.role', 4)
            ->where('ua.province_code', $provinceCode)
            ->select('ua.id', 'u.name as station_name', 'ua.city_code',
                DB::raw('(SELECT COUNT(*) FROM blotters b JOIN users bu ON b.user_id = bu.id JOIN user_addresses bua ON bu.id = bua.user_id WHERE bu.role = 5 AND bua.city_code = ua.city_code) as blotter_count'))
            ->get();

        // Barangay user_ids in this province
        $barangayUserIds = DB::table('user_addresses as ua')
            ->join('users as u', 'ua.user_id', '=', 'u.id')
            ->where('u.role', 5)
            ->where('ua.province_code', $provinceCode)
            ->pluck('u.id')
            ->toArray();

        // Blotters for this province
        $blottersQuery = DB::table('blotters as b')
            ->leftJoin('complainants as c', 'b.id', '=', 'c.blotter_id')
            ->leftJoin('respondents as r', 'b.id', '=', 'r.blotter_id')
            ->leftJoin('users as u', 'b.user_id', '=', 'u.id')
            ->leftJoin('user_addresses as ua', 'u.id', '=', 'ua.user_id')
            ->whereIn('b.user_id', $barangayUserIds)
            ->select('b.id', 'b.entry_number', 'b.incident_type', 'b.remarks',
                     'b.date_reported', 'b.created_at', 'u.name as barangay_name',
                     'ua.city_code',
                     'c.complainant_family_name', 'c.complainant_first_name',
                     'r.respondent_family_name', 'r.respondent_first_name')
            ->distinct();

        if ($keyword) {
            $blottersQuery->where(function ($q) use ($keyword) {
                $q->where('b.entry_number', 'like', "%{$keyword}%")
                  ->orWhere('c.complainant_family_name', 'like', "%{$keyword}%")
                  ->orWhere('u.name', 'like', "%{$keyword}%");
            });
        }
        if ($remark > 0) {
            $blottersQuery->where('b.remarks', $remark);
        }

        $blotters = $blottersQuery->orderByDesc('b.created_at')->paginate($perPage);

        // Stats
        $stats = DB::table('blotters')
            ->whereIn('user_id', $barangayUserIds)
            ->selectRaw('COUNT(*) as total, SUM(remarks = 3) as pending, SUM(remarks = 1) as hearing, SUM(remarks = 2) as settled, SUM(remarks = 4) as referred')
            ->first();

        // 6-month trend
        $trend = DB::table('blotters')
            ->whereIn('user_id', $barangayUserIds)
            ->where('created_at', '>=', now()->subMonths(6))
            ->selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month, COUNT(*) as count')
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        return Inertia::render('Admin/Province/Show', [
            'province' => $province,
            'stations' => $stations,
            'blotters' => $blotters,
            'stats'    => [
                'total'      => (int) ($stats->total    ?? 0),
                'pending'    => (int) ($stats->pending  ?? 0),
                'hearing'    => (int) ($stats->hearing  ?? 0),
                'settled'    => (int) ($stats->settled  ?? 0),
                'referred'   => (int) ($stats->referred ?? 0),
                'stations'   => $stations->count(),
                'barangays'  => count($barangayUserIds),
            ],
            'trend'   => $trend,
            'filters' => ['search' => $keyword, 'remark' => $remark, 'per_page' => $perPage],
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

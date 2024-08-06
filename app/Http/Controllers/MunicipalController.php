<?php

namespace App\Http\Controllers;

use App\Models\Blotter;
use App\Models\UserAddress;
use App\Services\BarangayService;
use App\Services\BlotterService;
use App\Services\IncidentService;
use App\Services\UserService;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class MunicipalController extends Controller
{

    protected $userService;
    protected $blotterService;
    protected $incidentService;
    protected $barangayService;
    protected $edit = 'Profile/Edit';

    /** Constructor */
    public function __construct(
        UserService $userService,
        BlotterService $blotterService,
        IncidentService $incidentService,
        BarangayService $barangayService,
    ) {
        $this->userService = $userService;
        $this->blotterService = $blotterService;
        $this->incidentService = $incidentService;
        $this->barangayService = $barangayService;
    }
    /** Dashboard */
    public function dashboard()
    {
        $userId = auth()->user()->id;
        $lastYear  = date('Y') - 1;
        $currentYear  = date('Y');

        // Get the city / munipal ID
        $municipalID = UserAddress::where('user_id', $userId)->first();

        // Get the barangays
        $userIds = UserAddress::where('city_code', $municipalID->city_code)->pluck('user_id');

        // Get the monthly incident type and count
        $monthlyIncidents = $this->incidentService->getMonthlyBlotterByMunicipal($userIds->toArray());

        // Yearly blotter
        $blotterPerYear = $this->blotterService->getYearlyBlotterByMunicipal($userIds->toArray());

        $recordsLastYear = $this->blotterService->getYearlyBlotterByMonthByMunicipal($userIds->toArray(), $lastYear);

        $recordsThisWeek = $this->blotterService->getWeeklyBlotterByMunicipal($userIds->toArray());

        $recordsThisYear = $this->blotterService->getYearlyBlotterByMonthByMunicipal($userIds->toArray(), $currentYear);

        $blotter = Blotter::whereIn('user_id', $userIds)->count();

        $hearing = Blotter::whereIn('user_id', $userIds)->where('remarks', 1)->count();

        $settled = Blotter::whereIn('user_id', $userIds)->where('remarks', 2)->count();

        $pending = Blotter::whereIn('user_id', $userIds)->where('remarks', 3)->count();

        $referred = Blotter::whereIn('user_id', $userIds)->where('remarks', 4)->count();

        $barangays = $this->barangayService->get($municipalID->city_code);

        // Top 10 Brgy with most blotter incidents
        $topBarangayWithMostBlotterIncidents = $this->blotterService->getBarangayWithMostBlotter($userId);

        // Get Top 10 Most Crime of the barangay
        $top10Cases = Blotter::select('incident_type', DB::raw('COUNT(*) as count'))
            ->groupBy('incident_type')
            ->orderBy('count', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($item, $index) {
                return [
                    'rank' => $index + 1,
                    'incident_type' => $item->incident_type,
                    'count' => $item->count
                ];
            });

        return Inertia::render('Municipal/Dashboard', [
            'datas' =>  [
                $blotter,
                $hearing,
                $settled,
                $pending,
                $referred,
            ],
            'lastYearBlotter' => $recordsLastYear,
            'thisYearBlotter' => $recordsThisYear,
            'thisWeekBlotter' => $recordsThisWeek,
            'blotterPerYear' => $blotterPerYear,
            'monthlyIncidents' => $monthlyIncidents,
            'topBarangay' => $topBarangayWithMostBlotterIncidents,
            'barangays' => $barangays,
            'top10Cases' => $top10Cases,
        ]);
    }
}

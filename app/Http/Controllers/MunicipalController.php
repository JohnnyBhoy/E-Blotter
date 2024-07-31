<?php

namespace App\Http\Controllers;

use App\Models\Blotter;
use App\Models\UserAddress;
use App\Services\BlotterService;
use App\Services\IncidentService;
use App\Services\UserService;
use Inertia\Inertia;

class MunicipalController extends Controller
{

    protected $userService;
    protected $blotterService;
    protected $incidentService;
    protected $edit = 'Profile/Edit';

    /** Constructor */
    public function __construct(UserService $userService, BlotterService $blotterService, IncidentService $incidentService)
    {
        $this->userService = $userService;
        $this->blotterService = $blotterService;
        $this->incidentService = $incidentService;
    }
    /** Dashboard */
    public function dashboard()
    {
        $userId = auth()->user()->id;
        $lastYear  = date('Y') - 1;
        $currentYear  = date('Y');

        // Get the city / munipal ID
        $municipalID = UserAddress::where('user_id', $userId)->pluck('city_code');

        // Get the barangays
        $userIds = UserAddress::where('city_code', $municipalID)->pluck('user_id');

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

        // Top 10 Brgy with most blotter incidents
        $topBarangayWithMostBlotterIncidents = $this->blotterService->getBarangayWithMostBlotter($userId);

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
        ]);
    }
}

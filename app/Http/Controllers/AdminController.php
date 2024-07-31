<?php

namespace App\Http\Controllers;

use App\Models\Blotter;
use App\Services\BlotterService;
use App\Services\IncidentService;
use App\Services\UserService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
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

        // Get the monthly incident type and count
        $monthlyIncidents = $this->incidentService->getMonthly($userId);

        // Yearly blotter
        $blotterPerYear = $this->blotterService->getYearlyBlotter($userId);

        $recordsLastYear = $this->blotterService->getYearlyBlotterByMonth($userId, $lastYear);

        $recordsThisWeek = $this->blotterService->getWeeklyBlotter($userId);

        $recordsThisYear = $this->blotterService->getYearlyBlotterByMonth($userId, $currentYear);

        $blotter = Blotter::where('user_id', $userId)->count();

        $hearing = Blotter::where('user_id', $userId)->where('remarks', 1)->count();

        $settled = Blotter::where('user_id', $userId)->where('remarks', 2)->count();

        $pending = Blotter::where('user_id', $userId)->where('remarks', 3)->count();

        $referred = Blotter::where('user_id', $userId)->where('remarks', 4)->count();

        return Inertia::render('Admin/Dashboard', [
            'datas' =>  [
                $blotter,
                $hearing,
                $settled,
                $pending,
                $referred,
            ], 'lastYearBlotter' => $recordsLastYear,
            'thisYearBlotter' => $recordsThisYear,
            'thisWeekBlotter' => $recordsThisWeek,
            'blotterPerYear' => $blotterPerYear,
            'monthlyIncidents' => $monthlyIncidents,
        ]);
    }
}

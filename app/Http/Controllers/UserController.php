<?php

namespace App\Http\Controllers;

use App\Models\Blotter;
use App\Services\UserService;

use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    protected $userService;

    /** Constructor */
    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    /** Dashboard */
    public function dashboard()
    {
        $lastYear  = date('Y') - 1;
        $currentYear  = date('Y');

        $recordsLastYear = Blotter::whereBetween('created_at', ["{$lastYear}-01-01", "{$lastYear}-12-31"])->get();

        $recordsThisYear = Blotter::whereBetween('created_at', ["{$currentYear}-01-01", "{$currentYear}-12-31"])->get();

        $blotter = Blotter::count();
        $hearing = Blotter::where('remarks', 1)->count();
        $settled = Blotter::where('remarks', 2)->count();
        $pending = Blotter::where('remarks', 3)->count();

        return Inertia::render('Dashboard', [
            'data' =>  [
                $blotter,
                $hearing,
                $settled,
                $pending
            ], 'lastYearBlotter' => $recordsLastYear,
            'thisYearBlotter' => $recordsThisYear,
        ]);
    }

    /**
     * User profile index
     * @param \Illuminate\Http\Request $request The HTTP request
     */
    public function index(Request $request)
    {
        $userId = auth()->user()->id;

        try {
            $user = $this->userService->get($userId);

            return Inertia::render('Profile/Edit', [
                'data' => $user
            ]);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th], 500);
        }
    }
}

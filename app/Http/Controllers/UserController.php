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
        $blotter = Blotter::count();

        return Inertia::render('Dashboard', ['data' =>  $blotter]);
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

<?php

namespace App\Http\Controllers;

use App\Models\Blotter;
use App\Models\User;
use App\Services\UserService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    protected $userService;
    protected $edit = 'Profile/Edit';

    /** Constructor */
    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    /** Dashboard */
    public function dashboard()
    {
        $userId = auth()->user()->id;
        $lastYear  = date('Y') - 1;
        $currentYear  = date('Y');

        $recordsLastYear = Blotter::where('user_id', $userId)
            ->whereBetween('created_at', ["{$lastYear}-01-01", "{$lastYear}-12-31"])
            ->get();

        $recordsThisWeek = Blotter::where('user_id', $userId)
            ->where('created_at', '>=', Carbon::now()->subDays(7))
            ->get();

        $recordsThisYear = Blotter::where('user_id', $userId)
            ->whereBetween('created_at', ["{$currentYear}-01-01", "{$currentYear}-12-31"])
            ->get();

        $blotter = Blotter::where('user_id', $userId)->count();

        $hearing = Blotter::where('user_id', $userId)->where('remarks', 1)->count();

        $settled = Blotter::where('user_id', $userId)->where('remarks', 2)->count();

        $pending = Blotter::where('user_id', $userId)->where('remarks', 3)->count();

        $referred = Blotter::where('user_id', $userId)->where('remarks', 4)->count();

        return Inertia::render('Dashboard', [
            'data' =>  [
                $blotter,
                $hearing,
                $settled,
                $pending,
                $referred,
            ], 'lastYearBlotter' => $recordsLastYear,
            'thisYearBlotter' => $recordsThisYear,
            'thisWeekBlotter' => $recordsThisWeek,
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

            return Inertia::render($this->edit, [
                'data' => $user
            ]);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th], 500);
        }
    }

    /**
     * User profile update
     * @param \Illuminate\Http\Request $request The HTTP request
     */
    public function update(Request $request)
    {
        $userId = auth()->user()->id;
        $user = $this->userService->get($userId);

        try {
            if ($request->hasFile('banner')) {
                $image = $request->file('banner');

                // Get the MIME type of the uploaded file
                $mime = $image->getMimeType();

                if ($mime === 'image/jpeg' || $mime === 'image/png') {
                    // Process the image since it's either JPEG or PNG
                    $imageName = time() . '.' . $image->getClientOriginalExtension();

                    // Move the headshot to manufacturer image folder
                    $image->move(public_path('images/barangay_banner'), $imageName);
                }

                User::where('id', $userId)->update(['banner' => $imageName]);

                $status = 'success';
            } elseif ($request->hasFile('avatar')) {
                $image = $request->file('avatar');

                // Get the MIME type of the uploaded file
                $mime = $image->getMimeType();

                if ($mime === 'image/jpeg' || $mime === 'image/png') {
                    // Process the image since it's either JPEG or PNG
                    $imageName = time() . '.' . $image->getClientOriginalExtension();

                    // Move the headshot to manufacturer image folder
                    $image->move(public_path('images/barangay_avatar'), $imageName);
                }

                User::where('id', $userId)->update(['avatar' => $imageName]);

                $status = 'success';
            } else {
                $status = 'failed';
            }

            return Inertia::render($this->edit, [
                'status' => $status,
                'data' => $user,
            ]);
        } catch (\Throwable $th) {
            return Inertia::render($this->edit, [
                'status' => 'failed',
                'data' => $user,
            ]);
        }
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Blotter;
use App\Models\ContactUs;
use App\Models\User;
use App\Services\BlotterService;
use App\Services\IncidentService;
use App\Services\UserService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
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

        // Get Top 10 Most Crime of the barangay
        $top10Cases = Blotter::select('incident_type', DB::raw('COUNT(*) as count'))
            ->where('user_id', $userId)
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

        return Inertia::render('Dashboard', [
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
            'top10Cases' => $top10Cases,
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

    /** 
     * Method to send message from contact us
     * @param \Illuminate\Http\Request $request The HTTP request
     *
     * @return Response
     */
    public function sendMessageFromContactUs(Request $request)
    {
        $data = $request->get('data');

        try {
            ContactUs::create($data);

            return Inertia::render('/contact-us');
        } catch (\Throwable $th) {
            throw $th;
        }
    }
}

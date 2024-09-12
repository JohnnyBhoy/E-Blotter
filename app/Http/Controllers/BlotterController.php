<?php

namespace App\Http\Controllers;

use App\Models\Blotter;
use App\Models\User;
use App\Models\UserAddress;
use App\Services\BlotterService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class BlotterController extends Controller
{
    protected $blotterService;
    public $blottersUrl = 'Blotter/Blotters';

    public function __construct(BlotterService $blotterService)
    {
        $this->blotterService = $blotterService;
    }

    /**
     * Method to create blotter data based on
     * @param \Illuminate\Http\Request $request The HTTP request
     */
    public function index(Request $request)
    {
        $userId = auth()->user()->id;

        try {
            $latestBlotter = $this->blotterService->getLatest($userId);

            $latestBlotterId = is_null($latestBlotter) ? 1 : $latestBlotter->entry_number + 1;

            return Inertia::render('Blotter/New', [
                'latestID' => $latestBlotterId
            ]);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th], 500);
        }
    }

    /**
     * Method to create blotter data based on
     * @param \Illuminate\Http\Request $request The HTTP request
     */
    public function create(Request $request)
    {
        $userId = auth()->user()->id;
        $imageName = "";

        try {
            $this->blotterService->create($request);

            // Checker if the uploaded blotter entry has a incident picture
            if ($request->hasFile('uploaded_file')) {
                $image = $request->file('uploaded_file');

                // Get the MIME type of the uploaded file
                $mime = $image->getMimeType();

                if ($mime === 'image/jpeg' || $mime === 'image/png' || $mime === 'image/jpg') {
                    // Process the image since it's either JPEG or PNG
                    $imageName = time() . '.' . $image->getClientOriginalExtension();

                    // Move the headshot to manufacturer image folder
                    $image->move(public_path('images/incidents'), $imageName);
                }

                // Update blotter incident image
                Blotter::where('user_id', $userId)
                    ->where('entry_number', $request->get('entry_number'))
                    ->update(['uploaded_file' => $imageName]);
            }

            // Get all the blotter of the giver barangay id
            $blotters = $this->blotterService->getAll(10, 1, "", $userId, 0, 0);

            return Inertia::render($this->blottersUrl, [
                'blotters' => $blotters,
                'message' => 'Blotter entry submitted.',
            ]);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th], 500);
        }
    }



    /**
     * Method to retrieve all blotter entries
     * @param \Illuminate\Http\Request $request The HTTP request
     */
    public function getAll(Request $request)
    {

        $brgyCode = $request->get('brgy_code');
        $remark = $request->get('remarks') ?? 0;
        $incidentType = $request->get('incident_type') ?? 0;

        $userId = 0;

        // Get Barangays with blotter records
        $brgyWithRecords = DB::table("user_addresses as ua")
            ->leftJoin("blotters as b", "ua.user_id", '=', 'b.user_id')
            ->selectRaw('DISTINCT ua.barangay_code')
            ->groupBy('ua.barangay_code')
            ->get()
            ->toArray();

        if (intVal($brgyCode > 0)) {
            $user = UserAddress::where('barangay_code', $brgyCode)->first();
            $userId = $user->id ?? auth()->user()->id;
        } else {
            $userId =  auth()->user()->id;
        }

        $perPage = $request->get('per_page') ?? 10;
        $page = $request->get('page') ?? 1;
        $keyword = $request->get('keyword') ?? "";

        $user = UserAddress::where('id', $userId)->first();

        try {
            $blotters = $this->blotterService->getAll(intVal($perPage), $page, $keyword, $userId, intVal($remark), intVal($incidentType));

            return Inertia::render($this->blottersUrl, [
                'blotters' => $blotters,
                'message' => 'successful retrieve',
                'pageDisplay' => $perPage,
                'pageNumber' => $page,
                'keyword' => $keyword,
                'cityCode' => auth()->user()->role == 1 ? null : $user->city_code,
                'brgyCode' => $brgyCode,
                'remark' => intval($remark),
                'incidentType' => intval($incidentType),
                'brgyWithRecords' => $brgyWithRecords,
            ]);
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    /**
     * Delete blotter record
     * @param \Illuminate\Http\Request $request The HTTP request
     */
    public function delete(Request $request)
    {
        $userId = auth()->user()->id;
        $id = $request->get('id');

        try {
            $this->blotterService->delete($id);

            $blotters = $this->blotterService->getAll(10, 1, "", $userId, 0, 0);

            return Inertia::render('Blotter/Blotters', [
                'blotters' => $blotters,
                'message' => 'Blotter removed successfully.',
            ]);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th], 500);
        }
    }

    /**
     * Method to edit blotter data based on
     * @param \Illuminate\Http\Request $request The HTTP request
     */
    public function get(Request $request)
    {
        $id = $request->get('id');

        try {
            $blotter = $this->blotterService->get($id);

            return Inertia::render('Blotter/Edit', [
                'blotter' => $blotter
            ]);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th], 500);
        }
    }

    /**
     * Method to get monthly blotter data based on
     * @param \Illuminate\Http\Request $request The HTTP request
     */
    public function getYearlyBlotterByMonth(Request $request)
    {
        $userId = auth()->user()->id;
        $year = $request->get('blotterYear');

        try {
            $monthlyBlotters = $this->blotterService->getYearlyBlotterByMonth($userId, $year);

            return Inertia::render('Blotter/Monthly', [
                'year' => $year,
                'monthlyBlotters' => $monthlyBlotters,
            ]);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th], 500);
        }
    }

    /**
     * Method to get daily blotter data based on
     * @param \Illuminate\Http\Request $request The HTTP request
     */
    public function getDailyBlotterByMonth(Request $request)
    {
        $userId = auth()->user()->id;
        $year = $request->get('blotterYear');
        $month = $request->get('blotterMonth');

        try {
            $dailyBlotters = $this->blotterService->getDailyBlotterByMonth($userId, $year, $month);

            return Inertia::render('Blotter/Daily', [
                'year' => $year,
                'month' => $month,
                'dailyBlotters' => $dailyBlotters,
            ]);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th], 500);
        }
    }

    /**
     * Method to retrieve all blotter entries
     * @param \Illuminate\Http\Request $request The HTTP request
     */
    public function getBlotterByRemarks(Request $request)
    {
        $userId = auth()->user()->id;
        $perPage = $request->get('per_page') ?? 10;
        $page = $request->get('page') ?? 1;
        $keyword = $request->get('keyword') ?? "";
        $remark = $request->get('remark') ?? "";

        try {
            $blotters = $this->blotterService->getBlotterByRemarks($perPage, $page, $keyword, $userId, $remark);

            return Inertia::render('Hearing', [
                'blotters' => $blotters,
                'message' => 'successful retrieve',
                'pageDisplay' => $perPage,
                'pageNumber' => $page,
                'keyword' => $keyword,
            ]);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th], 500);
        }
    }

    /**
     * Method to view blotter data based on
     * @param \Illuminate\Http\Request $request The HTTP request
     */
    public function view(Request $request)
    {
        $id = $request->get('id');

        try {
            $blotter = $this->blotterService->get($id);

            return Inertia::render('Blotter/View', [
                'blotter' => $blotter
            ]);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th], 500);
        }
    }
}

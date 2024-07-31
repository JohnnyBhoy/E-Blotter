<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserAddress;
use App\Services\BlotterService;
use Illuminate\Http\Request;
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

        try {
            $this->blotterService->create($request);

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
        // Set url redirection based on role
        //$role = auth()->user()->role;
        //$redirectUrl = $this->blottersUrl;
        //if ($role == 3) {
        //    $redirectUrl = 'Blotter/Blotters';
        //}

        $brgyCode = $request->get('brgy_code');
        $remark = $request->get('remarks') ?? 0;
        $incidentType = $request->get('incident_type') ?? 0;

        $userId = 0;

        if ($brgyCode > 0) {
            $user = UserAddress::where('barangay_code', $brgyCode)->first();
            $userId = $user->id;
        } else {
            $userId =  auth()->user()->id;
        }

        $perPage = $request->get('per_page') ?? 10;
        $page = $request->get('page') ?? 1;
        $keyword = $request->get('keyword') ?? "";

        $user = UserAddress::where('id', $userId)->first();

        try {
            $blotters = $this->blotterService->getAll($perPage, $page, $keyword, $userId, $remark, $incidentType);

            return Inertia::render($this->blottersUrl, [
                'blotters' => $blotters,
                'message' => 'successful retrieve',
                'pageDisplay' => $perPage,
                'pageNumber' => $page,
                'keyword' => $keyword,
                'cityCode' => $user->city_code,
                'brgyCode' => $brgyCode,
                'remark' => intval($remark),
                'incidentType' => intval($incidentType),
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
}

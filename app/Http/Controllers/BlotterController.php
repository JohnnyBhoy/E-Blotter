<?php

namespace App\Http\Controllers;

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
            $this->blotterService->create($request, $userId);

            $blotters = $this->blotterService->getAll(10, 1, "", $userId);

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
        $userId = auth()->user()->id;
        $perPage = $request->get('per_page') ?? 10;
        $page = $request->get('page') ?? 1;
        $keyword = $request->get('keyword') ?? "";

        try {
            $blotters = $this->blotterService->getAll($perPage, $page, $keyword, $userId);

            return Inertia::render($this->blottersUrl, [
                'blotters' => $blotters,
                'message' => '',
            ]);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th], 500);
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

            $blotters = $this->blotterService->getAll(10, 1, "", $userId);

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
}

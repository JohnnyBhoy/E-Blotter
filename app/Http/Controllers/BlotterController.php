<?php

namespace App\Http\Controllers;

use App\Services\BlotterService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BlotterController extends Controller
{
    protected $blotterService;

    public function __construct(BlotterService $blotterService)
    {
        $this->blotterService = $blotterService;
    }

    /**
     * Method to create blotter data based on
     * @param \Illuminate\Http\Request $request The HTTP request
     * @return JsonResponse Json response
     */
    public function create(Request $request)
    {
        try {
            $this->blotterService->create($request);

            return response()->json(['message' => 'Blotter entry submitted.'], 201);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th], 500);
        }
    }
}

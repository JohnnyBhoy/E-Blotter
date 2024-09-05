<?php

namespace App\Http\Controllers;

use App\Models\Incident;
use App\Services\IncidentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class IncidentController extends Controller
{
    protected $incidentService;

    // Class constructor
    public function __construct(IncidentService $incidentService)
    {
        $this->incidentService = $incidentService;
    }

    /**
     * Method to create blotter data based on
     * @param \Illuminate\Http\Request $request The HTTP request
     */
    public function getMonthly(Request $request)
    {
        $userId = auth()->user()->id;

        try {
            $incidents = $this->incidentService->getMonthly($userId);

            return Inertia::render('Incidents', [
                'incidents' => $incidents,
            ]);
        } catch (\Throwable $th) {
            return $th;
        }
    }

    /**
     * Create Incident Report
     * @param \Illuminate\Http\Request $request The HTTP request
     * @return RedirectResponse
     */
    public function createIncidentReport(Request $request)
    {
        $data = $request->get('data');

        try {
            Incident::create($data);

            return to_route('home');
        } catch (\Throwable $th) {
            throw $th;
        }
    }
}

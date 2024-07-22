<?php

namespace App\Http\Controllers;

use App\Services\IncidentService;
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
}

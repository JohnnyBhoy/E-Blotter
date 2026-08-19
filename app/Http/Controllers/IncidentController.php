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
        // Blank number inputs arrive as "", which fails `integer` even with
        // `nullable`. Normalise them before validating.
        $payload = $request->get('data');
        if (is_array($payload)) {
            foreach (['age', 'number_of_people_involved', 'reporter_zip_code'] as $numeric) {
                if (isset($payload[$numeric]) && $payload[$numeric] === '') {
                    $payload[$numeric] = null;
                }
            }
            $request->merge(['data' => $payload]);
        }

        // This route is public. Validate the nested `data` payload explicitly
        // rather than mass-assigning whatever the client sent.
        $validated = $request->validate([
            'data' => 'required|array',
            'data.incident_type' => 'required|integer',
            'data.date_reported' => 'required|date',
            'data.time_reported' => 'required|string|max:20',
            'data.date_of_incident' => 'required|date',
            'data.time_of_incident' => 'required|string|max:20',
            'data.purok' => 'nullable|string|max:255',
            'data.barangay' => 'nullable|string|max:255',
            'data.city' => 'nullable|string|max:255',
            'data.province' => 'nullable|string|max:255',
            'data.landmark_location' => 'nullable|string|max:500',
            'data.family_name' => 'required|string|max:255',
            'data.first_name' => 'nullable|string|max:255',
            'data.middle_name' => 'nullable|string|max:255',
            'data.age' => 'nullable|integer|min:0|max:150',
            'data.contact_number' => 'required|string|max:20',
            'data.relationship_to_the_incident' => 'nullable|string|max:255',
            'data.reporter_purok' => 'nullable|string|max:255',
            'data.reporter_barangay' => 'nullable|string|max:255',
            'data.reporter_city' => 'nullable|string|max:255',
            'data.reporter_province' => 'nullable|string|max:255',
            'data.reporter_zip_code' => 'nullable|integer',
            'data.narrative_of_incident' => 'required|string|max:5000',
            'data.number_of_people_involved' => 'nullable|integer|min:0',
            'data.perpetrator_details' => 'nullable|string|max:2000',
            'data.victim_details' => 'nullable|string|max:2000',
        ]);

        Incident::create($validated['data']);

        return to_route('home')->with('success', 'Incident report submitted.');
    }
}

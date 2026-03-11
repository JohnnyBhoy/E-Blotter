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
        $validated = $request->validate([
            'data.incident_type'               => 'required|string|max:255',
            'data.date_reported'               => 'required|date',
            'data.time_reported'               => 'required|string|max:10',
            'data.date_of_incident'            => 'required|date',
            'data.time_of_incident'            => 'required|string|max:10',
            'data.purok'                       => 'nullable|string|max:255',
            'data.barangay'                    => 'required|string|max:255',
            'data.city'                        => 'required|string|max:255',
            'data.province'                    => 'required|string|max:255',
            'data.landmark_location'           => 'nullable|string|max:500',
            'data.family_name'                 => 'required|string|max:255',
            'data.first_name'                  => 'required|string|max:255',
            'data.middle_name'                 => 'nullable|string|max:255',
            'data.age'                         => 'required|integer|min:1|max:150',
            'data.contact_number'              => 'required|digits_between:7,15',
            'data.relationship_to_the_incident'=> 'required|string|max:255',
            'data.reporter_purok'              => 'nullable|string|max:255',
            'data.reporter_barangay'           => 'required|string|max:255',
            'data.reporter_city'               => 'required|string|max:255',
            'data.reporter_province'           => 'required|string|max:255',
            'data.reporter_zip_code'           => 'nullable|digits_between:4,6',
            'data.narrative_of_incident'       => 'required|string|max:5000',
            'data.number_of_people_involved'   => 'required|integer|min:1',
            'data.perpetrator_details'         => 'nullable|string|max:2000',
            'data.victim_details'              => 'nullable|string|max:2000',
        ]);

        try {
            Incident::create($validated['data']);

            return to_route('home');
        } catch (\Throwable $th) {
            return back()->withErrors(['message' => 'Failed to submit incident report. Please try again.']);
        }
    }
}

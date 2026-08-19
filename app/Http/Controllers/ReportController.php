<?php

namespace App\Http\Controllers;

use App\Models\Incident;
use App\Models\IncidentReport;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    protected $incidentService;

    // Class constructor
    public function __construct()
    {
        // No dependency injection needed for basic controller
    }

    /**
     * Helper method to determine fire severity
     */
    private function getFireSeverity($fireSize): string
    {
        switch ($fireSize) {
            case 'small':
                return 'low';
            case 'medium':
                return 'medium';
            case 'large':
                return 'high';
            case 'massive':
                return 'critical';
            default:
                return 'medium';
        }
    }

    /**
     * Helper method to determine general incident severity
     */
    private function getIncidentSeverity($severity): string
    {
        switch ($severity) {
            case 'low':
                return 'low';
            case 'medium':
                return 'medium';
            case 'high':
                return 'high';
            case 'critical':
                return 'critical';
            default:
                return 'medium';
        }
    }

    /**
     * Helper method to determine accident severity
     */
    private function getAccidentSeverity($injuries): string
    {
        switch ($injuries) {
            case 'none':
                return 'low';
            case 'minor':
                return 'medium';
            case 'serious':
                return 'high';
            case 'critical':
            case 'fatalities':
                return 'critical';
            default:
                return 'medium';
        }
    }

    /**
     * Helper method to determine agency for incident type
     */
    private function getAgencyForIncident($incidentType): string
    {
        switch ($incidentType) {
            case 'public_disturbance':
            case 'vandalism':
            case 'theft':
            case 'fraud':
            case 'missing_person':
            case 'suspicious_activity':
                return 'PNP';
            case 'animal_control':
                return 'Animal Control';
            case 'noise_complaint':
                return 'Local Government';
            case 'traffic_violation':
                return 'Traffic Enforcement';
            case 'environmental':
                return 'Environmental Agency';
            default:
                return 'Local Government';
        }
    }
    /**
     * Submit Crime Report
     */
    public function submitCrime(Request $request): RedirectResponse
    {
        $validator = Validator::make($request->all(), [
            'reporter_name' => 'required|string|max:255',
            'reporter_contact' => 'required|string|max:20',
            'victim_name' => 'nullable|string|max:255',
            'incident_date' => 'required|date',
            'incident_time' => 'required',
            'location' => 'required|string|max:500',
            'description' => 'required|string|max:2000',
            'suspect_description' => 'nullable|string|max:1000',
            'witnesses' => 'nullable|string|max:1000',
            'evidence_description' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return back()
                ->withErrors($validator)
                ->withInput();
        }

        try {
            Incident::create([
                'incident_type' => 'crime',
                'report_category' => 'crime',
                'agency_assigned' => 'PNP',
                'severity_level' => 'medium', // Default for crimes
                'status' => 'pending',
                'is_emergency' => true,
                'date_reported' => now()->format('Y-m-d'),
                'time_reported' => now()->format('H:i:s'),
                'date_of_incident' => $request->incident_date,
                'time_of_incident' => $request->incident_time,
                'landmark_location' => $request->location,
                'family_name' => $request->victim_name ?? 'Unknown',
                'first_name' => '',
                'middle_name' => '',
                'age' => 0,
                'contact_number' => $request->reporter_contact,
                'relationship_to_the_incident' => 'reporter',
                'reporter_purok' => '',
                'reporter_barangay' => '',
                'reporter_city' => '',
                'reporter_province' => '',
                'reporter_zip_code' => 0,
                'narrative_of_incident' => $request->description,
                'number_of_people_involved' => 0,
                'perpetrator_details' => $request->suspect_description,
                'victim_details' => $request->victim_name,
                'additional_data' => json_encode([
                    'witnesses' => $request->witnesses,
                    'evidence_description' => $request->evidence_description,
                ]),
            ]);

            return redirect()->route('home')
                ->with('success', 'Crime report submitted successfully! PNP has been notified.');

        } catch (\Throwable $th) {
            return back()
                ->with('error', 'Failed to submit crime report. Please try again.')
                ->withInput();
        }
    }

    /**
     * Submit Fire Report
     */
    public function submitFire(Request $request): RedirectResponse
    {
        $validator = Validator::make($request->all(), [
            'reporter_name' => 'required|string|max:255',
            'reporter_contact' => 'required|string|max:20',
            'incident_date' => 'required|date',
            'incident_time' => 'required',
            'location' => 'required|string|max:500',
            'building_type' => 'required|string|max:100',
            'fire_size' => 'required|string|max:50',
            'people_trapped' => 'required|string|max:50',
            'injuries' => 'required|string|max:50',
            'description' => 'required|string|max:2000',
            'fire_cause' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return back()
                ->withErrors($validator)
                ->withInput();
        }

        try {
            Incident::create([
                'incident_type' => 'fire',
                'report_category' => 'fire',
                'agency_assigned' => 'BFP',
                'severity_level' => $this->getFireSeverity($request->fire_size),
                'status' => 'pending',
                'is_emergency' => true,
                'date_reported' => now()->format('Y-m-d'),
                'time_reported' => now()->format('H:i:s'),
                'date_of_incident' => $request->incident_date,
                'time_of_incident' => $request->incident_time,
                'landmark_location' => $request->location,
                'family_name' => $request->reporter_name,
                'first_name' => '',
                'middle_name' => '',
                'age' => 0,
                'contact_number' => $request->reporter_contact,
                'relationship_to_the_incident' => 'reporter',
                'reporter_purok' => '',
                'reporter_barangay' => '',
                'reporter_city' => '',
                'reporter_province' => '',
                'reporter_zip_code' => 0,
                'narrative_of_incident' => $request->description,
                'number_of_people_involved' => 0,
                'perpetrator_details' => $request->fire_cause ?? 'Unknown',
                'victim_details' => 'Fire incident reported',
                'additional_data' => json_encode([
                    'building_type' => $request->building_type,
                    'fire_size' => $request->fire_size,
                    'people_trapped' => $request->people_trapped,
                    'injuries' => $request->injuries,
                    'fire_cause' => $request->fire_cause,
                ]),
            ]);

            return redirect()->route('home')
                ->with('success', 'Fire report submitted successfully! BFP has been notified.');

        } catch (\Throwable $th) {
            return back()
                ->with('error', 'Failed to submit fire report. Please try again.')
                ->withInput();
        }
    }

    /**
     * Submit General Incident Report
     */
    public function submitIncident(Request $request): RedirectResponse
    {
        $validator = Validator::make($request->all(), [
            'reporter_name' => 'required|string|max:255',
            'reporter_contact' => 'required|string|max:20',
            'incident_type' => 'required|string|max:100',
            'incident_date' => 'required|date',
            'incident_time' => 'required',
            'location' => 'required|string|max:500',
            'description' => 'required|string|max:2000',
            'severity' => 'required|string|max:50',
            'people_involved' => 'nullable|string|max:1000',
            'action_taken' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return back()
                ->withErrors($validator)
                ->withInput();
        }

        try {
            Incident::create([
                'incident_type' => $request->incident_type,
                'report_category' => 'general',
                'agency_assigned' => $this->getAgencyForIncident($request->incident_type),
                'severity_level' => $this->getIncidentSeverity($request->severity),
                'status' => 'pending',
                'is_emergency' => $request->severity === 'critical',
                'date_reported' => now()->format('Y-m-d'),
                'time_reported' => now()->format('H:i:s'),
                'date_of_incident' => $request->incident_date,
                'time_of_incident' => $request->incident_time,
                'landmark_location' => $request->location,
                'family_name' => $request->reporter_name,
                'first_name' => '',
                'middle_name' => '',
                'age' => 0,
                'contact_number' => $request->reporter_contact,
                'relationship_to_the_incident' => 'reporter',
                'reporter_purok' => '',
                'reporter_barangay' => '',
                'reporter_city' => '',
                'reporter_province' => '',
                'reporter_zip_code' => 0,
                'narrative_of_incident' => $request->description,
                'number_of_people_involved' => 0,
                'perpetrator_details' => $request->people_involved ?? 'None',
                'victim_details' => 'General incident reported',
                'additional_data' => json_encode([
                    'severity' => $request->severity,
                    'people_involved' => $request->people_involved,
                    'action_taken' => $request->action_taken,
                ]),
            ]);

            return redirect()->route('home')
                ->with('success', 'Incident report submitted successfully! Appropriate authorities will be notified.');

        } catch (\Throwable $th) {
            return back()
                ->with('error', 'Failed to submit incident report. Please try again.')
                ->withInput();
        }
    }

    /**
     * Submit Accident Report
     */
    public function submitAccident(Request $request): RedirectResponse
    {
        $validator = Validator::make($request->all(), [
            'reporter_name' => 'required|string|max:255',
            'reporter_contact' => 'required|string|max:20',
            'accident_type' => 'required|string|max:100',
            'incident_date' => 'required|date',
            'incident_time' => 'required',
            'location' => 'required|string|max:500',
            'description' => 'required|string|max:2000',
            'injuries' => 'required|string|max:50',
            'vehicles_involved' => 'nullable|string|max:200',
            'weather_conditions' => 'nullable|string|max:100',
            'road_conditions' => 'nullable|string|max:100',
            'emergency_services' => 'nullable|string|max:50',
        ]);

        if ($validator->fails()) {
            return back()
                ->withErrors($validator)
                ->withInput();
        }

        try {
            Incident::create([
                'incident_type' => 'accident',
                'report_category' => 'accident',
                'agency_assigned' => 'EMS',
                'severity_level' => $this->getAccidentSeverity($request->injuries),
                'status' => 'pending',
                'is_emergency' => in_array($request->injuries, ['critical', 'fatalities']),
                'date_reported' => now()->format('Y-m-d'),
                'time_reported' => now()->format('H:i:s'),
                'date_of_incident' => $request->incident_date,
                'time_of_incident' => $request->incident_time,
                'landmark_location' => $request->location,
                'family_name' => $request->reporter_name,
                'first_name' => '',
                'middle_name' => '',
                'age' => 0,
                'contact_number' => $request->reporter_contact,
                'relationship_to_the_incident' => 'reporter',
                'reporter_purok' => '',
                'reporter_barangay' => '',
                'reporter_city' => '',
                'reporter_province' => '',
                'reporter_zip_code' => 0,
                'narrative_of_incident' => $request->description,
                'number_of_people_involved' => 0,
                'perpetrator_details' => $request->vehicles_involved ?? 'None',
                'victim_details' => 'Accident reported - ' . $request->accident_type,
                'additional_data' => json_encode([
                    'accident_type' => $request->accident_type,
                    'vehicles_involved' => $request->vehicles_involved,
                    'weather_conditions' => $request->weather_conditions,
                    'road_conditions' => $request->road_conditions,
                    'injuries' => $request->injuries,
                    'emergency_services' => $request->emergency_services,
                ]),
            ]);

            return redirect()->route('home')
                ->with('success', 'Accident report submitted successfully! Emergency services have been notified.');

        } catch (\Throwable $th) {
            return back()
                ->with('error', 'Failed to submit accident report. Please try again.')
                ->withInput();
        }
    }
}

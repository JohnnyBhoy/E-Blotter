<?php

namespace App\Http\Controllers\API;

use App\Models\IncidentReport;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class IncidentReportController extends Controller
{
    public function index()
    {
        return IncidentReport::orderBy('id', 'desc')->get();
    }

    public function store(Request $request)
    {
        // Only the validated keys are persisted — `$request->all()` would let a
        // caller set `incident_responder` or any other column on this open route.
        $data = $request->validate([
            'coordinates' => 'required|string|max:255',
            'location' => 'required|string|max:500',
            'incidentTypes' => 'required|integer',
            'description' => 'required|string|max:2000',
            'status' => 'required|integer',
            'file' => 'nullable|file|mimes:jpg,jpeg,png,pdf,docx|max:2048'
        ]);

        if ($request->hasFile('file')) {
            $data['file'] = $request->file('file')->store('incident_files', 'public');
        } else {
            unset($data['file']);
        }

        $report = IncidentReport::create($data);

        return response()->json($report, 201);
    }


    public function show(IncidentReport $incidentReport)
    {
        return $incidentReport;
    }

    public function update(Request $request, IncidentReport $incidentReport)
    {
        // Validate the incoming data
        $validated = $request->validate([
            'status' => 'nullable|integer',
            'incident_responder' => 'nullable|string',
        ]);

        // Update only the fields that are present
        $incidentReport->fill($validated);
        $incidentReport->save();

        return response()->json([
            'message' => 'Incident report updated successfully',
            'data' => $incidentReport
        ]);
    }

    public function destroy(IncidentReport $incidentReport)
    {
        $incidentReport->delete();
        return response()->json(null, 204);
    }
}

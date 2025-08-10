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
        $request->validate([
            'coordinates' => 'required|string',
            'location' => 'required|string',
            'incidentTypes' => 'required|integer',
            'description' => 'required|string',
            'status' => 'required|integer',
            'file' => 'nullable|file|mimes:jpg,jpeg,png,pdf,docx|max:2048'
        ]);

        $data = $request->all();

        if ($request->hasFile('file')) {
            $data['file'] = $request->file('file')->store('incident_files', 'public');
        }

        try {
            $report = IncidentReport::create($data);
        } catch (\Throwable $th) {
            throw $th;
        }

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

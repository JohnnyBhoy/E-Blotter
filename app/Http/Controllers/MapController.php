<?php

namespace App\Http\Controllers;

use App\Models\IncidentReport;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MapController extends Controller
{
    /**
     * Geographic centre of the Philippines, used when a barangay account has
     * no coordinates of its own saved yet.
     */
    private const FALLBACK_CENTER = [12.8797, 121.7740];

    /**
     * Barangay incident map.
     *
     * The page used to be a hard-coded Google Maps iframe pointing at Sibalom
     * Public Market, so every barangay saw the same place and no incident was
     * ever plotted. It now centres on the signed-in barangay and plots the
     * emergency reports that carry usable coordinates.
     */
    public function index(Request $request)
    {
        $user = auth()->user();

        $lat = is_numeric($user->lat) ? (float) $user->lat : null;
        $lng = is_numeric($user->lang) ? (float) $user->lang : null;

        $reports = IncidentReport::orderByDesc('id')
            ->limit(300)
            ->get()
            ->map(function (IncidentReport $report) {
                // `coordinates` is free text written by the reporting app; keep
                // only rows that parse into a real lat/lng pair.
                $parts = preg_split('/[,\s]+/', trim((string) $report->coordinates)) ?: [];

                if (count($parts) < 2 || !is_numeric($parts[0]) || !is_numeric($parts[1])) {
                    return null;
                }

                return [
                    'id' => $report->id,
                    'lat' => (float) $parts[0],
                    'lng' => (float) $parts[1],
                    'location' => $report->location,
                    'description' => $report->description,
                    'incidentTypes' => (int) $report->incidentTypes,
                    'status' => (int) $report->status,
                    'responder' => $report->incident_responder,
                    'created_at' => $report->created_at?->toIso8601String(),
                ];
            })
            ->filter()
            ->values();

        $payload = [
            'center' => [
                $lat ?? self::FALLBACK_CENTER[0],
                $lng ?? self::FALLBACK_CENTER[1],
            ],
            'hasOwnLocation' => $lat !== null && $lng !== null,
            'reports' => $reports,
        ];

        // The console shows the map in a modal and asks for it over XHR.
        if ($request->wantsJson() && !$request->header('X-Inertia')) {
            return response()->json($payload);
        }

        return Inertia::render('Map/Index', $payload);
    }
}

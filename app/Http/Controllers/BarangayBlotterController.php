<?php

namespace App\Http\Controllers;

use App\Models\Blotter;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class BarangayBlotterController extends Controller
{
    /**
     * Display a listing of blotters for the authenticated barangay user.
     */
    public function index(): JsonResponse
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }
        
        $blotters = Blotter::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($blotters);
    }

    /**
     * Store a newly created blotter report.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'date_reported' => 'required|date',
            'time_of_report' => 'required|string|max:10',
            'incident_type' => 'required|string|max:255',
            'narrative' => 'required|string',
            'remarks' => 'nullable|string',
            'date_of_incident' => 'nullable|date',
            'time_of_incident' => 'nullable|string|max:10',
            'complainant_signature' => 'nullable|string|max:255',
            'recorded_by_signature' => 'nullable|string|max:255',
        ]);

        $user = Auth::user();
        
        // Generate entry number
        $entryNumber = $this->generateEntryNumber();
        
        $blotter = Blotter::create([
            'user_id' => $user->id,
            'entry_number' => $entryNumber,
            'date_reported' => $validated['date_reported'],
            'time_of_report' => $validated['time_of_report'],
            'incident_type' => $validated['incident_type'],
            'narrative' => $validated['narrative'],
            'remarks' => $validated['remarks'] ?? null,
            'date_of_incident' => $validated['date_of_incident'] ?? null,
            'time_of_incident' => $validated['time_of_incident'] ?? null,
            'complainant_signature' => $validated['complainant_signature'] ?? null,
            'recorded_by_signature' => $validated['recorded_by_signature'] ?? null,
            'recorded_by' => $user->name,
        ]);

        return response()->json($blotter, 201);
    }

    /**
     * Display the specified blotter.
     */
    public function show($id): JsonResponse
    {
        $user = Auth::user();
        $blotter = Blotter::where('user_id', $user->id)
            ->where('id', $id)
            ->first();

        if (!$blotter) {
            return response()->json(['error' => 'Blotter not found'], 404);
        }

        return response()->json($blotter);
    }

    /**
     * Update the specified blotter.
     */
    public function update(Request $request, $id): JsonResponse
    {
        $user = Auth::user();
        $blotter = Blotter::where('user_id', $user->id)
            ->where('id', $id)
            ->first();

        if (!$blotter) {
            return response()->json(['error' => 'Blotter not found'], 404);
        }

        $validated = $request->validate([
            'date_reported' => 'required|date',
            'time_of_report' => 'required|string|max:10',
            'incident_type' => 'required|string|max:255',
            'narrative' => 'required|string',
            'remarks' => 'nullable|string',
            'date_of_incident' => 'nullable|date',
            'time_of_incident' => 'nullable|string|max:10',
            'complainant_signature' => 'nullable|string|max:255',
            'recorded_by_signature' => 'nullable|string|max:255',
        ]);

        $blotter->update($validated);

        return response()->json($blotter);
    }

    /**
     * Remove the specified blotter.
     */
    public function destroy($id): JsonResponse
    {
        $user = Auth::user();
        $blotter = Blotter::where('user_id', $user->id)
            ->where('id', $id)
            ->first();

        if (!$blotter) {
            return response()->json(['error' => 'Blotter not found'], 404);
        }

        $blotter->delete();

        return response()->json(['message' => 'Blotter deleted successfully']);
    }

    /**
     * Get all reports for viewing.
     */
    public function reports(): JsonResponse
    {
        $user = Auth::user();
        $blotters = Blotter::where('user_id', $user->id)
            ->with(['user'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($blotters);
    }

    /**
     * Export reports to CSV.
     */
    public function export(): JsonResponse
    {
        $user = Auth::user();
        $blotters = Blotter::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        $filename = "barangay-blotter-reports-" . date('Y-m-d') . ".csv";
        
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];

        $callback = function() use ($blotters) {
            $file = fopen('php://output', 'w');
            
            // CSV header
            fputcsv($file, [
                'Entry #',
                'Barangay',
                'Date Reported',
                'Time Reported',
                'Incident Type',
                'Narrative',
                'Remarks',
                'Status',
                'Created At'
            ]);

            // CSV data
            foreach ($blotters as $blotter) {
                fputcsv($file, [
                    $blotter->entry_number,
                    $blotter->barangay,
                    $blotter->date_reported,
                    $blotter->time_of_report,
                    $blotter->incident_type,
                    $blotter->narrative,
                    $blotter->remarks ?? '',
                    $blotter->status ?? 'Pending',
                    $blotter->created_at
                ]);
            }

            fclose($file);
            return file_get_contents('php://output');
        };

        return response()->streamDownload($callback(), 200, $headers);
    }

    /**
     * Get statistics for dashboard.
     */
    public function statistics(): JsonResponse
    {
        $user = Auth::user();
        
        $total = Blotter::where('user_id', $user->id)->count();
        $pending = Blotter::where('user_id', $user->id)
            ->where('status', 'Pending')
            ->count();
        $resolved = Blotter::where('user_id', $user->id)
            ->where('status', 'Resolved')
            ->count();
        
        $thisMonth = Blotter::where('user_id', $user->id)
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();

        $stats = [
            'total' => $total,
            'pending' => $pending,
            'resolved' => $resolved,
            'this_month' => $thisMonth,
        ];

        return response()->json($stats);
    }

    /**
     * Generate unique entry number for blotter reports.
     */
    private function generateEntryNumber(): string
    {
        $year = date('Y');
        $sequence = DB::table('blotters')
            ->whereYear('created_at', $year)
            ->max('entry_number') + 1;
        
        return str_pad($sequence, 6, '0', STR_PAD_LEFT);
    }
}

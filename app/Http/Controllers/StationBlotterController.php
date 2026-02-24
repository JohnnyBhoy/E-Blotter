<?php

namespace App\Http\Controllers;

use App\Models\Blotter;
use App\Models\User;
use App\Models\UserAddress;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class StationBlotterController extends Controller
{
    /**
     * Display all blotters for the station (covers multiple barangays)
     */
    public function index(): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json(['message' => 'Unauthenticated'], 401);
            }

            // Get the station's ID
            $stationId = $user->station_id;
            
            if (!$stationId) {
                return response()->json([
                    'message' => 'Station ID not found for this user',
                    'user_id' => $user->id,
                    'user_name' => $user->name,
                    'user_email' => $user->email
                ], 404);
            }

            // Get all barangays under this station's jurisdiction (direct station_id relationship)
            $barangayUserIds = User::where('station_id', $stationId)
                ->where('role', 5) // Only barangay users
                ->pluck('id')
                ->toArray();

            // Get all blotters from these barangays
            $blotters = Blotter::whereIn('user_id', $barangayUserIds)
                ->with(['user' => function($query) {
                    $query->select('id', 'name');
                }])
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function($blotter) {
                    // Extract barangay name from user name (remove "Barangay Captain" suffix)
                    $userName = $blotter->user->name ?? 'Unknown Barangay';
                    $barangayName = str_replace(' Barangay Captain', '', $userName);
                    $barangayName = str_replace(' Barangay', '', $barangayName);
                    $blotter->barangay_name = trim($barangayName);
                    return $blotter;
                });

            // Calculate station-wide statistics
            $stationStats = [
                'total_cases' => $blotters->count(),
                'pending' => $blotters->filter(function($blotter) {
                    return stripos($blotter->remarks ?? '', 'pending') !== false;
                })->count(),
                'resolved' => $blotters->filter(function($blotter) {
                    return stripos($blotter->remarks ?? '', 'resolved') !== false;
                })->count(),
                'this_month' => $blotters->filter(function($blotter) {
                    $blotterDate = new \DateTime($blotter->created_at);
                    $currentDate = new \DateTime();
                    return $blotterDate->format('Y-m') === $currentDate->format('Y-m');
                })->count(),
                'barangays_covered' => count($barangayUserIds),
                'top_crime_types' => $blotters->groupBy('incident_type')
                    ->map(function($group) {
                        return $group->count();
                    })
                    ->sortDesc()
                    ->take(10)
                    ->toArray()
            ];

            // Calculate barangay-specific statistics
            $barangayStats = [];
            $barangayUsers = User::whereIn('id', $barangayUserIds)
                ->select('id', 'name')
                ->get();

            foreach ($barangayUsers as $barangayUser) {
                // Skip if user is null
                if (!$barangayUser) {
                    continue;
                }
                
                $barangayBlotters = $blotters->where('user_id', $barangayUser->id);
                
                // Extract barangay name from user name (remove "Barangay Captain" suffix)
                $userName = $barangayUser->name ?? 'Unknown Barangay';
                $barangayName = str_replace(' Barangay Captain', '', $userName);
                $barangayName = str_replace(' Barangay', '', $barangayName);
                $cleanBarangayName = trim($barangayName);
                
                $barangayStats[] = [
                    'barangay_name' => $cleanBarangayName,
                    'total_cases' => $barangayBlotters->count(),
                    'pending' => $barangayBlotters->filter(function($blotter) {
                        return stripos($blotter->remarks ?? '', 'pending') !== false;
                    })->count(),
                    'resolved' => $barangayBlotters->filter(function($blotter) {
                        return stripos($blotter->remarks ?? '', 'resolved') !== false;
                    })->count(),
                    'this_month' => $barangayBlotters->filter(function($blotter) {
                        $blotterDate = new \DateTime($blotter->created_at);
                        $currentDate = new \DateTime();
                        return $blotterDate->format('Y-m') === $currentDate->format('Y-m');
                    })->count()
                ];
            }

            return response()->json([
                'blotters' => $blotters,
                'station_stats' => $stationStats,
                'barangay_stats' => $barangayStats
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error fetching station data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created blotter (for station use)
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'date_reported' => 'required|date',
                'time_of_report' => 'required|string',
                'incident_type' => 'required|string|max:255',
                'narrative' => 'required|string',
                'remarks' => 'nullable|string',
                'date_of_incident' => 'nullable|date',
                'time_of_incident' => 'nullable|string',
                'complainant_signature' => 'nullable|string|max:255',
                'recorded_by_signature' => 'nullable|string|max:255',
                'barangay_user_id' => 'required|exists:users,id'
            ]);

            $user = Auth::user();
            
            // Generate entry number
            $entryNumber = $this->generateEntryNumber();
            
            $blotter = Blotter::create([
                'user_id' => $validated['barangay_user_id'],
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

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error creating blotter',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified blotter
     */
    public function show($id): JsonResponse
    {
        try {
            $user = Auth::user();
            
            // Get station's jurisdiction
            $stationId = $user->station_id;
            $barangayUserIds = User::where('station_id', $stationId)
                ->where('role', 5) // Only barangay users
                ->pluck('id')
                ->toArray();

            $blotter = Blotter::whereIn('user_id', $barangayUserIds)
                ->findOrFail($id);

            return response()->json($blotter);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Blotter not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update the specified blotter
     */
    public function update(Request $request, $id): JsonResponse
    {
        try {
            $user = Auth::user();
            
            // Get station's jurisdiction
            $stationId = $user->station_id;
            $barangayUserIds = User::where('station_id', $stationId)
                ->where('role', 5) // Only barangay users
                ->pluck('id')
                ->toArray();

            $blotter = Blotter::whereIn('user_id', $barangayUserIds)
                ->findOrFail($id);

            $validated = $request->validate([
                'date_reported' => 'required|date',
                'time_of_report' => 'required|string',
                'incident_type' => 'required|string|max:255',
                'narrative' => 'required|string',
                'remarks' => 'nullable|string',
                'date_of_incident' => 'nullable|date',
                'time_of_incident' => 'nullable|string',
                'complainant_signature' => 'nullable|string|max:255',
                'recorded_by_signature' => 'nullable|string|max:255',
            ]);

            $blotter->update($validated);

            return response()->json($blotter);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error updating blotter',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified blotter
     */
    public function destroy($id): JsonResponse
    {
        try {
            $user = Auth::user();
            
            // Get station's jurisdiction
            $stationId = $user->station_id;
            $barangayUserIds = User::where('station_id', $stationId)
                ->where('role', 5) // Only barangay users
                ->pluck('id')
                ->toArray();

            $blotter = Blotter::whereIn('user_id', $barangayUserIds)
                ->findOrFail($id);

            $blotter->delete();

            return response()->json(['message' => 'Blotter deleted successfully']);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error deleting blotter',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Generate unique entry number
     */
    private function generateEntryNumber(): string
    {
        $year = date('Y');
        $lastEntry = Blotter::whereYear('created_at', $year)
            ->orderBy('entry_number', 'desc')
            ->first();

        if ($lastEntry) {
            $lastNumber = intval(substr($lastEntry->entry_number, -6));
            $newNumber = $lastNumber + 1;
        } else {
            $newNumber = 1;
        }

        return sprintf('%06d', $newNumber);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Blotter;
use App\Models\User;
use App\Models\UserAddress;
use App\Services\BarangayService;
use App\Services\BlotterService;
use App\Services\CityService;
use App\Services\ProvinceService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProvinceController extends Controller
{
    protected $provinceService;
    protected $cityService;
    protected $barangayService;
    protected $blotterService;

    /** Constructor */
    public function __construct(
        ProvinceService $provinceService,
        CityService $cityService,
        BarangayService $barangayService,
        BlotterService $blotterService,
    ) {
        $this->provinceService = $provinceService;
        $this->cityService = $cityService;
        $this->barangayService = $barangayService;
        $this->blotterService = $blotterService;
    }

    /** Dashboard */
    public function dashboard()
    {
        $id = auth()->user()->id;
        $cityCode = 0;
        $provinces = $this->provinceService->get();
        $barangays = $this->barangayService->get($cityCode);
        $blotters = $this->blotterService->getCount();

        $provinceCode = UserAddress::where('user_id', $id)->first();
        
        // For province admin, get all users under their jurisdiction
        // If no province code found, use hardcoded Antique province (code 1) as fallback
        $provinceCodeValue = $provinceCode ? $provinceCode->province_code : 1;
        
        // Get municipalities under this province
        $municipalities = User::where('province_id', auth()->user()->id)
            ->where('role', 3) // Municipal role
            ->orderBy('name', 'asc')
            ->get(['id', 'name'])
            ->map(function ($municipality) {
                // Remove " Municipal Administrator" from the name
                $cleanName = str_replace(' Municipal Administrator', '', $municipality->name);
                return [
                    'id' => $municipality->id,
                    'name' => $cleanName
                ];
            });
        
        // Debug logging
        \Log::info('Province Dashboard - Municipalities count: ' . $municipalities->count());
        \Log::info('Province Dashboard - Municipalities data: ' . json_encode($municipalities->toArray()));
        
        // Get all user IDs under this province (municipalities, stations, barangays)
        // First, get all users where province_id matches the current province admin's ID
        $provinceUsers = User::where('province_id', auth()->user()->id)
            ->whereIn('role', [3, 4, 5]) // Municipal, Station, Barangay
            ->pluck('id')
            ->toArray();

        // Also get users from UserAddress with the same province_code
        $addressUsers = UserAddress::where('province_code', $provinceCodeValue)
            ->pluck('user_id')
            ->toArray();

        // Merge all user IDs
        $citiesId = array_merge($provinceUsers, $addressUsers);
        $citiesId = array_unique($citiesId);

        // If still no users found, get all municipal and station users
        if (empty($citiesId)) {
            $citiesId = User::whereIn('role', [3, 4])
                ->pluck('id')
                ->toArray();
        }

        $cities = $this->cityService->getCities($provinceCodeValue);

        $provinceTotalBlotterCount = Blotter::whereIn('user_id', $citiesId)->count();

        // Count by text-based remarks for province totals
        $forHearingCount = Blotter::whereIn('user_id', $citiesId)
            ->where('remarks', 'Awaiting court appearance')
            ->count();

        $amicablySettledCount = Blotter::whereIn('user_id', $citiesId)
            ->where(function($query) {
                $query->where('remarks', 'Settled amicably')
                      ->orWhere('remarks', 'Resolved - No charges filed');
            })
            ->count();

        $pendingCount = Blotter::whereIn('user_id', $citiesId)
            ->where('remarks', 'Pending - Under investigation')
            ->count();

        $referredToPnpCount = Blotter::whereIn('user_id', $citiesId)
            ->where('remarks', 'Referred to higher authority')
            ->count();

        // Get real data for municipal/station breakdown
        $municipalStationData = User::whereIn('id', $citiesId)
            ->where(function($query) {
                $query->where('role', 3) // Municipal
                      ->orWhere('role', 4); // Station
            })
            ->get()
            ->map(function($user) {
                $userId = $user->id;
                
                // Get barangay users under this municipal/station
                if ($user->role == 3) { // Municipal
                    $barangayIds = User::where('municipality_id', $userId)->pluck('id')->toArray();
                } else { // Station
                    $barangayIds = User::where('station_id', $userId)->pluck('id')->toArray();
                }
                
                // Count blotters from barangays under this jurisdiction
                $totalBlotters = Blotter::whereIn('user_id', $barangayIds)->count();
                
                // Count by text-based remarks
                $resolved = Blotter::whereIn('user_id', $barangayIds)
                    ->where(function($query) {
                        $query->where('remarks', 'Settled amicably')
                              ->orWhere('remarks', 'Resolved - No charges filed');
                    })
                    ->count();
                    
                $pending = Blotter::whereIn('user_id', $barangayIds)
                    ->where('remarks', 'Pending - Under investigation')
                    ->count();
                    
                $forHearing = Blotter::whereIn('user_id', $barangayIds)
                    ->where('remarks', 'Awaiting court appearance')
                    ->count();
                    
                $referredToPnp = Blotter::whereIn('user_id', $barangayIds)
                    ->where('remarks', 'Referred to higher authority')
                    ->count();
                
                return [
                    'name' => $user->name,
                    'role' => $user->role == 3 ? 'Municipal' : 'Station',
                    'blotter_count' => $totalBlotters,
                    'resolved' => $resolved,
                    'pending' => $pending,
                    'for_hearing' => $forHearing,
                ];
            })
            ->sortByDesc('blotter_count')
            ->values();

        // Get real monthly data for the last 6 months
        $monthlyData = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = now()->subMonths($i);
            $monthName = $month->format('M');
            $monthYear = $month->format('Y-m');
            
            $monthlyData[] = [
                'month' => $monthName,
                'cases' => Blotter::whereIn('user_id', $citiesId)
                    ->whereYear('created_at', $month->year)
                    ->whereMonth('created_at', $month->month)
                    ->count(),
                'resolved' => Blotter::whereIn('user_id', $citiesId)
                    ->whereYear('created_at', $month->year)
                    ->whereMonth('created_at', $month->month)
                    ->where(function($query) {
                        $query->where('remarks', 'Settled amicably')
                              ->orWhere('remarks', 'Resolved - No charges filed');
                    })
                    ->count(),
            ];
        }

        // Get recent blotter records for overview
        $recentBlotters = Blotter::whereIn('user_id', $citiesId)
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get()
            ->map(function($blotter) {
                return [
                    'id' => $blotter->id,
                    'entry_number' => $blotter->entry_number,
                    'barangay' => $blotter->barangay,
                    'incident_type' => $blotter->incident_type,
                    'date_reported' => $blotter->date_reported,
                    'remarks' => $blotter->remarks,
                    'reported_by' => $blotter->user->name ?? 'Unknown',
                    'status' => $this->getRemarkStatusText($blotter->remarks),
                ];
            });

        // Get high priority cases (pending cases with recent dates)
        $highPriorityCases = Blotter::whereIn('user_id', $citiesId)
            ->where('remarks', 3) // Pending
            ->where('created_at', '>=', now()->subDays(7))
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function($blotter) {
                return [
                    'id' => $blotter->id,
                    'entry_number' => $blotter->entry_number,
                    'barangay' => $blotter->barangay,
                    'incident_type' => $blotter->incident_type,
                    'days_pending' => now()->diffInDays($blotter->created_at),
                    'reported_by' => $blotter->user->name ?? 'Unknown',
                ];
            });

        return Inertia::render('Province/Dashboard', [
            'cities' => $cities,
            'barangays' => $barangays,
            'blotters' => $blotters,
            'totalBlotters' => $provinceTotalBlotterCount,
            'counts' =>  [
                'for_hearing' => $forHearingCount,
                'amicably_settled' => $amicablySettledCount,
                'pending' => $pendingCount,
                'referred_to_pnp' => $referredToPnpCount,
            ],
            'municipalStationData' => $municipalStationData,
            'monthlyData' => $monthlyData,
            'recentBlotters' => $recentBlotters,
            'highPriorityCases' => $highPriorityCases,
            'municipalities' => $municipalities,
        ]);
    }

    /**
     * Municipal Reports Page
     */
    public function municipalReports($municipalId)
    {
        // Get municipal details
        $municipal = User::findOrFail($municipalId);
        
        // Get all barangays under this municipality
        $barangays = User::where('municipality_id', $municipalId)
            ->where('role', 5) // Barangay role
            ->orderBy('name', 'asc')
            ->get(['id', 'name']);
        
        // Get all barangay user IDs under this municipality
        $barangayUserIds = $barangays->pluck('id')->toArray();
        
        // Get blotter records for all barangays under this municipality
        $blotters = Blotter::whereIn('user_id', $barangayUserIds)
            ->with(['user', 'complainant', 'respondent'])
            ->orderBy('created_at', 'desc')
            ->get();
        
        // Calculate statistics
        $totalBlotters = $blotters->count();
        
        $resolvedCount = $blotters->whereIn('remarks', ['Settled amicably', 'Resolved - No charges filed'])->count();
        $pendingCount = $blotters->where('remarks', 'Pending - Under investigation')->count();
        $forHearingCount = $blotters->where('remarks', 'Awaiting court appearance')->count();
        $referredCount = $blotters->where('remarks', 'Referred to higher authority')->count();
        
        // Group by incident type
        $incidentTypes = $blotters->groupBy('incident_type')
            ->map(function ($group) {
                return $group->count();
            })
            ->sortDesc()
            ->take(10);
        
        // Group by barangay
        $barangayStats = $barangays->map(function ($barangay) use ($blotters) {
            $barangayBlotters = $blotters->where('user_id', $barangay->id);
            return [
                'name' => $barangay->name,
                'total' => $barangayBlotters->count(),
                'resolved' => $barangayBlotters->whereIn('remarks', ['Settled amicably', 'Resolved - No charges filed'])->count(),
                'pending' => $barangayBlotters->where('remarks', 'Pending - Under investigation')->count(),
                'for_hearing' => $barangayBlotters->where('remarks', 'Awaiting court appearance')->count(),
            ];
        });
        
        // Monthly trends for the last 6 months
        $monthlyData = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = now()->subMonths($i);
            $monthBlotters = $blotters->where('created_at', '>=', $month->startOfMonth())
                ->where('created_at', '<=', $month->endOfMonth());
            
            $monthlyData[] = [
                'month' => $month->format('M Y'),
                'cases' => $monthBlotters->count(),
                'resolved' => $monthBlotters->whereIn('remarks', ['Settled amicably', 'Resolved - No charges filed'])->count(),
            ];
        }
        
        return Inertia::render('Province/MunicipalReports', [
            'municipal' => [
                'id' => $municipal->id,
                'name' => str_replace(' Municipal Administrator', '', $municipal->name),
                'email' => $municipal->email,
            ],
            'barangays' => $barangays,
            'blotters' => $blotters->map(function ($blotter) {
                return [
                    'id' => $blotter->id,
                    'entry_number' => $blotter->entry_number,
                    'complainant' => $blotter->complainant,
                    'respondent' => $blotter->respondent,
                    'incident_type' => $blotter->incident_type,
                    'incident_date' => $blotter->incident_date,
                    'incident_location' => $blotter->incident_location,
                    'barangay' => $blotter->barangay,
                    'remarks' => $blotter->remarks,
                    'status' => $this->getRemarkStatusText($blotter->remarks),
                    'date_reported' => $blotter->created_at->format('M d, Y'),
                    'reported_by' => $blotter->user->name ?? 'Unknown',
                    'days_pending' => now()->diffInDays($blotter->created_at),
                ];
            }),
            'stats' => [
                'total_cases' => $totalBlotters,
                'resolved' => $resolvedCount,
                'pending' => $pendingCount,
                'for_hearing' => $forHearingCount,
                'referred' => $referredCount,
                'resolution_rate' => $totalBlotters > 0 ? round(($resolvedCount / $totalBlotters) * 100, 1) : 0,
            ],
            'incident_types' => $incidentTypes,
            'barangay_stats' => $barangayStats,
            'monthly_data' => $monthlyData,
            'municipalities' => User::where('province_id', auth()->user()->id)
                ->where('role', 3) // Municipal role
                ->orderBy('name', 'asc')
                ->get(['id', 'name'])
                ->map(function ($municipality) {
                    $cleanName = str_replace(' Municipal Administrator', '', $municipality->name);
                    return [
                        'id' => $municipality->id,
                        'name' => $cleanName
                    ];
                }),
        ]);
    }

    /**
     * Get remark status text based on remark text value
     */
    private function getRemarkStatusText($remarks)
    {
        switch($remarks) {
            case 'Awaiting court appearance':
                return 'For Hearing';
            case 'Settled amicably':
            case 'Resolved - No charges filed':
                return 'Amicably Settled';
            case 'Pending - Under investigation':
                return 'Pending';
            case 'Referred to higher authority':
                return 'Referred to PNP';
            default:
                return 'Other';
        }
    }

    /**
     * Get Cities of Province
     * @param \Illuminate\Http\Request $request The HTTP request
     * @return Response  array of cities
     */
    public function getCities(Request $request)
    {
        $provinceId = $request->get('province_id');

        try {
            $citiesOfProvince = $this->cityService->getCities($provinceId);

            return Inertia::render('Cities', ['cities' => $citiesOfProvince]);
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    /**
     * Get Barangays of City
     * @param \Illuminate\Http\Request $request The HTTP request
     * @return Response  array of barangays
     */
    public function getBarangays(Request $request)
    {
        $cityId = $request->get('city_id');

        try {
            $barangaysOfCity = $this->barangayService->getBarangays($cityId);

            return Inertia::render('Barangays', ['barangays' => $barangaysOfCity]);
        } catch (\Throwable $th) {
            throw $th;
        }
    }
}

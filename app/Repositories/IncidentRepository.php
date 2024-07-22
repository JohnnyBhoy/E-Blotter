<?php

namespace App\Repositories;

use App\Models\Blotter;
use Illuminate\Support\Facades\DB;

/**
 * Class BlotterRepository.
 */
class IncidentRepository
{
    /** Get Monhtly incident and count
     * @param int $userId ID of the barangay
     * @return array Array of incident type and its monthly count
     */
    public function getMonthly(Int $userId)
    {
        // Get the current month and year
        $currentMonth = now()->month;
        $currentYear = now()->year;

        return Blotter::select('incident_type', DB::raw('COUNT(id) as count'))
            ->whereMonth('created_at', $currentMonth)
            ->whereYear('created_at', $currentYear)
            ->where('user_id', $userId)
            ->groupBy('incident_type')
            ->get()
            ->toArray();
    }
}

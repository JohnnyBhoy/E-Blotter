<?php

namespace App\Services;

use Illuminate\Support\Collection;
use App\Repositories\IncidentRepository;

class IncidentService
{
    protected $incidentRepository;

    /**
     * Class constructor
     */
    public function __construct(IncidentRepository $incidentRepository)
    {
        $this->incidentRepository = $incidentRepository;
    }

    /**
     * Get Incidents
     * @param int $userId ID of the barangay
     * @return array Array of incident type and its monthly count
     */
    public function getMonthly(Int $userId)
    {
        return $this->incidentRepository->getMonthly($userId);
    }
}

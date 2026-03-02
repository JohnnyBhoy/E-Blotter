<?php

namespace App\Services;

use App\Repositories\StationRepository;

class StationService
{
    protected $stationRepository;

    public function __construct(StationRepository $stationRepository)
    {
        $this->stationRepository = $stationRepository;
    }

    /**
     * Get all stations
     * @param string|null $search Search term
     * @param string|null $province Province filter
     * @param string|null $city City filter
     * @return array All stations
     */
    public function getAll($search = null, $province = null, $city = null)
    {
        return $this->stationRepository->getAll($search, $province, $city);
    }

    /**
     * Create new station
     * @param array $data Station data
     * @return Station Created station
     */
    public function create(array $data)
    {
        return $this->stationRepository->create($data);
    }

    /**
     * Find station by ID
     * @param int $id Station ID
     * @return Station|null Found station
     */
    public function findById(int $id)
    {
        return $this->stationRepository->findById($id);
    }

    /**
     * Update station
     * @param int $id Station ID
     * @param array $data Updated data
     * @return Station Updated station
     */
    public function update(int $id, array $data)
    {
        return $this->stationRepository->update($id, $data);
    }

    /**
     * Delete station
     * @param int $id Station ID
     * @return bool Success status
     */
    public function delete(int $id)
    {
        return $this->stationRepository->delete($id);
    }
}

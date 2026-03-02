<?php

namespace App\Services;

use App\Repositories\BarangayRepository;

class BarangayService
{
    protected $barangayRepository;

    public function __construct(BarangayRepository $barangayRepository)
    {
        $this->barangayRepository = $barangayRepository;
    }

    /**
     * Get all Barangays
     * @param int $cityCode Code of the city / Municipality
     * @return array Arrays of the barangay and their blotters count
     */
    public function get(Int $cityCode)
    {
        return $this->barangayRepository->get($cityCode);
    }

    /**
     * Get Barangays by
     * @param int $cityId ID of the City
     * @return array Collection of barangays within the given city
     */
    public  function getBarangays(Int $cityId)
    {
        return $this->barangayRepository->getBarangays($cityId);
    }

    /**
     * Get all barangays
     * @param string|null $search Search term
     * @param string|null $province Province filter
     * @param string|null $city City filter
     * @return array All barangays
     */
    public function getAll($search = null, $province = null, $city = null)
    {
        return $this->barangayRepository->getAll($search, $province, $city);
    }

    /**
     * Create new barangay
     * @param array $data Barangay data
     * @return Barangay Created barangay
     */
    public function create(array $data)
    {
        return $this->barangayRepository->create($data);
    }

    /**
     * Find barangay by ID
     * @param int $id Barangay ID
     * @return Barangay|null Found barangay
     */
    public function findById(int $id)
    {
        return $this->barangayRepository->findById($id);
    }

    /**
     * Update barangay
     * @param int $id Barangay ID
     * @param array $data Updated data
     * @return Barangay Updated barangay
     */
    public function update(int $id, array $data)
    {
        return $this->barangayRepository->update($id, $data);
    }

    /**
     * Delete barangay
     * @param int $id Barangay ID
     * @return bool Success status
     */
    public function delete(int $id)
    {
        return $this->barangayRepository->delete($id);
    }
}

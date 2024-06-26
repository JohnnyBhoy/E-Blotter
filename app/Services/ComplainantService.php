<?php

namespace App\Services;

use Illuminate\Support\Collection;
use App\Repositories\ComplainantRepository;

class ComplainantService
{
    protected $complainant;

    /**
     * Class constructor
     */
    public function __construct(ComplainantRepository $complainant)
    {
        $this->complainant = $complainant;
    }

    /**
     * Method to create complainant data based on
     * @param array $data Array of values to be created
     * @return \App\Models\Complainant
     */
    public function create(array $data)
    {
        return $this->complainant->create($data);
    }

    /**
     * Method to get complainant data based on
     * @param int $id unique ID of the complainants
     * @return Collection
     */
    public function get(int $id)
    {
        return $this->complainant->get($id);
    }

    /**
     * Method to update complainant data based on
     * @param int $id unique ID of the complainants
     * @param array $data Values to update
     * @return Collection
     */
    public function update(Int $id, array $data)
    {
        return $this->complainant->update($id, $data);
    }

    /**
     * Method to remove complainant data based on
     * @param int $id unique ID of the complainants
     * @return boolean | null  Success or fail
     */
    public function delete(Int $id)
    {
        return $this->complainant->delete($id);
    }
}

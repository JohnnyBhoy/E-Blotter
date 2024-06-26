<?php

namespace App\Repositories;

use App\Models\Complainant;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class ComplainantRepository.
 */
class ComplainantRepository
{
    /**
     * Method to create complainant data based on
     * @param array $data Array of values to be created
     * @return Complainant
     */
    public function create(array $data)
    {
        return Complainant::create($data);
    }

    /**
     * Method to get complainant data based on
     * @param int $id unique ID of the complainants
     * @return Collection
     */
    public function get(int $id)
    {
        return Complainant::findOrFail($id);
    }

    /**
     * Method to get all complainant data based on
     * @return Collection
     */
    public function getAll()
    {
        return Complainant::all();
    }

    /**
     * Method to update complainant data based on
     * @param int $id unique ID of the complainants
     * @param array $data Values to update
     * @return Collection
     */
    public function update(Int $id, array $data)
    {
        $complainant = Complainant::findOrFail($id);
        $complainant->update($data);
        return $complainant;
    }

    /**
     * Method to remove complainant data based on
     * @param int $id unique ID of the complainants
     * @return boolean | null  Success or fail
     */
    public function delete(Int $id)
    {
        $complainant = Complainant::findOrFail($id);
        return $complainant->delete();
    }
}

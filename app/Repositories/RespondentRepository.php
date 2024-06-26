<?php

namespace App\Repositories;

use App\Models\Respondent;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class RespondentRepository.
 */
class RespondentRepository
{
    /**
     * Method to create respondent data based on
     * @param array $data Array of values to be created
     * @return Respondent
     */
    public function create(array $data)
    {
        return Respondent::create($data);
    }

    /**
     * Method to get respondent data based on
     * @param int $id unique ID of the respondents
     * @return Collection
     */
    public function get(int $id)
    {
        return Respondent::findOrFail($id);
    }

    /**
     * Method to get all respondent data based on
     * @return Collection
     */
    public function getAll()
    {
        return Respondent::all();
    }

    /**
     * Method to update respondent data based on
     * @param int $id unique ID of the respondents
     * @param array $data Values to update
     * @return Collection
     */
    public function update(Int $id, array $data)
    {
        $respondent = Respondent::findOrFail($id);
        $respondent->update($data);
        return $respondent;
    }

    /**
     * Method to remove respondent data based on
     * @param int $id unique ID of the respondents
     * @return boolean | null  Success or fail
     */
    public function delete(Int $id)
    {
        $respondent = Respondent::findOrFail($id);
        return $respondent->delete();
    }
}

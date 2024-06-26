<?php

namespace App\Services;

use Illuminate\Support\Collection;
use App\Repositories\RespondentRepository;

class RespondentService
{
    protected $respondent;

    /**
     * Class constructor
     */
    public function __construct(RespondentRepository $respondent)
    {
        $this->respondent = $respondent;
    }

    /**
     * Method to create respondent data based on
     * @param array $data Array of values to be created
     * @return \App\Models\Respondent
     */
    public function create(array $data)
    {
        return $this->respondent->create($data);
    }

    /**
     * Method to get respondent data based on
     * @param int $id unique ID of the respondents
     * @return Collection
     */
    public function get(int $id)
    {
        return $this->respondent->get($id);
    }

    /**
     * Method to update respondent data based on
     * @param int $id unique ID of the respondents
     * @param array $data Values to update
     * @return Collection
     */
    public function update(Int $id, array $data)
    {
        return $this->respondent->update($id, $data);
    }

    /**
     * Method to remove respondent data based on
     * @param int $id unique ID of the respondents
     * @return boolean | null  Success or fail
     */
    public function delete(Int $id)
    {
        return $this->respondent->delete($id);
    }
}

<?php

namespace App\Repositories;

use App\Models\Blotter;
use App\Models\Complainant;
use App\Models\Respondent;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

/**
 * Class BlotterRepository.
 */
class BlotterRepository
{
    /**
     * Method to create blotter data based on
     * @param \Illuminate\Http\Request $request The HTTP request
     * @return Model
     */
    public function create($request)
    {
        // Create blotter
        $blotterAttribs = [
            'user_id',
            'entry_number',
            'barangay',
            'date_reported',
            'time_of_report',
            'incident_type',
            'narrative',
            'remarks',
            'complainant_signature',
            'recorded_by',
            'recorded_by_signature',
        ];

        $blotterCreatePairs = $this->createFilterHolder($blotterAttribs, $request);

        Blotter::create($blotterCreatePairs);

        //$blotter = $this->getBlotterByNumber($request->get('entry_number'));

        // Create complainants
        $complainantData = [
            'blotter_id',
            'complainant_family_name',
            'complainant_first_name',
            'complainant_middle_name',
            'complainant_birth_date',
            'complainant_place_of_birth',
            'complainant_citizenship',
            'complainant_gender',
            'complainant_civil_status',
            'complainant_occupation',
            'complainant_education',
            'complainant_email_address',
            'complainant_street',
            'complainant_village',
            'complainant_barangay',
            'complainant_city',
            'complainant_province',
            'complainant_region',
            'complainant_work_street',
            'complainant_work_village',
            'complainant_work_barangay',
            'complainant_work_city',
            'complainant_work_province',
            'complainant_work_region',
        ];
        $complainantCreatePairs = $this->createFilterHolder($complainantData, $request);
        Complainant::create($complainantCreatePairs);

        // Create complainants
        $respondentData = [
            'blotter_id',
            'respondent_family_name',
            'respondent_first_name',
            'respondent_middle_name',
            'respondent_birth_date',
            'respondent_place_of_birth',
            'respondent_citizenship',
            'respondent_gender',
            'respondent_civil_status',
            'respondent_occupation',
            'respondent_education',
            'respondent_email_address',
            'respondent_street',
            'respondent_village',
            'respondent_barangay',
            'respondent_city',
            'respondent_province',
            'respondent_region',
            'respondent_work_street',
            'respondent_work_village',
            'respondent_work_barangay',
            'respondent_work_city',
            'respondent_work_province',
            'respondent_work_region',
        ];
        $respondentCreatePairs = $this->createFilterHolder($respondentData, $request);
        return Respondent::create($respondentCreatePairs);
    }

    /**
     * Method to get blotter data based on
     * @param int $id unique ID of the blotters
     * @return Collection
     */
    public function get(int $id)
    {
        return Blotter::findOrFail($id);
    }

    /**
     * Method to get blotter data based on
     * @param int $blotter_number unique number of the blotters
     * @return Collection
     */
    public function getBlotterByNumber(int $blotter_number)
    {
        return Blotter::where('entry_number', $blotter_number)->pluck('id');
    }

    /**
     * Method to get all blotter data based on
     * @return Collection
     */
    public function getAll()
    {
        return Blotter::all();
    }

    /**
     * Method to update blotter data based on
     * @param int $id unique ID of the blotters
     * @param array $data Values to update
     * @return Collection
     */
    public function update(Int $id, array $data)
    {
        $blotter = Blotter::findOrFail($id);
        $blotter->update($data);
        return $blotter;
    }

    /**
     * Method to remove blotter data based on
     * @param int $id unique ID of the blotters
     * @return boolean | null  Success or fail
     */
    public function delete(Int $id)
    {
        $blotter = Blotter::findOrFail($id);
        return $blotter->delete();
    }

    private function createFilterHolder(array $attribs, Request $request)
    {
        $filter = [];

        foreach ($attribs as $attrib) {
            if ($request->get($attrib)) {
                $pair = [
                    $attrib => $request->get($attrib)
                ];
                $filter[] = $pair;
            }
        }

        return array_merge(...$filter);
    }
}

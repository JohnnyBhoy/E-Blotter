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
            'user_id' => $request->get('user_id'),
            'barangay_code' => $request->get('barangay_code'),
            'blotter_number' => $request->get('blotter_number'),
            'details' => $request->get('details'),
            'encoder' => $request->get('encoder'),
        ];
        Blotter::create($blotterAttribs);

        // Extract blotter id
        $blotter = $this->getBlotterByNumber($request->get('blotter_number'));

        // Create complainants
        $complainantData = [
            'blotter_id' => $blotter->id,
            'complainant_first_name' => $request->get('complainant_first_name'),
            'complainant_middle_name' => $request->get('complainant_middle_name'),
            'complainant_last_name' => $request->get('complainant_last_name'),
            'complainant_qualifier' => $request->get('complainant_qualifier'),
            'complainant_address_line_1' => $request->get('complainant_address_line_1'),
            'complainant_purok' => $request->get('complainant_purok'),
            'complainant_barangay' => $request->get('complainant_barangay'),
            'complainant_city' => $request->get('complainant_city'),
            'complainant_province' => $request->get('complainant_province'),
            'complainant_region' => $request->get('complainant_region'),
            'complainant_gender' => $request->get('complainant_gender'),
            'complainant_age' => $request->get('complainant_age'),
        ];
        Complainant::create($complainantData);

        // Create complainants
        $respondentData = [
            'blotter_id' => $blotter->id,
            'respondent_first_name' => $request->get('respondent_first_name'),
            'respondent_middle_name' => $request->get('respondent_middle_name'),
            'respondent_last_name' => $request->get('respondent_last_name'),
            'respondent_qualifier' => $request->get('respondent_qualifier'),
            'respondent_address_line_1' => $request->get('respondent_address_line_1'),
            'respondent_purok' => $request->get('respondent_purok'),
            'respondent_barangay' => $request->get('respondent_barangay'),
            'respondent_city' => $request->get('respondent_city'),
            'respondent_province' => $request->get('respondent_province'),
            'respondent_region' => $request->get('respondent_region'),
            'respondent_gender' => $request->get('respondent_gender'),
            'respondent_age' => $request->get('respondent_age'),
        ];
        return Respondent::create($respondentData);
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
        return Blotter::where('blotter_number', $blotter_number)->pluck('id');
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
}

<?php

namespace App\Repositories;

use App\Models\Blotter;
use App\Models\Complainant;
use App\Models\Respondent;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use PhpParser\Node\Expr\AssignOp\Concat;

/**
 * Class BlotterRepository.
 */
class BlotterRepository
{
    protected $blotter = 'blotters';
    protected $complainant = 'complainants';
    protected $respondent = 'respondents';
    /**
     * Method to get latest blotter
     * @param int $userId Barangay user ID
     * @return Model
     */
    public function getLatest(Int $userId)
    {
        return Blotter::where('user_id', $userId)
            ->orderBy('id', 'desc')
            ->first();
    }

    /**
     * Method to create blotter data based on
     * @param \Illuminate\Http\Request $request The HTTP request
     * @param int $userId User ID
     * @return boolean
     */
    public function create(Request $request, Int $userId)
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

        $blotterCreatePairs = $this->createFilterHolderForRequest($blotterAttribs, $request);

        Blotter::create($blotterCreatePairs);

        $blotterId = $this->getBlotterByNumber($request->get('entry_number'), $userId);
        $blotterID = ['blotter_id' => $blotterId];

        // Create complainants
        $complainantData = [
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
        foreach ($request->get('complainant_data') as $complainant) {
            $complainantCreatePairs = $this->createFilterHolder($complainantData, $complainant);
            Complainant::create(array_merge($blotterID, $complainantCreatePairs));
        }


        // Create complainants
        $respondentData = [
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

        foreach ($request->get('respondent_data') as $respondent) {
            $respondentCreatePairs = $this->createFilterHolder($respondentData, $respondent);
            Respondent::create(array_merge($blotterID, $respondentCreatePairs));
        }

        return true;
    }

    /**
     * Method to get blotter data based on
     * @param int $id unique ID of the blotters
     * @return Collection
     */
    public function get(int $id)
    {
        return DB::table('blotters as b')
            ->leftJoin('complainants as c', 'b.id', '=', 'c.blotter_id')
            ->leftJoin('respondents as r', 'b.id', '=', 'r.blotter_id')
            ->where('b.id', $id)
            ->first();
    }

    /**
     * Method to get blotter data based on
     * @param int $blotter_number unique number of the blotters
     * @param int $userId User ID
     * @return int
     */
    public function getBlotterByNumber(int $blotter_number, Int $userId)
    {
        $blotter =  Blotter::where('entry_number', $blotter_number)->where('user_id', $userId)->first();

        return $blotter->id;
    }

    /**
     * Method to get all blotter data based on
     * @param int $perPage Data record display
     * @param int $page Data page display
     * @param string $keyword  Filter\
     * @param int $userId ID of the barangay
     *
     * @return LengthAwarePaginator
     */
    public function getAll(Int $perPage, Int $page, String $keyword, Int $userId)
    {
        $blotterTable = $this->blotter;
        $complainantTable = $this->complainant;
        $respondentTable = $this->respondent;

        return DB::table("{$blotterTable} as b")
            ->leftJoin("{$complainantTable} as c", 'b.id', '=', 'c.blotter_id')
            ->leftJoin("{$respondentTable} as r", 'b.id', '=', 'r.blotter_id')
            ->select(
                'b.id',
                'b.entry_number',
                'c.complainant_family_name',
                'c.complainant_first_name',
                'c.complainant_middle_name',
                'r.respondent_family_name',
                'r.respondent_first_name',
                'r.respondent_middle_name',
                'b.incident_type',
                'b.created_at',
                'b.remarks',
            )
            ->where('b.user_id', $userId)
            ->where(function ($query) use ($keyword) {
                $query->where('b.entry_number', 'like', '%' . $keyword . '%')
                    ->orWhere('b.date_reported', 'like', '%' . $keyword . '%')
                    ->orWhere('b.incident_type', 'like', '%' . $keyword . '%')
                    ->orWhere('b.narrative', 'like', '%' . $keyword . '%')
                    ->orWhere('b.remarks', 'like', '%' . $keyword . '%')
                    ->orWhere('b.recorded_by', 'like', '%' . $keyword . '%')
                    ->orWhere('c.complainant_family_name', 'like', '%' . $keyword . '%')
                    ->orWhere('c.complainant_first_name', 'like', '%' . $keyword . '%')
                    ->orWhere('c.complainant_middle_name', 'like', '%' . $keyword . '%')
                    ->orWhere('c.complainant_place_of_birth', 'like', '%' . $keyword . '%')
                    ->orWhere('c.complainant_citizenship', 'like', '%' . $keyword . '%')
                    ->orWhere('c.complainant_civil_status', 'like', '%' . $keyword . '%')
                    ->orWhere('c.complainant_occupation', 'like', '%' . $keyword . '%')
                    ->orWhere('c.complainant_education', 'like', '%' . $keyword . '%')
                    ->orWhere('c.complainant_street', 'like', '%' . $keyword . '%')
                    ->orWhere('c.complainant_village', 'like', '%' . $keyword . '%')
                    ->orWhere('c.complainant_barangay', 'like', '%' . $keyword . '%')
                    ->orWhere('c.complainant_city', 'like', '%' . $keyword . '%')
                    ->orWhere('c.complainant_province', 'like', '%' . $keyword . '%')
                    ->orWhere('c.complainant_region', 'like', '%' . $keyword . '%')
                    ->orWhere('c.complainant_work_street', 'like', '%' . $keyword . '%')
                    ->orWhere('c.complainant_work_village', 'like', '%' . $keyword . '%')
                    ->orWhere('c.complainant_work_barangay', 'like', '%' . $keyword . '%')
                    ->orWhere('c.complainant_work_city', 'like', '%' . $keyword . '%')
                    ->orWhere('c.complainant_work_province', 'like', '%' . $keyword . '%')
                    ->orWhere('c.complainant_work_region', 'like', '%' . $keyword . '%')
                    ->orWhere('r.respondent_family_name', 'like', '%' . $keyword . '%')
                    ->orWhere('r.respondent_first_name', 'like', '%' . $keyword . '%')
                    ->orWhere('r.respondent_middle_name', 'like', '%' . $keyword . '%')
                    ->orWhere('r.respondent_place_of_birth', 'like', '%' . $keyword . '%')
                    ->orWhere('r.respondent_citizenship', 'like', '%' . $keyword . '%')
                    ->orWhere('r.respondent_civil_status', 'like', '%' . $keyword . '%')
                    ->orWhere('r.respondent_occupation', 'like', '%' . $keyword . '%')
                    ->orWhere('r.respondent_education', 'like', '%' . $keyword . '%')
                    ->orWhere('r.respondent_street', 'like', '%' . $keyword . '%')
                    ->orWhere('r.respondent_village', 'like', '%' . $keyword . '%')
                    ->orWhere('r.respondent_barangay', 'like', '%' . $keyword . '%')
                    ->orWhere('r.respondent_city', 'like', '%' . $keyword . '%')
                    ->orWhere('r.respondent_province', 'like', '%' . $keyword . '%')
                    ->orWhere('r.respondent_region', 'like', '%' . $keyword . '%')
                    ->orWhere('r.respondent_work_street', 'like', '%' . $keyword . '%')
                    ->orWhere('r.respondent_work_village', 'like', '%' . $keyword . '%')
                    ->orWhere('r.respondent_work_barangay', 'like', '%' . $keyword . '%')
                    ->orWhere('r.respondent_work_city', 'like', '%' . $keyword . '%')
                    ->orWhere('r.respondent_work_province', 'like', '%' . $keyword . '%')
                    ->orWhere('r.respondent_work_region', 'like', '%' . $keyword . '%');
            })
            ->orderBy('b.id', 'desc')
            ->paginate($perPage, ['*'], 'page', $page);
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
        Complainant::where('blotter_id', $id)->delete();
        Respondent::where('blotter_id', $id)->delete();

        $blotter = Blotter::findOrFail($id);
        return $blotter->delete();
    }

    private function createFilterHolder(array $attribs, array $complainant)
    {
        $filter = [];

        foreach ($attribs as $attrib) {
            if ($complainant[$attrib]) {
                $pair = [
                    $attrib => $complainant[$attrib]
                ];
                $filter[] = $pair;
            }
        }

        return array_merge(...$filter);
    }

    private function createFilterHolderForRequest(array $attribs, Request $request)
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

    /**
     * Method to get blotter count and group into year
     * @param int $userId unique ID of the user
     * @return array
     */
    public function getYearlyBlotter(Int $userId)
    {
        return  DB::table('blotters')
            ->select(DB::raw('YEAR(created_at) as year'), DB::raw('COUNT(*) as count'))
            ->where('user_id', $userId)
            ->groupBy(DB::raw('YEAR(created_at)'))
            ->orderBy('year')
            ->get()
            ->toArray();
    }

    /**
     * Method to get blotter count and group into month
     * @param int $userId unique ID of the user
     * @param int $year year to fetch
     * @return array
     */
    public function getYearlyBlotterByMonth(Int $userId, Int $year)
    {

        return DB::table('blotters')
            ->select(DB::raw('MONTH(created_at) as month'), DB::raw('COUNT(*) as count'))
            ->whereYear('created_at', $year)
            ->where('user_id', $userId)
            ->groupBy(DB::raw('MONTH(created_at)'))
            ->orderBy('month')
            ->get()
            ->toArray();
    }

    /**
     * Method to get monthly blotter
     * @param int $userId unique ID of the user
     * @param int $year year to fetch
     * @param int $month month to fetch
     * @return array
     */
    public function getDailyBlotterByMonth(Int $userId, Int $year, Int $month)
    {

        return   DB::table('blotters as b')
            ->leftJoin('complainants as c', 'b.id', '=', 'c.blotter_id')
            ->leftJoin('respondents as r', 'b.id', '=', 'r.blotter_id')
            ->where('b.user_id', $userId)
            ->whereYear('b.created_at', $year)
            ->whereMonth('b.created_at', $month)
            ->get()
            ->toArray();
    }
}

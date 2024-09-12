<?php

namespace App\Repositories;

use App\Models\Blotter;
use App\Models\Complainant;
use App\Models\Respondent;
use App\Models\User;
use App\Models\UserAddress;
use Carbon\Carbon;
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

    protected $countID = 'COUNT(id) as count';

    /**
     * Count all Blotters entries
     * @return int Count fo all blotters in database
     */
    public function getCount()
    {
        return Blotter::count();
    }

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
     * @return boolean
     */
    public function create(Request $request)
    {
        // Create blotter
        $blotterAttribs = [
            'user_id',
            'entry_number',
            'barangay',
            'date_reported',
            'time_of_report',
            'date_of_incident',
            'time_of_incident',
            'incident_type',
            'narrative',
            'remarks',
            'complainant_signature',
            'recorded_by',
            'recorded_by_signature',
            'uploaded_file',
        ];

        $blotterCreatePairs = $this->createFilterHolderForRequest($blotterAttribs, $request);

        Blotter::create($blotterCreatePairs);

        // Get the latest blotter id
        $latestBlotter = Blotter::where('user_id', $request->get('user_id'))
            ->where('entry_number', $request->get('entry_number'))
            ->first();

        $entryNumber = [
            'blotter_id' => $latestBlotter->id,
            'user_id' => $request->get('user_id'),
            'entry_number' => $request->get('entry_number')
        ];

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
            Complainant::create(array_merge($entryNumber, $complainantCreatePairs));
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
            Respondent::create(array_merge($entryNumber, $respondentCreatePairs));
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
        $blotters = $this->blotter;

        return DB::table("{$blotters} as b")
            ->leftJoin('complainants as c', 'b.id', '=', 'c.blotter_id')
            ->leftJoin('respondents as r', 'b.id', '=', 'r.blotter_id')
            ->where('b.id', $id)
            ->first();
    }

    /**
     * Method to get all blotter data based on
     * @param int $perPage Data record display
     * @param int $page Data page display
     * @param string $keyword  Filter\
     * @param int $userId ID of the barangay
     * @param int $remark case disposition / action
     * @param int $incidentType case blotter type
     *
     * @return LengthAwarePaginator
     */
    public function getAll(Int $perPage, Int $page, String $keyword, Int $userId, Int $remark, Int $incidentType)
    {
        // Check rule of user
        $user = User::where('id', $userId)->first();

        $blotterTable = $this->blotter;
        $complainantTable = $this->complainant;
        $respondentTable = $this->respondent;

        $query =  DB::table("{$blotterTable} as b")
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
            ->where('c.complainant_family_name', '!=', null)
            ->where('c.complainant_family_name', '!=', "")
            ->whereAny([
                'b.entry_number',
                'b.date_reported',
                'b.incident_type',
                'b.narrative',
                'b.remarks',
                'b.recorded_by',
                'c.complainant_family_name',
                'c.complainant_first_name',
                'c.complainant_middle_name',
                'c.complainant_place_of_birth',
                'c.complainant_citizenship',
                'c.complainant_civil_status',
                'c.complainant_occupation',
                'c.complainant_education',
                'c.complainant_street',
                'c.complainant_village',
                'c.complainant_barangay',
                'c.complainant_city',
                'c.complainant_province',
                'c.complainant_region',
                'c.complainant_work_street',
                'c.complainant_work_village',
                'c.complainant_work_barangay',
                'c.complainant_work_city',
                'c.complainant_work_province',
                'c.complainant_work_region',
                'r.respondent_family_name',
                'r.respondent_first_name',
                'r.respondent_middle_name',
                'r.respondent_place_of_birth',
                'r.respondent_citizenship',
                'r.respondent_civil_status',
                'r.respondent_occupation',
                'r.respondent_education',
                'r.respondent_street',
                'r.respondent_village',
                'r.respondent_barangay',
                'r.respondent_city',
                'r.respondent_province',
                'r.respondent_region',
                'r.respondent_work_street',
                'r.respondent_work_village',
                'r.respondent_work_barangay',
                'r.respondent_work_city',
                'r.respondent_work_province',
                'r.respondent_work_region'
            ], 'LIKE', '%' . $keyword . '%')
            ->orderBy('b.id', 'desc')
            ->distinct();

        if (is_numeric($remark) && $remark > 0) {
            $query = $query->where('b.remarks', $remark);
        }


        if (is_numeric($incidentType) && $incidentType > 0) {
            $query = $query->where('b.incident_type', $incidentType);
        }

        if ($user->role == 3) {
            $cityCode = UserAddress::where('user_id', $userId)->pluck('city_code');
            $barangays = UserAddress::where('city_code', $cityCode)->pluck('user_id');
            $query = $query->whereIn('b.user_id', $barangays);
        }

        if ($user->role == 2) {
            $query = $query->where('b.user_id', $userId);
        }

        return $query->paginate($perPage, ['*'], 'page', $page);
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
        $count = $this->countID;

        return  DB::table('blotters')
            ->select(DB::raw('YEAR(created_at) as year'), DB::raw($count))
            ->where('user_id', $userId)
            ->groupBy(DB::raw('YEAR(created_at)'))
            ->orderBy('year')
            ->get()
            ->toArray();
    }

    /**
     * Method to get blotter count and group into year per barangay
     * @param array $userIds unique ID of the user
     * @return array
     */
    public function getYearlyBlotterByMunipal(array $userIds)
    {
        $count = $this->countID;

        return  DB::table('blotters')
            ->select(DB::raw('YEAR(created_at) as year'), DB::raw($count))
            ->whereIn('user_id', $userIds)
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
        $count = $this->countID;

        return DB::table('blotters')
            ->select(DB::raw('MONTH(created_at) as month'), DB::raw($count))
            ->whereYear('created_at', $year)
            ->where('user_id', $userId)
            ->groupBy(DB::raw('MONTH(created_at)'))
            ->orderBy('month')
            ->get()
            ->toArray();
    }

    /**
     * Method to get blotter count and group into month per barangay
     * @param array $userIds unique ID of the users
     * @param int $year year to fetch
     * @return array
     */
    public function getYearlyBlotterByMonthByMunicipal(array $userIds, Int $year)
    {
        $count = $this->countID;

        return DB::table('blotters')
            ->select(DB::raw('MONTH(created_at) as month'), DB::raw($count))
            ->whereYear('created_at', $year)
            ->whereIn('user_id', $userIds)
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
        $blotters = $this->blotter;

        return   DB::table("{$blotters} as b")
            ->leftJoin('complainants as c', 'b.entry_number', '=', 'c.entry_number')
            ->leftJoin('respondents as r', 'b.entry_number', '=', 'r.entry_number')
            ->where('b.user_id', $userId)
            ->whereYear('b.created_at', $year)
            ->whereMonth('b.created_at', $month)
            ->get()
            ->toArray();
    }


    /**
     * Method to get weekly blotter count
     * @param int $userId unique ID of the user
     * @return array
     */
    public function getWeeklyBlotter(Int $userId)
    {
        $count = $this->countID;

        return DB::table('blotters')
            ->select(DB::raw('DAY(created_at) as day'), DB::raw($count))
            ->where('created_at', '>=', Carbon::now()->subDays(14))
            ->where('user_id', $userId)
            ->groupBy(DB::raw('DAY(created_at)'))
            ->orderBy('day')
            ->get()
            ->toArray();
    }

    /**
     * Method to get weekly blotter count per barangay
     * @param array $userIds unique ID of the users
     * @return array
     */
    public function getWeeklyBlotterByMunicipal(array $userIds)
    {
        $count = $this->countID;

        return DB::table('blotters')
            ->select(DB::raw('DAY(created_at) as day'), DB::raw($count))
            ->where('created_at', '>=', Carbon::now()->subDays(14))
            ->whereIn('user_id', $userIds)
            ->groupBy(DB::raw('DAY(created_at)'))
            ->orderBy('day')
            ->get()
            ->toArray();
    }

    /**
     * Method to get all blotter data based on
     * @param int $perPage Data record display
     * @param int $page Data page display
     * @param string $keyword  Filters
     * @param int $userId ID of the barangay
     * @param int $remark ID of the barangay
     *
     * @return LengthAwarePaginator
     */
    public function getBlotterByRemarks(Int $perPage, Int $page, String $keyword, Int $userId, Int $remark)
    {
        $blotterTable = $this->blotter;
        $complainantTable = $this->complainant;
        $respondentTable = $this->respondent;

        return DB::table("{$blotterTable} as b")
            ->where('b.user_id', $userId)
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
            ->where('remarks', $remark)
            ->whereAny([
                'b.entry_number',
                'b.date_reported',
                'b.incident_type',
                'b.narrative',
                'b.remarks',
                'b.recorded_by',
                'c.complainant_family_name',
                'c.complainant_first_name',
                'c.complainant_middle_name',
                'c.complainant_place_of_birth',
                'c.complainant_citizenship',
                'c.complainant_civil_status',
                'c.complainant_occupation',
                'c.complainant_education',
                'c.complainant_street',
                'c.complainant_village',
                'c.complainant_barangay',
                'c.complainant_city',
                'c.complainant_province',
                'c.complainant_region',
                'c.complainant_work_street',
                'c.complainant_work_village',
                'c.complainant_work_barangay',
                'c.complainant_work_city',
                'c.complainant_work_province',
                'c.complainant_work_region',
                'r.respondent_family_name',
                'r.respondent_first_name',
                'r.respondent_middle_name',
                'r.respondent_place_of_birth',
                'r.respondent_citizenship',
                'r.respondent_civil_status',
                'r.respondent_occupation',
                'r.respondent_education',
                'r.respondent_street',
                'r.respondent_village',
                'r.respondent_barangay',
                'r.respondent_city',
                'r.respondent_province',
                'r.respondent_region',
                'r.respondent_work_street',
                'r.respondent_work_village',
                'r.respondent_work_barangay',
                'r.respondent_work_city',
                'r.respondent_work_province',
                'r.respondent_work_region'
            ], 'LIKE', '%' . $keyword . '%')
            ->orderBy('b.id', 'desc')
            ->paginate($perPage, ['*'], 'page', $page);
    }

    /**
     * Method to get top 10 barangay with most blotters
     * @param int $userId IDs of the city
     * @return array collection of blotter count per barangay
     */
    public function getBarangayWithMostBlotter(Int $userId)
    {
        $blotters = $this->blotter;
        $cityCode = UserAddress::where('id', $userId)->pluck('city_code');

        // Get the current year
        $currentYear = Carbon::now()->year;
        // Perform the query
        return DB::table("{$blotters} as b")
            ->leftJoin('user_addresses as ua', 'b.user_id', '=', 'ua.user_id')
            ->leftJoin('users as u', 'b.user_id', '=', 'u.id')
            ->select('u.id', 'u.name')
            ->selectRaw('COUNT(b.id) as count')
            ->whereYear('b.created_at', $currentYear)
            ->where('ua.city_code', $cityCode)
            ->groupBy('u.id', 'u.name')
            ->orderBy('count', 'DESC')
            ->limit(10)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'name' => $item->name,
                    'count' => $item->count,
                ];
            })
            ->toArray();
    }
}

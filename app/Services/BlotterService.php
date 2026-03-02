<?php

namespace App\Services;

use App\Models\Blotter;
use App\Models\User;
use Illuminate\Support\Collection;
use App\Repositories\BlotterRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;

class BlotterService
{
    protected $blotter;

    /**
     * Class constructor
     */
    public function __construct(BlotterRepository $blotter)
    {
        $this->blotter = $blotter;
    }


    /**
     * Count all Blotters entries
     * @return int Count fo all blotters in database
     */
    public function getCount()
    {
        return $this->blotter->getCount();
    }

    /**
     * Method to get latest blotter data based on
     * @param int $userId Barangay user ID
     * @return \App\Models\Blotter
     */
    public function getLatest(Int $userId)
    {
        return $this->blotter->getLatest($userId);
    }

    /**
     * Method to get blotter data based on
     * @param int $id unique ID of the blotters
     * @return Collection
     */
    public function get(int $id)
    {
        return $this->blotter->get($id);
    }


    /**
     * Method to create blotter data based on
     * @param \Illuminate\Http\Request $request The HTTP request
     * @return bool
     */
    public function create(Request $request)
    {
        return $this->blotter->create($request);
    }


    /**
     * Method to update blotter data based on
     * @param int $id unique ID of the blotters
     * @param array $data Values to update
     * @return Collection
     */
    public function update(Int $id, array $data)
    {
        return $this->blotter->update($id, $data);
    }

    /**
     * Method to remove blotter data based on
     * @param int $id unique ID of the blotters
     * @return boolean | null  Success or fail
     */
    public function delete(Int $id)
    {
        return $this->blotter->delete($id);
    }


    /**
     * Method to get all blotter data based on
     * @param int $userId ID of the barangay
     *
     * @return LengthAwarePaginator
     */
    public function getAll(Int $userId)
    {
        // Get all blotters by user_id joined with complainant and respondent in Query builder
        return Blotter::where('blotters.user_id', $userId)
            ->leftJoin('complainants', 'blotters.id', '=', 'complainants.blotter_id')
            ->leftJoin('respondents', 'blotters.id', '=', 'respondents.blotter_id')
            ->select(
                'blotters.id',
                'blotters.entry_number',
                'blotters.incident_type',
                'blotters.remarks',
                'complainants.complainant_family_name',
                'complainants.complainant_first_name',
                'complainants.complainant_middle_name',
                'respondents.respondent_family_name',
                'respondents.respondent_first_name',
                'respondents.respondent_middle_name',
            )
            ->where('complainants.complainant_family_name', '!=', null)
            ->distinct()
            ->get();
    }

    /**
     * Method to get blotter count and group into year
     * @param int $userId unique ID of the user
     * @return array
     */
    public function getYearlyBlotter(Int $userId)
    {
        return  $this->blotter->getYearlyBlotter($userId);
    }

    /**
     * Method to get blotter count and group into year per barangay
     * @param array $userIds unique ID of the users
     * @return array
     */
    public function getYearlyBlotterByMunicipal(array $userIds)
    {
        return  $this->blotter->getYearlyBlotterByMunipal($userIds);
    }

    /**
     * Method to get blotter count and group into month
     * @param int $userId unique ID of the user
     * @param int $year year to fetch
     * @return array
     */
    public function getYearlyBlotterByMonth(Int $userId, Int $year)
    {
        return  $this->blotter->getYearlyBlotterByMonth($userId, $year);
    }

    /**
     * Method to get blotter count and group into month per barangay
     * @param array $userIds unique ID of the users
     * @param int $year year to fetch
     * @return array
     */
    public function getYearlyBlotterByMonthByMunicipal(array $userIds, Int $year)
    {
        return  $this->blotter->getYearlyBlotterByMonthByMunicipal($userIds, $year);
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
        return  $this->blotter->getDailyBlotterByMonth($userId, $year, $month);
    }

    /**
     * Method to get blotter count and group into year
     * @param int $userId unique ID of the user
     * @return array
     */
    public function getWeeklyBlotter(Int $userId)
    {
        return  $this->blotter->getWeeklyBlotter($userId);
    }

    /**
     * Method to get blotter count and group into year per barangay
     * @param array $userIds unique ID of the users
     * @return array
     */
    public function getWeeklyBlotterByMunicipal(array $userIds)
    {
        return  $this->blotter->getWeeklyBlotterByMunicipal($userIds);
    }

    /**
     * Method to get all blotter data based on rema
     * @param int $perPage Data record display
     * @param int $page Data page display
     * @param int $userId ID of the barangay
     * @param string $keyword  Filter
     * @param int $remark case remark
     *
     * @return LengthAwarePaginator
     */
    public function getBlotterByRemarks(Int $perPage, Int $page, String $keyword, Int $userId, Int $remark)
    {
        return $this->blotter->getBlotterByRemarks($perPage,  $page,  $keyword, $userId, $remark);
    }

    /**
     * Method to get top 10 barangay with most blotters
     * @param int $userId ID of the municipal
     * @return array collection of blotter count per barangay
     */
    public function getBarangayWithMostBlotter(Int $userId)
    {
        return $this->blotter->getBarangayWithMostBlotter($userId);
    }

    /**
     * Method to get blotter count by barangay
     * @param int $barangayCode Barangay code
     * @return int Count of blotters for the barangay
     */
    public function getCountByBarangay(Int $barangayCode)
    {
        return $this->blotter->getCountByBarangay($barangayCode);
    }

    /**
     * Method to get blotter count by station
     * @param int $userId Station user ID
     * @return int Count of blotters for the station
     */
    public function getCountByStation(Int $userId)
    {
        return $this->blotter->getCountByStation($userId);
    }
}

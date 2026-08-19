<?php

namespace App\Services;

use App\Repositories\BlotterRepository;
use App\Support\Jurisdiction;
use Illuminate\Support\Collection;
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
     * Method to get one blotter with its complainant and respondent cards
     * @param int $id unique ID of the blotters
     * @return array|null
     */
    public function getWithPeople(Int $id)
    {
        return $this->blotter->getWithPeople($id);
    }

    /**
     * Method to update a blotter together with its person cards
     * @param int $id unique ID of the blotters
     * @param array $blotterData Values for the blotter row
     * @param array|null $complainants One associative array per complainant card, null to leave them alone
     * @param array|null $respondents One associative array per respondent card, null to leave them alone
     * @return Model
     */
    public function updateWithPeople(Int $id, array $blotterData, ?array $complainants, ?array $respondents)
    {
        return $this->blotter->updateWithPeople($id, $blotterData, $complainants, $respondents);
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
     * @param int $perPage Data record display
     * @param int $page Data page display
     * @param int $userId ID of the barangay
     * @param string $keyword  Filter
     * @param int $remark case disposition / action
     * @param int $incidentType case blotter type
     * @param string $sort Whitelisted sort key, see BlotterRepository::getAll()
     * @param string $direction asc|desc
     *
     * @return LengthAwarePaginator
     */
    public function getAll(Int $perPage, Int $page, String $keyword, Int $userId, Int $remark, Int $incidentType, String $sort = 'id', String $direction = 'desc')
    {
        return $this->blotter->getAll($perPage,  $page,  $keyword, $userId, $remark, $incidentType, $sort, $direction);
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
     * Monthly blotter counts of one jurisdiction for a single year.
     * @param \App\Support\Jurisdiction $scope Jurisdiction of the viewing account
     * @param int $year year to fetch
     * @return array
     */
    public function getYearlyBlotterByMonth(Jurisdiction $scope, Int $year)
    {
        return  $this->blotter->getYearlyBlotterByMonth($scope, $year);
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
     * Every blotter entry of one jurisdiction inside a single month.
     * @param \App\Support\Jurisdiction $scope Jurisdiction of the viewing account
     * @param int $year year to fetch
     * @param int $month month to fetch
     * @return array
     */
    public function getDailyBlotterByMonth(Jurisdiction $scope, Int $year, Int $month)
    {
        return  $this->blotter->getDailyBlotterByMonth($scope, $year, $month);
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
     * Blotter counts grouped by disposition (`remarks`) within one jurisdiction.
     * @param \App\Support\Jurisdiction $scope Jurisdiction of the viewing account
     * @param string|null $from Inclusive start date, Y-m-d
     * @param string|null $to Inclusive end date, Y-m-d
     * @return array<int,int>
     */
    public function getCountsByRemark(Jurisdiction $scope, ?string $from = null, ?string $to = null)
    {
        return $this->blotter->getCountsByRemark($scope, $from, $to);
    }

    /**
     * Blotter counts grouped by incident type within one jurisdiction.
     * @param \App\Support\Jurisdiction $scope Jurisdiction of the viewing account
     * @param string|null $from Inclusive start date, Y-m-d
     * @param string|null $to Inclusive end date, Y-m-d
     * @return array<int,array{id:int,count:int}>
     */
    public function getCountsByIncidentType(Jurisdiction $scope, ?string $from = null, ?string $to = null)
    {
        return $this->blotter->getCountsByIncidentType($scope, $from, $to);
    }

    /**
     * Plain blotter count of one jurisdiction inside a window.
     * @param \App\Support\Jurisdiction $scope Jurisdiction of the viewing account
     * @param string|null $from Inclusive start date, Y-m-d
     * @param string|null $to Inclusive end date, Y-m-d
     * @return int
     */
    public function getCountInRange(Jurisdiction $scope, ?string $from = null, ?string $to = null)
    {
        return $this->blotter->getCountInRange($scope, $from, $to);
    }

    /**
     * Recent blotter entries of one jurisdiction for the console table.
     * @param \App\Support\Jurisdiction $scope Jurisdiction of the viewing account
     * @param int $perPage Rows per page
     * @param int $page Page number
     * @param string $keyword Matches entry number, complainant, respondent or location
     * @param string|null $from Inclusive start date, Y-m-d
     * @param string|null $to Inclusive end date, Y-m-d
     * @param int|null $areaCode Narrow to one unit below this jurisdiction
     * @return LengthAwarePaginator
     */
    public function getRecentForDashboard(
        Jurisdiction $scope,
        Int $perPage,
        Int $page,
        String $keyword = '',
        ?string $from = null,
        ?string $to = null,
        ?int $remark = null,
        ?int $incidentType = null,
        ?string $purok = null,
        String $sort = 'id',
        String $direction = 'desc',
        ?int $areaCode = null
    ) {
        return $this->blotter->getRecentForDashboard(
            $scope,
            $perPage,
            $page,
            $keyword,
            $from,
            $to,
            $remark,
            $incidentType,
            $purok,
            $sort,
            $direction,
            $areaCode
        );
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
     * Incident types this barangay has recorded, with entry counts.
     * @param int $userId Barangay user ID
     * @return array
     */
    public function getIncidentTypeBreakdown(Int $userId)
    {
        return $this->blotter->getIncidentTypeBreakdown($userId);
    }

    /**
     * Puroks/villages recorded inside one jurisdiction, with entry counts.
     * @param \App\Support\Jurisdiction $scope Jurisdiction of the viewing account
     * @param string|null $from Inclusive start date, Y-m-d
     * @param string|null $to Inclusive end date, Y-m-d
     * @return array
     */
    public function getPurokBreakdown(Jurisdiction $scope, ?string $from = null, ?string $to = null)
    {
        return $this->blotter->getPurokBreakdown($scope, $from, $to);
    }

    /**
     * Entry counts per unit one level below the viewer -- barangays for a
     * station, cities for a province, provinces for a region, regions for the
     * super admin.
     * @param \App\Support\Jurisdiction $scope Jurisdiction of the viewing account
     * @param string|null $from Inclusive start date, Y-m-d
     * @param string|null $to Inclusive end date, Y-m-d
     * @return array
     */
    public function getAreaBreakdown(Jurisdiction $scope, ?string $from = null, ?string $to = null)
    {
        return $this->blotter->getAreaBreakdown($scope, $from, $to);
    }

    /**
     * Complainant and total person counts behind one jurisdiction's entries.
     * @param \App\Support\Jurisdiction $scope Jurisdiction of the viewing account
     * @param string|null $from Inclusive start date, Y-m-d
     * @param string|null $to Inclusive end date, Y-m-d
     * @return array{complainants: int, personsInvolved: int}
     */
    public function getPeopleCounts(Jurisdiction $scope, ?string $from = null, ?string $to = null)
    {
        return $this->blotter->getPeopleCounts($scope, $from, $to);
    }

    /**
     * Paginated barangay entries narrowed by incident type or purok.
     * @param int $userId Barangay user ID
     * @param int $perPage Rows per page
     * @param int $page Page number
     * @param string $keyword Free-text search
     * @param int|null $incidentType Narrow to one incident type
     * @param string|null $village Narrow to one purok
     * @param int|null $remark Narrow to one disposition
     * @param string $sort Sort key
     * @param string $direction asc|desc
     * @return LengthAwarePaginator
     */
    public function getBarangayEntries(
        Int $userId,
        Int $perPage,
        Int $page,
        String $keyword = '',
        ?int $incidentType = null,
        ?string $village = null,
        ?int $remark = null,
        String $sort = 'id',
        String $direction = 'desc'
    ) {
        return $this->blotter->getBarangayEntries(
            $userId,
            $perPage,
            $page,
            $keyword,
            $incidentType,
            $village,
            $remark,
            $sort,
            $direction
        );
    }

    /**
     * Entry counts per disposition for one barangay.
     * @param int $userId Barangay user ID
     * @return array<int, int>
     */
    public function getRemarkBreakdown(Int $userId)
    {
        return $this->blotter->getRemarkBreakdown($userId);
    }
}

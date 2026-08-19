<?php

namespace App\Http\Controllers;

use App\Models\IncidentReport;
use App\Services\BlotterService;
use App\Support\Jurisdiction;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * The one console every signed-in account works out of.
 *
 * Barangay, municipal/station, provincial, regional and super admin accounts all
 * render the same page with the same controls; what changes is how wide the
 * jurisdiction is and what the area breakdown groups by. A barangay sees its own
 * entries broken down by purok, a station the barangays of its city, a province
 * its cities, a region its provinces, and the super admin every region.
 *
 * All scoping goes through App\Support\Jurisdiction — nothing here compares
 * PSGC codes by hand.
 */
class ConsoleController extends Controller
{
    protected $blotterService;

    public function __construct(BlotterService $blotterService)
    {
        $this->blotterService = $blotterService;
    }

    /**
     * Dispositions rolled up into the headline buckets on the console. Keys are
     * `remarks` values, see resources/js/utils/data/disposition.ts.
     */
    private const STATUS_GROUPS = [
        'pending' => [3],       // Pending
        'inProgress' => [1, 4], // For Hearing, Referred to PNP
        'resolved' => [2],      // Amicably Settled
    ];

    /** Every disposition the blotter form can record, in display order. */
    private const DISPOSITIONS = [1, 2, 3, 4, 5];

    /** Blotter monitoring console, scoped to the caller's jurisdiction. */
    public function dashboard(Request $request)
    {
        $user = auth()->user();
        $scope = Jurisdiction::forUser($user);

        [$from, $to] = $this->resolveDashboardRange($request);

        // The window immediately before the selected one, same length, so the
        // "vs previous period" delta compares like with like.
        $length = intval(Carbon::parse($from)->diffInDays(Carbon::parse($to))) + 1;
        $previousTo = Carbon::parse($from)->subDay()->toDateString();
        $previousFrom = Carbon::parse($previousTo)->subDays($length - 1)->toDateString();

        $countsByRemark = $this->blotterService->getCountsByRemark($scope, $from, $to);

        $total = array_sum($countsByRemark);
        $grouped = [];

        foreach (self::STATUS_GROUPS as $group => $remarks) {
            $grouped[$group] = array_sum(array_intersect_key($countsByRemark, array_flip($remarks)));
        }

        // Anything not in the three buckets — "Others", plus any legacy or blank
        // disposition — so the cards always add up to the total.
        $grouped['others'] = $total - array_sum($grouped);

        $previousTotal = $this->blotterService->getCountInRange($scope, $previousFrom, $previousTo);

        $perPage = intval($request->get('per_page') ?: 10);
        $page = intval($request->get('page') ?: 1);
        $keyword = (string) ($request->get('search') ?? '');

        // Console table filters. Zero/blank means "All" for each of them.
        $remark = intval($request->get('remarks')) ?: null;
        $incidentType = intval($request->get('incident_type')) ?: null;
        $purok = $request->get('purok');
        $purok = is_string($purok) && $purok !== '' ? $purok : null;
        // Above barangay level the area filter is a PSGC code of the level
        // below, not a purok name.
        $areaCode = intval($request->get('area')) ?: null;
        $sort = (string) ($request->get('sort') ?: 'id');
        $direction = (string) ($request->get('direction') ?: 'desc');

        $people = $this->blotterService->getPeopleCounts($scope, $from, $to);
        $byArea = $this->areaBreakdown($scope, $from, $to);

        return Inertia::render('Console', [
            'console' => $scope->toArray(),
            'dashboard' => [
                'summary' => [
                    'total' => $total,
                    'pending' => $grouped['pending'],
                    'inProgress' => $grouped['inProgress'],
                    // The headline "Active Cases" card: everything not yet closed.
                    'active' => $grouped['pending'] + $grouped['inProgress'],
                    'resolved' => $grouped['resolved'],
                    'others' => $grouped['others'],
                    'complainants' => $people['complainants'],
                    'personsInvolved' => $people['personsInvolved'],
                    'resolvedRate' => $total > 0 ? round($grouped['resolved'] * 100 / $total, 1) : 0,
                    'previousTotal' => $previousTotal,
                    'trend' => $total - $previousTotal,
                    // How many units one level down actually reported in the
                    // range, against how many barangays the jurisdiction holds.
                    'areasReporting' => count($byArea),
                    'barangayCount' => $scope->barangayCount(),
                ],
                'byStatus' => $this->statusBreakdown($countsByRemark),
                'byIncidentType' => $this->blotterService->getCountsByIncidentType($scope, $from, $to),
                'byArea' => $byArea,
                'monthly' => $this->monthlySeries($scope),
                'records' => $this->blotterService->getRecentForDashboard(
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
                ),
            ],
            'filters' => [
                'from' => $from,
                'to' => $to,
                'search' => $keyword,
                'perPage' => $perPage,
                'remarks' => $remark ?? 0,
                'incidentType' => $incidentType ?? 0,
                'purok' => $purok ?? '',
                'area' => $areaCode ?? 0,
                'sort' => $sort,
                'direction' => $direction,
            ],
            // Pre-fills the entry number when a barangay opens a new entry.
            // Only barangay accounts encode, so nobody else needs it.
            'nextEntryNumber' => $scope->canEncode()
                ? intval(optional($this->blotterService->getLatest($user->id))->entry_number) + 1
                : 0,
            // Live emergency reports feed, kept below the blotter console.
            'incidentCounts' => $this->incidentReportCounts(),
        ]);
    }

    /**
     * Entry counts for the console's area chart and area filter.
     *
     * A barangay groups by purok — the complainant's recorded village — and
     * everyone above it groups by the jurisdiction one level down, which the
     * frontend names from its PSGC lookups.
     *
     * @param \App\Support\Jurisdiction $scope Jurisdiction of the viewing account
     * @param string $from Inclusive start date, Y-m-d
     * @param string $to Inclusive end date, Y-m-d
     * @return array<int,array{code:int,name:string|null,count:int}>
     */
    private function areaBreakdown(Jurisdiction $scope, string $from, string $to): array
    {
        $rows = $scope->childColumn() === null
            ? $this->blotterService->getPurokBreakdown($scope, $from, $to)
            : $this->blotterService->getAreaBreakdown($scope, $from, $to);

        return array_map(fn ($row) => [
            'code' => intval($row->code ?? 0),
            'name' => isset($row->name) ? (string) $row->name : null,
            'count' => intval($row->count),
        ], $rows);
    }

    /**
     * Twelve-month blotter counts for the trend chart: the current year against
     * the same months last year. Independent of the console's date range — the
     * chart is always a full-year comparison.
     *
     * @param \App\Support\Jurisdiction $scope Jurisdiction of the viewing account
     * @return array{year:int,previousYear:int,current:array<int,int>,previous:array<int,int>}
     */
    private function monthlySeries(Jurisdiction $scope): array
    {
        $year = intval(date('Y'));

        $toMonths = function (Int $forYear) use ($scope): array {
            // MONTH() is 1-12; the chart wants a dense 12-slot array.
            $months = array_fill(0, 12, 0);

            foreach ($this->blotterService->getYearlyBlotterByMonth($scope, $forYear) as $row) {
                $index = intval($row->month) - 1;

                if ($index >= 0 && $index < 12) {
                    $months[$index] = intval($row->count);
                }
            }

            return $months;
        };

        return [
            'year' => $year,
            'previousYear' => $year - 1,
            'current' => $toMonths($year),
            'previous' => $toMonths($year - 1),
        ];
    }

    /**
     * Counts per disposition for the bar chart. Every known disposition is
     * present even at zero so the rows stay stable as the range changes, and
     * anything stored outside the lookup is folded into a trailing bucket so
     * the chart still adds up to the "Total Blotters" card.
     *
     * @param array<int,int> $countsByRemark Disposition ID => count
     * @return array<int,array{id:int,count:int}>
     */
    private function statusBreakdown(array $countsByRemark): array
    {
        $rows = array_map(fn ($id) => [
            'id' => $id,
            'count' => $countsByRemark[$id] ?? 0,
        ], self::DISPOSITIONS);

        $unknown = array_sum($countsByRemark) - array_sum(array_column($rows, 'count'));

        if ($unknown > 0) {
            // ID 0 renders as "Unspecified"; see Components/Barangay/Dashboard/status.ts.
            $rows[] = ['id' => 0, 'count' => $unknown];
        }

        return $rows;
    }

    /**
     * Inclusive Y-m-d bounds for the console, defaulting to the last 30 days.
     * An inverted or partial range falls back to the default rather than
     * returning an empty console.
     *
     * @param \Illuminate\Http\Request $request The HTTP request
     * @return array{0:string,1:string}
     */
    private function resolveDashboardRange(Request $request): array
    {
        $request->validate([
            'from' => 'nullable|date',
            'to' => 'nullable|date',
        ]);

        $from = $request->get('from');
        $to = $request->get('to');

        if (!$from || !$to || Carbon::parse($from)->gt(Carbon::parse($to))) {
            return [
                Carbon::now()->subDays(29)->toDateString(),
                Carbon::now()->toDateString(),
            ];
        }

        return [
            Carbon::parse($from)->toDateString(),
            Carbon::parse($to)->toDateString(),
        ];
    }

    /**
     * Emergency incident report totals per status, in status order 1..4.
     *
     * Citizen reports carry no jurisdiction of their own, so every level sees
     * the same feed.
     *
     * @return array<int,int>
     */
    private function incidentReportCounts(): array
    {
        // One grouped query instead of four table scans.
        $countsByStatus = IncidentReport::selectRaw('status, COUNT(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        return [
            (int) $countsByStatus->get(1, 0),
            (int) $countsByStatus->get(2, 0),
            (int) $countsByStatus->get(3, 0),
            (int) $countsByStatus->get(4, 0),
        ];
    }
}

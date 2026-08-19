<?php

namespace App\Http\Controllers;

use App\Models\Blotter;
use App\Models\UserAddress;
use App\Services\BlotterService;
use App\Support\Jurisdiction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class BlotterController extends Controller
{
    protected $blotterService;
    public $blottersUrl = 'Blotter/Blotters';

    public function __construct(BlotterService $blotterService)
    {
        $this->blotterService = $blotterService;
    }

    /**
     * Method to create blotter data based on
     * @param \Illuminate\Http\Request $request The HTTP request
     */
    public function index(Request $request)
    {
        $userId = auth()->user()->id;

        try {
            $latestBlotter = $this->blotterService->getLatest($userId);

            $latestBlotterId = is_null($latestBlotter) ? 1 : $latestBlotter->entry_number + 1;

            return Inertia::render('Blotter/New', [
                'latestID' => $latestBlotterId
            ]);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th], 500);
        }
    }

    /**
     * Method to create blotter data based on
     * @param \Illuminate\Http\Request $request The HTTP request
     */
    public function create(Request $request)
    {
        $userId = auth()->user()->id;

        $request->validate([
            'entry_number' => 'required|integer|min:1',
            'incident_type' => 'required|integer',
            'date_reported' => 'required|date',
            'date_of_incident' => 'required|date',
            'narrative' => 'nullable|string|max:10000',
            'uploaded_file' => 'nullable|image|mimes:jpg,jpeg,png|max:10240',
        ]);

        // The entry always belongs to the signed-in barangay; a `user_id` in the
        // body would otherwise let one barangay file under another's name.
        $request->merge(['user_id' => $userId]);

        try {
            $this->blotterService->create($request);

            if ($request->hasFile('uploaded_file')) {
                $image = $request->file('uploaded_file');

                // Derive the extension from the detected MIME type rather than
                // trusting the client-supplied filename, and keep it unique so
                // two uploads in the same second cannot overwrite each other.
                $imageName = uniqid('incident_', true) . '.' . $image->extension();

                $image->move(public_path("images/{$userId}/incidents"), $imageName);

                Blotter::where('user_id', $userId)
                    ->where('entry_number', $request->get('entry_number'))
                    ->update(['uploaded_file' => $imageName]);
            }

            // The caller decides what to show next: the console modal reloads
            // its own props in place, the standalone form returns to itself
            // with a fresh entry number.
            return back()->with('message', 'Blotter entry submitted.');
        } catch (\Throwable $th) {
            report($th);

            return back()->with('error', 'Unable to save the blotter entry.');
        }
    }



    /**
     * Method to retrieve all blotter entries
     * @param \Illuminate\Http\Request $request The HTTP request
     */
    public function getAll(Request $request)
    {
        $authUser = auth()->user();

        $brgyCode = intval($request->get('brgy_code'));
        $remark = intval($request->get('remarks'));
        $incidentType = intval($request->get('incident_type'));

        $authAddress = UserAddress::where('user_id', $authUser->id)->first();

        // Barangays with blotter records, limited to the viewer's jurisdiction.
        $brgyQuery = DB::table("user_addresses as ua")
            ->join("blotters as b", "ua.user_id", '=', 'b.user_id')
            ->selectRaw('DISTINCT ua.barangay_code')
            ->groupBy('ua.barangay_code');

        $brgyWithRecords = $this->scopeToJurisdiction($brgyQuery, $authUser, $authAddress, 'ua')
            ->get()
            ->toArray();

        // A drill-down into one barangay is only allowed if that barangay sits
        // inside the viewer's own jurisdiction, otherwise fall back to their own
        // scope. Without this a station could read any barangay in the country.
        $userId = $authUser->id;

        if ($brgyCode > 0) {
            $target = UserAddress::where('barangay_code', $brgyCode)->first();

            if ($target && $this->isWithinJurisdiction($authUser, $authAddress, $target)) {
                $userId = $target->user_id;
            } else {
                $brgyCode = 0;
            }
        }

        $perPage = intval($request->get('per_page') ?: 10);
        $page = intval($request->get('page') ?: 1);
        $keyword = $request->get('keyword') ?? "";
        $sort = $request->get('sort') ?: 'id';
        $direction = strtolower($request->get('direction')) === 'asc' ? 'asc' : 'desc';

        $blotters = $this->blotterService->getAll($perPage, $page, $keyword, $userId, $remark, $incidentType, $sort, $direction);

        return Inertia::render($this->blottersUrl, [
            'blotters' => $blotters,
            'message' => 'successful retrieve',
            'pageDisplay' => $perPage,
            'pageNumber' => $page,
            'keyword' => $keyword,
            'cityCode' => $authUser->role == 1 ? null : ($authAddress->city_code ?? null),
            'brgyCode' => $brgyCode,
            'remark' => $remark,
            'incidentType' => $incidentType,
            'brgyWithRecords' => $brgyWithRecords,
            'sort' => $sort,
            'direction' => $direction,
        ]);
    }

    /**
     * Constrain a query on `user_addresses` to the viewer's level in the
     * barangay -> station -> province -> region -> super admin chain.
     *
     * @param \Illuminate\Database\Query\Builder $query
     * @param \App\Models\User $user The viewer
     * @param \App\Models\UserAddress|null $address The viewer's address row
     * @param string $alias Table alias used for user_addresses in $query
     */
    private function scopeToJurisdiction($query, $user, $address, string $alias)
    {
        // Super admin sees everything.
        if ($user->role == 1) {
            return $query;
        }

        // Anyone below super admin without an address row has no jurisdiction.
        if (!$address) {
            return $query->whereRaw('1 = 0');
        }

        return match (intval($user->role)) {
            2 => $query->where("{$alias}.user_id", $user->id),
            3 => $query->where("{$alias}.city_code", $address->city_code),
            4 => $query->where("{$alias}.province_code", $address->province_code),
            5 => $query->where("{$alias}.region_code", $address->region_code),
            default => $query->whereRaw('1 = 0'),
        };
    }

    /**
     * Whether $target sits inside the jurisdiction of $user.
     */
    private function isWithinJurisdiction($user, $address, UserAddress $target): bool
    {
        if ($user->role == 1) {
            return true;
        }

        if (!$address) {
            return false;
        }

        return match (intval($user->role)) {
            2 => $target->user_id == $user->id,
            3 => $target->city_code == $address->city_code,
            4 => $target->province_code == $address->province_code,
            5 => $target->region_code == $address->region_code,
            default => false,
        };
    }

    /**
     * Delete blotter record
     * @param \Illuminate\Http\Request $request The HTTP request
     */
    public function delete(Request $request)
    {
        // Barangays escalate removal to their municipal admin, and regional
        // accounts are read-only.
        if (!Jurisdiction::forUser(auth()->user())->canDelete()) {
            abort(403, 'Your account may not remove blotter entries.');
        }

        $request->validate(['id' => 'required|integer|exists:blotters,id']);

        $id = intval($request->get('id'));

        // Deleting is only allowed within the caller's own jurisdiction.
        $this->authorizeBlotter($id);

        try {
            $this->blotterService->delete($id);

            // Redirect back rather than rendering the standalone listing: the
            // console deletes from a table on its own page and must not be
            // navigated away from it.
            return back()->with('message', 'Blotter removed successfully.');
        } catch (\Throwable $th) {
            report($th);

            return back()->with('error', 'Unable to remove the blotter entry.');
        }
    }

    /**
     * Method to edit blotter data based on
     * @param \Illuminate\Http\Request $request The HTTP request
     */
    public function get(Request $request)
    {
        $request->validate(['id' => 'required|integer|exists:blotters,id']);

        $id = intval($request->get('id'));

        $this->authorizeBlotter($id);

        $blotter = $this->blotterService->get($id);

        return Inertia::render('Blotter/Edit', [
            'blotter' => $blotter
        ]);
    }

    /**
     * One blotter entry as JSON, for the console's view/edit modal.
     *
     * The console never leaves /dashboard, so the entry is fetched over XHR
     * rather than rendered as its own Inertia page.
     *
     * @param \Illuminate\Http\Request $request The HTTP request
     */
    public function record(Request $request)
    {
        $request->validate(['id' => 'required|integer|exists:blotters,id']);

        $id = intval($request->get('id'));

        $this->authorizeBlotter($id);

        $entry = $this->blotterService->getWithPeople($id);

        if (!$entry) {
            abort(404, 'That blotter entry no longer exists.');
        }

        return response()->json([
            'blotter' => $entry['blotter'],
            'complainants' => $entry['complainants'],
            'respondents' => $entry['respondents'],
            // The photo lives under the owning barangay's folder, not the
            // viewer's, so the URL is resolved server-side.
            'uploaded_file_url' => $entry['blotter']->uploaded_file
                ? "/images/{$entry['blotter']->user_id}/incidents/{$entry['blotter']->uploaded_file}"
                : null,
        ]);
    }

    /**
     * Save an edited blotter entry, with its complainant and respondent cards.
     *
     * @param \Illuminate\Http\Request $request The HTTP request
     */
    public function update(Request $request)
    {
        // Checked before validation: a read-only account is refused whatever it
        // sends, rather than being told which fields it got wrong first.
        if (!Jurisdiction::forUser(auth()->user())->canEdit()) {
            abort(403, 'Your account may not correct blotter entries.');
        }

        $request->validate([
            'id' => 'required|integer|exists:blotters,id',
            'entry_number' => 'required|integer|min:1',
            'incident_type' => 'required|integer',
            'date_reported' => 'required|date',
            'date_of_incident' => 'required|date',
            'narrative' => 'nullable|string|max:10000',
            'uploaded_file' => 'nullable|image|mimes:jpg,jpeg,png|max:10240',
            'complainant_data' => 'required|array|min:1',
            'respondent_data' => 'nullable|array',
        ]);

        $id = intval($request->get('id'));

        $blotter = $this->authorizeBlotter($id);

        try {
            $blotterData = $request->only([
                'entry_number',
                'barangay',
                'date_reported',
                'time_of_report',
                'date_of_incident',
                'time_of_incident',
                'incident_type',
                'narrative',
                'remarks',
                'recorded_by',
            ]);

            // A new photo replaces the stored filename; leaving the field alone
            // keeps the existing one, so `uploaded_file` is only ever written
            // when a file actually arrived.
            if ($request->hasFile('uploaded_file')) {
                $image = $request->file('uploaded_file');

                // Extension from the detected MIME type, not the client-supplied
                // filename, and unique so two uploads cannot collide.
                $imageName = uniqid('incident_', true) . '.' . $image->extension();

                $image->move(public_path("images/{$blotter->user_id}/incidents"), $imageName);

                $blotterData['uploaded_file'] = $imageName;
            } elseif ($request->get('remove_uploaded_file')) {
                $blotterData['uploaded_file'] = null;
            }

            // A section the form did not send is left as it stands, rather
            // than read as "the barangay removed every card".
            $this->blotterService->updateWithPeople(
                $id,
                $blotterData,
                $request->has('complainant_data') ? (array) $request->get('complainant_data') : null,
                $request->has('respondent_data') ? (array) $request->get('respondent_data') : null
            );

            // The console reloads its own props; every other caller lands back
            // where it submitted from.
            return back()->with('message', 'Blotter entry updated.');
        } catch (\Throwable $th) {
            report($th);

            return back()->with('error', 'Unable to update the blotter entry.');
        }
    }

    /**
     * Load one entry and refuse it when it sits outside the caller's
     * jurisdiction. Every single-entry action routes through here so the
     * check cannot be forgotten on one of them.
     *
     * @param int $id unique ID of the blotter
     * @return \App\Models\Blotter
     */
    private function authorizeBlotter(Int $id)
    {
        $authUser = auth()->user();

        $blotter = Blotter::findOrFail($id);

        $authAddress = UserAddress::where('user_id', $authUser->id)->first();
        $ownerAddress = UserAddress::where('user_id', $blotter->user_id)->first();

        if (!$ownerAddress || !$this->isWithinJurisdiction($authUser, $authAddress, $ownerAddress)) {
            abort(403, 'That blotter entry is outside your jurisdiction.');
        }

        return $blotter;
    }

    /**
     * Method to get monthly blotter data based on
     * @param \Illuminate\Http\Request $request The HTTP request
     */
    public function getYearlyBlotterByMonth(Request $request)
    {
        // Every level opens this report from its console, so it is scoped to the
        // caller's jurisdiction rather than to one barangay.
        $scope = Jurisdiction::forUser(auth()->user());
        // Query params arrive as strings; the service is typed `Int` and a blank
        // value would raise a TypeError instead of falling back.
        $year = intval($request->get('blotterYear') ?: date('Y'));

        try {
            $monthlyBlotters = $this->blotterService->getYearlyBlotterByMonth($scope, $year);

            $payload = ['year' => $year, 'monthlyBlotters' => $monthlyBlotters];

            // The console reads its reports into a modal over XHR.
            if ($request->wantsJson() && !$request->header('X-Inertia')) {
                return response()->json($payload);
            }

            return Inertia::render('Blotter/Monthly', $payload);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th], 500);
        }
    }

    /**
     * Method to get daily blotter data based on
     * @param \Illuminate\Http\Request $request The HTTP request
     */
    public function getDailyBlotterByMonth(Request $request)
    {
        $scope = Jurisdiction::forUser(auth()->user());
        $year = intval($request->get('blotterYear') ?: date('Y'));
        $month = intval($request->get('blotterMonth') ?: date('n'));

        try {
            $dailyBlotters = $this->blotterService->getDailyBlotterByMonth($scope, $year, $month);

            $payload = [
                'year' => $year,
                'month' => $month,
                'dailyBlotters' => $dailyBlotters,
            ];

            if ($request->wantsJson() && !$request->header('X-Inertia')) {
                return response()->json($payload);
            }

            return Inertia::render('Blotter/Daily', $payload);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th], 500);
        }
    }

    /**
     * Case disposition list: /hearing, /settled, /referred and /pending.
     *
     * The disposition comes from the route name. All four routes previously
     * read it from an optional `remark` query string that nothing ever set, so
     * every one of them rendered the same unfiltered list.
     *
     * @param \Illuminate\Http\Request $request The HTTP request
     */
    public function getBlotterByRemarks(Request $request)
    {
        $userId = auth()->user()->id;
        $perPage = intval($request->get('per_page') ?: 10);
        $page = intval($request->get('page') ?: 1);
        $keyword = $request->get('keyword') ?? "";
        $sort = $request->get('sort') ?? 'id';
        $direction = $request->get('direction') ?? 'desc';

        // Keep in step with resources/js/utils/data/disposition.ts.
        $remarksByRoute = [
            'hearing' => 1,
            'settled' => 2,
            'pending' => 3,
            'referred' => 4,
        ];

        $routeName = $request->route()?->getName();
        $remark = $remarksByRoute[$routeName] ?? intval($request->get('remark'));

        try {
            $blotters = $this->blotterService->getBarangayEntries(
                $userId,
                $perPage,
                $page,
                $keyword,
                null,
                null,
                $remark,
                $sort,
                $direction
            );

            // Counts for the tab strip, so the user can see where the workload
            // sits without visiting each tab in turn.
            $breakdown = $this->blotterService->getRemarkBreakdown($userId);

            $counts = [];

            foreach ($remarksByRoute as $name => $id) {
                $counts[$name] = $breakdown[$id] ?? 0;
            }

            return Inertia::render('Hearing', [
                'blotters' => $blotters,
                'counts' => $counts,
                'remark' => $remark,
                'routeName' => $routeName,
                'message' => 'successful retrieve',
                'pageDisplay' => $perPage,
                'pageNumber' => $page,
                'keyword' => $keyword,
                'sort' => $sort,
                'direction' => $direction,
            ]);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }

    /**
     * Method to view blotter data based on
     * @param \Illuminate\Http\Request $request The HTTP request
     */
    public function view(Request $request)
    {
        $id = $request->get('id');

        try {
            $blotter = $this->blotterService->get($id);

            return Inertia::render('Blotter/View', [
                'blotter' => $blotter
            ]);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th], 500);
        }
    }

    /**
     * Barangay "Incidents by type" page.
     *
     * Previously this only worked when a chart drilled in with an
     * `incident_type` query string -- opening it from the sidebar filtered on
     * `null` and rendered an empty table with no way to pick a type. It now
     * always ships the barangay's own incident-type breakdown, so the page is
     * usable on its own and the drill-down simply pre-selects a type.
     *
     * @param \Illuminate\Http\Request $request The HTTP request
     */
    public function getBarangayIncidentByType(Request $request)
    {
        $userId = auth()->user()->id;

        $incidentType = intval($request->get('incident_type')) ?: null;
        $perPage = intval($request->get('per_page') ?: 10);
        $page = intval($request->get('page') ?: 1);
        $keyword = $request->get('keyword') ?? "";
        $sort = $request->get('sort') ?? 'id';
        $direction = $request->get('direction') ?? 'desc';

        try {
            return Inertia::render('Barangay/Incidents', [
                'incidents' => $this->blotterService->getBarangayEntries(
                    $userId,
                    $perPage,
                    $page,
                    $keyword,
                    $incidentType,
                    null,
                    $sort,
                    $direction
                ),
                'breakdown' => $this->blotterService->getIncidentTypeBreakdown($userId),
                'incidentType' => $incidentType,
                'pageDisplay' => $perPage,
                'pageNumber' => $page,
                'keyword' => $keyword,
                'sort' => $sort,
                'direction' => $direction,
            ]);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }

    /**
     * Barangay "Incidents by purok" page. Same story as the incident-type page
     * above: it now carries its own purok breakdown so the list can be browsed
     * without arriving from a chart.
     *
     * @param \Illuminate\Http\Request $request The HTTP request
     */
    public function getBarangayIncidentByPurok(Request $request)
    {
        $userId = auth()->user()->id;

        $purok = $request->get('purok');
        $purok = is_string($purok) && $purok !== '' ? $purok : null;
        $perPage = intval($request->get('per_page') ?: 10);
        $page = intval($request->get('page') ?: 1);
        $keyword = $request->get('keyword') ?? "";
        $sort = $request->get('sort') ?? 'id';
        $direction = $request->get('direction') ?? 'desc';

        try {
            return Inertia::render('Barangay/Puroks', [
                'puroks' => $this->blotterService->getBarangayEntries(
                    $userId,
                    $perPage,
                    $page,
                    $keyword,
                    null,
                    $purok,
                    $sort,
                    $direction
                ),
                'breakdown' => $this->blotterService->getPurokBreakdown(Jurisdiction::forUser(auth()->user())),
                'purok' => $purok,
                'pageDisplay' => $perPage,
                'pageNumber' => $page,
                'keyword' => $keyword,
                'sort' => $sort,
                'direction' => $direction,
            ]);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }
}

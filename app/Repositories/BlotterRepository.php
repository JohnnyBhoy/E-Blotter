<?php

namespace App\Repositories;

use App\Models\Blotter;
use App\Models\Complainant;
use App\Models\Respondent;
use App\Models\User;
use App\Models\UserAddress;
use App\Support\Jurisdiction;
use Carbon\Carbon;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
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

    /** Columns the blotter form may write on the `blotters` row itself. */
    public const BLOTTER_ATTRIBUTES = [
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

    /**
     * Blotter columns the schema declares NOT NULL with no default. A blank
     * value for one of these has to be written as an empty string.
     */
    public const REQUIRED_BLOTTER_ATTRIBUTES = [
        'user_id',
        'entry_number',
        'barangay',
        'date_reported',
        'time_of_report',
        'incident_type',
        'narrative',
        'remarks',
    ];

    /** Columns of one complainant card. */
    public const COMPLAINANT_ATTRIBUTES = [
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

    /** Complainant columns the schema declares NOT NULL with no default. */
    public const REQUIRED_COMPLAINANT_ATTRIBUTES = [
        'complainant_family_name',
        'complainant_first_name',
        'complainant_birth_date',
        'complainant_citizenship',
        'complainant_gender',
        'complainant_civil_status',
        'complainant_occupation',
        'complainant_education',
        'complainant_barangay',
        'complainant_city',
        'complainant_province',
        'complainant_region',
        'complainant_work_barangay',
        'complainant_work_city',
        'complainant_work_province',
        'complainant_work_region',
    ];

    /** Columns of one respondent (person complained of) card. */
    public const RESPONDENT_ATTRIBUTES = [
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

    /** Respondent columns the schema declares NOT NULL with no default. */
    public const REQUIRED_RESPONDENT_ATTRIBUTES = [
        'respondent_family_name',
        'respondent_first_name',
        'respondent_birth_date',
        'respondent_citizenship',
        'respondent_gender',
        'respondent_civil_status',
        'respondent_occupation',
        'respondent_education',
        'respondent_barangay',
        'respondent_city',
        'respondent_province',
        'respondent_region',
        'respondent_work_barangay',
        'respondent_work_city',
        'respondent_work_province',
        'respondent_work_region',
    ];

    /**
     * Method to create blotter data based on
     * @param \Illuminate\Http\Request $request The HTTP request
     * @return boolean
     */
    public function create(Request $request)
    {
        // `input()` rather than `all()`: an uploaded file is moved and named by
        // the controller, and must never be cast into the column itself.
        $blotterCreatePairs = $this->rowValues(
            $this->blotter,
            self::BLOTTER_ATTRIBUTES,
            $request->input(),
            self::REQUIRED_BLOTTER_ATTRIBUTES,
            true
        );

        // Use the model returned by create() rather than re-querying by
        // (user_id, entry_number) -- that lookup returns null when either field
        // is absent, and matches the wrong row on a duplicate entry number.
        $blotter = Blotter::create($blotterCreatePairs);

        $entryNumber = [
            'blotter_id' => $blotter->id,
            'user_id' => $blotter->user_id,
            'entry_number' => $blotter->entry_number,
        ];

        foreach ((array) $request->get('complainant_data') as $complainant) {
            if (!$this->hasContent((array) $complainant)) {
                continue;
            }

            Complainant::create(array_merge($entryNumber, $this->rowValues(
                $this->complainant,
                self::COMPLAINANT_ATTRIBUTES,
                (array) $complainant,
                self::REQUIRED_COMPLAINANT_ATTRIBUTES,
                true
            )));
        }

        foreach ((array) $request->get('respondent_data') as $respondent) {
            if (!$this->hasContent((array) $respondent)) {
                continue;
            }

            Respondent::create(array_merge($entryNumber, $this->rowValues(
                $this->respondent,
                self::RESPONDENT_ATTRIBUTES,
                (array) $respondent,
                self::REQUIRED_RESPONDENT_ATTRIBUTES,
                true
            )));
        }

        return $blotter;
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
    public function getAll(Int $perPage, Int $page, String $keyword, Int $userId, Int $remark, Int $incidentType, String $sort = 'id', String $direction = 'desc')
    {
        // Check rule of user
        $user = User::find($userId);

        // Only columns that are actually selected below may be sorted on, so a
        // crafted `sort` query string cannot reach an arbitrary column.
        $sortable = [
            'entry_number' => 'b.entry_number',
            'complainant' => 'c.complainant_family_name',
            'respondent' => 'r.respondent_family_name',
            'incident_type' => 'b.incident_type',
            'date' => 'b.date_of_incident',
            'remarks' => 'b.remarks',
            'id' => 'b.id',
        ];

        $sortColumn = $sortable[$sort] ?? 'b.id';
        $sortDirection = strtolower($direction) === 'asc' ? 'asc' : 'desc';

        $blotterTable = $this->blotter;
        $complainantTable = $this->complainant;
        $respondentTable = $this->respondent;

        $query =  DB::table("{$blotterTable} as b")
            ->leftJoin("{$complainantTable} as c", 'b.id', '=', 'c.blotter_id')
            ->leftJoin("{$respondentTable} as r", 'b.id', '=', 'r.blotter_id')
            ->select(
                'b.id',
                'b.user_id',
                'b.date_reported',
                'b.time_of_report',
                'b.date_of_incident',
                'b.time_of_incident',
                'b.entry_number',
                'c.complainant_family_name',
                'c.complainant_first_name',
                'c.complainant_middle_name',
                'c.complainant_street',
                'c.complainant_village',
                'c.complainant_barangay',
                'r.respondent_family_name',
                'r.respondent_first_name',
                'r.respondent_middle_name',
                'b.incident_type',
                'b.created_at',
                'b.remarks',
                'b.uploaded_file',
            )
            ->where('c.complainant_family_name', '!=', null)
            ->where('c.complainant_family_name', '!=', "")
            ->whereAny([
                'b.entry_number',
                'b.date_reported',
                'b.incident_type',
                'b.narrative',
                'b.remarks',
                'b.user_id',
                'b.date_reported',
                'b.time_of_report',
                'b.date_of_incident',
                'b.time_of_incident',
                'b.recorded_by',
                'c.complainant_family_name',
                'c.complainant_first_name',
                'c.complainant_middle_name',
                'c.complainant_street',
                'c.complainant_village',
                'c.complainant_barangay',
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
            ->orderBy($sortColumn, $sortDirection)
            // Tiebreaker keeps pagination stable when the sort column repeats.
            ->orderBy('b.id', 'desc')
            ->distinct();

        if (is_numeric($remark) && $remark > 0) {
            $query = $query->where('b.remarks', $remark);
        }


        if (is_numeric($incidentType) && $incidentType > 0) {
            $query = $query->where('b.incident_type', $incidentType);
        }

        return $this->scopeByRole($query, $user, $userId)
            ->paginate($perPage, ['*'], 'page', $page);
    }

    /**
     * Restrict a blotter query to the jurisdiction the given user is allowed
     * to read, following the barangay -> station -> province -> region ->
     * super admin chain. Blotters carry no jurisdiction column of their own, so
     * the scope is resolved through `user_addresses`.
     *
     * @param \Illuminate\Database\Query\Builder $query
     * @param \App\Models\User|null $user
     * @param int $userId
     * @return \Illuminate\Database\Query\Builder
     */
    private function scopeByRole($query, $user, Int $userId)
    {
        // Unknown user: return nothing rather than every blotter in the system.
        if (!$user) {
            return $query->whereRaw('1 = 0');
        }

        // Super admin is unscoped.
        if ($user->role == 1) {
            return $query;
        }

        // Barangay only ever sees its own entries.
        if ($user->role == 2) {
            return $query->where('b.user_id', $userId);
        }

        $address = UserAddress::where('user_id', $userId)->first();

        if (!$address) {
            return $query->whereRaw('1 = 0');
        }

        // `value()`/`first()` here, not `pluck()` — a Collection bound as a
        // query parameter blows up at the driver instead of filtering.
        $column = match (intval($user->role)) {
            3 => 'city_code',
            4 => 'province_code',
            5 => 'region_code',
            default => null,
        };

        if ($column === null) {
            return $query->whereRaw('1 = 0');
        }

        $barangayIds = UserAddress::where($column, $address->{$column})->pluck('user_id');

        return $query->whereIn('b.user_id', $barangayIds);
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
     * One blotter entry with every person attached to it.
     *
     * `get()` joins the child tables and so collapses an entry with two
     * complainants into a single row; the console modal has to edit each card
     * separately, so the children come back as their own lists here.
     *
     * @param int $id unique ID of the blotter
     * @return array{blotter:Model,complainants:Collection,respondents:Collection}|null
     */
    public function getWithPeople(Int $id)
    {
        $blotter = Blotter::find($id);

        if (!$blotter) {
            return null;
        }

        return [
            'blotter' => $blotter,
            'complainants' => Complainant::where('blotter_id', $id)->orderBy('id')->get(),
            'respondents' => Respondent::where('blotter_id', $id)->orderBy('id')->get(),
        ];
    }

    /**
     * Update an entry together with its complainant and respondent cards.
     *
     * The person lists are synced positionally: existing rows are updated in
     * order, extra cards are inserted and removed cards are deleted. Rewriting
     * them wholesale would churn primary keys that other reports join on.
     *
     * A null person list means "the form did not send this section" and leaves
     * those rows untouched; an empty array means the barangay removed every
     * card and does delete them.
     *
     * @param int $id unique ID of the blotter
     * @param array $blotterData Values for the `blotters` row
     * @param array|null $complainants One associative array per complainant card
     * @param array|null $respondents One associative array per respondent card
     * @return Model The updated blotter
     */
    public function updateWithPeople(Int $id, array $blotterData, ?array $complainants, ?array $respondents)
    {
        return DB::transaction(function () use ($id, $blotterData, $complainants, $respondents) {
            $blotter = Blotter::findOrFail($id);

            $blotter->update($this->rowValues(
                $this->blotter,
                self::BLOTTER_ATTRIBUTES,
                $blotterData,
                self::REQUIRED_BLOTTER_ATTRIBUTES,
                false
            ));

            $keys = [
                'blotter_id' => $blotter->id,
                'user_id' => $blotter->user_id,
                'entry_number' => $blotter->entry_number,
            ];

            if ($complainants !== null) {
                $this->syncPeople(
                    Complainant::class,
                    $this->complainant,
                    self::COMPLAINANT_ATTRIBUTES,
                    self::REQUIRED_COMPLAINANT_ATTRIBUTES,
                    $keys,
                    $complainants
                );
            }

            if ($respondents !== null) {
                $this->syncPeople(
                    Respondent::class,
                    $this->respondent,
                    self::RESPONDENT_ATTRIBUTES,
                    self::REQUIRED_RESPONDENT_ATTRIBUTES,
                    $keys,
                    $respondents
                );
            }

            return $blotter->fresh();
        });
    }

    /**
     * Match one blotter's person rows to the cards the form submitted.
     *
     * @param class-string<Model> $model Complainant or Respondent
     * @param string $table That model's table
     * @param array $attributes Writable columns for that model
     * @param array $required Columns of that model the schema declares NOT NULL
     * @param array $keys blotter_id / user_id / entry_number applied to every row
     * @param array $cards Submitted cards, in display order
     */
    private function syncPeople(string $model, string $table, array $attributes, array $required, array $keys, array $cards): void
    {
        $existing = $model::where('blotter_id', $keys['blotter_id'])
            ->orderBy('id')
            ->get();

        // The form always renders one card per section, so an entry with no
        // person complained of still posts an empty one. Saving that would
        // leave a row of nulls behind.
        $cards = array_values(array_filter($cards, fn ($card) => $this->hasContent((array) $card)));

        foreach ($cards as $index => $card) {
            if ($existing->has($index)) {
                // Only the fields the form sent are touched, so a partial
                // payload cannot blank out the rest of the card.
                $existing[$index]->update(
                    $this->rowValues($table, $attributes, (array) $card, $required, false)
                );

                continue;
            }

            $model::create(array_merge(
                $keys,
                $this->rowValues($table, $attributes, (array) $card, $required, true)
            ));
        }

        // Cards the barangay removed in the modal.
        foreach ($existing->slice(count($cards)) as $orphan) {
            $orphan->delete();
        }
    }

    /**
     * Whether a person card carries anything the barangay actually typed.
     *
     * The reference selects (citizenship, gender, ...) default to their first
     * option, so a card counts as filled only when a name, a date or an
     * address was entered.
     *
     * @param array $card One submitted person card
     * @return bool
     */
    private function hasContent(array $card): bool
    {
        foreach ($card as $key => $value) {
            if (str_ends_with($key, '_family_name')
                || str_ends_with($key, '_first_name')
                || str_ends_with($key, '_middle_name')
                || str_ends_with($key, '_birth_date')
                || str_ends_with($key, '_place_of_birth')
                || str_ends_with($key, '_email_address')
                || str_ends_with($key, '_street')
                || str_ends_with($key, '_village')
            ) {
                if (trim((string) $value) !== '') {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * One row's values, with blanks resolved against the schema.
     *
     * Most blotter columns are NOT NULL with no default, so an unanswered
     * optional field cannot simply be left out -- the insert would fail -- nor
     * set to null. Those are written as an empty string; genuinely nullable
     * columns are nulled, which is what clearing a field in the form means.
     *
     * @param string $table Table being written, checked for the columns it really has
     * @param array $attribs Writable columns
     * @param array $values Submitted card or row
     * @param array $required Columns of this table the schema declares NOT NULL
     * @param bool $full True for an insert, which must supply every column;
     *                   false for an update, which touches only what was sent.
     * @return array
     */
    /**
     * The columns $table actually has, read once per request.
     *
     * @param string $table Table name
     * @return array<int,string>
     */
    private function existingColumns(string $table): array
    {
        static $cache = [];

        return $cache[$table] ??= Schema::getColumnListing($table);
    }

    private function rowValues(string $table, array $attribs, array $values, array $required, bool $full): array
    {
        $row = [];
        $columns = $this->existingColumns($table);

        foreach ($attribs as $attrib) {
            // These tables have drifted from their migrations on live installs
            // -- `blotters.complainant_signature` is declared but absent -- so
            // a column that is not there is skipped rather than written.
            if (!in_array($attrib, $columns, true)) {
                continue;
            }

            if (!$full && !array_key_exists($attrib, $values)) {
                continue;
            }

            $value = $values[$attrib] ?? null;

            if ($value === null || $value === '') {
                $row[$attrib] = in_array($attrib, $required, true) ? '' : null;

                continue;
            }

            $row[$attrib] = $value;
        }

        return $row;
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
     * Monthly blotter counts of one jurisdiction for a single year.
     * @param \App\Support\Jurisdiction $scope Jurisdiction of the viewing account
     * @param int $year year to fetch
     * @return array
     */
    public function getYearlyBlotterByMonth(Jurisdiction $scope, Int $year)
    {
        $count = $this->countID;
        $month = $this->monthExpression();

        $query = DB::table('blotters')
            ->select(DB::raw("{$month} as month"), DB::raw($count))
            ->whereYear('created_at', $year)
            ->groupBy(DB::raw($month))
            ->orderBy('month');

        return $scope->apply($query)->get()->toArray();
    }

    /**
     * "Month of `created_at`, as a number" for the current connection.
     *
     * MySQL's MONTH() is not a function every driver has -- SQLite, which the
     * test suite runs on, has no such thing -- so the console's trend chart used
     * to fatal outside MySQL. Laravel's grammar handles whereYear()/whereMonth()
     * portably but has nothing for a grouped month, hence this.
     */
    private function monthExpression(string $column = 'created_at'): string
    {
        return match (DB::connection()->getDriverName()) {
            'sqlite' => "CAST(strftime('%m', {$column}) AS INTEGER)",
            'pgsql' => "EXTRACT(MONTH FROM {$column})",
            default => "MONTH({$column})",
        };
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
     * Every blotter entry of one jurisdiction inside a single month.
     * @param \App\Support\Jurisdiction $scope Jurisdiction of the viewing account
     * @param int $year year to fetch
     * @param int $month month to fetch
     * @return array
     */
    public function getDailyBlotterByMonth(Jurisdiction $scope, Int $year, Int $month)
    {
        $blotters = $this->blotter;

        // `entry_number` is only unique per barangay, so joining on it pulls in
        // other barangays' complainants. Join on the blotter primary key.
        // Columns are listed rather than selected with `*`: across the joins,
        // the bare `id` resolved to the respondent's primary key, so opening a
        // row from the report loaded whichever blotter shared that number.
        $query = DB::table("{$blotters} as b")
            ->leftJoin('complainants as c', 'b.id', '=', 'c.blotter_id')
            ->leftJoin('respondents as r', 'b.id', '=', 'r.blotter_id')
            ->select(
                'b.id',
                'b.user_id',
                'b.entry_number',
                'b.barangay',
                'b.date_reported',
                'b.time_of_report',
                'b.date_of_incident',
                'b.time_of_incident',
                'b.incident_type',
                'b.remarks',
                'b.uploaded_file',
                'b.created_at',
                'c.complainant_family_name',
                'c.complainant_first_name',
                'c.complainant_middle_name',
                'c.complainant_street',
                'c.complainant_village',
                'c.complainant_barangay',
                'r.respondent_family_name',
                'r.respondent_first_name',
                'r.respondent_middle_name',
            )
            ->whereYear('b.created_at', $year)
            ->whereMonth('b.created_at', $month);

        return $scope->apply($query, 'b.user_id')->get()->toArray();
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
                'b.id',
                'b.user_id',
                'b.date_reported',
                'b.time_of_report',
                'b.date_of_incident',
                'b.time_of_incident',
                'c.complainant_street',
                'c.complainant_village',
                'c.complainant_barangay',
                'b.remarks',
                'b.uploaded_file',
            )
            ->where('b.remarks', $remark)
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
     * Restrict a blotter query to a `created_at` window. Both bounds are
     * inclusive dates (Y-m-d); `date_reported` is a plain string column and
     * cannot be compared reliably, so the timestamp is used instead.
     *
     * @param \Illuminate\Database\Query\Builder $query
     * @param string|null $from Inclusive start date, Y-m-d
     * @param string|null $to Inclusive end date, Y-m-d
     * @return \Illuminate\Database\Query\Builder
     */
    private function applyDateRange($query, ?string $from, ?string $to)
    {
        if ($from) {
            $query->where('created_at', '>=', Carbon::parse($from)->startOfDay());
        }

        if ($to) {
            $query->where('created_at', '<=', Carbon::parse($to)->endOfDay());
        }

        return $query;
    }

    /**
     * Blotter counts grouped by disposition (`remarks`) within one jurisdiction.
     *
     * @param \App\Support\Jurisdiction $scope Jurisdiction of the viewing account
     * @param string|null $from Inclusive start date, Y-m-d
     * @param string|null $to Inclusive end date, Y-m-d
     * @return array<int,int> Disposition ID => count
     */
    public function getCountsByRemark(Jurisdiction $scope, ?string $from = null, ?string $to = null)
    {
        $query = DB::table($this->blotter)
            ->selectRaw('remarks, COUNT(*) as total')
            ->groupBy('remarks');

        $scope->apply($query);

        $counts = [];

        // `remarks` is a text column holding the disposition ID, so normalise the
        // key here rather than letting the dashboard deal with "3" vs 3.
        foreach ($this->applyDateRange($query, $from, $to)->get() as $row) {
            $counts[intval($row->remarks)] = intval($row->total);
        }

        return $counts;
    }

    /**
     * Blotter counts grouped by incident type within one jurisdiction.
     *
     * @param \App\Support\Jurisdiction $scope Jurisdiction of the viewing account
     * @param string|null $from Inclusive start date, Y-m-d
     * @param string|null $to Inclusive end date, Y-m-d
     * @return array<int,array{id:int,count:int}> Highest count first
     */
    public function getCountsByIncidentType(Jurisdiction $scope, ?string $from = null, ?string $to = null)
    {
        $query = DB::table($this->blotter)
            ->selectRaw('incident_type, COUNT(*) as total')
            ->groupBy('incident_type')
            ->orderByDesc('total');

        $scope->apply($query);

        return $this->applyDateRange($query, $from, $to)
            ->get()
            ->map(fn($row) => [
                'id' => intval($row->incident_type),
                'count' => intval($row->total),
            ])
            ->values()
            ->toArray();
    }

    /**
     * Plain blotter count of one jurisdiction inside a window.
     *
     * @param \App\Support\Jurisdiction $scope Jurisdiction of the viewing account
     * @param string|null $from Inclusive start date, Y-m-d
     * @param string|null $to Inclusive end date, Y-m-d
     * @return int
     */
    public function getCountInRange(Jurisdiction $scope, ?string $from = null, ?string $to = null)
    {
        $query = $scope->apply(DB::table($this->blotter));

        return $this->applyDateRange($query, $from, $to)->count();
    }

    /**
     * Recent blotter entries of one jurisdiction for the console table, with
     * the first complainant and first respondent of each entry attached.
     *
     * The people are resolved in two follow-up queries instead of a join so a
     * blotter with several complainants still counts as one paginated row. Above
     * barangay level each row also carries the barangay that encoded it, so the
     * console can name the source of every entry.
     *
     * @param \App\Support\Jurisdiction $scope Jurisdiction of the viewing account
     * @param int $perPage Rows per page
     * @param int $page Page number
     * @param string $keyword Matches entry number, complainant, respondent or location
     * @param string|null $from Inclusive start date, Y-m-d
     * @param string|null $to Inclusive end date, Y-m-d
     * @param int|null $remark Narrow to one case disposition
     * @param int|null $incidentType Narrow to one incident type
     * @param string|null $purok Narrow to one purok/village, barangay level only
     * @param string $sort Whitelisted sort key, see $sortable/$sortSubqueries below
     * @param string $direction asc|desc
     * @param int|null $areaCode Narrow to one unit below this jurisdiction, above barangay level
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
        // Only columns actually selected below may be sorted on, so a crafted
        // `sort` query string cannot reach an arbitrary column.
        $sortable = [
            'entry_number' => 'b.entry_number',
            'incident_type' => 'b.incident_type',
            'date' => 'b.date_of_incident',
            'remarks' => 'b.remarks',
            'id' => 'b.id',
        ];

        // Complainant, respondent and purok live in the child tables. They are
        // sorted through a correlated subquery rather than a join: an entry with
        // two complainants would otherwise come back as two rows and throw the
        // pagination totals out.
        $sortSubqueries = [
            'complainant' => "(SELECT MIN(sc.complainant_family_name) FROM {$this->complainant} sc WHERE sc.blotter_id = b.id)",
            'respondent' => "(SELECT MIN(sr.respondent_family_name) FROM {$this->respondent} sr WHERE sr.blotter_id = b.id)",
            'purok' => "(SELECT MIN(sp.complainant_village) FROM {$this->complainant} sp WHERE sp.blotter_id = b.id)",
        ];

        $sortDirection = strtolower($direction) === 'asc' ? 'asc' : 'desc';
        $query = DB::table("{$this->blotter} as b")
            ->select(
                'b.id',
                'b.user_id',
                'b.entry_number',
                'b.incident_type',
                'b.remarks',
                'b.date_reported',
                'b.time_of_report',
                'b.date_of_incident',
                'b.time_of_incident',
                'b.created_at',
            );

        $scope->apply($query, 'b.user_id');

        if ($areaCode) {
            $scope->applyArea($query, $areaCode, 'b.user_id');
        }

        $this->applyDateRange($query, $from, $to);

        if ($remark) {
            $query->where('b.remarks', $remark);
        }

        if ($incidentType) {
            $query->where('b.incident_type', $incidentType);
        }

        if ($purok !== null && $purok !== '') {
            $query->whereIn('b.id', function ($sub) use ($purok) {
                $sub->select('blotter_id')
                    ->from($this->complainant)
                    ->where('complainant_village', $purok);
            });
        }

        $keyword = trim($keyword);

        if ($keyword !== '') {
            $like = '%' . $keyword . '%';

            $query->where(function ($outer) use ($like) {
                $outer->where('b.entry_number', 'LIKE', $like)
                    ->orWhereIn('b.id', function ($sub) use ($like) {
                        $sub->select('blotter_id')
                            ->from($this->complainant)
                            ->where('complainant_family_name', 'LIKE', $like)
                            ->orWhere('complainant_first_name', 'LIKE', $like)
                            ->orWhere('complainant_village', 'LIKE', $like)
                            ->orWhere('complainant_street', 'LIKE', $like);
                    })
                    ->orWhereIn('b.id', function ($sub) use ($like) {
                        $sub->select('blotter_id')
                            ->from($this->respondent)
                            ->where('respondent_family_name', 'LIKE', $like)
                            ->orWhere('respondent_first_name', 'LIKE', $like);
                    });
            });
        }

        if (isset($sortSubqueries[$sort])) {
            $query->orderBy(DB::raw($sortSubqueries[$sort]), $sortDirection);
        } else {
            $query->orderBy($sortable[$sort] ?? 'b.id', $sortDirection);
        }

        // Tiebreaker keeps pagination stable when the sort column repeats.
        $query->orderBy('b.id', 'desc');

        $records = $query->paginate($perPage, ['*'], 'page', $page);

        $blotterIds = collect($records->items())->pluck('id')->all();

        $complainants = $this->firstPersonPerBlotter(
            $this->complainant,
            $blotterIds,
            ['complainant_family_name', 'complainant_first_name', 'complainant_middle_name', 'complainant_street', 'complainant_village']
        );

        $respondents = $this->firstPersonPerBlotter(
            $this->respondent,
            $blotterIds,
            ['respondent_family_name', 'respondent_first_name', 'respondent_middle_name']
        );

        // Which barangay encoded each row. Resolved separately rather than
        // joined: `user_addresses` carries its own `created_at`, which would
        // make applyDateRange()'s bare column ambiguous.
        $barangayCodes = $this->barangayCodesFor(
            collect($records->items())->pluck('user_id')->unique()->all()
        );

        $records->getCollection()->transform(function ($record) use ($complainants, $respondents, $barangayCodes) {
            $complainant = $complainants[$record->id] ?? null;
            $respondent = $respondents[$record->id] ?? null;

            // Both are varchar columns holding a lookup ID; hand the dashboard
            // numbers so it does not have to compare "8" against 8.
            $record->incident_type = intval($record->incident_type);
            $record->remarks = intval($record->remarks);

            $record->complainant = $complainant
                ? trim("{$complainant->complainant_first_name} {$complainant->complainant_family_name}")
                : null;

            $record->respondent = $respondent
                ? trim("{$respondent->respondent_first_name} {$respondent->respondent_family_name}")
                : null;

            $record->purok = $complainant
                ? (trim((string) $complainant->complainant_village) ?: null)
                : null;

            $record->location = $complainant
                ? (trim((string) $complainant->complainant_village) ?: trim((string) $complainant->complainant_street))
                : null;

            // PSGC code of the encoding barangay; the console resolves the name
            // from utils/data/barangays.
            $record->barangay_code = $barangayCodes[intval($record->user_id)] ?? 0;

            return $record;
        });

        return $records;
    }

    /**
     * Barangay PSGC code of each given barangay account, keyed by user ID.
     *
     * @param array<int,int> $userIds Barangay account IDs
     * @return array<int,int>
     */
    private function barangayCodesFor(array $userIds): array
    {
        if (empty($userIds)) {
            return [];
        }

        return UserAddress::whereIn('user_id', $userIds)
            ->pluck('barangay_code', 'user_id')
            ->map(fn ($code) => intval($code))
            ->all();
    }

    /**
     * The lowest-ID row of $table for each of $blotterIds, keyed by blotter ID.
     *
     * @param string $table complainants or respondents
     * @param array $blotterIds Blotter IDs to look up
     * @param array $columns Columns to select alongside blotter_id
     * @return array<int,object>
     */
    private function firstPersonPerBlotter(string $table, array $blotterIds, array $columns)
    {
        if (empty($blotterIds)) {
            return [];
        }

        $firstIds = DB::table($table)
            ->selectRaw('MIN(id) as id')
            ->whereIn('blotter_id', $blotterIds)
            ->groupBy('blotter_id')
            ->pluck('id');

        return DB::table($table)
            ->select(array_merge(['blotter_id'], $columns))
            ->whereIn('id', $firstIds)
            ->get()
            ->keyBy('blotter_id')
            ->all();
    }

    /**
     * Method to get top 10 barangay with most blotters
     * @param int $userId IDs of the city
     * @return array collection of blotter count per barangay
     */
    public function getBarangayWithMostBlotter(Int $userId)
    {
        $blotters = $this->blotter;
        // Match on `user_id`, not the address row's own primary key, and take a
        // scalar so it can be bound as a query parameter.
        $cityCode = UserAddress::where('user_id', $userId)->value('city_code');

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

    /**
     * Every incident type this barangay has recorded, with how many entries
     * carry it, ordered by frequency.
     *
     * The barangay "Incidents" page used to be reachable only by drilling into
     * a chart -- opening it from the sidebar passed no `incident_type` at all
     * and rendered an empty table. It now loads this breakdown so the page
     * stands on its own.
     *
     * @param int $userId Barangay user ID
     * @return array<int, object{id: int, count: int}>
     */
    public function getIncidentTypeBreakdown(Int $userId)
    {
        return DB::table("{$this->blotter} as b")
            ->select('b.incident_type as id', DB::raw('COUNT(b.id) as count'))
            ->where('b.user_id', $userId)
            ->whereNotNull('b.incident_type')
            ->groupBy('b.incident_type')
            ->orderByDesc('count')
            ->get()
            ->map(fn ($row) => (object) ['id' => (int) $row->id, 'count' => (int) $row->count])
            ->all();
    }

    /**
     * Every purok/village a complainant in this jurisdiction has been recorded
     * in, with the entry count. Blank villages are dropped -- they are not a
     * place.
     *
     * @param \App\Support\Jurisdiction $scope Jurisdiction of the viewing account
     * @param string|null $from Inclusive start date, Y-m-d
     * @param string|null $to Inclusive end date, Y-m-d
     * @return array<int, object{name: string, count: int}>
     */
    public function getPurokBreakdown(Jurisdiction $scope, ?string $from = null, ?string $to = null)
    {
        $query = DB::table("{$this->blotter} as b")
            ->join("{$this->complainant} as c", 'b.id', '=', 'c.blotter_id')
            ->select('c.complainant_village as name', DB::raw('COUNT(DISTINCT b.id) as count'))
            ->whereNotNull('c.complainant_village')
            ->where('c.complainant_village', '!=', '')
            ->groupBy('c.complainant_village')
            ->orderByDesc('count');

        $scope->apply($query, 'b.user_id');

        // `complainants` carries its own `created_at`, so the column has to be
        // qualified here -- applyDateRange()'s bare `created_at` is ambiguous
        // against this join.
        if ($from) {
            $query->where('b.created_at', '>=', Carbon::parse($from)->startOfDay());
        }

        if ($to) {
            $query->where('b.created_at', '<=', Carbon::parse($to)->endOfDay());
        }

        return $query->get()
            ->map(fn ($row) => (object) ['name' => (string) $row->name, 'count' => (int) $row->count])
            ->all();
    }

    /**
     * Blotter counts per unit one level below the viewer: barangays for a
     * station, cities for a province, provinces for a region and regions for
     * the super admin. A barangay has no level below it and gets puroks
     * instead, see getPurokBreakdown().
     *
     * Only the PSGC code is returned -- the names live in the frontend's PSGC
     * lookups (resources/js/utils/data), not in the database.
     *
     * @param \App\Support\Jurisdiction $scope Jurisdiction of the viewing account
     * @param string|null $from Inclusive start date, Y-m-d
     * @param string|null $to Inclusive end date, Y-m-d
     * @return array<int, object{code: int, name: null, count: int}>
     */
    public function getAreaBreakdown(Jurisdiction $scope, ?string $from = null, ?string $to = null)
    {
        $column = $scope->childColumn();

        // Whitelisted by Jurisdiction, never request input.
        if ($column === null) {
            return [];
        }

        $query = DB::table("{$this->blotter} as b")
            ->join('user_addresses as ua', 'ua.user_id', '=', 'b.user_id')
            ->select("ua.{$column} as code", DB::raw('COUNT(b.id) as count'))
            ->groupBy("ua.{$column}")
            ->orderByDesc('count');

        $scope->apply($query, 'b.user_id');

        // Qualified: `user_addresses` carries its own `created_at`.
        if ($from) {
            $query->where('b.created_at', '>=', Carbon::parse($from)->startOfDay());
        }

        if ($to) {
            $query->where('b.created_at', '<=', Carbon::parse($to)->endOfDay());
        }

        return $query->get()
            ->map(fn ($row) => (object) [
                'code' => intval($row->code),
                'name' => null,
                'count' => intval($row->count),
            ])
            ->all();
    }

    /**
     * How many people are attached to this jurisdiction's blotter entries: the
     * complainants on their own, and the complainants plus respondents together.
     *
     * Counted per person row, not per entry -- one blotter with three
     * complainants is three complainants.
     *
     * @param \App\Support\Jurisdiction $scope Jurisdiction of the viewing account
     * @param string|null $from Inclusive start date, Y-m-d
     * @param string|null $to Inclusive end date, Y-m-d
     * @return array{complainants: int, personsInvolved: int}
     */
    public function getPeopleCounts(Jurisdiction $scope, ?string $from = null, ?string $to = null)
    {
        $countIn = function (string $table) use ($scope, $from, $to) {
            $query = DB::table("{$table} as p")
                ->join("{$this->blotter} as b", 'b.id', '=', 'p.blotter_id');

            $scope->apply($query, 'b.user_id');

            // Qualified: both tables carry a `created_at`.
            if ($from) {
                $query->where('b.created_at', '>=', Carbon::parse($from)->startOfDay());
            }

            if ($to) {
                $query->where('b.created_at', '<=', Carbon::parse($to)->endOfDay());
            }

            return $query->count();
        };

        $complainants = $countIn($this->complainant);

        return [
            'complainants' => $complainants,
            'personsInvolved' => $complainants + $countIn($this->respondent),
        ];
    }

    /**
     * How many entries this barangay holds under each disposition, as a
     * `remarks id => count` map. Feeds the counts on the case-disposition tabs
     * in one query instead of one paginate call per tab.
     *
     * @param int $userId Barangay user ID
     * @return array<int, int>
     */
    public function getRemarkBreakdown(Int $userId)
    {
        return DB::table("{$this->blotter} as b")
            ->select('b.remarks', DB::raw('COUNT(b.id) as count'))
            ->where('b.user_id', $userId)
            ->whereNotNull('b.remarks')
            ->groupBy('b.remarks')
            ->pluck('count', 'remarks')
            ->map(fn ($count) => (int) $count)
            ->all();
    }

    /**
     * Paginated blotter entries of one barangay, narrowed by incident type or
     * by purok. Shares the column list the blotter table renders, so the same
     * TableHead/TableBody components can display the result.
     *
     * @param int $userId Barangay user ID
     * @param int $perPage Rows per page
     * @param int $page Page number
     * @param string $keyword Matches entry number, complainant or respondent
     * @param int|null $incidentType Narrow to one incident type
     * @param string|null $village Narrow to one purok/village
     * @param int|null $remark Narrow to one disposition
     * @param string $sort Sort key, see $sortable below
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
        // Whitelisted so a crafted `sort` query string cannot reach an
        // arbitrary column.
        $sortable = [
            'entry_number' => 'b.entry_number',
            'complainant' => 'c.complainant_family_name',
            'respondent' => 'r.respondent_family_name',
            'incident_type' => 'b.incident_type',
            'date' => 'b.date_of_incident',
            'remarks' => 'b.remarks',
            'id' => 'b.id',
        ];

        $sortColumn = $sortable[$sort] ?? 'b.id';
        $sortDirection = strtolower($direction) === 'asc' ? 'asc' : 'desc';

        $query = DB::table("{$this->blotter} as b")
            ->leftJoin("{$this->complainant} as c", 'b.id', '=', 'c.blotter_id')
            ->leftJoin("{$this->respondent} as r", 'b.id', '=', 'r.blotter_id')
            ->select(
                'b.id',
                'b.user_id',
                'b.date_reported',
                'b.time_of_report',
                'b.date_of_incident',
                'b.time_of_incident',
                'b.entry_number',
                'c.complainant_family_name',
                'c.complainant_first_name',
                'c.complainant_middle_name',
                'c.complainant_street',
                'c.complainant_village',
                'c.complainant_barangay',
                'r.respondent_family_name',
                'r.respondent_first_name',
                'r.respondent_middle_name',
                'b.incident_type',
                'b.created_at',
                'b.remarks',
                'b.uploaded_file',
            )
            ->where('b.user_id', $userId);

        if ($incidentType) {
            $query->where('b.incident_type', $incidentType);
        }

        if ($village !== null && $village !== '') {
            $query->where('c.complainant_village', $village);
        }

        if ($remark) {
            $query->where('b.remarks', $remark);
        }

        if ($keyword !== '') {
            $query->where(function ($builder) use ($keyword) {
                $builder->whereAny([
                    'b.entry_number',
                    'b.narrative',
                    'c.complainant_family_name',
                    'c.complainant_first_name',
                    'c.complainant_middle_name',
                    'c.complainant_village',
                    'c.complainant_street',
                    'r.respondent_family_name',
                    'r.respondent_first_name',
                    'r.respondent_middle_name',
                ], 'LIKE', '%' . $keyword . '%');
            });
        }

        return $query
            ->orderBy($sortColumn, $sortDirection)
            // Tiebreaker keeps pagination stable when the sort column repeats.
            ->orderBy('b.id', 'desc')
            ->distinct()
            ->paginate($perPage, ['*'], 'page', $page);
    }
}

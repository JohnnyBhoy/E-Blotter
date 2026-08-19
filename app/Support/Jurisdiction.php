<?php

namespace App\Support;

use App\Models\User;
use App\Models\UserAddress;
use Illuminate\Contracts\Auth\Authenticatable;

/**
 * The slice of the country one account is allowed to see.
 *
 * Blotters carry no jurisdiction column of their own — a blotter belongs to the
 * barangay account that encoded it — so every level above barangay is resolved
 * through `user_addresses`, which holds the PSGC codes of each account. This
 * class is the single place that resolution lives; controllers and the
 * repository ask it for the scope instead of rebuilding the `whereIn` by hand.
 *
 * Levels, from the top down:
 *
 *   national (role 1)  every region
 *   region   (role 5)  the provinces of its region_code
 *   province (role 4)  the cities of its province_code
 *   station  (role 3)  the barangays of its city_code
 *   barangay (role 2)  its own entries, broken down by purok
 */
final class Jurisdiction
{
    public const NATIONAL = 'national';
    public const REGION = 'region';
    public const PROVINCE = 'province';
    public const STATION = 'station';
    public const BARANGAY = 'barangay';

    /** Level of each role, see CLAUDE.md's role table. */
    private const LEVEL_BY_ROLE = [
        User::ROLE_SUPER_ADMIN => self::NATIONAL,
        User::ROLE_REGION => self::REGION,
        User::ROLE_PROVINCE => self::PROVINCE,
        User::ROLE_STATION => self::STATION,
        User::ROLE_BARANGAY => self::BARANGAY,
    ];

    /** The `user_addresses` column that pins an account to its own level. */
    private const SCOPE_COLUMN = [
        self::NATIONAL => null,
        self::REGION => 'region_code',
        self::PROVINCE => 'province_code',
        self::STATION => 'city_code',
        self::BARANGAY => 'barangay_code',
    ];

    /**
     * The column that identifies the units one step below, which is what the
     * console groups its area breakdown by. A barangay has no jurisdiction
     * below it — it breaks down by purok, a free-text field on the complainant.
     */
    private const CHILD_COLUMN = [
        self::NATIONAL => 'region_code',
        self::REGION => 'province_code',
        self::PROVINCE => 'city_code',
        self::STATION => 'barangay_code',
        self::BARANGAY => null,
    ];

    private const LEVEL_LABEL = [
        self::NATIONAL => 'National',
        self::REGION => 'Regional',
        self::PROVINCE => 'Provincial',
        self::STATION => 'Municipal / Station',
        self::BARANGAY => 'Barangay',
    ];

    /** Singular then plural name of the units one level down. */
    private const CHILD_LABEL = [
        self::NATIONAL => ['Region', 'Regions'],
        self::REGION => ['Province', 'Provinces'],
        self::PROVINCE => ['City / Municipality', 'Cities & Municipalities'],
        self::STATION => ['Barangay', 'Barangays'],
        self::BARANGAY => ['Purok', 'Puroks'],
    ];

    /**
     * @param string $level One of the level constants
     * @param int $userId The viewing account
     * @param int $code PSGC code of this jurisdiction, 0 at national level
     * @param array<int,int>|null $barangayIds Barangay accounts in scope, null for every barangay
     */
    private function __construct(
        public readonly string $level,
        public readonly int $userId,
        public readonly int $code,
        private readonly ?array $barangayIds,
        public readonly ?UserAddress $address,
    ) {
    }

    /**
     * Resolve the jurisdiction of a signed-in account.
     *
     * An account below national level with no `user_addresses` row has no
     * jurisdiction at all: it resolves to an empty barangay list, so every
     * scoped query returns nothing rather than everything.
     */
    public static function forUser(User|Authenticatable $user): self
    {
        $level = self::LEVEL_BY_ROLE[intval($user->role)] ?? self::BARANGAY;
        $userId = intval($user->id);

        if ($level === self::NATIONAL) {
            return new self($level, $userId, 0, null, null);
        }

        $address = UserAddress::where('user_id', $userId)->first();

        if (!$address) {
            return new self($level, $userId, 0, [], null);
        }

        if ($level === self::BARANGAY) {
            return new self($level, $userId, intval($address->barangay_code), [$userId], $address);
        }

        $column = self::SCOPE_COLUMN[$level];
        $code = intval($address->{$column});

        return new self($level, $userId, $code, self::barangaysWhere($column, $code), $address);
    }

    /**
     * Barangay accounts whose address matches $column = $code.
     *
     * Restricted to role 2 on purpose: a station, provincial and regional
     * account all share the same `city_code` as the barangays under them, so an
     * unfiltered pluck would count the offices themselves as reporting units.
     *
     * @return array<int,int>
     */
    private static function barangaysWhere(string $column, int $code): array
    {
        return UserAddress::query()
            ->join('users', 'users.id', '=', 'user_addresses.user_id')
            ->where('users.role', User::ROLE_BARANGAY)
            ->where("user_addresses.{$column}", $code)
            ->pluck('user_addresses.user_id')
            ->map(fn ($id) => intval($id))
            ->all();
    }

    /**
     * Narrow a blotter query to this jurisdiction.
     *
     * National level adds no condition at all; every other level restricts to
     * the barangay accounts it covers.
     *
     * @param \Illuminate\Database\Query\Builder|\Illuminate\Database\Eloquent\Builder $query
     * @param string $column Qualified `user_id` column of the blotters table in $query
     */
    public function apply($query, string $column = 'user_id')
    {
        if ($this->barangayIds === null) {
            return $query;
        }

        return $query->whereIn($column, $this->barangayIds);
    }

    /**
     * Narrow a blotter query to one unit inside this jurisdiction — a single
     * barangay for a station, a single city for a province, and so on. An area
     * outside the jurisdiction matches nothing.
     *
     * @param \Illuminate\Database\Query\Builder|\Illuminate\Database\Eloquent\Builder $query
     * @param int $areaCode PSGC code of the child unit
     * @param string $column Qualified `user_id` column of the blotters table in $query
     */
    public function applyArea($query, int $areaCode, string $column = 'user_id')
    {
        $childColumn = $this->childColumn();

        if ($childColumn === null || $areaCode <= 0) {
            return $query;
        }

        $ids = self::barangaysWhere($childColumn, $areaCode);

        if ($this->barangayIds !== null) {
            $ids = array_values(array_intersect($ids, $this->barangayIds));
        }

        return $query->whereIn($column, $ids);
    }

    /** Barangay accounts in scope, null when every barangay is in scope. */
    public function barangayIds(): ?array
    {
        return $this->barangayIds;
    }

    /** How many barangay accounts this jurisdiction covers. */
    public function barangayCount(): int
    {
        return $this->barangayIds === null
            ? User::where('role', User::ROLE_BARANGAY)->count()
            : count($this->barangayIds);
    }

    /** The `user_addresses` column of the units one level down, null for a barangay. */
    public function childColumn(): ?string
    {
        return self::CHILD_COLUMN[$this->level];
    }

    /** Whether this account encodes blotter entries. Only barangays do. */
    public function canEncode(): bool
    {
        return $this->level === self::BARANGAY;
    }

    /** Whether this account may correct an entry it can see. */
    public function canEdit(): bool
    {
        // Regional accounts are read-only; see utils/functions/blotterActions.ts.
        return $this->level !== self::REGION;
    }

    /**
     * Whether this account may remove an entry. Barangays escalate removal to
     * their municipal admin, and regional accounts are read-only.
     */
    public function canDelete(): bool
    {
        return !in_array($this->level, [self::BARANGAY, self::REGION], true);
    }

    /**
     * The console payload describing this level to the frontend: what to call
     * it, what its children are called, and what it is allowed to do.
     *
     * @return array<string,mixed>
     */
    public function toArray(): array
    {
        [$childLabel, $childLabelPlural] = self::CHILD_LABEL[$this->level];

        return [
            'level' => $this->level,
            'levelLabel' => self::LEVEL_LABEL[$this->level],
            'code' => $this->code,
            'barangayCode' => intval(optional($this->address)->barangay_code),
            'cityCode' => intval(optional($this->address)->city_code),
            'provinceCode' => intval(optional($this->address)->province_code),
            'regionCode' => intval(optional($this->address)->region_code),
            'childLabel' => $childLabel,
            'childLabelPlural' => $childLabelPlural,
            'barangayCount' => $this->barangayCount(),
            'canEncode' => $this->canEncode(),
            'canEdit' => $this->canEdit(),
            'canDelete' => $this->canDelete(),
        ];
    }
}

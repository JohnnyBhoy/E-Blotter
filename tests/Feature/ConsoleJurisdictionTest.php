<?php

namespace Tests\Feature;

use App\Models\Blotter;
use App\Models\Complainant;
use App\Models\User;
use App\Models\UserAddress;
use App\Repositories\BlotterRepository;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Every level works out of the same console, over a different slice of the
 * country. These tests pin the slice: a station sees the barangays of its city, a
 * province its cities, a region its provinces, and the super admin everything —
 * and none of them sees a neighbour's entries.
 *
 * The tree under test:
 *
 *   Region 6 ─ Province 606 ─ City 60601 ─ Brgy A (2 entries)
 *            │              │           └ Brgy B (3 entries)
 *            │              └ City 60602 ─ Brgy C (4 entries)
 *            └ Province 604 ─ City 60401 ─ Brgy D (5 entries)
 *   Region 7 ─ Province 712 ─ City 71201 ─ Brgy E (6 entries)
 */
class ConsoleJurisdictionTest extends TestCase
{
    use RefreshDatabase;

    /** @var array<string,User> */
    private array $barangays = [];

    protected function setUp(): void
    {
        parent::setUp();

        $tree = [
            'A' => [60601001, 60601, 606, 6, 2],
            'B' => [60601002, 60601, 606, 6, 3],
            'C' => [60602002, 60602, 606, 6, 4],
            'D' => [60401001, 60401, 604, 6, 5],
            'E' => [71201001, 71201, 712, 7, 6],
        ];

        foreach ($tree as $key => [$barangay, $city, $province, $region, $entries]) {
            $user = $this->account(
                "brgy-{$key}@example.test",
                User::ROLE_BARANGAY,
                $barangay,
                $city,
                $province,
                $region,
            );

            $this->barangays[$key] = $user;
            $this->seedEntries($user, $entries);
        }
    }

    /** A verified account at one level, with the address row every scope needs. */
    private function account(
        string $email,
        int $role,
        int $barangay,
        int $city,
        int $province,
        int $region,
    ): User {
        $user = User::create([
            'name' => "Account {$email}",
            'email' => $email,
            'password' => 'Password@123',
            'role' => $role,
        ]);

        $user->forceFill(['email_verified_at' => now()])->save();

        UserAddress::create([
            'user_id' => $user->id,
            'barangay_code' => $barangay,
            'city_code' => $city,
            'province_code' => $province,
            'region_code' => $region,
        ]);

        return $user;
    }

    /**
     * Entries for one barangay. Each needs a complainant row: the console reads
     * the purok from it, and the listing query drops entries without one.
     */
    private function seedEntries(User $user, int $count): void
    {
        for ($number = 1; $number <= $count; $number++) {
            $blotter = Blotter::create([
                'user_id' => $user->id,
                'entry_number' => $number,
                'barangay' => 'Test',
                'date_reported' => now()->toDateString(),
                'time_of_report' => '09:00',
                'date_of_incident' => now()->toDateString(),
                'time_of_incident' => '09:00',
                'incident_type' => 1,
                'narrative' => 'Seeded for the jurisdiction test.',
                'remarks' => 3,
                'recorded_by' => 'Tester',
            ]);

            // The schema declares most complainant columns NOT NULL with no
            // default, so every one of them is written even when blank.
            Complainant::create(array_merge(
                array_fill_keys(BlotterRepository::COMPLAINANT_ATTRIBUTES, ''),
                [
                    'blotter_id' => $blotter->id,
                    'user_id' => $user->id,
                    'entry_number' => $number,
                    'complainant_family_name' => 'Dela Cruz',
                    'complainant_first_name' => 'Juan',
                    'complainant_village' => 'Purok Uno',
                ],
            ));
        }
    }

    /** The console payload one account sees at its own dashboard route. */
    private function console(User $user, string $route): array
    {
        $response = $this->actingAs($user)->get($route);

        $response->assertOk();

        return $response->viewData('page')['props'];
    }

    public function test_a_barangay_sees_only_its_own_entries(): void
    {
        $props = $this->console($this->barangays['A'], '/dashboard');

        $this->assertSame('barangay', $props['console']['level']);
        $this->assertSame(2, $props['dashboard']['summary']['total']);
        // Its areas are puroks, which carry a name rather than a PSGC code.
        $this->assertSame('Purok Uno', $props['dashboard']['byArea'][0]['name']);
    }

    public function test_a_station_sees_every_barangay_in_its_city(): void
    {
        $station = $this->account('station@example.test', User::ROLE_STATION, 0, 60601, 606, 6);

        $props = $this->console($station, '/municipal-dashboard');

        $this->assertSame('station', $props['console']['level']);
        $this->assertSame('Barangay', $props['console']['childLabel']);
        // Brgy A (2) + Brgy B (3). Brgy C sits in the next city.
        $this->assertSame(5, $props['dashboard']['summary']['total']);
        $this->assertSame(2, $props['dashboard']['summary']['barangayCount']);

        // The breakdown is per barangay, keyed by PSGC code.
        $codes = array_column($props['dashboard']['byArea'], 'code');
        sort($codes);
        $this->assertSame([60601001, 60601002], $codes);
    }

    public function test_a_province_sees_every_city_in_its_province(): void
    {
        $province = $this->account('prov@example.test', User::ROLE_PROVINCE, 0, 60601, 606, 6);

        $props = $this->console($province, '/province-dashboard');

        $this->assertSame('province', $props['console']['level']);
        // Brgy A (2) + B (3) + C (4). Brgy D is in another province.
        $this->assertSame(9, $props['dashboard']['summary']['total']);

        $codes = array_column($props['dashboard']['byArea'], 'code');
        sort($codes);
        $this->assertSame([60601, 60602], $codes);
    }

    public function test_a_region_sees_every_province_in_its_region(): void
    {
        $region = $this->account('region@example.test', User::ROLE_REGION, 0, 60601, 606, 6);

        $props = $this->console($region, '/region-dashboard');

        $this->assertSame('region', $props['console']['level']);
        // Everything in region 6: 2 + 3 + 4 + 5. Brgy E is in region 7.
        $this->assertSame(14, $props['dashboard']['summary']['total']);

        $codes = array_column($props['dashboard']['byArea'], 'code');
        sort($codes);
        $this->assertSame([604, 606], $codes);
    }

    public function test_the_super_admin_sees_every_region(): void
    {
        $admin = User::create([
            'name' => 'Super Admin',
            'email' => 'super@example.test',
            'password' => 'Password@123',
            'role' => User::ROLE_SUPER_ADMIN,
        ]);

        $admin->forceFill(['email_verified_at' => now()])->save();

        // No address row at all: national level is unscoped by definition.
        $props = $this->console($admin, '/admin-dashboard');

        $this->assertSame('national', $props['console']['level']);
        $this->assertSame(20, $props['dashboard']['summary']['total']);

        $codes = array_column($props['dashboard']['byArea'], 'code');
        sort($codes);
        $this->assertSame([6, 7], $codes);
    }

    public function test_the_area_filter_narrows_to_one_unit_below(): void
    {
        $province = $this->account('prov2@example.test', User::ROLE_PROVINCE, 0, 60601, 606, 6);

        // City 60602 holds Brgy C's four entries and nothing else.
        $props = $this->console($province, '/province-dashboard?area=60602');

        $this->assertSame(4, $props['dashboard']['records']['total']);

        foreach ($props['dashboard']['records']['data'] as $record) {
            $this->assertSame(60602002, $record->barangay_code);
        }
    }

    public function test_an_account_with_no_address_sees_nothing(): void
    {
        $station = User::create([
            'name' => 'Unassigned Station',
            'email' => 'nowhere@example.test',
            'password' => 'Password@123',
            'role' => User::ROLE_STATION,
        ]);

        $station->forceFill(['email_verified_at' => now()])->save();

        $props = $this->console($station, '/municipal-dashboard');

        // No jurisdiction must mean no rows, never every row in the system.
        $this->assertSame(0, $props['dashboard']['summary']['total']);
        $this->assertSame(0, $props['dashboard']['records']['total']);
    }

    public function test_a_regional_account_may_not_correct_or_remove_an_entry(): void
    {
        $region = $this->account('region2@example.test', User::ROLE_REGION, 0, 60601, 606, 6);
        $entry = Blotter::where('user_id', $this->barangays['A']->id)->firstOrFail();

        // Read is allowed...
        $this->actingAs($region)
            ->getJson("/blotter/record?id={$entry->id}")
            ->assertOk();

        // ...writing is not.
        $this->actingAs($region)
            ->post('/blotter/update', ['id' => $entry->id])
            ->assertForbidden();
    }

    public function test_a_station_reads_an_entry_from_a_barangay_it_covers(): void
    {
        $station = $this->account('station2@example.test', User::ROLE_STATION, 0, 60601, 606, 6);

        $covered = Blotter::where('user_id', $this->barangays['B']->id)->firstOrFail();
        $outside = Blotter::where('user_id', $this->barangays['C']->id)->firstOrFail();

        $this->actingAs($station)
            ->getJson("/blotter/record?id={$covered->id}")
            ->assertOk();

        $this->actingAs($station)
            ->getJson("/blotter/record?id={$outside->id}")
            ->assertForbidden();
    }
}

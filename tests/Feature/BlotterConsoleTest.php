<?php

namespace Tests\Feature;

use App\Models\Blotter;
use App\Models\Complainant;
use App\Models\Respondent;
use App\Models\User;
use App\Models\UserAddress;
use App\Repositories\BlotterRepository;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * The barangay console files, reads and corrects entries through a modal on
 * /dashboard, so these endpoints have to work without an Inertia page of
 * their own.
 */
class BlotterConsoleTest extends TestCase
{
    use RefreshDatabase;

    private User $barangay;

    protected function setUp(): void
    {
        parent::setUp();

        $this->barangay = $this->barangayAccount('bayo@example.test', 60601001);
    }

    /** A verified barangay account with an address, which the routes require. */
    private function barangayAccount(string $email, int $barangayCode): User
    {
        $user = User::create([
            'name' => 'Brgy. Test',
            'email' => $email,
            'password' => 'Password@123',
            'role' => User::ROLE_BARANGAY,
        ]);

        $user->forceFill(['email_verified_at' => now()])->save();

        UserAddress::create([
            'user_id' => $user->id,
            'barangay_code' => $barangayCode,
            'city_code' => 60601,
            'province_code' => 606,
            'region_code' => 6,
        ]);

        return $user;
    }

    /** A payload shaped exactly like the modal's form. */
    private function payload(array $overrides = []): array
    {
        $complainant = array_merge(
            array_fill_keys(BlotterRepository::COMPLAINANT_ATTRIBUTES, ''),
            [
                'complainant_family_name' => 'Dela Cruz',
                'complainant_first_name' => 'Juan',
                'complainant_middle_name' => 'Santos',
                'complainant_birth_date' => '1990-01-01',
                'complainant_place_of_birth' => 'Iloilo City',
                'complainant_citizenship' => 1,
                'complainant_gender' => 1,
                'complainant_civil_status' => 1,
                'complainant_occupation' => 1,
                'complainant_education' => 7,
                'complainant_village' => 'Purok Uno',
                'complainant_barangay' => 60601001,
                'complainant_city' => 60601,
                'complainant_province' => 606,
                'complainant_region' => 6,
            ],
        );

        return array_merge([
            'entry_number' => 1,
            'barangay' => 'Test Barangay',
            'date_reported' => '2026-08-19',
            'time_of_report' => '10:00',
            'date_of_incident' => '2026-08-18',
            'time_of_incident' => '21:30',
            'incident_type' => 2,
            'narrative' => '<p>The complainant reported a disturbance.</p>',
            'remarks' => 3,
            'recorded_by' => 'Barangay Secretary',
            'complainant_data' => [$complainant],
            // The modal always renders one respondent card, blank or not.
            'respondent_data' => [array_fill_keys(BlotterRepository::RESPONDENT_ATTRIBUTES, '')],
        ], $overrides);
    }

    /** File one entry and hand back the row it created. */
    private function fileEntry(array $overrides = []): Blotter
    {
        $this->actingAs($this->barangay)
            ->post('/blotter', $this->payload($overrides))
            ->assertRedirect()
            ->assertSessionHas('message');

        return Blotter::where('user_id', $this->barangay->id)->latest('id')->firstOrFail();
    }

    public function test_the_console_files_an_entry_with_a_blank_respondent_card(): void
    {
        $blotter = $this->fileEntry();

        $this->assertSame(1, Complainant::where('blotter_id', $blotter->id)->count());
        // A card the barangay never filled in must not become a row of blanks.
        $this->assertSame(0, Respondent::where('blotter_id', $blotter->id)->count());
    }

    public function test_the_modal_reads_one_entry_as_json(): void
    {
        $blotter = $this->fileEntry();

        $this->actingAs($this->barangay)
            ->getJson("/blotter/record?id={$blotter->id}")
            ->assertOk()
            ->assertJsonPath('blotter.entry_number', 1)
            ->assertJsonPath('complainants.0.complainant_first_name', 'Juan')
            ->assertJsonPath('uploaded_file_url', null);
    }

    public function test_the_modal_saves_a_correction(): void
    {
        $blotter = $this->fileEntry();

        $payload = $this->payload(['id' => $blotter->id, 'remarks' => 2]);
        $payload['complainant_data'][0]['complainant_first_name'] = 'Juanito';
        $payload['respondent_data'] = [array_merge(
            array_fill_keys(BlotterRepository::RESPONDENT_ATTRIBUTES, ''),
            ['respondent_family_name' => 'Reyes', 'respondent_first_name' => 'Pedro'],
        )];

        $this->actingAs($this->barangay)
            ->post('/blotter/update', $payload)
            ->assertRedirect()
            ->assertSessionHas('message');

        $blotter->refresh();

        $this->assertSame('2', (string) $blotter->remarks);
        $this->assertSame(
            'Juanito',
            Complainant::where('blotter_id', $blotter->id)->value('complainant_first_name'),
        );
        // The respondent card was filled in on the edit, so its row appears.
        $this->assertSame(
            'Reyes',
            Respondent::where('blotter_id', $blotter->id)->value('respondent_family_name'),
        );
    }

    public function test_a_correction_leaves_out_sections_the_form_did_not_send(): void
    {
        $blotter = $this->fileEntry();

        $payload = $this->payload(['id' => $blotter->id, 'remarks' => 1]);
        unset($payload['complainant_data'], $payload['respondent_data']);

        // `complainant_data` is required, so an edit can never silently drop the
        // complainant; the guard exists for the optional respondent list.
        $this->actingAs($this->barangay)
            ->post('/blotter/update', $payload)
            ->assertSessionHasErrors('complainant_data');

        $this->assertSame(1, Complainant::where('blotter_id', $blotter->id)->count());
    }

    public function test_an_entry_outside_the_barangay_is_refused(): void
    {
        $blotter = $this->fileEntry();

        $neighbour = $this->barangayAccount('other@example.test', 60601002);

        $this->actingAs($neighbour)
            ->getJson("/blotter/record?id={$blotter->id}")
            ->assertForbidden();

        $this->actingAs($neighbour)
            ->post('/blotter/update', $this->payload(['id' => $blotter->id]))
            ->assertForbidden();
    }
}

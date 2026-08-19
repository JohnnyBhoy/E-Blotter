<?php

namespace App\Http\Controllers;

use App\Models\BarangayOfficial;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

/**
 * Barangay officials directory. Every action is scoped to the signed-in
 * barangay account, so one barangay can never read or edit another's roster.
 */
class OfficialController extends Controller
{
    /**
     * Rank order used when nothing explicit is set, so a freshly added Punong
     * Barangay still sorts above the Kagawads.
     */
    private const POSITION_ORDER = [
        'Punong Barangay' => 10,
        'Barangay Kagawad' => 20,
        'SK Chairperson' => 30,
        'SK Kagawad' => 40,
        'Barangay Secretary' => 50,
        'Barangay Treasurer' => 60,
        'Lupon Tagapamayapa' => 70,
        'Barangay Tanod' => 80,
        'BHW' => 90,
    ];

    public function index(Request $request)
    {
        $userId = auth()->user()->id;

        $officials = BarangayOfficial::where('user_id', $userId)
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();

        $payload = [
            'officials' => $officials,
            'positions' => array_keys(self::POSITION_ORDER),
        ];

        // The barangay console opens this directory in a modal, so the same
        // action answers XHR with JSON instead of a page of its own.
        if ($request->wantsJson() && !$request->header('X-Inertia')) {
            return response()->json($payload);
        }

        return Inertia::render('Officials/Index', $payload);
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);

        $data['user_id'] = auth()->user()->id;
        $data['sort_order'] = self::POSITION_ORDER[$data['position']] ?? 100;

        BarangayOfficial::create($data);

        return redirect()->route('officials')->with('success', 'Official added.');
    }

    public function update(Request $request, BarangayOfficial $official)
    {
        $this->authorizeOwnership($official);

        $data = $this->validated($request);

        $data['sort_order'] = self::POSITION_ORDER[$data['position']] ?? 100;

        $official->update($data);

        return redirect()->route('officials')->with('success', 'Official updated.');
    }

    public function destroy(BarangayOfficial $official)
    {
        $this->authorizeOwnership($official);

        $official->delete();

        return redirect()->route('officials')->with('success', 'Official removed.');
    }

    /** @return array<string, mixed> */
    private function validated(Request $request): array
    {
        return $request->validate([
            'name' => 'required|string|max:150',
            'position' => ['required', 'string', Rule::in(array_keys(self::POSITION_ORDER))],
            'contact_number' => 'nullable|string|max:30',
            'email' => 'nullable|email|max:150',
            'term_start' => 'nullable|date',
            'term_end' => 'nullable|date|after_or_equal:term_start',
            'is_active' => 'boolean',
        ]);
    }

    private function authorizeOwnership(BarangayOfficial $official): void
    {
        abort_unless($official->user_id === auth()->user()->id, 403);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Blotter;
use App\Models\IncidentReport;
use App\Models\User;
use App\Models\UserAddress;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class HomeController extends Controller
{
    /**
     * Public landing page. A signed-in user never sees it — they are sent
     * straight to the dashboard for their role (see CLAUDE.md role table).
     */
    public function index()
    {
        if (auth()->check()) {
            return redirect()->route($this->dashboardRouteFor(auth()->user()->role));
        }

        return Inertia::render('Welcome', [
            'stats' => $this->stats(),
        ]);
    }

    private function dashboardRouteFor(?int $role): string
    {
        return match ($role) {
            1 => 'admin.dashboard',
            3 => 'municipal.dashboard',
            4 => 'province.dashboard',
            5 => 'region.dashboard',
            default => 'dashboard',
        };
    }

    /**
     * Headline numbers for the landing page. Cached so the public page never
     * pays for four aggregates per visit.
     *
     * @return array<string, int>
     */
    private function stats(): array
    {
        return Cache::remember('landing.stats', now()->addMinutes(15), fn () => [
            'barangays' => $this->safeCount(fn () => User::where('role', 2)->count()),
            'municipalities' => $this->safeCount(
                fn () => UserAddress::distinct('city_code')->count('city_code')
            ),
            'blotters' => $this->safeCount(fn () => Blotter::count()),
            'reports' => $this->safeCount(fn () => IncidentReport::count()),
        ]);
    }

    /**
     * A public page must never fatal on a stat. Each counter fails on its own —
     * a missing table or an unreachable DB costs that one number, not the page.
     */
    private function safeCount(callable $query): int
    {
        try {
            return (int) $query();
        } catch (\Throwable $e) {
            Log::warning('Landing stat unavailable: ' . $e->getMessage());

            return 0;
        }
    }
}

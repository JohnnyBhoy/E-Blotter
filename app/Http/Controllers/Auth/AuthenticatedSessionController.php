<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Welcome', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        $role = auth()->user()->role;

        $route = redirect()->intended(route('home', absolute: false))->with(['status' => 'failed']);

        if ($role == 1) {
            $route =  redirect()->intended(route('admin.dashboard', absolute: false))->with(['status' => 'ok']);
        }

        if ($role == 2) {
            $route =   redirect()->intended(route('dashboard', absolute: false))->with(['status' => 'ok']);
        }

        if ($role == 3) {
            $route =   redirect()->intended(route('municipal.dashboard', absolute: false))->with(['status' => 'ok']);
        }

        return $route;
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}

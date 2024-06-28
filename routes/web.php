<?php

use App\Http\Middleware\IsBarangay;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Homepage route
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

/**
 * Route for Barangay User
 */
Route::group(['middleware' => ['auth', 'verified', IsBarangay::class]], function () {
    $blotter =  '/blotter';

    // Route for Dashboard
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    // Add blotter
    Route::get($blotter, function () {
        return Inertia::render('Blotter/New');
    })->name('blotter.new');
});

require __DIR__ . '/auth.php';

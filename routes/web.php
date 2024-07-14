<?php

use App\Http\Controllers\BlotterController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\IsBarangay;
use App\Models\Blotter;
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

    Route::get('/dashboard', [UserController::class, 'dashboard'])->name('dashboard');

    Route::get($blotter, [BlotterController::class, 'index'])->name('blotter.new');
    Route::post($blotter, [BlotterController::class, 'create'])->name('blotter');
    Route::get('/blotter/blotters', [BlotterController::class, 'getAll'])->name('blotter.blotters');
    Route::get('/blotter/edit', [BlotterController::class, 'get'])->name('blotter.edit');
    Route::delete($blotter, [BlotterController::class, 'delete'])->name('blotter.delete');

    Route::get('/profile', [UserController::class, 'index'])->name('profile.edit');

    // Route for Map
    Route::get('/map', function () {
        return Inertia::render('Map/Index');
    })->name('map');

    // Route for Officials
    Route::get('/officials', function () {
        return Inertia::render('Officials/Index');
    })->name('officials');

    // Route for Settings
    Route::get('/settings', function () {
        return Inertia::render('Settings/Index');
    })->name('officials');
});

require __DIR__ . '/auth.php';

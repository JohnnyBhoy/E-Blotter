<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\BlotterController;
use App\Http\Controllers\IncidentController;
use App\Http\Controllers\MunicipalController;
use App\Http\Controllers\ProvinceController;
use App\Http\Controllers\RegionController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\IsAdmin;
use App\Http\Middleware\IsBarangay;
use App\Http\Middleware\IsProvince;
use App\Http\Middleware\IsRegion;
use App\Http\Middleware\IsStation;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Homepage route
Route::get('/', function () {
    $route =  Inertia::render('Welcome');

    if (auth()->check()) {
        $user = auth()->user();
        if ($user->role == 1) {
            $route =  redirect()->route('admin.dashboard');
        }

        if ($user->role == 2) {
            $route =  redirect()->route('dashboard');
        }

        if ($user->role == 3) {
            $route =  redirect()->route('municipal.dashboard');
        }

        if ($user->role == 4) {
            $route =  redirect()->route('province.dashboard');
        }

        if ($user->role == 5) {
            $route =  redirect()->route('region.dashboard');
        }
    }

    return  $route;
})->name('home');

// Walk-in Incident Report
Route::post('/online-incident-report', [IncidentController::class, 'createIncidentReport'])
    ->name('incident.report');

// Contact us
Route::get('/contact-us', function () {
    return Inertia::render('ContactUs');
})->name('contact.us');

// FAQ Frequently Added Questions
Route::get('/faq', function () {
    return Inertia::render('Faq');
})->name('faq');

/**
 * Route for Barangay User
 */
Route::group(['middleware' => ['auth', 'verified', IsBarangay::class]], function () {
    $blotter =  '/blotter';

    // Dashboard
    Route::get('/dashboard', [UserController::class, 'dashboard'])->name('dashboard');

    // Blotter
    Route::get($blotter, [BlotterController::class, 'index'])->name('blotter.new');
    Route::post($blotter, [BlotterController::class, 'create'])->name('blotter');
    Route::get('/blotter/blotters', [BlotterController::class, 'getAll'])->name('blotter.blotters');
    Route::get('/blotter/edit', [BlotterController::class, 'get'])->name('blotter.edit');
    Route::get('/blotter/monthly', [BlotterController::class, 'getYearlyBlotterByMonth'])->name('blotter.monthly');
    Route::get('/blotter/daily', [BlotterController::class, 'getDailyBlotterByMonth'])->name('blotter.daily');

    // Profile
    Route::get('/profile', [UserController::class, 'index'])->name('profile.edit');
    Route::post('/profile', [UserController::class, 'update'])->name('profile.update');

    // Map
    Route::get('/map', function () {
        return Inertia::render('Map/Index');
    })->name('map');

    // Officials
    Route::get('/officials', function () {
        return Inertia::render('Officials/Index');
    })->name('officials');

    // Route for Settings
    Route::get('/settings', function () {
        return Inertia::render('Settings/Index');
    })->name('officials');

    //  Case Disposition
    Route::get('/hearing', [BlotterController::class, 'getBlotterByRemarks'])->name('hearing');
    Route::get('/settled', [BlotterController::class, 'getBlotterByRemarks'])->name('settled');
    Route::get('/referred', [BlotterController::class, 'getBlotterByRemarks'])->name('referred');
    Route::get('/pending', [BlotterController::class, 'getBlotterByRemarks'])->name('pending');

    // Barangay Incidents
    Route::get('/barangay-incidents', [BlotterController::class, 'getBarangayIncidentByType'])->name('incidentsByType');

    // Barangay Puroks
    Route::get('/barangay-puroks', [BlotterController::class, 'getBarangayIncidentByPurok'])->name('incidentsByPurok');
});

/**
 * Route for Municipal/Station Admin
 */
Route::group(['middleware' => ['auth', 'verified', IsStation::class]], function () {
    // Dashboard
    Route::get('/municipal-dashboard', [MunicipalController::class, 'dashboard'])->name('municipal.dashboard');

    // Blotters
    Route::get('/blotter/municipal-blotters', [BlotterController::class, 'getAll'])->name('blotter.municipal.blotters');
    Route::get('/blotter/municipal-edit', [BlotterController::class, 'get'])->name('blotter.municipal.edit');
    Route::delete('/blotter/municipal-delete', [BlotterController::class, 'delete'])->name('blotter.delete');
});

/**
 * Route for Provincial Admin
 */
Route::group(['middleware' => ['auth', 'verified', IsProvince::class]], function () {
    // Dashboard
    Route::get('/province-dashboard', [ProvinceController::class, 'dashboard'])->name('province.dashboard');
});

/**
 * Route for Regional Admin
 */
Route::group(['middleware' => ['auth', 'verified', IsRegion::class]], function () {
    // Dashboard
    Route::get('/region-dashboard', [RegionController::class, 'dashboard'])->name('region.dashboard');
});

/**
 * Route for Super Admin
 */
Route::group(['middleware' => ['auth', 'verified', IsAdmin::class]], function () {
    // Dashboard
    Route::get('/admin-dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');

    // Cities
    Route::get('/admin-cities', [AdminController::class, 'getCities'])->name('admin.cities');

    // Barangays
    Route::get('/admin-barangays', [AdminController::class, 'getbarangays'])->name('admin.barangays');

    // Blotters
    Route::get('/blotter/admin-blotters', [BlotterController::class, 'getAll'])->name('blotter.admin.blotters');
    Route::get('/blotter/admin-edit', [BlotterController::class, 'get'])->name('blotter.admin.edit');
    Route::delete('/blotter/admin-delete', [BlotterController::class, 'delete'])->name('blotter.admin.delete');
});


require __DIR__ . '/auth.php';

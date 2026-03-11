<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\BlotterController;
use App\Http\Controllers\IncidentController;
use App\Http\Controllers\MapController;
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
            $route =  redirect()->route('province.dashboard');
        }

        if ($user->role == 3) {
            $route =  redirect()->route('municipal.dashboard');
        }

        if ($user->role == 4) {
            $route =  redirect()->route('police.station.dashboard');
        }

        if ($user->role == 5) {
            $route =  redirect()->route('barangay.dashboard');
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
    Route::get('/barangay/dashboard', [UserController::class, 'dashboard'])->name('barangay.dashboard');

    // Incidents
    Route::get('/barangay/incidents', function () {
        return Inertia::render('Barangay/Incidents');
    })->name('barangay.incidents');

    // New Blotter Report
    Route::get('/barangay/new-blotter', function () {
        return Inertia::render('Barangay/NewBlotter');
    })->name('barangay.new.blotter');

    // Barangay Blotters - Get blotters for current barangay user
    Route::get('/barangay/blotters', [BlotterController::class, 'getBarangayBlotters'])->name('barangay.blotters');

    // Barangay Edit - Edit blotter for current barangay user
    Route::get('/barangay/edit', [BlotterController::class, 'getBarangayEdit'])->name('barangay.edit');

    // Barangay Update - Update blotter for current barangay user
    Route::put('/barangay/update', [BlotterController::class, 'updateBarangay'])->name('barangay.update');

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
    })->name('settings');

    //  Case Disposition
    Route::get('/hearing', [BlotterController::class, 'getBlotterByRemarks'])->name('hearing');
    Route::get('/settled', [BlotterController::class, 'getBlotterByRemarks'])->name('settled');
    Route::get('/referred', [BlotterController::class, 'getBlotterByRemarks'])->name('referred');
    Route::get('/pending', [BlotterController::class, 'getBlotterByRemarks'])->name('pending');

    // Barangay Incidents
    Route::get('/barangay-incidents', [BlotterController::class, 'getBarangayIncidentByType'])->name('incidentsByType');

    // Barangay Puroks
    Route::get('/barangay-puroks', [BlotterController::class, 'getBarangayIncidentByPurok'])->name('incidentsByPurok');

    // Barangay Puroks
    Route::get('/barangay-map', [MapController::class, 'index'])->name('index');
});

/**
 * Route for Municipal/Station Admin
 */
Route::group(['middleware' => ['auth', 'verified', IsStation::class]], function () {
    // Dashboard
    Route::get('/station/dashboard', [MunicipalController::class, 'dashboard'])->name('station.dashboard');
    Route::get('/municipal-dashboard', [MunicipalController::class, 'dashboard'])->name('municipal.dashboard');

    // New Station Dashboard
    Route::get('/police-station/dashboard', function () {
        return Inertia::render('Station/Dashboard');
    })->name('police.station.dashboard');

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

    // Municipal Reports
    Route::get('/municipal/{id}', [ProvinceController::class, 'municipalReports'])->name('province.municipal.reports');

    // Cities
    Route::get('/province-cities', [ProvinceController::class, 'getCities'])->name('province.cities');

    // Barangays
    Route::get('/province-barangays', [ProvinceController::class, 'getbarangays'])->name('province.barangays');

    // Blotters
    Route::get('/blotter/province-blotters', [BlotterController::class, 'getAll'])->name('blotter.province.blotters');
    Route::get('/blotter/province-edit', [BlotterController::class, 'get'])->name('blotter.province.edit');
    Route::delete('/blotter/province-delete', [BlotterController::class, 'delete'])->name('blotter.province.delete');
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

    // Admin Barangay Management
    Route::get('/admin/barangay', [AdminController::class, 'barangayIndex'])->name('admin.barangay');
    Route::get('/admin/barangay/create', [AdminController::class, 'barangayCreate'])->name('admin.barangay.create');
    Route::post('/admin/barangay', [AdminController::class, 'barangayStore'])->name('admin.barangay.store');
    Route::get('/admin/barangay/{id}', [AdminController::class, 'barangayShow'])->name('admin.barangay.show');
    Route::get('/admin/barangay/{id}/edit', [AdminController::class, 'barangayEdit'])->name('admin.barangay.edit');
    Route::put('/admin/barangay/{id}', [AdminController::class, 'barangayUpdate'])->name('admin.barangay.update');
    Route::delete('/admin/barangay/{id}', [AdminController::class, 'barangayDestroy'])->name('admin.barangay.destroy');

    // Admin Station Management
    Route::get('/admin/station', [AdminController::class, 'stationIndex'])->name('admin.station');
    Route::get('/admin/station/create', [AdminController::class, 'stationCreate'])->name('admin.station.create');
    Route::post('/admin/station', [AdminController::class, 'stationStore'])->name('admin.station.store');
    Route::get('/admin/station/{id}', [AdminController::class, 'stationShow'])->name('admin.station.show');
    Route::get('/admin/station/{id}/edit', [AdminController::class, 'stationEdit'])->name('admin.station.edit');
    Route::put('/admin/station/{id}', [AdminController::class, 'stationUpdate'])->name('admin.station.update');
    Route::delete('/admin/station/{id}', [AdminController::class, 'stationDestroy'])->name('admin.station.destroy');

    // Admin Province Management
    Route::get('/admin/province', [AdminController::class, 'provinceIndex'])->name('admin.province');
    Route::get('/admin/province/create', [AdminController::class, 'provinceCreate'])->name('admin.province.create');
    Route::post('/admin/province', [AdminController::class, 'provinceStore'])->name('admin.province.store');
    Route::get('/admin/province/{id}', [AdminController::class, 'provinceShow'])->name('admin.province.show');
    Route::get('/admin/province/{id}/edit', [AdminController::class, 'provinceEdit'])->name('admin.province.edit');
    Route::put('/admin/province/{id}', [AdminController::class, 'provinceUpdate'])->name('admin.province.update');
    Route::delete('/admin/province/{id}', [AdminController::class, 'provinceDestroy'])->name('admin.province.destroy');

    // Blotters
    Route::get('/blotter/admin-blotters', [BlotterController::class, 'getAll'])->name('blotter.admin.blotters');
    Route::get('/blotter/admin-edit', [BlotterController::class, 'get'])->name('blotter.admin.edit');
    Route::delete('/blotter/admin-delete', [BlotterController::class, 'delete'])->name('blotter.admin.delete');
});


require __DIR__ . '/auth.php';

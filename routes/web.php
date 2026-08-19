<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\BlotterController;
use App\Http\Controllers\ConsoleController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\IncidentController;
use App\Http\Controllers\MapController;
use App\Http\Controllers\OfficialController;
use App\Http\Controllers\ProvinceController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\IsAdmin;
use App\Http\Middleware\IsBarangay;
use App\Http\Middleware\IsProvince;
use App\Http\Middleware\IsRegion;
use App\Http\Middleware\IsStation;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Homepage route
Route::get('/', [HomeController::class, 'index'])->name('home');

// Emergency Reporting Routes (public read)
Route::get('/report/crime', function () {
    return Inertia::render('Report/Crime');
})->name('report.crime');

Route::get('/report/fire', function () {
    return Inertia::render('Report/Fire');
})->name('report.fire');

Route::get('/report/incident', function () {
    return Inertia::render('Report/Incident');
})->name('report.incident');

Route::get('/report/accident', function () {
    return Inertia::render('Report/Accident');
})->name('report.accident');

// Contact us
Route::get('/contact-us', function () {
    return Inertia::render('ContactUs');
})->name('contact.us');

/**
 * Public write endpoints. Anyone on the internet can hit these, so they are
 * rate limited per IP in addition to the validation in each controller.
 */
Route::middleware('throttle:10,1')->group(function () {
    // Walk-in Incident Report
    Route::post('/online-incident-report', [IncidentController::class, 'createIncidentReport'])
        ->name('incident.report');

    Route::post('/report/crime', [ReportController::class, 'submitCrime'])
        ->name('report.crime.submit');

    Route::post('/report/fire', [ReportController::class, 'submitFire'])
        ->name('report.fire.submit');

    Route::post('/report/incident', [ReportController::class, 'submitIncident'])
        ->name('report.incident.submit');

    Route::post('/report/accident', [ReportController::class, 'submitAccident'])
        ->name('report.accident.submit');

    Route::post('/contact-us', [UserController::class, 'sendMessageFromContactUs'])
        ->name('contact.us.submit');
});

// FAQ Frequently Added Questions
Route::get('/faq', function () {
    return Inertia::render('Faq');
})->name('faq');

/**
 * Account pages every signed-in role needs. These used to sit inside the
 * barangay-only group, so the header's Settings/Profile links were dead for
 * stations, provinces, regions and the super admin.
 */
Route::group(['middleware' => ['auth', 'verified']], function () {
    Route::get('/profile', [UserController::class, 'index'])->name('profile.edit');
    Route::post('/profile', [UserController::class, 'update'])->name('profile.update');

    Route::get('/settings', function () {
        return Inertia::render('Settings/Index');
    })->name('settings');

    /**
     * Console endpoints shared by every level. The console is one page for all
     * five roles, so its modal and its reports cannot live inside the
     * barangay-only group.
     *
     * Access is decided per entry, not per route: BlotterController resolves the
     * caller's App\Support\Jurisdiction and refuses anything outside it, refuses
     * a correction from a read-only account, and refuses a removal from an
     * account that may not remove.
     */
    Route::get('/blotter/record', [BlotterController::class, 'record'])->name('blotter.record');
    Route::post('/blotter/update', [BlotterController::class, 'update'])->name('blotter.update');
    Route::get('/blotter/monthly', [BlotterController::class, 'getYearlyBlotterByMonth'])->name('blotter.monthly');
    Route::get('/blotter/daily', [BlotterController::class, 'getDailyBlotterByMonth'])->name('blotter.daily');
});

/**
 * Route for Barangay User
 */
Route::group(['middleware' => ['auth', 'verified', IsBarangay::class]], function () {
    $blotter =  '/blotter';

    // Console
    Route::get('/dashboard', [ConsoleController::class, 'dashboard'])->name('dashboard');

    // Blotter. Only a barangay encodes entries; every level above reads them.
    Route::get($blotter, [BlotterController::class, 'index'])->name('blotter.new');
    Route::post($blotter, [BlotterController::class, 'create'])->name('blotter');
    Route::get('/blotter/blotters', [BlotterController::class, 'getAll'])->name('blotter.blotters');
    Route::get('/blotter/edit', [BlotterController::class, 'get'])->name('blotter.edit');
    // The blotter table renders a delete button for barangay users, but no
    // barangay delete route existed for it to hit.
    Route::delete('/blotter/delete', [BlotterController::class, 'delete'])->name('blotter.barangay.delete');

    // Map
    Route::get('/map', [MapController::class, 'index'])->name('map');

    // Officials
    Route::get('/officials', [OfficialController::class, 'index'])->name('officials');
    Route::post('/officials', [OfficialController::class, 'store'])->name('officials.store');
    Route::put('/officials/{official}', [OfficialController::class, 'update'])->name('officials.update');
    Route::delete('/officials/{official}', [OfficialController::class, 'destroy'])->name('officials.destroy');

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
    // Console, scoped to the barangays of this city/municipality
    Route::get('/municipal-dashboard', [ConsoleController::class, 'dashboard'])->name('municipal.dashboard');

    // Blotters
    Route::get('/blotter/municipal-blotters', [BlotterController::class, 'getAll'])->name('blotter.municipal.blotters');
    Route::get('/blotter/municipal-edit', [BlotterController::class, 'get'])->name('blotter.municipal.edit');
    Route::delete('/blotter/municipal-delete', [BlotterController::class, 'delete'])->name('blotter.delete');
});

/**
 * Route for Provincial Admin
 */
Route::group(['middleware' => ['auth', 'verified', IsProvince::class]], function () {
    // Console, scoped to the cities of this province
    Route::get('/province-dashboard', [ConsoleController::class, 'dashboard'])->name('province.dashboard');

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
    // Console, scoped to the provinces of this region. Read-only: a regional
    // account neither corrects nor removes entries.
    Route::get('/region-dashboard', [ConsoleController::class, 'dashboard'])->name('region.dashboard');

    // Blotters
    Route::get('/blotter/region-blotters', [BlotterController::class, 'getAll'])->name('blotter.region.blotters');
});

/**
 * Route for Super Admin
 */
Route::group(['middleware' => ['auth', 'verified', IsAdmin::class]], function () {
    // Console, unscoped: every region, province, city and barangay
    Route::get('/admin-dashboard', [ConsoleController::class, 'dashboard'])->name('admin.dashboard');

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

<?php

use App\Http\Controllers\API\IncidentReportController;
use App\Http\Controllers\BarangayBlotterController;
use App\Http\Controllers\StationBlotterController;
use Illuminate\Support\Facades\Route;
use App\Http\Middleware\IsBarangay;

/*
|--------------------------------------------------------------------------
| API Routes for Barangay Blotter System
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your barangay blotter system.
| These routes are loaded by the RouteServiceProvider within a group which
| contains the "api" middleware group.
|
*/

Route::middleware(['web', 'auth', 'verified', IsBarangay::class])->group(function () {
    // Existing incident reports
    Route::apiResource('incident-reports', IncidentReportController::class);

    // Barangay blotter system
    Route::prefix('barangay')->group(function () {
        // Blotter CRUD operations
        Route::get('/blotters', [BarangayBlotterController::class, 'index']);
        Route::post('/blotters', [BarangayBlotterController::class, 'store']);
        Route::get('/blotters/{id}', [BarangayBlotterController::class, 'show']);
        Route::put('/blotters/{id}', [BarangayBlotterController::class, 'update']);
        Route::delete('/blotters/{id}', [BarangayBlotterController::class, 'destroy']);

        // Reports and export
        Route::get('/reports', [BarangayBlotterController::class, 'reports']);
        Route::get('/reports/export', [BarangayBlotterController::class, 'export']);

        // Statistics
        Route::get('/statistics', [BarangayBlotterController::class, 'statistics']);
    });
});

Route::middleware(['web', 'auth', 'verified', \App\Http\Middleware\IsStation::class])->group(function () {
    // Station blotter system
    Route::prefix('station')->group(function () {
        // Blotter CRUD operations
        Route::get('/blotters', [StationBlotterController::class, 'index']);
        Route::post('/blotters', [StationBlotterController::class, 'store']);
        Route::get('/blotters/{id}', [StationBlotterController::class, 'show']);
        Route::put('/blotters/{id}', [StationBlotterController::class, 'update']);
        Route::delete('/blotters/{id}', [StationBlotterController::class, 'destroy']);

        // Reports and export
        Route::get('/reports', [StationBlotterController::class, 'reports']);
        Route::get('/reports/export', [StationBlotterController::class, 'export']);

        // Statistics
        Route::get('/statistics', [StationBlotterController::class, 'statistics']);
    });
});

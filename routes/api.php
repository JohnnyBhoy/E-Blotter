<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\IncidentReportController;

/**
 * Citizens file reports without an account, so `store` stays public but is
 * rate limited. Reading, updating and deleting reports is responder data and
 * requires an authenticated session.
 */
Route::post('incident-reports', [IncidentReportController::class, 'store'])
    ->middleware('throttle:10,1');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('incident-reports', [IncidentReportController::class, 'index']);
    Route::get('incident-reports/{incidentReport}', [IncidentReportController::class, 'show']);
    Route::match(['put', 'patch'], 'incident-reports/{incidentReport}', [IncidentReportController::class, 'update']);
    Route::delete('incident-reports/{incidentReport}', [IncidentReportController::class, 'destroy']);
});

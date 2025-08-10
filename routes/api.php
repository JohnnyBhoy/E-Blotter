<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\IncidentReportController;

Route::middleware('api')->group(function () {
    Route::apiResource('incident-reports', IncidentReportController::class);
});

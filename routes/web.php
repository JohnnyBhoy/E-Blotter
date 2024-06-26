<?php

use App\Http\Controllers\ProfileController;
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

// Route for Dashboard
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Add blotter
Route::get('/blotter', function () {
    return Inertia::render('Blotter/New');
})->middleware(['auth', 'verified'])->name('blotter.new');

Route::group(['middleware' => ['auth', 'barangay']], function () {
    $profile =  'profile';
    $blotter =  'blotter';

    // Profile
    Route::get($profile, [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch($profile, [ProfileController::class, 'update'])->name('profile.update');
    Route::delete($profile, [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Add blotter
    Route::get($blotter, [ProfileController::class, 'edit'])->name('profile.edit');
    Route::post($blotter, [ProfileController::class, 'edit'])->name('profile.create');
    Route::patch($blotter, [ProfileController::class, 'update'])->name('profile.update');
    Route::delete($blotter, [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';

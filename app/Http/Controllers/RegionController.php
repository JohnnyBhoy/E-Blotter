<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class RegionController extends Controller
{
    // Dashboard
    public function dashboard(Request $request)
    {
        return Inertia::render('Region/Dashbord');
    }
}

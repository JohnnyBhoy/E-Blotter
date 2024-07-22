<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class MunicipalController extends Controller
{
    // Dashboard
    public function dashboard(Request $request)
    {
        return Inertia::render('Municipal/Dashbord');
    }
}

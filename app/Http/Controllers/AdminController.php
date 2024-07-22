<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    // Dashboard
    public function dashboard(Request $request)
    {
        return Inertia::render('Admin/Dashbord');
    }
}

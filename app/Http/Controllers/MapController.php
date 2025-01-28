<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class MapController extends Controller
{
    /**
     * Map Index
     */
    public function Index()
    {
        return Inertia::render('AddressMap');
    }
}

<?php

namespace App\Http\Middleware;

use Closure;
use Auth;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsBarangay
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::user() &&  Auth::user()->user_role == 2) {
            return $next($request);
        }

        return redirect('home')->with('error', 'You have not barangay admin access');
    }
}
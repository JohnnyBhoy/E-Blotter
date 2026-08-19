<?php

namespace App\Http\Middleware;

use Closure;
use Auth;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsRegion
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::user() &&  Auth::user()->role == 5) {
            return $next($request);
        }

        // 'home' is a route name, not a path — redirect('home') resolves to the
        // non-existent /home and 404s. Every other Is* guard sends the user to /.
        return redirect('/')->with('error', 'You have not region admin access');
    }
}

<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class ExtendSession
{
    /**
     * Reset the 30-day remember cookie on every authenticated request.
     * This means any visit within 30 days resets the clock.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::check()) {
            // Re-issue the remember cookie so the 30-day window resets from now
            Auth::guard('web')->login(Auth::user(), true);
        }

        return $next($request);
    }
}

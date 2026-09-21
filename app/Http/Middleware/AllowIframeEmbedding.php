<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class AllowIframeEmbedding
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Auto-login demo user for iframe preview / demo access if unauthenticated
        if (! Auth::check()) {
            $demo = User::firstOrCreate(['email' => 'demo@skylinepadel.com'], [
                'name' => 'Demo User',
                'password' => Hash::make(Str::random(64)),
                'email_verified_at' => now(),
            ]);

            Auth::guard('web')->login($demo, true);
        }

        $response = $next($request);

        // Allow embedding in iframe on marketing site
        $response->headers->remove('X-Frame-Options');
        $response->headers->set(
            'Content-Security-Policy',
            "frame-ancestors 'self' https://www.broshtech.com https://broshtech.com http://localhost:* http://127.0.0.1:*"
        );

        return $response;
    }
}

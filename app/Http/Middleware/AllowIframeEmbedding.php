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
            try {
                $demo = User::where('email', 'demo@skylinepadel.com')->first();
                if (! $demo) {
                    $demo = User::first();
                }
                if (! $demo) {
                    $demo = User::create([
                        'name' => 'Demo User',
                        'email' => 'demo@skylinepadel.com',
                        'password' => Hash::make(Str::random(32)),
                        'email_verified_at' => now(),
                    ]);
                }
                if ($demo) {
                    Auth::guard('web')->login($demo, true);
                }
            } catch (\Throwable $e) {
                // Ignore any DB error to avoid crashing the response
            }
        }

        $response = $next($request);

        // Allow embedding in iframe on marketing site
        if (method_exists($response, 'header')) {
            $response->header('X-Frame-Options', 'ALLOWALL');
            $response->header('Content-Security-Policy', "frame-ancestors 'self' https://*.broshtech.com https://www.broshtech.com https://broshtech.com http://localhost:* http://127.0.0.1:*");
        } elseif (property_exists($response, 'headers')) {
            $response->headers->remove('X-Frame-Options');
            $response->headers->set('Content-Security-Policy', "frame-ancestors 'self' https://*.broshtech.com https://www.broshtech.com https://broshtech.com http://localhost:* http://127.0.0.1:*");
        }

        return $response;
    }
}

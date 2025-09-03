<?php

namespace App\Http\Middleware;

use App\Models\AuditTrail;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LogUserActivity
{
    public function handle(Request $request, Closure $next)
    {
        // Tangani request
        $response = $next($request);

        // Log aktivitas setelah response
        if (Auth::check()) {
            $this->logActivity($request);
        }

        return $response;
    }

    protected function logActivity(Request $request)
    {
        $routeName = $request->route()->getName();

        // Log login
        if ($routeName === 'login') {
            AuditTrail::create([
                'event' => 'login',
                'user_id' => Auth::id(),
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'url' => $request->fullUrl(),
                'description' => 'User login ke sistem',
            ]);
        }

        // Log logout
        if ($routeName === 'logout') {
            AuditTrail::create([
                'event' => 'logout',
                'user_id' => Auth::id(),
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'url' => $request->fullUrl(),
                'description' => 'User logout dari sistem',
            ]);
        }
    }
}

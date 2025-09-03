<?php

namespace App\Http\Middleware;

use App\Models\Setting;
use Closure;
use Illuminate\Http\Request;

class CheckMaintenanceMode
{
    public function handle(Request $request, Closure $next)
    {
        $settings = Setting::first();

        // Jika maintenance mode aktif dan user bukan admin
        if ($settings && $settings->maintenance_mode && ! $this->isAdmin($request)) {
            return redirect()->route('front.maintenance');
        }

        return $next($request);
    }

    protected function isAdmin($request)
    {
        // Cek jika user terautentikasi dan memiliki role admin
        return $request->user() && $request->user()->hasAnyRole(['admin', 'superadmin', 'master']);
    }
}

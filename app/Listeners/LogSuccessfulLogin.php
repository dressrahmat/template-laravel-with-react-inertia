<?php

namespace App\Listeners;

use App\Models\AuditTrail;
use Illuminate\Auth\Events\Login;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class LogSuccessfulLogin
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(Login $event): void
    {
        $user = $event->user;

        AuditTrail::create([
            'user_id' => $user->id,
            'event' => 'login',
            'auditable_type' => get_class($user),
            'auditable_id' => $user->id,
            'old_values' => null,
            'new_values' => [
                'login_at' => now()->toISOString(),
                'ip_address' => request()->ip(),
            ],
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'url' => request()->fullUrl(),
            'description' => "User {$user->name} logged in",
            'created_at' => now(),
        ]);

        // Update user's last login info
        $user->update([
            'last_login_at' => now(),
            'login_count' => ($user->login_count ?? 0) + 1,
        ]);
    }
}
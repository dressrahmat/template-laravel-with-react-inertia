<?php

namespace App\Listeners;

use App\Models\AuditTrail;
use Illuminate\Auth\Events\Logout;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class LogSuccessfulLogout
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
    public function handle(Logout $event): void
    {
        $user = $event->user;

        if (!$user) {
            return;
        }

        AuditTrail::create([
            'user_id' => $user->id,
            'event' => 'logout',
            'auditable_type' => get_class($user),
            'auditable_id' => $user->id,
            'old_values' => null,
            'new_values' => [
                'logout_at' => now()->toISOString(),
            ],
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'url' => request()->fullUrl(),
            'description' => "User {$user->name} logged out",
            'created_at' => now(),
        ]);
    }
}
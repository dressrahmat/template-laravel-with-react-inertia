<?php

namespace App\Services;

use App\Models\AuditTrail;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class AuditTrailService
{
    /**
     * Log a custom audit event.
     */
    public static function log(
        string $event, 
        ?string $description = null, 
        $auditable = null, 
        array $extraData = []
    ): AuditTrail {
        $data = array_merge([
            'user_id' => Auth::id(),
            'event' => $event,
            'auditable_type' => $auditable ? get_class($auditable) : null,
            'auditable_id' => $auditable ? $auditable->getKey() : null,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'url' => request()->fullUrl(),
            'description' => $description,
            'batch_uuid' => self::getCurrentBatch(),
            'created_at' => now(),
        ], $extraData);

        return AuditTrail::create($data);
    }

    /**
     * Start a new batch for grouping related events.
     */
    public static function startBatch(): string
    {
        $batchUuid = Str::uuid()->toString();
        session()->put('audit_batch_uuid', $batchUuid);
        return $batchUuid;
    }

    /**
     * Get current batch UUID.
     */
    public static function getCurrentBatch(): ?string
    {
        return session()->get('audit_batch_uuid');
    }

    /**
     * End current batch.
     */
    public static function endBatch(): void
    {
        session()->forget('audit_batch_uuid');
    }

    /**
     * Log user login event.
     */
    public static function logLogin($user): AuditTrail
    {
        return self::log('login', "User {$user->name} logged in", $user);
    }

    /**
     * Log user logout event.
     */
    public static function logLogout($user): AuditTrail
    {
        return self::log('logout', "User {$user->name} logged out", $user);
    }

    /**
     * Log data export event.
     */
    public static function logExport($model, string $format): AuditTrail
    {
        return self::log(
            'exported', 
            "Exported " . class_basename($model) . " in {$format} format", 
            $model
        );
    }
}
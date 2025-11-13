<?php

namespace App\Traits;

use App\Models\AuditTrail;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

trait Auditable
{
    /**
     * Boot the auditable trait for a model.
     */
    public static function bootAuditable()
    {
        static::created(function ($model) {
            $model->logAuditEvent('created');
        });

        static::updated(function ($model) {
            $model->logAuditEvent('updated');
        });

        static::deleted(function ($model) {
            $model->logAuditEvent('deleted');
        });

        static::restored(function ($model) {
            $model->logAuditEvent('restored');
        });
    }

    /**
     * Log an audit event for the model.
     */
    protected function logAuditEvent(string $event): void
    {
        // Skip if no user is authenticated (e.g., console commands)
        if (!Auth::check() && !app()->runningInConsole()) {
            return;
        }

        $changes = $this->getChangesForAudit($event);
        
        AuditTrail::create([
            'user_id' => Auth::id(),
            'event' => $event,
            'auditable_type' => get_class($this),
            'auditable_id' => $this->getKey(),
            'old_values' => $changes['old'],
            'new_values' => $changes['new'],
            'ip_address' => request()?->ip(),
            'user_agent' => request()?->userAgent(),
            'url' => request()?->fullUrl(),
            'description' => $this->getAuditDescription($event),
            'batch_uuid' => $this->getCurrentBatchUuid(),
            'created_at' => now(),
        ]);
    }

    /**
     * Get changes for audit log.
     */
    protected function getChangesForAudit(string $event): array
    {
        if ($event === 'created') {
            return [
                'old' => null,
                'new' => $this->getAttributes()
            ];
        }

        if ($event === 'updated') {
            return [
                'old' => array_intersect_key($this->getOriginal(), $this->getChanges()),
                'new' => $this->getChanges()
            ];
        }

        if ($event === 'deleted') {
            return [
                'old' => $this->getOriginal(),
                'new' => null
            ];
        }

        return ['old' => null, 'new' => null];
    }

    /**
     * Get audit description.
     */
    protected function getAuditDescription(string $event): string
    {
        $modelName = class_basename($this);
        
        return match($event) {
            'created' => "Created new {$modelName}",
            'updated' => "Updated {$modelName} #{$this->getKey()}",
            'deleted' => "Deleted {$modelName} #{$this->getKey()}",
            'restored' => "Restored {$modelName} #{$this->getKey()}",
            default => "{$event} {$modelName} #{$this->getKey()}"
        };
    }

    /**
     * Get current batch UUID for grouping related events.
     */
    protected function getCurrentBatchUuid(): ?string
    {
        if (app()->runningInConsole()) {
            return null;
        }

        return session()->get('audit_batch_uuid');
    }

    /**
     * Relationship to audit trails.
     */
    public function auditTrails()
    {
        return $this->morphMany(AuditTrail::class, 'auditable');
    }

    /**
     * Get latest audit trail.
     */
    public function latestAuditTrail()
    {
        return $this->morphOne(AuditTrail::class, 'auditable')->latest('created_at');
    }

    /**
     * Get creation audit trail.
     */
    public function creationAuditTrail()
    {
        return $this->morphOne(AuditTrail::class, 'auditable')->where('event', 'created');
    }
}
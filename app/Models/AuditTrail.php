<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class AuditTrail extends Model
{
    protected $table = 'audit_trails';

    protected $fillable = [
        'user_id',
        'user_type',
        'event',
        'auditable_type',
        'auditable_id',
        'affected_user_id',
        'old_values',
        'new_values',
        'ip_address',
        'user_agent',
        'url',
        'description',
        'tags',
        'batch_uuid',
        'created_at'
    ];

    protected $casts = [
        'old_values' => 'array',
        'new_values' => 'array',
        'tags' => 'array',
        'created_at' => 'datetime'
    ];

    public $timestamps = false;

    /**
     * User yang melakukan aksi
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Model yang di-audit
     */
    public function auditable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * User yang terkena dampak aksi
     */
    public function affectedUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'affected_user_id');
    }

    /**
     * Scope untuk query yang umum
     */
    public function scopeToday($query)
    {
        return $query->whereDate('created_at', today());
    }

    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeForEvent($query, $event)
    {
        return $query->where('event', $event);
    }

    public function scopeForAuditable($query, $modelType, $modelId = null)
    {
        $query->where('auditable_type', $modelType);
        
        if ($modelId) {
            $query->where('auditable_id', $modelId);
        }
        
        return $query;
    }

    public function scopeWithBatch($query, $batchUuid)
    {
        return $query->where('batch_uuid', $batchUuid);
    }

    /**
     * Get readable description
     */
    public function getReadableDescriptionAttribute(): string
    {
        if ($this->description) {
            return $this->description;
        }

        $modelName = $this->auditable_type ? class_basename($this->auditable_type) : 'Record';
        $modelId = $this->auditable_id ? "#{$this->auditable_id}" : '';

        return match($this->event) {
            'created' => "Created new {$modelName}{$modelId}",
            'updated' => "Updated {$modelName}{$modelId}",
            'deleted' => "Deleted {$modelName}{$modelId}",
            'restored' => "Restored {$modelName}{$modelId}",
            'login' => 'User logged in',
            'logout' => 'User logged out',
            default => ucfirst($this->event) . " {$modelName}{$modelId}"
        };
    }
}
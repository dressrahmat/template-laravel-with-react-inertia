<?php

namespace App\Traits;

use App\Models\AuditTrail;
use Illuminate\Support\Facades\Auth;

trait Auditable
{
    public static function bootAuditable()
    {
        static::created(function ($model) {
            self::logChange($model, 'created');
        });

        static::updated(function ($model) {
            self::logChange($model, 'updated');
        });

        static::deleted(function ($model) {
            self::logChange($model, 'deleted');
        });
    }

    protected static function logChange($model, $event)
    {
        $changes = [
            'old_values' => $event === 'updated' ? $model->getOriginal() : null,
            'new_values' => $event !== 'deleted' ? $model->getAttributes() : null,
        ];

        AuditTrail::create([
            'event' => $event,
            'table_name' => $model->getTable(),
            'old_values' => $changes['old_values'],
            'new_values' => $changes['new_values'],
            'user_id' => Auth::id(),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'url' => request()->fullUrl(),
            'description' => self::getDescription($model, $event),
        ]);
    }

    protected static function getDescription($model, $event)
    {
        $modelName = class_basename($model);

        $descriptions = [
            'created' => "{$modelName} baru dibuat",
            'updated' => "{$modelName} diperbarui",
            'deleted' => "{$modelName} dihapus",
        ];

        return $descriptions[$event];
    }
}

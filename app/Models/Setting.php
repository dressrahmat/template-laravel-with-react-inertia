<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use Auditable, HasFactory;

    protected $table = 'setting';

    protected $fillable = [
        'site_name',
        'site_description',
        'site_logo',
        'site_favicon',
        'contact_email',
        'contact_phone',
        'address',
        'google_analytics_id',
        'google_analytics_enabled',
        'google_tag_manager_id',
        'google_tag_manager_enabled',
        'facebook_pixel_id',
        'facebook_pixel_enabled',
        'google_adsense_id',
        'google_adsense_code',
        'google_adsense_enabled',
        'facebook_url',
        'twitter_url',
        'instagram_url',
        'youtube_url',
        'linkedin_url',
        'meta_keywords',
        'meta_author',
        'og_image',
        'header_scripts',
        'body_scripts',
        'footer_scripts',
        'maintenance_mode',
        'maintenance_message',
    ];

    /**
     * Boot method untuk handle cache clearing
     */
    protected static function boot()
    {
        parent::boot();

        // Clear cache ketika settings diupdate
        static::saved(function () {
            cache()->forget('app_settings');
        });

        static::deleted(function () {
            cache()->forget('app_settings');
        });
    }

    /**
     * Get the first website settings (singleton pattern)
     */
    public static function getSettings()
    {
        return cache()->remember('app_settings', 3600, function () {
            return self::first() ?? new self();
        });
    }

    /**
     * Helper methods untuk check enabled status
     */
    public function isGoogleAnalyticsEnabled(): bool
    {
        return $this->google_analytics_enabled && !empty($this->google_analytics_id);
    }

    public function isGoogleTagManagerEnabled(): bool
    {
        return $this->google_tag_manager_enabled && !empty($this->google_tag_manager_id);
    }

    public function isFacebookPixelEnabled(): bool
    {
        return $this->facebook_pixel_enabled && !empty($this->facebook_pixel_id);
    }

    public function isGoogleAdsenseEnabled(): bool
    {
        return $this->google_adsense_enabled && !empty($this->google_adsense_id);
    }

    /**
     * Check if maintenance mode is enabled
     */
    public function isMaintenanceModeEnabled(): bool
    {
        return (bool) $this->maintenance_mode;
    }

    // Tambahkan metode restored
    public static function restored($callback)
    {
        static::registerModelEvent('restored', $callback);
    }
}
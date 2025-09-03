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
     * Get the first website settings (singleton pattern)
     */
    public static function getSettings()
    {
        return self::firstOrCreate([]);
    }
}

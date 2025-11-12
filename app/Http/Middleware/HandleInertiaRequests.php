<?php

namespace App\Http\Middleware;

use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Get settings data with caching - hanya data yang diperlukan
     */
    private function getSettings(): array
    {
        $settings = cache()->remember('app_settings', 3600, function () {
            return Setting::first() ?? new Setting();
        });

        return [
            // Hanya data yang diperlukan untuk frontend
            'site_name' => $settings->site_name ?? config('app.name', 'Laravel'),
            'site_description' => $settings->site_description,
            'site_logo' => $settings->site_logo ? asset('storage/' . $settings->site_logo) : null,
            'site_favicon' => $settings->site_favicon ? asset('storage/' . $settings->site_favicon) : null,
            
            // Social media links (hanya URL, tanpa sensitive data)
            'social_links' => [
                'facebook' => $settings->facebook_url,
                'twitter' => $settings->twitter_url,
                'instagram' => $settings->instagram_url,
                'youtube' => $settings->youtube_url,
                'linkedin' => $settings->linkedin_url,
            ],
            
            // SEO settings
            'meta_keywords' => $settings->meta_keywords,
            'meta_author' => $settings->meta_author,
            'og_image' => $settings->og_image ? asset('storage/' . $settings->og_image) : null,
            
            // Hanya status enabled/disabled untuk tracking, tanpa ID
            'tracking' => [
                'google_analytics' => [
                    'enabled' => (bool) $settings->google_analytics_enabled,
                ],
                'google_tag_manager' => [
                    'enabled' => (bool) $settings->google_tag_manager_enabled,
                ],
                'facebook_pixel' => [
                    'enabled' => (bool) $settings->facebook_pixel_enabled,
                ],
                'google_adsense' => [
                    'enabled' => (bool) $settings->google_adsense_enabled,
                ],
            ],
        ];
    }

    /**
     * Get blade-specific settings (untuk template)
     */
    private function getBladeSettings(): array
    {
        $settings = cache()->remember('app_settings', 3600, function () {
            return Setting::first() ?? new Setting();
        });

        return [
            'site_name' => $settings->site_name ?? config('app.name', 'Laravel'),
            'site_description' => $settings->site_description,
            
            // Tracking dengan ID hanya untuk blade (tidak diekspos ke frontend)
            'tracking' => [
                'google_tag_manager' => [
                    'id' => $settings->google_tag_manager_id,
                    'enabled' => (bool) $settings->google_tag_manager_enabled,
                ],
                'facebook_pixel' => [
                    'id' => $settings->facebook_pixel_id,
                    'enabled' => (bool) $settings->facebook_pixel_enabled,
                ],
                'google_adsense' => [
                    'id' => $settings->google_adsense_id,
                    'enabled' => (bool) $settings->google_adsense_enabled,
                ],
            ],
            
            // Scripts hanya untuk blade
            'header_scripts' => $this->sanitizeScripts($settings->header_scripts),
            'body_scripts' => $this->sanitizeScripts($settings->body_scripts),
            'footer_scripts' => $this->sanitizeScripts($settings->footer_scripts),
        ];
    }

    /**
     * Sanitize scripts untuk mencegah XSS
     */
    private function sanitizeScripts(?string $scripts): ?string
    {
        if (!$scripts) return null;

        // Basic sanitization - dalam production gunakan library yang lebih robust
        $scripts = preg_replace('/<script[^>]*>[\s\S]*?<\/script>/i', '', $scripts);
        
        return trim($scripts) ?: null;
    }

    public function share(Request $request): array
    {
        $settings = $this->getSettings();

        $sharedData = [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'settings' => $settings, // Hanya data yang aman
            'flash' => function () use ($request) {
                return [
                    'success' => $request->session()->get('success'),
                    'error' => $request->session()->get('error'),
                    'warning' => $request->session()->get('warning'),
                    'info' => $request->session()->get('info'),
                ];
            },
        ];

        // Share ke blade dengan data yang lebih lengkap (tidak diekspos ke JS)
        view()->share('blade_settings', $this->getBladeSettings());

        return $sharedData;
    }
}
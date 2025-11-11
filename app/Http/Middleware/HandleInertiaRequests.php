<?php

namespace App\Http\Middleware;

use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        // Ambil settings dari database dengan caching
        $settings = cache()->remember('app_settings', 3600, function () {
            return Setting::first() ?? new Setting();
        });

        // Share data untuk Inertia (React components)
        $sharedData = [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'settings' => [
                // Basic site information
                'site_name' => $settings->site_name ?? config('app.name', 'Laravel'),
                'site_description' => $settings->site_description,
                'site_logo' => $settings->site_logo ? asset('storage/' . $settings->site_logo) : null,
                'site_favicon' => $settings->site_favicon ? asset('storage/' . $settings->site_favicon) : null,
                
                // Contact information
                'contact_email' => $settings->contact_email,
                'contact_phone' => $settings->contact_phone,
                'address' => $settings->address,
                
                // Social media links
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
                
                // Tracking and analytics
                'tracking' => [
                    'google_analytics' => [
                        'id' => $settings->google_analytics_id,
                        'enabled' => (bool) $settings->google_analytics_enabled,
                    ],
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
                        'code' => $settings->google_adsense_code,
                        'enabled' => (bool) $settings->google_adsense_enabled,
                    ],
                ],
                
                // Custom scripts
                'header_scripts' => $settings->header_scripts,
                'body_scripts' => $settings->body_scripts,
                'footer_scripts' => $settings->footer_scripts,
                
                // Maintenance mode
                'maintenance_mode' => (bool) $settings->maintenance_mode,
                'maintenance_message' => $settings->maintenance_message,
            ],
            
            // Flash messages
            'flash' => function () use ($request) {
                return [
                    'success' => $request->session()->get('success'),
                    'error' => $request->session()->get('error'),
                    'warning' => $request->session()->get('warning'),
                    'info' => $request->session()->get('info'),
                ];
            },
        ];

        // Share data ke view blade (root template)
        view()->share('blade_settings', [
            'site_name' => $settings->site_name ?? config('app.name', 'Laravel'),
            'site_description' => $settings->site_description,
            'tracking' => [
                'google_analytics' => [
                    'id' => $settings->google_analytics_id,
                    'enabled' => (bool) $settings->google_analytics_enabled,
                ],
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
                    'code' => $settings->google_adsense_code,
                    'enabled' => (bool) $settings->google_adsense_enabled,
                ],
            ],
            'header_scripts' => $settings->header_scripts,
            'body_scripts' => $settings->body_scripts,
            'footer_scripts' => $settings->footer_scripts,
        ]);

        return $sharedData;
    }
}
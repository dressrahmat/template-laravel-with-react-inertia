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
     * Get safe user data for frontend (without sensitive information)
     */
    private function getSafeUserData($user): ?array
    {
        if (!$user) {
            return null;
        }

        // Load relationships if not already loaded
        if (!$user->relationLoaded('roles')) {
            $user->load('roles');
        }

        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'avatar' => $user->avatar_url ?? null,
            'timezone' => $user->timezone ?? config('app.timezone'),
            'locale' => $user->locale ?? config('app.locale'),
            
            // Role information (hanya data yang diperlukan)
            'role' => [
                'name' => $user->roles->first()->name ?? 'user',
                'display_name' => $user->roles->first()->display_name ?? 'User',
            ],
            
            // Hanya permissions yang diperlukan untuk UI components
            'permissions' => [
                // Dashboard & Admin
                'can_access_dashboard' => $user->can('view dashboard'),
                'can_access_admin' => $user->can('access admin panel'),
                
                // Users
                'can_view_users' => $user->can('view users'),
                'can_create_users' => $user->can('create users'),
                'can_edit_users' => $user->can('edit users'),
                'can_delete_users' => $user->can('delete users'),
                
                // Roles
                'can_view_roles' => $user->can('view roles'),
                'can_create_roles' => $user->can('create roles'),
                'can_edit_roles' => $user->can('edit roles'),
                'can_delete_roles' => $user->can('delete roles'),
                
                // Permissions
                'can_view_permissions' => $user->can('view permissions'),
                'can_edit_permissions' => $user->can('edit permissions'),
                
                // Settings
                'can_view_settings' => $user->can('view settings'),
                'can_edit_settings' => $user->can('edit settings'),
                
                // Audit Trail
                'can_view_audit_trail' => $user->can('view audit trail'),
            ],
            
            // Metadata
            'email_verified_at' => $user->email_verified_at?->toISOString(),
            'created_at' => $user->created_at?->toISOString(),
        ];
    }

    /**
     * Get settings data with caching - hanya data yang diperlukan untuk frontend
     */
    private function getSettings(): array
    {
        $settings = Setting::getSettings();

        return [
            // Basic site info
            'site_name' => $settings->site_name ?? config('app.name', 'Laravel'),
            'site_description' => $settings->site_description ?? '',
            'site_logo' => $settings->site_logo ? asset('storage/' . $settings->site_logo) : null,
            'site_favicon' => $settings->site_favicon ? asset('storage/' . $settings->site_favicon) : null,
            'site_url' => config('app.url'),
            
            // Contact information
            'contact_email' => $settings->contact_email ?? null,
            'contact_phone' => $settings->contact_phone ?? null,
            'address' => $settings->address ?? null,
            
            // Social media links
            'social_links' => [
                'facebook' => $settings->facebook_url,
                'twitter' => $settings->twitter_url,
                'instagram' => $settings->instagram_url,
                'youtube' => $settings->youtube_url,
                'linkedin' => $settings->linkedin_url,
            ],
            
            // SEO settings
            'meta_keywords' => $settings->meta_keywords ?? '',
            'meta_author' => $settings->meta_author ?? '',
            'og_image' => $settings->og_image ? asset('storage/' . $settings->og_image) : null,
            
            // Maintenance mode
            'maintenance_mode' => (bool) $settings->maintenance_mode,
            'maintenance_message' => $settings->maintenance_message ?? 'Site is under maintenance',
            
            // Tracking (hanya status enabled/disabled, tanpa ID atau sensitive data)
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
     * Get blade-specific settings (untuk template) dengan data lebih lengkap
     */
    private function getBladeSettings(): array
    {
        $settings = Setting::getSettings();

        return [
            'site_name' => $settings->site_name ?? config('app.name', 'Laravel'),
            'site_description' => $settings->site_description,
            'site_logo' => $settings->site_logo ? asset('storage/' . $settings->site_logo) : null,
            'site_favicon' => $settings->site_favicon ? asset('storage/' . $settings->site_favicon) : null,
            'contact_email' => $settings->contact_email,
            'contact_phone' => $settings->contact_phone,
            'address' => $settings->address,
            
            // Social media untuk blade
            'social_links' => [
                'facebook' => $settings->facebook_url,
                'twitter' => $settings->twitter_url,
                'instagram' => $settings->instagram_url,
                'youtube' => $settings->youtube_url,
                'linkedin' => $settings->linkedin_url,
            ],
            
            // SEO untuk blade
            'meta_keywords' => $settings->meta_keywords,
            'meta_author' => $settings->meta_author,
            'og_image' => $settings->og_image ? asset('storage/' . $settings->og_image) : null,
            
            // Maintenance mode
            'maintenance_mode' => (bool) $settings->maintenance_mode,
            'maintenance_message' => $settings->maintenance_message,
            
            // Tracking dengan ID hanya untuk blade (tidak diekspos ke frontend JS)
            'tracking' => [
                'google_analytics' => [
                    'id' => $settings->google_analytics_id,
                    'enabled' => $settings->isGoogleAnalyticsEnabled(),
                ],
                'google_tag_manager' => [
                    'id' => $settings->google_tag_manager_id,
                    'enabled' => $settings->isGoogleTagManagerEnabled(),
                ],
                'facebook_pixel' => [
                    'id' => $settings->facebook_pixel_id,
                    'enabled' => $settings->isFacebookPixelEnabled(),
                ],
                'google_adsense' => [
                    'id' => $settings->google_adsense_id,
                    'code' => $settings->google_adsense_code, // Hanya untuk blade
                    'enabled' => $settings->isGoogleAdsenseEnabled(),
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
        if (!$scripts) {
            return null;
        }

        // Basic sanitization - allow only script tags for analytics
        $allowedPatterns = [
            '/<!--.*?-->/s', // Remove HTML comments
        ];

        $scripts = preg_replace($allowedPatterns, '', $scripts);
        
        // Remove any potentially dangerous tags except script, noscript, style
        $scripts = strip_tags($scripts, '<script><noscript><style>');
        
        return trim($scripts) ?: null;
    }

    /**
     * Get application-wide data untuk ziggy routes
     */
    private function getZiggyData(Request $request): array
    {
        return [
            'location' => $request->url(),
            'query' => $request->query(),
            'params' => $request->route() ? $request->route()->parameters() : [],
        ];
    }

    /**
     * Get flash messages dengan sanitization
     */
    private function getFlashMessages(Request $request): array
    {
        return [
            'success' => $this->sanitizeFlashMessage($request->session()->get('success')),
            'error' => $this->sanitizeFlashMessage($request->session()->get('error')),
            'warning' => $this->sanitizeFlashMessage($request->session()->get('warning')),
            'info' => $this->sanitizeFlashMessage($request->session()->get('info')),
        ];
    }

    /**
     * Sanitize flash messages untuk mencegah XSS
     */
    private function sanitizeFlashMessage($message): ?string
    {
        if (!$message) {
            return null;
        }

        return e($message); // Escape HTML characters
    }

    /**
     * Check if current route should be excluded from maintenance mode
     */
    private function isExcludedFromMaintenance(Request $request): bool
    {
        // Daftar route names yang dikecualikan dari maintenance mode
        $excludedRoutes = [
            'login',
            'auth.login',
            'login.store',
            'logout',
            'password.request',
            'password.email',
            'password.reset',
            'password.update',
        ];

        // Daftar path patterns yang dikecualikan
        $excludedPaths = [
            '/login',
            '/auth/login',
            '/logout',
            '/forgot-password',
            '/reset-password',
            '/password/reset',
        ];

        $currentRoute = $request->route();
        
        // Cek berdasarkan route name
        if ($currentRoute && in_array($currentRoute->getName(), $excludedRoutes)) {
            return true;
        }

        // Cek berdasarkan path
        $currentPath = $request->path();
        foreach ($excludedPaths as $path) {
            if (str_starts_with($currentPath, ltrim($path, '/'))) {
                return true;
            }
        }

        return false;
    }

    /**
     * Main share method
     */
    public function share(Request $request): array
    {
        $sharedData = [
            ...parent::share($request),
            
            // Authentication data (filtered - TIDAK termasuk semua permissions)
            'auth' => [
                'user' => $this->getSafeUserData($request->user()),
                'is_authenticated' => (bool) $request->user(),
                'is_admin' => $request->user() ? $request->user()->hasRole('admin') : false,
                'is_master' => $request->user() ? $request->user()->hasRole('master') : false,
            ],
            
            // Settings (filtered - tanpa data sensitif)
            'settings' => $this->getSettings(),
            
            // Flash messages
            'flash' => $this->getFlashMessages($request),
            
            // Route information untuk Ziggy
            'ziggy' => $this->getZiggyData($request),
            
            // Application info
            'app' => [
                'name' => config('app.name'),
                'env' => config('app.env'),
                'debug' => config('app.debug', false),
                'url' => config('app.url'),
                'timezone' => config('app.timezone'),
                'locale' => config('app.locale'),
                'version' => $this->version($request),
            ],
            
            // CSRF token
            'csrf_token' => csrf_token(),
        ];

        // Share ke blade dengan data yang lebih lengkap (tidak diekspos ke JS)
        view()->share('blade_settings', $this->getBladeSettings());

        return $sharedData;
    }

    /**
     * Handle the incoming request
     */
    public function handle(Request $request, \Closure $next)
    {
        // Clear settings cache jika ada parameter refresh dan user memiliki permission
        if ($request->has('refresh_settings') && $request->user()?->can('edit settings')) {
            cache()->forget('app_settings');
        }

        // Check maintenance mode - skip untuk route yang dikecualikan
        $settings = Setting::getSettings();
        
        if ($settings->isMaintenanceModeEnabled() && 
            !$this->isExcludedFromMaintenance($request) && 
            !$request->user()?->can('access admin panel')) {
            
            if ($request->inertia()) {
                return inertia('Front/Maintenance', [
                    'message' => $settings->maintenance_message
                ]);
            }
            
            return response()->view('Front.Maintenance', [
                'message' => $settings->maintenance_message
            ], 503);
        }

        return parent::handle($request, $next);
    }
}
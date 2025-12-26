<?php

namespace App\Providers;

use App\Models\User;
use App\Observers\UserObserver;
use App\Services\UserRoleService;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(UserRoleService::class, function ($app) {
            return new UserRoleService();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
        User::observe(UserObserver::class);
    }
}
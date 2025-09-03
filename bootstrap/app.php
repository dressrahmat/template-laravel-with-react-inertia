<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Exceptions\UnauthorizedException;
use Symfony\Component\HttpKernel\Exception\HttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->alias([
            'role' => \Spatie\Permission\Middleware\RoleMiddleware::class,
            'permission' => \Spatie\Permission\Middleware\PermissionMiddleware::class,
            'role_or_permission' => \Spatie\Permission\Middleware\RoleOrPermissionMiddleware::class,
            'check.maintenance' => \App\Http\Middleware\CheckMaintenanceMode::class,
        ]);

        $middleware->append(\App\Http\Middleware\LogUserActivity::class);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Handle UnauthorizedException dari Spatie
        $exceptions->renderable(function (UnauthorizedException $e, Request $request) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'You do not have the required authorization.',
                ], 403);
            }

            $inertiaResponse = Inertia::render('Admin/Errors/403', [
                'auth' => [
                    'user' => auth()->check() ? [
                        'id' => auth()->user()->id,
                        'name' => auth()->user()->name,
                        'email' => auth()->user()->email,
                        'roles' => auth()->user()->getRoleNames()->toArray(),
                        'permissions' => auth()->user()->getAllPermissions()->pluck('name')->toArray(),
                    ] : null,
                ],
            ]);

            return $inertiaResponse->toResponse($request)->setStatusCode(403);
        });

        // Handle HttpException 403 umum
        $exceptions->renderable(function (HttpException $e, Request $request) {
            if ($e->getStatusCode() === 403) {
                if ($request->expectsJson()) {
                    return response()->json([
                        'message' => 'Forbidden.',
                    ], 403);
                }

                $inertiaResponse = Inertia::render('Admin/Errors/403', [
                    'auth' => [
                        'user' => auth()->check() ? [
                            'id' => auth()->user()->id,
                            'name' => auth()->user()->name,
                            'email' => auth()->user()->email,
                            'roles' => auth()->user()->getRoleNames()->toArray(),
                            'permissions' => auth()->user()->getAllPermissions()->pluck('name')->toArray(),
                        ] : null,
                    ],
                ]);

                return $inertiaResponse->toResponse($request)->setStatusCode(403);
            }
        });

        // Handler untuk 404
        $exceptions->renderable(function (HttpException $e, Request $request) {
            if ($e->getStatusCode() === 404) {
                if ($request->expectsJson()) {
                    return response()->json([
                        'message' => 'Page not found.',
                    ], 404);
                }

                $inertiaResponse = Inertia::render('Admin/Errors/404', [
                    'auth' => [
                        'user' => auth()->check() ? [
                            'id' => auth()->user()->id,
                            'name' => auth()->user()->name,
                            'email' => auth()->user()->email,
                            'roles' => auth()->user()->getRoleNames()->toArray(),
                            'permissions' => auth()->user()->getAllPermissions()->pluck('name')->toArray(),
                        ] : null,
                    ],
                ]);

                return $inertiaResponse->toResponse($request)->setStatusCode(404);
            }
        });
    })->create();

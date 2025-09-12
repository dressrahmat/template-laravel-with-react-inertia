<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\ProfileController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Front\BerandaController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\AuditTrailController;
use App\Http\Controllers\Admin\RolePermissionController;

// Route untuk frontend (publik)
Route::get('/', [BerandaController::class, 'index'])->name('welcome');

// Route untuk menangani semua rute yang tidak terdaftar (404)
Route::fallback(function (Request $request) {
    // Jika user terautentikasi tapi tidak memiliki akses
    if (auth()->check()) {
        // Cek jika ini seharusnya menjadi 403
        $path = $request->path();
        if (str_starts_with($path, 'admin') && ! auth()->user()->hasPermissionTo('access admin panel')) {
            $inertiaResponse = Inertia::render('Admin/Errors/403', [
                'auth' => [
                    'user' => [
                        'id' => auth()->user()->id,
                        'name' => auth()->user()->name,
                        'email' => auth()->user()->email,
                        'roles' => auth()->user()->getRoleNames()->toArray(),
                        'permissions' => auth()->user()->getAllPermissions()->pluck('name')->toArray(),
                    ],
                ],
            ]);

            return $inertiaResponse->toResponse($request)->setStatusCode(403);
        }
    }

    // Default ke 404
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
})->name('fallback');

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->middleware(['permission:view dashboard'])
        ->name('dashboard');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::prefix('admin')->name('admin.')->middleware(['permission:access admin panel'])->group(function () {
        // Users
        Route::get('/users', [UserController::class, 'index'])->middleware(['permission:view users'])->name('users.index');
        Route::get('/users/create', [UserController::class, 'create'])->middleware(['permission:create users'])->name('users.create');
        Route::post('/users', [UserController::class, 'store'])->middleware(['permission:create users'])->name('users.store');
        Route::get('/users/{user}', [UserController::class, 'show'])->middleware(['permission:view users'])->name('users.show');
        Route::get('/users/{user}/edit', [UserController::class, 'edit'])->middleware(['permission:edit users'])->name('users.edit');
        Route::put('/users/{user}', [UserController::class, 'update'])->middleware(['permission:edit users'])->name('users.update');
        Route::delete('/users/{user}', [UserController::class, 'destroy'])->middleware(['permission:delete users'])->name('users.destroy');
        Route::post('/users/bulk-destroy', [UserController::class, 'bulkDestroy'])->middleware(['permission:delete users'])->name('users.bulk-destroy');
        Route::post('/users/export', [UserController::class, 'export'])->middleware(['permission:view users'])->name('users.export');
        Route::put('/users/bulk-update', [UserController::class, 'bulkUpdate'])->middleware(['permission:edit users'])->name('users.bulk-update');

        // Roles & Permissions
        Route::get('/role-permissions', [RolePermissionController::class, 'index'])
            ->middleware(['permission:view roles', 'permission:view permissions'])
            ->name('role-permissions.index');
        Route::get('/roles/create', [RolePermissionController::class, 'createRole'])
            ->middleware(['permission:create roles'])
            ->name('roles.create');
        Route::post('/roles', [RolePermissionController::class, 'storeRole'])
            ->middleware(['permission:create roles'])
            ->name('roles.store');
        Route::get('/roles/{role}/edit', [RolePermissionController::class, 'editRole'])
            ->middleware(['permission:edit roles'])
            ->name('roles.edit');
        Route::put('/roles/{role}', [RolePermissionController::class, 'updateRole'])
            ->middleware(['permission:edit roles'])
            ->name('roles.update');

        Route::get('/permissions/create', [RolePermissionController::class, 'createPermission'])
            ->middleware(['permission:create permissions'])
            ->name('permissions.create');
        Route::post('/permissions', [RolePermissionController::class, 'storePermission'])
            ->middleware(['permission:create permissions'])
            ->name('permissions.store');
        Route::get('/permissions/{permission}/edit', [RolePermissionController::class, 'editPermission'])->middleware(['permission:edit permissions'])->name('permissions.edit');
        Route::put('/permissions/{permission}', [RolePermissionController::class, 'updatePermission'])->middleware(['permission:edit permissions'])->name('permissions.update');

        // Settings
        Route::get('/settings', [SettingController::class, 'index'])->middleware(['permission:view settings'])->name('settings.index');
        Route::put('/settings', [SettingController::class, 'update'])->middleware(['permission:edit settings'])->name('settings.update');
        Route::delete('/settings/images/{type}', [SettingController::class, 'removeImage'])->middleware(['permission:edit settings'])->name('settings.removeImage');
        Route::post('/settings/upload-logo', [SettingController::class, 'uploadLogoOnly'])->middleware(['permission:edit settings'])->name('settings.upload-logo');
        Route::post('/settings/upload-favicon', [SettingController::class, 'uploadFaviconOnly'])->middleware(['permission:edit settings'])->name('settings.upload-favicon');
        Route::post('/settings/upload-og-image', [SettingController::class, 'uploadOgImageOnly'])->middleware(['permission:edit settings'])->name('settings.upload-og-image');

        // Audit Trail - no changes needed as it was already using 'view' permission
        Route::middleware(['permission:view audit trail'])->group(function () {
            Route::get('/audit-trail/notifications', [AuditTrailController::class, 'notifications'])->name('audit-trail.notifications');
            Route::get('/audit-trail', [AuditTrailController::class, 'index'])->name('audit-trail.index');
            Route::get('/audit-trail/{audit_trail}', [AuditTrailController::class, 'show'])->name('audit-trail.show');
            Route::delete('/audit-trail/cleanup', [AuditTrailController::class, 'cleanup'])->name('audit-trail.cleanup');
            Route::post('/audit-trail/export', [AuditTrailController::class, 'export'])->name('audit-trail.export');
        });

    });
});

require __DIR__.'/auth.php';
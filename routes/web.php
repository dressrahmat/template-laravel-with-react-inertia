<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Front\BerandaController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\AuditTrailController;
use App\Http\Controllers\Admin\RolePermissionController;

// Route untuk frontend (publik)
Route::get('/', [BerandaController::class, 'index'])->name('welcome');


Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->middleware(['permission:view dashboard'])
        ->name('dashboard');
        
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::prefix('admin')->name('admin.')->middleware(['permission:access admin panel'])->group(function () {
        // Users - hanya untuk yang memiliki permission manage users
        Route::middleware(['permission:manage users'])->group(function () {
            Route::get('/users', [UserController::class, 'index'])->name('users.index');
            Route::get('/users/create', [UserController::class, 'create'])->name('users.create');
            Route::post('/users', [UserController::class, 'store'])->name('users.store');
            Route::get('/users/{user}', [UserController::class, 'show'])->name('users.show');
            Route::get('/users/{user}/edit', [UserController::class, 'edit'])->name('users.edit');
            Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
            Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
            Route::post('/users/bulk-destroy', [UserController::class, 'bulkDestroy'])->name('users.bulk-destroy');
            Route::post('/users/export', [UserController::class, 'export'])->name('users.export');
            Route::put('/users/bulk-update', [UserController::class, 'bulkUpdate'])->name('users.bulk-update');
            // Upload foto
            Route::post('/users/{user}/update-foto', [UserController::class, 'updatePhoto'])->name('users.update-photo');
            Route::post('/users/{user}/remove-foto', [UserController::class, 'removePhoto'])->name('users.remove-photo');
        });

        // Roles - hanya untuk yang memiliki permission manage roles
        Route::middleware(['permission:manage roles'])->group(function () {
            Route::get('/role-permissions', [RolePermissionController::class, 'index'])
                ->name('role-permissions.index');
            Route::get('/roles/create', [RolePermissionController::class, 'createRole'])
                ->name('roles.create');
            Route::post('/roles', [RolePermissionController::class, 'storeRole'])
                ->name('roles.store');
            Route::get('/roles/{role}/edit', [RolePermissionController::class, 'editRole'])
                ->name('roles.edit');
            Route::put('/roles/{role}', [RolePermissionController::class, 'updateRole'])
                ->name('roles.update');

            Route::get('/permissions/create', [RolePermissionController::class, 'createPermission'])
                ->name('permissions.create');
            Route::post('/permissions', [RolePermissionController::class, 'storePermission'])
                ->name('permissions.store');
            Route::get('/permissions/{permission}/edit', [RolePermissionController::class, 'editPermission'])->name('permissions.edit');
            Route::put('/permissions/{permission}', [RolePermissionController::class, 'updatePermission'])->name('permissions.update');
        });

        // Settings - hanya untuk yang memiliki permission manage settings
        Route::middleware(['permission:manage settings'])->group(function () {
            Route::get('/settings', [SettingController::class, 'index'])->name('settings.index');
            Route::put('/settings', [SettingController::class, 'update'])->name('settings.update');
            Route::delete('/settings/images/{type}', [SettingController::class, 'removeImage'])->name('settings.removeImage');
            
            // Route khusus untuk upload file individual
            Route::post('/settings/upload-logo', [SettingController::class, 'uploadLogoOnly'])->name('settings.upload-logo');
            Route::post('/settings/upload-favicon', [SettingController::class, 'uploadFaviconOnly'])->name('settings.upload-favicon');
            Route::post('/settings/upload-og-image', [SettingController::class, 'uploadOgImageOnly'])->name('settings.upload-og-image');
        });

        // Audit Trail - hanya untuk yang memiliki permission view audit trail
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
<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        $permissions = [
            'view dashboard',
            'access admin panel',
            'view users',
            'create users',
            'edit users',
            'delete users',
            // Permissions for roles and permissions
            'view roles',
            'create roles',
            'edit roles',
            'delete roles',
            'view permissions',
            'create permissions',
            'edit permissions',
            'delete permissions',

            // Permissions for settings
            'view settings',
            'edit settings',

            'view audit trail',
            'view audit trail users',
            'view audit trail roles',
            'view audit trail permissions',
            'view audit trail settings',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Create roles and assign permissions

        // Role Master - has all permissions
        $masterRole = Role::firstOrCreate(['name' => 'master']);
        $masterRole->syncPermissions(Permission::all());

        // Role Admin - has limited permissions
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $adminPermissions = [
            'view dashboard',
            'access admin panel',
            'view users',
            'create users',
            'edit users',
            'delete users',
            'view roles',
            'view permissions',
            'view settings',
            'edit settings',
            'view audit trail',
        ];
        $adminRole->syncPermissions($adminPermissions);

        // Role Viewer - has very limited permissions
        $viewerRole = Role::firstOrCreate(['name' => 'viewer']);
        $viewerPermissions = [
            'view dashboard',
            'access admin panel',
            'view users',
        ];
        $viewerRole->syncPermissions($viewerPermissions);

        // Create a master user
        $masterUser = User::firstOrCreate(
            ['email' => 'master@example.com'],
            [
                'name' => 'Master User',
                'password' => Hash::make('password'),
            ]
        );

        // Assign master role to the user
        $masterUser->syncRoles('master');

        // Create a viewer user
        $viewerUser = User::firstOrCreate(
            ['email' => 'user@example.com'],
            [
                'name' => 'Viewer User',
                'password' => Hash::make('password'),
            ]
        );

        // Assign viewer role to the user
        $viewerUser->syncRoles('viewer');
    }
}
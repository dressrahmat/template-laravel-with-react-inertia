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
            'manage users',
            // Permissions untuk manage roles dan permissions
            'manage roles',
            'view roles',
            'create roles',
            'edit roles',
            'delete roles',
            'manage permissions',
            'view permissions',
            'create permissions',
            'edit permissions',
            'delete permissions',

            'view audit trail',
            'view audit trail users',
            'view audit trail roles',
            'view audit trail permissions',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Create roles and assign permissions

        // Role Master - memiliki semua permissions
        $masterRole = Role::firstOrCreate(['name' => 'master']);
        $masterRole->syncPermissions(Permission::all());

        // Hanya membuat user master saja
        $masterUser = User::firstOrCreate(
            ['email' => 'master@example.com'],
            [
                'name' => 'Master User',
                'password' => Hash::make('password'),
            ]
        );

        // Assign role master ke user
        $masterUser->syncRoles('master');

    }
}
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionController extends Controller
{
    public function index(Request $request)
    {
        $authUser = auth()->user();

        // Ambil parameter dari request
        $search = $request->query('search');
        $type = $request->query('type', 'roles'); // 'roles' atau 'permissions'
        $perPage = $request->query('per_page', 10);
        $sort = $request->query('sort', 'name');
        $direction = $request->query('direction', 'asc');

        if ($type === 'roles') {
            $query = Role::when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
                ->with('permissions')
                ->withCount('users');

            // Tambahkan sorting
            if (in_array($sort, ['name', 'created_at'])) {
                $query->orderBy($sort, $direction);
            }

            $data = $query->paginate($perPage);
        } else {
            $query = Permission::when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
                ->with('roles');

            // Tambahkan sorting
            if (in_array($sort, ['name', 'created_at'])) {
                $query->orderBy($sort, $direction);
            }

            $data = $query->paginate($perPage);
        }

        // Tambahkan parameter type ke pagination links
        $data->appends([
            'type' => $type,
            'search' => $search,
            'per_page' => $perPage,
            'sort' => $sort,
            'direction' => $direction,
        ]);

        return Inertia::render('Admin/RolePermissions/Index', [
            'type' => $type,
            'data' => $data,
            'filters' => $request->only(['search', 'type', 'per_page', 'sort', 'direction']),
            'auth' => [
                'user' => [
                    'id' => $authUser->id,
                    'name' => $authUser->name,
                    'email' => $authUser->email,
                    'roles' => $authUser->getRoleNames()->toArray(),
                    'permissions' => $authUser->getAllPermissions()->pluck('name')->toArray(),
                ],
            ],
        ]);
    }

    public function createRole()
    {
        $authUser = auth()->user();
        
        // Mengambil semua permissions dari database
        $permissions = Permission::all()
            ->groupBy(function ($permission) {
                $parts = explode('.', $permission->name);

                return count($parts) > 1 ? $parts[0] : 'general';
            });

        return Inertia::render('Admin/RolePermissions/CreateRole', [
            'permissions' => $permissions,
            'auth' => [
                'user' => [
                    'id' => $authUser->id,
                    'name' => $authUser->name,
                    'email' => $authUser->email,
                    'roles' => $authUser->getRoleNames()->toArray(),
                    'permissions' => $authUser->getAllPermissions()->pluck('name')->toArray(),
                ],
            ],
        ]);
    }

    public function storeRole(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:roles,name',
            'permissions' => 'array',
            'permissions.*' => 'exists:permissions,name',
        ]);

        $role = Role::create(['name' => $request->name]);

        if ($request->has('permissions')) {
            $role->syncPermissions($request->permissions);
        }

        return redirect()->route('admin.role-permissions.index', ['type' => 'roles'])
            ->with('success', 'Role created successfully.');
    }

    public function editRole(Role $role)
    {
        $authUser = auth()->user();

        // Ambil semua permissions sebagai array biasa (tanpa grouping)
        $allPermissions = Permission::all();

        $role->load('permissions');

        return Inertia::render('Admin/RolePermissions/EditRole', [
            'role' => $role,
            'permissions' => $allPermissions, // Kirim sebagai array biasa
            'auth' => [
                'user' => [
                    'id' => $authUser->id,
                    'name' => $authUser->name,
                    'email' => $authUser->email,
                    'roles' => $authUser->getRoleNames()->toArray(),
                    'permissions' => $authUser->getAllPermissions()->pluck('name')->toArray(),
                ],
            ],
        ]);
    }

    public function updateRole(Request $request, Role $role)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:roles,name,'.$role->id,
            'permissions' => 'array',
            'permissions.*' => 'exists:permissions,name',
        ]);

        $role->update(['name' => $request->name]);

        if ($request->has('permissions')) {
            $role->syncPermissions($request->permissions);
        }

        return redirect()->route('admin.role-permissions.index', ['type' => 'roles'])
            ->with('success', 'Role updated successfully.');
    }

    public function createPermission()
    {
        $authUser = auth()->user();

        return Inertia::render('Admin/RolePermissions/CreatePermission', [
            'auth' => [
                'user' => [
                    'id' => $authUser->id,
                    'name' => $authUser->name,
                    'email' => $authUser->email,
                    'roles' => $authUser->getRoleNames()->toArray(),
                    'permissions' => $authUser->getAllPermissions()->pluck('name')->toArray(),
                ],
            ],
        ]);
    }

    public function storePermission(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:permissions,name',
            'description' => 'nullable|string|max:500',
        ]);

        Permission::create([
            'name' => $request->name,
            'description' => $request->description,
        ]);

        return redirect()->route('admin.role-permissions.index', ['type' => 'permissions'])
            ->with('success', 'Permission created successfully.');
    }

    // Method untuk menampilkan form edit permission
    public function editPermission(Permission $permission)
    {
        $authUser = auth()->user();

        return Inertia::render('Admin/RolePermissions/EditPermission', [
            'permission' => $permission,
            'auth' => [
                'user' => [
                    'id' => $authUser->id,
                    'name' => $authUser->name,
                    'email' => $authUser->email,
                    'roles' => $authUser->getRoleNames()->toArray(),
                    'permissions' => $authUser->getAllPermissions()->pluck('name')->toArray(),
                ],
            ],
        ]);
    }

    // Method untuk update permission
    public function updatePermission(Request $request, Permission $permission)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:permissions,name,'.$permission->id,
            'description' => 'nullable|string|max:500',
        ]);

        $permission->update([
            'name' => $request->name,
            'description' => $request->description,
        ]);

        return redirect()->route('admin.role-permissions.index', ['type' => 'permissions'])
            ->with('success', 'Permission updated successfully.');
    }

    // Tambahkan method lain untuk assign roles ke users, dll.
}
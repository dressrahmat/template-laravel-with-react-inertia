<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index(Request $request)
    {
        // Ambil user yang sedang login
        $authUser = auth()->user();

        // Ambil parameter dari request
        $search = $request->query('search');
        $sort = $request->query('sort', 'created_at');
        $direction = $request->query('direction', 'desc');
        $perPage = $request->query('per_page', 5);

        // Validasi per_page
        $validPerPage = [5, 10, 15];
        if (! in_array($perPage, $validPerPage)) {
            $perPage = 5;
        }

        // Validasi direction
        if (! in_array($direction, ['asc', 'desc'])) {
            $direction = 'desc';
        }

        // Validasi sort column
        $validSortColumns = ['name', 'email', 'created_at'];
        if (! in_array($sort, $validSortColumns)) {
            $sort = 'created_at';
        }

        // Query users dengan pencarian dan pengurutan
        $users = User::with('roles')
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->orderBy($sort, $direction)
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => $request->only(['search', 'sort', 'direction', 'per_page']),
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

    public function create()
    {
        $authUser = auth()->user();
        $roles = Role::all()->pluck('name')->toArray(); // Tambahkan toArray()

        return Inertia::render('Admin/Users/Create', [
            'roles' => $roles,
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

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // 2MB max
        ]);

        $userData = [
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ];

        // Handle photo upload
        if ($request->hasFile('foto')) {
            $path = $request->file('foto')->store('user-photos', 'public');
            $userData['foto_path'] = $path;
        }

        $user = User::create($userData);

        // Assign roles jika ada
        if ($request->has('roles') && ! empty($request->roles)) {
            $user->syncRoles($request->roles);
        }

        return redirect()->route('admin.users.index')
            ->with('success', 'User created successfully.');
    }

    public function show(User $user)
    {
        $authUser = auth()->user();
        $user->load('roles');

        return Inertia::render('Admin/Users/Show', [
            'user' => $user,
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

    public function edit(User $user)
    {
        $authUser = auth()->user();
        $roles = Role::all()->pluck('name')->toArray(); // Tambahkan toArray()
        $user->load('roles');

        return Inertia::render('Admin/Users/Edit', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'foto_path' => $user->foto_path,
                'roles' => $user->getRoleNames()->toArray(), // Pastikan array
            ],
            'roles' => $roles,
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

    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,'.$user->id,
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        $data = [
            'name' => $request->name,
            'email' => $request->email,
        ];

        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        try {
            // Simpan roles lama untuk audit
            $oldRoles = $user->getRoleNames()->toArray();

            $user->update($data);
            // Sync roles
            if ($request->has('roles')) {
                $user->syncRoles($request->roles);
            }

            return redirect()->route('admin.users.index')
                ->with('success', 'User updated successfully.');

        } catch (\Exception $e) {

            return back()->with('error', 'Failed to update user: '.$e->getMessage());
        }
    }

    public function updatePhoto(Request $request, User $user)
    {
        $request->validate([
            'foto' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        try {
            // Delete old photo if exists
            if ($user->foto_path && Storage::disk('public')->exists($user->foto_path)) {
                Storage::disk('public')->delete($user->foto_path);
            }

            // Store new photo - MIRIP DENGAN STORE
            $path = $request->file('foto')->store('user-photos', 'public');

            // Update user
            $user->update(['foto_path' => $path]);

            return back()->with('success', 'Profile photo updated successfully.');

        } catch (\Exception $e) {
            return back()->with('error', 'Failed to update foto user: '.$e->getMessage());
        }
    }

    // Tambahkan method removePhoto
    public function removePhoto(User $user)
    {
        try {
            // Delete photo from storage
            if ($user->foto_path && Storage::disk('public')->exists($user->foto_path)) {
                Storage::disk('public')->delete($user->foto_path);
            }

            // Update user record
            $user->update(['foto_path' => null]);

            return back()->with('success', 'Profile photo removed successfully.');

        } catch (\Exception $e) {
            return back()->with('error', 'Failed to remove photo: '.$e->getMessage());
        }
    }

    public function destroy(User $user)
    {
        $user->delete();

        return redirect()->route('admin.users.index')
            ->with('success', 'User deleted successfully.');
    }

    /**
     * Bulk delete users
     */
    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:users,id',
        ]);

        User::whereIn('id', $request->ids)->delete();

        return redirect()->route('admin.users.index')
            ->with('success', 'Selected users deleted successfully.');
    }

    /**
     * Export users (basic implementation - can be extended)
     */
    public function export(Request $request)
    {
        $request->validate([
            'ids' => 'nullable|array',
            'ids.*' => 'exists:users,id',
        ]);

        $users = $request->has('ids')
            ? User::whereIn('id', $request->ids)->get()
            : User::all();

        // Untuk sekarang hanya return data JSON
        // Bisa dikembangkan menjadi CSV/Excel export
        return response()->json([
            'users' => $users,
            'message' => 'Export functionality can be implemented further',
        ]);
    }

    /**
     * Bulk update users (optional - for future features)
     */
    public function bulkUpdate(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:users,id',
            'field' => 'required|string|in:status,role', // contoh field yang bisa diupdate
            'value' => 'required', // nilai baru
        ]);

        User::whereIn('id', $request->ids)
            ->update([$request->field => $request->value]);

        return redirect()->route('admin.users.index')
            ->with('success', 'Selected users updated successfully.');
    }
}
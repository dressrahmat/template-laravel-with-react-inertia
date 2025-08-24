<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    public function index(Request $request)
    {
        // Ambil parameter dari request
        $search = $request->query('search');
        $sort = $request->query('sort', 'created_at');
        $direction = $request->query('direction', 'desc');
        $perPage = $request->query('per_page', 5); // Tambahkan parameter per_page
        
        // Validasi per_page
        $validPerPage = [5, 10, 15];
        if (!in_array($perPage, $validPerPage)) {
            $perPage = 5;
        }
        
        // Validasi direction
        if (!in_array($direction, ['asc', 'desc'])) {
            $direction = 'desc';
        }
        
        // Validasi sort column
        $validSortColumns = ['name', 'email', 'created_at'];
        if (!in_array($sort, $validSortColumns)) {
            $sort = 'created_at';
        }
        
        // Query users dengan pencarian dan pengurutan
        $users = User::when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->orderBy($sort, $direction)
            ->paginate($perPage) // Gunakan perPage yang dipilih
            ->withQueryString(); // Mempertahankan parameter query string
        
        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => $request->only(['search', 'sort', 'direction', 'per_page']) // Tambahkan per_page ke filters
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Users/Create');
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

        User::create($userData);

        return redirect()->route('admin.users.index')
            ->with('success', 'User created successfully.');
    }

    public function show(User $user)
    {
        return Inertia::render('Admin/Users/Show', [
            'user' => $user
        ]);
    }

    public function edit(User $user)
    {
        return Inertia::render('Admin/Users/Edit', [
            'user' => $user
        ]);
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
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
            $user->update($data);
            
            return redirect()->route('admin.users.index')
                ->with('success', 'User updated successfully.');
                
        } catch (\Exception $e) {
            
            return back()->with('error', 'Failed to update user: ' . $e->getMessage());
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
            return back()->with('error', 'Failed to update foto user: ' . $e->getMessage());
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
            return back()->with('error', 'Failed to remove photo: ' . $e->getMessage());
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
            'ids.*' => 'exists:users,id'
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
            'ids.*' => 'exists:users,id'
        ]);

        $users = $request->has('ids') 
            ? User::whereIn('id', $request->ids)->get()
            : User::all();

        // Untuk sekarang hanya return data JSON
        // Bisa dikembangkan menjadi CSV/Excel export
        return response()->json([
            'users' => $users,
            'message' => 'Export functionality can be implemented further'
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
            'value' => 'required' // nilai baru
        ]);

        User::whereIn('id', $request->ids)
            ->update([$request->field => $request->value]);

        return redirect()->route('admin.users.index')
            ->with('success', 'Selected users updated successfully.');
    }
}
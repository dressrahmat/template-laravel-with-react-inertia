<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditTrail;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class AuditTrailController extends Controller
{
    /**
     * Tampilkan halaman indeks audit trail.
     */
    public function index(Request $request)
    {
        if (! Gate::allows('view audit trail')) {
            abort(403, 'Anda tidak memiliki izin untuk melihat audit trail.');
        }

        $authUser = auth()->user();

        $search = $request->query('search');
        $event = $request->query('event');
        $table = $request->query('table');
        $date = $request->query('date');
        $sort = $request->query('sort', 'created_at');
        $direction = $request->query('direction', 'desc');
        $perPage = $request->query('per_page', 10);

        $validPerPage = [5, 10, 15, 20, 50];
        if (! in_array($perPage, $validPerPage)) {
            $perPage = 10;
        }

        if (! in_array($direction, ['asc', 'desc'])) {
            $direction = 'desc';
        }

        $validSortColumns = ['created_at', 'table_name', 'event'];
        if (! in_array($sort, $validSortColumns)) {
            $sort = 'created_at';
        }

        $auditTrailsQuery = AuditTrail::with(['user:id,name,email']);
        $this->applyPermissionFilter($auditTrailsQuery, $authUser);

        $auditTrailsQuery
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('table_name', 'like', "%{$search}%")
                        ->orWhereHas('user', function ($userQuery) use ($search) {
                            $userQuery->where('name', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%");
                        });
                });
            })
            ->when($event, fn ($query, $event) => $query->where('event', $event))
            ->when($table, fn ($query, $table) => $query->where('table_name', $table))
            ->when($date, fn ($query, $date) => $query->whereDate('created_at', $date))
            ->orderBy($sort, $direction);

        $auditTrails = $auditTrailsQuery->paginate($perPage)->withQueryString()->through(function ($audit) {
            return [
                'id' => $audit->id,
                'event' => $audit->event,
                'event_color' => $audit->action_color, // Menggunakan accessor dari model
                'table_name' => $audit->table_name,
                'table_display_name' => $audit->table_display_name, // Menggunakan accessor dari model
                'user' => $audit->user ? [
                    'id' => $audit->user->id,
                    'name' => $audit->user->name,
                    'email' => $audit->user->email,
                ] : null,
                'old_values' => $audit->old_values,
                'new_values' => $audit->new_values,
                'created_at' => $audit->created_at->format('Y-m-d H:i:s'),
                'created_at_human' => $audit->created_at->diffForHumans(),
            ];
        });

        $availableTablesQuery = AuditTrail::distinct('table_name');
        $this->applyPermissionFilter($availableTablesQuery, $authUser);
        $availableTables = $availableTablesQuery->pluck('table_name')
            ->mapWithKeys(fn ($table) => [$table => (new AuditTrail(['table_name' => $table]))->table_display_name])
            ->toArray();

        return Inertia::render('Admin/AuditTrail/Index', [
            'auditTrails' => $auditTrails,
            'filters' => $request->only(['search', 'event', 'table', 'date', 'sort', 'direction', 'per_page']),
            'availableEvents' => [
                'created' => 'Dibuat',
                'updated' => 'Diperbarui',
                'deleted' => 'Dihapus',
                'login' => 'Login',
                'logout' => 'Logout',
            ],
            'availableTables' => $availableTables,
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

    /**
     * Tampilkan detail log audit trail.
     */
    public function show(AuditTrail $auditTrail)
    {
        $authUser = auth()->user();

        if (! Gate::allows('view audit trail') && ! $authUser->can('view audit trail '.$auditTrail->table_name)) {
            abort(403, 'Anda tidak memiliki izin untuk melihat audit trail dari tabel ini.');
        }

        $auditTrail->load(['user:id,name,email']);

        // Pastikan created_at ada dan format dengan benar
        $createdAt = $auditTrail->created_at;
        $createdAtFormatted = $createdAt ? $createdAt->format('Y-m-d H:i:s') : null;
        $createdAtHuman = $createdAt ? $createdAt->diffForHumans() : 'Waktu tidak tersedia';

        return Inertia::render('Admin/AuditTrail/Show', [
            'auditTrail' => [
                'id' => $auditTrail->id,
                'event' => $auditTrail->event,
                'event_color' => $auditTrail->action_color,
                'table_name' => $auditTrail->table_name,
                'table_display_name' => $auditTrail->table_display_name,
                'user' => $auditTrail->user ? [
                    'id' => $auditTrail->user->id,
                    'name' => $auditTrail->user->name,
                    'email' => $auditTrail->user->email,
                ] : null,
                'old_values' => $auditTrail->old_values,
                'new_values' => $auditTrail->new_values,
                'created_at' => $createdAtFormatted,
                'created_at_human' => $createdAtHuman,
                'message' => $auditTrail->message, // Tambahkan ini juga
            ],
            'auth' => [
                'user' => [
                    'id' => $authUser->id,
                    'name' => $authUser->name,
                    'email' => $authUser->email,
                    'roles' => $authUser->getRoleNames()->toArray(),
                    'permissions' => $authUser->getAllPermissions()->pluck('name')->toArray(),
                ],
            ],
            'availableEvents' => [ // Tambahkan ini untuk keamanan
                'login' => 'Login',
                'logout' => 'Logout',
                'created' => 'Dibuat',
                'updated' => 'Diperbarui',
                'deleted' => 'Dihapus',
            ],
        ]);
    }

    /**
     * Hapus log audit trail lama (lebih dari 90 hari)
     */
    public function cleanup(Request $request)
    {
        if (! Gate::allows('manage audit trail')) {
            abort(403, 'Anda tidak memiliki izin untuk mengelola audit trail.');
        }

        $days = $request->input('days', 90);
        $deletedCount = AuditTrail::where('created_at', '<', now()->subDays($days))->delete();

        return redirect()->route('admin.audit-trail.index')
            ->with('success', "Berhasil menghapus {$deletedCount} log audit trail yang lebih lama dari {$days} hari.");
    }

    /**
     * Ekspor data audit trail.
     */
    public function export(Request $request)
    {
        if (! Gate::allows('manage audit trail')) {
            abort(403, 'Anda tidak memiliki izin untuk mengelola audit trail.');
        }

        $request->validate([
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'event' => 'nullable|in:created,updated,deleted,login,logout',
            'table' => 'nullable|string',
        ]);

        $authUser = auth()->user();

        $query = AuditTrail::with(['user:id,name,email']);
        $this->applyPermissionFilter($query, $authUser);

        $query
            ->when($request->has('start_date') && $request->start_date, fn ($q) => $q->whereDate('created_at', '>=', $request->start_date))
            ->when($request->has('end_date') && $request->end_date, fn ($q) => $q->whereDate('created_at', '<=', $request->end_date))
            ->when($request->has('event') && $request->event, fn ($q) => $q->where('event', $request->event))
            ->when($request->has('table') && $request->table, fn ($q) => $q->where('table_name', $request->table));

        $auditTrails = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'audit_trails' => $auditTrails,
            'filters' => $request->only(['start_date', 'end_date', 'event', 'table']),
            'message' => 'Export functionality can be implemented further',
        ]);
    }

    /**
     * Ambil notifikasi audit trail terbaru.
     */
    public function notifications(Request $request)
    {
        $limit = $request->input('limit', 5);
        $authUser = auth()->user();

        $notificationsQuery = AuditTrail::with(['user:id,name,email']);
        $this->applyPermissionFilter($notificationsQuery, $authUser);

        $notifications = $notificationsQuery->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get()
            ->map(function ($audit) {
                return [
                    'id' => $audit->id,
                    'event' => $audit->event,
                    'event_color' => $audit->action_color,
                    'table_name' => $audit->table_name,
                    'table_display_name' => $audit->table_display_name,
                    'user' => $audit->user ? [
                        'id' => $audit->user->id,
                        'name' => $audit->user->name,
                        'email' => $audit->user->email,
                    ] : null,
                    'created_at' => $audit->created_at->format('Y-m-d H:i:s'),
                    'created_at_human' => $audit->created_at->diffForHumans(),
                    'message' => $audit->message, // Menggunakan accessor dari model
                ];
            });

        $unreadCountQuery = AuditTrail::where('created_at', '>', now()->subDays(1));
        $this->applyPermissionFilter($unreadCountQuery, $authUser);
        $unreadCount = $unreadCountQuery->count();

        return response()->json([
            'notifications' => $notifications,
            'unread_count' => $unreadCount,
        ]);
    }

    /**
     * Helper method untuk menerapkan filter izin pada query builder.
     */
    private function applyPermissionFilter(Builder $query, $authUser): void
    {
        $query->where(function ($q) use ($authUser) {
            $permissions = [
                'users' => 'view audit trail users',
                'anggota' => 'view audit trail anggota',
                'koordinator' => 'view audit trail koordinator',
                'pengurus' => 'view audit trail pengurus',
                'roles' => 'view audit trail roles',
                'permissions' => 'view audit trail permissions',
            ];

            $allowedTables = [];
            foreach ($permissions as $table => $permission) {
                if ($authUser->can($permission)) {
                    $allowedTables[] = $table;
                }
            }

            if ($authUser->hasRole('master') || $authUser->can('view all audit trail')) {
                // Jika memiliki akses master, tidak perlu filter
                $q->orWhereRaw('1=1');
            } elseif (! empty($allowedTables)) {
                $q->whereIn('table_name', $allowedTables);
            } else {
                // Jika tidak memiliki izin sama sekali, tidak tampilkan data
                $q->whereRaw('0=1');
            }
        });
    }
}

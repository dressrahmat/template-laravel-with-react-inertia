<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditTrail;
use App\Models\User;
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
        if (!Gate::allows('view audit trail')) {
            abort(403, 'Anda tidak memiliki izin untuk melihat audit trail.');
        }

        $authUser = auth()->user();

        $search = $request->query('search');
        $event = $request->query('event');
        $auditableType = $request->query('auditable_type');
        $date = $request->query('date');
        $sort = $request->query('sort', 'created_at');
        $direction = $request->query('direction', 'desc');
        $perPage = $request->query('per_page', 10);

        $validPerPage = [5, 10, 15, 20, 50];
        if (!in_array($perPage, $validPerPage)) {
            $perPage = 10;
        }

        if (!in_array($direction, ['asc', 'desc'])) {
            $direction = 'desc';
        }

        $validSortColumns = ['created_at', 'event', 'auditable_type'];
        if (!in_array($sort, $validSortColumns)) {
            $sort = 'created_at';
        }

        $auditTrailsQuery = AuditTrail::with([
            'user:id,name,email',
            'affectedUser:id,name,email',
            'auditable'
        ]);

        $this->applyPermissionFilter($auditTrailsQuery, $authUser);

        $auditTrailsQuery
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('description', 'like', "%{$search}%")
                        ->orWhere('auditable_type', 'like', "%{$search}%")
                        ->orWhereHas('user', function ($userQuery) use ($search) {
                            $userQuery->where('name', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%");
                        })
                        ->orWhereHas('affectedUser', function ($userQuery) use ($search) {
                            $userQuery->where('name', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%");
                        });
                });
            })
            ->when($event, fn($query, $event) => $query->where('event', $event))
            ->when($auditableType, fn($query, $auditableType) => $query->where('auditable_type', $auditableType))
            ->when($date, fn($query, $date) => $query->whereDate('created_at', $date))
            ->orderBy($sort, $direction);

        $auditTrails = $auditTrailsQuery->paginate($perPage)->withQueryString()->through(function ($audit) {
            return [
                'id' => $audit->id,
                'event' => $audit->event,
                'event_color' => $this->getEventColor($audit->event),
                'event_display_name' => $this->getEventDisplayName($audit->event),
                'auditable_type' => $audit->auditable_type,
                'auditable_type_display_name' => $this->getAuditableTypeDisplayName($audit->auditable_type),
                'auditable_id' => $audit->auditable_id,
                'user' => $audit->user ? [
                    'id' => $audit->user->id,
                    'name' => $audit->user->name,
                    'email' => $audit->user->email,
                ] : null,
                'affected_user' => $audit->affectedUser ? [
                    'id' => $audit->affectedUser->id,
                    'name' => $audit->affectedUser->name,
                    'email' => $audit->affectedUser->email,
                ] : null,
                'old_values' => $audit->old_values,
                'new_values' => $audit->new_values,
                'description' => $audit->description,
                'ip_address' => $audit->ip_address,
                'url' => $audit->url,
                'batch_uuid' => $audit->batch_uuid,
                'created_at' => $audit->created_at?->format('Y-m-d H:i:s'),
                'created_at_human' => $audit->created_at?->diffForHumans(),
                'readable_description' => $audit->readable_description,
            ];
        });

        $availableAuditableTypesQuery = AuditTrail::distinct('auditable_type');
        $this->applyPermissionFilter($availableAuditableTypesQuery, $authUser);
        $availableAuditableTypes = $availableAuditableTypesQuery->pluck('auditable_type')
            ->filter()
            ->mapWithKeys(fn($type) => [$type => $this->getAuditableTypeDisplayName($type)])
            ->toArray();

        return Inertia::render('Admin/AuditTrail/Index', [
            'auditTrails' => $auditTrails,
            'filters' => $request->only(['search', 'event', 'auditable_type', 'date', 'sort', 'direction', 'per_page']),
            'availableEvents' => $this->getAvailableEvents(),
            'availableAuditableTypes' => $availableAuditableTypes,
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

        if (!Gate::allows('view audit trail')) {
            abort(403, 'Anda tidak memiliki izin untuk melihat audit trail.');
        }

        // Cek izin spesifik untuk tipe data yang di-audit
        $auditableType = $auditTrail->auditable_type;
        if ($auditableType && !$this->hasPermissionForAuditableType($authUser, $auditableType)) {
            abort(403, 'Anda tidak memiliki izin untuk melihat audit trail dari tipe data ini.');
        }

        $auditTrail->load([
            'user:id,name,email',
            'affectedUser:id,name,email',
            'auditable'
        ]);

        return Inertia::render('Admin/AuditTrail/Show', [
            'auditTrail' => [
                'id' => $auditTrail->id,
                'event' => $auditTrail->event,
                'event_color' => $this->getEventColor($auditTrail->event),
                'event_display_name' => $this->getEventDisplayName($auditTrail->event),
                'auditable_type' => $auditTrail->auditable_type,
                'auditable_type_display_name' => $this->getAuditableTypeDisplayName($auditTrail->auditable_type),
                'auditable_id' => $auditTrail->auditable_id,
                'auditable_data' => $auditTrail->auditable,
                'user' => $auditTrail->user ? [
                    'id' => $auditTrail->user->id,
                    'name' => $auditTrail->user->name,
                    'email' => $auditTrail->user->email,
                ] : null,
                'affected_user' => $auditTrail->affectedUser ? [
                    'id' => $auditTrail->affectedUser->id,
                    'name' => $auditTrail->affectedUser->name,
                    'email' => $auditTrail->affectedUser->email,
                ] : null,
                'old_values' => $auditTrail->old_values,
                'new_values' => $auditTrail->new_values,
                'description' => $auditTrail->description,
                'ip_address' => $auditTrail->ip_address,
                'user_agent' => $auditTrail->user_agent,
                'url' => $auditTrail->url,
                'tags' => $auditTrail->tags,
                'batch_uuid' => $auditTrail->batch_uuid,
                'created_at' => $auditTrail->created_at?->format('Y-m-d H:i:s'),
                'created_at_human' => $auditTrail->created_at?->diffForHumans(),
                'readable_description' => $auditTrail->readable_description,
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
            'availableEvents' => $this->getAvailableEvents(),
        ]);
    }

    /**
     * Hapus log audit trail lama (lebih dari 90 hari)
     */
    public function cleanup(Request $request)
    {
        if (!Gate::allows('delete audit trails')) {
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
        if (!Gate::allows('export audit trails')) {
            abort(403, 'Anda tidak memiliki izin untuk mengekspor audit trail.');
        }

        $request->validate([
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'event' => 'nullable|in:created,updated,deleted,restored,login,logout,downloaded,viewed,approved,rejected,exported,imported',
            'auditable_type' => 'nullable|string',
        ]);

        $authUser = auth()->user();

        $query = AuditTrail::with([
            'user:id,name,email',
            'affectedUser:id,name,email'
        ]);
        
        $this->applyPermissionFilter($query, $authUser);

        $query
            ->when($request->has('start_date') && $request->start_date, fn($q) => $q->whereDate('created_at', '>=', $request->start_date))
            ->when($request->has('end_date') && $request->end_date, fn($q) => $q->whereDate('created_at', '<=', $request->end_date))
            ->when($request->has('event') && $request->event, fn($q) => $q->where('event', $request->event))
            ->when($request->has('auditable_type') && $request->auditable_type, fn($q) => $q->where('auditable_type', $request->auditable_type));

        $auditTrails = $query->orderBy('created_at', 'desc')->get();

        // Untuk implementasi ekspor yang lebih lengkap, Anda bisa menggunakan:
        // - Maatwebsite/Laravel-Excel
        // - CSV export manual
        // - PDF export

        return response()->json([
            'audit_trails' => $auditTrails->map(function ($audit) {
                return [
                    'id' => $audit->id,
                    'event' => $audit->event,
                    'event_display_name' => $this->getEventDisplayName($audit->event),
                    'auditable_type' => $audit->auditable_type,
                    'auditable_type_display_name' => $this->getAuditableTypeDisplayName($audit->auditable_type),
                    'auditable_id' => $audit->auditable_id,
                    'user_name' => $audit->user?->name,
                    'user_email' => $audit->user?->email,
                    'affected_user_name' => $audit->affectedUser?->name,
                    'description' => $audit->description,
                    'ip_address' => $audit->ip_address,
                    'url' => $audit->url,
                    'created_at' => $audit->created_at?->format('Y-m-d H:i:s'),
                ];
            }),
            'exported_at' => now()->format('Y-m-d H:i:s'),
            'filters' => $request->only(['start_date', 'end_date', 'event', 'auditable_type']),
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
                    'event_color' => $this->getEventColor($audit->event),
                    'event_display_name' => $this->getEventDisplayName($audit->event),
                    'auditable_type' => $audit->auditable_type,
                    'auditable_type_display_name' => $this->getAuditableTypeDisplayName($audit->auditable_type),
                    'user' => $audit->user ? [
                        'id' => $audit->user->id,
                        'name' => $audit->user->name,
                        'email' => $audit->user->email,
                    ] : null,
                    'created_at' => $audit->created_at?->format('Y-m-d H:i:s'),
                    'created_at_human' => $audit->created_at?->diffForHumans(),
                    'description' => $audit->readable_description,
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
        // Jika user memiliki akses penuh, tidak perlu filter
        if ($authUser->hasRole('master') || $authUser->can('view all audit trails')) {
            return;
        }

        $query->where(function ($q) use ($authUser) {
            $permissions = [
                'App\\Models\\User' => 'view audit trail users',
                'App\\Models\\Post' => 'view audit trail posts',
                'App\\Models\\Role' => 'view audit trail roles',
                'App\\Models\\Permission' => 'view audit trail permissions',
                // Tambahkan model lainnya sesuai kebutuhan
            ];

            $allowedTypes = [];
            foreach ($permissions as $model => $permission) {
                if ($authUser->can($permission)) {
                    $allowedTypes[] = $model;
                }
            }

            if (!empty($allowedTypes)) {
                $q->whereIn('auditable_type', $allowedTypes);
            } else {
                // Jika tidak memiliki izin sama sekali, tidak tampilkan data
                $q->whereRaw('0=1');
            }
        });
    }

    /**
     * Cek izin untuk tipe auditable tertentu
     */
    private function hasPermissionForAuditableType($user, $auditableType): bool
    {
        if ($user->hasRole('master') || $user->can('view all audit trails')) {
            return true;
        }

        $permissionMap = [
            'App\\Models\\User' => 'view audit trail users',
            'App\\Models\\Post' => 'view audit trail posts',
            'App\\Models\\Role' => 'view audit trail roles',
            'App\\Models\\Permission' => 'view audit trail permissions',
        ];

        $requiredPermission = $permissionMap[$auditableType] ?? null;

        return $requiredPermission ? $user->can($requiredPermission) : false;
    }

    /**
     * Daftar event yang tersedia
     */
    private function getAvailableEvents(): array
    {
        return [
            'created' => 'Dibuat',
            'updated' => 'Diperbarui',
            'deleted' => 'Dihapus',
            'restored' => 'Dipulihkan',
            'login' => 'Login',
            'logout' => 'Logout',
            'downloaded' => 'Didownload',
            'viewed' => 'Dilihat',
            'approved' => 'Disetujui',
            'rejected' => 'Ditolak',
            'exported' => 'Diekspor',
            'imported' => 'Diimpor',
        ];
    }

    /**
     * Warna untuk setiap event type
     */
    private function getEventColor(string $event): string
    {
        return match ($event) {
            'created', 'login', 'approved' => 'success',
            'updated', 'restored', 'imported' => 'warning',
            'deleted', 'logout', 'rejected' => 'danger',
            'viewed', 'downloaded' => 'info',
            'exported' => 'primary',
            default => 'secondary'
        };
    }

    /**
     * Nama display untuk event
     */
    private function getEventDisplayName(string $event): string
    {
        return $this->getAvailableEvents()[$event] ?? ucfirst($event);
    }

    /**
     * Nama display untuk auditable type
     */
    private function getAuditableTypeDisplayName(?string $auditableType): string
    {
        if (!$auditableType) {
            return 'System';
        }

        $displayNames = [
            'App\\Models\\User' => 'Pengguna',
            'App\\Models\\Post' => 'Post',
            'App\\Models\\Role' => 'Role',
            'App\\Models\\Permission' => 'Permission',
            'App\\Models\\AuditTrail' => 'Audit Trail',
            // Tambahkan mapping lainnya
        ];

        return $displayNames[$auditableType] ?? class_basename($auditableType);
    }
}
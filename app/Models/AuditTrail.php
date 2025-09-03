<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AuditTrail extends Model
{
    use HasFactory;

    /**
     * Nama tabel yang terkait dengan model.
     *
     * @var string
     */
    protected $table = 'audit_trails';

    /**
     * Atribut yang dapat diisi secara massal.
     *
     * @var array
     */
    protected $fillable = [
        'event',
        'table_name',
        'old_values',
        'new_values',
        'ip_address',
        'user_agent',
        'url',
        'description',
        'user_id',
        'affected_user_id',
    ];

    /**
     * Atribut yang harus di-cast.
     *
     * @var array
     */
    protected $casts = [
        'old_values' => 'array',
        'new_values' => 'array',
        // 'created_at' => 'datetime',
        // 'updated_at' => 'datetime',
    ];

    /**
     * Atribut yang akan ditambahkan ke array atau JSON dari model.
     *
     * @var array
     */
    protected $appends = [
        'message',
        'created_at_human',
        'action_color',
        'table_display_name',
    ];

    /**
     * Dapatkan user yang melakukan aksi.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Dapatkan user yang terpengaruh oleh aksi.
     */
    public function affectedUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'affected_user_id');
    }

    /**
     * Dapatkan representasi waktu yang mudah dibaca.
     */
    public function getCreatedAtHumanAttribute(): string
    {
        return $this->created_at ? $this->created_at->diffForHumans() : 'Waktu tidak tersedia';
    }

    /**
     * Dapatkan pesan yang dihasilkan dari log audit.
     */
    public function getMessageAttribute(): string
    {
        $userName = $this->user ? $this->user->name : 'Sistem';

        switch ($this->event) {
            case 'login':
                return "{$userName} melakukan login ke sistem";

            case 'logout':
                return "{$userName} melakukan logout dari sistem";

            case 'created':
                return "{$userName} menambahkan data {$this->table_display_name} baru";

            case 'updated':
                return "{$userName} memperbarui data {$this->table_display_name}";

            case 'deleted':
                return "{$userName} menghapus data {$this->table_display_name}";

            default:
                return "{$userName} melakukan aktivitas sistem";
        }
    }

    /**
     * Dapatkan nama tampilan untuk tabel.
     */
    public function getTableDisplayNameAttribute(): string
    {
        $tableNames = [
            'users' => 'Pengguna',
            'roles' => 'Roles',
            'permissions' => 'Permissions',
            'audit_trails' => 'Audit Trail',
        ];

        return $tableNames[$this->table_name] ?? ucwords(str_replace('_', ' ', $this->table_name));
    }

    /**
     * Dapatkan warna notifikasi berdasarkan event.
     */
    public function getActionColorAttribute(): string
    {
        return match ($this->event) {
            'login' => 'success',
            'logout' => 'warning',
            'created' => 'info',
            'updated' => 'primary',
            'deleted' => 'error',
            default => 'neutral'
        };
    }
}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('audit_trails', function (Blueprint $table) {
            $table->id();
            $table->string('event'); // created, updated, deleted, login, logout
            $table->string('table_name')->nullable(); // Nama tabel yang diubah
            $table->json('old_values')->nullable(); // Data lama (untuk update/delete)
            $table->json('new_values')->nullable(); // Data baru (untuk create/update)
            $table->string('ip_address')->nullable();
            $table->string('user_agent')->nullable();
            $table->text('url')->nullable();
            $table->text('description')->nullable();

            // Foreign key ke user
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('affected_user_id')->nullable()->constrained('users')->onDelete('set null');

            $table->timestamps();

            // Index untuk performa query
            $table->index(['event', 'table_name']);
            $table->index('created_at');
            $table->index('user_id');
        });
    }

    public function down()
    {
        Schema::dropIfExists('audit_trails');
    }
};

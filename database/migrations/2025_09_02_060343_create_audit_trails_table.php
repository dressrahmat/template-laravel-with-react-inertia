<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('audit_trails', function (Blueprint $table) {
            $table->id();
            
            // User yang melakukan aksi
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('user_type')->nullable(); // Untuk polymorphic relationship
            
            // Event type
            $table->enum('event', [
                'created', 
                'updated', 
                'deleted', 
                'restored', 
                'login', 
                'logout', 
                'downloaded', 
                'viewed',
                'approved',
                'rejected',
                'exported',
                'imported'
            ])->index();
            
            // Model yang di-audit (polymorphic relationship)
            $table->string('auditable_type')->nullable()->index();
            $table->unsignedBigInteger('auditable_id')->nullable()->index();
            
            // User yang terkena dampak aksi (jika ada)
            $table->foreignId('affected_user_id')->nullable()->constrained('users')->onDelete('set null');
            
            // Data changes
            $table->json('old_values')->nullable();
            $table->json('new_values')->nullable();
            
            // Context information
            $table->string('ip_address', 45)->nullable(); // Support IPv6
            $table->text('user_agent')->nullable();
            $table->text('url')->nullable();
            $table->text('description')->nullable();
            
            // Additional metadata
            $table->json('tags')->nullable(); // Untuk kategorisasi
            $table->uuid('batch_uuid')->nullable(); // Group related events
            
            // Timestamps
            $table->timestamp('created_at')->nullable();

            // Composite index untuk performa query
            $table->index(['user_id', 'event']);
            $table->index(['auditable_type', 'auditable_id', 'created_at']);
            $table->index(['batch_uuid', 'created_at']);
            $table->index(['event', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('audit_trails');
    }
};
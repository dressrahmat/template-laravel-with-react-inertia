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
        Schema::create('setting', function (Blueprint $table) {
            $table->id();

            // Informasi dasar website
            $table->string('site_name')->nullable();
            $table->string('site_description')->nullable();
            $table->string('site_logo')->nullable();
            $table->string('site_favicon')->nullable();
            $table->string('contact_email')->nullable();
            $table->string('contact_phone')->nullable();
            $table->text('address')->nullable();

            // Google Analytics
            $table->string('google_analytics_id')->nullable();
            $table->boolean('google_analytics_enabled')->default(false);

            // Google Tag Manager
            $table->string('google_tag_manager_id')->nullable();
            $table->boolean('google_tag_manager_enabled')->default(false);

            // Facebook Pixel
            $table->string('facebook_pixel_id')->nullable();
            $table->boolean('facebook_pixel_enabled')->default(false);

            // Google Adsense
            $table->string('google_adsense_id')->nullable();
            $table->text('google_adsense_code')->nullable();
            $table->boolean('google_adsense_enabled')->default(false);

            // Social Media
            $table->string('facebook_url')->nullable();
            $table->string('twitter_url')->nullable();
            $table->string('instagram_url')->nullable();
            $table->string('youtube_url')->nullable();
            $table->string('linkedin_url')->nullable();

            // SEO Settings
            $table->text('meta_keywords')->nullable();
            $table->text('meta_author')->nullable();
            $table->string('og_image')->nullable();

            // Additional Scripts
            $table->text('header_scripts')->nullable();
            $table->text('body_scripts')->nullable();
            $table->text('footer_scripts')->nullable();

            // Maintenance Mode
            $table->boolean('maintenance_mode')->default(false);
            $table->text('maintenance_message')->nullable();

            $table->timestamps();
        });

        // Insert default settings
        DB::table('setting')->insert([
            'site_name' => 'Nama Website Anda',
            'site_description' => 'Deskripsi website Anda',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('setting');
    }
};

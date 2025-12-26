<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $settings = [
            // Informasi dasar website
            'site_name' => 'DedyTech Inc.',
            'site_description' => 'Solusi teknologi terdepan untuk bisnis modern Anda. Menyediakan layanan web development, mobile apps, dan konsultasi IT.',
            'site_logo' => 'logos/company-logo.png',
            'site_favicon' => 'favicons/favicon.ico',
            'contact_email' => 'hello@dedytech.com',
            'contact_phone' => '+62 895 3051 9448',
            'address' => 'Perum De Prima, Tunggulwulung, Malang, Indonesia',

            // Google Analytics
            'google_analytics_id' => null,
            'google_analytics_enabled' => false,

            // Google Tag Manager
            'google_tag_manager_id' => null,
            'google_tag_manager_enabled' => false,

            // Facebook Pixel
            'facebook_pixel_id' => null,
            'facebook_pixel_enabled' => false,

            // Google Adsense
            'google_adsense_id' => null,
            'google_adsense_code' => null,
            'google_adsense_enabled' => false,

            // Social Media
            'facebook_url' => 'https://facebook.com/techsolution',
            'twitter_url' => 'https://twitter.com/techsolution',
            'instagram_url' => 'https://instagram.com/techsolution',
            'youtube_url' => 'https://youtube.com/c/techsolution',
            'linkedin_url' => 'https://linkedin.com/company/techsolution',

            // SEO Settings
            'meta_keywords' => 'web development, mobile apps, software development, IT consultant, teknologi, startup, digital solution',
            'meta_author' => 'TechSolution Inc.',
            'og_image' => 'images/og-image.jpg',

            // Additional Scripts
            'header_scripts' => '<!-- Google tag (gtag.js) -->',
            'body_scripts' => '<!-- Chat widget script -->',
            'footer_scripts' => '<!-- Analytics script -->',

            // Maintenance Mode
            'maintenance_mode' => false,
            'maintenance_message' => 'Maaf, website sedang dalam pemeliharaan untuk pengalaman yang lebih baik. Silakan kembali beberapa saat lagi.',
        ];

        Setting::create($settings);

    }
}
<?php

namespace App\Http\Controllers\Front;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;

class BerandaController extends Controller
{
    public function index()
    {
        // Ambil pengaturan website
        $settings = Setting::first();
        
        // Jika belum ada data, buat data default
        if (!$settings) {
            $settings = Setting::create([
                'site_name' => 'Nama Website',
                'site_description' => 'Deskripsi Website',
            ]);
        }

        // Data untuk meta tags
        $metaTags = [
            'title' => $settings->site_name,
            'description' => $settings->site_description,
            'keywords' => $settings->meta_keywords,
            'author' => $settings->meta_author,
            'og_image' => $settings->og_image ? asset('storage/' . $settings->og_image) : null,
        ];

        return Inertia::render('Welcome', [
            'settings' => $settings,
            'metaTags' => $metaTags,
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'laravelVersion' => Application::VERSION,
            'phpVersion' => PHP_VERSION,
        ]);
    }

    public function tentang()
    {
        $settings = Setting::first();
        
        $metaTags = [
            'title' => 'Tentang Kami - ' . ($settings->site_name ?? 'Website'),
            'description' => 'Tentang kami dan visi misi perusahaan',
            'keywords' => $settings->meta_keywords ?? '',
            'author' => $settings->meta_author ?? '',
            'og_image' => $settings->og_image ? asset('storage/' . $settings->og_image) : null,
        ];

        return Inertia::render('Front/Beranda/Tentang', [
            'settings' => $settings,
            'metaTags' => $metaTags,
        ]);
    }

    public function kontak()
    {
        $settings = Setting::first();
        
        $metaTags = [
            'title' => 'Kontak - ' . ($settings->site_name ?? 'Website'),
            'description' => 'Hubungi kami untuk informasi lebih lanjut',
            'keywords' => $settings->meta_keywords ?? '',
            'author' => $settings->meta_author ?? '',
            'og_image' => $settings->og_image ? asset('storage/' . $settings->og_image) : null,
        ];

        return Inertia::render('Front/Beranda/Kontak', [
            'settings' => $settings,
            'metaTags' => $metaTags,
        ]);
    }

    public function maintenance()
    {
        $settings = Setting::first();
        
        // Jika maintenance mode tidak aktif, redirect ke home
        if (!$settings->maintenance_mode) {
            return redirect()->route('welcome');
        }

        return Inertia::render('Front/Beranda/Maintenance', [
            'settings' => $settings,
            'maintenance_message' => $settings->maintenance_message,
        ]);
    }
}
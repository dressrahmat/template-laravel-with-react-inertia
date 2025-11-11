<?php

namespace App\Http\Controllers\Front;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

class BerandaController extends Controller
{
    public function index()
    {
        $metaTags = [
            'title' => config('app.name', 'Laravel'),
            'description' => '',
            'keywords' => '',
            'author' => '',
            'og_image' => null,
        ];

        return Inertia::render('Welcome', [
            // Hanya kirim data yang spesifik untuk page ini
            'metaTags' => $metaTags,
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'laravelVersion' => Application::VERSION,
            'phpVersion' => PHP_VERSION,
        ]);
    }
}
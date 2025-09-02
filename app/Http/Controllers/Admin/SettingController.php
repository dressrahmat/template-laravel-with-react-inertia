<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Setting;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class SettingController extends Controller
{
    public function index(Request $request)
    {
        // Ambil user yang sedang login
        $authUser = auth()->user();

        // Ambil pengaturan website
        $settings = Setting::first();
        
        // Jika belum ada data, buat data default
        if (!$settings) {
            $settings = Setting::create([
                'site_name' => 'Nama Website',
                'site_description' => 'Deskripsi Website',
            ]);
        }

        return Inertia::render('Admin/Settings/Index', [
            'settings' => $settings,
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

    public function update(Request $request)
    {
        $settings = Setting::firstOrCreate([]);

        $validator = Validator::make($request->all(), [
            'site_name' => 'required|string|max:255',
            'site_description' => 'nullable|string',
            'site_logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'site_favicon' => 'nullable|image|mimes:ico,png|max:1024',
            'contact_email' => 'nullable|email',
            'contact_phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'google_analytics_id' => 'nullable|string|max:50',
            'google_tag_manager_id' => 'nullable|string|max:50',
            'facebook_pixel_id' => 'nullable|string|max:50',
            'google_adsense_id' => 'nullable|string|max:100',
            'google_adsense_code' => 'nullable|string',
            'facebook_url' => 'nullable|url',
            'twitter_url' => 'nullable|url',
            'instagram_url' => 'nullable|url',
            'youtube_url' => 'nullable|url',
            'linkedin_url' => 'nullable|url',
            'meta_keywords' => 'nullable|string',
            'meta_author' => 'nullable|string|max:255',
            'og_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'header_scripts' => 'nullable|string',
            'body_scripts' => 'nullable|string',
            'footer_scripts' => 'nullable|string',
            'maintenance_message' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        $data = $request->except(['site_logo', 'site_favicon', 'og_image']);

        // Handle site logo upload
        if ($request->hasFile('site_logo')) {
            // Delete old logo if exists
            if ($settings->site_logo && Storage::disk('public')->exists($settings->site_logo)) {
                Storage::disk('public')->delete($settings->site_logo);
            }
            
            $path = $request->file('site_logo')->store('settings', 'public');
            $data['site_logo'] = $path;
        }

        // Handle favicon upload
        if ($request->hasFile('site_favicon')) {
            // Delete old favicon if exists
            if ($settings->site_favicon && Storage::disk('public')->exists($settings->site_favicon)) {
                Storage::disk('public')->delete($settings->site_favicon);
            }
            
            $path = $request->file('site_favicon')->store('settings', 'public');
            $data['site_favicon'] = $path;
        }

        // Handle OG image upload
        if ($request->hasFile('og_image')) {
            // Delete old OG image if exists
            if ($settings->og_image && Storage::disk('public')->exists($settings->og_image)) {
                Storage::disk('public')->delete($settings->og_image);
            }
            
            $path = $request->file('og_image')->store('settings', 'public');
            $data['og_image'] = $path;
        }

        // Update boolean fields
        $data['google_analytics_enabled'] = $request->has('google_analytics_enabled');
        $data['google_tag_manager_enabled'] = $request->has('google_tag_manager_enabled');
        $data['facebook_pixel_enabled'] = $request->has('facebook_pixel_enabled');
        $data['google_adsense_enabled'] = $request->has('google_adsense_enabled');
        $data['maintenance_mode'] = $request->has('maintenance_mode');

        try {
            $settings->update($data);
            
            return redirect()->route('admin.settings.index')
                ->with('success', 'Pengaturan berhasil diperbarui.');
                
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal memperbarui pengaturan: ' . $e->getMessage());
        }
    }

    public function removeImage(Request $request, $type)
    {
        $settings = Setting::first();
        
        if (!$settings) {
            return back()->with('error', 'Pengaturan tidak ditemukan.');
        }

        try {
            $field = '';
            $message = '';
            
            switch ($type) {
                case 'logo':
                    $field = 'site_logo';
                    $message = 'Logo berhasil dihapus.';
                    break;
                case 'favicon':
                    $field = 'site_favicon';
                    $message = 'Favicon berhasil dihapus.';
                    break;
                case 'og_image':
                    $field = 'og_image';
                    $message = 'OG Image berhasil dihapus.';
                    break;
                default:
                    return back()->with('error', 'Tipe gambar tidak valid.');
            }

            // Delete image from storage
            if ($settings->$field && Storage::disk('public')->exists($settings->$field)) {
                Storage::disk('public')->delete($settings->$field);
            }
            
            // Update settings record
            $settings->update([$field => null]);

            return back()->with('success', $message);

        } catch (\Exception $e) {
            return back()->with('error', 'Gagal menghapus gambar: ' . $e->getMessage());
        }
    }

    public function getScripts($type)
    {
        $settings = Setting::first();
        
        if (!$settings) {
            return response('', 200);
        }

        switch ($type) {
            case 'header':
                return response($settings->header_scripts ?? '');
            case 'body':
                return response($settings->body_scripts ?? '');
            case 'footer':
                return response($settings->footer_scripts ?? '');
            default:
                return response('', 200);
        }
    }
}
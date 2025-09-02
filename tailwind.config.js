import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                // Neutral: Untuk background, border, dan teks sekunder
                neutral: {
                    50: '#f9fafb',  // Sangat terang untuk background light
                    100: '#f3f4f6',
                    200: '#e5e7eb',
                    300: '#d1d5db',
                    400: '#9ca3af',
                    500: '#6b7280',  // Abu-abu netral untuk teks sekunder
                    600: '#4b5563',
                    700: '#374151',
                    800: '#1f2937',  // Gelap untuk background dark mode
                    900: '#111827',
                    950: '#0a0f1a',  // Sangat gelap untuk dark mode
                },
                // Primary: Indigo untuk elemen utama (tombol, link)
                primary: {
                    50: '#eef2ff',  // Sangat terang untuk hover di light mode
                    100: '#e0e7ff',
                    200: '#c7d2fe',
                    300: '#a5b4fc',
                    400: '#818cf8',
                    500: '#6366f1',  // Warna utama
                    600: '#4f46e5',  // Sedikit lebih gelap untuk aksi
                    700: '#4338ca',
                    800: '#3730a3',
                    900: '#312e81',
                },
                // Accent: Teal untuk elemen aksen (highlight, notifikasi)
                accent: {
                    50: '#f0fdfa',
                    100: '#ccfbf1',
                    200: '#99f6e4',
                    300: '#5eead4',
                    400: '#2dd4bf',
                    500: '#14b8a6',  // Warna aksen utama
                    600: '#0d9488',
                    700: '#0f766e',
                    800: '#115e59',
                    900: '#134e4a',
                },
                // Success: Hijau untuk status sukses
                success: {
                    50: '#f0fdf4',
                    100: '#dcfce7',
                    200: '#bbf7d0',
                    300: '#86efac',
                    400: '#4ade80',
                    500: '#22c55e',  // Hijau utama
                    600: '#16a34a',
                    700: '#15803d',
                    800: '#166534',
                    900: '#14532d',
                },
                // Warning: Kuning untuk peringatan
                warning: {
                    50: '#fffbeb',
                    100: '#fef3c7',
                    200: '#fde68a',
                    300: '#fcd34d',
                    400: '#fbbf24',
                    500: '#f59e0b',  // Kuning utama
                    600: '#d97706',
                    700: '#b45309',
                    800: '#92400e',
                    900: '#78350f',
                },
                // Error: Merah untuk status error
                error: {
                    50: '#fef2f2',
                    100: '#fee2e2',
                    200: '#fecaca',
                    300: '#fca5a5',
                    400: '#f87171',
                    500: '#ef4444',  // Merah utama
                    600: '#dc2626',
                    700: '#b91c1c',
                    800: '#991b1b',
                    900: '#7f1d1d',
                },
            },
            // Menambahkan shadow untuk elemen yang lebih elegan
            boxShadow: {
                'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
                'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            },
            // Border radius untuk tampilan lebih halus
            borderRadius: {
                'xl': '1rem',
                '2xl': '1.5rem',
            },
        },
    },
    plugins: [require('@tailwindcss/forms')],
};
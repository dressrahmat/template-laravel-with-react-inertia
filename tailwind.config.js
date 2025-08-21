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
                // Palet warna yang lebih konsisten untuk dark mode
                gray: {
                    '100': '#f3f4f6',
                    '200': '#e5e7eb',
                    '300': '#d1d5db',
                    '400': '#9ca3af',
                    '500': '#6b7280',
                    '600': '#4b5563',
                    '700': '#374151',
                    '800': '#1f2937',
                    '900': '#111827',
                },
                slate: {
                    '800': '#1e293b',
                    '900': '#0f172a',
                },
                // Ubah nama primary dan dark agar lebih mudah dibaca
                primary: {
                    light: '#4f46e5', // Indigo 600
                    dark: '#6366f1',  // Indigo 500
                },
            },
        },
    },
    plugins: [require('@tailwindcss/forms')],
};
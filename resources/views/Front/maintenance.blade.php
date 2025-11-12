<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="h-full">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>Maintenance Mode - {{ $blade_settings['site_name'] ?? config('app.name') }}</title>

    <!-- Favicon -->
    @if ($blade_settings['site_favicon'] ?? false)
        <link rel="icon" href="{{ $blade_settings['site_favicon'] }}" type="image/x-icon">
    @endif

    <!-- Styles from Vite -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>

<body class="font-inter antialiased">
    <div
        class="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-100 dark:from-neutral-900 dark:to-primary-900 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 w-full">

        <!-- Logo -->
        <div class="mb-8 animate-fade-in-up">
            <a href="/" class="block">
                @if ($blade_settings['site_logo'] ?? false)
                    <img src="{{ $blade_settings['site_logo'] }}"
                        alt="{{ $blade_settings['site_name'] ?? config('app.name') }}" class="h-24 w-24 mx-auto">
                @else
                    <!-- Fallback Application Logo -->
                    <div class="h-24 w-24 mx-auto text-primary-600 dark:text-primary-400">
                        <svg viewBox="0 0 48 48" fill="currentColor">
                            <path
                                d="M11.5 28.5L11.5 22.5M11.5 16.5L11.5 10.5M23.5 28.5L23.5 22.5M23.5 16.5L23.5 10.5M35.5 28.5L35.5 22.5M35.5 16.5L35.5 10.5M6.5 40.5L6.5 34.5M17.5 40.5L17.5 34.5M28.5 40.5L28.5 34.5M39.5 40.5L39.5 34.5M6.5 6.5L6.5 2.5M17.5 6.5L17.5 2.5M28.5 6.5L28.5 2.5M39.5 6.5L39.5 2.5M2.5 6.5L45.5 6.5M2.5 16.5L45.5 16.5M2.5 26.5L45.5 26.5M2.5 36.5L45.5 36.5M2.5 45.5L45.5 45.5" />
                        </svg>
                    </div>
                @endif
            </a>
        </div>

        <!-- Main Content Card -->
        <div
            class="w-full max-w-md bg-white dark:bg-neutral-800 rounded-xl shadow-card overflow-hidden animate-fade-in-scale">
            <div class="px-6 py-8 sm:px-8 sm:py-10">

                <!-- Maintenance Icon -->
                <div class="text-center mb-6">
                    <div
                        class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 dark:bg-yellow-900/30 mb-4">
                        <svg class="h-8 w-8 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>

                    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Under Maintenance
                    </h1>

                    <div class="text-gray-600 dark:text-gray-300 leading-relaxed text-sm space-y-2">
                        @if (isset($message) && !empty($message))
                            {!! nl2br(e($message)) !!}
                        @else
                            <p>Our site is currently undergoing scheduled maintenance.</p>
                            <p>We apologize for any inconvenience and should be back shortly.</p>
                        @endif
                    </div>
                </div>

                <!-- Progress Bar -->
                <div class="mt-6">
                    <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div class="bg-yellow-500 h-2 rounded-full animate-pulse"></div>
                    </div>
                    <p class="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                        Maintenance in progress...
                    </p>
                </div>

                <!-- Refresh Button -->
                <div class="mt-6 text-center">
                    <button onclick="window.location.reload()"
                        class="inline-flex items-center px-4 py-2 bg-primary-600 border border-transparent rounded-lg font-semibold text-xs text-white uppercase tracking-widest hover:bg-primary-700 focus:bg-primary-700 active:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Check Again
                    </button>
                </div>

            </div>
        </div>

        <!-- Footer -->
        <div class="mt-8 text-center text-sm text-gray-600 dark:text-gray-400 animate-fade-in">
            <p>
                © {{ date('Y') }} {{ $blade_settings['site_name'] ?? config('app.name') }}. All rights reserved.
            </p>
        </div>

    </div>

    <!-- Auto-refresh script -->
    <script>
        // Auto-refresh every 5 minutes
        setTimeout(function() {
            window.location.reload();
        }, 300000);

        // Dark mode handler
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia(
                '(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    </script>

    <!-- Custom Scripts from Settings -->
    @if ($blade_settings['footer_scripts'] ?? false)
        {!! $blade_settings['footer_scripts'] !!}
    @endif
</body>

</html>

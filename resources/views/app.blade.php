<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title inertia>{{ $blade_settings['site_name'] ?? config('app.name', 'Laravel') }}</title>

    {{-- Dynamic Meta Tags --}}
    <meta name="description" content="{{ $blade_settings['site_description'] ?? '' }}">

    {{-- Google Tag Manager --}}
    @if ($blade_settings['tracking']['google_tag_manager']['enabled'] ?? false)
        <script>
            (function(w, d, s, l, i) {
                w[l] = w[l] || [];
                w[l].push({
                    'gtm.start': new Date().getTime(),
                    event: 'gtm.js'
                });
                var f = d.getElementsByTagName(s)[0],
                    j = d.createElement(s),
                    dl = l != 'dataLayer' ? '&l=' + l : '';
                j.async = true;
                j.src =
                    'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
                f.parentNode.insertBefore(j, f);
            })(window, document, 'script', 'dataLayer', '{{ $blade_settings['tracking']['google_tag_manager']['id'] }}');
        </script>
    @endif

    {{-- Facebook Pixel --}}
    @if ($blade_settings['tracking']['facebook_pixel']['enabled'] ?? false)
        <script>
            ! function(f, b, e, v, n, t, s) {
                if (f.fbq) return;
                n = f.fbq = function() {
                    n.callMethod ?
                        n.callMethod.apply(n, arguments) : n.queue.push(arguments)
                };
                if (!f._fbq) f._fbq = n;
                n.push = n;
                n.loaded = !0;
                n.version = '2.0';
                n.queue = [];
                t = b.createElement(e);
                t.async = !0;
                t.src = v;
                s = b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t, s)
            }(window, document, 'script',
                'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '{{ $blade_settings['tracking']['facebook_pixel']['id'] }}');
            fbq('track', 'PageView');
        </script>
    @endif

    {{-- Google AdSense --}}
    @if ($blade_settings['tracking']['google_adsense']['enabled'] ?? false)
        <script async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client={{ $blade_settings['tracking']['google_adsense']['id'] }}"
            crossorigin="anonymous"></script>
    @endif

    {{-- Custom Header Scripts --}}
    @if ($blade_settings['header_scripts'] ?? null)
        {!! $blade_settings['header_scripts'] !!}
    @endif

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    <!-- Scripts -->
    @routes
    @viteReactRefresh
    @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
    @inertiaHead
</head>

<body class="font-sans antialiased">
    {{-- Google Tag Manager (noscript) --}}
    @if ($blade_settings['tracking']['google_tag_manager']['enabled'] ?? false)
        <noscript><iframe
                src="https://www.googletagmanager.com/ns.html?id={{ $blade_settings['tracking']['google_tag_manager']['id'] }}"
                height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    @endif

    {{-- Custom Body Scripts --}}
    @if ($blade_settings['body_scripts'] ?? null)
        {!! $blade_settings['body_scripts'] !!}
    @endif

    @inertia

    {{-- Custom Footer Scripts --}}
    @if ($blade_settings['footer_scripts'] ?? null)
        {!! $blade_settings['footer_scripts'] !!}
    @endif
</body>

</html>

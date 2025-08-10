<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title inertia>{{ config('app.name', 'E-911') }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link rel="icon" href="/images/logs.ico" />
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />
    <link rel="canonical" href="https://https://demo.themesberg.com/landwind/" />
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">

    <!-- Meta SEO -->
    <meta name="title" content=" Online E-911">
    <meta name="description" content="E-911,  Online 911, Realtime 911, Submit 911 online,  to PNP realtime 911, Submit 911 online, 911 online database,  Database,  transactions,  Records .">
    <meta name="keywords" content=" E-911,  Online 911, Realtime 911, Submit 911 online,  to PNP realtime 911, Submit 911 online, 911 online database,  Database,  transactions,  Records, Online  911 transactions,">
    <meta name="robots" content="index, follow">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="language" content="English">
    <meta name="author" content="Themesberg">

    <!-- Social media share -->
    <meta property="og:title" content="e911@gmail.com">
    <meta property="og:site_name" content=" E-911">
    <meta property="og:url" content="https://e-911.com">
    <meta property="og:description" content="E-911,  Online 911, Realtime 911, Submit 911 online,  to PNP realtime 911, Submit 911 online, 911 online database,  Database,  transactions,  Records .">

    <!-- Favicon -->
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="manifest" href="/site.webmanifest">
    <meta name="msapplication-TileColor" content="#da532c">
    <meta name="theme-color" content="#ffffff">
    <link href="./output.css" rel="stylesheet">
    <script async defer src="https://buttons.github.io/buttons.js"></script>
    <!-- Hotjar Tracking Code for Site 5054461 (name missing) 
    <script>
        (function(h, o, t, j, a, r) {
            h.hj = h.hj || function() {
                (h.hj.q = h.hj.q || []).push(arguments)
            };
            h._hjSettings = {
                hjid: 5054461,
                hjsv: 6
            };
            a = o.getElementsByTagName('head')[0];
            r = o.createElement('script');
            r.async = 1;
            r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
            a.appendChild(r);
        })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');
    </script> -->

    <!-- Scripts -->
    @routes
    @viteReactRefresh
    @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.tsx"])
    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title inertia>{{ config('app.name', 'E-911') }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link rel="icon" href="/images/logo/e-blotter.ico" />
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">

    <!-- Meta SEO -->
    <meta name="title" content="Barangay e-Blotter System">
    <meta name="description" content="A web and mobile browser-based application that harmonizes barangay crime records with those of the local PNP — a joint initiative of NAPOLCOM Region VI and the PNP Antique Provincial Office.">
    <meta name="keywords" content="Barangay e-Blotter, barangay blotter, blotter system, NAPOLCOM Region VI, PNP Antique, crime incident reporting, Antique, barangay incident report">
    <meta name="robots" content="index, follow">
    <meta name="language" content="English">

    <!-- Social media share -->
    <meta property="og:title" content="Barangay e-Blotter System">
    <meta property="og:site_name" content="Barangay e-Blotter">
    <meta property="og:type" content="website">
    <meta property="og:description" content="Harmonizing barangay crime records with those of the local PNP — for accurate crime data, timely intervention, and evidence-based policy making.">

    <!-- Favicon -->
    <link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png">
    <meta name="msapplication-TileColor" content="#da532c">
    <meta name="theme-color" content="#ffffff">
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
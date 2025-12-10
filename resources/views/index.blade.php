<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Laravel') }} {{ isset($title) ? $title : '' }}</title>
    <meta name="description" content="{{ config('variables.templateDescription') ? config('variables.templateDescription') : '' }}" />
    <meta name="keywords" content="{{ config('variables.templateKeyword') ? config('variables.templateKeyword') : '' }}">
    <meta name="author" content="Maulana Kevin Pradana" />
    <meta name="theme-color" content="#283144" />
    <!-- Mendeklarasikan ikon untuk iOS -->
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <meta name="apple-mobile-web-app-title" content="{{ config('variables.templateName') }}" />
    <link rel="apple-touch-icon" href="{{ asset('logo/128x128.png') }}" />
    <!-- Mendeklarasikan ikon untuk Windows -->
    <meta name="msapplication-TileImage" content="{{ asset('logo/128x128.png') }}" />
    <meta name="msapplication-TileColor" content="#ffffff" />
    <meta name="current-url" content="{{ url()->current() }}" />
    <meta name="base-url" content="{{ url('') }}" />
    <meta name="csrf-token" content="{{ csrf_token() }}" />
    <link rel="manifest" href="{{ asset('/manifest.json') }}">
    <!--S:fb meta-->
    <meta property="og:type" content="article" />
    <meta property="og:url" content="{{ url()->current() }}" />
    <meta property="og:title" content="{{ isset($title) ? $title : '' }} | {{ config('variables.templateName') ? config('variables.templateName') : 'TemplateName' }} - {{ config('variables.templateSuffix') ? config('variables.templateSuffix') : 'TemplateSuffix' }}" />
    <meta property="og:description" content="{{ isset($description) ? $description : '' }}" />
    <meta property="og:site_name" content="{{ config('variables.templateName') }}" />
    <meta property="og:image" content="{{ isset($image) ? $image : asset('logo/128x128.png') }}" />
    <meta property="og:image:alt" content="{{ isset($title) ? $title : '' }} | {{ config('variables.templateName') ? config('variables.templateName') : 'TemplateName' }} - {{ config('variables.templateSuffix') ? config('variables.templateSuffix') : 'TemplateSuffix' }}" />
    <meta property="fb:admins" content="10208322639923490" />
    <meta property="fb:app_id" content="829371137173499" />
    <!-- e:fb meta -->
    <!-- S:tweeter card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@mahaghora" />
    <meta name="twitter:site:id" content="@mahaghora" />
    <meta name="twitter:creator" content="@mahaghora">
    <meta name="twitter:title" content="@yield('title') | {{ config('variables.templateName') ? config('variables.templateName') : 'TemplateName' }} - {{ config('variables.templateSuffix') ? config('variables.templateSuffix') : 'TemplateSuffix' }}" />
    <meta name="twitter:description" content="@yield('description', config('variables.templateDescription'))" />
    <meta name="twitter:image" content="@yield('img', asset('logo/128x128.png'))" />
    <!-- E:tweeter card -->
    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="{{ asset('/favicon.ico') }}" />
</head>

<body>
    <div id="root"></div>
    @viteReactRefresh
    @vite(['resources/js/app.jsx'])
</body>

</html>

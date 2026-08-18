<?php

if (!function_exists('public_asset')) {
    function public_asset($path)
    {
        $prefix = env('PUBLIC_PATH', '/');
        // Clean paths: ensure prefix ends with / and path doesn't start with /
        $prefix = rtrim($prefix, '/') . '/';
        $path = ltrim($path, '/');
        return $prefix . $path;
    }
}

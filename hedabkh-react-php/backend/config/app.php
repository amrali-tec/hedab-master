<?php

declare(strict_types=1);

return [
    'name' => $_ENV['APP_NAME'] ?? 'hedabkh-react-php',
    'env' => $_ENV['APP_ENV'] ?? 'development',
    'debug' => filter_var($_ENV['APP_DEBUG'] ?? true, FILTER_VALIDATE_BOOLEAN),
    'url' => $_ENV['APP_URL'] ?? 'http://localhost',
    'api_prefix' => $_ENV['API_PREFIX'] ?? '/api/v1',
    'timezone' => 'Asia/Riyadh',
    
    // Security & CORS
    'cors' => [
        'allowed_origins' => array_filter(
            array_map('trim', explode(',', $_ENV['CORS_ALLOWED_ORIGINS'] ?? 'http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000,http://127.0.0.1:3001'))
        ),
        'allowed_methods' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        'allowed_headers' => ['Content-Type', 'Authorization', 'X-Requested-With', 'X-CSRF-Token', 'Accept', 'Origin'],
        'allow_credentials' => true,
        'max_age' => 86400,
    ],

    'security_headers' => [
        'X-Content-Type-Options' => 'nosniff',
        'X-Frame-Options' => 'SAMEORIGIN',
        'Referrer-Policy' => 'strict-origin-when-cross-origin',
        'Permissions-Policy' => 'camera=(), microphone=(), geolocation=()',
        'Cache-Control' => 'no-store, no-cache, must-revalidate, max-age=0, proxy-revalidate',
        'Pragma' => 'no-cache',
        'Expires' => '0',
        'Surrogate-Control' => 'no-store',
    ],

    'session' => [
        'cookie_name' => $_ENV['SESSION_COOKIE_NAME'] ?? 'HEDABKH_SESSID',
        'lifetime_minutes' => (int) ($_ENV['SESSION_LIFETIME_MINUTES'] ?? 120),
        'secure' => filter_var($_ENV['SESSION_SECURE_COOKIE'] ?? false, FILTER_VALIDATE_BOOLEAN),
        'same_site' => $_ENV['SESSION_SAME_SITE'] ?? 'Lax',
        'path' => '/',
    ],

    'storage' => [
        'base_path' => dirname(__DIR__) . '/storage',
        'logs_path' => dirname(__DIR__) . '/storage/logs',
        'cache_path' => dirname(__DIR__) . '/storage/cache',
    ],
];

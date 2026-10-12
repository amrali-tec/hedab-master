<?php

declare(strict_types=1);

use Hedabkh\Backend\Controllers\HealthController;
use Hedabkh\Backend\Router\Router;

/** @var Router $router */

// API Root Status Endpoint
$router->get('/', function () {
    return [
        'name' => 'HEDABKH Corporate REST API',
        'status' => 'online',
        'version' => '1.0.0',
        'api_version' => 'v1',
        'timestamp' => date('c'),
    ];
});

// Health & Diagnostic Endpoint
$router->get('/health', [HealthController::class, 'check']);

// Version info endpoint
$router->get('/version', function () {
    return [
        'version' => '1.0.0',
        'api_version' => 'v1',
        'name' => 'HEDABKH Corporate REST API',
    ];
});

// Load Public and Admin Route Definitions
require_once __DIR__ . '/public.php';
require_once __DIR__ . '/admin.php';

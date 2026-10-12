<?php

declare(strict_types=1);

/**
 * HEDABKH Corporate Portal - REST API Public Gateway
 * PHP 8.2+ Native Entry Point
 */

use Hedabkh\Backend\Core\Application;
use Hedabkh\Backend\Http\Request;

define('HEDABKH_START', microtime(true));

// Resolve backend path across standard Hostinger private topology or local layout
if (file_exists(dirname(__DIR__, 2) . '/hedabkh_private/backend/src/Core/Application.php')) {
    define('HEDABKH_BASE_PATH', dirname(__DIR__, 2) . '/hedabkh_private/backend');
} elseif (file_exists(dirname(__DIR__) . '/hedabkh_private/backend/src/Core/Application.php')) {
    define('HEDABKH_BASE_PATH', dirname(__DIR__) . '/hedabkh_private/backend');
} elseif (file_exists(dirname(__DIR__) . '/backend/src/Core/Application.php')) {
    define('HEDABKH_BASE_PATH', dirname(__DIR__) . '/backend');
} else {
    define('HEDABKH_BASE_PATH', dirname(__DIR__));
}

try {
    // 1. Register Native PSR-4 Autoloader
    require_once HEDABKH_BASE_PATH . '/src/Core/Application.php';
    Application::registerAutoloader(HEDABKH_BASE_PATH . '/src');

    // 2. Instantiate and Bootstrap Application
    $app = new Application(HEDABKH_BASE_PATH);
    $app->bootstrap();

    // 3. Capture Request and Dispatch
    $request = Request::capture();
    $response = $app->handle($request);

    // 4. Send Response
    $response->send();
} catch (\Throwable $e) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'success' => false,
        'error' => [
            'code' => 'BOOTSTRAP_ERROR',
            'message' => $e->getMessage(),
            'file' => basename($e->getFile()) . ':' . $e->getLine()
        ]
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

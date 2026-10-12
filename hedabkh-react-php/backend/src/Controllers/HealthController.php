<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Controllers;

use Hedabkh\Backend\Core\Config;
use Hedabkh\Backend\Database\DatabaseManager;
use Hedabkh\Backend\Http\JsonResponse;
use Hedabkh\Backend\Http\Request;
use Hedabkh\Backend\Http\Response;

class HealthController
{
    public function check(Request $request): Response
    {
        $dbConnected = DatabaseManager::isConnected();

        $data = [
            'status' => $dbConnected ? 'ok' : 'degraded',
            'application' => Config::get('app.name', 'hedabkh-react-php'),
            'environment' => Config::get('app.env', 'development'),
            'php_version' => PHP_VERSION,
            'database' => $dbConnected ? 'connected' : 'unavailable',
            'timestamp' => gmdate('Y-m-d\TH:i:s\Z'),
        ];

        if (!$dbConnected) {
            return JsonResponse::error(
                'Database connection is unavailable.',
                'DATABASE_UNAVAILABLE',
                $data,
                503
            );
        }

        return JsonResponse::success($data);
    }
}

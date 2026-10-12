<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Middleware;

use Hedabkh\Backend\Core\Config;
use Hedabkh\Backend\Http\HttpException;
use Hedabkh\Backend\Http\JsonResponse;
use Hedabkh\Backend\Http\Request;
use Hedabkh\Backend\Http\Response;

class ErrorHandlerMiddleware implements MiddlewareInterface
{
    public function handle(Request $request, callable $next): Response
    {
        try {
            return $next($request);
        } catch (HttpException $e) {
            return JsonResponse::error(
                $e->getMessage(),
                $e->getErrorCode(),
                $e->getDetails(),
                $e->getStatusCode()
            );
        } catch (\Throwable $e) {
            $this->logException($e, $request);

            $debug = Config::get('app.debug', true);
            $message = $e->getMessage() ?: 'An internal server error occurred.';
            $details = [
                'exception' => get_class($e),
                'file' => basename($e->getFile()) . ':' . $e->getLine(),
            ];

            return JsonResponse::error(
                $message,
                'INTERNAL_SERVER_ERROR',
                $details,
                500
            );
        }
    }

    private function logException(\Throwable $e, Request $request): void
    {
        $logsPath = Config::get('app.storage.logs_path', dirname(__DIR__, 2) . '/storage/logs');
        if (!is_dir($logsPath)) {
            @mkdir($logsPath, 0755, true);
        }

        $logFile = $logsPath . '/error-' . date('Y-m-d') . '.log';
        $timestamp = date('Y-m-d H:i:s');
        $ip = $request->getClientIp();
        $method = $request->getMethod();
        $uri = $request->getUri();

        $logMessage = sprintf(
            "[%s] [%s] %s %s | %s: %s in %s:%d\nStack Trace:\n%s\n---\n",
            $timestamp,
            $ip,
            $method,
            $uri,
            get_class($e),
            $e->getMessage(),
            $e->getFile(),
            $e->getLine(),
            $e->getTraceAsString()
        );

        @file_put_contents($logFile, $logMessage, FILE_APPEND | LOCK_EX);
    }
}

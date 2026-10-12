<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Middleware;

use Hedabkh\Backend\Http\HttpException;
use Hedabkh\Backend\Http\Request;
use Hedabkh\Backend\Http\Response;

class RateLimitMiddleware implements MiddlewareInterface
{
    private int $maxAttempts;
    private int $decaySeconds;
    private string $storagePath;

    public function __construct(int $maxAttempts = 30, int $decaySeconds = 60)
    {
        $this->maxAttempts = $maxAttempts;
        $this->decaySeconds = $decaySeconds;
        $this->storagePath = dirname(__DIR__, 2) . '/storage/cache/ratelimit';
        if (!is_dir($this->storagePath)) {
            @mkdir($this->storagePath, 0775, true);
        }
    }

    public function handle(Request $request, callable $next): Response
    {
        $ip = $request->getClientIp() ?: '127.0.0.1';
        $route = $request->getPath();
        $method = $request->getMethod();

        // Specific limits for sensitive routes
        $limit = $this->maxAttempts;
        if (str_ends_with($route, '/auth/login') && $method === 'POST') {
            $limit = 15; // 15 login attempts / min
        } elseif (str_ends_with($route, '/inquiries') && $method === 'POST') {
            $limit = 10; // 10 inquiry submissions / min
        }

        $key = md5("{$ip}_{$route}_{$method}");
        $file = $this->storagePath . '/' . $key . '.json';

        $now = time();
        $attempts = 0;
        $resetAt = $now + $this->decaySeconds;

        if (file_exists($file)) {
            $data = json_decode((string)@file_get_contents($file), true) ?: [];
            if (isset($data['reset_at']) && $data['reset_at'] > $now) {
                $attempts = (int) ($data['attempts'] ?? 0);
                $resetAt = (int) $data['reset_at'];
            }
        }

        if ($attempts >= $limit) {
            $retryAfter = max(1, $resetAt - $now);
            throw new HttpException(
                429,
                'Too many requests. Please slow down and try again later.',
                'TOO_MANY_REQUESTS',
                ['retry_after_seconds' => $retryAfter]
            );
        }

        $attempts++;
        if (is_dir($this->storagePath) && is_writable($this->storagePath)) {
            @file_put_contents($file, json_encode([
                'attempts' => $attempts,
                'reset_at' => $resetAt
            ]), LOCK_EX);
        }

        /** @var Response $response */
        $response = $next($request);
        $response->setHeader('X-RateLimit-Limit', (string) $limit);
        $response->setHeader('X-RateLimit-Remaining', (string) max(0, $limit - $attempts));
        $response->setHeader('X-RateLimit-Reset', (string) $resetAt);

        return $response;
    }
}

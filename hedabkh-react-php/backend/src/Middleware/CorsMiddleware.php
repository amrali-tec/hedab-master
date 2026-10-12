<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Middleware;

use Hedabkh\Backend\Core\Config;
use Hedabkh\Backend\Http\Request;
use Hedabkh\Backend\Http\Response;

class CorsMiddleware implements MiddlewareInterface
{
    public function handle(Request $request, callable $next): Response
    {
        $origin = $request->getHeader('origin', '');
        $allowedOrigins = Config::get('app.cors.allowed_origins', []);
        $allowedMethods = Config::get('app.cors.allowed_methods', ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']);
        $allowedHeaders = Config::get('app.cors.allowed_headers', ['Content-Type', 'Authorization', 'X-Requested-With', 'X-CSRF-Token', 'Accept', 'Origin']);
        $allowCredentials = Config::get('app.cors.allow_credentials', true);
        $maxAge = Config::get('app.cors.max_age', 86400);

        $matchedOrigin = null;
        if (in_array('*', $allowedOrigins, true)) {
            $matchedOrigin = $origin ?: '*';
        } elseif ($origin !== '' && in_array($origin, $allowedOrigins, true)) {
            $matchedOrigin = $origin;
        } elseif (empty($allowedOrigins)) {
            $matchedOrigin = $origin ?: '*';
        }

        // Handle preflight OPTIONS request
        if ($request->getMethod() === 'OPTIONS') {
            $response = new Response('', 204);
            $this->applyCorsHeaders($response, $matchedOrigin, $allowedMethods, $allowedHeaders, $allowCredentials, $maxAge);
            return $response;
        }

        $response = $next($request);
        $this->applyCorsHeaders($response, $matchedOrigin, $allowedMethods, $allowedHeaders, $allowCredentials, $maxAge);

        return $response;
    }

    private function applyCorsHeaders(
        Response $response,
        ?string $origin,
        array $methods,
        array $headers,
        bool $credentials,
        int $maxAge
    ): void {
        if ($origin !== null) {
            $response->setHeader('Access-Control-Allow-Origin', $origin);
            if ($credentials && $origin !== '*') {
                $response->setHeader('Access-Control-Allow-Credentials', 'true');
            }
        }

        $response->setHeader('Access-Control-Allow-Methods', implode(', ', $methods));
        $response->setHeader('Access-Control-Allow-Headers', implode(', ', $headers));
        $response->setHeader('Access-Control-Max-Age', (string) $maxAge);
    }
}

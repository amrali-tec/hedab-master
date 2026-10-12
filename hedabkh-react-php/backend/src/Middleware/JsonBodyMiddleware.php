<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Middleware;

use Hedabkh\Backend\Http\HttpException;
use Hedabkh\Backend\Http\Request;
use Hedabkh\Backend\Http\Response;

class JsonBodyMiddleware implements MiddlewareInterface
{
    public function handle(Request $request, callable $next): Response
    {
        $contentType = $request->getHeader('content-type', '');
        $rawBody = $request->getRawBody();

        if ($rawBody !== '' && str_contains(strtolower($contentType), 'application/json')) {
            $parsed = json_decode($rawBody, true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                throw HttpException::badRequest(
                    'Malformed JSON payload provided: ' . json_last_error_msg(),
                    'INVALID_JSON'
                );
            }
            if (is_array($parsed)) {
                $request->setParsedBody($parsed);
            }
        }

        return $next($request);
    }
}

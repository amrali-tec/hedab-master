<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Security;

use Hedabkh\Backend\Core\Config;
use Hedabkh\Backend\Http\Request;
use Hedabkh\Backend\Http\Response;
use Hedabkh\Backend\Middleware\MiddlewareInterface;

class SecurityHeaders implements MiddlewareInterface
{
    public function handle(Request $request, callable $next): Response
    {
        $response = $next($request);
        $headers = Config::get('app.security_headers', []);

        foreach ($headers as $name => $value) {
            $response->setHeader($name, $value);
        }

        return $response;
    }
}

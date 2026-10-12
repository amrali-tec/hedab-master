<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Middleware;

use Hedabkh\Backend\Http\Request;
use Hedabkh\Backend\Http\Response;

interface MiddlewareInterface
{
    /**
     * Process an incoming request and return a response.
     *
     * @param Request $request
     * @param callable(Request): Response $next
     * @return Response
     */
    public function handle(Request $request, callable $next): Response;
}

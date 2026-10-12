<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Middleware;

use Hedabkh\Backend\Http\HttpException;
use Hedabkh\Backend\Http\Request;
use Hedabkh\Backend\Http\Response;
use Hedabkh\Backend\Services\AdminAuthService;

class AuthMiddleware implements MiddlewareInterface
{
    private AdminAuthService $authService;

    public function __construct(AdminAuthService $authService)
    {
        $this->authService = $authService;
    }

    public function handle(Request $request, callable $next): Response
    {
        $user = $this->authService->validateSession();
        if (!$user) {
            throw HttpException::unauthorized('Authentication required to access administrative resource.', 'UNAUTHORIZED');
        }

        $request->setUser($user);
        return $next($request);
    }
}

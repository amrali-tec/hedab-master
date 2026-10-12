<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Middleware;

use Hedabkh\Backend\Http\HttpException;
use Hedabkh\Backend\Http\Request;
use Hedabkh\Backend\Http\Response;

class PermissionMiddleware implements MiddlewareInterface
{
    private string $permissionKey;

    public function __construct(string $permissionKey)
    {
        $this->permissionKey = $permissionKey;
    }

    public function handle(Request $request, callable $next): Response
    {
        $user = $request->getUser();
        if (!$user) {
            throw HttpException::unauthorized('Authentication required.', 'UNAUTHORIZED');
        }

        // Super admin bypasses all permission checks
        if (($user['role'] ?? '') === 'super_admin') {
            return $next($request);
        }

        $permissions = $user['permissions'] ?? [];
        if (!in_array($this->permissionKey, $permissions, true)) {
            throw HttpException::forbidden("Forbidden: missing required permission [{$this->permissionKey}].", 'FORBIDDEN');
        }

        return $next($request);
    }
}

<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Controllers\Admin;

use Hedabkh\Backend\Http\JsonResponse;
use Hedabkh\Backend\Http\Request;
use Hedabkh\Backend\Services\AdminAuthService;
use Hedabkh\Backend\Validation\RequestValidator;

class AdminAuthController
{
    private AdminAuthService $authService;

    public function __construct(AdminAuthService $authService)
    {
        $this->authService = $authService;
    }

    public function login(Request $request): JsonResponse
    {
        $body = $request->getBody();
        RequestValidator::validate($body, [
            'email' => 'required|email',
            'password' => 'required|string|min:4'
        ]);

        $ip = $request->getClientIp();
        $userProfile = $this->authService->login($body['email'], $body['password'], $ip);

        return JsonResponse::success(['user' => $userProfile]);
    }

    public function session(Request $request): JsonResponse
    {
        $user = $this->authService->validateSession();
        if (!$user) {
            return JsonResponse::error('Session expired or invalid.', 'UNAUTHORIZED', [], 401);
        }

        return JsonResponse::success(['user' => $user]);
    }

    public function logout(Request $request): JsonResponse
    {
        $this->authService->logout();
        return JsonResponse::success(['message' => 'Logged out successfully']);
    }
}

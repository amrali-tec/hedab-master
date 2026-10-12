<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Services;

use Hedabkh\Backend\Database\Repositories\AdminActivityLogRepository;
use Hedabkh\Backend\Database\Repositories\AdminUserRepository;
use Hedabkh\Backend\Http\HttpException;

class AdminAuthService
{
    private AdminUserRepository $userRepo;
    private AdminActivityLogRepository $logRepo;

    public function __construct(AdminUserRepository $userRepo, AdminActivityLogRepository $logRepo)
    {
        $this->userRepo = $userRepo;
        $this->logRepo = $logRepo;
    }

    public function login(string $email, string $password, ?string $ip = null): array
    {
        if (empty($email) || empty($password)) {
            throw HttpException::badRequest('Email and password are required.', 'INVALID_CREDENTIALS');
        }

        $user = $this->userRepo->findByEmail($email);
        if (!$user) {
            throw HttpException::unauthorized('Invalid email or password.', 'INVALID_CREDENTIALS');
        }

        if ($user['status'] !== 'active') {
            throw HttpException::forbidden('This administrative account is suspended.', 'ACCOUNT_SUSPENDED');
        }

        if (!password_verify($password, $user['password_hash'])) {
            throw HttpException::unauthorized('Invalid email or password.', 'INVALID_CREDENTIALS');
        }

        // Fetch permissions
        $userWithPerms = $this->userRepo->getUserWithPermissions($user['id']);

        // Start session if not started with secure params
        $this->startSession();
        $_SESSION['admin_user_id'] = $user['id'];
        $_SESSION['admin_user_role'] = $user['role'];

        // Record activity log
        $this->logRepo->log($user['id'], 'status_change', 'admin_users', $user['id'], ['email' => $email], $ip, $user['name'], 'Admin Login: ' . $email);

        return $this->formatUserProfile($userWithPerms);
    }

    public function validateSession(): ?array
    {
        $this->startSession();

        $userId = $_SESSION['admin_user_id'] ?? null;
        if (!$userId) {
            return null;
        }

        $user = $this->userRepo->getUserWithPermissions((string) $userId);
        if (!$user || $user['status'] !== 'active') {
            $this->logout();
            return null;
        }

        return $this->formatUserProfile($user);
    }

    public function logout(): void
    {
        $this->startSession();

        $_SESSION = [];
        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000,
                $params["path"], $params["domain"],
                $params["secure"], $params["httponly"]
            );
        }
        session_destroy();
    }

    private function startSession(): void
    {
        if (session_status() === PHP_SESSION_NONE) {
            $sessConfig = \Hedabkh\Backend\Core\Config::get('app.session', []);
            $isHttps = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
                || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https')
                || (bool) ($sessConfig['secure'] ?? false);

            session_set_cookie_params([
                'lifetime' => ($sessConfig['lifetime_minutes'] ?? 120) * 60,
                'path' => $sessConfig['path'] ?? '/',
                'domain' => '',
                'secure' => $isHttps,
                'httponly' => true,
                'samesite' => $sessConfig['same_site'] ?? 'Lax'
            ]);
            @session_start();
        }
    }

    public function formatUserProfile(array $user): array
    {
        return [
            'id' => $user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'role' => $user['role'],
            'avatar' => $user['avatar'] ?? '/images/avatars/admin-avatar.jpg',
            'phone' => $user['phone'] ?? null,
            'status' => $user['status'],
            'permissions' => $user['permissions'] ?? [],
            'lastLogin' => date('Y-m-d\TH:i:s\Z')
        ];
    }
}

<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Controllers\Admin;

use Hedabkh\Backend\Database\Repositories\AdminPermissionRepository;
use Hedabkh\Backend\Database\Repositories\AdminUserRepository;
use Hedabkh\Backend\Http\HttpException;
use Hedabkh\Backend\Http\JsonResponse;
use Hedabkh\Backend\Http\Request;
use Hedabkh\Backend\Validation\RequestValidator;

class AdminUserController
{
    private AdminUserRepository $userRepo;
    private AdminPermissionRepository $permRepo;

    public function __construct(AdminUserRepository $userRepo, AdminPermissionRepository $permRepo)
    {
        $this->userRepo = $userRepo;
        $this->permRepo = $permRepo;
    }

    public function index(Request $request): JsonResponse
    {
        $users = $this->userRepo->findAll();
        $safeUsers = array_map(function ($u) {
            unset($u['password_hash']);
            $u['permissions'] = $this->permRepo->getPermissionsForUser($u['id']);
            return $u;
        }, $users);

        return JsonResponse::success($safeUsers);
    }

    public function store(Request $request): JsonResponse
    {
        $body = $request->getBody();
        RequestValidator::validate($body, [
            'email' => 'required|email',
            'name' => 'required|string|min:3',
            'password' => 'required|string|min:6',
            'role' => 'required|in:super_admin,project_manager,quality_officer,inquiries_manager,content_editor'
        ]);

        if ($this->userRepo->findByEmail($body['email'])) {
            throw HttpException::conflict("User with email [{$body['email']}] already exists.", 'EMAIL_EXISTS');
        }

        $id = $body['id'] ?? ('usr-' . bin2hex(random_bytes(4)));
        $record = [
            'id' => $id,
            'email' => $body['email'],
            'password_hash' => password_hash($body['password'], PASSWORD_BCRYPT, ['cost' => 12]),
            'name' => $body['name'],
            'role' => $body['role'],
            'avatar' => $body['avatar'] ?? '/images/avatars/admin-avatar.jpg',
            'phone' => $body['phone'] ?? null,
            'status' => $body['status'] ?? 'active',
            'created_at' => date('Y-m-d H:i:s')
        ];

        $this->userRepo->insert($record);

        if (!empty($body['permissions']) && is_array($body['permissions'])) {
            $this->permRepo->syncPermissions($id, $body['permissions']);
        }

        $user = $this->userRepo->getUserWithPermissions($id);
        unset($user['password_hash']);
        return JsonResponse::success($user, [], 201);
    }

    public function update(Request $request): JsonResponse
    {
        $id = (string) $request->getRouteParam('id');
        $body = $request->getBody();

        if (!$this->userRepo->exists($id)) {
            throw HttpException::notFound("User [{$id}] not found.", 'USER_NOT_FOUND');
        }

        $update = [];
        $allowed = ['name', 'role', 'avatar', 'phone', 'status'];
        foreach ($allowed as $f) {
            if (array_key_exists($f, $body)) {
                $update[$f] = $body[$f];
            }
        }
        if (!empty($body['password'])) {
            $update['password_hash'] = password_hash($body['password'], PASSWORD_BCRYPT, ['cost' => 12]);
        }

        if (!empty($update)) {
            $this->userRepo->update($id, $update);
        }

        if (isset($body['permissions']) && is_array($body['permissions'])) {
            $this->permRepo->syncPermissions($id, $body['permissions']);
        }

        $user = $this->userRepo->getUserWithPermissions($id);
        unset($user['password_hash']);
        return JsonResponse::success($user);
    }

    public function destroy(Request $request): JsonResponse
    {
        $id = (string) $request->getRouteParam('id');
        $currentUser = $request->getUser();
        if (($currentUser['id'] ?? '') === $id) {
            throw HttpException::badRequest('You cannot delete your own administrative account.', 'CANNOT_DELETE_SELF');
        }

        $this->userRepo->delete($id);
        return JsonResponse::success(['message' => "User [{$id}] deleted successfully."]);
    }
}

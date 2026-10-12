<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Database\Repositories;

use PDO;

class AdminUserRepository extends BaseRepository
{
    protected string $table = 'admin_users';

    public function findByEmail(string $email): ?array
    {
        $sql = "SELECT * FROM `admin_users` WHERE `email` = ? LIMIT 1";
        $stmt = $this->connection->getPdo()->prepare($sql);
        $stmt->execute([$email]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ?: null;
    }

    public function getUserWithPermissions(string $id): ?array
    {
        $user = $this->findById($id);
        if (!$user) return null;

        $sql = "SELECT `permission_key` FROM `admin_permissions` WHERE `user_id` = ?";
        $stmt = $this->connection->getPdo()->prepare($sql);
        $stmt->execute([$id]);
        $perms = $stmt->fetchAll(PDO::FETCH_COLUMN) ?: [];

        $user['permissions'] = $perms;
        return $user;
    }
}

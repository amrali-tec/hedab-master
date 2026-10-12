<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Database\Repositories;

use PDO;

class AdminPermissionRepository extends BaseRepository
{
    protected string $table = 'admin_permissions';

    public function getPermissionsForUser(string $userId): array
    {
        $sql = "SELECT `permission_key` FROM `admin_permissions` WHERE `user_id` = ?";
        $stmt = $this->connection->getPdo()->prepare($sql);
        $stmt->execute([$userId]);
        return $stmt->fetchAll(PDO::FETCH_COLUMN) ?: [];
    }

    public function syncPermissions(string $userId, array $permissions): void
    {
        $pdo = $this->connection->getPdo();
        $stmtDel = $pdo->prepare("DELETE FROM `admin_permissions` WHERE `user_id` = ?");
        $stmtDel->execute([$userId]);

        $stmtIns = $pdo->prepare("INSERT INTO `admin_permissions` (`user_id`, `permission_key`) VALUES (?, ?)");
        foreach ($permissions as $p) {
            if (!empty($p)) {
                $stmtIns->execute([$userId, (string) $p]);
            }
        }
    }
}

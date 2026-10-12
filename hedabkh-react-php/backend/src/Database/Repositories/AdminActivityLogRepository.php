<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Database\Repositories;

use PDO;

class AdminActivityLogRepository extends BaseRepository
{
    protected string $table = 'admin_activity_logs';

    public function getLogs(int $limit = 50, int $offset = 0): array
    {
        $sql = "SELECT l.*, u.`name` as `user_name`, u.`email` as `user_email`
                FROM `admin_activity_logs` l
                LEFT JOIN `admin_users` u ON l.`user_id` = u.`id`
                ORDER BY l.`created_at` DESC
                LIMIT " . (int) $limit . " OFFSET " . (int) $offset;
        $stmt = $this->connection->getPdo()->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
    }

    public function log(string $userId, string $action, string $entityType, ?string $entityId = null, ?array $details = null, ?string $ip = null, ?string $adminName = null, ?string $entityTitle = null): bool
    {
        $id = 'log-' . bin2hex(random_bytes(8));
        
        // Map action to allowed enum values: 'create', 'update', 'delete', 'status_change', 'publish', 'rollback'
        $allowedActions = ['create', 'update', 'delete', 'status_change', 'publish', 'rollback'];
        $actionLower = strtolower($action);
        if (!in_array($actionLower, $allowedActions, true)) {
            $actionLower = 'status_change';
        }

        $data = [
            'id' => $id,
            'user_id' => $userId,
            'admin_name' => $adminName ?? 'System Administrator',
            'action' => $actionLower,
            'entity_type' => $entityType,
            'entity_id' => $entityId ?? $id,
            'entity_title' => $entityTitle ?? ($entityType . ' activity'),
            'ip_address' => $ip,
            'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? null,
            'created_at' => date('Y-m-d H:i:s')
        ];
        return $this->insert($data);
    }
}

<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Database\Seeds;

use PDO;

class DatabaseSeeder
{
    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    /**
     * Seeds minimal development environment records.
     * Note: Full JSON migration is performed separately in Phase 2B.3.
     */
    public function run(): void
    {
        // 1. Seed initial admin user if not exists
        $stmt = $this->pdo->prepare("SELECT COUNT(*) FROM `admin_users` WHERE `email` = ?");
        $stmt->execute(['admin@hedabkh.com.sa']);
        if ((int) $stmt->fetchColumn() === 0) {
            $passwordHash = password_hash('admin123', PASSWORD_BCRYPT, ['cost' => 12]);
            $insertUser = $this->pdo->prepare("INSERT INTO `admin_users` (`id`, `email`, `password_hash`, `name`, `role`, `status`, `created_at`) VALUES (?, ?, ?, ?, ?, ?, NOW())");
            $insertUser->execute(['usr-admin-1', 'admin@hedabkh.com.sa', $passwordHash, 'المهندس المشرف العام', 'super_admin', 'active']);

            // Insert core permissions
            $permissions = [
                'projects_manage',
                'services_manage',
                'certificates_manage',
                'inquiries_view_reply',
                'statistics_manage',
                'team_manage',
                'settings_manage',
                'users_manage',
                'logs_view',
                'design_manage',
                'media_manage'
            ];

            $insertPerm = $this->pdo->prepare("INSERT INTO `admin_permissions` (`user_id`, `permission_key`) VALUES (?, ?)");
            foreach ($permissions as $perm) {
                $insertPerm->execute(['usr-admin-1', $perm]);
            }
        }
    }
}

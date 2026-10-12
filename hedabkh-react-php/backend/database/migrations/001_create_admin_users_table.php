<?php

declare(strict_types=1);

use Hedabkh\Backend\Database\Migration;

return new class extends Migration {
    protected string $description = 'Create admin_users table';

    public function up(PDO $db): void
    {
        $sql = "CREATE TABLE IF NOT EXISTS `admin_users` (
            `id` VARCHAR(64) NOT NULL,
            `email` VARCHAR(191) NOT NULL,
            `password_hash` VARCHAR(255) NOT NULL,
            `name` VARCHAR(191) NOT NULL,
            `role` ENUM('super_admin', 'project_manager', 'quality_officer', 'inquiries_manager', 'content_editor') NOT NULL DEFAULT 'project_manager',
            `avatar` VARCHAR(500) DEFAULT NULL,
            `phone` VARCHAR(64) DEFAULT NULL,
            `status` ENUM('active', 'inactive', 'suspended') NOT NULL DEFAULT 'active',
            `last_login_at` DATETIME DEFAULT NULL,
            `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`),
            UNIQUE KEY `uk_admin_users_email` (`email`),
            KEY `idx_admin_users_role_status` (`role`, `status`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";

        $db->exec($sql);
    }

    public function down(PDO $db): void
    {
        $db->exec("DROP TABLE IF EXISTS `admin_users`;");
    }
};

<?php

declare(strict_types=1);

use Hedabkh\Backend\Database\Migration;

return new class extends Migration {
    protected string $description = 'Create admin_activity_logs table';

    public function up(PDO $db): void
    {
        $sql = "CREATE TABLE IF NOT EXISTS `admin_activity_logs` (
            `id` VARCHAR(64) NOT NULL,
            `user_id` VARCHAR(64) DEFAULT NULL,
            `admin_name` VARCHAR(191) NOT NULL,
            `action` ENUM('create', 'update', 'delete', 'status_change', 'publish', 'rollback') NOT NULL,
            `entity_type` VARCHAR(64) NOT NULL,
            `entity_id` VARCHAR(64) NOT NULL,
            `entity_title` VARCHAR(255) NOT NULL,
            `ip_address` VARCHAR(45) DEFAULT NULL,
            `user_agent` VARCHAR(255) DEFAULT NULL,
            `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`),
            KEY `idx_logs_created_at` (`created_at`),
            KEY `idx_logs_entity` (`entity_type`, `entity_id`),
            CONSTRAINT `fk_logs_user` FOREIGN KEY (`user_id`) REFERENCES `admin_users` (`id`) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";

        $db->exec($sql);
    }

    public function down(PDO $db): void
    {
        $db->exec("DROP TABLE IF EXISTS `admin_activity_logs`;");
    }
};

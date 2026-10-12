<?php

declare(strict_types=1);

use Hedabkh\Backend\Database\Migration;

return new class extends Migration {
    protected string $description = 'Create admin_permissions table';

    public function up(PDO $db): void
    {
        $sql = "CREATE TABLE IF NOT EXISTS `admin_permissions` (
            `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            `user_id` VARCHAR(64) NOT NULL,
            `permission_key` VARCHAR(64) NOT NULL,
            PRIMARY KEY (`id`),
            UNIQUE KEY `uk_user_permission` (`user_id`, `permission_key`),
            CONSTRAINT `fk_admin_permissions_user` FOREIGN KEY (`user_id`) REFERENCES `admin_users` (`id`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";

        $db->exec($sql);
    }

    public function down(PDO $db): void
    {
        $db->exec("DROP TABLE IF EXISTS `admin_permissions`;");
    }
};

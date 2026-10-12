<?php

declare(strict_types=1);

use Hedabkh\Backend\Database\Migration;

return new class extends Migration {
    protected string $description = 'Create inquiries table';

    public function up(PDO $db): void
    {
        $sql = "CREATE TABLE IF NOT EXISTS `inquiries` (
            `id` VARCHAR(64) NOT NULL,
            `name` VARCHAR(191) NOT NULL,
            `email` VARCHAR(191) NOT NULL,
            `phone` VARCHAR(64) NOT NULL,
            `message` TEXT NOT NULL,
            `status` ENUM('new', 'in-progress', 'resolved') NOT NULL DEFAULT 'new',
            `notes` TEXT DEFAULT NULL,
            `ip_address` VARCHAR(45) DEFAULT NULL,
            `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`),
            KEY `idx_inquiries_status_created` (`status`, `created_at`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";

        $db->exec($sql);
    }

    public function down(PDO $db): void
    {
        $db->exec("DROP TABLE IF EXISTS `inquiries`;");
    }
};

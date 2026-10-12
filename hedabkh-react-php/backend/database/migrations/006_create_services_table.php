<?php

declare(strict_types=1);

use Hedabkh\Backend\Database\Migration;

return new class extends Migration {
    protected string $description = 'Create services table';

    public function up(PDO $db): void
    {
        $sql = "CREATE TABLE IF NOT EXISTS `services` (
            `id` VARCHAR(64) NOT NULL,
            `slug` VARCHAR(191) NOT NULL,
            `title_ar` VARCHAR(255) NOT NULL,
            `title_en` VARCHAR(255) NOT NULL,
            `description_ar` TEXT NOT NULL,
            `description_en` TEXT NOT NULL,
            `icon_key` VARCHAR(64) NOT NULL DEFAULT 'building-icon',
            `is_active` TINYINT(1) NOT NULL DEFAULT 1,
            `sort_order` INT NOT NULL DEFAULT 0,
            `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`),
            UNIQUE KEY `uk_services_slug` (`slug`),
            KEY `idx_services_sort` (`sort_order`, `is_active`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";

        $db->exec($sql);
    }

    public function down(PDO $db): void
    {
        $db->exec("DROP TABLE IF EXISTS `services`;");
    }
};

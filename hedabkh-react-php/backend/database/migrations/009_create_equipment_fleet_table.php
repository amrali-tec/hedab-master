<?php

declare(strict_types=1);

use Hedabkh\Backend\Database\Migration;

return new class extends Migration {
    protected string $description = 'Create equipment_fleet table';

    public function up(PDO $db): void
    {
        $sql = "CREATE TABLE IF NOT EXISTS `equipment_fleet` (
            `id` VARCHAR(64) NOT NULL,
            `name_ar` VARCHAR(255) NOT NULL,
            `name_en` VARCHAR(255) NOT NULL,
            `category_ar` VARCHAR(191) NOT NULL,
            `category_en` VARCHAR(191) NOT NULL,
            `model` VARCHAR(100) NOT NULL,
            `brand` VARCHAR(100) NOT NULL,
            `unit_count` SMALLINT UNSIGNED NOT NULL DEFAULT 1,
            `image_url` VARCHAR(500) NOT NULL,
            `is_active` TINYINT(1) NOT NULL DEFAULT 1,
            `sort_order` INT NOT NULL DEFAULT 0,
            `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`),
            KEY `idx_equipment_category` (`category_ar`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";

        $db->exec($sql);
    }

    public function down(PDO $db): void
    {
        $db->exec("DROP TABLE IF EXISTS `equipment_fleet`;");
    }
};

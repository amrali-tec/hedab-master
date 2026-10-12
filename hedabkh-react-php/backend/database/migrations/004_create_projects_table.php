<?php

declare(strict_types=1);

use Hedabkh\Backend\Database\Migration;

return new class extends Migration {
    protected string $description = 'Create projects table';

    public function up(PDO $db): void
    {
        $sql = "CREATE TABLE IF NOT EXISTS `projects` (
            `id` VARCHAR(64) NOT NULL,
            `slug` VARCHAR(191) NOT NULL,
            `title_ar` VARCHAR(255) NOT NULL,
            `title_en` VARCHAR(255) NOT NULL,
            `description_ar` TEXT NOT NULL,
            `description_en` TEXT NOT NULL,
            `category_ar` VARCHAR(191) NOT NULL,
            `category_en` VARCHAR(191) NOT NULL,
            `image_url` VARCHAR(500) NOT NULL,
            `site_prep_image` VARCHAR(500) DEFAULT NULL,
            `execution_phase_image` VARCHAR(500) DEFAULT NULL,
            `finalHandoverImage` VARCHAR(500) DEFAULT NULL,
            `completion_date` DATE NOT NULL,
            `location_ar` VARCHAR(191) NOT NULL,
            `location_en` VARCHAR(191) NOT NULL,
            `client_ar` VARCHAR(191) NOT NULL,
            `client_en` VARCHAR(191) NOT NULL,
            `progress_percent` TINYINT UNSIGNED NOT NULL DEFAULT 100,
            `is_featured` TINYINT(1) NOT NULL DEFAULT 0,
            `is_active` TINYINT(1) NOT NULL DEFAULT 1,
            `sort_order` INT NOT NULL DEFAULT 0,
            `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`),
            UNIQUE KEY `uk_projects_slug` (`slug`),
            KEY `idx_projects_category` (`category_ar`),
            KEY `idx_projects_featured_active` (`is_featured`, `is_active`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";

        $db->exec($sql);
    }

    public function down(PDO $db): void
    {
        $db->exec("DROP TABLE IF EXISTS `projects`;");
    }
};

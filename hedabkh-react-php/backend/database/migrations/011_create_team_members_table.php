<?php

declare(strict_types=1);

use Hedabkh\Backend\Database\Migration;

return new class extends Migration {
    protected string $description = 'Create team_members table';

    public function up(PDO $db): void
    {
        $sql = "CREATE TABLE IF NOT EXISTS `team_members` (
            `id` VARCHAR(64) NOT NULL,
            `name_ar` VARCHAR(191) NOT NULL,
            `name_en` VARCHAR(191) NOT NULL,
            `role_ar` VARCHAR(191) NOT NULL,
            `role_en` VARCHAR(191) NOT NULL,
            `bio_ar` TEXT NOT NULL,
            `bio_en` TEXT NOT NULL,
            `image_url` VARCHAR(500) NOT NULL,
            `sector` ENUM('PROJECTS', 'OPERATIONS', 'QUALITY') NOT NULL DEFAULT 'PROJECTS',
            `badge_ar` VARCHAR(100) NOT NULL,
            `badge_en` VARCHAR(100) NOT NULL,
            `experience_ar` VARCHAR(100) NOT NULL,
            `experience_en` VARCHAR(100) NOT NULL,
            `email` VARCHAR(191) DEFAULT NULL,
            `phone` VARCHAR(64) DEFAULT NULL,
            `is_active` TINYINT(1) NOT NULL DEFAULT 1,
            `sort_order` INT NOT NULL DEFAULT 0,
            `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`),
            KEY `idx_team_sector` (`sector`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";

        $db->exec($sql);
    }

    public function down(PDO $db): void
    {
        $db->exec("DROP TABLE IF EXISTS `team_members`;");
    }
};

<?php

declare(strict_types=1);

use Hedabkh\Backend\Database\Migration;

return new class extends Migration {
    protected string $description = 'Create timeline_milestones table';

    public function up(PDO $db): void
    {
        $sql = "CREATE TABLE IF NOT EXISTS `timeline_milestones` (
            `id` VARCHAR(64) NOT NULL,
            `year_label_ar` VARCHAR(50) NOT NULL,
            `year_label_en` VARCHAR(50) NOT NULL,
            `title_ar` VARCHAR(255) NOT NULL,
            `title_en` VARCHAR(255) NOT NULL,
            `description_ar` TEXT NOT NULL,
            `description_en` TEXT NOT NULL,
            `color_card` VARCHAR(50) NOT NULL DEFAULT '14, 165, 233',
            `color_ring` VARCHAR(50) NOT NULL DEFAULT '#0284c7',
            `sort_order` INT NOT NULL DEFAULT 0,
            `is_active` TINYINT(1) NOT NULL DEFAULT 1,
            `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`),
            KEY `idx_timeline_sort` (`sort_order`, `is_active`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";

        $db->exec($sql);
    }

    public function down(PDO $db): void
    {
        $db->exec("DROP TABLE IF EXISTS `timeline_milestones`;");
    }
};

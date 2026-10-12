<?php

declare(strict_types=1);

use Hedabkh\Backend\Database\Migration;

return new class extends Migration {
    protected string $description = 'Create coverage_regions table';

    public function up(PDO $db): void
    {
        $sql = "CREATE TABLE IF NOT EXISTS `coverage_regions` (
            `id` VARCHAR(64) NOT NULL,
            `name_ar` VARCHAR(191) NOT NULL,
            `name_en` VARCHAR(191) NOT NULL,
            `active_projects_count` INT UNSIGNED NOT NULL DEFAULT 0,
            `coverage_ar` TEXT NOT NULL,
            `coverage_en` TEXT NOT NULL,
            `headquarters_ar` VARCHAR(255) NOT NULL,
            `headquarters_en` VARCHAR(255) NOT NULL,
            `fleet_count_label` VARCHAR(100) NOT NULL,
            `status` VARCHAR(50) NOT NULL DEFAULT 'active',
            `sort_order` INT NOT NULL DEFAULT 0,
            PRIMARY KEY (`id`),
            KEY `idx_regions_sort` (`sort_order`, `status`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";

        $db->exec($sql);
    }

    public function down(PDO $db): void
    {
        $db->exec("DROP TABLE IF EXISTS `coverage_regions`;");
    }
};

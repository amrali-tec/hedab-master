<?php

declare(strict_types=1);

use Hedabkh\Backend\Database\Migration;

return new class extends Migration {
    protected string $description = 'Create partners table';

    public function up(PDO $db): void
    {
        $sql = "CREATE TABLE IF NOT EXISTS `partners` (
            `id` VARCHAR(64) NOT NULL,
            `name_ar` VARCHAR(255) NOT NULL,
            `name_en` VARCHAR(255) NOT NULL,
            `logo_url` VARCHAR(500) NOT NULL,
            `category` ENUM('government', 'ministry', 'amanah', 'authority', 'private') NOT NULL DEFAULT 'government',
            `contract_role_ar` VARCHAR(191) NOT NULL,
            `contract_role_en` VARCHAR(191) NOT NULL,
            `projects_count` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
            `is_active` TINYINT(1) NOT NULL DEFAULT 1,
            `sort_order` INT NOT NULL DEFAULT 0,
            `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";

        $db->exec($sql);
    }

    public function down(PDO $db): void
    {
        $db->exec("DROP TABLE IF EXISTS `partners`;");
    }
};

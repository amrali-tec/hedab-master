<?php

declare(strict_types=1);

use Hedabkh\Backend\Database\Migration;

return new class extends Migration {
    protected string $description = 'Create project_features table';

    public function up(PDO $db): void
    {
        $sql = "CREATE TABLE IF NOT EXISTS `project_features` (
            `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            `project_id` VARCHAR(64) NOT NULL,
            `feature_ar` VARCHAR(500) NOT NULL,
            `feature_en` VARCHAR(500) NOT NULL,
            `sort_order` INT NOT NULL DEFAULT 0,
            PRIMARY KEY (`id`),
            KEY `idx_project_features_proj` (`project_id`),
            CONSTRAINT `fk_project_features_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";

        $db->exec($sql);
    }

    public function down(PDO $db): void
    {
        $db->exec("DROP TABLE IF EXISTS `project_features`;");
    }
};

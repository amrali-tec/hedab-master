<?php

declare(strict_types=1);

use Hedabkh\Backend\Database\Migration;

return new class extends Migration {
    protected string $description = 'Create service_features table';

    public function up(PDO $db): void
    {
        $sql = "CREATE TABLE IF NOT EXISTS `service_features` (
            `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            `service_id` VARCHAR(64) NOT NULL,
            `feature_ar` VARCHAR(500) NOT NULL,
            `feature_en` VARCHAR(500) NOT NULL,
            `sort_order` INT NOT NULL DEFAULT 0,
            PRIMARY KEY (`id`),
            KEY `idx_service_features_srv` (`service_id`),
            CONSTRAINT `fk_service_features_service` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";

        $db->exec($sql);
    }

    public function down(PDO $db): void
    {
        $db->exec("DROP TABLE IF EXISTS `service_features`;");
    }
};

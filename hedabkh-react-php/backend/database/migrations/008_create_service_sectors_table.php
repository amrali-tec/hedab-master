<?php

declare(strict_types=1);

use Hedabkh\Backend\Database\Migration;

return new class extends Migration {
    protected string $description = 'Create service_sectors table';

    public function up(PDO $db): void
    {
        $sql = "CREATE TABLE IF NOT EXISTS `service_sectors` (
            `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            `service_id` VARCHAR(64) NOT NULL,
            `sector_ar` VARCHAR(255) NOT NULL,
            `sector_en` VARCHAR(255) NOT NULL,
            `sort_order` INT NOT NULL DEFAULT 0,
            PRIMARY KEY (`id`),
            KEY `idx_service_sectors_srv` (`service_id`),
            CONSTRAINT `fk_service_sectors_service` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";

        $db->exec($sql);
    }

    public function down(PDO $db): void
    {
        $db->exec("DROP TABLE IF EXISTS `service_sectors`;");
    }
};

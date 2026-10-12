<?php

declare(strict_types=1);

use Hedabkh\Backend\Database\Migration;

return new class extends Migration {
    protected string $description = 'Create statistics table';

    public function up(PDO $db): void
    {
        $sql = "CREATE TABLE IF NOT EXISTS `statistics` (
            `id` VARCHAR(64) NOT NULL,
            `key_name` VARCHAR(64) NOT NULL,
            `value_num` INT NOT NULL,
            `prefix_ar` VARCHAR(20) DEFAULT NULL,
            `prefix_en` VARCHAR(20) DEFAULT NULL,
            `suffix_ar` VARCHAR(20) DEFAULT NULL,
            `suffix_en` VARCHAR(20) DEFAULT NULL,
            `label_ar` VARCHAR(191) NOT NULL,
            `label_en` VARCHAR(191) NOT NULL,
            `description_ar` TEXT DEFAULT NULL,
            `description_en` TEXT DEFAULT NULL,
            `icon_key` VARCHAR(64) NOT NULL DEFAULT 'trending-up',
            `sort_order` INT NOT NULL DEFAULT 0,
            `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`),
            UNIQUE KEY `uk_statistics_key` (`key_name`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";

        $db->exec($sql);
    }

    public function down(PDO $db): void
    {
        $db->exec("DROP TABLE IF EXISTS `statistics`;");
    }
};

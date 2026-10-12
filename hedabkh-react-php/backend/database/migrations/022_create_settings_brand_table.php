<?php

declare(strict_types=1);

use Hedabkh\Backend\Database\Migration;

return new class extends Migration {
    protected string $description = 'Create settings_brand table';

    public function up(PDO $db): void
    {
        $sql = "CREATE TABLE IF NOT EXISTS `settings_brand` (
            `id` VARCHAR(64) NOT NULL,
            `key_name` VARCHAR(64) NOT NULL,
            `value_json` JSON NOT NULL,
            `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`),
            UNIQUE KEY `uk_settings_key` (`key_name`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";

        $db->exec($sql);
    }

    public function down(PDO $db): void
    {
        $db->exec("DROP TABLE IF EXISTS `settings_brand`;");
    }
};

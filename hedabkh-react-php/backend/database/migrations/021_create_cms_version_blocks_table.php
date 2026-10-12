<?php

declare(strict_types=1);

use Hedabkh\Backend\Database\Migration;

return new class extends Migration {
    protected string $description = 'Create cms_version_blocks table';

    public function up(PDO $db): void
    {
        $sql = "CREATE TABLE IF NOT EXISTS `cms_version_blocks` (
            `id` VARCHAR(64) NOT NULL,
            `version_id` VARCHAR(64) NOT NULL,
            `block_id` VARCHAR(64) NOT NULL,
            `type` VARCHAR(64) NOT NULL,
            `sort_order` INT NOT NULL DEFAULT 0,
            `is_visible` TINYINT(1) NOT NULL DEFAULT 1,
            `parent_block_id` VARCHAR(64) DEFAULT NULL,
            `config_json` JSON NOT NULL,
            `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`),
            KEY `idx_version_blocks_ver` (`version_id`, `sort_order`),
            KEY `idx_version_blocks_type` (`type`),
            CONSTRAINT `fk_version_blocks_version` FOREIGN KEY (`version_id`) REFERENCES `cms_page_versions` (`id`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";

        $db->exec($sql);
    }

    public function down(PDO $db): void
    {
        $db->exec("DROP TABLE IF EXISTS `cms_version_blocks`;");
    }
};

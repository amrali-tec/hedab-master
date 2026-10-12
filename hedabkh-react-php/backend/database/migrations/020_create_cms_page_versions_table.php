<?php

declare(strict_types=1);

use Hedabkh\Backend\Database\Migration;

return new class extends Migration {
    protected string $description = 'Create cms_page_versions table';

    public function up(PDO $db): void
    {
        $sql = "CREATE TABLE IF NOT EXISTS `cms_page_versions` (
            `id` VARCHAR(64) NOT NULL,
            `page_id` VARCHAR(64) NOT NULL,
            `version_number` INT UNSIGNED NOT NULL,
            `state` ENUM('draft', 'review', 'published', 'archived') NOT NULL DEFAULT 'draft',
            `title_ar` VARCHAR(255) NOT NULL,
            `title_en` VARCHAR(255) NOT NULL,
            `blocks_json` LONGTEXT NOT NULL COMMENT 'JSON snapshot of ContentBlock tree for instantaneous rendering',
            `change_note` VARCHAR(500) DEFAULT NULL,
            `created_by` VARCHAR(64) DEFAULT NULL,
            `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            `published_at` DATETIME DEFAULT NULL,
            `scheduled_publish_at` DATETIME DEFAULT NULL,
            PRIMARY KEY (`id`),
            UNIQUE KEY `uk_page_version_num` (`page_id`, `version_number`),
            KEY `idx_page_versions_state` (`page_id`, `state`),
            CONSTRAINT `fk_versions_page` FOREIGN KEY (`page_id`) REFERENCES `cms_pages` (`id`) ON DELETE CASCADE,
            CONSTRAINT `fk_versions_creator` FOREIGN KEY (`created_by`) REFERENCES `admin_users` (`id`) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";

        $db->exec($sql);
    }

    public function down(PDO $db): void
    {
        $db->exec("DROP TABLE IF EXISTS `cms_page_versions`;");
    }
};

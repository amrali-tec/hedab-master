<?php

declare(strict_types=1);

use Hedabkh\Backend\Database\Migration;

return new class extends Migration {
    protected string $description = 'Create cms_pages table';

    public function up(PDO $db): void
    {
        $sql = "CREATE TABLE IF NOT EXISTS `cms_pages` (
            `id` VARCHAR(64) NOT NULL,
            `slug` VARCHAR(191) NOT NULL,
            `title_ar` VARCHAR(255) NOT NULL,
            `title_en` VARCHAR(255) NOT NULL,
            `template` VARCHAR(64) NOT NULL DEFAULT 'custom',
            `status` ENUM('draft', 'review', 'published') NOT NULL DEFAULT 'published',
            `published_version_id` VARCHAR(64) DEFAULT NULL,
            `draft_version_id` VARCHAR(64) DEFAULT NULL,
            `scheduled_publish_at` DATETIME DEFAULT NULL,
            `review_requested_by` VARCHAR(64) DEFAULT NULL,
            `review_requested_at` DATETIME DEFAULT NULL,
            `created_by` VARCHAR(64) DEFAULT NULL,
            `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`),
            UNIQUE KEY `uk_cms_pages_slug` (`slug`),
            CONSTRAINT `fk_cms_pages_creator` FOREIGN KEY (`created_by`) REFERENCES `admin_users` (`id`) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";

        $db->exec($sql);
    }

    public function down(PDO $db): void
    {
        $db->exec("DROP TABLE IF EXISTS `cms_pages`;");
    }
};

<?php

declare(strict_types=1);

use Hedabkh\Backend\Database\Migration;

return new class extends Migration {
    protected string $description = 'Create settings_seo table';

    public function up(PDO $db): void
    {
        $sql = "CREATE TABLE IF NOT EXISTS `settings_seo` (
            `id` VARCHAR(64) NOT NULL,
            `page_key` VARCHAR(64) NOT NULL,
            `title_ar` VARCHAR(255) NOT NULL,
            `title_en` VARCHAR(255) NOT NULL,
            `description_ar` TEXT NOT NULL,
            `description_en` TEXT NOT NULL,
            `keywords_ar_json` JSON NOT NULL,
            `keywords_en_json` JSON NOT NULL,
            `og_image` VARCHAR(500) DEFAULT NULL,
            `canonical_url` VARCHAR(500) DEFAULT NULL,
            `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`),
            UNIQUE KEY `uk_seo_page_key` (`page_key`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";

        $db->exec($sql);
    }

    public function down(PDO $db): void
    {
        $db->exec("DROP TABLE IF EXISTS `settings_seo`;");
    }
};

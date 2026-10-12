<?php

declare(strict_types=1);

use Hedabkh\Backend\Database\Migration;

return new class extends Migration {
    protected string $description = 'Create articles table';

    public function up(PDO $db): void
    {
        $sql = "CREATE TABLE IF NOT EXISTS `articles` (
            `id` VARCHAR(64) NOT NULL,
            `slug` VARCHAR(191) NOT NULL,
            `title_ar` VARCHAR(255) NOT NULL,
            `title_en` VARCHAR(255) NOT NULL,
            `category_ar` VARCHAR(191) NOT NULL,
            `category_en` VARCHAR(191) NOT NULL,
            `read_time_ar` VARCHAR(50) NOT NULL,
            `read_time_en` VARCHAR(50) NOT NULL,
            `published_date` DATE NOT NULL,
            `cover_image` VARCHAR(500) NOT NULL,
            `image_alt_ar` VARCHAR(255) NOT NULL,
            `image_alt_en` VARCHAR(255) NOT NULL,
            `summary_ar` TEXT NOT NULL,
            `summary_en` TEXT NOT NULL,
            `seo_title_ar` VARCHAR(255) NOT NULL,
            `seo_title_en` VARCHAR(255) NOT NULL,
            `meta_description_ar` TEXT NOT NULL,
            `meta_description_en` TEXT NOT NULL,
            `content_ar` MEDIUMTEXT NOT NULL,
            `content_en` MEDIUMTEXT NOT NULL,
            `status` ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'published',
            `created_by` VARCHAR(64) DEFAULT NULL,
            `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`),
            UNIQUE KEY `uk_articles_slug` (`slug`),
            KEY `idx_articles_status_date` (`status`, `published_date`),
            CONSTRAINT `fk_articles_user` FOREIGN KEY (`created_by`) REFERENCES `admin_users` (`id`) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";

        $db->exec($sql);
    }

    public function down(PDO $db): void
    {
        $db->exec("DROP TABLE IF EXISTS `articles`;");
    }
};

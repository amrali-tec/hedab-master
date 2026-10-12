<?php

declare(strict_types=1);

use Hedabkh\Backend\Database\Migration;

return new class extends Migration {
    protected string $description = 'Create media_items table';

    public function up(PDO $db): void
    {
        $sql = "CREATE TABLE IF NOT EXISTS `media_items` (
            `id` VARCHAR(64) NOT NULL,
            `original_name` VARCHAR(255) NOT NULL,
            `stored_filename` VARCHAR(255) NOT NULL,
            `file_path` VARCHAR(500) NOT NULL,
            `file_url` VARCHAR(500) NOT NULL,
            `mime_type` VARCHAR(100) NOT NULL,
            `file_size_bytes` BIGINT UNSIGNED NOT NULL,
            `width_px` INT UNSIGNED DEFAULT NULL,
            `height_px` INT UNSIGNED DEFAULT NULL,
            `media_type` ENUM('image', 'document', 'badge', 'pdf') NOT NULL DEFAULT 'image',
            `category` VARCHAR(100) NOT NULL DEFAULT 'general',
            `alt_ar` VARCHAR(255) DEFAULT NULL,
            `alt_en` VARCHAR(255) DEFAULT NULL,
            `uploaded_by` VARCHAR(64) DEFAULT NULL,
            `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`),
            KEY `idx_media_category_type` (`category`, `media_type`),
            CONSTRAINT `fk_media_user` FOREIGN KEY (`uploaded_by`) REFERENCES `admin_users` (`id`) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";

        $db->exec($sql);
    }

    public function down(PDO $db): void
    {
        $db->exec("DROP TABLE IF EXISTS `media_items`;");
    }
};

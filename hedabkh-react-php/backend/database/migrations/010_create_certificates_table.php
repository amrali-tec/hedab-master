<?php

declare(strict_types=1);

use Hedabkh\Backend\Database\Migration;

return new class extends Migration {
    protected string $description = 'Create certificates table';

    public function up(PDO $db): void
    {
        $sql = "CREATE TABLE IF NOT EXISTS `certificates` (
            `id` VARCHAR(64) NOT NULL,
            `title_ar` VARCHAR(255) NOT NULL,
            `title_en` VARCHAR(255) NOT NULL,
            `issuer_ar` VARCHAR(255) NOT NULL,
            `issuer_en` VARCHAR(255) NOT NULL,
            `id_number` VARCHAR(100) NOT NULL,
            `issue_date` DATE NOT NULL,
            `expiry_date` DATE NOT NULL,
            `type` ENUM('government', 'iso') NOT NULL DEFAULT 'iso',
            `category` ENUM('official', 'classification', 'iso', 'identity') NOT NULL DEFAULT 'iso',
            `credit_rating` VARCHAR(100) DEFAULT NULL,
            `file_path` VARCHAR(500) DEFAULT NULL,
            `is_active` TINYINT(1) NOT NULL DEFAULT 1,
            `sort_order` INT NOT NULL DEFAULT 0,
            `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`),
            KEY `idx_certificates_type_cat` (`type`, `category`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";

        $db->exec($sql);
    }

    public function down(PDO $db): void
    {
        $db->exec("DROP TABLE IF EXISTS `certificates`;");
    }
};

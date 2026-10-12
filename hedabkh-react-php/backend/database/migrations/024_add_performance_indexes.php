<?php

declare(strict_types=1);

use Hedabkh\Backend\Database\Migration;

return new class extends Migration {
    protected string $description = 'Add composite performance indexes across high-traffic tables';

    public function up(PDO $db): void
    {
        $indexes = [
            "ALTER TABLE `projects` ADD INDEX `idx_projects_active_sort` (`is_active`, `sort_order`);",
            "ALTER TABLE `services` ADD INDEX `idx_services_active_sort` (`is_active`, `sort_order`);",
            "ALTER TABLE `equipment_fleet` ADD INDEX `idx_equipment_active_sort` (`is_active`, `sort_order`);",
            "ALTER TABLE `team_members` ADD INDEX `idx_team_active_sort` (`is_active`, `sort_order`);",
            "ALTER TABLE `partners` ADD INDEX `idx_partners_active_sort` (`is_active`, `sort_order`);",
            "ALTER TABLE `cms_page_versions` ADD INDEX `idx_cms_versions_page_state` (`page_id`, `state`);",
        ];

        foreach ($indexes as $sql) {
            try {
                $db->exec($sql);
            } catch (PDOException $e) {
                // Ignore if index already exists
                if (!str_contains($e->getMessage(), 'Duplicate key name')) {
                    throw $e;
                }
            }
        }
    }

    public function down(PDO $db): void
    {
        $drops = [
            "ALTER TABLE `projects` DROP INDEX `idx_projects_active_sort`;",
            "ALTER TABLE `services` DROP INDEX `idx_services_active_sort`;",
            "ALTER TABLE `equipment_fleet` DROP INDEX `idx_equipment_active_sort`;",
            "ALTER TABLE `team_members` DROP INDEX `idx_team_active_sort`;",
            "ALTER TABLE `partners` DROP INDEX `idx_partners_active_sort`;",
            "ALTER TABLE `cms_page_versions` DROP INDEX `idx_cms_versions_page_state`;",
        ];

        foreach ($drops as $sql) {
            try {
                $db->exec($sql);
            } catch (PDOException $e) {
                // Ignore if index already dropped
            }
        }
    }
};

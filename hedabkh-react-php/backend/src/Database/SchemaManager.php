<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Database;

use PDO;

class SchemaManager
{
    private Connection $connection;

    public function __construct(Connection $connection)
    {
        $this->connection = $connection;
    }

    /**
     * Get list of all user tables in the current database.
     */
    public function getTables(): array
    {
        $sql = "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_TYPE = 'BASE TABLE' ORDER BY TABLE_NAME";
        $rows = $this->connection->fetchAll($sql);
        return array_column($rows, 'TABLE_NAME');
    }

    /**
     * Validates the active database schema against the approved 23-table contract.
     */
    public function validateSchema(): array
    {
        $expectedTables = [
            'schema_migrations',
            'admin_users',
            'admin_permissions',
            'admin_activity_logs',
            'projects',
            'project_features',
            'services',
            'service_features',
            'service_sectors',
            'equipment_fleet',
            'certificates',
            'team_members',
            'partners',
            'articles',
            'statistics',
            'inquiries',
            'timeline_milestones',
            'coverage_regions',
            'media_items',
            'cms_pages',
            'cms_page_versions',
            'cms_version_blocks',
            'settings_brand',
            'settings_seo'
        ];

        $currentTables = $this->getTables();
        $results = [];
        $hasFailures = false;

        // 1. Table existence & engine checks
        $tableInfoRows = $this->connection->fetchAll(
            "SELECT TABLE_NAME, ENGINE, TABLE_COLLATION 
             FROM information_schema.TABLES 
             WHERE TABLE_SCHEMA = DATABASE() AND TABLE_TYPE = 'BASE TABLE'"
        );
        $tableInfoMap = [];
        foreach ($tableInfoRows as $row) {
            $tableInfoMap[$row['TABLE_NAME']] = $row;
        }

        foreach ($expectedTables as $expectedTable) {
            if (!in_array($expectedTable, $currentTables, true)) {
                $results[] = [
                    'item' => "Table: {$expectedTable}",
                    'status' => 'FAIL',
                    'message' => "Table [{$expectedTable}] does not exist in database."
                ];
                $hasFailures = true;
                continue;
            }

            $info = $tableInfoMap[$expectedTable] ?? null;
            $engine = $info['ENGINE'] ?? 'UNKNOWN';
            $collation = $info['TABLE_COLLATION'] ?? 'UNKNOWN';

            if (strtoupper($engine) !== 'INNODB') {
                $results[] = [
                    'item' => "Engine: {$expectedTable}",
                    'status' => 'WARNING',
                    'message' => "Table [{$expectedTable}] engine is [{$engine}], expected [InnoDB]."
                ];
            } else {
                $results[] = [
                    'item' => "Table: {$expectedTable}",
                    'status' => 'PASS',
                    'message' => "Table exists (Engine: {$engine}, Collation: {$collation})"
                ];
            }
        }

        // 2. Foreign Key verification
        $fkRows = $this->connection->fetchAll(
            "SELECT TABLE_NAME, CONSTRAINT_NAME, REFERENCED_TABLE_NAME 
             FROM information_schema.KEY_COLUMN_USAGE 
             WHERE TABLE_SCHEMA = DATABASE() AND REFERENCED_TABLE_NAME IS NOT NULL"
        );

        $expectedFks = [
            'admin_permissions' => 'admin_users',
            'admin_activity_logs' => 'admin_users',
            'project_features' => 'projects',
            'service_features' => 'services',
            'service_sectors' => 'services',
            'articles' => 'admin_users',
            'media_items' => 'admin_users',
            'cms_page_versions' => 'cms_pages',
            'cms_version_blocks' => 'cms_page_versions',
        ];

        $fkMap = [];
        foreach ($fkRows as $row) {
            $fkMap[$row['TABLE_NAME']][] = $row['REFERENCED_TABLE_NAME'];
        }

        foreach ($expectedFks as $table => $refTable) {
            if (isset($fkMap[$table]) && in_array($refTable, $fkMap[$table], true)) {
                $results[] = [
                    'item' => "FK: {$table} -> {$refTable}",
                    'status' => 'PASS',
                    'message' => "Foreign key constraint correctly references [{$refTable}]."
                ];
            } else {
                if (in_array($table, $currentTables, true)) {
                    $results[] = [
                        'item' => "FK: {$table} -> {$refTable}",
                        'status' => 'FAIL',
                        'message' => "Missing expected foreign key from [{$table}] to [{$refTable}]."
                    ];
                    $hasFailures = true;
                }
            }
        }

        return [
            'valid' => !$hasFailures,
            'tables_count' => count($currentTables),
            'expected_count' => count($expectedTables),
            'details' => $results
        ];
    }

    /**
     * Creates an SQL backup dump of the database into the target directory.
     */
    public function createBackup(string $backupDir): string
    {
        if (!is_dir($backupDir)) {
            @mkdir($backupDir, 0755, true);
        }

        $timestamp = date('Ymd_His');
        $dbName = (string) $this->connection->fetchScalar("SELECT DATABASE()");
        $backupFile = rtrim($backupDir, '/\\') . "/hedabkh_{$dbName}_backup_{$timestamp}.sql";

        $tables = $this->getTables();
        $pdo = $this->connection->getPdo();

        $dump = "-- HEDABKH Database Backup\n";
        $dump .= "-- Generated: " . date('Y-m-d H:i:s') . "\n";
        $dump .= "-- Database: {$dbName}\n\n";
        $dump .= "SET FOREIGN_KEY_CHECKS = 0;\n\n";

        foreach ($tables as $table) {
            $createRow = $this->connection->fetchOne("SHOW CREATE TABLE `{$table}`");
            $createSql = $createRow['Create Table'] ?? '';
            $dump .= "-- Table structure for `{$table}`\n";
            $dump .= "DROP TABLE IF EXISTS `{$table}`;\n";
            $dump .= $createSql . ";\n\n";

            $rows = $this->connection->fetchAll("SELECT * FROM `{$table}`");
            if (!empty($rows)) {
                $dump .= "-- Data for `{$table}`\n";
                foreach ($rows as $row) {
                    $cols = array_map(function ($col) {
                        return "`" . str_replace("`", "``", $col) . "`";
                    }, array_keys($row));

                    $vals = array_map(function ($val) use ($pdo) {
                        return $val === null ? 'NULL' : $pdo->quote((string) $val);
                    }, array_values($row));

                    $dump .= "INSERT INTO `{$table}` (" . implode(', ', $cols) . ") VALUES (" . implode(', ', $vals) . ");\n";
                }
                $dump .= "\n";
            }
        }

        $dump .= "SET FOREIGN_KEY_CHECKS = 1;\n";

        file_put_contents($backupFile, $dump, LOCK_EX);
        return $backupFile;
    }
}

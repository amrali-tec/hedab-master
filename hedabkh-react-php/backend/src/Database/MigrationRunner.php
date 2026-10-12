<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Database;

use PDO;

class MigrationRunner
{
    private Connection $connection;
    private string $migrationsPath;

    public function __construct(Connection $connection, string $migrationsPath)
    {
        $this->connection = $connection;
        $this->migrationsPath = rtrim($migrationsPath, '/\\');
    }

    /**
     * Ensure the schema_migrations tracking table exists.
     */
    public function ensureTrackingTableExists(): void
    {
        $sql = "CREATE TABLE IF NOT EXISTS `schema_migrations` (
            `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            `migration` VARCHAR(255) NOT NULL,
            `batch` INT UNSIGNED NOT NULL,
            `checksum` CHAR(64) NOT NULL,
            `executed_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`),
            UNIQUE KEY `uk_schema_migration_name` (`migration`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";

        $this->connection->getPdo()->exec($sql);
    }

    /**
     * Get all executed migrations mapped by filename.
     */
    public function getExecutedMigrations(): array
    {
        $this->ensureTrackingTableExists();
        $rows = $this->connection->fetchAll("SELECT * FROM `schema_migrations` ORDER BY `id` ASC");
        
        $map = [];
        foreach ($rows as $row) {
            $map[$row['migration']] = $row;
        }
        return $map;
    }

    /**
     * Get next batch number.
     */
    public function getNextBatchNumber(): int
    {
        $this->ensureTrackingTableExists();
        $max = (int) $this->connection->fetchScalar("SELECT MAX(`batch`) FROM `schema_migrations`");
        return $max + 1;
    }

    /**
     * Get all migration files from the migrations directory in sorted order.
     */
    public function getMigrationFiles(): array
    {
        if (!is_dir($this->migrationsPath)) {
            return [];
        }

        $files = glob($this->migrationsPath . '/*.php');
        if ($files === false) {
            return [];
        }

        sort($files, SORT_NATURAL);
        return $files;
    }

    /**
     * Run all pending migrations.
     */
    public function migrate(bool $dryRun = false, ?callable $onProgress = null): array
    {
        $this->ensureTrackingTableExists();
        $executed = $this->getExecutedMigrations();
        $files = $this->getMigrationFiles();
        $nextBatch = $this->getNextBatchNumber();

        $pending = [];
        $applied = [];

        foreach ($files as $filePath) {
            $fileName = basename($filePath);
            $checksum = hash_file('sha256', $filePath);

            if (isset($executed[$fileName])) {
                // Verify checksum integrity
                if ($executed[$fileName]['checksum'] !== $checksum) {
                    throw new MigrationException(
                        "MIGRATION_CHECKSUM_MISMATCH: Migration file [{$fileName}] has been modified after execution! " .
                        "Expected: [{$executed[$fileName]['checksum']}], Found: [{$checksum}].",
                        $fileName
                    );
                }
                continue;
            }

            $pending[] = [
                'file' => $fileName,
                'path' => $filePath,
                'checksum' => $checksum,
            ];
        }

        if ($dryRun) {
            return [
                'dry_run' => true,
                'pending' => $pending,
                'applied' => []
            ];
        }

        $pdo = $this->connection->getPdo();

        foreach ($pending as $index => $item) {
            $migration = require $item['path'];
            if (!($migration instanceof MigrationInterface)) {
                throw new MigrationException("Migration file [{$item['file']}] did not return an instance of MigrationInterface.", $item['file']);
            }

            if ($onProgress) {
                $onProgress($item['file'], $index + 1, count($pending), 'running');
            }

            try {
                // Execute migration DDL
                $migration->up($pdo);

                // Record into tracking table
                $stmt = $pdo->prepare("INSERT INTO `schema_migrations` (`migration`, `batch`, `checksum`, `executed_at`) VALUES (?, ?, ?, NOW())");
                $stmt->execute([$item['file'], $nextBatch, $item['checksum']]);

                $applied[] = $item['file'];

                if ($onProgress) {
                    $onProgress($item['file'], $index + 1, count($pending), 'completed');
                }
            } catch (\Throwable $e) {
                if ($onProgress) {
                    $onProgress($item['file'], $index + 1, count($pending), 'failed', $e->getMessage());
                }
                throw new MigrationException("Failed executing migration [{$item['file']}]: " . $e->getMessage(), $item['file'], 0, $e);
            }
        }

        return [
            'dry_run' => false,
            'batch' => $nextBatch,
            'pending' => [],
            'applied' => $applied
        ];
    }

    /**
     * Rollback migrations by batch count or step count.
     */
    public function rollback(int $steps = 1, ?callable $onProgress = null): array
    {
        $this->ensureTrackingTableExists();
        $pdo = $this->connection->getPdo();

        // Get migrations for the latest $steps batches in descending order
        $batches = $this->connection->fetchAll(
            "SELECT DISTINCT `batch` FROM `schema_migrations` ORDER BY `batch` DESC LIMIT {$steps}"
        );

        if (empty($batches)) {
            return [];
        }

        $batchIds = array_column($batches, 'batch');
        $inClause = implode(',', array_map('intval', $batchIds));

        $migrationsToRollback = $this->connection->fetchAll(
            "SELECT * FROM `schema_migrations` WHERE `batch` IN ({$inClause}) ORDER BY `id` DESC"
        );

        $rolledBack = [];

        foreach ($migrationsToRollback as $index => $row) {
            $fileName = $row['migration'];
            $filePath = $this->migrationsPath . '/' . $fileName;

            if (!file_exists($filePath)) {
                throw new MigrationException("Cannot rollback: Migration file [{$fileName}] does not exist on disk.", $fileName);
            }

            $migration = require $filePath;
            if (!($migration instanceof MigrationInterface)) {
                throw new MigrationException("Migration file [{$fileName}] did not return an instance of MigrationInterface.", $fileName);
            }

            if ($onProgress) {
                $onProgress($fileName, $index + 1, count($migrationsToRollback), 'reverting');
            }

            try {
                // Execute migration rollback DDL
                $migration->down($pdo);

                // Remove from tracking table
                $stmt = $pdo->prepare("DELETE FROM `schema_migrations` WHERE `id` = ?");
                $stmt->execute([$row['id']]);

                $rolledBack[] = $fileName;

                if ($onProgress) {
                    $onProgress($fileName, $index + 1, count($migrationsToRollback), 'reverted');
                }
            } catch (\Throwable $e) {
                if ($onProgress) {
                    $onProgress($fileName, $index + 1, count($migrationsToRollback), 'failed', $e->getMessage());
                }
                throw new MigrationException("Failed reverting migration [{$fileName}]: " . $e->getMessage(), $fileName, 0, $e);
            }
        }

        return $rolledBack;
    }

    /**
     * Get detailed status of all migrations.
     */
    public function getStatus(): array
    {
        $this->ensureTrackingTableExists();
        $executed = $this->getExecutedMigrations();
        $files = $this->getMigrationFiles();

        $statusList = [];

        foreach ($files as $filePath) {
            $fileName = basename($filePath);
            $checksum = hash_file('sha256', $filePath);

            if (isset($executed[$fileName])) {
                $isModified = $executed[$fileName]['checksum'] !== $checksum;
                $statusList[] = [
                    'migration' => $fileName,
                    'status' => $isModified ? 'MODIFIED' : 'APPLIED',
                    'batch' => (int) $executed[$fileName]['batch'],
                    'executed_at' => $executed[$fileName]['executed_at'],
                    'checksum_match' => !$isModified,
                ];
            } else {
                $statusList[] = [
                    'migration' => $fileName,
                    'status' => 'PENDING',
                    'batch' => null,
                    'executed_at' => null,
                    'checksum_match' => true,
                ];
            }
        }

        return $statusList;
    }
}

<?php

declare(strict_types=1);

/**
 * HEDABKH Database Migration CLI Tool
 * Usage: php backend/bin/migrate.php [command] [options]
 */

use Hedabkh\Backend\Core\Application;
use Hedabkh\Backend\Core\Config;
use Hedabkh\Backend\Database\Connection;
use Hedabkh\Backend\Database\DatabaseManager;
use Hedabkh\Backend\Database\MigrationRunner;
use Hedabkh\Backend\Database\SchemaManager;

define('HEDABKH_BASE_PATH', dirname(__DIR__));

// Bootstrap application environment & autoloader
require_once HEDABKH_BASE_PATH . '/src/Core/Application.php';
Application::registerAutoloader(HEDABKH_BASE_PATH . '/src');

$app = new Application(HEDABKH_BASE_PATH);
$app->bootstrap();

// Parse CLI Arguments
$args = $argv;
array_shift($args); // remove script name

$command = $args[0] ?? 'help';
$flags = [];
foreach ($args as $arg) {
    if (str_starts_with($arg, '--')) {
        $parts = explode('=', substr($arg, 2), 2);
        $flags[$parts[0]] = $parts[1] ?? true;
    }
}

// Override database connection if --database flag provided
if (isset($flags['database'])) {
    $dbName = (string) $flags['database'];
    Config::set('database.connections.mariadb.database', $dbName);
    DatabaseManager::reset();
}

$connection = DatabaseManager::getConnection();
$migrationsPath = HEDABKH_BASE_PATH . '/database/migrations';
$runner = new MigrationRunner($connection, $migrationsPath);
$schemaManager = new SchemaManager($connection);

echo "\n" . str_repeat('=', 65) . "\n";
echo "  HEDABKH Database Migration Engine (PHP 8.2 / MariaDB)\n";
echo "  Database: " . Config::get('database.connections.mariadb.database') . " | Host: " . Config::get('database.connections.mariadb.host') . "\n";
echo str_repeat('=', 65) . "\n\n";

try {
    switch ($command) {
        case 'migrate':
            $isDryRun = isset($flags['dry-run']);
            if ($isDryRun) {
                echo ">>> DRY RUN MODE — NO DATABASE CHANGES WILL BE PERFORMED <<<\n\n";
            }

            $result = $runner->migrate($isDryRun, function ($file, $current, $total, $state, $error = '') {
                if ($state === 'running') {
                    printf("[%d/%d] Migrating: %-45s ", $current, $total, $file);
                } elseif ($state === 'completed') {
                    echo "[PASS]\n";
                } elseif ($state === 'failed') {
                    echo "[FAIL]\n  Error: {$error}\n";
                }
            });

            if ($isDryRun) {
                $count = count($result['pending']);
                echo "Pending migrations to apply: {$count}\n";
                foreach ($result['pending'] as $item) {
                    echo "  - {$item['file']}\n";
                }
                echo "\nDRY RUN COMPLETED. 0 changes committed.\n";
            } else {
                $appliedCount = count($result['applied']);
                if ($appliedCount === 0) {
                    echo "Nothing to migrate. Database schema is already up to date.\n";
                } else {
                    echo "\nSUCCESS: {$appliedCount} migration(s) executed in batch #{$result['batch']}.\n";
                }
            }
            break;

        case 'status':
            $statusList = $runner->getStatus();
            printf("%-40s | %-10s | %-6s | %s\n", "Migration File", "Status", "Batch", "Executed At");
            echo str_repeat('-', 75) . "\n";

            $appliedCount = 0;
            $pendingCount = 0;

            foreach ($statusList as $item) {
                $batchStr = $item['batch'] !== null ? (string) $item['batch'] : '-';
                $executedStr = $item['executed_at'] ?? 'Pending';
                printf("%-40s | %-10s | %-6s | %s\n", $item['migration'], $item['status'], $batchStr, $executedStr);
                
                if ($item['status'] === 'APPLIED') $appliedCount++;
                if ($item['status'] === 'PENDING') $pendingCount++;
            }

            echo str_repeat('-', 75) . "\n";
            echo "Summary: {$appliedCount} Applied, {$pendingCount} Pending, " . count($statusList) . " Total\n";
            break;

        case 'rollback':
            $steps = isset($flags['steps']) ? (int) $flags['steps'] : 1;
            echo "Rolling back latest {$steps} batch(es)...\n\n";

            $rolledBack = $runner->rollback($steps, function ($file, $current, $total, $state, $error = '') {
                if ($state === 'reverting') {
                    printf("[%d/%d] Reverting: %-45s ", $current, $total, $file);
                } elseif ($state === 'reverted') {
                    echo "[REVERTED]\n";
                } elseif ($state === 'failed') {
                    echo "[FAIL]\n  Error: {$error}\n";
                }
            });

            if (empty($rolledBack)) {
                echo "Nothing to rollback.\n";
            } else {
                echo "\nSUCCESS: Reverted " . count($rolledBack) . " migration(s).\n";
            }
            break;

        case 'validate':
            echo "Validating active database schema against contract...\n\n";
            $validation = $schemaManager->validateSchema();

            foreach ($validation['details'] as $detail) {
                printf("[%s] %-30s - %s\n", $detail['status'], $detail['item'], $detail['message']);
            }

            echo "\n" . str_repeat('-', 65) . "\n";
            echo "Schema Validation Result: " . ($validation['valid'] ? "[PASS - 100% VALID]" : "[FAIL - INCONSISTENCIES FOUND]") . "\n";
            echo "Tables in DB: {$validation['tables_count']} / Expected: {$validation['expected_count']}\n";
            
            if (!$validation['valid']) {
                exit(1);
            }
            break;

        case 'reset':
            if (!isset($flags['force'])) {
                echo "ERROR: The 'reset' command drops all migration-managed tables.\n";
                echo "To execute, you must provide the --force flag:\n";
                echo "  php backend/bin/migrate.php reset --force\n\n";
                exit(1);
            }

            echo "RESETTING DATABASE: Rolling back all applied migrations...\n\n";
            $statusList = $runner->getStatus();
            $appliedCount = count(array_filter($statusList, fn($s) => $s['status'] === 'APPLIED'));

            if ($appliedCount === 0) {
                echo "Database has no applied migrations to reset.\n";
            } else {
                $runner->rollback(9999, function ($file, $current, $total, $state) {
                    if ($state === 'reverting') {
                        printf("[%d/%d] Dropping: %-45s ", $current, $total, $file);
                    } elseif ($state === 'reverted') {
                        echo "[DROPPED]\n";
                    }
                });
                echo "\nSUCCESS: Database reset completed. All managed tables dropped.\n";
            }
            break;

        case 'backup':
            $backupDir = HEDABKH_BASE_PATH . '/storage/backups';
            echo "Generating database backup to storage/backups/...\n";
            $backupFile = $schemaManager->createBackup($backupDir);
            echo "SUCCESS: Backup created at: {$backupFile} (" . filesize($backupFile) . " bytes)\n";
            break;

        default:
            echo "Available Commands:\n";
            echo "  migrate              Run all pending migrations\n";
            echo "  migrate --dry-run    Inspect pending migrations without applying\n";
            echo "  status               Show status of all migrations\n";
            echo "  rollback             Rollback the last batch of migrations\n";
            echo "  rollback --steps=N   Rollback N batches\n";
            echo "  validate             Validate tables, keys, and indexes vs schema contract\n";
            echo "  reset --force        Drop all managed tables in reverse order\n";
            echo "  backup               Generate SQL dump in storage/backups/\n";
            echo "  --database=<name>    Target a specific database name\n";
            break;
    }
} catch (\Throwable $e) {
    echo "\nMIGRATION ERROR: " . $e->getMessage() . "\n";
    if (Config::get('app.debug')) {
        echo "Trace:\n" . $e->getTraceAsString() . "\n";
    }
    exit(1);
}

echo "\n";
exit(0);

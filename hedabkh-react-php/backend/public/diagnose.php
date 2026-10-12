<?php

declare(strict_types=1);

/**
 * HEDABKH Production Self-Diagnostic Utility
 * Visit /api/diagnose.php to inspect real-time server environment, database connection, and tables.
 */

header('Content-Type: application/json; charset=utf-8');

$results = [
    'timestamp' => date('Y-m-d H:i:s'),
    'php_version' => PHP_VERSION,
    'checks' => [],
    'database_test' => [],
    'tables_test' => [],
    'summary' => 'PENDING'
];

// 1. Check Backend Directory Resolution
$basePaths = [
    'standard_hostinger' => dirname(__DIR__, 2) . '/hedabkh_private/backend',
    'relative_backend' => dirname(__DIR__) . '/hedabkh_private/backend',
    'same_level_backend' => dirname(__DIR__) . '/backend',
    'current_parent' => dirname(__DIR__),
];

$resolvedPath = null;
foreach ($basePaths as $key => $p) {
    if (file_exists($p . '/src/Core/Application.php')) {
        $resolvedPath = $p;
        $results['checks']['backend_location'] = [
            'status' => 'PASS',
            'type' => $key,
            'path' => $p
        ];
        break;
    }
}

if (!$resolvedPath) {
    $results['checks']['backend_location'] = [
        'status' => 'FAIL',
        'error' => 'hedabkh_private/backend not found in expected locations.',
        'searched_paths' => $basePaths
    ];
    $results['summary'] = 'FAIL: Backend Directory Missing';
    echo json_encode($results, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    exit;
}

// 2. Check .env File
$envFile = $resolvedPath . '/.env';
$envExample = $resolvedPath . '/.env.example';

$envLoaded = false;
$envVars = [];

if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#') || !str_contains($line, '=')) continue;
        [$k, $v] = explode('=', $line, 2);
        $k = trim($k);
        $v = trim($v, " \t\n\r\0\x0B'\"");
        $envVars[$k] = $v;
        $_ENV[$k] = $v;
        $_SERVER[$k] = $v;
        putenv("{$k}={$v}");
    }
    $results['checks']['env_file'] = [
        'status' => 'PASS',
        'file' => '.env',
        'db_host' => $envVars['DB_HOST'] ?? '(not set)',
        'db_database' => $envVars['DB_DATABASE'] ?? ($envVars['DB_NAME'] ?? '(not set)'),
        'db_username' => $envVars['DB_USERNAME'] ?? ($envVars['DB_USER'] ?? '(not set)'),
        'db_password_set' => !empty($envVars['DB_PASSWORD'] ?? ($envVars['DB_PASS'] ?? '')) ? 'YES (Length: ' . strlen($envVars['DB_PASSWORD'] ?? ($envVars['DB_PASS'] ?? '')) . ')' : 'NO (Empty)'
    ];
    $envLoaded = true;
} else {
    $results['checks']['env_file'] = [
        'status' => 'WARNING',
        'error' => '.env file does not exist in ' . $resolvedPath . '. Please create .env file from .env.example.',
        'env_example_exists' => file_exists($envExample)
    ];
}

// 3. Database Connection Probe
$dbHost = $envVars['DB_HOST'] ?? 'localhost';
$dbPort = (int) ($envVars['DB_PORT'] ?? 3306);
$dbName = $envVars['DB_DATABASE'] ?? ($envVars['DB_NAME'] ?? 'hedabkh');
$dbUser = $envVars['DB_USERNAME'] ?? ($envVars['DB_USER'] ?? 'root');
$dbPass = $envVars['DB_PASSWORD'] ?? ($envVars['DB_PASS'] ?? '');

$pdo = null;
$hostsToTry = array_unique([$dbHost, 'localhost', '127.0.0.1']);

foreach ($hostsToTry as $h) {
    try {
        $dsn = "mysql:host={$h};port={$dbPort};dbname={$dbName};charset=utf8mb4";
        $testPdo = new PDO($dsn, $dbUser, $dbPass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_TIMEOUT => 5
        ]);
        $pdo = $testPdo;
        $results['database_test'][] = [
            'host' => $h,
            'status' => 'PASS',
            'connected' => true
        ];
        break;
    } catch (PDOException $e) {
        $results['database_test'][] = [
            'host' => $h,
            'status' => 'FAIL',
            'error_code' => $e->getCode(),
            'error_message' => $e->getMessage()
        ];
    }
}

if (!$pdo) {
    $results['summary'] = 'FAIL: Cannot connect to MariaDB. Check credentials in .env';
    echo json_encode($results, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    exit;
}

// 4. Verify Database Tables
$requiredTables = [
    'admin_users',
    'admin_permissions',
    'admin_activity_logs',
    'projects',
    'services',
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

$existingTables = [];
try {
    $stmt = $pdo->query("SHOW TABLES");
    $existingTables = $stmt->fetchAll(PDO::FETCH_COLUMN) ?: [];
} catch (\Throwable $e) {
    $results['tables_test']['error'] = $e->getMessage();
}

$missingTables = array_diff($requiredTables, $existingTables);

$results['tables_test']['total_existing_tables'] = count($existingTables);
$results['tables_test']['required_tables_count'] = count($requiredTables);
$results['tables_test']['missing_tables'] = array_values($missingTables);

if (empty($missingTables)) {
    // Count Admin Users and Pages
    $userCount = (int) $pdo->query("SELECT COUNT(*) FROM admin_users")->fetchColumn();
    $cmsPageCount = (int) $pdo->query("SELECT COUNT(*) FROM cms_pages")->fetchColumn();
    $projectCount = (int) $pdo->query("SELECT COUNT(*) FROM projects")->fetchColumn();

    $results['tables_test']['records_summary'] = [
        'admin_users' => $userCount,
        'cms_pages' => $cmsPageCount,
        'projects' => $projectCount
    ];
    $results['summary'] = 'ALL CHECKS PASSED: Environment, Database & Tables are 100% Operational!';
} else {
    $results['summary'] = 'FAIL: ' . count($missingTables) . ' tables missing. Please import hedabkh_production_ready.sql in phpMyAdmin!';
}

echo json_encode($results, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

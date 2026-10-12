<?php
declare(strict_types=1);

use Hedabkh\Backend\Core\Application;
use Hedabkh\Backend\Database\DatabaseManager;

define('HEDABKH_BASE_PATH', dirname(__DIR__));

require_once HEDABKH_BASE_PATH . '/src/Core/Application.php';
Application::registerAutoloader(HEDABKH_BASE_PATH . '/src');

try {
    $app = new Application(HEDABKH_BASE_PATH);
    $app->bootstrap();

    $pdo = DatabaseManager::getConnection()->getPdo();

    $bundleJson = file_get_contents(HEDABKH_BASE_PATH . '/database/seeds/source_bundle.json');
    $bundle = json_decode($bundleJson, true);

    $homeBlocks = $bundle['cmsData']['cms_published_page-home']['blocks'];
    $aboutBlocks = $bundle['cmsData']['cms_published_page-about']['blocks'];

    $stmt = $pdo->prepare("UPDATE cms_page_versions SET blocks_json = ? WHERE page_id = ?");
    
    $stmt->execute([json_encode($homeBlocks, JSON_UNESCAPED_UNICODE), 'page-home']);
    echo "Updated page-home versions: " . count($homeBlocks) . " blocks.\n";

    $stmt->execute([json_encode($aboutBlocks, JSON_UNESCAPED_UNICODE), 'page-about']);
    echo "Updated page-about versions: " . count($aboutBlocks) . " blocks.\n";

    echo "CMS update finished successfully!\n";
} catch (\Throwable $e) {
    echo "Error: " . $e->getMessage() . "\n";
}

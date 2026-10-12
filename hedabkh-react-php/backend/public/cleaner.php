<?php
declare(strict_types=1);

$dir = dirname(__DIR__, 2);
$cleaned = [];

$it = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir));
foreach ($it as $file) {
    if ($file->isFile() && $file->getExtension() === 'php') {
        $path = $file->getRealPath();
        $content = file_get_contents($path);
        if (substr($content, 0, 3) === "\xEF\xBB\xBF") {
            file_put_contents($path, substr($content, 3));
            $cleaned[] = $path;
        }
    }
}

echo json_encode([
    'status' => 'OK',
    'cleaned_files_count' => count($cleaned),
    'cleaned_files' => $cleaned
], JSON_PRETTY_PRINT);

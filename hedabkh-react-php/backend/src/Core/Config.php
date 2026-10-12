<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Core;

class Config
{
    private static array $items = [];

    /**
     * Load all configuration files from the config directory.
     */
    public static function load(string $configPath): void
    {
        if (!is_dir($configPath)) {
            return;
        }

        $files = glob($configPath . '/*.php');
        if ($files === false) {
            return;
        }

        foreach ($files as $file) {
            $key = basename($file, '.php');
            $data = require $file;
            if (is_array($data)) {
                self::$items[$key] = $data;
            }
        }
    }

    /**
     * Get a configuration item using dot notation (e.g. 'app.debug').
     */
    public static function get(string $key, mixed $default = null): mixed
    {
        if (!str_contains($key, '.')) {
            return self::$items[$key] ?? $default;
        }

        $segments = explode('.', $key);
        $current = self::$items;

        foreach ($segments as $segment) {
            if (!is_array($current) || !array_key_exists($segment, $current)) {
                return $default;
            }
            $current = $current[$segment];
        }

        return $current;
    }

    /**
     * Set a configuration item.
     */
    public static function set(string $key, mixed $value): void
    {
        $segments = explode('.', $key);
        $current = &self::$items;

        foreach ($segments as $segment) {
            if (!isset($current[$segment]) || !is_array($current[$segment])) {
                $current[$segment] = [];
            }
            $current = &$current[$segment];
        }

        $current = $value;
    }

    /**
     * Get all configuration items.
     */
    public static function all(): array
    {
        return self::$items;
    }
}

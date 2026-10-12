<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Database;

use Hedabkh\Backend\Core\Config;

class DatabaseManager
{
    private static ?Connection $connection = null;

    /**
     * Get or initialize the primary database connection.
     */
    public static function getConnection(): Connection
    {
        if (self::$connection === null) {
            $default = Config::get('database.default', 'mariadb');
            $config = Config::get("database.connections.{$default}", []);
            self::$connection = new Connection($config);
        }

        return self::$connection;
    }

    /**
     * Test connection without throwing.
     */
    public static function isConnected(): bool
    {
        try {
            return self::getConnection()->ping();
        } catch (\Throwable) {
            return false;
        }
    }

    /**
     * Reset connection instance (useful for tests).
     */
    public static function reset(): void
    {
        self::$connection = null;
    }
}

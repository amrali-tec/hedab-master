<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Database;

use PDO;
use PDOException;
use PDOStatement;

class Connection
{
    private PDO $pdo;
    private array $config;

    public function __construct(array $config)
    {
        $this->config = $config;
        $this->connect();
    }

    private function connect(): void
    {
        $driver = $this->config['driver'] ?? 'mysql';
        $host = $this->config['host'] ?? '127.0.0.1';
        $port = $this->config['port'] ?? 3306;
        $database = $this->config['database'] ?? '';
        $charset = $this->config['charset'] ?? 'utf8mb4';

        $dsn = "{$driver}:host={$host};port={$port};dbname={$database};charset={$charset}";
        $username = $this->config['username'] ?? 'root';
        $password = $this->config['password'] ?? '';
        $options = $this->config['options'] ?? [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ];

        try {
            $this->pdo = new PDO($dsn, $username, $password, $options);
        } catch (PDOException $e) {
            // Auto-fallback: If localhost failed, try 127.0.0.1, or vice-versa
            if ($host === 'localhost') {
                try {
                    $retryDsn = "{$driver}:host=127.0.0.1;port={$port};dbname={$database};charset={$charset}";
                    $this->pdo = new PDO($retryDsn, $username, $password, $options);
                    return;
                } catch (PDOException) {}
            } elseif ($host === '127.0.0.1') {
                try {
                    $retryDsn = "{$driver}:host=localhost;port={$port};dbname={$database};charset={$charset}";
                    $this->pdo = new PDO($retryDsn, $username, $password, $options);
                    return;
                } catch (PDOException) {}
            }

            // Throw sanitized exception without credentials
            throw new \RuntimeException(
                "Database connection failed: " . $e->getMessage(),
                (int) $e->getCode(),
                $e
            );
        }
    }

    public function getPdo(): PDO
    {
        return $this->pdo;
    }

    /**
     * Check if database connection is alive.
     */
    public function ping(): bool
    {
        try {
            $stmt = $this->pdo->query('SELECT 1');
            return $stmt !== false && $stmt->fetchColumn() !== false;
        } catch (\Throwable) {
            return false;
        }
    }

    /**
     * Execute a prepared SQL statement and return statement.
     */
    public function query(string $sql, array $params = []): PDOStatement
    {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt;
    }

    /**
     * Fetch all records from prepared statement.
     */
    public function fetchAll(string $sql, array $params = []): array
    {
        return $this->query($sql, $params)->fetchAll();
    }

    /**
     * Fetch a single record.
     */
    public function fetchOne(string $sql, array $params = []): ?array
    {
        $result = $this->query($sql, $params)->fetch();
        return $result === false ? null : $result;
    }

    /**
     * Fetch a single scalar value.
     */
    public function fetchScalar(string $sql, array $params = []): mixed
    {
        $result = $this->query($sql, $params)->fetchColumn();
        return $result === false ? null : $result;
    }

    /**
     * Execute an INSERT / UPDATE / DELETE statement and return affected rows.
     */
    public function execute(string $sql, array $params = []): int
    {
        return $this->query($sql, $params)->rowCount();
    }

    /**
     * Get the last inserted ID.
     */
    public function lastInsertId(?string $name = null): string|false
    {
        return $this->pdo->lastInsertId($name);
    }

    /**
     * Run a callable inside a database transaction.
     */
    public function transaction(callable $callback): mixed
    {
        $this->pdo->beginTransaction();
        try {
            $result = $callback($this);
            $this->pdo->commit();
            return $result;
        } catch (\Throwable $e) {
            $this->pdo->rollBack();
            throw $e;
        }
    }
}

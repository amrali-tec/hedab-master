<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Database\Repositories;

use Hedabkh\Backend\Database\Connection;
use PDO;

abstract class BaseRepository
{
    protected Connection $connection;
    protected string $table;
    protected string $primaryKey = 'id';

    public function __construct(Connection $connection)
    {
        $this->connection = $connection;
    }

    public function getTable(): string
    {
        return $this->table;
    }

    public function findById(string|int $id): ?array
    {
        $sql = "SELECT * FROM `{$this->table}` WHERE `{$this->primaryKey}` = ? LIMIT 1";
        $stmt = $this->connection->getPdo()->prepare($sql);
        $stmt->execute([$id]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result ?: null;
    }

    public function findAll(array $criteria = [], ?string $orderBy = null, ?int $limit = null, ?int $offset = null): array
    {
        $sql = "SELECT * FROM `{$this->table}`";
        $params = [];

        if (!empty($criteria)) {
            $whereParts = [];
            foreach ($criteria as $field => $val) {
                $whereParts[] = "`{$field}` = ?";
                $params[] = $val;
            }
            $sql .= " WHERE " . implode(' AND ', $whereParts);
        }

        if ($orderBy) {
            $sql .= " ORDER BY {$orderBy}";
        }

        if ($limit !== null) {
            $sql .= " LIMIT " . (int) $limit;
            if ($offset !== null) {
                $sql .= " OFFSET " . (int) $offset;
            }
        }

        $stmt = $this->connection->getPdo()->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
    }

    public function count(array $criteria = []): int
    {
        $sql = "SELECT COUNT(*) FROM `{$this->table}`";
        $params = [];

        if (!empty($criteria)) {
            $whereParts = [];
            foreach ($criteria as $field => $val) {
                $whereParts[] = "`{$field}` = ?";
                $params[] = $val;
            }
            $sql .= " WHERE " . implode(' AND ', $whereParts);
        }

        $stmt = $this->connection->getPdo()->prepare($sql);
        $stmt->execute($params);
        return (int) $stmt->fetchColumn();
    }

    public function insert(array $data): bool
    {
        $fields = array_keys($data);
        $escapedFields = array_map(fn($f) => "`{$f}`", $fields);
        $placeholders = array_fill(0, count($fields), '?');

        $sql = "INSERT INTO `{$this->table}` (" . implode(', ', $escapedFields) . ") VALUES (" . implode(', ', $placeholders) . ")";
        $stmt = $this->connection->getPdo()->prepare($sql);
        return $stmt->execute(array_values($data));
    }

    public function update(string|int $id, array $data): bool
    {
        $fields = array_keys($data);
        $setParts = array_map(fn($f) => "`{$f}` = ?", $fields);

        $sql = "UPDATE `{$this->table}` SET " . implode(', ', $setParts) . " WHERE `{$this->primaryKey}` = ?";
        $params = array_values($data);
        $params[] = $id;

        $stmt = $this->connection->getPdo()->prepare($sql);
        return $stmt->execute($params);
    }

    public function delete(string|int $id): bool
    {
        $sql = "DELETE FROM `{$this->table}` WHERE `{$this->primaryKey}` = ?";
        $stmt = $this->connection->getPdo()->prepare($sql);
        return $stmt->execute([$id]);
    }

    public function exists(string|int $id): bool
    {
        $sql = "SELECT 1 FROM `{$this->table}` WHERE `{$this->primaryKey}` = ? LIMIT 1";
        $stmt = $this->connection->getPdo()->prepare($sql);
        $stmt->execute([$id]);
        return (bool) $stmt->fetchColumn();
    }
}

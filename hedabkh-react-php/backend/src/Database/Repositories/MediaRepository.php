<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Database\Repositories;

use PDO;

class MediaRepository extends BaseRepository
{
    protected string $table = 'media_items';

    public function getMediaItems(array $filters = [], int $limit = 30, int $offset = 0): array
    {
        $sql = "SELECT * FROM `media_items` WHERE 1=1";
        $params = [];

        if (!empty($filters['category'])) {
            $sql .= " AND `category` = ?";
            $params[] = $filters['category'];
        }

        if (!empty($filters['media_type'])) {
            $sql .= " AND `media_type` = ?";
            $params[] = $filters['media_type'];
        }

        if (!empty($filters['search'])) {
            $sql .= " AND (`original_name` LIKE ? OR `alt_ar` LIKE ? OR `alt_en` LIKE ?)";
            $term = '%' . $filters['search'] . '%';
            $params[] = $term;
            $params[] = $term;
            $params[] = $term;
        }

        $sql .= " ORDER BY `created_at` DESC LIMIT " . (int) $limit . " OFFSET " . (int) $offset;

        $stmt = $this->connection->getPdo()->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
    }

    public function countMediaItems(array $filters = []): int
    {
        $sql = "SELECT COUNT(*) FROM `media_items` WHERE 1=1";
        $params = [];

        if (!empty($filters['category'])) {
            $sql .= " AND `category` = ?";
            $params[] = $filters['category'];
        }

        if (!empty($filters['media_type'])) {
            $sql .= " AND `media_type` = ?";
            $params[] = $filters['media_type'];
        }

        if (!empty($filters['search'])) {
            $sql .= " AND (`original_name` LIKE ? OR `alt_ar` LIKE ? OR `alt_en` LIKE ?)";
            $term = '%' . $filters['search'] . '%';
            $params[] = $term;
            $params[] = $term;
            $params[] = $term;
        }

        $stmt = $this->connection->getPdo()->prepare($sql);
        $stmt->execute($params);
        return (int) $stmt->fetchColumn();
    }
}

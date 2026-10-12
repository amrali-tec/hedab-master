<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Database\Repositories;

use PDO;

class ArticleRepository extends BaseRepository
{
    protected string $table = 'articles';

    public function findBySlug(string $slug): ?array
    {
        $sql = "SELECT * FROM `articles` WHERE `slug` = ? OR `id` = ? LIMIT 1";
        $stmt = $this->connection->getPdo()->prepare($sql);
        $stmt->execute([$slug, $slug]);
        $res = $stmt->fetch(PDO::FETCH_ASSOC);
        return $res ?: null;
    }

    public function getArticles(array $filters = [], int $limit = 20, int $offset = 0): array
    {
        $sql = "SELECT * FROM `articles` WHERE 1=1";
        $params = [];

        if (!empty($filters['status'])) {
            $sql .= " AND `status` = ?";
            $params[] = $filters['status'];
        }

        if (!empty($filters['category'])) {
            $sql .= " AND (`category_ar` LIKE ? OR `category_en` LIKE ?)";
            $params[] = '%' . $filters['category'] . '%';
            $params[] = '%' . $filters['category'] . '%';
        }

        if (!empty($filters['search'])) {
            $sql .= " AND (`title_ar` LIKE ? OR `title_en` LIKE ? OR `summary_ar` LIKE ? OR `summary_en` LIKE ?)";
            $term = '%' . $filters['search'] . '%';
            $params[] = $term;
            $params[] = $term;
            $params[] = $term;
            $params[] = $term;
        }

        $sql .= " ORDER BY `published_date` DESC LIMIT " . (int) $limit . " OFFSET " . (int) $offset;

        $stmt = $this->connection->getPdo()->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
    }

    public function countArticles(array $filters = []): int
    {
        $sql = "SELECT COUNT(*) FROM `articles` WHERE 1=1";
        $params = [];

        if (!empty($filters['status'])) {
            $sql .= " AND `status` = ?";
            $params[] = $filters['status'];
        }

        if (!empty($filters['category'])) {
            $sql .= " AND (`category_ar` LIKE ? OR `category_en` LIKE ?)";
            $params[] = '%' . $filters['category'] . '%';
            $params[] = '%' . $filters['category'] . '%';
        }

        if (!empty($filters['search'])) {
            $sql .= " AND (`title_ar` LIKE ? OR `title_en` LIKE ? OR `summary_ar` LIKE ? OR `summary_en` LIKE ?)";
            $term = '%' . $filters['search'] . '%';
            $params[] = $term;
            $params[] = $term;
            $params[] = $term;
            $params[] = $term;
        }

        $stmt = $this->connection->getPdo()->prepare($sql);
        $stmt->execute($params);
        return (int) $stmt->fetchColumn();
    }
}

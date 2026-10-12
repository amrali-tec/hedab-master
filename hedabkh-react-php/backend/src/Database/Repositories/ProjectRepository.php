<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Database\Repositories;

use PDO;

class ProjectRepository extends BaseRepository
{
    protected string $table = 'projects';

    /**
     * Fetch projects with filters, pagination, and sorting.
     */
    public function getProjects(array $filters = [], int $limit = 20, int $offset = 0, string $sort = 'sort_order ASC'): array
    {
        $sql = "SELECT p.* FROM `projects` p WHERE 1=1";
        $params = [];

        if (isset($filters['is_active'])) {
            $sql .= " AND p.`is_active` = ?";
            $params[] = (int) $filters['is_active'];
        }

        if (!empty($filters['featured'])) {
            $sql .= " AND p.`is_featured` = 1";
        }

        if (!empty($filters['category'])) {
            $sql .= " AND (p.`category_ar` LIKE ? OR p.`category_en` LIKE ?)";
            $params[] = '%' . $filters['category'] . '%';
            $params[] = '%' . $filters['category'] . '%';
        }

        if (!empty($filters['search'])) {
            $sql .= " AND (p.`title_ar` LIKE ? OR p.`title_en` LIKE ? OR p.`description_ar` LIKE ? OR p.`description_en` LIKE ?)";
            $term = '%' . $filters['search'] . '%';
            $params[] = $term;
            $params[] = $term;
            $params[] = $term;
            $params[] = $term;
        }

        // Whitelist safe sorting
        $allowedSorts = [
            'sort_order ASC' => 'p.`sort_order` ASC',
            'sort_order DESC' => 'p.`sort_order` DESC',
            'completion_date DESC' => 'p.`completion_date` DESC',
            'created_at DESC' => 'p.`created_at` DESC',
        ];
        $orderClause = $allowedSorts[$sort] ?? 'p.`sort_order` ASC';
        $sql .= " ORDER BY {$orderClause} LIMIT " . (int) $limit . " OFFSET " . (int) $offset;

        $stmt = $this->connection->getPdo()->prepare($sql);
        $stmt->execute($params);
        $projects = $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];

        // Attach features to each project
        if (!empty($projects)) {
            $projectIds = array_column($projects, 'id');
            $featuresMap = $this->getFeaturesForProjects($projectIds);
            foreach ($projects as &$proj) {
                $proj['features'] = $featuresMap[$proj['id']] ?? [];
            }
        }

        return $projects;
    }

    public function countProjects(array $filters = []): int
    {
        $sql = "SELECT COUNT(*) FROM `projects` p WHERE 1=1";
        $params = [];

        if (isset($filters['is_active'])) {
            $sql .= " AND p.`is_active` = ?";
            $params[] = (int) $filters['is_active'];
        }

        if (!empty($filters['featured'])) {
            $sql .= " AND p.`is_featured` = 1";
        }

        if (!empty($filters['category'])) {
            $sql .= " AND (p.`category_ar` LIKE ? OR p.`category_en` LIKE ?)";
            $params[] = '%' . $filters['category'] . '%';
            $params[] = '%' . $filters['category'] . '%';
        }

        if (!empty($filters['search'])) {
            $sql .= " AND (p.`title_ar` LIKE ? OR p.`title_en` LIKE ? OR p.`description_ar` LIKE ? OR p.`description_en` LIKE ?)";
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

    public function getProjectWithDetails(string $id): ?array
    {
        $project = $this->findById($id);
        if (!$project) {
            return null;
        }

        $featuresMap = $this->getFeaturesForProjects([$id]);
        $project['features'] = $featuresMap[$id] ?? [];
        return $project;
    }

    private function getFeaturesForProjects(array $projectIds): array
    {
        if (empty($projectIds)) {
            return [];
        }

        $placeholders = implode(',', array_fill(0, count($projectIds), '?'));
        $sql = "SELECT * FROM `project_features` WHERE `project_id` IN ({$placeholders}) ORDER BY `sort_order` ASC";
        $stmt = $this->connection->getPdo()->prepare($sql);
        $stmt->execute($projectIds);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];

        $map = [];
        foreach ($rows as $row) {
            $map[$row['project_id']][] = [
                'id' => $row['id'],
                'feature_ar' => $row['feature_ar'],
                'feature_en' => $row['feature_en'],
                'sort_order' => $row['sort_order']
            ];
        }
        return $map;
    }

    public function syncFeatures(string $projectId, array $features): void
    {
        $pdo = $this->connection->getPdo();
        $stmtDelete = $pdo->prepare("DELETE FROM `project_features` WHERE `project_id` = ?");
        $stmtDelete->execute([$projectId]);

        $stmtInsert = $pdo->prepare("INSERT INTO `project_features` (`project_id`, `feature_ar`, `feature_en`, `sort_order`) VALUES (?, ?, ?, ?)");
        foreach ($features as $idx => $f) {
            $fAr = is_array($f) ? ($f['feature_ar'] ?? $f['text'] ?? '') : (string) $f;
            $fEn = is_array($f) ? ($f['feature_en'] ?? $f['text_en'] ?? $fAr) : (string) $f;
            $stmtInsert->execute([$projectId, $fAr, $fEn, $idx + 1]);
        }
    }
}

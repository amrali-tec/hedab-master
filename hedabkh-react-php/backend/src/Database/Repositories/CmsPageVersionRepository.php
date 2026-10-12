<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Database\Repositories;

use PDO;

class CmsPageVersionRepository extends BaseRepository
{
    protected string $table = 'cms_page_versions';

    public function findLatestVersion(string $pageId, ?string $state = null): ?array
    {
        $sql = "SELECT * FROM `cms_page_versions` WHERE `page_id` = ?";
        $params = [$pageId];

        if ($state) {
            $sql .= " AND `state` = ?";
            $params[] = $state;
        }

        $sql .= " ORDER BY `version_number` DESC LIMIT 1";

        $stmt = $this->connection->getPdo()->prepare($sql);
        $stmt->execute($params);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ?: null;
    }

    public function findByPageAndVersionNumber(string $pageId, int $versionNumber): ?array
    {
        $sql = "SELECT * FROM `cms_page_versions` WHERE `page_id` = ? AND `version_number` = ? LIMIT 1";
        $stmt = $this->connection->getPdo()->prepare($sql);
        $stmt->execute([$pageId, $versionNumber]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ?: null;
    }

    public function getVersionsForPage(string $pageId): array
    {
        $sql = "SELECT `id`, `page_id`, `version_number`, `state`, `title_ar`, `title_en`, `change_note`, `created_by`, `created_at`, `published_at`
                FROM `cms_page_versions` 
                WHERE `page_id` = ? 
                ORDER BY `version_number` DESC";
        $stmt = $this->connection->getPdo()->prepare($sql);
        $stmt->execute([$pageId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
    }
}

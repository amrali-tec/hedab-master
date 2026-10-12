<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Database\Repositories;

use PDO;

class CmsPageRepository extends BaseRepository
{
    protected string $table = 'cms_pages';

    public function findBySlug(string $slug): ?array
    {
        $sql = "SELECT * FROM `cms_pages` WHERE `slug` = ? OR `id` = ? LIMIT 1";
        $stmt = $this->connection->getPdo()->prepare($sql);
        $stmt->execute([$slug, $slug]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ?: null;
    }
}

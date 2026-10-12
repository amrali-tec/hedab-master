<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Database\Repositories;

use PDO;

class CoverageRegionRepository extends BaseRepository
{
    protected string $table = 'coverage_regions';

    public function getRegions(): array
    {
        $sql = "SELECT * FROM `coverage_regions` ORDER BY `sort_order` ASC";
        $stmt = $this->connection->getPdo()->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
    }
}

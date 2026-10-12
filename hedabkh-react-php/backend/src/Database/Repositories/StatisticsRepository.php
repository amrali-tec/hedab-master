<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Database\Repositories;

use PDO;

class StatisticsRepository extends BaseRepository
{
    protected string $table = 'statistics';

    public function getAllStats(): array
    {
        $sql = "SELECT * FROM `statistics` ORDER BY `sort_order` ASC";
        $stmt = $this->connection->getPdo()->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
    }
}

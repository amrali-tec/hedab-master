<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Database\Repositories;

use PDO;

class TimelineMilestoneRepository extends BaseRepository
{
    protected string $table = 'timeline_milestones';

    public function getMilestones(bool $activeOnly = true): array
    {
        $sql = "SELECT * FROM `timeline_milestones`";
        if ($activeOnly) {
            $sql .= " WHERE `is_active` = 1";
        }
        $sql .= " ORDER BY `sort_order` ASC";

        $stmt = $this->connection->getPdo()->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
    }
}

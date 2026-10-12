<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Database\Repositories;

use PDO;

class TeamMemberRepository extends BaseRepository
{
    protected string $table = 'team_members';

    public function getTeam(array $filters = []): array
    {
        $sql = "SELECT * FROM `team_members` WHERE 1=1";
        $params = [];

        if (isset($filters['is_active'])) {
            $sql .= " AND `is_active` = ?";
            $params[] = (int) $filters['is_active'];
        }

        if (!empty($filters['sector']) && $filters['sector'] !== 'ALL') {
            $sql .= " AND `sector` = ?";
            $params[] = $filters['sector'];
        }

        $sql .= " ORDER BY `sort_order` ASC";

        $stmt = $this->connection->getPdo()->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
    }
}

<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Database\Repositories;

use PDO;

class PartnerRepository extends BaseRepository
{
    protected string $table = 'partners';

    public function getPartners(array $filters = []): array
    {
        $sql = "SELECT * FROM `partners` WHERE 1=1";
        $params = [];

        if (isset($filters['is_active'])) {
            $sql .= " AND `is_active` = ?";
            $params[] = (int) $filters['is_active'];
        }

        if (!empty($filters['category'])) {
            $sql .= " AND `category` = ?";
            $params[] = $filters['category'];
        }

        $sql .= " ORDER BY `sort_order` ASC";

        $stmt = $this->connection->getPdo()->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
    }
}

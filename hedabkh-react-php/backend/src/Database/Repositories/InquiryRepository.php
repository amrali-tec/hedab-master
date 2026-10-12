<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Database\Repositories;

use PDO;

class InquiryRepository extends BaseRepository
{
    protected string $table = 'inquiries';

    public function getInquiries(array $filters = [], int $limit = 20, int $offset = 0): array
    {
        $sql = "SELECT * FROM `inquiries` WHERE 1=1";
        $params = [];

        if (!empty($filters['status'])) {
            $sql .= " AND `status` = ?";
            $params[] = $filters['status'];
        }

        $sql .= " ORDER BY `created_at` DESC LIMIT " . (int) $limit . " OFFSET " . (int) $offset;

        $stmt = $this->connection->getPdo()->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
    }
}

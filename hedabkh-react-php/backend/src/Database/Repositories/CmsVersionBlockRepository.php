<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Database\Repositories;

use PDO;

class CmsVersionBlockRepository extends BaseRepository
{
    protected string $table = 'cms_version_blocks';

    public function getBlocksForVersion(string $versionId): array
    {
        $sql = "SELECT * FROM `cms_version_blocks` WHERE `version_id` = ? ORDER BY `sort_order` ASC";
        $stmt = $this->connection->getPdo()->prepare($sql);
        $stmt->execute([$versionId]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];

        foreach ($rows as &$row) {
            if (isset($row['config_json']) && is_string($row['config_json'])) {
                $row['config'] = json_decode($row['config_json'], true) ?: [];
            }
        }
        return $rows;
    }

    public function syncBlocks(string $versionId, array $blocks): void
    {
        $pdo = $this->connection->getPdo();
        $stmtDelete = $pdo->prepare("DELETE FROM `cms_version_blocks` WHERE `version_id` = ?");
        $stmtDelete->execute([$versionId]);

        $stmtInsert = $pdo->prepare(
            "INSERT INTO `cms_version_blocks` (`id`, `version_id`, `block_id`, `type`, `sort_order`, `is_visible`, `config_json`, `created_at`)
             VALUES (?, ?, ?, ?, ?, ?, ?, NOW())"
        );

        foreach ($blocks as $idx => $b) {
            $bId = $b['id'] ?? ('blk-' . ($idx + 1));
            $vblkId = 'vblk-' . $versionId . '-' . $bId;
            $config = $b['config'] ?? $b;
            $stmtInsert->execute([
                $vblkId,
                $versionId,
                $bId,
                $b['type'] ?? 'custom',
                $b['sortOrder'] ?? ($idx + 1),
                isset($b['isVisible']) ? ($b['isVisible'] ? 1 : 0) : 1,
                json_encode($config, JSON_UNESCAPED_UNICODE)
            ]);
        }
    }
}

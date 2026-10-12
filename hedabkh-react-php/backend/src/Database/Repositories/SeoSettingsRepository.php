<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Database\Repositories;

use PDO;

class SeoSettingsRepository extends BaseRepository
{
    protected string $table = 'settings_seo';

    public function getSeoForPage(string $pageKey): ?array
    {
        $sql = "SELECT * FROM `settings_seo` WHERE `page_key` = ? LIMIT 1";
        $stmt = $this->connection->getPdo()->prepare($sql);
        $stmt->execute([$pageKey]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$row) return null;

        $row['keywords_ar'] = json_decode($row['keywords_ar_json'] ?? '[]', true) ?: [];
        $row['keywords_en'] = json_decode($row['keywords_en_json'] ?? '[]', true) ?: [];
        return $row;
    }

    public function getAllSeo(): array
    {
        $sql = "SELECT * FROM `settings_seo`";
        $stmt = $this->connection->getPdo()->query($sql);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];

        foreach ($rows as &$row) {
            $row['keywords_ar'] = json_decode($row['keywords_ar_json'] ?? '[]', true) ?: [];
            $row['keywords_en'] = json_decode($row['keywords_en_json'] ?? '[]', true) ?: [];
        }
        return $rows;
    }
}

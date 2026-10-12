<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Database\Repositories;

use PDO;

class BrandSettingsRepository extends BaseRepository
{
    protected string $table = 'settings_brand';

    public function getBrandSettings(): array
    {
        $sql = "SELECT `value_json` FROM `settings_brand` WHERE `key_name` = 'brand_identity' LIMIT 1";
        $stmt = $this->connection->getPdo()->query($sql);
        $val = $stmt->fetchColumn();
        if ($val && is_string($val)) {
            return json_decode($val, true) ?: [];
        }
        return [];
    }

    public function saveBrandSettings(array $data): bool
    {
        $json = json_encode($data, JSON_UNESCAPED_UNICODE);
        $sql = "INSERT INTO `settings_brand` (`id`, `key_name`, `value_json`, `updated_at`) 
                VALUES ('brand-identity', 'brand_identity', ?, NOW())
                ON DUPLICATE KEY UPDATE `value_json` = VALUES(`value_json`), `updated_at` = NOW()";
        $stmt = $this->connection->getPdo()->prepare($sql);
        return $stmt->execute([$json]);
    }
}

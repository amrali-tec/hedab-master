<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Database\Repositories;

use PDO;

class ServiceRepository extends BaseRepository
{
    protected string $table = 'services';

    public function getServicesWithDetails(bool $activeOnly = true): array
    {
        $sql = "SELECT * FROM `services`";
        $params = [];

        if ($activeOnly) {
            $sql .= " WHERE `is_active` = 1";
        }
        $sql .= " ORDER BY `sort_order` ASC";

        $stmt = $this->connection->getPdo()->prepare($sql);
        $stmt->execute($params);
        $services = $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];

        if (!empty($services)) {
            $serviceIds = array_column($services, 'id');
            $featuresMap = $this->getFeaturesForServices($serviceIds);
            $sectorsMap = $this->getSectorsForServices($serviceIds);

            foreach ($services as &$srv) {
                $srv['features'] = $featuresMap[$srv['id']] ?? [];
                $srv['sectors'] = $sectorsMap[$srv['id']] ?? [];
            }
        }

        return $services;
    }

    public function getServiceWithDetails(string $id): ?array
    {
        $service = $this->findById($id);
        if (!$service) {
            return null;
        }

        $featuresMap = $this->getFeaturesForServices([$id]);
        $sectorsMap = $this->getSectorsForServices([$id]);

        $service['features'] = $featuresMap[$id] ?? [];
        $service['sectors'] = $sectorsMap[$id] ?? [];
        return $service;
    }

    private function getFeaturesForServices(array $serviceIds): array
    {
        if (empty($serviceIds)) return [];
        $placeholders = implode(',', array_fill(0, count($serviceIds), '?'));
        $sql = "SELECT * FROM `service_features` WHERE `service_id` IN ({$placeholders}) ORDER BY `sort_order` ASC";
        $stmt = $this->connection->getPdo()->prepare($sql);
        $stmt->execute($serviceIds);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];

        $map = [];
        foreach ($rows as $row) {
            $map[$row['service_id']][] = [
                'id' => $row['id'],
                'feature_ar' => $row['feature_ar'],
                'feature_en' => $row['feature_en'],
                'sort_order' => $row['sort_order']
            ];
        }
        return $map;
    }

    private function getSectorsForServices(array $serviceIds): array
    {
        if (empty($serviceIds)) return [];
        $placeholders = implode(',', array_fill(0, count($serviceIds), '?'));
        $sql = "SELECT * FROM `service_sectors` WHERE `service_id` IN ({$placeholders}) ORDER BY `sort_order` ASC";
        $stmt = $this->connection->getPdo()->prepare($sql);
        $stmt->execute($serviceIds);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];

        $map = [];
        foreach ($rows as $row) {
            $map[$row['service_id']][] = [
                'id' => $row['id'],
                'sector_ar' => $row['sector_ar'],
                'sector_en' => $row['sector_en'],
                'sort_order' => $row['sort_order']
            ];
        }
        return $map;
    }

    public function syncDetails(string $serviceId, array $features, array $sectors): void
    {
        $pdo = $this->connection->getPdo();

        // Features
        $stmtDeleteF = $pdo->prepare("DELETE FROM `service_features` WHERE `service_id` = ?");
        $stmtDeleteF->execute([$serviceId]);
        $stmtInsertF = $pdo->prepare("INSERT INTO `service_features` (`service_id`, `feature_ar`, `feature_en`, `sort_order`) VALUES (?, ?, ?, ?)");
        foreach ($features as $idx => $f) {
            $fAr = is_array($f) ? ($f['feature_ar'] ?? '') : (string) $f;
            $fEn = is_array($f) ? ($f['feature_en'] ?? $fAr) : (string) $f;
            $stmtInsertF->execute([$serviceId, $fAr, $fEn, $idx + 1]);
        }

        // Sectors
        $stmtDeleteS = $pdo->prepare("DELETE FROM `service_sectors` WHERE `service_id` = ?");
        $stmtDeleteS->execute([$serviceId]);
        $stmtInsertS = $pdo->prepare("INSERT INTO `service_sectors` (`service_id`, `sector_ar`, `sector_en`, `sort_order`) VALUES (?, ?, ?, ?)");
        foreach ($sectors as $idx => $s) {
            $sAr = is_array($s) ? ($s['sector_ar'] ?? '') : (string) $s;
            $sEn = is_array($s) ? ($s['sector_en'] ?? $sAr) : (string) $s;
            $stmtInsertS->execute([$serviceId, $sAr, $sEn, $idx + 1]);
        }
    }
}

<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Services;

use Hedabkh\Backend\Database\Repositories\EquipmentRepository;
use Hedabkh\Backend\Http\HttpException;

class EquipmentService
{
    private EquipmentRepository $equipmentRepo;

    public function __construct(EquipmentRepository $equipmentRepo)
    {
        $this->equipmentRepo = $equipmentRepo;
    }

    public function getEquipment(array $params = []): array
    {
        $filters = [];
        if (!empty($params['category'])) {
            $filters['category'] = $params['category'];
        }
        if (isset($params['is_active'])) {
            $filters['is_active'] = $params['is_active'];
        }

        $items = $this->equipmentRepo->getFleet($filters);
        return array_map([$this, 'formatEquipment'], $items);
    }

    public function getEquipmentItem(string $id): array
    {
        $item = $this->equipmentRepo->findById($id);
        if (!$item) {
            throw HttpException::notFound("Equipment with identifier [{$id}] was not found.", 'EQUIPMENT_NOT_FOUND');
        }
        return $this->formatEquipment($item);
    }

    public function createEquipment(array $data): array
    {
        $id = $data['id'] ?? ('eq-' . bin2hex(random_bytes(4)));
        $record = [
            'id' => $id,
            'name_ar' => $data['name_ar'] ?? $data['nameAr'] ?? '',
            'name_en' => $data['name_en'] ?? $data['nameEn'] ?? '',
            'category_ar' => $data['category_ar'] ?? $data['categoryAr'] ?? '',
            'category_en' => $data['category_en'] ?? $data['categoryEn'] ?? '',
            'model' => $data['model'] ?? '',
            'brand' => $data['brand'] ?? '',
            'unit_count' => (int) ($data['unit_count'] ?? $data['count'] ?? 1),
            'image_url' => $data['image_url'] ?? $data['imageUrl'] ?? $data['image'] ?? '/images/equipment/wirtgen-milling-machine.jpg',
            'is_active' => isset($data['is_active']) ? (int) $data['is_active'] : 1,
            'sort_order' => (int) ($data['sort_order'] ?? 0)
        ];

        $this->equipmentRepo->insert($record);
        return $this->getEquipmentItem($id);
    }

    public function updateEquipment(string $id, array $data): array
    {
        if (!$this->equipmentRepo->exists($id)) {
            throw HttpException::notFound("Equipment with identifier [{$id}] was not found.", 'EQUIPMENT_NOT_FOUND');
        }

        $update = [];
        $allowed = ['name_ar', 'name_en', 'category_ar', 'category_en', 'model', 'brand', 'unit_count', 'image_url', 'is_active', 'sort_order'];
        foreach ($allowed as $f) {
            if (array_key_exists($f, $data)) {
                $update[$f] = $data[$f];
            }
        }

        if (!empty($update)) {
            $this->equipmentRepo->update($id, $update);
        }

        return $this->getEquipmentItem($id);
    }

    public function deleteEquipment(string $id): bool
    {
        if (!$this->equipmentRepo->exists($id)) {
            throw HttpException::notFound("Equipment with identifier [{$id}] was not found.", 'EQUIPMENT_NOT_FOUND');
        }
        return $this->equipmentRepo->delete($id);
    }

    public function formatEquipment(array $eq): array
    {
        return [
            'id' => $eq['id'],
            'nameAr' => $eq['name_ar'],
            'nameEn' => $eq['name_en'],
            'categoryAr' => $eq['category_ar'],
            'categoryEn' => $eq['category_en'],
            'model' => $eq['model'],
            'brand' => $eq['brand'],
            'count' => (int) $eq['unit_count'],
            'unitCount' => (int) $eq['unit_count'],
            'image' => $eq['image_url'],
            'imageUrl' => $eq['image_url'],
            'isActive' => (bool) $eq['is_active'],
            'sortOrder' => (int) $eq['sort_order']
        ];
    }
}

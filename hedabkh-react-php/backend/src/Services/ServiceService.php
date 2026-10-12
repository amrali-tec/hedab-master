<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Services;

use Hedabkh\Backend\Database\Repositories\ServiceRepository;
use Hedabkh\Backend\Http\HttpException;

class ServiceService
{
    private ServiceRepository $serviceRepo;

    public function __construct(ServiceRepository $serviceRepo)
    {
        $this->serviceRepo = $serviceRepo;
    }

    public function getServices(array $params = []): array
    {
        $locale = $params['locale'] ?? 'ar';
        $activeOnly = !isset($params['is_active']) || filter_var($params['is_active'], FILTER_VALIDATE_BOOLEAN);

        $services = $this->serviceRepo->getServicesWithDetails($activeOnly);
        return array_map(fn($s) => $this->formatService($s, $locale), $services);
    }

    public function getService(string $id, string $locale = 'ar'): array
    {
        $service = $this->serviceRepo->getServiceWithDetails($id);
        if (!$service) {
            throw HttpException::notFound("Service with identifier [{$id}] was not found.", 'SERVICE_NOT_FOUND');
        }

        return $this->formatService($service, $locale);
    }

    public function createService(array $data): array
    {
        $id = $data['id'] ?? ('srv-' . bin2hex(random_bytes(4)));
        $slug = $data['slug'] ?? ('service-' . $id);

        $record = [
            'id' => $id,
            'slug' => $slug,
            'title_ar' => $data['title_ar'] ?? $data['titleAr'] ?? $data['title'] ?? '',
            'title_en' => $data['title_en'] ?? $data['titleEn'] ?? '',
            'description_ar' => $data['description_ar'] ?? $data['descriptionAr'] ?? $data['description'] ?? '',
            'description_en' => $data['description_en'] ?? $data['descriptionEn'] ?? '',
            'icon_key' => $data['icon_key'] ?? $data['iconKey'] ?? $data['icon'] ?? 'building-icon',
            'is_active' => isset($data['is_active']) ? (int) $data['is_active'] : 1,
            'sort_order' => (int) ($data['sort_order'] ?? 0)
        ];

        $this->serviceRepo->insert($record);

        $features = $data['features'] ?? [];
        $sectors = $data['sectors'] ?? [];
        $this->serviceRepo->syncDetails($id, $features, $sectors);

        return $this->getService($id);
    }

    public function updateService(string $id, array $data): array
    {
        if (!$this->serviceRepo->exists($id)) {
            throw HttpException::notFound("Service with identifier [{$id}] was not found.", 'SERVICE_NOT_FOUND');
        }

        $update = [];
        $allowed = ['slug', 'title_ar', 'title_en', 'description_ar', 'description_en', 'icon_key', 'is_active', 'sort_order'];
        foreach ($allowed as $f) {
            if (array_key_exists($f, $data)) {
                $update[$f] = $data[$f];
            }
        }

        if (!empty($update)) {
            $this->serviceRepo->update($id, $update);
        }

        if (isset($data['features']) || isset($data['sectors'])) {
            $existing = $this->serviceRepo->getServiceWithDetails($id);
            $features = $data['features'] ?? $existing['features'] ?? [];
            $sectors = $data['sectors'] ?? $existing['sectors'] ?? [];
            $this->serviceRepo->syncDetails($id, $features, $sectors);
        }

        return $this->getService($id);
    }

    public function deleteService(string $id): bool
    {
        if (!$this->serviceRepo->exists($id)) {
            throw HttpException::notFound("Service with identifier [{$id}] was not found.", 'SERVICE_NOT_FOUND');
        }
        return $this->serviceRepo->delete($id);
    }

    private function formatService(array $s, string $locale): array
    {
        $features = [];
        if (!empty($s['features'])) {
            foreach ($s['features'] as $f) {
                $features[] = $locale === 'en' ? ($f['feature_en'] ?: $f['feature_ar']) : $f['feature_ar'];
            }
        }

        $sectors = [];
        if (!empty($s['sectors'])) {
            foreach ($s['sectors'] as $sec) {
                $sectors[] = $locale === 'en' ? ($sec['sector_en'] ?: $sec['sector_ar']) : $sec['sector_ar'];
            }
        }

        return [
            'id' => $s['id'],
            'slug' => $s['slug'] ?? $s['id'],
            'title' => $locale === 'en' ? ($s['title_en'] ?: $s['title_ar']) : $s['title_ar'],
            'titleAr' => $s['title_ar'],
            'titleEn' => $s['title_en'],
            'description' => $locale === 'en' ? ($s['description_en'] ?: $s['description_ar']) : $s['description_ar'],
            'descriptionAr' => $s['description_ar'],
            'descriptionEn' => $s['description_en'],
            'icon' => $s['icon_key'],
            'iconKey' => $s['icon_key'],
            'features' => $features,
            'sectors' => $sectors,
            'sortOrder' => (int) $s['sort_order'],
            'isActive' => (bool) $s['is_active']
        ];
    }
}

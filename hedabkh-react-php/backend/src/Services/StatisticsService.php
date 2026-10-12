<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Services;

use Hedabkh\Backend\Database\Repositories\StatisticsRepository;

class StatisticsService
{
    private StatisticsRepository $statsRepo;

    public function __construct(StatisticsRepository $statsRepo)
    {
        $this->statsRepo = $statsRepo;
    }

    public function getStatistics(string $locale = 'ar'): array
    {
        $rows = $this->statsRepo->getAllStats();
        return array_map(function ($s) use ($locale) {
            return [
                'id' => $s['id'],
                'key' => $s['key_name'],
                'keyName' => $s['key_name'],
                'value' => (int) $s['value_num'],
                'valueNum' => (int) $s['value_num'],
                'prefix' => $locale === 'en' ? ($s['prefix_en'] ?? '') : ($s['prefix_ar'] ?? ''),
                'suffix' => $locale === 'en' ? ($s['suffix_en'] ?? '') : ($s['suffix_ar'] ?? ''),
                'prefixAr' => $s['prefix_ar'],
                'prefixEn' => $s['prefix_en'],
                'suffixAr' => $s['suffix_ar'],
                'suffixEn' => $s['suffix_en'],
                'label' => $locale === 'en' ? ($s['label_en'] ?: $s['label_ar']) : $s['label_ar'],
                'labelAr' => $s['label_ar'],
                'labelEn' => $s['label_en'],
                'description' => $locale === 'en' ? ($s['description_en'] ?: $s['description_ar']) : $s['description_ar'],
                'descriptionAr' => $s['description_ar'],
                'descriptionEn' => $s['description_en'],
                'icon' => $s['icon_key'],
                'iconKey' => $s['icon_key'],
                'sortOrder' => (int) $s['sort_order']
            ];
        }, $rows);
    }

    public function updateStatistic(string $id, array $data): array
    {
        $update = [];
        $allowed = ['value_num', 'prefix_ar', 'prefix_en', 'suffix_ar', 'suffix_en', 'label_ar', 'label_en', 'description_ar', 'description_en', 'icon_key', 'sort_order'];
        foreach ($allowed as $f) {
            if (array_key_exists($f, $data)) {
                $update[$f] = $data[$f];
            }
        }
        if (isset($data['value'])) $update['value_num'] = (int) $data['value'];

        $this->statsRepo->update($id, $update);
        return $this->statsRepo->findById($id) ?: [];
    }
}

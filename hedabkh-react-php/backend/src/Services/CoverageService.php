<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Services;

use Hedabkh\Backend\Database\Repositories\CoverageRegionRepository;

class CoverageService
{
    private CoverageRegionRepository $coverageRepo;

    public function __construct(CoverageRegionRepository $coverageRepo)
    {
        $this->coverageRepo = $coverageRepo;
    }

    public function getRegions(string $locale = 'ar'): array
    {
        $rows = $this->coverageRepo->getRegions();
        return array_map(function ($r) use ($locale) {
            return [
                'id' => $r['id'],
                'name' => $locale === 'en' ? ($r['name_en'] ?: $r['name_ar']) : $r['name_ar'],
                'nameAr' => $r['name_ar'],
                'nameEn' => $r['name_en'],
                'activeProjectsCount' => (int) $r['active_projects_count'],
                'coverage' => $locale === 'en' ? ($r['coverage_en'] ?: $r['coverage_ar']) : $r['coverage_ar'],
                'coverageAr' => $r['coverage_ar'],
                'coverageEn' => $r['coverage_en'],
                'headquarters' => $locale === 'en' ? ($r['headquarters_en'] ?: $r['headquarters_ar']) : $r['headquarters_ar'],
                'headquartersAr' => $r['headquarters_ar'],
                'headquartersEn' => $r['headquarters_en'],
                'fleetCount' => $r['fleet_count_label'],
                'fleetCountLabel' => $r['fleet_count_label'],
                'status' => $r['status'],
                'sortOrder' => (int) $r['sort_order']
            ];
        }, $rows);
    }
}

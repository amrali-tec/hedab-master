<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Services;

use Hedabkh\Backend\Database\Repositories\TimelineMilestoneRepository;

class TimelineService
{
    private TimelineMilestoneRepository $timelineRepo;

    public function __construct(TimelineMilestoneRepository $timelineRepo)
    {
        $this->timelineRepo = $timelineRepo;
    }

    public function getTimeline(string $locale = 'ar'): array
    {
        $rows = $this->timelineRepo->getMilestones();
        return array_map(function ($m) use ($locale) {
            return [
                'id' => $m['id'],
                'year' => $locale === 'en' ? $m['year_label_en'] : $m['year_label_ar'],
                'yearLabelAr' => $m['year_label_ar'],
                'yearLabelEn' => $m['year_label_en'],
                'title' => $locale === 'en' ? ($m['title_en'] ?: $m['title_ar']) : $m['title_ar'],
                'titleAr' => $m['title_ar'],
                'titleEn' => $m['title_en'],
                'description' => $locale === 'en' ? ($m['description_en'] ?: $m['description_ar']) : $m['description_ar'],
                'descriptionAr' => $m['description_ar'],
                'descriptionEn' => $m['description_en'],
                'colorCard' => $m['color_card'],
                'colorRing' => $m['color_ring'],
                'sortOrder' => (int) $m['sort_order'],
                'isActive' => (bool) $m['is_active']
            ];
        }, $rows);
    }
}

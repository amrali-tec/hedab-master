<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Controllers\Public;

use Hedabkh\Backend\Http\JsonResponse;
use Hedabkh\Backend\Http\Request;
use Hedabkh\Backend\Services\TimelineService;

class TimelineController
{
    private TimelineService $timelineService;

    public function __construct(TimelineService $timelineService)
    {
        $this->timelineService = $timelineService;
    }

    public function index(Request $request): JsonResponse
    {
        $locale = (string) $request->getQuery('locale', 'ar');
        $milestones = $this->timelineService->getTimeline($locale);
        return JsonResponse::success($milestones, ['locale' => $locale]);
    }
}

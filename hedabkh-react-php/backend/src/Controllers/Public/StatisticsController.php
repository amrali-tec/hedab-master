<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Controllers\Public;

use Hedabkh\Backend\Http\JsonResponse;
use Hedabkh\Backend\Http\Request;
use Hedabkh\Backend\Services\StatisticsService;

class StatisticsController
{
    private StatisticsService $statsService;

    public function __construct(StatisticsService $statsService)
    {
        $this->statsService = $statsService;
    }

    public function index(Request $request): JsonResponse
    {
        $locale = (string) $request->getQuery('locale', 'ar');
        $stats = $this->statsService->getStatistics($locale);
        return JsonResponse::success($stats, ['locale' => $locale]);
    }
}

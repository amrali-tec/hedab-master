<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Controllers\Admin;

use Hedabkh\Backend\Http\JsonResponse;
use Hedabkh\Backend\Http\Request;
use Hedabkh\Backend\Services\StatisticsService;

class AdminStatisticsController
{
    private StatisticsService $statsService;

    public function __construct(StatisticsService $statsService)
    {
        $this->statsService = $statsService;
    }

    public function index(Request $request): JsonResponse
    {
        $stats = $this->statsService->getStatistics();
        return JsonResponse::success($stats);
    }

    public function update(Request $request): JsonResponse
    {
        $id = (string) $request->getRouteParam('id');
        $body = $request->getBody();
        $stat = $this->statsService->updateStatistic($id, $body);
        return JsonResponse::success($stat);
    }
}

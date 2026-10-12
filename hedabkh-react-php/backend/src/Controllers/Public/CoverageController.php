<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Controllers\Public;

use Hedabkh\Backend\Http\JsonResponse;
use Hedabkh\Backend\Http\Request;
use Hedabkh\Backend\Services\CoverageService;

class CoverageController
{
    private CoverageService $coverageService;

    public function __construct(CoverageService $coverageService)
    {
        $this->coverageService = $coverageService;
    }

    public function index(Request $request): JsonResponse
    {
        $locale = (string) $request->getQuery('locale', 'ar');
        $regions = $this->coverageService->getRegions($locale);
        return JsonResponse::success($regions, ['locale' => $locale]);
    }
}

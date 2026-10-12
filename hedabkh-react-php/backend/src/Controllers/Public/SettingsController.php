<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Controllers\Public;

use Hedabkh\Backend\Http\JsonResponse;
use Hedabkh\Backend\Http\Request;
use Hedabkh\Backend\Services\SettingsService;

class SettingsController
{
    private SettingsService $settingsService;

    public function __construct(SettingsService $settingsService)
    {
        $this->settingsService = $settingsService;
    }

    public function brand(Request $request): JsonResponse
    {
        $brand = $this->settingsService->getBrandSettings();
        return JsonResponse::success($brand);
    }

    public function seo(Request $request): JsonResponse
    {
        $pageKey = $request->getQuery('page');
        $seo = $this->settingsService->getSeoSettings($pageKey ? (string) $pageKey : null);
        return JsonResponse::success($seo);
    }
}

<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Controllers\Admin;

use Hedabkh\Backend\Http\JsonResponse;
use Hedabkh\Backend\Http\Request;
use Hedabkh\Backend\Services\SettingsService;

class AdminSettingsController
{
    private SettingsService $settingsService;

    public function __construct(SettingsService $settingsService)
    {
        $this->settingsService = $settingsService;
    }

    public function getSettings(Request $request): JsonResponse
    {
        $brand = $this->settingsService->getBrandSettings();
        $seo = $this->settingsService->getSeoSettings();
        return JsonResponse::success(['brand' => $brand, 'seo' => $seo]);
    }

    public function updateBrand(Request $request): JsonResponse
    {
        $body = $request->getBody();
        $updated = $this->settingsService->updateBrandSettings($body);
        return JsonResponse::success($updated);
    }

    public function updateSeo(Request $request): JsonResponse
    {
        $pageKey = (string) $request->input('pageKey', $request->input('page_key', 'home'));
        $body = $request->getBody();
        $updated = $this->settingsService->updateSeoSettings($pageKey, $body);
        return JsonResponse::success($updated);
    }
}

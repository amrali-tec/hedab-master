<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Controllers\Public;

use Hedabkh\Backend\Http\JsonResponse;
use Hedabkh\Backend\Http\Request;
use Hedabkh\Backend\Services\CmsService;

class CmsPublicController
{
    private CmsService $cmsService;

    public function __construct(CmsService $cmsService)
    {
        $this->cmsService = $cmsService;
    }

    public function show(Request $request): JsonResponse
    {
        $pageId = (string) $request->getRouteParam('pageId');
        $locale = (string) $request->getQuery('locale', 'ar');
        $version = (string) $request->getQuery('version', 'published');

        // Public requests can only fetch published version
        $data = $this->cmsService->getPage($pageId, $version === 'draft' ? 'published' : 'published', $locale);
        return JsonResponse::success($data, ['locale' => $locale]);
    }
}

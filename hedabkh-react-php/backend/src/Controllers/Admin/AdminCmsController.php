<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Controllers\Admin;

use Hedabkh\Backend\Http\JsonResponse;
use Hedabkh\Backend\Http\Request;
use Hedabkh\Backend\Services\CmsService;

class AdminCmsController
{
    private CmsService $cmsService;

    public function __construct(CmsService $cmsService)
    {
        $this->cmsService = $cmsService;
    }

    public function pages(Request $request): JsonResponse
    {
        $pages = $this->cmsService->getPages();
        return JsonResponse::success($pages);
    }

    public function getPage(Request $request): JsonResponse
    {
        $pageId = (string) $request->getRouteParam('pageId');
        $version = (string) $request->getQuery('version', 'published');
        $page = $this->cmsService->getPage($pageId, $version);
        return JsonResponse::success($page);
    }

    public function saveDraft(Request $request): JsonResponse
    {
        $pageId = (string) $request->getRouteParam('pageId');
        $body = $request->getBody();
        $blocks = $body['blocks'] ?? [];
        $changeNote = $body['changeNote'] ?? $body['change_note'] ?? null;
        $user = $request->getUser();

        $result = $this->cmsService->saveDraft($pageId, $blocks, $changeNote, $user['id'] ?? 'usr-admin-1');
        return JsonResponse::success($result);
    }

    public function publish(Request $request): JsonResponse
    {
        $pageId = (string) $request->getRouteParam('pageId');
        $user = $request->getUser();
        $result = $this->cmsService->publishPage($pageId, $user['id'] ?? 'usr-admin-1');
        return JsonResponse::success($result);
    }

    public function rollback(Request $request): JsonResponse
    {
        $pageId = (string) $request->getRouteParam('pageId');
        $versionNumber = (int) $request->getRouteParam('versionNumber');
        $user = $request->getUser();
        $result = $this->cmsService->rollbackVersion($pageId, $versionNumber, $user['id'] ?? 'usr-admin-1');
        return JsonResponse::success($result);
    }
}

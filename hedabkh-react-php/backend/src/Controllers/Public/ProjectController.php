<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Controllers\Public;

use Hedabkh\Backend\Http\JsonResponse;
use Hedabkh\Backend\Http\Request;
use Hedabkh\Backend\Services\ProjectService;

class ProjectController
{
    private ProjectService $projectService;

    public function __construct(ProjectService $projectService)
    {
        $this->projectService = $projectService;
    }

    public function index(Request $request): JsonResponse
    {
        $params = $request->getQueryParams();
        $result = $this->projectService->getProjects($params);
        return JsonResponse::success($result['data'], ['pagination' => $result['pagination'], 'locale' => $params['locale'] ?? 'ar']);
    }

    public function show(Request $request): JsonResponse
    {
        $id = (string) $request->getRouteParam('id');
        $locale = (string) $request->getQuery('locale', 'ar');
        $project = $this->projectService->getProject($id, $locale);
        return JsonResponse::success($project, ['locale' => $locale]);
    }
}

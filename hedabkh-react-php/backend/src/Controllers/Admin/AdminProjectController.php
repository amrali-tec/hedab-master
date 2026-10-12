<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Controllers\Admin;

use Hedabkh\Backend\Http\JsonResponse;
use Hedabkh\Backend\Http\Request;
use Hedabkh\Backend\Services\ProjectService;
use Hedabkh\Backend\Validation\RequestValidator;

class AdminProjectController
{
    private ProjectService $projectService;

    public function __construct(ProjectService $projectService)
    {
        $this->projectService = $projectService;
    }

    public function index(Request $request): JsonResponse
    {
        $params = $request->getQueryParams();
        $params['is_active'] = $params['is_active'] ?? null; // admin can see all
        $result = $this->projectService->getProjects($params);
        return JsonResponse::success($result['data'], ['pagination' => $result['pagination']]);
    }

    public function show(Request $request): JsonResponse
    {
        $id = (string) $request->getRouteParam('id');
        $project = $this->projectService->getProject($id);
        return JsonResponse::success($project);
    }

    public function store(Request $request): JsonResponse
    {
        $body = $request->getBody();
        $body['title_ar'] = $body['title_ar'] ?? $body['titleAr'] ?? $body['title'] ?? null;
        $body['description_ar'] = $body['description_ar'] ?? $body['descriptionAr'] ?? $body['description'] ?? null;
        $body['category_ar'] = $body['category_ar'] ?? $body['categoryAr'] ?? $body['category'] ?? null;
        $body['image_url'] = $body['image_url'] ?? $body['imageUrl'] ?? $body['image'] ?? '/images/projects/project-1.jpg';

        RequestValidator::validate($body, [
            'title_ar' => 'required|string|min:3',
            'description_ar' => 'required|string',
            'category_ar' => 'required|string',
            'image_url' => 'required|string'
        ]);

        $project = $this->projectService->createProject($body);
        return JsonResponse::success($project, [], 201);
    }

    public function update(Request $request): JsonResponse
    {
        $id = (string) $request->getRouteParam('id');
        $body = $request->getBody();
        if (isset($body['title']) && !isset($body['title_ar']) && !isset($body['titleAr'])) {
            $body['title_ar'] = $body['title'];
        }
        if (isset($body['description']) && !isset($body['description_ar']) && !isset($body['descriptionAr'])) {
            $body['description_ar'] = $body['description'];
        }
        if (isset($body['category']) && !isset($body['category_ar']) && !isset($body['categoryAr'])) {
            $body['category_ar'] = $body['category'];
        }
        if (isset($body['image']) && !isset($body['image_url']) && !isset($body['imageUrl'])) {
            $body['image_url'] = $body['image'];
        }
        $project = $this->projectService->updateProject($id, $body);
        return JsonResponse::success($project);
    }

    public function destroy(Request $request): JsonResponse
    {
        $id = (string) $request->getRouteParam('id');
        $this->projectService->deleteProject($id);
        return JsonResponse::success(['message' => "Project [{$id}] deleted successfully."]);
    }
}

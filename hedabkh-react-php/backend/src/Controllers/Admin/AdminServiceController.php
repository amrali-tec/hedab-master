<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Controllers\Admin;

use Hedabkh\Backend\Http\JsonResponse;
use Hedabkh\Backend\Http\Request;
use Hedabkh\Backend\Services\ServiceService;
use Hedabkh\Backend\Validation\RequestValidator;

class AdminServiceController
{
    private ServiceService $serviceService;

    public function __construct(ServiceService $serviceService)
    {
        $this->serviceService = $serviceService;
    }

    public function index(Request $request): JsonResponse
    {
        $services = $this->serviceService->getServices(['is_active' => false]); // fetch all for admin
        return JsonResponse::success($services);
    }

    public function show(Request $request): JsonResponse
    {
        $id = (string) $request->getRouteParam('id');
        $service = $this->serviceService->getService($id);
        return JsonResponse::success($service);
    }

    public function store(Request $request): JsonResponse
    {
        $body = $request->getBody();
        $body['title_ar'] = $body['title_ar'] ?? $body['titleAr'] ?? $body['title'] ?? null;
        $body['description_ar'] = $body['description_ar'] ?? $body['descriptionAr'] ?? $body['description'] ?? null;

        RequestValidator::validate($body, [
            'title_ar' => 'required|string|min:3',
            'description_ar' => 'required|string'
        ]);

        $service = $this->serviceService->createService($body);
        return JsonResponse::success($service, [], 201);
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
        $service = $this->serviceService->updateService($id, $body);
        return JsonResponse::success($service);
    }

    public function destroy(Request $request): JsonResponse
    {
        $id = (string) $request->getRouteParam('id');
        $this->serviceService->deleteService($id);
        return JsonResponse::success(['message' => "Service [{$id}] deleted successfully."]);
    }
}

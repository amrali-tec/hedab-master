<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Controllers\Public;

use Hedabkh\Backend\Http\JsonResponse;
use Hedabkh\Backend\Http\Request;
use Hedabkh\Backend\Services\ServiceService;

class ServiceController
{
    private ServiceService $serviceService;

    public function __construct(ServiceService $serviceService)
    {
        $this->serviceService = $serviceService;
    }

    public function index(Request $request): JsonResponse
    {
        $params = $request->getQueryParams();
        $services = $this->serviceService->getServices($params);
        return JsonResponse::success($services, ['locale' => $params['locale'] ?? 'ar']);
    }

    public function show(Request $request): JsonResponse
    {
        $id = (string) $request->getRouteParam('id');
        $locale = (string) $request->getQuery('locale', 'ar');
        $service = $this->serviceService->getService($id, $locale);
        return JsonResponse::success($service, ['locale' => $locale]);
    }
}

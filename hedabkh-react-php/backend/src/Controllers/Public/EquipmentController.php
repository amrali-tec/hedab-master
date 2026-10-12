<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Controllers\Public;

use Hedabkh\Backend\Http\JsonResponse;
use Hedabkh\Backend\Http\Request;
use Hedabkh\Backend\Services\EquipmentService;

class EquipmentController
{
    private EquipmentService $equipmentService;

    public function __construct(EquipmentService $equipmentService)
    {
        $this->equipmentService = $equipmentService;
    }

    public function index(Request $request): JsonResponse
    {
        $params = $request->getQueryParams();
        $fleet = $this->equipmentService->getEquipment($params);
        return JsonResponse::success($fleet);
    }

    public function show(Request $request): JsonResponse
    {
        $id = (string) $request->getRouteParam('id');
        $item = $this->equipmentService->getEquipmentItem($id);
        return JsonResponse::success($item);
    }
}

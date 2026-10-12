<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Controllers\Admin;

use Hedabkh\Backend\Http\JsonResponse;
use Hedabkh\Backend\Http\Request;
use Hedabkh\Backend\Services\EquipmentService;
use Hedabkh\Backend\Validation\RequestValidator;

class AdminEquipmentController
{
    private EquipmentService $equipmentService;

    public function __construct(EquipmentService $equipmentService)
    {
        $this->equipmentService = $equipmentService;
    }

    public function index(Request $request): JsonResponse
    {
        $fleet = $this->equipmentService->getEquipment();
        return JsonResponse::success($fleet);
    }

    public function show(Request $request): JsonResponse
    {
        $id = (string) $request->getRouteParam('id');
        $item = $this->equipmentService->getEquipmentItem($id);
        return JsonResponse::success($item);
    }

    public function store(Request $request): JsonResponse
    {
        $body = $request->getBody();
        $body['name_ar'] = $body['name_ar'] ?? $body['nameAr'] ?? $body['name'] ?? null;
        $body['category_ar'] = $body['category_ar'] ?? $body['categoryAr'] ?? $body['category'] ?? null;
        $body['model'] = $body['model'] ?? 'Standard';
        $body['brand'] = $body['brand'] ?? 'HEDABKH';

        RequestValidator::validate($body, [
            'name_ar' => 'required|string|min:2',
            'category_ar' => 'required|string',
            'model' => 'required|string',
            'brand' => 'required|string'
        ]);

        $item = $this->equipmentService->createEquipment($body);
        return JsonResponse::success($item, [], 201);
    }

    public function update(Request $request): JsonResponse
    {
        $id = (string) $request->getRouteParam('id');
        $body = $request->getBody();
        if (isset($body['name']) && !isset($body['name_ar']) && !isset($body['nameAr'])) {
            $body['name_ar'] = $body['name'];
        }
        if (isset($body['nameAr']) && !isset($body['name_ar'])) {
            $body['name_ar'] = $body['nameAr'];
        }
        if (isset($body['category']) && !isset($body['category_ar']) && !isset($body['categoryAr'])) {
            $body['category_ar'] = $body['category'];
        }
        if (isset($body['categoryAr']) && !isset($body['category_ar'])) {
            $body['category_ar'] = $body['categoryAr'];
        }
        $item = $this->equipmentService->updateEquipment($id, $body);
        return JsonResponse::success($item);
    }

    public function destroy(Request $request): JsonResponse
    {
        $id = (string) $request->getRouteParam('id');
        $this->equipmentService->deleteEquipment($id);
        return JsonResponse::success(['message' => "Equipment [{$id}] deleted successfully."]);
    }
}

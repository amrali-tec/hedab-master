<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Controllers\Admin;

use Hedabkh\Backend\Http\JsonResponse;
use Hedabkh\Backend\Http\Request;
use Hedabkh\Backend\Services\PartnerService;
use Hedabkh\Backend\Validation\RequestValidator;

class AdminPartnerController
{
    private PartnerService $partnerService;

    public function __construct(PartnerService $partnerService)
    {
        $this->partnerService = $partnerService;
    }

    public function index(Request $request): JsonResponse
    {
        $partners = $this->partnerService->getPartners();
        return JsonResponse::success($partners);
    }

    public function show(Request $request): JsonResponse
    {
        $id = (string) $request->getRouteParam('id');
        $partner = $this->partnerService->getPartner($id);
        return JsonResponse::success($partner);
    }

    public function store(Request $request): JsonResponse
    {
        $body = $request->getBody();
        $body['name_ar'] = $body['name_ar'] ?? $body['nameAr'] ?? $body['name'] ?? null;
        $body['logo_url'] = $body['logo_url'] ?? $body['logoUrl'] ?? $body['logo'] ?? '/images/logos/balady-platform.png';

        RequestValidator::validate($body, [
            'name_ar' => 'required|string',
            'logo_url' => 'required|string'
        ]);

        $partner = $this->partnerService->createPartner($body);
        return JsonResponse::success($partner, [], 201);
    }

    public function update(Request $request): JsonResponse
    {
        $id = (string) $request->getRouteParam('id');
        $body = $request->getBody();
        if (isset($body['name']) && !isset($body['name_ar']) && !isset($body['nameAr'])) {
            $body['name_ar'] = $body['name'];
        }
        if (isset($body['logo']) && !isset($body['logo_url']) && !isset($body['logoUrl'])) {
            $body['logo_url'] = $body['logo'];
        }
        $partner = $this->partnerService->updatePartner($id, $body);
        return JsonResponse::success($partner);
    }

    public function destroy(Request $request): JsonResponse
    {
        $id = (string) $request->getRouteParam('id');
        $this->partnerService->deletePartner($id);
        return JsonResponse::success(['message' => "Partner [{$id}] deleted successfully."]);
    }
}

<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Controllers\Public;

use Hedabkh\Backend\Http\JsonResponse;
use Hedabkh\Backend\Http\Request;
use Hedabkh\Backend\Services\PartnerService;

class PartnerController
{
    private PartnerService $partnerService;

    public function __construct(PartnerService $partnerService)
    {
        $this->partnerService = $partnerService;
    }

    public function index(Request $request): JsonResponse
    {
        $params = $request->getQueryParams();
        $partners = $this->partnerService->getPartners($params);
        return JsonResponse::success($partners);
    }
}

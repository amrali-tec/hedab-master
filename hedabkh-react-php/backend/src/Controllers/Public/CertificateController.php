<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Controllers\Public;

use Hedabkh\Backend\Http\JsonResponse;
use Hedabkh\Backend\Http\Request;
use Hedabkh\Backend\Services\CertificateService;

class CertificateController
{
    private CertificateService $certService;

    public function __construct(CertificateService $certService)
    {
        $this->certService = $certService;
    }

    public function index(Request $request): JsonResponse
    {
        $params = $request->getQueryParams();
        $certs = $this->certService->getCertificates($params);
        return JsonResponse::success($certs);
    }

    public function show(Request $request): JsonResponse
    {
        $id = (string) $request->getRouteParam('id');
        $cert = $this->certService->getCertificate($id);
        return JsonResponse::success($cert);
    }
}

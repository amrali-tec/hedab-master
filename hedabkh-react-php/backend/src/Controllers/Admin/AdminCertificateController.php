<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Controllers\Admin;

use Hedabkh\Backend\Http\JsonResponse;
use Hedabkh\Backend\Http\Request;
use Hedabkh\Backend\Services\CertificateService;
use Hedabkh\Backend\Validation\RequestValidator;

class AdminCertificateController
{
    private CertificateService $certService;

    public function __construct(CertificateService $certService)
    {
        $this->certService = $certService;
    }

    public function index(Request $request): JsonResponse
    {
        $certs = $this->certService->getCertificates();
        return JsonResponse::success($certs);
    }

    public function show(Request $request): JsonResponse
    {
        $id = (string) $request->getRouteParam('id');
        $cert = $this->certService->getCertificate($id);
        return JsonResponse::success($cert);
    }

    public function store(Request $request): JsonResponse
    {
        $body = $request->getBody();
        $body['title_ar'] = $body['title_ar'] ?? $body['titleAr'] ?? $body['title'] ?? null;
        $body['issuer_ar'] = $body['issuer_ar'] ?? $body['issuerAr'] ?? $body['issuer'] ?? 'هيئة المواصفات';
        $body['id_number'] = $body['id_number'] ?? $body['idNumber'] ?? ('CERT-' . time());

        RequestValidator::validate($body, [
            'title_ar' => 'required|string',
            'issuer_ar' => 'required|string',
            'id_number' => 'required|string'
        ]);

        $cert = $this->certService->createCertificate($body);
        return JsonResponse::success($cert, [], 201);
    }

    public function update(Request $request): JsonResponse
    {
        $id = (string) $request->getRouteParam('id');
        $body = $request->getBody();
        if (isset($body['title']) && !isset($body['title_ar']) && !isset($body['titleAr'])) {
            $body['title_ar'] = $body['title'];
        }
        if (isset($body['issuer']) && !isset($body['issuer_ar']) && !isset($body['issuerAr'])) {
            $body['issuer_ar'] = $body['issuer'];
        }
        if (isset($body['idNumber']) && !isset($body['id_number'])) {
            $body['id_number'] = $body['idNumber'];
        }
        $cert = $this->certService->updateCertificate($id, $body);
        return JsonResponse::success($cert);
    }

    public function destroy(Request $request): JsonResponse
    {
        $id = (string) $request->getRouteParam('id');
        $this->certService->deleteCertificate($id);
        return JsonResponse::success(['message' => "Certificate [{$id}] deleted successfully."]);
    }
}

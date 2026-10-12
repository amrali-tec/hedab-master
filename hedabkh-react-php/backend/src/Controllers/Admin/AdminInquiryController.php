<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Controllers\Admin;

use Hedabkh\Backend\Http\JsonResponse;
use Hedabkh\Backend\Http\Request;
use Hedabkh\Backend\Services\InquiryService;
use Hedabkh\Backend\Validation\RequestValidator;

class AdminInquiryController
{
    private InquiryService $inquiryService;

    public function __construct(InquiryService $inquiryService)
    {
        $this->inquiryService = $inquiryService;
    }

    public function index(Request $request): JsonResponse
    {
        $params = $request->getQueryParams();
        $inquiries = $this->inquiryService->getInquiries($params);
        return JsonResponse::success($inquiries);
    }

    public function updateStatus(Request $request): JsonResponse
    {
        $id = (string) $request->getRouteParam('id');
        $body = $request->getBody();
        $status = str_replace('-', '_', (string)($body['status'] ?? 'new'));
        RequestValidator::validate(['status' => $status], [
            'status' => 'required|in:new,in_progress,in-progress,resolved,contacted,archived'
        ]);

        $res = $this->inquiryService->updateStatus($id, $status, $body['notes'] ?? null);
        return JsonResponse::success($res);
    }

    public function destroy(Request $request): JsonResponse
    {
        $id = (string) $request->getRouteParam('id');
        $this->inquiryService->deleteInquiry($id);
        return JsonResponse::success(['message' => "Inquiry [{$id}] deleted successfully."]);
    }
}

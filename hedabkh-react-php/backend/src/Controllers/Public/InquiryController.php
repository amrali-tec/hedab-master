<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Controllers\Public;

use Hedabkh\Backend\Http\JsonResponse;
use Hedabkh\Backend\Http\Request;
use Hedabkh\Backend\Services\InquiryService;
use Hedabkh\Backend\Validation\RequestValidator;

class InquiryController
{
    private InquiryService $inquiryService;

    public function __construct(InquiryService $inquiryService)
    {
        $this->inquiryService = $inquiryService;
    }

    public function submit(Request $request): JsonResponse
    {
        $body = $request->getBody();
        RequestValidator::validate($body, [
            'name' => 'required|string|min:2|max:100',
            'email' => 'required|email|max:191',
            'phone' => 'string|max:50',
            'message' => 'required|string|min:5'
        ]);

        $ip = $request->getClientIp();
        $result = $this->inquiryService->submitInquiry($body, $ip);

        return JsonResponse::success($result, [], 201);
    }
}

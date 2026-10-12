<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Controllers\Admin;

use Hedabkh\Backend\Database\Repositories\AdminActivityLogRepository;
use Hedabkh\Backend\Http\JsonResponse;
use Hedabkh\Backend\Http\Request;

class AdminActivityLogController
{
    private AdminActivityLogRepository $logRepo;

    public function __construct(AdminActivityLogRepository $logRepo)
    {
        $this->logRepo = $logRepo;
    }

    public function index(Request $request): JsonResponse
    {
        $limit = min(100, max(1, (int) $request->getQuery('limit', 50)));
        $offset = max(0, (int) $request->getQuery('offset', 0));
        $logs = $this->logRepo->getLogs($limit, $offset);

        return JsonResponse::success($logs);
    }
}

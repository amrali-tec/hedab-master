<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Controllers\Public;

use Hedabkh\Backend\Http\JsonResponse;
use Hedabkh\Backend\Http\Request;
use Hedabkh\Backend\Services\TeamService;

class TeamController
{
    private TeamService $teamService;

    public function __construct(TeamService $teamService)
    {
        $this->teamService = $teamService;
    }

    public function index(Request $request): JsonResponse
    {
        $params = $request->getQueryParams();
        $team = $this->teamService->getTeam($params);
        return JsonResponse::success($team, ['locale' => $params['locale'] ?? 'ar']);
    }
}

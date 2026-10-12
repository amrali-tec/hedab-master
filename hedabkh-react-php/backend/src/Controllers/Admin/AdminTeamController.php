<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Controllers\Admin;

use Hedabkh\Backend\Http\JsonResponse;
use Hedabkh\Backend\Http\Request;
use Hedabkh\Backend\Services\TeamService;
use Hedabkh\Backend\Validation\RequestValidator;

class AdminTeamController
{
    private TeamService $teamService;

    public function __construct(TeamService $teamService)
    {
        $this->teamService = $teamService;
    }

    public function index(Request $request): JsonResponse
    {
        $team = $this->teamService->getTeam();
        return JsonResponse::success($team);
    }

    public function show(Request $request): JsonResponse
    {
        $id = (string) $request->getRouteParam('id');
        $member = $this->teamService->getMember($id);
        return JsonResponse::success($member);
    }

    public function store(Request $request): JsonResponse
    {
        $body = $request->getBody();
        $body['name_ar'] = $body['name_ar'] ?? $body['nameAr'] ?? $body['name'] ?? null;
        $body['role_ar'] = $body['role_ar'] ?? $body['roleAr'] ?? $body['role'] ?? null;
        $body['bio_ar'] = $body['bio_ar'] ?? $body['bioAr'] ?? $body['bio'] ?? '';

        RequestValidator::validate($body, [
            'name_ar' => 'required|string',
            'role_ar' => 'required|string'
        ]);

        $member = $this->teamService->createMember($body);
        return JsonResponse::success($member, [], 201);
    }

    public function update(Request $request): JsonResponse
    {
        $id = (string) $request->getRouteParam('id');
        $body = $request->getBody();
        if (isset($body['name']) && !isset($body['name_ar']) && !isset($body['nameAr'])) {
            $body['name_ar'] = $body['name'];
        }
        if (isset($body['role']) && !isset($body['role_ar']) && !isset($body['roleAr'])) {
            $body['role_ar'] = $body['role'];
        }
        if (isset($body['bio']) && !isset($body['bio_ar']) && !isset($body['bioAr'])) {
            $body['bio_ar'] = $body['bio'];
        }
        $member = $this->teamService->updateMember($id, $body);
        return JsonResponse::success($member);
    }

    public function destroy(Request $request): JsonResponse
    {
        $id = (string) $request->getRouteParam('id');
        $this->teamService->deleteMember($id);
        return JsonResponse::success(['message' => "Team member [{$id}] deleted successfully."]);
    }
}

<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Controllers\Admin;

use Hedabkh\Backend\Database\Repositories\AdminActivityLogRepository;
use Hedabkh\Backend\Database\Repositories\ArticleRepository;
use Hedabkh\Backend\Database\Repositories\CertificateRepository;
use Hedabkh\Backend\Database\Repositories\EquipmentRepository;
use Hedabkh\Backend\Database\Repositories\InquiryRepository;
use Hedabkh\Backend\Database\Repositories\ProjectRepository;
use Hedabkh\Backend\Database\Repositories\ServiceRepository;
use Hedabkh\Backend\Http\JsonResponse;
use Hedabkh\Backend\Http\Request;

class AdminOverviewController
{
    private ProjectRepository $projectRepo;
    private ServiceRepository $serviceRepo;
    private EquipmentRepository $equipmentRepo;
    private CertificateRepository $certRepo;
    private InquiryRepository $inquiryRepo;
    private ArticleRepository $articleRepo;
    private AdminActivityLogRepository $logRepo;

    public function __construct(
        ProjectRepository $projectRepo,
        ServiceRepository $serviceRepo,
        EquipmentRepository $equipmentRepo,
        CertificateRepository $certRepo,
        InquiryRepository $inquiryRepo,
        ArticleRepository $articleRepo,
        AdminActivityLogRepository $logRepo
    ) {
        $this->projectRepo = $projectRepo;
        $this->serviceRepo = $serviceRepo;
        $this->equipmentRepo = $equipmentRepo;
        $this->certRepo = $certRepo;
        $this->inquiryRepo = $inquiryRepo;
        $this->articleRepo = $articleRepo;
        $this->logRepo = $logRepo;
    }

    public function metrics(Request $request): JsonResponse
    {
        $metrics = [
            'projectsCount' => $this->projectRepo->count(),
            'servicesCount' => $this->serviceRepo->count(),
            'equipmentCount' => $this->equipmentRepo->count(),
            'certificatesCount' => $this->certRepo->count(),
            'inquiriesCount' => $this->inquiryRepo->count(),
            'newInquiriesCount' => $this->inquiryRepo->count(['status' => 'new']),
            'articlesCount' => $this->articleRepo->count(),
            'recentLogs' => $this->logRepo->getLogs(10)
        ];

        return JsonResponse::success($metrics);
    }
}

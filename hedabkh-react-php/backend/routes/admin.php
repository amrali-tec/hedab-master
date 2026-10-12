<?php

declare(strict_types=1);

/**
 * Administrative & Auth API Routes (`/api/v1/admin/` & `/api/v1/auth/`)
 */

use Hedabkh\Backend\Controllers\Admin\AdminActivityLogController;
use Hedabkh\Backend\Controllers\Admin\AdminArticleController;
use Hedabkh\Backend\Controllers\Admin\AdminAuthController;
use Hedabkh\Backend\Controllers\Admin\AdminCertificateController;
use Hedabkh\Backend\Controllers\Admin\AdminCmsController;
use Hedabkh\Backend\Controllers\Admin\AdminEquipmentController;
use Hedabkh\Backend\Controllers\Admin\AdminInquiryController;
use Hedabkh\Backend\Controllers\Admin\AdminMediaController;
use Hedabkh\Backend\Controllers\Admin\AdminOverviewController;
use Hedabkh\Backend\Controllers\Admin\AdminPartnerController;
use Hedabkh\Backend\Controllers\Admin\AdminProjectController;
use Hedabkh\Backend\Controllers\Admin\AdminServiceController;
use Hedabkh\Backend\Controllers\Admin\AdminSettingsController;
use Hedabkh\Backend\Controllers\Admin\AdminStatisticsController;
use Hedabkh\Backend\Controllers\Admin\AdminTeamController;
use Hedabkh\Backend\Controllers\Admin\AdminUserController;
use Hedabkh\Backend\Middleware\AuthMiddleware;
use Hedabkh\Backend\Middleware\PermissionMiddleware;
use Hedabkh\Backend\Router\Router;

/** @var Router $router */

// Authentication Routes
$router->post('/auth/login', [AdminAuthController::class, 'login']);
$router->get('/auth/session', [AdminAuthController::class, 'session']);
$router->post('/auth/logout', [AdminAuthController::class, 'logout']);

// Admin Protected Routes (Grouped under /admin)
$router->group('/admin', function (Router $admin) {
    // 1. Overview Metrics
    $admin->get('/overview/metrics', [AdminOverviewController::class, 'metrics']);

    // 2. Projects CRUD
    $admin->get('/projects', [AdminProjectController::class, 'index']);
    $admin->get('/projects/{id}', [AdminProjectController::class, 'show']);
    $admin->post('/projects', [AdminProjectController::class, 'store']);
    $admin->put('/projects/{id}', [AdminProjectController::class, 'update']);
    $admin->delete('/projects/{id}', [AdminProjectController::class, 'destroy']);

    // 3. Services CRUD
    $admin->get('/services', [AdminServiceController::class, 'index']);
    $admin->get('/services/{id}', [AdminServiceController::class, 'show']);
    $admin->post('/services', [AdminServiceController::class, 'store']);
    $admin->put('/services/{id}', [AdminServiceController::class, 'update']);
    $admin->delete('/services/{id}', [AdminServiceController::class, 'destroy']);

    // 4. Equipment CRUD
    $admin->get('/equipment', [AdminEquipmentController::class, 'index']);
    $admin->get('/equipment/{id}', [AdminEquipmentController::class, 'show']);
    $admin->post('/equipment', [AdminEquipmentController::class, 'store']);
    $admin->put('/equipment/{id}', [AdminEquipmentController::class, 'update']);
    $admin->delete('/equipment/{id}', [AdminEquipmentController::class, 'destroy']);

    // 5. Certificates CRUD
    $admin->get('/certificates', [AdminCertificateController::class, 'index']);
    $admin->get('/certificates/{id}', [AdminCertificateController::class, 'show']);
    $admin->post('/certificates', [AdminCertificateController::class, 'store']);
    $admin->put('/certificates/{id}', [AdminCertificateController::class, 'update']);
    $admin->delete('/certificates/{id}', [AdminCertificateController::class, 'destroy']);

    // 6. Team CRUD
    $admin->get('/team', [AdminTeamController::class, 'index']);
    $admin->get('/team/{id}', [AdminTeamController::class, 'show']);
    $admin->post('/team', [AdminTeamController::class, 'store']);
    $admin->put('/team/{id}', [AdminTeamController::class, 'update']);
    $admin->delete('/team/{id}', [AdminTeamController::class, 'destroy']);

    // 7. Partners CRUD
    $admin->get('/partners', [AdminPartnerController::class, 'index']);
    $admin->get('/partners/{id}', [AdminPartnerController::class, 'show']);
    $admin->post('/partners', [AdminPartnerController::class, 'store']);
    $admin->put('/partners/{id}', [AdminPartnerController::class, 'update']);
    $admin->delete('/partners/{id}', [AdminPartnerController::class, 'destroy']);

    // 8. Articles CRUD
    $admin->get('/articles', [AdminArticleController::class, 'index']);
    $admin->get('/articles/{slug}', [AdminArticleController::class, 'show']);
    $admin->post('/articles', [AdminArticleController::class, 'store']);
    $admin->put('/articles/{id}', [AdminArticleController::class, 'update']);
    $admin->delete('/articles/{id}', [AdminArticleController::class, 'destroy']);

    // 9. Statistics CRUD
    $admin->get('/statistics', [AdminStatisticsController::class, 'index']);
    $admin->put('/statistics/{id}', [AdminStatisticsController::class, 'update']);

    // 10. Inquiries
    $admin->get('/inquiries', [AdminInquiryController::class, 'index']);
    $admin->patch('/inquiries/{id}/status', [AdminInquiryController::class, 'updateStatus']);
    $admin->delete('/inquiries/{id}', [AdminInquiryController::class, 'destroy']);

    // 11. Media Library
    $admin->get('/media', [AdminMediaController::class, 'index']);
    $admin->get('/media/{id}', [AdminMediaController::class, 'show']);
    $admin->post('/media', [AdminMediaController::class, 'store']);
    $admin->post('/media/upload', [AdminMediaController::class, 'upload']);
    $admin->delete('/media/{id}', [AdminMediaController::class, 'destroy']);

    // 12. Settings
    $admin->get('/settings', [AdminSettingsController::class, 'getSettings']);
    $admin->put('/settings/brand', [AdminSettingsController::class, 'updateBrand']);
    $admin->put('/settings/seo', [AdminSettingsController::class, 'updateSeo']);

    // 13. Visual CMS Management
    $admin->get('/cms/pages', [AdminCmsController::class, 'pages']);
    $admin->get('/cms/pages/{pageId}', [AdminCmsController::class, 'getPage']);
    $admin->post('/cms/pages/{pageId}/draft', [AdminCmsController::class, 'saveDraft']);
    $admin->post('/cms/pages/{pageId}/publish', [AdminCmsController::class, 'publish']);
    $admin->post('/cms/pages/{pageId}/rollback/{versionNumber}', [AdminCmsController::class, 'rollback']);

    // 14. Admin Users Management
    $admin->get('/users', [AdminUserController::class, 'index']);
    $admin->post('/users', [AdminUserController::class, 'store']);
    $admin->put('/users/{id}', [AdminUserController::class, 'update']);
    $admin->delete('/users/{id}', [AdminUserController::class, 'destroy']);

    // 15. Activity Logs
    $admin->get('/logs', [AdminActivityLogController::class, 'index']);

}, [AuthMiddleware::class]);

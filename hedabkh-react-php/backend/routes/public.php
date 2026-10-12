<?php

declare(strict_types=1);

/**
 * Public REST API Routes (`/api/v1/`)
 */

use Hedabkh\Backend\Controllers\Public\ArticleController;
use Hedabkh\Backend\Controllers\Public\CertificateController;
use Hedabkh\Backend\Controllers\Public\CmsPublicController;
use Hedabkh\Backend\Controllers\Public\CoverageController;
use Hedabkh\Backend\Controllers\Public\EquipmentController;
use Hedabkh\Backend\Controllers\Public\InquiryController;
use Hedabkh\Backend\Controllers\Public\PartnerController;
use Hedabkh\Backend\Controllers\Public\ProjectController;
use Hedabkh\Backend\Controllers\Public\ServiceController;
use Hedabkh\Backend\Controllers\Public\SettingsController;
use Hedabkh\Backend\Controllers\Public\StatisticsController;
use Hedabkh\Backend\Controllers\Public\TeamController;
use Hedabkh\Backend\Controllers\Public\TimelineController;
use Hedabkh\Backend\Router\Router;

/** @var Router $router */

// 1. Projects
$router->get('/projects', [ProjectController::class, 'index']);
$router->get('/projects/{id}', [ProjectController::class, 'show']);

// 2. Services
$router->get('/services', [ServiceController::class, 'index']);
$router->get('/services/{id}', [ServiceController::class, 'show']);

// 3. Equipment Fleet
$router->get('/equipment', [EquipmentController::class, 'index']);
$router->get('/equipment/{id}', [EquipmentController::class, 'show']);

// 4. Certificates & Accreditations
$router->get('/certificates', [CertificateController::class, 'index']);
$router->get('/certificates/{id}', [CertificateController::class, 'show']);

// 5. Team & Leadership
$router->get('/team', [TeamController::class, 'index']);

// 6. Partners & Clients
$router->get('/partners', [PartnerController::class, 'index']);

// 7. News & Technical Articles
$router->get('/articles', [ArticleController::class, 'index']);
$router->get('/articles/{slug}', [ArticleController::class, 'show']);

// 8. Statistics & KPIs
$router->get('/statistics', [StatisticsController::class, 'index']);

// 9. Timeline Milestones (3D Carousel)
$router->get('/timeline', [TimelineController::class, 'index']);

// 10. Regional Coverage Map
$router->get('/regions', [CoverageController::class, 'index']);
$router->get('/coverage', [CoverageController::class, 'index']);

// 11. Settings (Brand & SEO)
$router->get('/settings/brand', [SettingsController::class, 'brand']);
$router->get('/settings/seo', [SettingsController::class, 'seo']);

// 12. Inquiries & RFQ Lead Submission
$router->post('/inquiries', [InquiryController::class, 'submit']);

// 13. Visual CMS Public Page Content
$router->get('/content/pages/{pageId}', [CmsPublicController::class, 'show']);
$router->get('/cms/pages/{pageId}', [CmsPublicController::class, 'show']);

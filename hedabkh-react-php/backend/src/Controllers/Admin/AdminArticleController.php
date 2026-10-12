<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Controllers\Admin;

use Hedabkh\Backend\Http\JsonResponse;
use Hedabkh\Backend\Http\Request;
use Hedabkh\Backend\Services\ArticleService;
use Hedabkh\Backend\Validation\RequestValidator;

class AdminArticleController
{
    private ArticleService $articleService;

    public function __construct(ArticleService $articleService)
    {
        $this->articleService = $articleService;
    }

    public function index(Request $request): JsonResponse
    {
        $params = $request->getQueryParams();
        $params['all'] = true;
        $result = $this->articleService->getArticles($params);
        return JsonResponse::success($result['data'], ['pagination' => $result['pagination']]);
    }

    public function show(Request $request): JsonResponse
    {
        $slug = (string) $request->getRouteParam('slug');
        $article = $this->articleService->getArticle($slug);
        return JsonResponse::success($article);
    }

    public function store(Request $request): JsonResponse
    {
        $body = $request->getBody();
        $body['title_ar'] = $body['title_ar'] ?? $body['titleAr'] ?? $body['title'] ?? null;
        $body['summary_ar'] = $body['summary_ar'] ?? $body['summaryAr'] ?? $body['excerptAr'] ?? $body['excerpt'] ?? $body['description'] ?? 'موجز المقال';
        $body['content_ar'] = $body['content_ar'] ?? $body['contentAr'] ?? $body['content'] ?? null;
        $body['category_ar'] = $body['category_ar'] ?? $body['categoryAr'] ?? $body['category'] ?? 'أخبار المشاريع';

        RequestValidator::validate($body, [
            'title_ar' => 'required|string',
            'summary_ar' => 'required|string',
            'content_ar' => 'required|string',
            'category_ar' => 'required|string'
        ]);

        $user = $request->getUser();
        $article = $this->articleService->createArticle($body, $user['id'] ?? 'usr-admin-1');
        return JsonResponse::success($article, [], 201);
    }

    public function update(Request $request): JsonResponse
    {
        $id = (string) $request->getRouteParam('id');
        $body = $request->getBody();
        $article = $this->articleService->updateArticle($id, $body);
        return JsonResponse::success($article);
    }

    public function destroy(Request $request): JsonResponse
    {
        $id = (string) $request->getRouteParam('id');
        $this->articleService->deleteArticle($id);
        return JsonResponse::success(['message' => "Article [{$id}] deleted successfully."]);
    }
}

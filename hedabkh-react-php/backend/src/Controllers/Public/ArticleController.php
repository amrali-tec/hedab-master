<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Controllers\Public;

use Hedabkh\Backend\Http\JsonResponse;
use Hedabkh\Backend\Http\Request;
use Hedabkh\Backend\Services\ArticleService;

class ArticleController
{
    private ArticleService $articleService;

    public function __construct(ArticleService $articleService)
    {
        $this->articleService = $articleService;
    }

    public function index(Request $request): JsonResponse
    {
        $params = $request->getQueryParams();
        $result = $this->articleService->getArticles($params);
        return JsonResponse::success($result['data'], ['pagination' => $result['pagination']]);
    }

    public function show(Request $request): JsonResponse
    {
        $slug = (string) $request->getRouteParam('slug');
        $article = $this->articleService->getArticle($slug);
        return JsonResponse::success($article);
    }
}

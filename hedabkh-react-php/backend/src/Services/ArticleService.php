<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Services;

use Hedabkh\Backend\Database\Repositories\ArticleRepository;
use Hedabkh\Backend\Http\HttpException;

class ArticleService
{
    private ArticleRepository $articleRepo;

    public function __construct(ArticleRepository $articleRepo)
    {
        $this->articleRepo = $articleRepo;
    }

    public function getArticles(array $params = []): array
    {
        $page = max(1, (int) ($params['page'] ?? 1));
        $limit = min(100, max(1, (int) ($params['limit'] ?? $params['per_page'] ?? 20)));
        $offset = ($page - 1) * $limit;

        $filters = [];
        if (!empty($params['status'])) {
            $filters['status'] = $params['status'];
        } elseif (!isset($params['all'])) {
            $filters['status'] = 'published';
        }

        if (!empty($params['category'])) {
            $filters['category'] = $params['category'];
        }

        if (!empty($params['search'])) {
            $filters['search'] = $params['search'];
        }

        $items = $this->articleRepo->getArticles($filters, $limit, $offset);
        $total = $this->articleRepo->countArticles($filters);

        return [
            'data' => array_map([$this, 'formatArticle'], $items),
            'pagination' => [
                'page' => $page,
                'per_page' => $limit,
                'total' => $total,
                'total_pages' => (int) ceil($total / $limit)
            ]
        ];
    }

    public function getArticle(string $slugOrId): array
    {
        $article = $this->articleRepo->findBySlug($slugOrId);
        if (!$article) {
            throw HttpException::notFound("Article [{$slugOrId}] was not found.", 'ARTICLE_NOT_FOUND');
        }
        return $this->formatArticle($article);
    }

    public function createArticle(array $data, ?string $userId = null): array
    {
        $id = $data['id'] ?? ('article-' . bin2hex(random_bytes(4)));
        $slug = $data['slug'] ?? ('article-' . $id);

        $record = [
            'id' => $id,
            'slug' => $slug,
            'title_ar' => $data['title_ar'] ?? $data['titleAr'] ?? '',
            'title_en' => $data['title_en'] ?? $data['titleEn'] ?? '',
            'category_ar' => $data['category_ar'] ?? $data['categoryAr'] ?? '',
            'category_en' => $data['category_en'] ?? $data['categoryEn'] ?? '',
            'read_time_ar' => $data['read_time_ar'] ?? $data['readTimeAr'] ?? '5 دقائق قراءة',
            'read_time_en' => $data['read_time_en'] ?? $data['readTimeEn'] ?? '5 min read',
            'published_date' => $data['published_date'] ?? $data['publishedDate'] ?? date('Y-m-d'),
            'cover_image' => $data['cover_image'] ?? $data['coverImage'] ?? '/images/projects/project-1.jpg',
            'image_alt_ar' => $data['image_alt_ar'] ?? $data['imageAltAr'] ?? '',
            'image_alt_en' => $data['image_alt_en'] ?? $data['imageAltEn'] ?? '',
            'summary_ar' => $data['summary_ar'] ?? $data['summaryAr'] ?? '',
            'summary_en' => $data['summary_en'] ?? $data['summaryEn'] ?? '',
            'seo_title_ar' => $data['seo_title_ar'] ?? $data['seoTitleAr'] ?? '',
            'seo_title_en' => $data['seo_title_en'] ?? $data['seoTitleEn'] ?? '',
            'meta_description_ar' => $data['meta_description_ar'] ?? $data['metaDescriptionAr'] ?? '',
            'meta_description_en' => $data['meta_description_en'] ?? $data['metaDescriptionEn'] ?? '',
            'content_ar' => $data['content_ar'] ?? $data['contentAr'] ?? '',
            'content_en' => $data['content_en'] ?? $data['contentEn'] ?? '',
            'status' => $data['status'] ?? 'published',
            'created_by' => $userId ?? 'usr-admin-1'
        ];

        $this->articleRepo->insert($record);
        return $this->getArticle($id);
    }

    public function updateArticle(string $id, array $data): array
    {
        if (!$this->articleRepo->exists($id)) {
            throw HttpException::notFound("Article [{$id}] was not found.", 'ARTICLE_NOT_FOUND');
        }

        $update = [];
        $allowed = ['slug', 'title_ar', 'title_en', 'category_ar', 'category_en', 'read_time_ar', 'read_time_en', 'published_date', 'cover_image', 'image_alt_ar', 'image_alt_en', 'summary_ar', 'summary_en', 'seo_title_ar', 'seo_title_en', 'meta_description_ar', 'meta_description_en', 'content_ar', 'content_en', 'status'];
        foreach ($allowed as $f) {
            if (array_key_exists($f, $data)) {
                $update[$f] = $data[$f];
            }
        }

        if (!empty($update)) {
            $this->articleRepo->update($id, $update);
        }

        return $this->getArticle($id);
    }

    public function deleteArticle(string $id): bool
    {
        if (!$this->articleRepo->exists($id)) {
            throw HttpException::notFound("Article [{$id}] was not found.", 'ARTICLE_NOT_FOUND');
        }
        return $this->articleRepo->delete($id);
    }

    public function formatArticle(array $a): array
    {
        return [
            'id' => $a['id'],
            'slug' => $a['slug'],
            'titleAr' => $a['title_ar'],
            'titleEn' => $a['title_en'],
            'categoryAr' => $a['category_ar'],
            'categoryEn' => $a['category_en'],
            'readTimeAr' => $a['read_time_ar'],
            'readTimeEn' => $a['read_time_en'],
            'publishedDate' => $a['published_date'],
            'coverImage' => $a['cover_image'],
            'imageAltAr' => $a['image_alt_ar'],
            'imageAltEn' => $a['image_alt_en'],
            'summaryAr' => $a['summary_ar'],
            'summaryEn' => $a['summary_en'],
            'seoTitleAr' => $a['seo_title_ar'],
            'seoTitleEn' => $a['seo_title_en'],
            'metaDescriptionAr' => $a['meta_description_ar'],
            'metaDescriptionEn' => $a['meta_description_en'],
            'contentAr' => $a['content_ar'],
            'contentEn' => $a['content_en'],
            'status' => $a['status']
        ];
    }
}

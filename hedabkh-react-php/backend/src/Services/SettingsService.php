<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Services;

use Hedabkh\Backend\Database\Repositories\BrandSettingsRepository;
use Hedabkh\Backend\Database\Repositories\SeoSettingsRepository;
use Hedabkh\Backend\Http\HttpException;

class SettingsService
{
    private BrandSettingsRepository $brandRepo;
    private SeoSettingsRepository $seoRepo;

    public function __construct(BrandSettingsRepository $brandRepo, SeoSettingsRepository $seoRepo)
    {
        $this->brandRepo = $brandRepo;
        $this->seoRepo = $seoRepo;
    }

    public function getBrandSettings(): array
    {
        return $this->brandRepo->getBrandSettings();
    }

    public function updateBrandSettings(array $data): array
    {
        $this->brandRepo->saveBrandSettings($data);
        return $this->getBrandSettings();
    }

    public function getSeoSettings(?string $pageKey = null): array
    {
        if ($pageKey) {
            $seo = $this->seoRepo->getSeoForPage($pageKey);
            if (!$seo) {
                throw HttpException::notFound("SEO settings for page [{$pageKey}] not found.", 'SEO_NOT_FOUND');
            }
            return $seo;
        }

        return $this->seoRepo->getAllSeo();
    }

    public function updateSeoSettings(string $pageKey, array $data): array
    {
        $existing = $this->seoRepo->getSeoForPage($pageKey);
        $id = $existing ? $existing['id'] : ('seo-' . $pageKey);

        $record = [
            'id' => $id,
            'page_key' => $pageKey,
            'title_ar' => $data['title_ar'] ?? $data['titleAr'] ?? $existing['title_ar'] ?? '',
            'title_en' => $data['title_en'] ?? $data['titleEn'] ?? $existing['title_en'] ?? '',
            'description_ar' => $data['description_ar'] ?? $data['descriptionAr'] ?? $existing['description_ar'] ?? '',
            'description_en' => $data['description_en'] ?? $data['descriptionEn'] ?? $existing['description_en'] ?? '',
            'keywords_ar_json' => json_encode($data['keywords_ar'] ?? $data['keywordsAr'] ?? $existing['keywords_ar'] ?? [], JSON_UNESCAPED_UNICODE),
            'keywords_en_json' => json_encode($data['keywords_en'] ?? $data['keywordsEn'] ?? $existing['keywords_en'] ?? [], JSON_UNESCAPED_UNICODE),
            'og_image' => $data['og_image'] ?? $data['ogImage'] ?? $existing['og_image'] ?? null,
            'canonical_url' => $data['canonical_url'] ?? $data['canonicalUrl'] ?? $existing['canonical_url'] ?? null,
            'updated_at' => date('Y-m-d H:i:s')
        ];

        if ($existing) {
            $this->seoRepo->update($id, $record);
        } else {
            $this->seoRepo->insert($record);
        }

        return $this->getSeoSettings($pageKey);
    }
}

<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Services;

use Hedabkh\Backend\Database\Repositories\CmsPageRepository;
use Hedabkh\Backend\Database\Repositories\CmsPageVersionRepository;
use Hedabkh\Backend\Database\Repositories\CmsVersionBlockRepository;
use Hedabkh\Backend\Http\HttpException;

class CmsService
{
    private CmsPageRepository $pageRepo;
    private CmsPageVersionRepository $versionRepo;
    private CmsVersionBlockRepository $blockRepo;

    public function __construct(
        CmsPageRepository $pageRepo,
        CmsPageVersionRepository $versionRepo,
        CmsVersionBlockRepository $blockRepo
    ) {
        $this->pageRepo = $pageRepo;
        $this->versionRepo = $versionRepo;
        $this->blockRepo = $blockRepo;
    }

    public function getPages(): array
    {
        return $this->pageRepo->findAll();
    }

    public function getPage(string $pageIdOrSlug, string $state = 'published', string $locale = 'ar'): array
    {
        $page = $this->pageRepo->findBySlug($pageIdOrSlug);
        if (!$page) {
            throw HttpException::notFound("CMS Page [{$pageIdOrSlug}] not found.", 'PAGE_NOT_FOUND');
        }

        $pageId = $page['id'];
        $version = $this->versionRepo->findLatestVersion($pageId, $state);
        
        // Fallback to published if draft does not exist
        if (!$version && $state === 'draft') {
            $version = $this->versionRepo->findLatestVersion($pageId, 'published');
        }

        if (!$version) {
            throw HttpException::notFound("No content version found for page [{$pageIdOrSlug}].", 'VERSION_NOT_FOUND');
        }

        $blocks = [];
        if (!empty($version['blocks_json'])) {
            $blocks = json_decode($version['blocks_json'], true) ?: [];
        } else {
            $blockRows = $this->blockRepo->getBlocksForVersion($version['id']);
            foreach ($blockRows as $b) {
                $blocks[] = [
                    'id' => $b['block_id'],
                    'type' => $b['type'],
                    'sortOrder' => (int) $b['sort_order'],
                    'isVisible' => (bool) $b['is_visible'],
                    'config' => $b['config'] ?? []
                ];
            }
        }

        return [
            'pageId' => $pageId,
            'slug' => $page['slug'],
            'versionNumber' => (int) $version['version_number'],
            'state' => $version['state'],
            'titleAr' => $version['title_ar'] ?: $page['title_ar'],
            'titleEn' => $version['title_en'] ?: $page['title_en'],
            'blocks' => $blocks
        ];
    }

    public function saveDraft(string $pageId, array $blocks, ?string $changeNote = null, string $userId = 'usr-admin-1'): array
    {
        $page = $this->pageRepo->findById($pageId);
        if (!$page) {
            throw HttpException::notFound("CMS Page [{$pageId}] not found.", 'PAGE_NOT_FOUND');
        }

        // Validate blocks structure
        if (!is_array($blocks)) {
            throw HttpException::badRequest('Blocks payload must be an array.', 'INVALID_BLOCKS_STRUCTURE');
        }
        foreach ($blocks as $idx => $b) {
            if (!is_array($b) || empty($b['id']) || empty($b['type'])) {
                throw HttpException::badRequest("Block at index [{$idx}] is malformed. Required: id, type.", 'MALFORMED_BLOCK');
            }
        }

        $draftVersion = $this->versionRepo->findLatestVersion($pageId, 'draft');
        $versionId = $draftVersion ? $draftVersion['id'] : ('ver-' . $pageId . '-draft-' . time());
        $versionNumber = $draftVersion ? (int) $draftVersion['version_number'] : 2;

        $record = [
            'id' => $versionId,
            'page_id' => $pageId,
            'version_number' => $versionNumber,
            'state' => 'draft',
            'title_ar' => $page['title_ar'],
            'title_en' => $page['title_en'],
            'blocks_json' => json_encode($blocks, JSON_UNESCAPED_UNICODE),
            'change_note' => $changeNote ?? 'Draft updated via Visual Builder',
            'created_by' => $userId
        ];

        if ($draftVersion) {
            $this->versionRepo->update($versionId, $record);
        } else {
            $this->versionRepo->insert($record);
            $this->pageRepo->update($pageId, ['draft_version_id' => $versionId]);
        }

        $this->blockRepo->syncBlocks($versionId, $blocks);

        return $this->getPage($pageId, 'draft');
    }

    public function publishPage(string $pageId, string $userId = 'usr-admin-1'): array
    {
        $draft = $this->getPage($pageId, 'draft');
        $blocks = $draft['blocks'];

        // Determine new published version number from latest of all versions for page
        $latestVer = $this->versionRepo->findLatestVersion($pageId);
        $newVersionNumber = $latestVer ? ((int) $latestVer['version_number'] + 1) : 1;
        $pubVersionId = 'ver-' . $pageId . '-pub-' . $newVersionNumber . '-' . bin2hex(random_bytes(3));

        $record = [
            'id' => $pubVersionId,
            'page_id' => $pageId,
            'version_number' => $newVersionNumber,
            'state' => 'published',
            'title_ar' => $draft['titleAr'],
            'title_en' => $draft['titleEn'],
            'blocks_json' => json_encode($blocks, JSON_UNESCAPED_UNICODE),
            'change_note' => 'Published from Visual Builder',
            'created_by' => $userId,
            'published_at' => date('Y-m-d H:i:s')
        ];

        $this->versionRepo->insert($record);
        $this->blockRepo->syncBlocks($pubVersionId, $blocks);

        $this->pageRepo->update($pageId, [
            'published_version_id' => $pubVersionId,
            'status' => 'published'
        ]);

        return $this->getPage($pageId, 'published');
    }

    public function rollbackVersion(string $pageId, int $versionNumber, string $userId = 'usr-admin-1'): array
    {
        $historical = $this->versionRepo->findByPageAndVersionNumber($pageId, $versionNumber);
        if (!$historical) {
            throw HttpException::notFound("Version #{$versionNumber} for page [{$pageId}] not found.", 'VERSION_NOT_FOUND');
        }

        $blocks = json_decode($historical['blocks_json'], true) ?: [];
        return $this->saveDraft($pageId, $blocks, "Rolled back to version #{$versionNumber}", $userId);
    }
}

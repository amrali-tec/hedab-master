<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Services;

use Hedabkh\Backend\Database\Repositories\MediaRepository;
use Hedabkh\Backend\Http\HttpException;

class MediaService
{
    private MediaRepository $mediaRepo;

    public function __construct(MediaRepository $mediaRepo)
    {
        $this->mediaRepo = $mediaRepo;
    }

    public function getMedia(array $params = []): array
    {
        $page = max(1, (int) ($params['page'] ?? 1));
        $limit = min(100, max(1, (int) ($params['limit'] ?? 30)));
        $offset = ($page - 1) * $limit;

        $filters = [];
        if (!empty($params['category'])) $filters['category'] = $params['category'];
        if (!empty($params['type'])) $filters['media_type'] = $params['type'];
        if (!empty($params['search'])) $filters['search'] = $params['search'];

        $items = $this->mediaRepo->getMediaItems($filters, $limit, $offset);
        $total = $this->mediaRepo->countMediaItems($filters);

        return [
            'data' => array_map([$this, 'formatMedia'], $items),
            'pagination' => [
                'page' => $page,
                'per_page' => $limit,
                'total' => $total,
                'total_pages' => (int) ceil($total / $limit)
            ]
        ];
    }

    public function getMediaItem(string $id): array
    {
        $item = $this->mediaRepo->findById($id);
        if (!$item) {
            throw HttpException::notFound("Media item [{$id}] not found.", 'MEDIA_NOT_FOUND');
        }
        return $this->formatMedia($item);
    }

    public function recordMedia(array $data, string $uploadedBy = 'usr-admin-1'): array
    {
        $id = $data['id'] ?? ('media-' . bin2hex(random_bytes(6)));
        $record = [
            'id' => $id,
            'original_name' => $data['name'] ?? $data['original_name'] ?? 'asset',
            'stored_filename' => $data['stored_filename'] ?? $data['name'] ?? 'asset',
            'file_path' => $data['url'] ?? $data['file_path'] ?? '',
            'file_url' => $data['url'] ?? $data['file_url'] ?? '',
            'mime_type' => $data['mime_type'] ?? 'image/jpeg',
            'file_size_bytes' => (int) ($data['size'] ?? $data['file_size_bytes'] ?? 0),
            'width_px' => isset($data['width']) ? (int) $data['width'] : null,
            'height_px' => isset($data['height']) ? (int) $data['height'] : null,
            'media_type' => $data['type'] ?? 'image',
            'category' => $data['category'] ?? 'general',
            'alt_ar' => $data['alt_ar'] ?? $data['altAr'] ?? null,
            'alt_en' => $data['alt_en'] ?? $data['altEn'] ?? null,
            'uploaded_by' => $uploadedBy
        ];

        $this->mediaRepo->insert($record);
        return $this->getMediaItem($id);
    }

    public function deleteMedia(string $id): bool
    {
        if (!$this->mediaRepo->exists($id)) {
            throw HttpException::notFound("Media item [{$id}] not found.", 'MEDIA_NOT_FOUND');
        }
        return $this->mediaRepo->delete($id);
    }

    public function formatMedia(array $m): array
    {
        return [
            'id' => $m['id'],
            'name' => $m['original_name'],
            'url' => $m['file_url'],
            'type' => $m['media_type'],
            'mediaType' => $m['media_type'],
            'mimeType' => $m['mime_type'],
            'size' => (int) $m['file_size_bytes'],
            'sizeBytes' => (int) $m['file_size_bytes'],
            'width' => $m['width_px'] ? (int) $m['width_px'] : null,
            'height' => $m['height_px'] ? (int) $m['height_px'] : null,
            'category' => $m['category'],
            'altAr' => $m['alt_ar'],
            'altEn' => $m['alt_en'],
            'uploadedAt' => $m['created_at']
        ];
    }
}

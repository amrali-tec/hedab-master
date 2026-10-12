<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Controllers\Admin;

use Hedabkh\Backend\Http\HttpException;
use Hedabkh\Backend\Http\JsonResponse;
use Hedabkh\Backend\Http\Request;
use Hedabkh\Backend\Services\MediaService;

class AdminMediaController
{
    private MediaService $mediaService;

    public function __construct(MediaService $mediaService)
    {
        $this->mediaService = $mediaService;
    }

    public function index(Request $request): JsonResponse
    {
        $params = $request->getQueryParams();
        $result = $this->mediaService->getMedia($params);
        return JsonResponse::success($result['data'], ['pagination' => $result['pagination']]);
    }

    public function show(Request $request): JsonResponse
    {
        $id = (string) $request->getRouteParam('id');
        $item = $this->mediaService->getMediaItem($id);
        return JsonResponse::success($item);
    }

    public function upload(Request $request): JsonResponse
    {
        $file = $request->getFile('file');
        if (!$file || $file['error'] !== UPLOAD_ERR_OK) {
            throw HttpException::badRequest('No file uploaded or upload error encountered.', 'FILE_UPLOAD_ERROR');
        }

        // Validate MIME type
        $allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'application/pdf'];
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mime = finfo_file($finfo, $file['tmp_name']);
        finfo_close($finfo);

        if (!in_array($mime, $allowedMimes, true)) {
            throw HttpException::badRequest("Unsupported file MIME type [{$mime}].", 'INVALID_FILE_TYPE');
        }

        // Generate sanitized unique storage path
        $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
        $safeName = preg_replace('/[^a-zA-Z0-9_\-\.]/', '', pathinfo($file['name'], PATHINFO_FILENAME));
        $storedFilename = $safeName . '-' . bin2hex(random_bytes(4)) . '.' . $ext;

        $targetDir = dirname(HEDABKH_BASE_PATH) . '/public/uploads/' . ($mime === 'application/pdf' ? 'documents' : 'images');
        if (!is_dir($targetDir)) {
            mkdir($targetDir, 0755, true);
        }

        $targetPath = $targetDir . '/' . $storedFilename;
        $urlPath = '/uploads/' . ($mime === 'application/pdf' ? 'documents' : 'images') . '/' . $storedFilename;

        if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
            // Fallback for non-HTTP uploads in test scripts
            copy($file['tmp_name'], $targetPath);
        }

        // Determine image dimensions if applicable
        $width = null;
        $height = null;
        if (str_starts_with($mime, 'image/') && $mime !== 'image/svg+xml') {
            $sizes = getimagesize($targetPath);
            if ($sizes) {
                $width = $sizes[0];
                $height = $sizes[1];
            }
        }

        $user = $request->getUser();
        $mediaRecord = $this->mediaService->recordMedia([
            'name' => $file['name'],
            'stored_filename' => $storedFilename,
            'url' => $urlPath,
            'mime_type' => $mime,
            'size' => $file['size'],
            'width' => $width,
            'height' => $height,
            'type' => $mime === 'application/pdf' ? 'document' : 'image',
            'category' => $request->input('category', 'general'),
            'altAr' => $request->input('altAr', ''),
            'altEn' => $request->input('altEn', '')
        ], $user['id'] ?? 'usr-admin-1');

        return JsonResponse::success($mediaRecord, [], 201);
    }

    public function store(Request $request): JsonResponse
    {
        $body = $request->getBody();
        $user = $request->getUser();
        $mediaRecord = $this->mediaService->recordMedia($body, $user['id'] ?? 'usr-admin-1');
        return JsonResponse::success($mediaRecord, [], 201);
    }

    public function destroy(Request $request): JsonResponse
    {
        $id = (string) $request->getRouteParam('id');
        $this->mediaService->deleteMedia($id);
        return JsonResponse::success(['message' => "Media item [{$id}] deleted successfully."]);
    }
}

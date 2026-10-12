<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Services;

use Hedabkh\Backend\Database\Repositories\ProjectRepository;
use Hedabkh\Backend\Http\HttpException;

class ProjectService
{
    private ProjectRepository $projectRepo;

    public function __construct(ProjectRepository $projectRepo)
    {
        $this->projectRepo = $projectRepo;
    }

    public function getProjects(array $params = []): array
    {
        $locale = $params['locale'] ?? 'ar';
        $page = max(1, (int) ($params['page'] ?? 1));
        $limit = min(100, max(1, (int) ($params['limit'] ?? $params['per_page'] ?? 50)));
        $offset = ($page - 1) * $limit;

        $filters = [];
        if (isset($params['is_active'])) {
            $filters['is_active'] = $params['is_active'];
        } else {
            $filters['is_active'] = 1;
        }

        if (isset($params['featured'])) {
            $filters['featured'] = filter_var($params['featured'], FILTER_VALIDATE_BOOLEAN);
        }

        if (!empty($params['category'])) {
            $filters['category'] = (string) $params['category'];
        }

        if (!empty($params['search'])) {
            $filters['search'] = (string) $params['search'];
        }

        $sort = $params['sort'] ?? 'sort_order ASC';

        $items = $this->projectRepo->getProjects($filters, $limit, $offset, $sort);
        $total = $this->projectRepo->countProjects($filters);

        $formatted = array_map(fn($p) => $this->formatProject($p, $locale), $items);

        return [
            'data' => $formatted,
            'pagination' => [
                'page' => $page,
                'per_page' => $limit,
                'total' => $total,
                'total_pages' => (int) ceil($total / $limit)
            ]
        ];
    }

    public function getProject(string $id, string $locale = 'ar'): array
    {
        $project = $this->projectRepo->getProjectWithDetails($id);
        if (!$project) {
            throw HttpException::notFound("Project with identifier [{$id}] was not found.", 'PROJECT_NOT_FOUND');
        }

        return $this->formatProject($project, $locale);
    }

    public function createProject(array $data): array
    {
        $id = $data['id'] ?? ('proj-' . bin2hex(random_bytes(6)));
        $slug = $data['slug'] ?? ('project-' . $id);

        $record = [
            'id' => $id,
            'slug' => $slug,
            'title_ar' => $data['title_ar'] ?? $data['titleAr'] ?? '',
            'title_en' => $data['title_en'] ?? $data['titleEn'] ?? '',
            'description_ar' => $data['description_ar'] ?? $data['descriptionAr'] ?? '',
            'description_en' => $data['description_en'] ?? $data['descriptionEn'] ?? '',
            'category_ar' => $data['category_ar'] ?? $data['categoryAr'] ?? '',
            'category_en' => $data['category_en'] ?? $data['categoryEn'] ?? '',
            'image_url' => $data['image_url'] ?? $data['imageUrl'] ?? $data['image'] ?? '/images/projects/project-1.jpg',
            'site_prep_image' => $data['site_prep_image'] ?? $data['sitePrepImage'] ?? null,
            'execution_phase_image' => $data['execution_phase_image'] ?? $data['executionPhaseImage'] ?? null,
            'finalHandoverImage' => $data['finalHandoverImage'] ?? $data['final_handover_image'] ?? null,
            'completion_date' => $data['completion_date'] ?? $data['completionDate'] ?? date('Y-m-d'),
            'location_ar' => $data['location_ar'] ?? $data['locationAr'] ?? 'الرياض',
            'location_en' => $data['location_en'] ?? $data['locationEn'] ?? 'Riyadh',
            'client_ar' => $data['client_ar'] ?? $data['clientAr'] ?? '',
            'client_en' => $data['client_en'] ?? $data['clientEn'] ?? '',
            'progress_percent' => (int) ($data['progress_percent'] ?? $data['progress'] ?? 100),
            'is_featured' => !empty($data['is_featured'] ?? $data['isFeatured']) ? 1 : 0,
            'is_active' => isset($data['is_active']) ? (int) $data['is_active'] : 1,
            'sort_order' => (int) ($data['sort_order'] ?? 0)
        ];

        $this->projectRepo->insert($record);

        if (!empty($data['features']) && is_array($data['features'])) {
            $this->projectRepo->syncFeatures($id, $data['features']);
        }

        return $this->getProject($id);
    }

    public function updateProject(string $id, array $data): array
    {
        if (!$this->projectRepo->exists($id)) {
            throw HttpException::notFound("Project with identifier [{$id}] was not found.", 'PROJECT_NOT_FOUND');
        }

        $updateFields = [];
        $allowed = [
            'slug', 'title_ar', 'title_en', 'description_ar', 'description_en',
            'category_ar', 'category_en', 'image_url', 'site_prep_image',
            'execution_phase_image', 'finalHandoverImage', 'completion_date',
            'location_ar', 'location_en', 'client_ar', 'client_en',
            'progress_percent', 'is_featured', 'is_active', 'sort_order'
        ];

        foreach ($allowed as $f) {
            if (array_key_exists($f, $data)) {
                $updateFields[$f] = $data[$f];
            }
        }

        if (!empty($updateFields)) {
            $this->projectRepo->update($id, $updateFields);
        }

        if (isset($data['features']) && is_array($data['features'])) {
            $this->projectRepo->syncFeatures($id, $data['features']);
        }

        return $this->getProject($id);
    }

    public function deleteProject(string $id): bool
    {
        if (!$this->projectRepo->exists($id)) {
            throw HttpException::notFound("Project with identifier [{$id}] was not found.", 'PROJECT_NOT_FOUND');
        }
        return $this->projectRepo->delete($id);
    }

    private function formatProject(array $p, string $locale): array
    {
        $features = [];
        if (!empty($p['features'])) {
            foreach ($p['features'] as $f) {
                $features[] = $locale === 'en' ? ($f['feature_en'] ?: $f['feature_ar']) : $f['feature_ar'];
            }
        }

        return [
            'id' => $p['id'],
            'slug' => $p['slug'] ?? $p['id'],
            'title' => $locale === 'en' ? ($p['title_en'] ?: $p['title_ar']) : $p['title_ar'],
            'titleAr' => $p['title_ar'],
            'titleEn' => $p['title_en'],
            'description' => $locale === 'en' ? ($p['description_en'] ?: $p['description_ar']) : $p['description_ar'],
            'descriptionAr' => $p['description_ar'],
            'descriptionEn' => $p['description_en'],
            'category' => $locale === 'en' ? ($p['category_en'] ?: $p['category_ar']) : $p['category_ar'],
            'categoryAr' => $p['category_ar'],
            'categoryEn' => $p['category_en'],
            'image' => $p['image_url'],
            'imageUrl' => $p['image_url'],
            'sitePrepImage' => $p['site_prep_image'] ?? $p['image_url'],
            'executionPhaseImage' => $p['execution_phase_image'] ?? $p['image_url'],
            'finalHandoverImage' => $p['finalHandoverImage'] ?? $p['image_url'],
            'completionDate' => $p['completion_date'],
            'location' => $locale === 'en' ? ($p['location_en'] ?: $p['location_ar']) : $p['location_ar'],
            'locationAr' => $p['location_ar'],
            'locationEn' => $p['location_en'],
            'client' => $locale === 'en' ? ($p['client_en'] ?: $p['client_ar']) : $p['client_ar'],
            'clientAr' => $p['client_ar'],
            'clientEn' => $p['client_en'],
            'progress' => (int) $p['progress_percent'],
            'progressPercent' => (int) $p['progress_percent'],
            'isFeatured' => (bool) $p['is_featured'],
            'isActive' => (bool) $p['is_active'],
            'sortOrder' => (int) $p['sort_order'],
            'features' => $features
        ];
    }
}

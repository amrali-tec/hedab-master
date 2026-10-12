<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Services;

use Hedabkh\Backend\Database\Repositories\TeamMemberRepository;
use Hedabkh\Backend\Http\HttpException;

class TeamService
{
    private TeamMemberRepository $teamRepo;

    public function __construct(TeamMemberRepository $teamRepo)
    {
        $this->teamRepo = $teamRepo;
    }

    public function getTeam(array $params = []): array
    {
        $locale = $params['locale'] ?? 'ar';
        $filters = [];
        if (!empty($params['sector'])) {
            $filters['sector'] = $params['sector'];
        }
        if (isset($params['is_active'])) {
            $filters['is_active'] = $params['is_active'];
        }

        $items = $this->teamRepo->getTeam($filters);
        return array_map(fn($t) => $this->formatMember($t, $locale), $items);
    }

    public function getMember(string $id, string $locale = 'ar'): array
    {
        $member = $this->teamRepo->findById($id);
        if (!$member) {
            throw HttpException::notFound("Team member with identifier [{$id}] was not found.", 'TEAM_MEMBER_NOT_FOUND');
        }
        return $this->formatMember($member, $locale);
    }

    public function createMember(array $data): array
    {
        $id = $data['id'] ?? ('team-' . bin2hex(random_bytes(4)));
        $record = [
            'id' => $id,
            'name_ar' => $data['name_ar'] ?? $data['nameAr'] ?? '',
            'name_en' => $data['name_en'] ?? $data['nameEn'] ?? '',
            'role_ar' => $data['role_ar'] ?? $data['roleAr'] ?? '',
            'role_en' => $data['role_en'] ?? $data['roleEn'] ?? '',
            'bio_ar' => $data['bio_ar'] ?? $data['bioAr'] ?? '',
            'bio_en' => $data['bio_en'] ?? $data['bioEn'] ?? '',
            'image_url' => $data['image_url'] ?? $data['imageUrl'] ?? $data['image'] ?? '/images/team/team-1.jpg',
            'sector' => $data['sector'] ?? 'PROJECTS',
            'badge_ar' => $data['badge_ar'] ?? $data['badgeAr'] ?? '',
            'badge_en' => $data['badge_en'] ?? $data['badgeEn'] ?? '',
            'experience_ar' => $data['experience_ar'] ?? $data['experienceAr'] ?? '',
            'experience_en' => $data['experience_en'] ?? $data['experienceEn'] ?? '',
            'email' => $data['email'] ?? null,
            'phone' => $data['phone'] ?? null,
            'is_active' => isset($data['is_active']) ? (int) $data['is_active'] : 1,
            'sort_order' => (int) ($data['sort_order'] ?? 0)
        ];

        $this->teamRepo->insert($record);
        return $this->getMember($id);
    }

    public function updateMember(string $id, array $data): array
    {
        if (!$this->teamRepo->exists($id)) {
            throw HttpException::notFound("Team member with identifier [{$id}] was not found.", 'TEAM_MEMBER_NOT_FOUND');
        }

        $update = [];
        $allowed = ['name_ar', 'name_en', 'role_ar', 'role_en', 'bio_ar', 'bio_en', 'image_url', 'sector', 'badge_ar', 'badge_en', 'experience_ar', 'experience_en', 'email', 'phone', 'is_active', 'sort_order'];
        foreach ($allowed as $f) {
            if (array_key_exists($f, $data)) {
                $update[$f] = $data[$f];
            }
        }

        if (!empty($update)) {
            $this->teamRepo->update($id, $update);
        }

        return $this->getMember($id);
    }

    public function deleteMember(string $id): bool
    {
        if (!$this->teamRepo->exists($id)) {
            throw HttpException::notFound("Team member with identifier [{$id}] was not found.", 'TEAM_MEMBER_NOT_FOUND');
        }
        return $this->teamRepo->delete($id);
    }

    public function formatMember(array $t, string $locale): array
    {
        return [
            'id' => $t['id'],
            'name' => $locale === 'en' ? ($t['name_en'] ?: $t['name_ar']) : $t['name_ar'],
            'nameAr' => $t['name_ar'],
            'nameEn' => $t['name_en'],
            'role' => $locale === 'en' ? ($t['role_en'] ?: $t['role_ar']) : $t['role_ar'],
            'roleAr' => $t['role_ar'],
            'roleEn' => $t['role_en'],
            'bio' => $locale === 'en' ? ($t['bio_en'] ?: $t['bio_ar']) : $t['bio_ar'],
            'bioAr' => $t['bio_ar'],
            'bioEn' => $t['bio_en'],
            'image' => $t['image_url'],
            'imageUrl' => $t['image_url'],
            'sector' => $t['sector'],
            'badge' => $locale === 'en' ? ($t['badge_en'] ?: $t['badge_ar']) : $t['badge_ar'],
            'badgeAr' => $t['badge_ar'],
            'badgeEn' => $t['badge_en'],
            'experience' => $locale === 'en' ? ($t['experience_en'] ?: $t['experience_ar']) : $t['experience_ar'],
            'experienceAr' => $t['experience_ar'],
            'experienceEn' => $t['experience_en'],
            'email' => $t['email'],
            'phone' => $t['phone'],
            'isActive' => (bool) $t['is_active'],
            'sortOrder' => (int) $t['sort_order']
        ];
    }
}

<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Services;

use Hedabkh\Backend\Database\Repositories\PartnerRepository;
use Hedabkh\Backend\Http\HttpException;

class PartnerService
{
    private PartnerRepository $partnerRepo;

    public function __construct(PartnerRepository $partnerRepo)
    {
        $this->partnerRepo = $partnerRepo;
    }

    public function getPartners(array $params = []): array
    {
        $filters = [];
        if (!empty($params['category'])) {
            $filters['category'] = $params['category'];
        }
        if (isset($params['is_active'])) {
            $filters['is_active'] = $params['is_active'];
        }

        $items = $this->partnerRepo->getPartners($filters);
        return array_map([$this, 'formatPartner'], $items);
    }

    public function getPartner(string $id): array
    {
        $item = $this->partnerRepo->findById($id);
        if (!$item) {
            throw HttpException::notFound("Partner with identifier [{$id}] was not found.", 'PARTNER_NOT_FOUND');
        }
        return $this->formatPartner($item);
    }

    public function createPartner(array $data): array
    {
        $id = $data['id'] ?? ('partner-' . bin2hex(random_bytes(4)));
        $record = [
            'id' => $id,
            'name_ar' => $data['name_ar'] ?? $data['nameAr'] ?? '',
            'name_en' => $data['name_en'] ?? $data['nameEn'] ?? '',
            'logo_url' => $data['logo_url'] ?? $data['logoUrl'] ?? $data['logo'] ?? '/images/logos/ministry-municipal-affairs.jpg',
            'category' => $data['category'] ?? 'government',
            'contract_role_ar' => $data['contract_role_ar'] ?? $data['contractRoleAr'] ?? 'مقاول رئيسي معتمد',
            'contract_role_en' => $data['contract_role_en'] ?? $data['contractRoleEn'] ?? 'Approved Main Contractor',
            'projects_count' => (int) ($data['projects_count'] ?? $data['projectsCount'] ?? 5),
            'is_active' => isset($data['is_active']) ? (int) $data['is_active'] : 1,
            'sort_order' => (int) ($data['sort_order'] ?? 0)
        ];

        $this->partnerRepo->insert($record);
        return $this->getPartner($id);
    }

    public function updatePartner(string $id, array $data): array
    {
        if (!$this->partnerRepo->exists($id)) {
            throw HttpException::notFound("Partner with identifier [{$id}] was not found.", 'PARTNER_NOT_FOUND');
        }

        $update = [];
        $allowed = ['name_ar', 'name_en', 'logo_url', 'category', 'contract_role_ar', 'contract_role_en', 'projects_count', 'is_active', 'sort_order'];
        foreach ($allowed as $f) {
            if (array_key_exists($f, $data)) {
                $update[$f] = $data[$f];
            }
        }

        if (!empty($update)) {
            $this->partnerRepo->update($id, $update);
        }

        return $this->getPartner($id);
    }

    public function deletePartner(string $id): bool
    {
        if (!$this->partnerRepo->exists($id)) {
            throw HttpException::notFound("Partner with identifier [{$id}] was not found.", 'PARTNER_NOT_FOUND');
        }
        return $this->partnerRepo->delete($id);
    }

    public function formatPartner(array $p): array
    {
        $cat = $p['category'] ?? 'government';
        $catAr = 'جهة حكومية معتمدة';
        $catEn = 'Government Entity';
        if ($cat === 'ministry') {
            $catAr = 'وزارة سيادية';
            $catEn = 'Sovereign Ministry';
        } elseif ($cat === 'amanah') {
            $catAr = 'أمانة منطقة';
            $catEn = 'Regional Municipality';
        } elseif ($cat === 'baladiya') {
            $catAr = 'بلدية محافظة';
            $catEn = 'Governorate Municipality';
        }

        return [
            'id' => $p['id'],
            'nameAr' => $p['name_ar'] ?? '',
            'nameEn' => $p['name_en'] ?? ($p['name_ar'] ?? ''),
            'logoUrl' => $p['logo_url'] ?? '/images/logos/ministry-municipal-affairs.jpg',
            'logo' => $p['logo_url'] ?? '/images/logos/ministry-municipal-affairs.jpg',
            'category' => $cat,
            'categoryAr' => $catAr,
            'categoryEn' => $catEn,
            'contractRoleAr' => $p['contract_role_ar'] ?? 'مقاول رئيسي معتمد',
            'contractRoleEn' => $p['contract_role_en'] ?? 'Approved Main Contractor',
            'badgeAr' => $p['contract_role_ar'] ?? 'اعتماد رسمي شامل',
            'badgeEn' => $p['contract_role_en'] ?? 'Full Official Accreditation',
            'projectsCount' => (int) ($p['projects_count'] ?? 5),
            'isActive' => (bool) ($p['is_active'] ?? 1),
            'sortOrder' => (int) ($p['sort_order'] ?? 0)
        ];
    }
}

<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Services;

use Hedabkh\Backend\Database\Repositories\CertificateRepository;
use Hedabkh\Backend\Http\HttpException;

class CertificateService
{
    private CertificateRepository $certRepo;

    public function __construct(CertificateRepository $certRepo)
    {
        $this->certRepo = $certRepo;
    }

    public function getCertificates(array $params = []): array
    {
        $filters = [];
        if (!empty($params['type'])) {
            $filters['type'] = $params['type'];
        }
        if (!empty($params['category'])) {
            $filters['category'] = $params['category'];
        }
        if (isset($params['is_active'])) {
            $filters['is_active'] = $params['is_active'];
        }

        $items = $this->certRepo->getCertificates($filters);
        return array_map([$this, 'formatCertificate'], $items);
    }

    public function getCertificate(string $id): array
    {
        $item = $this->certRepo->findById($id);
        if (!$item) {
            throw HttpException::notFound("Certificate with identifier [{$id}] was not found.", 'CERTIFICATE_NOT_FOUND');
        }
        return $this->formatCertificate($item);
    }

    public function createCertificate(array $data): array
    {
        $id = $data['id'] ?? ('cert-' . bin2hex(random_bytes(4)));
        $record = [
            'id' => $id,
            'title_ar' => $data['title_ar'] ?? $data['titleAr'] ?? '',
            'title_en' => $data['title_en'] ?? $data['titleEn'] ?? '',
            'issuer_ar' => $data['issuer_ar'] ?? $data['issuerAr'] ?? '',
            'issuer_en' => $data['issuer_en'] ?? $data['issuerEn'] ?? '',
            'id_number' => $data['id_number'] ?? $data['idNumber'] ?? '',
            'issue_date' => $data['issue_date'] ?? $data['issueDate'] ?? date('Y-m-d'),
            'expiry_date' => $data['expiry_date'] ?? $data['expiryDate'] ?? date('Y-m-d', strtotime('+3 years')),
            'type' => $data['type'] ?? 'iso',
            'category' => $data['category'] ?? 'iso',
            'credit_rating' => $data['credit_rating'] ?? $data['creditRating'] ?? null,
            'file_path' => $data['file_path'] ?? $data['filePath'] ?? null,
            'is_active' => isset($data['is_active']) ? (int) $data['is_active'] : 1,
            'sort_order' => (int) ($data['sort_order'] ?? 0)
        ];

        $this->certRepo->insert($record);
        return $this->getCertificate($id);
    }

    public function updateCertificate(string $id, array $data): array
    {
        if (!$this->certRepo->exists($id)) {
            throw HttpException::notFound("Certificate with identifier [{$id}] was not found.", 'CERTIFICATE_NOT_FOUND');
        }

        $update = [];
        $allowed = ['title_ar', 'title_en', 'issuer_ar', 'issuer_en', 'id_number', 'issue_date', 'expiry_date', 'type', 'category', 'credit_rating', 'file_path', 'is_active', 'sort_order'];
        foreach ($allowed as $f) {
            if (array_key_exists($f, $data)) {
                $update[$f] = $data[$f];
            }
        }

        if (!empty($update)) {
            $this->certRepo->update($id, $update);
        }

        return $this->getCertificate($id);
    }

    public function deleteCertificate(string $id): bool
    {
        if (!$this->certRepo->exists($id)) {
            throw HttpException::notFound("Certificate with identifier [{$id}] was not found.", 'CERTIFICATE_NOT_FOUND');
        }
        return $this->certRepo->delete($id);
    }

    public function formatCertificate(array $c): array
    {
        return [
            'id' => $c['id'],
            'title' => $c['title_ar'] ?? ($c['title_en'] ?? ''),
            'titleAr' => $c['title_ar'] ?? '',
            'titleEn' => $c['title_en'] ?? ($c['title_ar'] ?? ''),
            'issuer' => $c['issuer_ar'] ?? ($c['issuer_en'] ?? ''),
            'issuerAr' => $c['issuer_ar'] ?? '',
            'issuerEn' => $c['issuer_en'] ?? ($c['issuer_ar'] ?? ''),
            'idNumber' => $c['id_number'] ?? '',
            'issueDate' => $c['issue_date'] ?? '',
            'expiryDate' => $c['expiry_date'] ?? '',
            'type' => $c['type'] ?? 'official',
            'category' => $c['category'] ?? 'official',
            'creditRating' => $c['credit_rating'] ?? '',
            'filePath' => $c['file_path'] ?? '/documents/certificate.pdf',
            'isActive' => (bool) ($c['is_active'] ?? 1),
            'sortOrder' => (int) ($c['sort_order'] ?? 0)
        ];
    }
}

<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Services;

use Hedabkh\Backend\Database\Repositories\InquiryRepository;
use Hedabkh\Backend\Http\HttpException;

class InquiryService
{
    private InquiryRepository $inquiryRepo;

    public function __construct(InquiryRepository $inquiryRepo)
    {
        $this->inquiryRepo = $inquiryRepo;
    }

    public function submitInquiry(array $data, ?string $ip = null): array
    {
        if (empty($data['name']) || empty($data['email']) || empty($data['message'])) {
            throw HttpException::badRequest('Name, email, and message are required fields.', 'INVALID_INQUIRY_INPUT');
        }

        $id = 'inq-' . time() . rand(100, 999);
        $record = [
            'id' => $id,
            'name' => (string) $data['name'],
            'email' => (string) $data['email'],
            'phone' => (string) ($data['phone'] ?? ''),
            'message' => (string) $data['message'],
            'status' => 'new',
            'notes' => null,
            'ip_address' => $ip,
            'created_at' => date('Y-m-d H:i:s')
        ];

        $this->inquiryRepo->insert($record);

        return [
            'id' => $id,
            'status' => 'new',
            'createdAt' => $record['created_at']
        ];
    }

    public function getInquiries(array $params = []): array
    {
        $limit = min(100, max(1, (int) ($params['limit'] ?? 50)));
        $offset = max(0, (int) ($params['offset'] ?? 0));
        $filters = [];
        if (!empty($params['status'])) {
            $filters['status'] = $params['status'];
        }

        return $this->inquiryRepo->getInquiries($filters, $limit, $offset);
    }

    public function updateStatus(string $id, string $status, ?string $notes = null): array
    {
        $inquiry = $this->inquiryRepo->findById($id);
        if (!$inquiry) {
            throw HttpException::notFound("Inquiry [{$id}] not found.", 'INQUIRY_NOT_FOUND');
        }

        $update = ['status' => $status];
        if ($notes !== null) {
            $update['notes'] = $notes;
        }

        $this->inquiryRepo->update($id, $update);
        return $this->inquiryRepo->findById($id) ?: [];
    }

    public function deleteInquiry(string $id): bool
    {
        if (!$this->inquiryRepo->exists($id)) {
            throw HttpException::notFound("Inquiry [{$id}] not found.", 'INQUIRY_NOT_FOUND');
        }
        return $this->inquiryRepo->delete($id);
    }
}

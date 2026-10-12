<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Http;

class JsonResponse extends Response
{
    public function __construct(mixed $data, int $statusCode = 200, array $headers = [])
    {
        $headers['Content-Type'] = 'application/json; charset=utf-8';
        $json = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRESERVE_ZERO_FRACTION);
        
        if ($json === false) {
            $json = json_encode([
                'success' => false,
                'error' => [
                    'code' => 'JSON_ENCODE_ERROR',
                    'message' => 'Failed to encode response payload.'
                ]
            ]);
            $statusCode = 500;
        }

        parent::__construct($json, $statusCode, $headers);
    }

    /**
     * Standard success envelope helper.
     */
    public static function success(mixed $data = null, array $meta = [], int $statusCode = 200): self
    {
        $payload = [
            'success' => true,
            'data' => $data ?? new \stdClass(),
            'meta' => array_merge([
                'timestamp' => gmdate('Y-m-d\TH:i:s\Z'),
                'version' => 'v1'
            ], $meta)
        ];

        return new self($payload, $statusCode);
    }

    /**
     * Standard error envelope helper.
     */
    public static function error(string $message, string $code = 'ERROR', array $details = [], int $statusCode = 400): self
    {
        $errorPayload = [
            'code' => $code,
            'message' => $message,
        ];

        if (!empty($details)) {
            $errorPayload['details'] = $details;
        }

        $payload = [
            'success' => false,
            'error' => $errorPayload,
            'meta' => [
                'timestamp' => gmdate('Y-m-d\TH:i:s\Z'),
                'version' => 'v1'
            ]
        ];

        return new self($payload, $statusCode);
    }
}

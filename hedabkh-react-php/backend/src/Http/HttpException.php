<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Http;

class HttpException extends \Exception
{
    private int $statusCode;
    private string $errorCode;
    private array $details;

    public function __construct(
        int $statusCode,
        string $message,
        string $errorCode = 'HTTP_ERROR',
        array $details = [],
        ?\Throwable $previous = null
    ) {
        parent::__construct($message, $statusCode, $previous);
        $this->statusCode = $statusCode;
        $this->errorCode = $errorCode;
        $this->details = $details;
    }

    public function getStatusCode(): int
    {
        return $this->statusCode;
    }

    public function getErrorCode(): string
    {
        return $this->errorCode;
    }

    public function getDetails(): array
    {
        return $this->details;
    }

    public static function badRequest(string $message = 'Bad Request', string $code = 'BAD_REQUEST', array $details = []): self
    {
        return new self(400, $message, $code, $details);
    }

    public static function unauthorized(string $message = 'Unauthorized', string $code = 'UNAUTHORIZED'): self
    {
        return new self(401, $message, $code);
    }

    public static function forbidden(string $message = 'Forbidden', string $code = 'FORBIDDEN'): self
    {
        return new self(403, $message, $code);
    }

    public static function notFound(string $message = 'Resource Not Found', string $code = 'NOT_FOUND'): self
    {
        return new self(404, $message, $code);
    }

    public static function methodNotAllowed(string $message = 'Method Not Allowed', string $code = 'METHOD_NOT_ALLOWED'): self
    {
        return new self(405, $message, $code);
    }

    public static function conflict(string $message = 'Conflict', string $code = 'CONFLICT'): self
    {
        return new self(409, $message, $code);
    }

    public static function unprocessableEntity(string $message = 'Unprocessable Entity', string $code = 'UNPROCESSABLE_ENTITY', array $details = []): self
    {
        return new self(422, $message, $code, $details);
    }

    public static function internal(string $message = 'Internal Server Error', string $code = 'INTERNAL_SERVER_ERROR'): self
    {
        return new self(500, $message, $code);
    }
}

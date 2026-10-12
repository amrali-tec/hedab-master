<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Http;

class Response
{
    protected int $statusCode = 200;
    protected array $headers = [];
    protected string $body = '';

    public function __construct(string $body = '', int $statusCode = 200, array $headers = [])
    {
        $this->body = $body;
        $this->statusCode = $statusCode;
        $this->headers = $headers;
    }

    public function getStatusCode(): int
    {
        return $this->statusCode;
    }

    public function setStatusCode(int $statusCode): self
    {
        $this->statusCode = $statusCode;
        return $this;
    }

    public function getHeaders(): array
    {
        return $this->headers;
    }

    public function setHeader(string $name, string $value): self
    {
        $this->headers[$name] = $value;
        return $this;
    }

    public function getBody(): string
    {
        return $this->body;
    }

    public function setBody(string $body): self
    {
        $this->body = $body;
        return $this;
    }

    /**
     * Send response headers and body to client.
     */
    public function send(): void
    {
        if (!headers_sent()) {
            http_response_code($this->statusCode);

            foreach ($this->headers as $name => $value) {
                if (is_array($value)) {
                    foreach ($value as $subValue) {
                        header("{$name}: {$subValue}", false);
                    }
                } else {
                    header("{$name}: {$value}", true);
                }
            }
        }

        echo $this->body;
    }
}

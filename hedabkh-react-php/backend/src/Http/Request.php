<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Http;

class Request
{
    private string $method;
    private string $uri;
    private string $path;
    private array $queryParams;
    private array $headers;
    private array $cookies;
    private array $server;
    private string $rawBody;
    private array $parsedBody;
    private array $routeParams = [];

    public function __construct(
        string $method,
        string $uri,
        array $queryParams = [],
        array $headers = [],
        array $cookies = [],
        array $server = [],
        string $rawBody = '',
        array $parsedBody = []
    ) {
        $this->method = strtoupper($method);
        $this->uri = $uri;
        $this->path = parse_url($uri, PHP_URL_PATH) ?: '/';
        $this->queryParams = $queryParams;
        $this->headers = $headers;
        $this->cookies = $cookies;
        $this->server = $server;
        $this->rawBody = $rawBody;
        $this->parsedBody = $parsedBody;
    }

    /**
     * Capture the current HTTP request from globals.
     */
    public static function capture(): self
    {
        $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
        $uri = $_SERVER['REQUEST_URI'] ?? '/';
        
        $headers = [];
        foreach ($_SERVER as $key => $value) {
            if (str_starts_with($key, 'HTTP_')) {
                $headerName = str_replace('_', '-', strtolower(substr($key, 5)));
                $headers[$headerName] = $value;
            } elseif (in_array($key, ['CONTENT_TYPE', 'CONTENT_LENGTH'])) {
                $headerName = str_replace('_', '-', strtolower($key));
                $headers[$headerName] = $value;
            }
        }

        $rawBody = (string) file_get_contents('php://input');
        $parsedBody = [];

        // Parse JSON if content type matches
        $contentType = $headers['content-type'] ?? '';
        if (str_contains(strtolower($contentType), 'application/json') && $rawBody !== '') {
            $decoded = json_decode($rawBody, true);
            if (is_array($decoded)) {
                $parsedBody = $decoded;
            }
        } elseif (!empty($_POST)) {
            $parsedBody = $_POST;
        }

        return new self(
            $method,
            $uri,
            $_GET,
            $headers,
            $_COOKIE,
            $_SERVER,
            $rawBody,
            $parsedBody
        );
    }

    public function getMethod(): string
    {
        return $this->method;
    }

    public function getUri(): string
    {
        return $this->uri;
    }

    public function getPath(): string
    {
        return $this->path;
    }

    public function setPath(string $path): self
    {
        $this->path = $path;
        return $this;
    }

    public function getQuery(string $key, mixed $default = null): mixed
    {
        return $this->queryParams[$key] ?? $default;
    }

    public function getQueryParams(): array
    {
        return $this->queryParams;
    }

    public function getHeader(string $name, mixed $default = null): mixed
    {
        $name = strtolower($name);
        return $this->headers[$name] ?? $default;
    }

    public function getHeaders(): array
    {
        return $this->headers;
    }

    public function getCookie(string $name, mixed $default = null): mixed
    {
        return $this->cookies[$name] ?? $default;
    }

    public function getRawBody(): string
    {
        return $this->rawBody;
    }

    public function getBody(): array
    {
        return $this->parsedBody;
    }

    public function setParsedBody(array $body): self
    {
        $this->parsedBody = $body;
        return $this;
    }

    public function input(string $key, mixed $default = null): mixed
    {
        return $this->parsedBody[$key] ?? $this->queryParams[$key] ?? $default;
    }

    public function getRouteParam(string $name, mixed $default = null): mixed
    {
        return $this->routeParams[$name] ?? $default;
    }

    public function getRouteParams(): array
    {
        return $this->routeParams;
    }

    public function setRouteParams(array $params): self
    {
        $this->routeParams = $params;
        return $this;
    }

    private ?array $user = null;

    public function setUser(array $user): self
    {
        $this->user = $user;
        return $this;
    }

    public function getUser(): ?array
    {
        return $this->user;
    }

    public function getFiles(): array
    {
        return $_FILES;
    }

    public function getFile(string $key): ?array
    {
        return $_FILES[$key] ?? null;
    }

    public function getClientIp(): string
    {
        return $this->server['HTTP_CF_CONNECTING_IP']
            ?? $this->server['HTTP_X_FORWARDED_FOR']
            ?? $this->server['REMOTE_ADDR']
            ?? '127.0.0.1';
    }
}

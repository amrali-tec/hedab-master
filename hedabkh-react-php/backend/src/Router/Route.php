<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Router;

use Hedabkh\Backend\Http\Request;

class Route
{
    private string $method;
    private string $path;
    private mixed $handler;
    private array $middlewares = [];
    private string $pattern;
    private array $paramNames = [];

    public function __construct(string $method, string $path, mixed $handler)
    {
        $this->method = strtoupper($method);
        $this->path = $path;
        $this->handler = $handler;
        $this->compile();
    }

    private function compile(): void
    {
        // Convert {param} to named regex capture group
        $pattern = preg_replace_callback('/\{([a-zA-Z0-9_]+)\}/', function ($matches) {
            $this->paramNames[] = $matches[1];
            return '(?P<' . $matches[1] . '>[^/]+)';
        }, $this->path);

        $this->pattern = '#^' . $pattern . '$#';
    }

    public function matches(string $method, string $path, array &$params = []): bool
    {
        if ($this->method !== strtoupper($method)) {
            return false;
        }

        if (preg_match($this->pattern, $path, $matches)) {
            $params = [];
            foreach ($this->paramNames as $name) {
                if (isset($matches[$name])) {
                    $params[$name] = urldecode($matches[$name]);
                }
            }
            return true;
        }

        return false;
    }

    public function matchesPath(string $path): bool
    {
        return (bool) preg_match($this->pattern, $path);
    }

    public function middleware(array|string $middleware): self
    {
        if (is_array($middleware)) {
            $this->middlewares = array_merge($this->middlewares, $middleware);
        } else {
            $this->middlewares[] = $middleware;
        }
        return $this;
    }

    public function getMiddlewares(): array
    {
        return $this->middlewares;
    }

    public function getMethod(): string
    {
        return $this->method;
    }

    public function getPath(): string
    {
        return $this->path;
    }

    public function getHandler(): mixed
    {
        return $this->handler;
    }
}

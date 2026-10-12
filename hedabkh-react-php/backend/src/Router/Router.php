<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Router;

use Hedabkh\Backend\Core\Container;
use Hedabkh\Backend\Http\HttpException;
use Hedabkh\Backend\Http\Request;
use Hedabkh\Backend\Http\Response;

class Router
{
    private array $routes = [];
    private string $groupPrefix = '';
    private array $groupMiddlewares = [];

    public function get(string $path, mixed $handler): Route
    {
        return $this->addRoute('GET', $path, $handler);
    }

    public function post(string $path, mixed $handler): Route
    {
        return $this->addRoute('POST', $path, $handler);
    }

    public function put(string $path, mixed $handler): Route
    {
        return $this->addRoute('PUT', $path, $handler);
    }

    public function patch(string $path, mixed $handler): Route
    {
        return $this->addRoute('PATCH', $path, $handler);
    }

    public function delete(string $path, mixed $handler): Route
    {
        return $this->addRoute('DELETE', $path, $handler);
    }

    public function options(string $path, mixed $handler): Route
    {
        return $this->addRoute('OPTIONS', $path, $handler);
    }

    public function group(string $prefix, callable $callback, array $middlewares = []): void
    {
        $previousPrefix = $this->groupPrefix;
        $previousMiddlewares = $this->groupMiddlewares;

        $this->groupPrefix = $previousPrefix . '/' . trim($prefix, '/');
        $this->groupMiddlewares = array_merge($previousMiddlewares, $middlewares);

        $callback($this);

        $this->groupPrefix = $previousPrefix;
        $this->groupMiddlewares = $previousMiddlewares;
    }

    private function addRoute(string $method, string $path, mixed $handler): Route
    {
        $fullPath = rtrim($this->groupPrefix . '/' . ltrim($path, '/'), '/');
        if ($fullPath === '') {
            $fullPath = '/';
        }

        $route = new Route($method, $fullPath, $handler);
        if (!empty($this->groupMiddlewares)) {
            $route->middleware($this->groupMiddlewares);
        }

        $this->routes[] = $route;
        return $route;
    }

    /**
     * Dispatch the request to the matching route handler.
     */
    public function dispatch(Request $request): Response
    {
        $method = $request->getMethod();
        $path = rtrim($request->getPath(), '/');
        if ($path === '') {
            $path = '/';
        }

        $pathMatched = false;
        $allowedMethods = [];

        foreach ($this->routes as $route) {
            $params = [];
            if ($route->matches($method, $path, $params)) {
                $request->setRouteParams($params);
                return $this->runRoute($route, $request);
            }

            if ($route->matchesPath($path)) {
                $pathMatched = true;
                $allowedMethods[] = $route->getMethod();
            }
        }

        if ($pathMatched) {
            // Method not allowed
            $allowedStr = implode(', ', array_unique($allowedMethods));
            $exception = HttpException::methodNotAllowed(
                "HTTP method [{$method}] is not allowed for route [{$path}]. Supported: [{$allowedStr}].",
                'METHOD_NOT_ALLOWED'
            );
            throw $exception;
        }

        throw HttpException::notFound(
            "API endpoint [{$method} {$path}] does not exist.",
            'ENDPOINT_NOT_FOUND'
        );
    }

    private function runRoute(Route $route, Request $request): Response
    {
        $middlewares = $route->getMiddlewares();
        $container = Container::getInstance();

        $pipeline = array_reduce(
            array_reverse($middlewares),
            function ($next, $middleware) use ($container) {
                return function (Request $request) use ($middleware, $next, $container) {
                    $instance = is_string($middleware) ? $container->get($middleware) : $middleware;
                    return $instance->handle($request, $next);
                };
            },
            function (Request $request) use ($route, $container) {
                return $this->executeHandler($route->getHandler(), $request, $container);
            }
        );

        return $pipeline($request);
    }

    private function executeHandler(mixed $handler, Request $request, Container $container): Response
    {
        if (is_callable($handler)) {
            $result = $handler($request);
        } elseif (is_array($handler) && count($handler) === 2) {
            [$controllerClass, $method] = $handler;
            $controller = is_string($controllerClass) ? $container->get($controllerClass) : $controllerClass;
            $result = $controller->$method($request);
        } elseif (is_string($handler) && str_contains($handler, '@')) {
            [$controllerClass, $method] = explode('@', $handler, 2);
            $controller = $container->get($controllerClass);
            $result = $controller->$method($request);
        } else {
            throw new \RuntimeException("Invalid route handler format.");
        }

        if ($result instanceof Response) {
            return $result;
        }

        if (is_array($result) || is_object($result)) {
            return \Hedabkh\Backend\Http\JsonResponse::success($result);
        }

        return new Response((string) $result);
    }
}

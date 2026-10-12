<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Core;

use Hedabkh\Backend\Http\Request;
use Hedabkh\Backend\Http\Response;
use Hedabkh\Backend\Middleware\CorsMiddleware;
use Hedabkh\Backend\Middleware\ErrorHandlerMiddleware;
use Hedabkh\Backend\Middleware\JsonBodyMiddleware;
use Hedabkh\Backend\Middleware\RateLimitMiddleware;
use Hedabkh\Backend\Router\Router;
use Hedabkh\Backend\Security\SecurityHeaders;

class Application
{
    private string $basePath;
    private Container $container;
    private Router $router;
    private array $globalMiddlewares = [];

    public function __construct(string $basePath)
    {
        $this->basePath = rtrim($basePath, '/\\');
        $this->container = Container::getInstance();
        $this->router = new Router();
    }

    /**
     * Register PSR-4 autoloader for Hedabkh\Backend namespace.
     */
    public static function registerAutoloader(string $srcPath): void
    {
        spl_autoload_register(function (string $class) use ($srcPath) {
            $prefix = 'Hedabkh\\Backend\\';
            if (!str_starts_with($class, $prefix)) {
                return;
            }

            $relativeClass = substr($class, strlen($prefix));
            $file = $srcPath . '/' . str_replace('\\', '/', $relativeClass) . '.php';

            if (file_exists($file)) {
                require_once $file;
            }
        });
    }

    /**
     * Bootstrap environment, configurations, and core services.
     */
    public function bootstrap(): self
    {
        // 1. Load Environment variables
        $envFile = $this->basePath . '/.env';
        if (file_exists($envFile)) {
            Environment::load($envFile);
        } else {
            $exampleEnv = $this->basePath . '/.env.example';
            if (file_exists($exampleEnv)) {
                Environment::load($exampleEnv);
            }
        }

        // 2. Load Config files
        Config::load($this->basePath . '/config');

        // 3. Set Timezone
        date_default_timezone_set(Config::get('app.timezone', 'Asia/Riyadh'));

        // 4. Register Global Middlewares
        $this->use(ErrorHandlerMiddleware::class);
        $this->use(CorsMiddleware::class);
        $this->use(SecurityHeaders::class);
        $this->use(RateLimitMiddleware::class);
        $this->use(JsonBodyMiddleware::class);

        // 5. Register Routes under API Prefix
        $apiPrefix = Config::get('app.api_prefix', '/api/v1');
        $router = $this->router;

        $router->group($apiPrefix, function (Router $r) {
            $routesFile = $this->basePath . '/routes/api.php';
            if (file_exists($routesFile)) {
                $router = $r;
                require $routesFile;
            }
        });

        return $this;
    }

    /**
     * Add a global middleware to the pipeline.
     */
    public function use(string|object $middleware): self
    {
        $this->globalMiddlewares[] = $middleware;
        return $this;
    }

    /**
     * Handle incoming request and return HTTP response.
     */
    public function handle(Request $request): Response
    {
        // Normalize request path if deployed in an Apache subdirectory
        $this->normalizePath($request);

        $pipeline = array_reduce(
            array_reverse($this->globalMiddlewares),
            function ($next, $middleware) {
                return function (Request $request) use ($middleware, $next) {
                    $instance = is_string($middleware) ? $this->container->get($middleware) : $middleware;
                    return $instance->handle($request, $next);
                };
            },
            function (Request $request) {
                return $this->router->dispatch($request);
            }
        );

        return $pipeline($request);
    }

    /**
     * Normalizes request path across PHP standalone server, Apache subdirectory, or URL rewriting.
     */
    private function normalizePath(Request $request): void
    {
        $path = $request->getPath();
        $apiPrefix = Config::get('app.api_prefix', '/api/v1');

        // 1. Root / Diagnostic / Front controller paths map to API root
        if ($path === '/' || $path === '' || $path === '/api' || $path === '/api/' || $path === '/index.php' || $path === '/api/index.php') {
            $request->setPath($apiPrefix);
            return;
        }

        // 2. Canonical /api/v1 paths
        if ($path === '/api/v1' || $path === '/api/v1/') {
            $request->setPath($apiPrefix);
            return;
        }

        if (str_starts_with($path, $apiPrefix . '/')) {
            $request->setPath(rtrim($path, '/'));
            return;
        }

        // 3. /v1/ paths
        if (str_starts_with($path, '/v1/')) {
            $request->setPath(rtrim('/api' . $path, '/'));
            return;
        }

        if ($path === '/v1') {
            $request->setPath($apiPrefix);
            return;
        }

        // 4. Strip script directory prefix if running under a physical subfolder (/api)
        $scriptName = $_SERVER['SCRIPT_NAME'] ?? '';
        $scriptDir = dirname($scriptName);

        if ($scriptDir !== '/' && $scriptDir !== '\\' && $scriptDir !== '.') {
            $scriptDir = str_replace('\\', '/', $scriptDir);
            if (str_starts_with($path, $scriptDir)) {
                $path = substr($path, strlen($scriptDir));
                if (!str_starts_with($path, '/')) {
                    $path = '/' . $path;
                }
            }
        }

        if ($path === '/' || $path === '' || $path === '/index.php') {
            $request->setPath($apiPrefix);
            return;
        }

        // 5. If path after directory stripping does not start with /api/v1, map it
        if (!str_starts_with($path, '/api/')) {
            if (str_starts_with($path, '/v1/')) {
                $path = '/api' . $path;
            } else {
                $path = '/api/v1' . ($path === '/' ? '' : $path);
            }
        }

        $request->setPath(rtrim($path, '/'));
    }

    public function getContainer(): Container
    {
        return $this->container;
    }

    public function getRouter(): Router
    {
        return $this->router;
    }
}

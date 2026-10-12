<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Core;

class Container
{
    private static ?Container $instance = null;
    private array $bindings = [];
    private array $instances = [];

    public static function getInstance(): Container
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Bind a service/factory to the container.
     */
    public function bind(string $abstract, callable|string $concrete): void
    {
        $this->bindings[$abstract] = $concrete;
    }

    /**
     * Register a singleton instance.
     */
    public function singleton(string $abstract, callable|object|string $concrete): void
    {
        if (is_object($concrete) && !($concrete instanceof \Closure)) {
            $this->instances[$abstract] = $concrete;
            return;
        }

        $this->bindings[$abstract] = function ($container) use ($concrete) {
            if ($concrete instanceof \Closure) {
                return $concrete($container);
            }
            return new $concrete();
        };
    }

    /**
     * Resolve a service from the container.
     */
    public function get(string $abstract): mixed
    {
        if (isset($this->instances[$abstract])) {
            return $this->instances[$abstract];
        }

        if ($abstract === \Hedabkh\Backend\Database\Connection::class) {
            $conn = \Hedabkh\Backend\Database\DatabaseManager::getConnection();
            $this->instances[$abstract] = $conn;
            return $conn;
        }

        if (isset($this->bindings[$abstract])) {
            $concrete = $this->bindings[$abstract];
            $object = $concrete instanceof \Closure ? $concrete($this) : $this->build($concrete);
            $this->instances[$abstract] = $object;
            return $object;
        }

        if (class_exists($abstract)) {
            $object = $this->build($abstract);
            return $object;
        }

        throw new \RuntimeException("Service [{$abstract}] could not be resolved from container.");
    }

    /**
     * Build an instance with constructor dependency injection.
     */
    public function build(string $concrete): object
    {
        $reflector = new \ReflectionClass($concrete);

        if (!$reflector->isInstantiable()) {
            throw new \RuntimeException("Class [{$concrete}] is not instantiable.");
        }

        $constructor = $reflector->getConstructor();
        if ($constructor === null) {
            return new $concrete();
        }

        $parameters = $constructor->getParameters();
        $dependencies = [];

        foreach ($parameters as $parameter) {
            $type = $parameter->getType();

            if ($type instanceof \ReflectionNamedType && !$type->isBuiltin()) {
                $dependencies[] = $this->get($type->getName());
            } elseif ($parameter->isDefaultValueAvailable()) {
                $dependencies[] = $parameter->getDefaultValue();
            } else {
                throw new \RuntimeException("Unresolvable dependency [{$parameter->getName()}] in class [{$concrete}].");
            }
        }

        return $reflector->newInstanceArgs($dependencies);
    }

    /**
     * Check if service is registered.
     */
    public function has(string $abstract): bool
    {
        return isset($this->bindings[$abstract]) || isset($this->instances[$abstract]);
    }
}

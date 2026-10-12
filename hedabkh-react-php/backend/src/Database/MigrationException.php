<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Database;

class MigrationException extends \RuntimeException
{
    private string $migrationName;

    public function __construct(string $message, string $migrationName = '', int $code = 0, ?\Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
        $this->migrationName = $migrationName;
    }

    public function getMigrationName(): string
    {
        return $this->migrationName;
    }
}

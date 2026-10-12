<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Database;

use PDO;

abstract class Migration implements MigrationInterface
{
    protected string $description = '';

    abstract public function up(PDO $db): void;

    abstract public function down(PDO $db): void;

    public function getDescription(): string
    {
        return $this->description;
    }

    /**
     * Helper to execute raw SQL statement.
     */
    protected function execute(PDO $db, string $sql): void
    {
        $db->exec($sql);
    }
}

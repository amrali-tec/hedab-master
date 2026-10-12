<?php

declare(strict_types=1);

namespace Hedabkh\Backend\Database;

use PDO;

interface MigrationInterface
{
    /**
     * Apply migration (create/alter schema).
     */
    public function up(PDO $db): void;

    /**
     * Revert migration (drop/reverse schema).
     */
    public function down(PDO $db): void;

    /**
     * Get descriptive name of migration.
     */
    public function getDescription(): string;
}

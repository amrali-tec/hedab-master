# HEDABKH Corporate Portal — Native PHP 8.2 Backend

## Overview
This backend provides the REST API for the HEDABKH React SPA frontend, built with native PHP 8.2 and MariaDB. It requires zero external Node.js runtime, zero heavy frameworks, and is designed to execute seamlessly on Apache (XAMPP / Hostinger).

## Requirements
- PHP 8.2+ with PDO MySQL and JSON extensions enabled
- MariaDB 10.4+ / MySQL 8.0+
- Apache 2.4+ with `mod_rewrite` and `mod_headers`

## Directory Structure
- `public/`: Web server document root containing `index.php` and `.htaccess`
- `config/`: Application configuration arrays
- `src/`: PSR-4 mapped PHP source code (`Hedabkh\Backend\*`)
- `routes/`: API route definitions
- `storage/`: Server-side logs and file cache

## Setup Instructions
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Configure database credentials in `.env`.
3. Point your Apache virtual host or alias to `backend/public/`.
4. Test health endpoint: `GET /api/v1/health`.

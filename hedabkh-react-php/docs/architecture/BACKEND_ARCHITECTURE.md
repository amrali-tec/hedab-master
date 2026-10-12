# HEDABKH React-PHP — Phase 2: PHP 8.2 Backend Architecture Design

**Runtime:** PHP 8.2+ (Strict Types, Constructor Property Promotion, Enums, Fibers)  
**Database Driver:** PDO MySQL (`ATTR_ERRMODE => ERRMODE_EXCEPTION`, `ATTR_EMULATE_PREPARES => false`)  
**Web Server:** Apache 2.4+ with `mod_rewrite`, `mod_headers`, `mod_deflate`  
**Infrastructure Target:** Local XAMPP (`C:\xampp\htdocs\`) & Hostinger Cloud/Shared Hosting  
**Zero External Daemon Dependency:** No Node.js runtime, no Redis, no Docker, no Supervisor required.  

---

## 1. Directory Structure

```text
F:\hedabkh-react-php\backend\
│
├── public\
│   └── index.php                       # Single entry point for all /api/* requests
│
├── config\
│   ├── app.php                         # Environment, debug mode, base URL, allowed origins
│   ├── database.php                    # Host, port, dbname, user, pass, PDO options
│   ├── auth.php                        # Session lifetime, cookie params, bcrypt cost
│   └── media.php                       # Max upload size, allowed MIME types, upload dirs
│
├── routes\
│   └── api.php                         # Route definitions mapping HTTP method & URI to Controller
│
├── src\
│   ├── Core\
│   │   ├── Application.php             # Service container, bootstrap, exception handler
│   │   ├── Router.php                  # Fast URI pattern matcher supporting dynamic {param}
│   │   ├── Request.php                 # Immutable HTTP request (method, URI, headers, body, query, files)
│   │   ├── Response.php                # JSON response emitter with status & headers
│   │   ├── Database.php                # PDO singleton connection manager with transaction helper
│   │   └── Container.php               # Lightweight dependency injection container
│   │
│   ├── Security\
│   │   ├── SessionManager.php          # Secure PHP session with HttpOnly cookie & rotation
│   │   ├── PasswordHasher.php          # password_hash() / password_verify() with BCRYPT / ARGON2ID
│   │   ├── CsrfGuard.php               # Double-submit cookie or token validation
│   │   └── RateLimiter.php             # File/DB-backed token bucket brute-force protector
│   │
│   ├── Middleware\
│   │   ├── MiddlewareInterface.php     # Contract: handle(Request $req, callable $next): Response
│   │   ├── CorsMiddleware.php          # CORS headers for development & allowed production origins
│   │   ├── AuthMiddleware.php          # Verifies active session & injects User object
│   │   ├── RoleMiddleware.php          # Enforces role / permission checks
│   │   ├── JsonBodyMiddleware.php      # Parses php://input into Request JSON body
│   │   └── ErrorHandlerMiddleware.php  # Catches exceptions, logs, and emits standard JSON error envelope
│   │
│   ├── Controllers\
│   │   ├── BaseController.php          # Helper methods: json(), success(), error(), validate()
│   │   ├── AuthController.php          # login, logout, session check
│   │   ├── PublicController.php        # projects, services, certs, team, articles, stats, inquiries
│   │   ├── CmsController.php           # getPage, saveDraft, publishPage, rollback
│   │   ├── AdminProjectsController.php # Full CRUD for engineering projects
│   │   ├── AdminServicesController.php # Full CRUD for services
│   │   ├── AdminMediaController.php    # Uploads, catalog listing, deletion with reference check
│   │   ├── AdminUsersController.php    # User management & RBAC assignments
│   │   └── AdminSettingsController.php # Brand settings, SEO config, initial seed reset
│   │
│   ├── Services\
│   │   ├── AuthService.php             # Authentication logic, credential verification, log audit
│   │   ├── CmsEngineService.php        # Block tree validation, draft promotion, version snapshots
│   │   ├── MediaStorageService.php     # MIME validation, sanitized naming, disk persistence, thumbnailing
│   │   └── InquiryService.php          # Lead persistence, email notification, sanitization
│   │
│   ├── Repositories\
│   │   ├── ProjectRepository.php       # Prepared SQL queries for projects & features
│   │   ├── ServiceRepository.php       # Prepared SQL queries for services, features & sectors
│   │   ├── CmsPageRepository.php       # Queries for pages, versions & block composition
│   │   ├── UserRepository.php          # User lookup, password updates, permission queries
│   │   └── MediaRepository.php         # Media asset registry & usage reference scanner
│   │
│   ├── Validation\
│   │   ├── Validator.php               # Schema validation engine (required, email, enum, string, int)
│   │   └── ValidationError.php         # Structured validation error container
│   │
│   └── Support\
│       ├── Str.php                     # Slugify, UUID v4 generator, Arabic string helpers
│       ├── Arr.php                     # Array helpers (get, set, pluck, only)
│       └── Logger.php                  # Daily rotating file logger with timestamps
│
├── storage\
│   ├── logs\                           # php-errors.log, api-audit.log
│   └── cache\                          # CMS page cache snapshots (optional)
│
└── uploads\
    ├── images\                         # Uploaded project photos, equipment, team avatars
    └── documents\                      # Uploaded accreditation PDFs, company profiles
```

---

## 2. Request Lifecycle & Routing Engine

```
HTTP Request (e.g. POST /api/v1/admin/projects)
       ↓
Apache (.htaccess directs /api/* to backend/public/index.php)
       ↓
Application::bootstrap()
       ↓
CorsMiddleware (Sets CORS headers, handles OPTIONS preflight)
       ↓
ErrorHandlerMiddleware (Wraps execution in try/catch)
       ↓
JsonBodyMiddleware (Parses php://input into $request->json)
       ↓
Router::dispatch($request)
       ↓
Route Middlewares (AuthMiddleware → RoleMiddleware('projects_manage'))
       ↓
AdminProjectsController::store($request)
       ↓
Validator::validate($request->all(), ProjectSchema::rules())
       ↓
ProjectService::createProject($data)
       ↓
ProjectRepository::insert($projectEntity) (PDO Prepared Statement with Transaction)
       ↓
AdminActivityLogs::record('create', 'project', $id)
       ↓
Response::json(201, ['success' => true, 'data' => $projectEntity])
       ↓
HTTP Response Emitted
```

---

## 3. Database Layer & Transaction Safety

All database queries are executed strictly via **PDO Prepared Statements** using named or positional parameters. No raw SQL concatenation is permitted anywhere in the repository layer.

### Connection Configuration:
```php
$dsn = "mysql:host={$host};port={$port};dbname={$dbname};charset=utf8mb4";
$pdo = new PDO($dsn, $username, $password, [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
]);
```

### Transaction Helper:
```php
public function transaction(callable $callback)
{
    $this->pdo->beginTransaction();
    try {
        $result = $callback($this);
        $this->pdo->commit();
        return $result;
    } catch (\Throwable $e) {
        $this->pdo->rollBack();
        throw $e;
    }
}
```

---

## 4. Security & Authentication Architecture

### 4.1 PHP Session Security
- **Cookie Name:** `HEDABKH_SESSID`
- **Cookie Attributes:** `HttpOnly = true`, `Secure = true` (on HTTPS), `SameSite = 'Lax'`, `Path = '/'`.
- **Session ID Regeneration:** Calls `session_regenerate_id(true)` upon login to eliminate session fixation vulnerabilities.
- **Session Invalidation:** Explicit `session_destroy()` and cookie expiration on logout.

### 4.2 Password Hashing
- Utilizes `password_hash($password, PASSWORD_BCRYPT, ['cost' => 12])` or `PASSWORD_ARGON2ID`.
- Verifies using `password_verify($password, $user['password_hash'])`.
- Auto-rehashes if algorithm cost needs upgrade (`password_needs_rehash()`).

### 4.3 Brute Force Rate Limiting
- Login attempts limited to **5 failures per 15 minutes** per IP address / email.
- Recorded in lightweight database table `admin_login_attempts` with IP and timestamp.

---

## 5. Error Handling & Logging

All uncaught exceptions and errors are caught by `ErrorHandlerMiddleware` and formatted into standard JSON error responses.

- **Development Mode (`APP_DEBUG=true`):** Stack trace and exception details included in `error.details`.
- **Production Mode (`APP_DEBUG=false`):** Generic sanitized message ("Internal server error"), while detailed trace is logged to `backend/storage/logs/error-YYYY-MM-DD.log`.

---

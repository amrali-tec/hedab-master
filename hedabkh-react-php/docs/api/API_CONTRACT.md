# HEDABKH React-PHP — Phase 2: Complete API Contract Specification

**Version:** 1.0.0-PROPOSED  
**Namespace:** `/api/v1/`  
**Protocol:** HTTPS / JSON REST  
**Authentication Standard:** Secure PHP Session with `HttpOnly`, `SameSite=Lax` Cookie & Optional CSRF Header  
**Target Server:** Apache 2.4+ / PHP 8.2+ / MariaDB 10.4+  

---

## 1. Architectural Standards & Response Envelopes

### 1.1 Standard Success Envelope
All `/api/v1/` endpoints return a standardized JSON envelope:
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2026-08-24T22:00:00Z",
    "locale": "ar",
    "version": "v1"
  }
}
```

### 1.2 Standard Error Envelope
```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Project with identifier proj-99 was not found.",
    "details": []
  },
  "meta": {
    "timestamp": "2026-08-24T22:00:00Z",
    "version": "v1"
  }
}
```

### 1.3 HTTP Status Codes Map
- `200 OK`: Request succeeded.
- `201 Created`: Entity created successfully.
- `400 Bad Request`: Validation failure or malformed payload.
- `401 Unauthorized`: Session missing or expired.
- `403 Forbidden`: Insufficient role/permission.
- `404 Not Found`: Entity not found.
- `409 Conflict`: Unique constraint violation (e.g. duplicate email/slug).
- `422 Unprocessable Entity`: Semantic validation failure.
- `500 Internal Server Error`: Uncaught backend exception.

---

## 2. Authentication & Session Module (`/api/v1/auth/`)

### 2.1 `POST /api/v1/auth/login`
- **Module:** Authentication
- **Description:** Authenticates an administrative user, initializes a secure PHP session, issues an `HttpOnly` cookie, and logs the sign-in event.
- **Auth Required:** No (Public / Rate-limited)
- **Request Body:**
  ```json
  {
    "email": "admin@hedabkh.com.sa",
    "password": "SecurePassword123"
  }
  ```
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": "usr-admin-1",
        "name": "المهندس المشرف العام",
        "email": "admin@hedabkh.com.sa",
        "role": "super_admin",
        "avatar": "/images/avatars/admin-avatar.jpg",
        "permissions": [
          "projects_manage",
          "services_manage",
          "certificates_manage",
          "inquiries_view_reply",
          "statistics_manage",
          "team_manage",
          "settings_manage",
          "users_manage",
          "logs_view",
          "design_manage",
          "media_manage"
        ],
        "lastLogin": "2026-08-24T22:00:00Z"
      }
    }
  }
  ```
- **Error Responses:** `400 Bad Request` (missing fields), `401 Unauthorized` ("Invalid credentials"), `429 Too Many Requests` (brute force protection).
- **Frontend Call Sites:** `src/services/authApi.ts` -> `login()`, `src/context/useAdminAuth.ts`.

---

### 2.2 `GET /api/v1/auth/session`
- **Module:** Authentication
- **Description:** Validates active session from cookie, rotates session ID periodically, and returns user identity with active permissions.
- **Auth Required:** Yes
- **Request Headers:** Cookie: `HEDABKH_SESSID=...`
- **Response `200 OK`:** Same payload as login data.
- **Error Responses:** `401 Unauthorized` (`{ "authenticated": false }`).
- **Frontend Call Sites:** `src/services/authApi.ts` -> `checkSession()`, `src/layouts/AdminLayout.tsx`.

---

### 2.3 `POST /api/v1/auth/logout`
- **Module:** Authentication
- **Description:** Destroys server session, clears session cookie, and invalidates session token in DB.
- **Auth Required:** Yes
- **Response `200 OK`:** `{ "success": true, "message": "Logged out successfully" }`
- **Frontend Call Sites:** `src/services/authApi.ts` -> `logout()`.

---

## 3. Public Data Module (`/api/v1/`)

### 3.1 `GET /api/v1/projects`
- **Module:** Projects
- **Description:** Fetches list of engineering projects with optional filtering, locale translation, and pagination.
- **Auth Required:** No
- **Query Parameters:**
  - `locale`: `'ar' | 'en'` (default: `'ar'`)
  - `category`: `string` (optional, e.g. `'roads'`, `'stormwater'`)
  - `status`: `'all' | 'active' | 'completed'` (optional)
  - `featured`: `boolean` (optional)
  - `limit`: `integer` (optional, default: `50`)
  - `offset`: `integer` (optional, default: `0`)
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "proj-1",
        "title": "تشغيل وصيانة ونظافة مبنى وزارة الشؤون البلدية والقروية والإسكان",
        "description": "عقد تشغيل وصيانة شامل...",
        "category": "تشغيل وصيانة المباني الحكومية",
        "image": "/images/projects/project-1.jpg",
        "sitePrepImage": "/images/projects/project-1.jpg",
        "executionPhaseImage": "/images/projects/project-2.jpg",
        "finalHandoverImage": "/images/projects/project-3.jpg",
        "completionDate": "2026-12-31",
        "location": "الرياض، المملكة العربية السعودية",
        "client": "وزارة الشؤون البلدية والقروية والإسكان",
        "progress": 85,
        "features": ["صيانة وقائية دورية", "إدارة غرف التحكم"]
      }
    ]
  }
  ```
- **Frontend Call Sites:** `src/services/publicApi.ts` -> `getProjects()`, `src/hooks/useProjects.ts`, `src/app/[locale]/projects/page.tsx`.

---

### 3.2 `GET /api/v1/projects/{id}`
- **Module:** Projects
- **Description:** Fetches complete single project specifications, machinery fleet references, and photo gallery.
- **Auth Required:** No
- **Query Parameters:** `locale`: `'ar' | 'en'`
- **Response `200 OK`:** Single project object.
- **Error Responses:** `404 Not Found`.
- **Frontend Call Sites:** `src/services/publicApi.ts` -> `getProjectById()`, `src/app/[locale]/projects/[id]/page.tsx`.

---

### 3.3 `GET /api/v1/services`
- **Module:** Services
- **Description:** Fetches all corporate service divisions and engineering capabilities.
- **Auth Required:** No
- **Query Parameters:** `locale`: `'ar' | 'en'`
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "srv-1",
        "title": "تشغيل وصيانة المباني الحكومية",
        "description": "إدارة متكاملة وخدمات صيانة شاملة...",
        "icon": "building-icon",
        "features": ["صيانة وقائية دورية", "إدارة المرافق واللوجستيات"],
        "sectors": ["تشغيل المباني الحكومية", "الصيانة الإلكتروميكانيكية"]
      }
    ]
  }
  ```
- **Frontend Call Sites:** `src/services/publicApi.ts` -> `getServices()`, `src/hooks/useServices.ts`, `src/app/[locale]/services/page.tsx`.

---

### 3.4 `GET /api/v1/services/{id}`
- **Module:** Services
- **Description:** Fetches single service details by ID.
- **Auth Required:** No
- **Frontend Call Sites:** `src/services/publicApi.ts` -> `getServiceById()`.

---

### 3.5 `GET /api/v1/equipment`
- **Module:** Equipment Fleet
- **Description:** Fetches complete heavy machinery fleet inventory.
- **Auth Required:** No
- **Query Parameters:** `category`: `string` (optional)
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "eq-1",
        "nameAr": "كاشطة أسفلت هيدروليكية Wirtgen W2000",
        "nameEn": "Wirtgen W2000 Hydraulic Cold Milling Machine",
        "categoryAr": "صيانة وكشط الطرق",
        "categoryEn": "Road Milling & Maintenance",
        "model": "W2000",
        "brand": "Wirtgen",
        "count": 4,
        "image": "/images/equipment/wirtgen-milling-machine.jpg"
      }
    ]
  }
  ```
- **Frontend Call Sites:** `src/services/publicApi.ts` -> `getEquipmentFleet()`, `src/app/[locale]/equipment/EquipmentFleetClient.tsx`.

---

### 3.6 `GET /api/v1/certificates`
- **Module:** Certificates & Accreditations
- **Description:** Fetches official government classifications and ISO quality certifications.
- **Auth Required:** No
- **Query Parameters:** `locale`: `'ar' | 'en'`, `type`: `'government' | 'iso'`, `category`: `'official' | 'classification' | 'iso' | 'identity'`
- **Response `200 OK`:** List of Certificate objects.
- **Frontend Call Sites:** `src/services/publicApi.ts` -> `getCertificates()`, `src/app/[locale]/certificates/page.tsx`.

---

### 3.7 `GET /api/v1/team`
- **Module:** Team & Leadership
- **Description:** Fetches engineering leadership and site management members.
- **Auth Required:** No
- **Query Parameters:** `locale`: `'ar' | 'en'`, `sector`: `'ALL' | 'PROJECTS' | 'OPERATIONS' | 'QUALITY'`
- **Frontend Call Sites:** `src/services/publicApi.ts` -> `getTeam()`, `src/hooks/useTeam.ts`, `src/app/[locale]/team/page.tsx`.

---

### 3.8 `GET /api/v1/partners`
- **Module:** Partners & Clients
- **Description:** Fetches government ministries, municipal secretariats, and institutional partners.
- **Auth Required:** No
- **Frontend Call Sites:** `src/services/publicApi.ts` -> `getPartners()`, `src/components/cms/blocks/PartnersBlock.tsx`.

---

### 3.9 `GET /api/v1/articles`
- **Module:** News & Technical Articles
- **Description:** Fetches published rich technical articles and project milestones.
- **Auth Required:** No
- **Query Parameters:** `category`: `string`, `limit`: `number`, `offset`: `number`
- **Frontend Call Sites:** `src/services/publicApi.ts` -> `getArticles()`, `src/app/[locale]/news/page.tsx`.

---

### 3.10 `GET /api/v1/articles/{slug}`
- **Module:** News & Technical Articles
- **Description:** Fetches single article by URL slug or ID.
- **Auth Required:** No
- **Frontend Call Sites:** `src/services/publicApi.ts` -> `getArticleBySlug()`, `src/app/[locale]/news/[slug]/page.tsx`.

---

### 3.11 `GET /api/v1/statistics`
- **Module:** Statistics
- **Description:** Fetches corporate KPI figures.
- **Auth Required:** No
- **Query Parameters:** `locale`: `'ar' | 'en'`
- **Frontend Call Sites:** `src/services/publicApi.ts` -> `getStatistics()`, `src/components/cms/blocks/StatisticsBlock.tsx`.

---

### 3.12 `GET /api/v1/timeline`
- **Module:** Timeline
- **Description:** Fetches milestone history items for the 3D rotating carousel.
- **Auth Required:** No
- **Response `200 OK`:** Array of 6 milestone items (`milestone-1` to `milestone-6`).
- **Frontend Call Sites:** `src/components/home/Rotating3DTimelineCarousel.tsx`.

---

### 3.13 `GET /api/v1/regions`
- **Module:** Coverage Map
- **Description:** Fetches Saudi operational regions data for the interactive map.
- **Auth Required:** No
- **Frontend Call Sites:** `src/components/home/InteractiveSaudiMap.tsx`.

---

### 3.14 `POST /api/v1/inquiries`
- **Module:** Inquiries & Leads
- **Description:** Submits a customer inquiry / RFQ request with phone, email, and message.
- **Auth Required:** No (Rate limited with CSRF/reCAPTCHA support)
- **Request Body:**
  ```json
  {
    "name": "سعد القحطاني",
    "email": "saad@example.com",
    "phone": "0501234567",
    "message": "طلب تسعير أعمال كشط وسفلتة مخطط سكني بالرياض"
  }
  ```
- **Response `201 Created`:**
  ```json
  {
    "success": true,
    "data": {
      "id": "inq-1724536789000",
      "status": "new",
      "createdAt": "2026-08-24T22:00:00Z"
    }
  }
  ```
- **Frontend Call Sites:** `src/services/publicApi.ts` -> `submitInquiry()`, `src/app/[locale]/contact/page.tsx`.

---

### 3.15 `GET /api/v1/settings/brand` & `GET /api/v1/settings/seo`
- **Module:** Settings
- **Description:** Returns global corporate branding metadata and per-page SEO titles/descriptions.
- **Auth Required:** No
- **Frontend Call Sites:** `src/services/publicApi.ts` -> `getBrandIdentity()`, `src/components/layouts/Header.tsx`, `Footer.tsx`.

---

## 4. Visual CMS & Page Builder Module (`/api/v1/content/`)

### 4.1 `GET /api/v1/content/pages/{pageId}`
- **Module:** Visual CMS
- **Description:** Fetches published or draft composition tree for a page (`page-home`, `page-about`, `page-chairman`, `page-contact`).
- **Auth Required:** No for `version=published`, Yes (`super_admin` or `content_editor`) for `version=draft`.
- **Query Parameters:** `version`: `'published' | 'draft'` (default: `'published'`), `locale`: `'ar' | 'en'`
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "data": {
      "pageId": "page-home",
      "versionNumber": 3,
      "state": "published",
      "titleAr": "الصفحة الرئيسية الكاملة",
      "titleEn": "Main Corporate Home Page",
      "blocks": [
        {
          "id": "blk-hero-1",
          "type": "hero",
          "sortOrder": 1,
          "isVisible": true,
          "config": {
            "titleAr": "نبني البنية التحتية... لنرتقي بجودة الحياة",
            "titleEn": "Building Infrastructure... Elevating Quality of Life",
            "tagAr": "شركة هضاب الخليج للمقاولات",
            "tagEn": "Gulf Hills Contracting Co."
          }
        }
      ]
    }
  }
  ```
- **Frontend Call Sites:** `src/services/contentApi.ts` -> `getPage()`, `src/components/cms/PublicPageRenderer.tsx`, `src/components/admin/visual-cms/VisualEditorShell.tsx`.

---

### 4.2 `POST /api/v1/content/pages/{pageId}/draft`
- **Module:** Visual CMS
- **Description:** Saves the working draft blocks tree for a page.
- **Auth Required:** Yes (`content_editor`, `super_admin`)
- **Request Body:** `{ "blocks": ContentBlock[], "changeNote": "Updated hero headline" }`
- **Frontend Call Sites:** `src/services/contentApi.ts` -> `saveDraft()`.

---

### 4.3 `POST /api/v1/content/pages/{pageId}/publish`
- **Module:** Visual CMS
- **Description:** Promotes active draft to published state, increments version number, and updates cache timestamp.
- **Auth Required:** Yes (`content_editor`, `super_admin`)
- **Frontend Call Sites:** `src/services/contentApi.ts` -> `publishPage()`.

---

### 4.4 `POST /api/v1/content/pages/{pageId}/rollback/{versionNumber}`
- **Module:** Visual CMS
- **Description:** Restores a historical page version to active draft.
- **Auth Required:** Yes (`super_admin`)
- **Frontend Call Sites:** `src/services/contentApi.ts` -> `rollback()`.

---

## 5. Administrative Management Module (`/api/v1/admin/`)

All `/api/v1/admin/*` endpoints strictly require an authenticated PHP session and role permission validation.

| Endpoint | Method | Role / Permission | Description |
| :--- | :--- | :--- | :--- |
| `/api/v1/admin/overview/metrics` | `GET` | `logs_view` | Summary dashboard counters & recent logs |
| `/api/v1/admin/projects` | `GET` | `projects_manage` | Fetch full project records for admin table |
| `/api/v1/admin/projects` | `POST` | `projects_manage` | Create new engineering project |
| `/api/v1/admin/projects/{id}` | `PUT` | `projects_manage` | Update existing project details |
| `/api/v1/admin/projects/{id}` | `DELETE` | `projects_manage` | Delete project record |
| `/api/v1/admin/services` | `GET` | `services_manage` | Fetch all services for admin editor |
| `/api/v1/admin/services` | `POST` | `services_manage` | Create new service item |
| `/api/v1/admin/services/{id}` | `PUT` | `services_manage` | Update service item |
| `/api/v1/admin/services/{id}` | `DELETE` | `services_manage` | Delete service item |
| `/api/v1/admin/certificates` | `GET` | `certificates_manage` | List certificates with PDF filepaths |
| `/api/v1/admin/certificates` | `POST` | `certificates_manage` | Add new certificate / ISO record |
| `/api/v1/admin/certificates/{id}` | `PUT` | `certificates_manage` | Update certificate metadata |
| `/api/v1/admin/certificates/{id}` | `DELETE` | `certificates_manage` | Delete certificate record |
| `/api/v1/admin/equipment` | `GET` | `projects_manage` | List machinery fleet items |
| `/api/v1/admin/equipment` | `POST` | `projects_manage` | Add new heavy machinery fleet item |
| `/api/v1/admin/equipment/{id}` | `PUT` | `projects_manage` | Update machinery item specs / count |
| `/api/v1/admin/equipment/{id}` | `DELETE` | `projects_manage` | Delete machinery fleet item |
| `/api/v1/admin/partners` | `GET` | `design_manage` | List partner entities |
| `/api/v1/admin/partners` | `POST` | `design_manage` | Create new partner entry |
| `/api/v1/admin/partners/{id}` | `PUT` | `design_manage` | Update partner entry |
| `/api/v1/admin/partners/{id}` | `DELETE` | `design_manage` | Delete partner entry |
| `/api/v1/admin/team` | `GET` | `team_manage` | List all staff & leadership profiles |
| `/api/v1/admin/team` | `POST` | `team_manage` | Create new team member profile |
| `/api/v1/admin/team/{id}` | `PUT` | `team_manage` | Update team member profile |
| `/api/v1/admin/team/{id}` | `DELETE` | `team_manage` | Delete team member profile |
| `/api/v1/admin/articles` | `GET` | `content_editor` | List all news & technical articles |
| `/api/v1/admin/articles` | `POST` | `content_editor` | Create new article |
| `/api/v1/admin/articles/{id}` | `PUT` | `content_editor` | Update article content/meta |
| `/api/v1/admin/articles/{id}` | `DELETE` | `content_editor` | Delete article |
| `/api/v1/admin/statistics` | `GET` | `statistics_manage` | List all 4 corporate statistics |
| `/api/v1/admin/statistics` | `PUT` | `statistics_manage` | Update statistic value / prefix / suffix |
| `/api/v1/admin/inquiries` | `GET` | `inquiries_view_reply` | List all leads & RFQs with notes |
| `/api/v1/admin/inquiries/{id}/status` | `PATCH` | `inquiries_view_reply` | Update inquiry status & admin notes |
| `/api/v1/admin/inquiries/{id}` | `DELETE` | `inquiries_view_reply` | Delete inquiry lead |
| `/api/v1/admin/users` | `GET` | `users_manage` | List admin users & roles |
| `/api/v1/admin/users` | `POST` | `super_admin` | Create admin user (hashes password) |
| `/api/v1/admin/users/{id}` | `PUT` | `super_admin` | Update user roles & permissions |
| `/api/v1/admin/users/{id}` | `DELETE` | `super_admin` | Delete user (prevents self-deletion) |
| `/api/v1/admin/logs` | `GET` | `logs_view` | Audit trail of all administrative actions |
| `/api/v1/admin/settings` | `GET` | `settings_manage` | Get brand, contact & SEO settings |
| `/api/v1/admin/settings/brand` | `PUT` | `settings_manage` | Update brand, CR, VAT, contact |
| `/api/v1/admin/settings/seo` | `PUT` | `settings_manage` | Update per-page meta title/keywords |
| `/api/v1/admin/settings/reset` | `POST` | `super_admin` | Reset database to initial baseline seed |

---

## 6. Media Library & File Upload Module (`/api/v1/admin/media/`)

### 6.1 `GET /api/v1/admin/media`
- **Module:** Media Library
- **Description:** Returns paginated media asset catalog with URLs, dimensions, mime types, and file sizes.
- **Auth Required:** Yes (`media_manage`)
- **Query Parameters:** `category`: `string`, `type`: `'image' | 'document' | 'pdf'`, `search`: `string`

---

### 6.2 `POST /api/v1/admin/media/upload`
- **Module:** Media Library
- **Description:** Receives `multipart/form-data` file upload, validates MIME type and file extension, generates sanitized collision-resistant storage path under `/uploads/images/` or `/uploads/documents/`, and records metadata in MariaDB `media_items`.
- **Auth Required:** Yes (`media_manage`)
- **Request Form-Data:** `file: File`, `category?: string`, `altAr?: string`, `altEn?: string`
- **Response `201 Created`:**
  ```json
  {
    "success": true,
    "data": {
      "id": "media-1724536900123",
      "name": "heavy-roller-dynapac.webp",
      "url": "/uploads/images/heavy-roller-dynapac-64f3a.webp",
      "type": "image",
      "sizeBytes": 145820,
      "width": 1920,
      "height": 1080,
      "uploadedAt": "2026-08-24T22:00:00Z"
    }
  }
  ```

---

### 6.3 `DELETE /api/v1/admin/media/{id}`
- **Module:** Media Library
- **Description:** Checks for active usage references in CMS blocks, projects, and services before deleting asset from disk and database.
- **Auth Required:** Yes (`media_manage`)
- **Error Responses:** `409 Conflict` ("Media asset is currently referenced in Project proj-1").

---

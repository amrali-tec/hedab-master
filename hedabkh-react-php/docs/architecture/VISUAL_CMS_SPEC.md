# HEDABKH React-PHP — Phase 2: Visual CMS & Page Builder Specification

**System Name:** HEDABKH Visual Page Builder Engine  
**Target Architecture:** React 19 Frontend Block Renderer + PHP 8.2 Versioning API + MariaDB Hybrid Storage  
**Authoritative Schemas:** `src/lib/cms/blockSchemas.ts` & `src/services/contentEngine.ts`  

---

## 1. Visual CMS Architecture & Conceptual Flow

The Visual CMS allows non-technical administrators to customize and reorder layout blocks across core corporate landing pages (`page-home`, `page-about`, `page-chairman`, `page-contact`) with complete type safety and live interactive previews.

```
+-------------------------------------------------------------------------+
|                  VISUAL CMS STUDIO WORKSPACE (Admin UI)                 |
+-------------------------------------------------------------------------+
|  PageTree.tsx  -->  BlockInspector.tsx  -->  Live Preview Canvas        |
+-------------------------------------------------------------------------+
                                   ↓ (PUT /api/v1/content/pages/{id}/draft)
+-------------------------------------------------------------------------+
|                           PHP 8.2 BACKEND                               |
+-------------------------------------------------------------------------+
|  CmsController -> CmsEngineService -> CmsPageRepository                 |
|  - Validates BlockType against Allowed Block Registry                   |
|  - Sanitizes block config fields (Zero Raw HTML Injection)              |
|  - Updates cms_page_versions (state = 'draft')                          |
|  - Indexes block references in cms_version_blocks                       |
+-------------------------------------------------------------------------+
                                   ↓ (POST /api/v1/content/pages/{id}/publish)
+-------------------------------------------------------------------------+
|                          MARIADB STORAGE                                |
+-------------------------------------------------------------------------+
|  - cms_pages (status = 'published', published_version_id = new_ver_id)  |
|  - cms_page_versions (state = 'published', version_number = N + 1)      |
|  - Fast JSON snapshot cached in blocks_json for instant SSR/SPA queries |
+-------------------------------------------------------------------------+
                                   ↓ (GET /api/v1/content/pages/{id})
+-------------------------------------------------------------------------+
|                       PUBLIC CLIENT RENDERER                            |
+-------------------------------------------------------------------------+
|  PublicPageRenderer.tsx -> BlockRenderer.tsx -> Core React Block Views  |
+-------------------------------------------------------------------------+
```

---

## 2. Block Types & Configuration Schemas

The engine supports **18 strictly typed block types** divided across 6 functional categories:

| Category | Block Type | Primary Config Props | Target React Component |
| :--- | :--- | :--- | :--- |
| **Hero / Header** | `hero` | `titleAr`, `titleEn`, `subtitleAr`, `subtitleEn`, `primaryCta*`, `secondaryCta*`, `bgImageUrl`, `badgeText*` | `HeroBlock.tsx` |
| **Hero / Header** | `header` | `announcementText*`, `hotlinePhone`, `logoLightUrl`, `logoDarkUrl`, `rfqButtonText*` | `Header.tsx` |
| **Content** | `richText` | `titleAr`, `titleEn`, `contentAr`, `contentEn`, `badge*`, `align` | `RichTextBlock.tsx` |
| **Interactive** | `timeline` | `titleAr`, `titleEn`, `subtitle*`, `cylinderRadius`, `autoRotate` | `TimelineBlock.tsx` (3D Rotating Timeline) |
| **Interactive** | `saudiMap` | `titleAr`, `titleEn`, `subtitle*`, `selectedRegionId` | `SaudiMapBlock.tsx` (Interactive Regional SVG) |
| **Business** | `partners` | `titleAr`, `titleEn`, `subtitle*`, `speedSec`, `showProjectsCount` | `PartnersBlock.tsx` (Government Marquee) |
| **Business** | `projectCollection` | `selectedProjectIds`, `featuredOnly`, `maxItems`, `layout` (`grid` \| `carousel`) | `ProjectCollectionBlock.tsx` |
| **Business** | `serviceCollection` | `selectedServiceIds`, `maxItems`, `layout` (`grid` \| `cards`) | `ServiceCollectionBlock.tsx` |
| **Business** | `statistics` | `selectedStatIds`, `showIcons`, `tag*`, `title*` | `StatisticsBlock.tsx` |
| **Media** | `gallery` | `images: { url, captionAr, captionEn }[]`, `columns` | `GalleryBlock.tsx` |
| **Conversion** | `contactForm` | `title*`, `subtitle*`, `submitButtonText*`, `showPhoneField` | `ContactFormBlock.tsx` |
| **Conversion** | `cta` | `title*`, `description*`, `buttonText*`, `buttonLink`, `bgColor` | `CtaBlock.tsx` |
| **Conversion** | `whatsapp` | `phoneNumber`, `defaultMessage*`, `tooltip*`, `pulseGlow` | `WhatsAppBlock.tsx` |
| **Catalogs** | `catalogCenter` | `documentIds`, `showDownloadCounters`, `filterCategories` | `CatalogCenterBlock.tsx` |
| **Catalogs** | `specCatalog` | `specItems: { title*, value*, icon }[]` | `SpecCatalogBlock.tsx` |
| **Layout** | `container` | `direction`, `wrap`, `justify`, `align`, `gap`, `children` | `ContainerBlock.tsx` |
| **Layout** | `grid` | `columnsDesktop`, `columnsTablet`, `columnsMobile`, `columnGap`, `rowGap` | `GridBlock.tsx` |
| **Layout** | `footer` | `copyright*`, `headquarters*`, `email`, `phone`, `showSocialLinks` | `Footer.tsx` |

---

## 3. Versioning & Publishing Lifecycle

1. **Working Draft Mode:**
   - Every page has an active `draft_version_id` in `cms_pages`.
   - Modifying block order or configuration in the Studio workspace updates this draft version without impacting public visitors.
2. **Live Preview Mode (`/admin/preview/page/{pageId}`):**
   - The Studio canvas queries `/api/v1/content/pages/{pageId}?version=draft`.
   - Renders exact HTML/CSS composition with live responsive breakpoints (desktop, tablet, mobile).
3. **Publication Execution:**
   - When the user clicks **"نشر التعديلات" (Publish Changes)**, the backend:
     1. Creates a new immutable `cms_page_versions` row (`state = 'published'`, `version_number = current + 1`).
     2. Sets previous published version to `state = 'archived'`.
     3. Updates `cms_pages.published_version_id` to point to the new version.
     4. Updates `cms_pages.updated_at` and records an entry in `admin_activity_logs`.
4. **Version History & Rollback:**
   - The backend stores every published version snapshot in `cms_page_versions`.
   - Admin can view historical version timestamps and author change notes, and execute a 1-click rollback (`POST /api/v1/content/pages/{id}/rollback/{versionNumber}`).

---

## 4. Hybrid MariaDB Persistence Strategy

Why Hybrid Relational + JSON is optimal for the HEDABKH Visual Page Builder:

1. **Instantaneous Public Queries:** Public page requests require zero multi-table JOINs; the complete block tree is fetched from `cms_page_versions.blocks_json` in a single indexed query (<2ms latency).
2. **Normalized Inspection & Media Safety:** The child table `cms_version_blocks` indexes each block and its media/project references relational-style, allowing the Media Library to detect if an image is in active use before deletion.
3. **No Over-Normalization:** Block configurations vary widely across 18 block types (e.g. 3D cylinder radii, coordinate maps, arrays of project IDs). Storing block configuration in strongly-typed JSON columns preserves flexibility without requiring 18 distinct database tables.

---

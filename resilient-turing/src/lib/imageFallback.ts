/**
 * Absolute Image Fallback & Asset Optimization Helper
 * Ensures zero broken image icons across all CMS and public components.
 */

export const BRAND_SVG_FALLBACK = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600" fill="none">
  <rect width="800" height="600" fill="#0B132B"/>
  <rect opacity="0.1" width="800" height="600" fill="url(#grid)"/>
  <defs>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#38BDF8" stroke-width="1"/>
    </pattern>
  </defs>
  <circle cx="400" cy="300" r="120" fill="#0284C7" opacity="0.15"/>
  <path d="M360 260 H440 V340 H360 Z" stroke="#38BDF8" stroke-width="4" fill="none"/>
  <text x="400" y="300" fill="#94A3B8" font-family="sans-serif" font-size="20" font-weight="bold" text-anchor="middle" dominant-baseline="middle">
    هضاب الخليج للمقاولات
  </text>
  <text x="400" y="330" fill="#64748B" font-family="sans-serif" font-size="14" text-anchor="middle" dominant-baseline="middle">
    Gulf Hills Contracting • Asset Media
  </text>
</svg>
`)}`;

/**
 * Returns clean image URL or SVG placeholder fallback if missing or empty
 */
export function getSafeImageUrl(url?: string | null): string {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return BRAND_SVG_FALLBACK;
  }
  return url;
}

/**
 * Safe Image Error Handler for <img> components
 */
export function handleImageError(event: React.SyntheticEvent<HTMLImageElement, Event>): void {
  const target = event.currentTarget;
  if (target.src !== BRAND_SVG_FALLBACK) {
    target.src = BRAND_SVG_FALLBACK;
  }
}

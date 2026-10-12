import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { validateServerSession } from '../../../../lib/serverAuth';

export type MediaCategory =
  | 'logos'
  | 'projects'
  | 'equipment'
  | 'certificates'
  | 'sliders'
  | 'documents'
  | 'uploads'
  | 'general';

export interface DiscoveredMediaItem {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'document' | 'video' | 'pdf' | 'badge';
  source: 'project' | 'upload' | 'preset' | 'document';
  category: MediaCategory;
  tags: string[];
  isWebP: boolean;
  sizeBytes?: number;
  uploadedAt: string;
  relativePath: string;
}

const APPROVED_MEDIA_EXTENSIONS: Record<string, 'image' | 'document' | 'video' | 'pdf' | 'badge'> = {
  '.png': 'image',
  '.jpg': 'image',
  '.jpeg': 'image',
  '.webp': 'image',
  '.svg': 'image',
  '.gif': 'image',
  '.avif': 'image',
  '.pdf': 'pdf',
  '.mp4': 'video',
  '.webm': 'video',
};

// Approved relative scan roots inside public/
const APPROVED_SCAN_DIRS = [
  'images',
  'images/projects',
  'images/equipment',
  'images/logos',
  'images/before-after',
  'uploads',
  'documents',
];

/**
 * Cleanly generates a human-friendly display name from filename
 */
function formatDisplayName(fileName: string, subFolder?: string): string {
  const nameWithoutExt = fileName.replace(/\.[^/.]+$/, '');
  
  // Specific mappings for known project assets
  const knownNames: Record<string, string> = {
    'logo-dark': 'شعار هضاب الخليج (الداكن)',
    'logo-light': 'شعار هضاب الخليج (الفاتح)',
    'logo': 'شعار هضاب الخليج الرسمي',
    'gulf-hills-profile': 'الملف التعريفي للشركة (PDF)',
    'chairman': 'كلمة رئيس مجلس الإدارة',
    'vision-2030': 'رؤية المملكة 2030',
    'caterpillar-excavator': 'حفار كاتربيلر ثقيل',
    'dynapac-road-roller': 'مدحلة أسفلت دينAPAC',
    'bobcat-mini-excavator': 'بوبكات صغير للأنفاق',
    'godwin-dewatering-pump': 'مضخة نزح مياه جودوين',
    'jcb-backhoe-loader': 'لودر جي سي بي متعدد',
    'mercedes-actros-tipper': 'شاحنة نقل مرسيدس أكتروس',
    'wirtgen-milling-machine': 'قاشطة أسفلت فيرتجن',
    'road-paving-before': 'سفلتة الطرق (قبل)',
    'road-paving-after': 'سفلتة الطرق (بعد)',
    'stormwater-drainage-before': 'شبكات تصريف السيول (قبل)',
    'stormwater-drainage-after': 'شبكات تصريف السيول (بعد)',
    'visual-pollution-before': 'معالجة التشوه البصري (قبل)',
    'visual-pollution-after': 'معالجة التشوه البصري (بعد)',
  };

  if (knownNames[nameWithoutExt]) {
    return knownNames[nameWithoutExt];
  }

  // Handle project-N format
  if (nameWithoutExt.startsWith('project-')) {
    const num = nameWithoutExt.replace('project-', '');
    return `مشروع هندسي رقم ${num}`;
  }

  // Replace dashes/underscores with spaces
  return nameWithoutExt.replace(/[-_]/g, ' ');
}

/**
 * Recursively and safely scans only approved public subdirectories
 */
export async function GET(req: NextRequest) {
  const auth = validateServerSession(req, 'media_manage');
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
  }

  try {
    const publicDir = path.resolve(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
      return NextResponse.json({ success: true, items: [] });
    }

    const discoveredItems: DiscoveredMediaItem[] = [];
    const seenUrls = new Set<string>();

    const processFile = (fullPath: string, relativeWebPath: string, subFolder?: string) => {
      const ext = path.extname(fullPath).toLowerCase();
      const mediaType = APPROVED_MEDIA_EXTENSIONS[ext];
      if (!mediaType) return;

      const normalizedUrl = `/${relativeWebPath.replace(/\\/g, '/')}`;
      if (seenUrls.has(normalizedUrl.toLowerCase())) return;
      seenUrls.add(normalizedUrl.toLowerCase());

      let stat: fs.Stats | null = null;
      try {
        stat = fs.statSync(fullPath);
      } catch {
        // Ignore stat error
      }

      const fileName = path.basename(fullPath);
      const isUpload = relativeWebPath.startsWith('uploads');

      // Compute Media Category
      let category: MediaCategory = 'general';
      if (relativeWebPath.includes('logo')) category = 'logos';
      else if (relativeWebPath.includes('project')) category = 'projects';
      else if (relativeWebPath.includes('equipment')) category = 'equipment';
      else if (relativeWebPath.includes('certificate')) category = 'certificates';
      else if (relativeWebPath.includes('hero') || relativeWebPath.includes('slider')) category = 'sliders';
      else if (relativeWebPath.includes('document') || ext === '.pdf') category = 'documents';
      else if (isUpload) category = 'uploads';

      // Compute Search Tags
      const tags: string[] = [category, ext.replace('.', ''), mediaType];
      if (subFolder) tags.push(subFolder.replace(/[/]/g, '-'));

      discoveredItems.push({
        id: `media-${Buffer.from(normalizedUrl).toString('base64').replace(/=/g, '').slice(0, 16)}`,
        name: formatDisplayName(fileName, subFolder),
        url: normalizedUrl,
        type: mediaType,
        source: isUpload ? 'upload' : relativeWebPath.includes('document') || ext === '.pdf' ? 'document' : 'project',
        category,
        tags,
        isWebP: ext === '.webp',
        sizeBytes: stat ? stat.size : undefined,
        uploadedAt: stat ? stat.mtime.toISOString() : new Date().toISOString(),
        relativePath: relativeWebPath,
      });
    };

    // 1. Scan root public image files
    try {
      const rootEntries = fs.readdirSync(publicDir, { withFileTypes: true });
      for (const entry of rootEntries) {
        if (entry.isFile()) {
          processFile(path.join(publicDir, entry.name), entry.name);
        }
      }
    } catch {
      // Ignore root read error
    }

    // 2. Scan approved subdirectories
    for (const scanDir of APPROVED_SCAN_DIRS) {
      const dirPath = path.join(publicDir, scanDir);
      if (!fs.existsSync(dirPath)) continue;

      try {
        const entries = fs.readdirSync(dirPath, { withFileTypes: true });
        for (const entry of entries) {
          if (entry.isFile()) {
            const relPath = path.join(scanDir, entry.name);
            processFile(path.join(dirPath, entry.name), relPath, scanDir);
          }
        }
      } catch {
        // Continue safely
      }
    }

    // Sort items with uploads and key branding first
    discoveredItems.sort((a, b) => {
      if (a.source === 'upload' && b.source !== 'upload') return -1;
      if (b.source === 'upload' && a.source !== 'upload') return 1;
      return a.name.localeCompare(b.name, 'ar');
    });

    return NextResponse.json({
      success: true,
      count: discoveredItems.length,
      items: discoveredItems,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Media discovery failed',
        items: [],
      },
      { status: 500 }
    );
  }
}

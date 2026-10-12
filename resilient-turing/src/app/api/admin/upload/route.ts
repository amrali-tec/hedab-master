import { NextRequest, NextResponse } from 'next/server';
import { validateServerSession } from '../../../../lib/serverAuth';
import fs from 'fs';
import path from 'path';

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

const ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.svg', '.pdf'];
const ALLOWED_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/svg+xml',
  'application/pdf',
];

function ensureUploadsDirectory() {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
}

/**
 * Validates binary signature / magic bytes of uploaded buffers
 */
function validateFileSignature(buffer: Buffer, mime: string): boolean {
  if (buffer.length < 4) return false;

  // Check for executable binary signatures (MZ / PE / ELF)
  if (buffer[0] === 0x4d && buffer[1] === 0x5a) return false; // Windows EXE (MZ)
  if (buffer[0] === 0x7f && buffer[1] === 0x45 && buffer[2] === 0x4c && buffer[3] === 0x46) return false; // Linux ELF

  // PNG: 89 50 4E 47
  if (mime === 'image/png') {
    return buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47;
  }

  // JPEG: FF D8 FF
  if (mime === 'image/jpeg' || mime === 'image/jpg') {
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }

  // PDF: 25 50 44 46 (%PDF-)
  if (mime === 'application/pdf') {
    return buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46;
  }

  // WebP: RIFF ... WEBP
  if (mime === 'image/webp') {
    const isRiff = buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46;
    return isRiff;
  }

  // SVG text inspection
  if (mime === 'image/svg+xml') {
    const text = buffer.toString('utf-8', 0, Math.min(buffer.length, 1024)).toLowerCase();
    return text.includes('<svg') && !text.includes('<script');
  }

  return true;
}

export async function POST(req: NextRequest) {
  // 1. Authenticate and verify media_manage permission
  const auth = validateServerSession(req, 'media_manage');
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'لم يتم إرفاق أي ملف للرفع (No file provided).' },
        { status: 400 }
      );
    }

    // 2. Validate file size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        {
          success: false,
          error: `حجم الملف (${(file.size / (1024 * 1024)).toFixed(1)} MB) يتجاوز الحد الأقصى المسموح (10 MB).`,
        },
        { status: 400 }
      );
    }

    // 3. Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: `نوع الملف [${file.type}] غير مدعوم. الصيغ المسموحة: PNG, JPG, WEBP, SVG, PDF.`,
        },
        { status: 400 }
      );
    }

    const rawExt = path.extname(file.name).toLowerCase();
    const ext = ALLOWED_EXTENSIONS.includes(rawExt) ? rawExt : '.png';

    // 4. Binary Inspection & Magic Bytes
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (!validateFileSignature(buffer, file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: 'تم رفض الملف: محتوى الملف غير متوافق مع صيغة الصورة أو يحتوي على شيفرات غير آمنة.',
        },
        { status: 422 }
      );
    }

    // 5. Generate Safe Randomized Filename
    ensureUploadsDirectory();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const safeFileName = `asset_${Date.now()}_${randomSuffix}${ext}`;
    const filePath = path.join(UPLOADS_DIR, safeFileName);

    // 6. Write File to Storage
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${safeFileName}`;

    return NextResponse.json({
      success: true,
      message: 'تم رفع الأصل والتحقق منه خادمياً بنجاح.',
      url: publicUrl,
      fileName: safeFileName,
      originalName: file.name,
      sizeBytes: file.size,
      mimeType: file.type,
      uploadedAt: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Server upload error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

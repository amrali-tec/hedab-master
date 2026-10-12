import { NextRequest, NextResponse } from 'next/server';
import { validateServerSession } from '../../../../lib/serverAuth';
import { serverStorage } from '../../../../services/serverStorage';

export async function GET(req: NextRequest) {
  const auth = validateServerSession(req);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
  }

  const { searchParams } = new URL(req.url);
  const key = searchParams.get('key');

  if (key) {
    const data = serverStorage.getItem(key, null);
    return NextResponse.json({ success: true, key, data });
  }

  const db = serverStorage.getDb();
  return NextResponse.json({ success: true, db });
}

export async function POST(req: NextRequest) {
  const auth = validateServerSession(req, 'design_manage');
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
  }

  try {
    const body = await req.json();
    const { key, data } = body;

    if (!key || data === undefined) {
      return NextResponse.json(
        { success: false, error: 'المعاملات غير مكتملة (key and data are required).' },
        { status: 400 }
      );
    }

    serverStorage.setItem(key, data, auth.user?.name || 'مدير النظام');

    return NextResponse.json({
      success: true,
      message: `تم حفظ البيانات بنجاح في المفتاح [${key}].`,
      updatedAt: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to process request';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const auth = validateServerSession(req, 'design_manage');
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
  }

  const { searchParams } = new URL(req.url);
  const key = searchParams.get('key');
  const id = searchParams.get('id');

  if (!key || !id) {
    return NextResponse.json(
      { success: false, error: 'يجب تحديد key و id للحذف.' },
      { status: 400 }
    );
  }

  const currentList = serverStorage.getItem<Array<{ id: string }>>(key, []);
  if (Array.isArray(currentList)) {
    const updated = currentList.filter((item) => item.id !== id);
    serverStorage.setItem(key, updated, auth.user?.name || 'مدير النظام');
    return NextResponse.json({
      success: true,
      message: `تم حذف العنصر [${id}] بنجاح من [${key}].`,
      remainingCount: updated.length,
    });
  }

  return NextResponse.json(
    { success: false, error: 'المفتاح المحدد لا يحتوي على مصفوفة عناصر قابلة للحذف.' },
    { status: 400 }
  );
}

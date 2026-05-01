import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Service role client — ONLY used server-side, never sent to the browser
function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!url || !serviceKey) {
    throw new Error('Missing Supabase service role configuration');
  }
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function checkPassword(req: NextRequest): boolean {
  const password = req.headers.get('x-admin-password');
  return password === process.env.ADMIN_PASSWORD;
}

// ─── VERIFY PASSWORD (GET) ────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  if (!checkPassword(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json({ success: true });
}

// ─── ADD PRODUCT ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  if (!checkPassword(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, category, description, price, imageUrl, imageBase64, imageExtension } = body;

    const supabase = getAdminClient();
    let finalImageUrl = imageUrl;

    // Upload image if provided as base64
    if (imageBase64 && imageExtension) {
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${imageExtension}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, buffer, { contentType: `image/${imageExtension}` });

      if (uploadError) throw new Error(uploadError.message);

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      finalImageUrl = publicUrl;
    }

    const { data, error } = await supabase
      .from('products')
      .insert([{ name, category, description, price: Number(price), image_url: finalImageUrl }])
      .select()
      .single();

    if (error) throw new Error(error.message);

    return NextResponse.json({ product: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ─── UPDATE PRODUCT ───────────────────────────────────────────────────────────
export async function PUT(req: NextRequest) {
  if (!checkPassword(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, name, category, description, price, imageUrl, imageBase64, imageExtension } = body;

    const supabase = getAdminClient();
    let finalImageUrl = imageUrl;

    if (imageBase64 && imageExtension) {
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${imageExtension}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, buffer, { contentType: `image/${imageExtension}` });

      if (uploadError) throw new Error(uploadError.message);

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      finalImageUrl = publicUrl;
    }

    const { error } = await supabase
      .from('products')
      .update({ name, category, description, price: Number(price), image_url: finalImageUrl })
      .eq('id', id);

    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true, imageUrl: finalImageUrl });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ─── DELETE PRODUCT ───────────────────────────────────────────────────────────
export async function DELETE(req: NextRequest) {
  if (!checkPassword(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id } = body;

    const supabase = getAdminClient();
    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

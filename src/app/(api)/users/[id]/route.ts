import { NextResponse } from 'next/server';

import { createClient } from '@/shared/api/supabase/server';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createClient();

  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: 'Missing id query parameter' },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({ user: data });
}

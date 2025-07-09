import { NextResponse } from 'next/server';

import { createClient } from '@/shared/api/supabase/server';

export async function POST(req: Request) {
  const newPost = await req.json();

  const supabase = await createClient();

  const { error } = await supabase.from('posts').insert(newPost);

  if (error) return NextResponse.json({ error }, { status: 500 });

  return NextResponse.json({ status: 201 });
}

import { NextRequest, NextResponse } from 'next/server';

import { createClient } from '@/shared/api/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    const { userId } = await params;
    const limit = parseInt(searchParams.get('limit') || '10');
    const cursor = searchParams.get('cursor');

    let query = supabase
      .from('post_with_author')
      .select('*')
      .eq('author_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (cursor) {
      query = query.lt('created_at', cursor);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      data: data || [],
      hasMore: data?.length === limit,
      nextCursor: data?.length ? data[data.length - 1].created_at : null,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

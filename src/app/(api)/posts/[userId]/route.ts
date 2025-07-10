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
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50);
    const cursor = searchParams.get('cursor');

    if (!userId || typeof userId !== 'string') {
      return NextResponse.json({ error: 'Invalid userId' }, { status: 400 });
    }

    let query = supabase
      .from('post_with_author')
      .select('*')
      .eq('author_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (cursor) {
      try {
        const cursorDate = new Date(cursor);
        if (isNaN(cursorDate.getTime())) {
          return NextResponse.json(
            { error: 'Invalid cursor format' },
            { status: 400 },
          );
        }
        query = query.lt('created_at', cursor);
      } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Invalid cursor' }, { status: 400 });
      }
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const posts = data || [];

    return NextResponse.json({
      data: posts,
      hasMore: posts.length === limit,
      nextCursor: posts.length > 0 ? posts[posts.length - 1].created_at : null,
    });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Server error',
      },
      { status: 500 },
    );
  }
}

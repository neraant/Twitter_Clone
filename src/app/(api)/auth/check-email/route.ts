import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const NO_ROW_FOUND = 'PGRST116';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    const { data, error } = await supabaseAdmin
      .from('users')
      .select()
      .eq('email', email)
      .limit(1)
      .single();

    if (error && error.code !== NO_ROW_FOUND) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (data) {
      return NextResponse.json({ exists: true });
    } else {
      return NextResponse.json({ exists: false });
    }
  } catch (error) {
    return NextResponse.json(
      { error: `Server error: ${error}` },
      { status: 500 },
    );
  }
}

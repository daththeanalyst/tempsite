import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: sites, error } = await supabase
      .from('sites')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ sites });
  } catch (error) {
    console.error('List sites error:', error);
    return NextResponse.json({ error: 'Failed to fetch sites' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, category } = await request.json();

    const { data: profile } = await supabase
      .from('profiles')
      .select('tier')
      .eq('id', user.id)
      .single();

    const { data: site, error } = await supabase
      .from('sites')
      .insert({
        user_id: user.id,
        title: title || 'Untitled Site',
        category,
        has_watermark: profile?.tier !== 'pro',
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ site });
  } catch (error) {
    console.error('Create site error:', error);
    return NextResponse.json({ error: 'Failed to create site' }, { status: 500 });
  }
}

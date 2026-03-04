import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isValidSlug, generateSlug, injectWatermark } from '@/lib/utils';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { siteId, slug, action } = await request.json();

    // Verify ownership
    const { data: site } = await supabase
      .from('sites')
      .select('*, profiles!inner(tier)')
      .eq('id', siteId)
      .eq('user_id', user.id)
      .single();

    if (!site) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    }

    if (action === 'unpublish') {
      await supabase
        .from('sites')
        .update({ published: false })
        .eq('id', siteId);
      return NextResponse.json({ success: true });
    }

    // Determine slug
    const profile = (site as Record<string, unknown>).profiles as { tier: string };
    let finalSlug = slug;

    if (profile.tier === 'pro' && slug) {
      if (!isValidSlug(slug)) {
        return NextResponse.json(
          { error: 'Invalid slug. Use 3-50 characters: lowercase letters, numbers, and hyphens.' },
          { status: 400 }
        );
      }

      // Check availability
      const { data: existing } = await supabase
        .from('sites')
        .select('id')
        .eq('slug', slug)
        .neq('id', siteId)
        .single();

      if (existing) {
        return NextResponse.json({ error: 'This URL is already taken.' }, { status: 409 });
      }
    } else {
      // Free users get auto-generated slugs
      finalSlug = site.slug || generateSlug();
    }

    const hasWatermark = profile.tier !== 'pro';

    await supabase
      .from('sites')
      .update({
        published: true,
        slug: finalSlug,
        has_watermark: hasWatermark,
        updated_at: new Date().toISOString(),
      })
      .eq('id', siteId);

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    return NextResponse.json({
      success: true,
      url: `${appUrl}/s/${finalSlug}`,
      slug: finalSlug,
    });
  } catch (error) {
    console.error('Publish error:', error);
    return NextResponse.json({ error: 'Failed to publish' }, { status: 500 });
  }
}

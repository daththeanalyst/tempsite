import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { TIER_LIMITS } from '@/lib/constants';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('tier, generations_used, edits_used, usage_reset_at')
      .eq('id', user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const tier = profile.tier as keyof typeof TIER_LIMITS;
    const limits = TIER_LIMITS[tier];

    // Check for monthly reset
    const resetDate = new Date(profile.usage_reset_at);
    const now = new Date();
    const needsReset = resetDate.getMonth() !== now.getMonth() || resetDate.getFullYear() !== now.getFullYear();

    return NextResponse.json({
      generations: {
        used: needsReset ? 0 : profile.generations_used,
        limit: limits.generations,
      },
      edits: {
        used: needsReset ? 0 : profile.edits_used,
        limit: limits.edits,
      },
      tier,
    });
  } catch (error) {
    console.error('Usage error:', error);
    return NextResponse.json({ error: 'Failed to fetch usage' }, { status: 500 });
  }
}

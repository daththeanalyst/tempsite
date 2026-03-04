import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { editWithClaude } from '@/lib/ai/claude';
import { editWithGemini } from '@/lib/ai/gemini';
import { TIER_LIMITS } from '@/lib/constants';
import { sanitizeHtml } from '@/lib/utils';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { siteId, instruction, currentHtml, chatHistory = [] } = await request.json();

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const limits = TIER_LIMITS[profile.tier as keyof typeof TIER_LIMITS];

    // Free users can't use AI edits
    if (profile.tier === 'free') {
      return NextResponse.json(
        { error: 'AI editing is a Pro feature. Upgrade to use AI-powered edits, or use the inline editor to make manual changes.' },
        { status: 403 }
      );
    }

    const resetDate = new Date(profile.usage_reset_at);
    const now = new Date();
    const needsReset = resetDate.getMonth() !== now.getMonth() || resetDate.getFullYear() !== now.getFullYear();
    let editsUsed = needsReset ? 0 : profile.edits_used;

    if (editsUsed >= limits.edits) {
      return NextResponse.json(
        { error: `You've reached your monthly limit of ${limits.edits} AI edits. Use the inline editor for manual changes.` },
        { status: 429 }
      );
    }

    const stream = limits.model === 'claude'
      ? await editWithClaude(instruction, currentHtml, chatHistory)
      : await editWithGemini(instruction, currentHtml, chatHistory);

    let fullHtml = '';
    const transformStream = new TransformStream({
      transform(chunk, controller) {
        const text = new TextDecoder().decode(chunk);
        fullHtml += text;
        controller.enqueue(chunk);
      },
      async flush() {
        const cleanHtml = sanitizeHtml(fullHtml);

        await supabase
          .from('sites')
          .update({
            html_content: cleanHtml,
            updated_at: new Date().toISOString(),
          })
          .eq('id', siteId);

        await supabase.from('generations').insert({
          user_id: user.id,
          site_id: siteId,
          prompt: instruction,
          generation_type: 'edit',
          model_used: limits.model === 'claude' ? 'claude-haiku-4-5' : 'gemini-2.0-flash',
        });

        const updateData: Record<string, unknown> = {
          edits_used: editsUsed + 1,
          updated_at: new Date().toISOString(),
        };

        if (needsReset) {
          updateData.generations_used = 0;
          updateData.usage_reset_at = new Date().toISOString();
        }

        await supabase
          .from('profiles')
          .update(updateData)
          .eq('id', user.id);

        await supabase.from('chat_messages').insert([
          { site_id: siteId, user_id: user.id, role: 'user', content: instruction },
          { site_id: siteId, user_id: user.id, role: 'assistant', content: cleanHtml },
        ]);
      },
    });

    const outputStream = stream.pipeThrough(transformStream);

    return new Response(outputStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error) {
    console.error('Edit error:', error);
    return NextResponse.json(
      { error: 'Failed to edit website' },
      { status: 500 }
    );
  }
}

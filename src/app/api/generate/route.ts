import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateWithClaude } from '@/lib/ai/claude';
import { generateWithGemini } from '@/lib/ai/gemini';
import { TIER_LIMITS } from '@/lib/constants';
import { sanitizeHtml } from '@/lib/utils';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { siteId, prompt, category, chatHistory = [] } = await request.json();

    // Get profile and check limits
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Check if usage needs reset (monthly)
    const resetDate = new Date(profile.usage_reset_at);
    const now = new Date();
    const needsReset = resetDate.getMonth() !== now.getMonth() || resetDate.getFullYear() !== now.getFullYear();

    let generationsUsed = needsReset ? 0 : profile.generations_used;

    const limits = TIER_LIMITS[profile.tier as keyof typeof TIER_LIMITS];

    if (generationsUsed >= limits.generations) {
      return NextResponse.json(
        { error: `You've reached your monthly limit of ${limits.generations} generations. ${profile.tier === 'free' ? 'Upgrade to Pro for more.' : 'Limit resets next month.'}` },
        { status: 429 }
      );
    }

    // Select model based on tier
    const stream = limits.model === 'claude'
      ? await generateWithClaude(prompt, category, chatHistory)
      : await generateWithGemini(prompt, category, chatHistory);

    // Track the full response for saving
    let fullHtml = '';
    const transformStream = new TransformStream({
      transform(chunk, controller) {
        const text = new TextDecoder().decode(chunk);
        fullHtml += text;
        controller.enqueue(chunk);
      },
      async flush() {
        // Save the generated HTML
        const cleanHtml = sanitizeHtml(fullHtml);

        if (siteId) {
          await supabase
            .from('sites')
            .update({
              html_content: cleanHtml,
              updated_at: new Date().toISOString(),
            })
            .eq('id', siteId);
        }

        // Log generation
        if (siteId) {
          await supabase.from('generations').insert({
            user_id: user.id,
            site_id: siteId,
            prompt,
            generation_type: 'create',
            model_used: limits.model === 'claude' ? 'claude-haiku-4-5' : 'gemini-2.0-flash',
          });
        }

        // Increment usage
        const updateData: Record<string, unknown> = {
          generations_used: generationsUsed + 1,
          updated_at: new Date().toISOString(),
        };

        if (needsReset) {
          updateData.edits_used = 0;
          updateData.usage_reset_at = new Date().toISOString();
        }

        await supabase
          .from('profiles')
          .update(updateData)
          .eq('id', user.id);

        // Save chat messages
        if (siteId) {
          await supabase.from('chat_messages').insert([
            { site_id: siteId, user_id: user.id, role: 'user', content: prompt },
            { site_id: siteId, user_id: user.id, role: 'assistant', content: cleanHtml },
          ]);
        }
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
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate website' },
      { status: 500 }
    );
  }
}

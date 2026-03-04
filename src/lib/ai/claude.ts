import Anthropic from '@anthropic-ai/sdk';
import { GENERATION_SYSTEM_PROMPT, EDIT_SYSTEM_PROMPT, CATEGORY_CONTEXT } from './prompts';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function generateWithClaude(
  prompt: string,
  category: string | null,
  chatHistory: { role: 'user' | 'assistant'; content: string }[]
): Promise<ReadableStream<Uint8Array>> {
  const systemPrompt = category
    ? `${GENERATION_SYSTEM_PROMPT}\n\nCATEGORY CONTEXT: ${CATEGORY_CONTEXT[category] || CATEGORY_CONTEXT.other}`
    : GENERATION_SYSTEM_PROMPT;

  const messages = [
    ...chatHistory.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
    { role: 'user' as const, content: prompt },
  ];

  const stream = anthropic.messages.stream({
    model: 'claude-haiku-4-5-20241022',
    max_tokens: 8192,
    system: systemPrompt,
    messages,
  });

  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (
            event.type === 'content_block_delta' &&
            event.delta.type === 'text_delta'
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });
}

export async function editWithClaude(
  instruction: string,
  currentHtml: string,
  chatHistory: { role: 'user' | 'assistant'; content: string }[]
): Promise<ReadableStream<Uint8Array>> {
  const messages = [
    ...chatHistory.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
    {
      role: 'user' as const,
      content: `Current HTML:\n\`\`\`html\n${currentHtml}\n\`\`\`\n\nInstruction: ${instruction}`,
    },
  ];

  const stream = anthropic.messages.stream({
    model: 'claude-haiku-4-5-20241022',
    max_tokens: 8192,
    system: EDIT_SYSTEM_PROMPT,
    messages,
  });

  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (
            event.type === 'content_block_delta' &&
            event.delta.type === 'text_delta'
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });
}

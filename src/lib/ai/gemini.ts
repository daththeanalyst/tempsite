import { GoogleGenerativeAI } from '@google/generative-ai';
import { GENERATION_SYSTEM_PROMPT, EDIT_SYSTEM_PROMPT, CATEGORY_CONTEXT } from './prompts';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateWithGemini(
  prompt: string,
  category: string | null,
  chatHistory: { role: 'user' | 'assistant'; content: string }[]
): Promise<ReadableStream<Uint8Array>> {
  const systemPrompt = category
    ? `${GENERATION_SYSTEM_PROMPT}\n\nCATEGORY CONTEXT: ${CATEGORY_CONTEXT[category] || CATEGORY_CONTEXT.other}`
    : GENERATION_SYSTEM_PROMPT;

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: systemPrompt,
  });

  const history = chatHistory.map((m) => ({
    role: m.role === 'assistant' ? 'model' as const : 'user' as const,
    parts: [{ text: m.content }],
  }));

  const chat = model.startChat({ history });
  const result = await chat.sendMessageStream(prompt);

  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) {
            controller.enqueue(encoder.encode(text));
          }
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });
}

export async function editWithGemini(
  instruction: string,
  currentHtml: string,
  chatHistory: { role: 'user' | 'assistant'; content: string }[]
): Promise<ReadableStream<Uint8Array>> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: EDIT_SYSTEM_PROMPT,
  });

  const history = chatHistory.map((m) => ({
    role: m.role === 'assistant' ? 'model' as const : 'user' as const,
    parts: [{ text: m.content }],
  }));

  const chat = model.startChat({ history });
  const result = await chat.sendMessageStream(
    `Current HTML:\n\`\`\`html\n${currentHtml}\n\`\`\`\n\nInstruction: ${instruction}`
  );

  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) {
            controller.enqueue(encoder.encode(text));
          }
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });
}

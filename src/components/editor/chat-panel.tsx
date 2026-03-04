'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Sparkles } from 'lucide-react';
import type { ChatMessage } from '@/lib/types';

interface ChatPanelProps {
  messages: ChatMessage[];
  onSend: (message: string) => void;
  isGenerating: boolean;
  hasContent: boolean;
  category: string | null;
}

const SUGGESTIONS: Record<string, string[]> = {
  event: [
    'A birthday party for my friend Sarah, 80s theme, at The Rooftop Bar on March 15th',
    'Company team building event at the park, casual vibes, potluck style',
    'Graduation party for the class of 2026, gold and black theme',
  ],
  valentine: [
    'A romantic surprise page for my girlfriend, with our favorite memories together',
    'A cute valentines card website with a love letter and photos section',
    'Anniversary page for my parents, celebrating 25 years',
  ],
  personal: [
    'A cool personal landing page, minimal and modern, dark theme',
    'Portfolio site for a photographer with a gallery section',
    'Personal blog-style page with an about me and my hobbies',
  ],
  funny: [
    'A roast page for my friend Jake who always shows up late to everything',
    'A fake awards ceremony website for our friend group\'s most embarrassing moments',
    'A satirical fan page for our group chat\'s worst takes',
  ],
  work: [
    'A project launch announcement page for our new mobile app',
    'Team introduction page for our startup with bios and fun facts',
    'Internal hackathon event page with schedule and prizes',
  ],
  other: [
    'A simple countdown page for New Year\'s Eve',
    'A recipe collection page for my family\'s favorite dishes',
    'A memorial page for our beloved pet',
  ],
};

export function ChatPanel({
  messages,
  onSend,
  isGenerating,
  hasContent,
  category,
}: ChatPanelProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    onSend(input);
    setInput('');
  }

  const suggestions = SUGGESTIONS[category || 'other'] || SUGGESTIONS.other;

  return (
    <>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && !hasContent && (
          <div className="space-y-4">
            <div className="text-center py-6">
              <Sparkles className="mx-auto text-primary mb-3" size={32} />
              <h3 className="font-semibold mb-1">Describe your website</h3>
              <p className="text-sm text-muted-foreground">
                Tell me what you want and I&apos;ll create it for you
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wider px-1">
                Try one of these:
              </p>
              {suggestions.map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setInput(suggestion);
                  }}
                  className="w-full text-left text-sm p-3 rounded-lg border hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-br-md'
                  : msg.content.startsWith('Error:')
                  ? 'bg-destructive/10 text-destructive rounded-bl-md'
                  : 'bg-muted rounded-bl-md'
              }`}
            >
              {msg.role === 'assistant' && !msg.content.startsWith('Error:')
                ? msg.content
                : msg.content}
            </div>
          </div>
        ))}

        {isGenerating && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-2.5 text-sm flex items-center gap-2">
              <Loader2 size={14} className="animate-spin" />
              Generating your website...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              hasContent
                ? 'Describe changes you want...'
                : 'Describe your website...'
            }
            className="flex-1 border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            disabled={isGenerating}
          />
          <button
            type="submit"
            disabled={isGenerating || !input.trim()}
            className="bg-primary text-primary-foreground rounded-lg px-4 py-2.5 hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </div>
        {hasContent && (
          <p className="text-xs text-muted-foreground mt-2 px-1">
            You can also click on any text in the preview to edit it directly
          </p>
        )}
      </form>
    </>
  );
}

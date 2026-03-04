'use client';

import { Suspense, useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ChatPanel } from '@/components/editor/chat-panel';
import { PreviewPanel } from '@/components/editor/preview-panel';
import { EditorToolbar } from '@/components/editor/editor-toolbar';
import { PublishDialog } from '@/components/editor/publish-dialog';
import { SiteSettingsBar } from '@/components/editor/site-settings-bar';
import type { Site, ChatMessage } from '@/lib/types';
import { injectEditorScript } from '@/lib/utils';

interface ElementStyles {
  fontFamily: string;
  fontSize: string;
  color: string;
  backgroundColor: string;
  fontWeight: string;
  fontStyle: string;
  textDecoration: string;
  textAlign: string;
}

export default function EditorPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading editor...</div>}>
      <EditorContent />
    </Suspense>
  );
}

function EditorContent() {
  const { siteId } = useParams<{ siteId: string }>();
  const searchParams = useSearchParams();
  const category = searchParams.get('category');

  const [site, setSite] = useState<Site | null>(null);
  const [htmlContent, setHtmlContent] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showToolbar, setShowToolbar] = useState(false);
  const [selectedStyles, setSelectedStyles] = useState<ElementStyles | null>(null);
  const [showPublish, setShowPublish] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const supabase = createClient();

  // Load site data
  useEffect(() => {
    async function loadSite() {
      const { data: siteData } = await supabase
        .from('sites')
        .select('*')
        .eq('id', siteId)
        .single();

      if (siteData) {
        setSite(siteData);
        setHtmlContent(siteData.html_content || '');
      }

      const { data: messages } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('site_id', siteId)
        .order('created_at', { ascending: true });

      if (messages) setChatMessages(messages);
    }
    loadSite();
  }, [siteId]);

  // Listen for postMessage from iframe
  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      if (e.data.type === 'element-selected') {
        setSelectedStyles(e.data.styles);
        setShowToolbar(true);
      } else if (e.data.type === 'element-deselected') {
        setShowToolbar(false);
        setSelectedStyles(null);
      } else if (e.data.type === 'html-updated') {
        setHtmlContent(e.data.html);
        debouncedSave(e.data.html);
      }
    }

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Debounced save
  const debouncedSave = useCallback(
    (html: string) => {
      setSaveStatus('unsaved');
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

      saveTimeoutRef.current = setTimeout(async () => {
        setSaveStatus('saving');
        await supabase
          .from('sites')
          .update({
            html_content: html,
            updated_at: new Date().toISOString(),
          })
          .eq('id', siteId);
        setSaveStatus('saved');
      }, 2000);
    },
    [siteId]
  );

  // Send style change to iframe
  function applyStyle(property: string, value: string) {
    iframeRef.current?.contentWindow?.postMessage(
      { type: 'apply-style', property, value },
      '*'
    );
  }

  // Handle chat send (generate or edit)
  async function handleSend(message: string) {
    if (!message.trim() || isGenerating) return;

    setIsGenerating(true);

    const isFirstMessage = !htmlContent;
    const endpoint = isFirstMessage ? '/api/generate' : '/api/edit';

    const chatHistory = chatMessages
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .slice(-6) // Keep last 3 exchanges for context
      .map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.role === 'assistant' ? '[Previously generated HTML]' : m.content,
      }));

    const body = isFirstMessage
      ? { siteId, prompt: message, category, chatHistory }
      : { siteId, instruction: message, currentHtml: htmlContent, chatHistory };

    // Optimistically add user message
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      site_id: siteId,
      user_id: '',
      role: 'user',
      content: message,
      created_at: new Date().toISOString(),
    };
    setChatMessages((prev) => [...prev, userMsg]);

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const error = await res.json();
        const errorMsg: ChatMessage = {
          id: crypto.randomUUID(),
          site_id: siteId,
          user_id: '',
          role: 'assistant',
          content: `Error: ${error.error || 'Something went wrong'}`,
          created_at: new Date().toISOString(),
        };
        setChatMessages((prev) => [...prev, errorMsg]);
        setIsGenerating(false);
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) return;

      let fullHtml = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = new TextDecoder().decode(value);
        fullHtml += text;
        setHtmlContent(fullHtml);
      }

      // Add assistant message
      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        site_id: siteId,
        user_id: '',
        role: 'assistant',
        content: 'Website updated!',
        created_at: new Date().toISOString(),
      };
      setChatMessages((prev) => [...prev, assistantMsg]);

      // Update site title if first generation
      if (isFirstMessage && site) {
        const titleMatch = fullHtml.match(/<title>(.*?)<\/title>/i);
        if (titleMatch) {
          const newTitle = titleMatch[1];
          setSite({ ...site, title: newTitle, html_content: fullHtml });
          await supabase
            .from('sites')
            .update({ title: newTitle })
            .eq('id', siteId);
        }
      }
    } catch (error) {
      console.error('Generation error:', error);
    }

    setIsGenerating(false);
  }

  // Update title
  async function handleTitleChange(newTitle: string) {
    if (!site) return;
    setSite({ ...site, title: newTitle });
    await supabase
      .from('sites')
      .update({ title: newTitle, updated_at: new Date().toISOString() })
      .eq('id', siteId);
  }

  const previewHtml = htmlContent ? injectEditorScript(htmlContent) : '';

  return (
    <div className="h-screen flex flex-col bg-muted/30">
      {/* Top bar */}
      <SiteSettingsBar
        site={site}
        saveStatus={saveStatus}
        viewport={viewport}
        onViewportChange={setViewport}
        onTitleChange={handleTitleChange}
        onPublish={() => setShowPublish(true)}
      />

      {/* Editor toolbar */}
      {showToolbar && selectedStyles && (
        <EditorToolbar
          styles={selectedStyles}
          onStyleChange={applyStyle}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat panel */}
        <div className="w-full md:w-96 border-r bg-white flex flex-col shrink-0">
          <ChatPanel
            messages={chatMessages}
            onSend={handleSend}
            isGenerating={isGenerating}
            hasContent={!!htmlContent}
            category={category}
          />
        </div>

        {/* Preview panel */}
        <div className="hidden md:flex flex-1 flex-col">
          <PreviewPanel
            html={previewHtml}
            iframeRef={iframeRef}
            viewport={viewport}
          />
        </div>
      </div>

      {/* Publish dialog */}
      {showPublish && site && (
        <PublishDialog
          site={site}
          onClose={() => setShowPublish(false)}
          onPublished={(url) => {
            setSite({ ...site, published: true, slug: url.split('/s/')[1] });
            setShowPublish(false);
          }}
        />
      )}
    </div>
  );
}

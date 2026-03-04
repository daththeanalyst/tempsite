'use client';

import { RefObject } from 'react';

interface PreviewPanelProps {
  html: string;
  iframeRef: RefObject<HTMLIFrameElement | null>;
  viewport: 'desktop' | 'tablet' | 'mobile';
}

const viewportWidths = {
  desktop: '100%',
  tablet: '768px',
  mobile: '375px',
};

export function PreviewPanel({ html, iframeRef, viewport }: PreviewPanelProps) {
  if (!html) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/20">
        <div className="text-center">
          <div className="text-5xl mb-4">🎨</div>
          <h3 className="font-semibold text-lg mb-1">Your website will appear here</h3>
          <p className="text-sm text-muted-foreground">
            Describe what you want in the chat to get started
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-start justify-center overflow-auto bg-muted/20 p-4">
      <div
        className="bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300"
        style={{
          width: viewportWidths[viewport],
          maxWidth: '100%',
          height: viewport === 'desktop' ? '100%' : 'auto',
          minHeight: viewport === 'desktop' ? '100%' : '600px',
        }}
      >
        <iframe
          ref={iframeRef}
          srcDoc={html}
          className="w-full h-full border-0"
          style={{
            minHeight: viewport === 'desktop' ? '100%' : '600px',
            height: viewport === 'desktop' ? '100%' : '800px',
          }}
          title="Website Preview"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { Monitor, Tablet, Smartphone, ArrowLeft, Globe, Check, Loader2 } from 'lucide-react';
import type { Site } from '@/lib/types';
import { cn } from '@/lib/utils';

interface SiteSettingsBarProps {
  site: Site | null;
  saveStatus: 'saved' | 'saving' | 'unsaved';
  viewport: 'desktop' | 'tablet' | 'mobile';
  onViewportChange: (viewport: 'desktop' | 'tablet' | 'mobile') => void;
  onTitleChange: (title: string) => void;
  onPublish: () => void;
}

export function SiteSettingsBar({
  site,
  saveStatus,
  viewport,
  onViewportChange,
  onTitleChange,
  onPublish,
}: SiteSettingsBarProps) {
  return (
    <div className="bg-white border-b px-4 h-12 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="p-1.5 rounded-lg hover:bg-muted transition-colors"
          title="Back to dashboard"
        >
          <ArrowLeft size={18} />
        </Link>

        {site && (
          <input
            type="text"
            value={site.title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="text-sm font-medium border-0 bg-transparent focus:outline-none focus:bg-muted rounded px-2 py-1 w-48"
            placeholder="Site title"
          />
        )}

        <span className="text-xs text-muted-foreground flex items-center gap-1">
          {saveStatus === 'saving' && (
            <>
              <Loader2 size={12} className="animate-spin" />
              Saving...
            </>
          )}
          {saveStatus === 'saved' && (
            <>
              <Check size={12} className="text-green-500" />
              Saved
            </>
          )}
          {saveStatus === 'unsaved' && 'Unsaved changes'}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {/* Viewport toggles */}
        <div className="hidden md:flex items-center border rounded-lg">
          {[
            { key: 'desktop' as const, icon: Monitor },
            { key: 'tablet' as const, icon: Tablet },
            { key: 'mobile' as const, icon: Smartphone },
          ].map(({ key, icon: Icon }) => (
            <button
              key={key}
              onClick={() => onViewportChange(key)}
              className={cn(
                'p-1.5 transition-colors',
                viewport === key
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              )}
              title={`${key.charAt(0).toUpperCase() + key.slice(1)} view`}
            >
              <Icon size={14} />
            </button>
          ))}
        </div>

        <button
          onClick={onPublish}
          className="flex items-center gap-1.5 text-sm px-4 py-1.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Globe size={14} />
          Publish
        </button>
      </div>
    </div>
  );
}

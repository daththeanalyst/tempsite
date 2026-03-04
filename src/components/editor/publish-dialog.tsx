'use client';

import { useState, useEffect } from 'react';
import { X, Copy, ExternalLink, Check } from 'lucide-react';
import type { Site } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';
import type { Profile } from '@/lib/types';

interface PublishDialogProps {
  site: Site;
  onClose: () => void;
  onPublished: (url: string) => void;
}

export function PublishDialog({ site, onClose, onPublished }: PublishDialogProps) {
  const [slug, setSlug] = useState(site.slug || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [publishedUrl, setPublishedUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single()
          .then(({ data: p }) => setProfile(p));
      }
    });
  }, []);

  async function handlePublish() {
    setLoading(true);
    setError('');

    const res = await fetch('/api/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        siteId: site.id,
        slug: profile?.tier === 'pro' ? slug : undefined,
        action: 'publish',
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      setLoading(false);
      return;
    }

    setPublishedUrl(data.url);
    setLoading(false);
    onPublished(data.url);
  }

  async function handleUnpublish() {
    setLoading(true);
    await fetch('/api/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        siteId: site.id,
        action: 'unpublish',
      }),
    });
    setLoading(false);
    onClose();
  }

  function copyUrl() {
    navigator.clipboard.writeText(publishedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded hover:bg-muted"
        >
          <X size={18} />
        </button>

        <h2 className="text-lg font-bold mb-1">Publish your site</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Make your website live and share it with anyone
        </p>

        {publishedUrl ? (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
              <Check className="mx-auto text-green-500 mb-2" size={24} />
              <p className="font-medium text-green-800">Your site is live!</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={publishedUrl}
                readOnly
                className="flex-1 border rounded-lg px-3 py-2.5 text-sm bg-muted"
              />
              <button
                onClick={copyUrl}
                className="p-2.5 border rounded-lg hover:bg-muted transition-colors"
              >
                {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
              </button>
              <a
                href={publishedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 border rounded-lg hover:bg-muted transition-colors"
              >
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {profile?.tier === 'pro' ? (
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Custom URL
                </label>
                <div className="flex items-center border rounded-lg overflow-hidden">
                  <span className="px-3 text-sm text-muted-foreground bg-muted py-2.5">
                    {appUrl}/s/
                  </span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) =>
                      setSlug(
                        e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9-]/g, '')
                      )
                    }
                    placeholder="my-cool-site"
                    className="flex-1 px-3 py-2.5 text-sm focus:outline-none"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">
                  Lowercase letters, numbers, and hyphens only
                </p>
              </div>
            ) : (
              <div className="bg-muted/50 rounded-xl p-4 text-sm">
                <p className="text-muted-foreground">
                  Your site will get an auto-generated URL.{' '}
                  <a href="/billing" className="text-primary hover:underline">
                    Upgrade to Pro
                  </a>{' '}
                  for custom URLs.
                </p>
              </div>
            )}

            {error && (
              <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <div className="flex gap-2">
              {site.published && (
                <button
                  onClick={handleUnpublish}
                  disabled={loading}
                  className="flex-1 border rounded-lg px-4 py-2.5 text-sm hover:bg-muted transition-colors disabled:opacity-50"
                >
                  Unpublish
                </button>
              )}
              <button
                onClick={handlePublish}
                disabled={loading}
                className="flex-1 bg-primary text-primary-foreground rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {loading ? 'Publishing...' : site.published ? 'Update' : 'Publish'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

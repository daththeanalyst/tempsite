'use client';

import { Suspense, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Site, UsageStats } from '@/lib/types';
import Link from 'next/link';
import { Plus, ExternalLink, Pencil, Trash2, Globe } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-8 bg-muted rounded-lg w-48 animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 bg-muted rounded-xl animate-pulse" />
        ))}
      </div>
    </div>
  );
}

function DashboardContent() {
  const [sites, setSites] = useState<Site[]>([]);
  const [usage, setUsage] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const upgraded = searchParams.get('upgrade') === 'success';

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const [sitesRes, usageRes] = await Promise.all([
      fetch('/api/sites'),
      fetch('/api/usage'),
    ]);
    const sitesData = await sitesRes.json();
    const usageData = await usageRes.json();
    setSites(sitesData.sites || []);
    setUsage(usageData);
    setLoading(false);
  }

  async function deleteSite(id: string) {
    if (!confirm('Are you sure you want to delete this site?')) return;
    const supabase = createClient();
    await supabase.from('sites').delete().eq('id', id);
    setSites((prev) => prev.filter((s) => s.id !== id));
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-muted rounded-lg w-48 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {upgraded && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl px-4 py-3 mb-6 text-sm">
          Welcome to Pro! You now have access to Claude AI and 200 generations/month.
        </div>
      )}

      {/* Usage Stats */}
      {usage && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Plan</p>
            <p className="text-lg font-bold capitalize mt-1">
              {usage.tier}
              {usage.tier === 'free' && (
                <Link href="/billing" className="text-xs text-primary ml-2 font-normal hover:underline">
                  Upgrade
                </Link>
              )}
            </p>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Generations</p>
            <p className="text-lg font-bold mt-1">
              {usage.generations.used} / {usage.generations.limit}
            </p>
            <div className="w-full bg-muted rounded-full h-1.5 mt-2">
              <div
                className="bg-primary rounded-full h-1.5 transition-all"
                style={{ width: `${Math.min(100, (usage.generations.used / usage.generations.limit) * 100)}%` }}
              />
            </div>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">AI Edits</p>
            <p className="text-lg font-bold mt-1">
              {usage.edits.used} / {usage.edits.limit || 'N/A'}
            </p>
            {usage.edits.limit > 0 && (
              <div className="w-full bg-muted rounded-full h-1.5 mt-2">
                <div
                  className="bg-accent rounded-full h-1.5 transition-all"
                  style={{ width: `${Math.min(100, (usage.edits.used / usage.edits.limit) * 100)}%` }}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sites */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">My Sites</h1>
        <Link
          href="/new"
          className="flex items-center gap-2 text-sm px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus size={16} />
          New Site
        </Link>
      </div>

      {sites.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center">
          <div className="text-4xl mb-4">🚀</div>
          <h3 className="font-semibold text-lg mb-2">No sites yet</h3>
          <p className="text-muted-foreground text-sm mb-6">
            Create your first website in seconds with AI
          </p>
          <Link
            href="/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus size={18} />
            Create your first site
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sites.map((site) => (
            <div
              key={site.id}
              className="bg-white rounded-xl border hover:shadow-md transition-shadow overflow-hidden group"
            >
              {/* Preview thumbnail */}
              <div className="h-32 bg-gradient-to-br from-primary/5 to-accent/5 relative overflow-hidden">
                {site.html_content && (
                  <iframe
                    srcDoc={site.html_content}
                    className="w-[400%] h-[400%] transform scale-25 origin-top-left pointer-events-none"
                    title={site.title}
                    sandbox=""
                  />
                )}
                {site.published && (
                  <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Globe size={10} />
                    Live
                  </span>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-medium text-sm truncate">{site.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(site.updated_at).toLocaleDateString()}
                  {site.category && (
                    <span className="ml-2 capitalize">{site.category}</span>
                  )}
                </p>

                <div className="flex items-center gap-2 mt-3">
                  <Link
                    href={`/editor/${site.id}`}
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs px-3 py-2 border rounded-lg hover:bg-muted transition-colors"
                  >
                    <Pencil size={12} />
                    Edit
                  </Link>
                  {site.published && site.slug && (
                    <a
                      href={`/s/${site.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 text-xs px-3 py-2 border rounded-lg hover:bg-muted transition-colors"
                    >
                      <ExternalLink size={12} />
                    </a>
                  )}
                  <button
                    onClick={() => deleteSite(site.id)}
                    className="flex items-center justify-center text-xs px-3 py-2 border rounded-lg hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CATEGORIES } from '@/lib/constants';
import type { SiteCategory } from '@/lib/types';

export default function NewSitePage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleCategorySelect(category: SiteCategory) {
    setLoading(true);

    const res = await fetch('/api/sites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Untitled Site',
        category,
      }),
    });

    const { site } = await res.json();
    router.push(`/editor/${site.id}?category=${category}`);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Create a new site</h1>
      <p className="text-muted-foreground mb-8">
        Pick a category and describe your site. AI will handle the rest.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => handleCategorySelect(cat.value)}
            disabled={loading}
            className="bg-white border rounded-xl p-6 text-left hover:border-primary hover:shadow-md transition-all group disabled:opacity-50"
          >
            <span className="text-3xl">{cat.emoji}</span>
            <h3 className="font-semibold mt-3 group-hover:text-primary transition-colors">
              {cat.label}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {cat.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

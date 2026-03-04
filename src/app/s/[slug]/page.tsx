import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { injectWatermark, sanitizeHtml } from '@/lib/utils';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: site } = await supabase
    .from('sites')
    .select('title')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (!site) return { title: 'Not Found' };

  return {
    title: site.title,
    openGraph: {
      title: site.title,
      type: 'website',
    },
  };
}

export default async function PublishedSitePage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: site } = await supabase
    .from('sites')
    .select('title, html_content, has_watermark')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (!site || !site.html_content) {
    notFound();
  }

  let html = sanitizeHtml(site.html_content);

  if (site.has_watermark) {
    html = injectWatermark(html);
  }

  return (
    <div
      dangerouslySetInnerHTML={{ __html: html }}
      style={{ minHeight: '100vh' }}
    />
  );
}

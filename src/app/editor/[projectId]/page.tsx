"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [html, setHtml] = useState<string | null>(null);
  const [title, setTitle] = useState("Loading...");
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProject();
  }, [projectId]);

  async function loadProject() {
    try {
      const { data, error: fetchErr } = await supabase
        .from("projects")
        .select("title, custom_html, generated_html, published, slug")
        .eq("id", projectId)
        .single();

      if (fetchErr || !data) {
        // Check localStorage fallback
        const fallback = localStorage.getItem(`ef_project_${projectId}`);
        if (fallback) {
          const parsed = JSON.parse(fallback);
          setHtml(parsed.html);
          setTitle(parsed.title || "Generated Website");
          return;
        }
        setError("Project not found");
        return;
      }

      setHtml(data.custom_html || data.generated_html);
      setTitle(data.title);
      if (data.published && data.slug) {
        setPublishedUrl(`/preview/${data.slug}`);
      }
    } catch {
      setError("Failed to load project");
    }
  }

  // Inject GlassStudio into the iframe
  useEffect(() => {
    if (!html || !iframeRef.current) return;

    const iframe = iframeRef.current;
    const doc = iframe.contentDocument;
    if (!doc) return;

    // Write the generated HTML into iframe
    doc.open();
    doc.write(html);
    doc.close();

    // Wait for content to load, then inject GlassStudio
    iframe.onload = () => {
      const idoc = iframe.contentDocument;
      if (!idoc) return;

      // Inject GlassStudio CSS
      const link = idoc.createElement("link");
      link.rel = "stylesheet";
      link.href = "/overlay-editor.css";
      idoc.head.appendChild(link);

      // Inject GlassStudio JS
      const script = idoc.createElement("script");
      script.src = "/overlay-editor.js";
      idoc.body.appendChild(script);
    };

    // Trigger load event for already-loaded content
    setTimeout(() => {
      const idoc = iframe.contentDocument;
      if (!idoc) return;

      // Check if GlassStudio is already loaded
      if ((iframe.contentWindow as Window & { GlassStudio?: unknown })?.GlassStudio) return;

      // Inject GlassStudio CSS
      const link = idoc.createElement("link");
      link.rel = "stylesheet";
      link.href = "/overlay-editor.css";
      idoc.head.appendChild(link);

      // Inject GlassStudio JS
      const script = idoc.createElement("script");
      script.src = "/overlay-editor.js";
      idoc.body.appendChild(script);
    }, 500);
  }, [html]);

  function getEditedHtml(): string | null {
    const iframe = iframeRef.current;
    if (!iframe?.contentDocument) return null;

    const doc = iframe.contentDocument;
    // Get the GlassStudio export if available
    const win = iframe.contentWindow as Window & {
      GlassStudio?: { exportHTML?: () => string };
    };
    if (win?.GlassStudio?.exportHTML) {
      return win.GlassStudio.exportHTML();
    }

    // Fallback: serialize the document
    // Remove GlassStudio elements
    const clone = doc.documentElement.cloneNode(true) as HTMLElement;
    clone
      .querySelectorAll(
        '[id^="ai-"], .ai-editor-highlight, link[href*="overlay-editor"], script[src*="overlay-editor"]'
      )
      .forEach((el) => el.remove());

    return "<!DOCTYPE html>\n" + clone.outerHTML;
  }

  async function handleSave() {
    setSaving(true);
    const editedHtml = getEditedHtml();
    if (!editedHtml) {
      setSaving(false);
      return;
    }

    try {
      await supabase
        .from("projects")
        .update({ custom_html: editedHtml })
        .eq("id", projectId);
    } catch {
      // Fallback to localStorage
      localStorage.setItem(
        `ef_project_${projectId}`,
        JSON.stringify({ html: editedHtml, title })
      );
    }
    setSaving(false);
  }

  async function handlePublish() {
    setPublishing(true);
    const editedHtml = getEditedHtml();

    try {
      const res = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, html: editedHtml }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Publish failed");
      }

      const { url } = await res.json();
      setPublishedUrl(url);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Publish failed");
    }
    setPublishing(false);
  }

  async function handleExportHtml() {
    const editedHtml = getEditedHtml();
    if (!editedHtml) return;

    const blob = new Blob([editedHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\s+/g, "-").toLowerCase()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <p className="text-5xl">😕</p>
          <h1 className="mt-4 text-xl font-semibold">{error}</h1>
          <Link
            href="/dashboard"
            className="mt-4 inline-block text-primary hover:underline"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-lg font-bold gradient-text">
            TempSite
          </Link>
          <span className="text-sm text-muted">/</span>
          <span className="text-sm font-medium truncate max-w-[200px]">
            {title}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportHtml}
            className="rounded-lg border border-border px-4 py-1.5 text-sm font-medium transition-colors hover:bg-surface"
          >
            Export HTML
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg border border-border px-4 py-1.5 text-sm font-medium transition-colors hover:bg-surface disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
          <button
            onClick={handlePublish}
            disabled={publishing}
            className="btn-glow rounded-lg px-4 py-1.5 text-sm font-medium text-white disabled:opacity-50"
          >
            {publishing ? "Publishing..." : "Publish"}
          </button>
          {publishedUrl && (
            <Link
              href={publishedUrl}
              target="_blank"
              className="rounded-lg bg-green-500/20 px-4 py-1.5 text-sm font-medium text-green-400 transition-colors hover:bg-green-500/30"
            >
              View Live
            </Link>
          )}
        </div>
      </div>

      {/* Editor iframe */}
      {html ? (
        <iframe
          ref={iframeRef}
          className="flex-1 w-full bg-white"
          sandbox="allow-scripts allow-same-origin allow-forms"
        />
      ) : (
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <div className="skeleton mx-auto h-8 w-48 mb-4" />
            <p className="text-sm text-muted">Loading editor...</p>
          </div>
        </div>
      )}
    </div>
  );
}

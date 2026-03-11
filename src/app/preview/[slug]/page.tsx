"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function PreviewPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [html, setHtml] = useState<string | null>(null);
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAccess();
  }, [slug]);

  async function checkAccess() {
    try {
      // Get project info
      const { data: project } = await supabase
        .from("projects")
        .select(
          "access_code_hash, custom_html, generated_html, category"
        )
        .eq("slug", slug)
        .single();

      if (!project) {
        setError("Page not found");
        setLoading(false);
        return;
      }

      if (project.access_code_hash) {
        // Needs password
        setIsEncrypted(true);
        setLoading(false);
        return;
      }

      // Public — show directly
      setHtml(project.custom_html || project.generated_html);
      setLoading(false);
    } catch {
      setError("Failed to load page");
      setLoading(false);
    }
  }

  async function handleDecrypt(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/decrypt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, password }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Invalid access code");
      }

      const { html: decryptedHtml } = await res.json();
      setHtml(decryptedHtml);
      setIsEncrypted(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    }
    setLoading(false);
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a12] text-white">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#6366f1] border-t-transparent" />
          <p className="mt-4 text-sm text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !isEncrypted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a12] text-white">
        <div className="text-center">
          <p className="text-5xl">😕</p>
          <h1 className="mt-4 text-xl font-semibold">{error}</h1>
        </div>
      </div>
    );
  }

  // Access gate for encrypted proposals
  if (isEncrypted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a12] text-white">
        <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <div className="text-center">
            <p className="text-4xl">🔒</p>
            <h1 className="mt-4 text-xl font-semibold">Protected Content</h1>
            <p className="mt-2 text-sm text-gray-400">
              Enter the access code to view this proposal.
            </p>
          </div>
          <form onSubmit={handleDecrypt} className="mt-6 space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Access code"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-[#6366f1] focus:outline-none"
              autoFocus
              required
            />
            {error && (
              <p className="text-sm text-red-400">{error}</p>
            )}
            <button
              type="submit"
              className="w-full rounded-xl bg-[#6366f1] py-3 font-medium text-white transition-colors hover:bg-[#818cf8]"
            >
              Unlock
            </button>
          </form>
          <p className="mt-6 text-center text-xs text-gray-500">
            Made with TempSite
          </p>
        </div>
      </div>
    );
  }

  // Render HTML
  if (html) {
    return (
      <iframe
        srcDoc={html}
        className="h-screen w-screen border-0"
        sandbox="allow-scripts allow-same-origin allow-forms"
      />
    );
  }

  return null;
}

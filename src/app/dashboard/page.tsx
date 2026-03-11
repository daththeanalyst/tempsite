"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Project {
  id: string;
  category: string;
  title: string;
  published: boolean;
  slug: string | null;
  created_at: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  social: "Social Event",
  business_event: "Business Event",
  proposal: "Business Proposal",
};

const CATEGORY_ICONS: Record<string, string> = {
  social: "🎉",
  business_event: "💼",
  proposal: "🔒",
};

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    try {
      const { data } = await supabase
        .from("projects")
        .select("id, category, title, published, slug, created_at")
        .order("created_at", { ascending: false });
      setProjects(data || []);
    } catch {
      // If Supabase isn't configured, show empty state
    } finally {
      setLoading(false);
    }
  }

  async function deleteProject(id: string) {
    if (!confirm("Delete this project?")) return;
    await supabase.from("projects").delete().eq("id", id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="glass border-b border-border/50 px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="text-xl font-bold gradient-text">
            TempSite
          </Link>
          <Link
            href="/create"
            className="btn-glow rounded-lg px-5 py-2 text-sm font-medium text-white"
          >
            + New Project
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="text-3xl font-bold">Your Projects</h1>
        <p className="mt-2 text-muted">Manage your generated websites.</p>

        {loading ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-48 rounded-2xl" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="mt-20 text-center">
            <p className="text-5xl">🚀</p>
            <h2 className="mt-4 text-xl font-semibold">No projects yet</h2>
            <p className="mt-2 text-muted">
              Create your first event website in seconds.
            </p>
            <Link
              href="/create"
              className="btn-glow mt-6 inline-block rounded-xl px-8 py-3 text-sm font-medium text-white"
            >
              Create Your First Project
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className="glass glass-hover rounded-2xl p-5 transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <span className="text-2xl">
                    {CATEGORY_ICONS[project.category] || "📄"}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      project.published
                        ? "bg-green-500/20 text-green-400"
                        : "bg-muted/20 text-muted"
                    }`}
                  >
                    {project.published ? "Published" : "Draft"}
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-semibold truncate">
                  {project.title}
                </h3>
                <p className="mt-1 text-sm text-muted">
                  {CATEGORY_LABELS[project.category] || project.category}
                </p>
                <p className="mt-1 text-xs text-muted">
                  {new Date(project.created_at).toLocaleDateString()}
                </p>
                <div className="mt-4 flex gap-2">
                  <Link
                    href={`/editor/${project.id}`}
                    className="flex-1 rounded-lg border border-border py-2 text-center text-sm font-medium transition-colors hover:bg-surface"
                  >
                    Edit
                  </Link>
                  {project.published && project.slug && (
                    <Link
                      href={`/preview/${project.slug}`}
                      className="flex-1 rounded-lg bg-primary/20 py-2 text-center text-sm font-medium text-primary transition-colors hover:bg-primary/30"
                    >
                      View
                    </Link>
                  )}
                  <button
                    onClick={() => deleteProject(project.id)}
                    className="rounded-lg border border-red-500/20 px-3 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/10"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

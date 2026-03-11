import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";

function generateSlug(title: string): string {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60) +
    "-" +
    Math.random().toString(36).slice(2, 8)
  );
}

export async function POST(req: NextRequest) {
  try {
    const { projectId, html } = await req.json();

    if (!projectId) {
      return NextResponse.json(
        { error: "Missing projectId" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // Get project
    const { data: project, error: fetchErr } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .single();

    if (fetchErr || !project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    const slug = project.slug || generateSlug(project.title);
    const htmlContent = html || project.custom_html || project.generated_html;

    // Upload HTML to storage
    const storagePath = `sites/${slug}/index.html`;
    const { error: uploadErr } = await supabase.storage
      .from("published-sites")
      .upload(storagePath, new Blob([htmlContent], { type: "text/html" }), {
        upsert: true,
      });

    if (uploadErr) {
      console.error("Upload error:", uploadErr);
      return NextResponse.json(
        { error: "Failed to upload" },
        { status: 500 }
      );
    }

    // Update project
    await supabase
      .from("projects")
      .update({ published: true, slug, custom_html: htmlContent })
      .eq("id", projectId);

    // Upsert published_sites
    await supabase.from("published_sites").upsert(
      {
        project_id: projectId,
        slug,
        html_storage_path: storagePath,
        is_encrypted: !!project.access_code_hash,
      },
      { onConflict: "project_id" }
    );

    return NextResponse.json({ slug, url: `/preview/${slug}` });
  } catch (err) {
    console.error("Publish error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Publish failed" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { verifyPassword } from "@/lib/encryption";
import { createServerClient } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  try {
    const { slug, password } = await req.json();

    if (!slug || !password) {
      return NextResponse.json(
        { error: "Missing slug or password" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // Get project by slug
    const { data: project, error: fetchErr } = await supabase
      .from("projects")
      .select("access_code_hash, custom_html, generated_html")
      .eq("slug", slug)
      .single();

    if (fetchErr || !project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    if (!project.access_code_hash) {
      // Not encrypted — return HTML directly
      return NextResponse.json({
        html: project.custom_html || project.generated_html,
      });
    }

    // Verify password
    const valid = await verifyPassword(password, project.access_code_hash);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid access code" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      html: project.custom_html || project.generated_html,
    });
  } catch (err) {
    console.error("Decrypt error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Verification failed" },
      { status: 500 }
    );
  }
}

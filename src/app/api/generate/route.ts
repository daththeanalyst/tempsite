import { NextRequest, NextResponse } from "next/server";
import { generateSection } from "@/lib/gemini";
import { assemblePage } from "@/lib/assembler";
import { hashPassword } from "@/lib/encryption";
import {
  SYSTEM_PROMPT,
  SECTION_DEFS,
  Category,
  FormData,
} from "@/lib/prompts";
import { createServerClient } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { category, formData } = body as {
      category: Category;
      formData: FormData;
    };

    if (!category || !formData) {
      return NextResponse.json(
        { error: "Missing category or formData" },
        { status: 400 }
      );
    }

    const sectionDefs = SECTION_DEFS[category];
    if (!sectionDefs) {
      return NextResponse.json(
        { error: "Invalid category" },
        { status: 400 }
      );
    }

    // Generate all sections in parallel
    const sectionPromises = sectionDefs.map(async (def) => {
      const userPrompt = def.prompt(formData);
      const html = await generateSection(SYSTEM_PROMPT, userPrompt);
      return { id: def.id, html };
    });

    const sections = await Promise.all(sectionPromises);

    // Determine title
    const fd = formData as unknown as Record<string, string>;
    const title = fd.eventName || fd.proposalTitle || "Untitled";

    // Assemble full page
    const fullHtml = assemblePage(sections, title);

    // Hash access password for proposals
    let accessCodeHash: string | null = null;
    if (category === "proposal" && fd.accessPassword) {
      accessCodeHash = await hashPassword(fd.accessPassword);
    }

    // Save to Supabase
    const supabase = createServerClient();
    const { data: project, error: dbError } = await supabase
      .from("projects")
      .insert({
        category,
        title,
        form_data: formData,
        generated_html: fullHtml,
        custom_html: fullHtml,
        access_code_hash: accessCodeHash,
      })
      .select("id")
      .single();

    if (dbError) {
      // If Supabase isn't configured, return project data without saving
      console.error("Supabase error:", dbError);
      // Fallback: return a temporary ID and store in local
      const tempId = crypto.randomUUID();
      return NextResponse.json({
        projectId: tempId,
        html: fullHtml,
        fallback: true,
      });
    }

    return NextResponse.json({ projectId: project.id, html: fullHtml });
  } catch (err) {
    console.error("Generation error:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Generation failed",
      },
      { status: 500 }
    );
  }
}

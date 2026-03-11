import { BASE_CSS } from "./prompts";

export function assemblePage(
  sections: { id: string; html: string }[],
  title: string
): string {
  const sectionsHtml = sections
    .map((s) => `<!-- section: ${s.id} -->\n${s.html}`)
    .join("\n\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)} — TempSite</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>${BASE_CSS}</style>
</head>
<body>
${sectionsHtml}
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

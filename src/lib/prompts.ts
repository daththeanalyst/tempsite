export const SYSTEM_PROMPT = `You are a web section generator. Output ONLY valid HTML for the requested section.

Rules:
- Use semantic HTML5 (section, header, article, div, h1-h6, p, span, etc.)
- Every visible element must have data-editable="true"
- Use these CSS custom properties for theming: var(--primary), var(--bg), var(--text), var(--accent), var(--radius), var(--surface)
- No <script> tags, no external resources, no <link> tags
- Use inline styles for layout only (flexbox, grid, padding, margin)
- Use the CSS variables for all colors and borders
- Responsive: use flexbox/grid, max-width containers, relative units (rem, %, vw)
- Output ONLY a single <section> element with all content inside, nothing else
- Make it visually appealing and professional
- Use placeholder images from https://placehold.co/ for any images (e.g., https://placehold.co/600x400/1a1a2e/e0e0e0?text=Event)
- Keep text concise and professional`;

export type Category = "social" | "business_event" | "proposal";

export interface SocialEventData {
  eventName: string;
  eventType: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  rsvpEnabled: boolean;
  colorTheme: string;
}

export interface BusinessEventData {
  eventName: string;
  eventType: string;
  organizationName: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  scheduleItems: { time: string; title: string; speaker: string }[];
  sponsors: string[];
  registrationCta: string;
}

export interface ProposalData {
  companyName: string;
  proposalTitle: string;
  executiveSummary: string;
  problemStatement: string;
  solutionDescription: string;
  teamMembers: { name: string; role: string }[];
  keyMetrics: string;
  contactInfo: string;
  accessPassword: string;
}

export type FormData = SocialEventData | BusinessEventData | ProposalData;

interface SectionDef {
  id: string;
  prompt: (data: FormData) => string;
}

export const SECTION_DEFS: Record<Category, SectionDef[]> = {
  social: [
    {
      id: "hero",
      prompt: (d) => {
        const data = d as SocialEventData;
        return `Create a hero section for a ${data.eventType} event called "${data.eventName}".
Date: ${data.date} at ${data.time}.
Use a bold gradient background with the theme color ${data.colorTheme || "#6366f1"}.
Include the event name as a large h1, the date/time below it, and a "Learn More" button.
Make it full-width with at least 400px height, centered content.`;
      },
    },
    {
      id: "details",
      prompt: (d) => {
        const data = d as SocialEventData;
        return `Create an event details section for "${data.eventName}".
Venue: ${data.venue}
Date: ${data.date}
Time: ${data.time}
Show these details in a clean card layout with icons (use emoji as icons: 📍 📅 🕐).
Use a subtle background with var(--surface).`;
      },
    },
    {
      id: "description",
      prompt: (d) => {
        const data = d as SocialEventData;
        return `Create a description/about section for the event "${data.eventName}".
Description: ${data.description}
Make it readable with good typography. Center the text, use max-width 700px.
Add some visual flair like a decorative border or accent line.`;
      },
    },
    {
      id: "rsvp",
      prompt: (d) => {
        const data = d as SocialEventData;
        if (!data.rsvpEnabled) {
          return `Create a simple "Join Us" call-to-action section for "${data.eventName}".
Include a heading "Join Us!" and a brief invitation message with a prominent button.`;
        }
        return `Create an RSVP form section for "${data.eventName}".
Include fields for: Name, Email, and an "Attending?" yes/no radio.
Add a submit button styled with var(--primary).
Note: The form is decorative (no backend), just make it look good.`;
      },
    },
    {
      id: "gallery",
      prompt: (d) => {
        const data = d as SocialEventData;
        return `Create a photo gallery section for "${data.eventName}" (${data.eventType}).
Use a 2x2 or 3x2 grid of placeholder images.
Use images from https://placehold.co/400x300/1a1a2e/e0e0e0?text=Photo+1 (vary the text param).
Add a "Gallery" heading above.`;
      },
    },
    {
      id: "footer",
      prompt: (d) => {
        const data = d as SocialEventData;
        return `Create a footer section for "${data.eventName}".
Include the event name, venue (${data.venue}), and a "Contact the organizers" line.
Keep it minimal with var(--bg) background, centered text.
Add a small "Made with TempSite" credit at the bottom.`;
      },
    },
  ],

  business_event: [
    {
      id: "hero",
      prompt: (d) => {
        const data = d as BusinessEventData;
        return `Create a professional hero section for a ${data.eventType} called "${data.eventName}" by ${data.organizationName}.
Date: ${data.date} at ${data.time}, ${data.city}.
Use a bold gradient background. Include event name as h1, organization as subtitle, date/location below, and a "Register Now" CTA button.
Full-width, min 450px height, centered.`;
      },
    },
    {
      id: "about",
      prompt: (d) => {
        const data = d as BusinessEventData;
        return `Create an "About the Event" section for "${data.eventName}" by ${data.organizationName}.
Type: ${data.eventType} in ${data.city}.
Write 2-3 sentences about what attendees can expect. Include 3 highlight cards (e.g., "Networking", "Workshops", "Talks") in a row.`;
      },
    },
    {
      id: "schedule",
      prompt: (d) => {
        const data = d as BusinessEventData;
        const items =
          data.scheduleItems?.length > 0
            ? data.scheduleItems
                .map((s) => `${s.time} — ${s.title} (${s.speaker})`)
                .join("\n")
            : "10:00 — Welcome & Registration\n11:00 — Keynote Talk\n12:00 — Lunch Break\n14:00 — Workshop Sessions\n16:00 — Closing Remarks";
        return `Create a schedule/agenda section for "${data.eventName}".
Schedule:
${items}
Display as a vertical timeline or table. Use alternating row colors for readability.`;
      },
    },
    {
      id: "speakers",
      prompt: (d) => {
        const data = d as BusinessEventData;
        return `Create a speakers/hosts section for "${data.eventName}".
Show 3-4 speaker cards in a grid. Each card: circular placeholder avatar (https://placehold.co/150x150/6366f1/ffffff?text=Speaker), name, title/role.
Use var(--surface) for card backgrounds.`;
      },
    },
    {
      id: "sponsors",
      prompt: (d) => {
        const data = d as BusinessEventData;
        const sponsorList =
          data.sponsors?.length > 0
            ? data.sponsors.join(", ")
            : "TechCorp, InnovateCo, BuildFast";
        return `Create a sponsors section for "${data.eventName}".
Sponsors: ${sponsorList}
Show sponsor names/logos in a horizontal row. Use placeholder logos (https://placehold.co/200x80/333/fff?text=SponsorName).
Add a "Our Sponsors" heading.`;
      },
    },
    {
      id: "registration",
      prompt: (d) => {
        const data = d as BusinessEventData;
        return `Create a registration CTA section for "${data.eventName}".
CTA text: "${data.registrationCta || "Register Now — Limited Spots Available"}"
Large centered button on a gradient or accent background. Add urgency text below.`;
      },
    },
    {
      id: "footer",
      prompt: (d) => {
        const data = d as BusinessEventData;
        return `Create a footer for "${data.eventName}" by ${data.organizationName}.
Include: event name, organization, venue (${data.venue}, ${data.city}), date.
Add a FAQ-style section with 2-3 common questions (e.g., "Is parking available?", "What should I bring?").
Small "Made with TempSite" credit.`;
      },
    },
  ],

  proposal: [
    {
      id: "cover",
      prompt: (d) => {
        const data = d as ProposalData;
        return `Create a cover page section for a business proposal.
Company: ${data.companyName}
Title: "${data.proposalTitle}"
Use a full-height (min 500px) centered layout with the company name prominent, proposal title below, and today's date.
Professional, minimal design with var(--primary) accent.`;
      },
    },
    {
      id: "executive-summary",
      prompt: (d) => {
        const data = d as ProposalData;
        return `Create an executive summary section for "${data.proposalTitle}" by ${data.companyName}.
Summary: ${data.executiveSummary}
Display with a "Executive Summary" heading and the summary text in a well-formatted paragraph with good typography.
Add a subtle left border accent.`;
      },
    },
    {
      id: "problem",
      prompt: (d) => {
        const data = d as ProposalData;
        return `Create a "Problem Statement" section for the proposal "${data.proposalTitle}".
Problem: ${data.problemStatement}
Use a bold heading, then the problem text. Add a visual element like an icon or colored callout box to make the problem stand out.`;
      },
    },
    {
      id: "solution",
      prompt: (d) => {
        const data = d as ProposalData;
        return `Create a "Our Solution" section for the proposal "${data.proposalTitle}" by ${data.companyName}.
Solution: ${data.solutionDescription}
Display the solution text with 3 key benefit cards below (extract or infer benefits from the description).
Use var(--primary) for card accents.`;
      },
    },
    {
      id: "team",
      prompt: (d) => {
        const data = d as ProposalData;
        const members =
          data.teamMembers?.length > 0
            ? data.teamMembers
                .map((m) => `${m.name} — ${m.role}`)
                .join("\n")
            : "John Doe — CEO\nJane Smith — CTO\nAlex Johnson — Lead Developer";
        return `Create a "Our Team" section for ${data.companyName}.
Team:
${members}
Display as a grid of member cards with circular placeholder avatars (https://placehold.co/120x120/6366f1/fff?text=Initials), name, and role.`;
      },
    },
    {
      id: "metrics",
      prompt: (d) => {
        const data = d as ProposalData;
        if (!data.keyMetrics) {
          return `Create a "Key Numbers" section with 3-4 impressive placeholder metric cards.
Examples: "98% Client Satisfaction", "50+ Projects Delivered", "$2M+ Revenue", "15 Team Members".
Display as large numbers with labels in a horizontal row.`;
        }
        return `Create a "Key Metrics" section for ${data.companyName}.
Metrics: ${data.keyMetrics}
Display the metrics as large, bold numbers with labels in a card grid.`;
      },
    },
    {
      id: "cta",
      prompt: (d) => {
        const data = d as ProposalData;
        return `Create a "Next Steps" / call-to-action section for the proposal "${data.proposalTitle}" by ${data.companyName}.
Contact: ${data.contactInfo || "contact@company.com"}
Include a heading "Let's Move Forward", a brief closing statement, and the contact information.
Add a prominent "Get in Touch" button styled with var(--primary).
Small "Made with TempSite" credit at bottom.`;
      },
    },
  ],
};

export const BASE_CSS = `
:root {
  --primary: #6366f1;
  --bg: #0f0f1a;
  --text: #e2e8f0;
  --accent: #818cf8;
  --radius: 12px;
  --surface: rgba(255,255,255,0.05);
}
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: var(--bg);
  color: var(--text);
  line-height: 1.6;
}
section {
  padding: 60px 24px;
  max-width: 1200px;
  margin: 0 auto;
}
img { max-width: 100%; height: auto; border-radius: var(--radius); }
a { color: var(--primary); text-decoration: none; }
button, .btn {
  background: var(--primary);
  color: white;
  border: none;
  padding: 12px 32px;
  border-radius: var(--radius);
  font-size: 1rem;
  cursor: pointer;
  transition: opacity 0.2s;
}
button:hover, .btn:hover { opacity: 0.9; }
input, textarea, select {
  background: var(--surface);
  border: 1px solid rgba(255,255,255,0.1);
  color: var(--text);
  padding: 10px 16px;
  border-radius: var(--radius);
  font-size: 1rem;
  width: 100%;
}
`;

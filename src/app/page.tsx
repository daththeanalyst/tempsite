import Link from "next/link";

const FEATURES = [
  {
    icon: "🎉",
    title: "Social Events",
    desc: "Football matches, birthday parties, university club meetings — create a website in seconds.",
  },
  {
    icon: "💼",
    title: "Business Events",
    desc: "Meetups, hackathons, marathons, conferences — professional event pages with schedules and registration.",
  },
  {
    icon: "🔒",
    title: "Encrypted Proposals",
    desc: "Business proposals and pitch decks with password protection. Only authorized viewers can access.",
  },
  {
    icon: "🤖",
    title: "AI-Powered",
    desc: "Gemini Flash 2.0 generates your website section-by-section in parallel — fast and cheap.",
  },
  {
    icon: "🎨",
    title: "Visual Editor",
    desc: "GlassStudio built-in — click any element to customize colors, fonts, spacing, effects. Zero code needed.",
  },
  {
    icon: "📤",
    title: "Multi-Format Export",
    desc: "Export as HTML/CSS, React JSX, or Tailwind. Download, publish, or host on your own domain.",
  },
];

const STEPS = [
  {
    num: "1",
    title: "Pick a Category",
    desc: "Social event, business event, or business proposal.",
  },
  {
    num: "2",
    title: "Fill in Details",
    desc: "Smart form collects only what's needed — event name, date, venue, schedule, etc.",
  },
  {
    num: "3",
    title: "AI Generates",
    desc: "Gemini Flash 2.0 builds your website section-by-section in ~5 seconds.",
  },
  {
    num: "4",
    title: "Edit & Publish",
    desc: "Customize everything visually with GlassStudio, then publish with one click.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50 px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="text-xl font-bold gradient-text">
            TempSite
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/create"
              className="btn-glow rounded-lg px-5 py-2 text-sm font-medium text-white"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-20 text-center">
        <div className="pointer-events-none absolute top-1/4 left-1/3 h-72 w-72 rounded-full bg-primary/20 blur-[120px]" />
        <div className="pointer-events-none absolute bottom-1/4 right-1/3 h-72 w-72 rounded-full bg-purple-500/15 blur-[120px]" />

        <div className="relative z-10">
          <p className="mb-4 text-sm font-medium tracking-wider text-primary uppercase">
            AI-Powered Website Builder
          </p>
          <h1 className="text-5xl font-extrabold leading-tight tracking-tight sm:text-7xl">
            Create Event Websites
            <br />
            <span className="gradient-text">In Seconds</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted leading-relaxed">
            Pick a category, fill in your details, and let AI generate a
            professional website. Customize everything visually with our
            built-in editor. Publish or export.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/create"
              className="btn-glow rounded-xl px-8 py-3.5 text-base font-semibold text-white"
            >
              Start Building — Free
            </Link>
            <Link
              href="#how-it-works"
              className="rounded-xl border border-border px-8 py-3.5 text-base font-medium text-foreground transition-colors hover:bg-surface"
            >
              How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-4 text-center text-3xl font-bold">
            Three Categories, <span className="gradient-text">One Platform</span>
          </h2>
          <p className="mx-auto mb-16 max-w-2xl text-center text-muted">
            Whether it&apos;s a party, a hackathon, or a business pitch — TempSite
            generates the right website with the right sections.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="glass glass-hover rounded-2xl p-6 transition-all duration-300"
              >
                <span className="text-3xl">{f.icon}</span>
                <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-16 text-center text-3xl font-bold">
            How It <span className="gradient-text">Works</span>
          </h2>
          <div className="grid gap-8 sm:grid-cols-2">
            {STEPS.map((s) => (
              <div key={s.num} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-primary font-bold">
                  {s.num}
                </div>
                <div>
                  <h3 className="font-semibold">{s.title}</h3>
                  <p className="mt-1 text-sm text-muted">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-4 text-center text-3xl font-bold">
            Simple <span className="gradient-text">Pricing</span>
          </h2>
          <p className="mx-auto mb-16 max-w-xl text-center text-muted">
            Start free. Upgrade when you need more.
          </p>
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="glass rounded-2xl p-6">
              <p className="text-sm font-medium text-muted">Free</p>
              <p className="mt-2 text-4xl font-bold">$0</p>
              <p className="mt-1 text-sm text-muted">Forever</p>
              <ul className="mt-6 space-y-3 text-sm">
                <li>3 projects</li>
                <li>Social events only</li>
                <li>Visual editor</li>
                <li>HTML/CSS export</li>
              </ul>
              <Link
                href="/create"
                className="mt-6 block rounded-xl border border-border py-2.5 text-center text-sm font-medium transition-colors hover:bg-surface"
              >
                Get Started
              </Link>
            </div>
            <div className="glass rounded-2xl border-primary/30 p-6 ring-1 ring-primary/20">
              <p className="text-sm font-medium text-primary">Pro</p>
              <p className="mt-2 text-4xl font-bold">$12</p>
              <p className="mt-1 text-sm text-muted">/month</p>
              <ul className="mt-6 space-y-3 text-sm">
                <li>Unlimited projects</li>
                <li>Social + Business events</li>
                <li>Custom domain</li>
                <li>React/Tailwind export</li>
                <li>Remove branding</li>
              </ul>
              <Link
                href="/create"
                className="btn-glow mt-6 block rounded-xl py-2.5 text-center text-sm font-medium text-white"
              >
                Start Pro Trial
              </Link>
            </div>
            <div className="glass rounded-2xl p-6">
              <p className="text-sm font-medium text-muted">Business</p>
              <p className="mt-2 text-4xl font-bold">$29</p>
              <p className="mt-1 text-sm text-muted">/month</p>
              <ul className="mt-6 space-y-3 text-sm">
                <li>Everything in Pro</li>
                <li>Encrypted proposals</li>
                <li>Password protection</li>
                <li>Team (up to 5)</li>
                <li>Priority generation</li>
              </ul>
              <Link
                href="/create"
                className="mt-6 block rounded-xl border border-border py-2.5 text-center text-sm font-medium transition-colors hover:bg-surface"
              >
                Start Business Trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 text-center">
        <h2 className="text-3xl font-bold">
          Ready to <span className="gradient-text">Build</span>?
        </h2>
        <p className="mt-4 text-muted">
          Create your first event website in under 30 seconds.
        </p>
        <Link
          href="/create"
          className="btn-glow mt-8 inline-block rounded-xl px-10 py-4 text-base font-semibold text-white"
        >
          Start Building — Free
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-10 text-center text-sm text-muted">
        <p>
          TempSite — Built with AI, powered by{" "}
          <a
            href="https://github.com/daththeanalyst/website-html-css-js-editor"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            GlassStudio
          </a>
        </p>
        <p className="mt-2">&copy; 2026 Dath. All rights reserved.</p>
      </footer>
    </div>
  );
}

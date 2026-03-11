"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

const CATEGORIES = [
  {
    id: "social",
    icon: "🎉",
    title: "Social Event",
    desc: "Football match, birthday party, university club meeting, community gathering",
    examples: ["Birthday Party", "Football Tournament", "Club Meeting"],
    color: "from-pink-500/20 to-purple-500/20",
  },
  {
    id: "business_event",
    icon: "💼",
    title: "Business Event",
    desc: "Conference, hackathon, meetup, marathon, workshop, networking event",
    examples: ["PyTorch Meetup", "SurrealDB Hackathon", "JPMorgan Marathon"],
    color: "from-blue-500/20 to-cyan-500/20",
  },
  {
    id: "proposal",
    icon: "🔒",
    title: "Business Proposal",
    desc: "Pitch deck, project proposal, partnership presentation — password protected",
    examples: ["Investment Pitch", "Partnership Proposal", "Project Brief"],
    color: "from-amber-500/20 to-orange-500/20",
  },
];

export default function CreatePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="glass border-b border-border/50 px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="text-xl font-bold gradient-text">
            TempSite
          </Link>
          <Link
            href="/dashboard"
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-center text-3xl font-bold">
          What are you <span className="gradient-text">building</span>?
        </h1>
        <p className="mt-3 text-center text-muted">
          Pick a category and we&apos;ll generate the perfect website for you.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => router.push(`/create/${cat.id}`)}
              className="glass glass-hover group rounded-2xl p-6 text-left transition-all duration-300 hover:scale-[1.02]"
            >
              <div
                className={`inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${cat.color} text-2xl`}
              >
                {cat.icon}
              </div>
              <h3 className="mt-4 text-lg font-semibold group-hover:text-primary transition-colors">
                {cat.title}
              </h3>
              <p className="mt-2 text-sm text-muted">{cat.desc}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {cat.examples.map((ex) => (
                  <span
                    key={ex}
                    className="rounded-full bg-surface px-2.5 py-0.5 text-xs text-muted"
                  >
                    {ex}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

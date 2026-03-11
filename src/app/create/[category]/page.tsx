"use client";

import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

// ---- Social Event Form ----
function SocialEventForm({
  onSubmit,
  loading,
}: {
  onSubmit: (data: Record<string, unknown>) => void;
  loading: boolean;
}) {
  const [form, setForm] = useState({
    eventName: "",
    eventType: "party",
    date: "",
    time: "",
    venue: "",
    description: "",
    rsvpEnabled: true,
    colorTheme: "#6366f1",
  });

  const set = (key: string, val: unknown) =>
    setForm((p) => ({ ...p, [key]: val }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
      className="space-y-5"
    >
      <div>
        <label className="mb-1.5 block text-sm font-medium">Event Name</label>
        <input
          className="input-field"
          placeholder="e.g. Annual Football Tournament"
          value={form.eventName}
          onChange={(e) => set("eventName", e.target.value)}
          required
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Event Type</label>
          <select
            className="input-field"
            value={form.eventType}
            onChange={(e) => set("eventType", e.target.value)}
          >
            <option value="party">Party</option>
            <option value="football">Football Match</option>
            <option value="club_meeting">Club Meeting</option>
            <option value="gathering">Community Gathering</option>
            <option value="custom">Custom</option>
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">
            Theme Color
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={form.colorTheme}
              onChange={(e) => set("colorTheme", e.target.value)}
              className="h-10 w-14 cursor-pointer rounded-lg border border-border bg-transparent"
            />
            <span className="text-sm text-muted">{form.colorTheme}</span>
          </div>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Date</label>
          <input
            type="date"
            className="input-field"
            value={form.date}
            onChange={(e) => set("date", e.target.value)}
            required
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Time</label>
          <input
            type="time"
            className="input-field"
            value={form.time}
            onChange={(e) => set("time", e.target.value)}
            required
          />
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium">Venue</label>
        <input
          className="input-field"
          placeholder="e.g. Central Park, London"
          value={form.venue}
          onChange={(e) => set("venue", e.target.value)}
          required
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium">Description</label>
        <textarea
          className="input-field min-h-[100px] resize-y"
          placeholder="Tell people about the event..."
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          required
        />
      </div>
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="rsvp"
          checked={form.rsvpEnabled}
          onChange={(e) => set("rsvpEnabled", e.target.checked)}
          className="h-4 w-4 accent-primary"
        />
        <label htmlFor="rsvp" className="text-sm">
          Include RSVP form
        </label>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="btn-glow w-full rounded-xl py-3 text-sm font-semibold text-white disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate Website"}
      </button>
    </form>
  );
}

// ---- Business Event Form ----
function BusinessEventForm({
  onSubmit,
  loading,
}: {
  onSubmit: (data: Record<string, unknown>) => void;
  loading: boolean;
}) {
  const [form, setForm] = useState({
    eventName: "",
    eventType: "meetup",
    organizationName: "",
    date: "",
    time: "",
    venue: "",
    city: "",
    scheduleItems: [{ time: "10:00", title: "Welcome", speaker: "" }],
    sponsors: [""],
    registrationCta: "Register Now — Limited Spots Available",
  });

  const set = (key: string, val: unknown) =>
    setForm((p) => ({ ...p, [key]: val }));

  function addScheduleItem() {
    set("scheduleItems", [
      ...form.scheduleItems,
      { time: "", title: "", speaker: "" },
    ]);
  }

  function updateScheduleItem(i: number, key: string, val: string) {
    const items = [...form.scheduleItems];
    items[i] = { ...items[i], [key]: val };
    set("scheduleItems", items);
  }

  function removeScheduleItem(i: number) {
    set(
      "scheduleItems",
      form.scheduleItems.filter((_, idx) => idx !== i)
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({
          ...form,
          sponsors: form.sponsors.filter((s) => s.trim()),
        });
      }}
      className="space-y-5"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Event Name</label>
          <input
            className="input-field"
            placeholder="e.g. PyTorch London Meetup"
            value={form.eventName}
            onChange={(e) => set("eventName", e.target.value)}
            required
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Event Type</label>
          <select
            className="input-field"
            value={form.eventType}
            onChange={(e) => set("eventType", e.target.value)}
          >
            <option value="meetup">Meetup</option>
            <option value="hackathon">Hackathon</option>
            <option value="marathon">Marathon</option>
            <option value="conference">Conference</option>
            <option value="workshop">Workshop</option>
          </select>
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium">
          Organization / Company
        </label>
        <input
          className="input-field"
          placeholder="e.g. SurrealDB"
          value={form.organizationName}
          onChange={(e) => set("organizationName", e.target.value)}
          required
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Date</label>
          <input
            type="date"
            className="input-field"
            value={form.date}
            onChange={(e) => set("date", e.target.value)}
            required
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Time</label>
          <input
            type="time"
            className="input-field"
            value={form.time}
            onChange={(e) => set("time", e.target.value)}
            required
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">City</label>
          <input
            className="input-field"
            placeholder="e.g. London"
            value={form.city}
            onChange={(e) => set("city", e.target.value)}
            required
          />
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium">Venue</label>
        <input
          className="input-field"
          placeholder="e.g. Imperial College London"
          value={form.venue}
          onChange={(e) => set("venue", e.target.value)}
          required
        />
      </div>

      {/* Schedule */}
      <div>
        <label className="mb-1.5 block text-sm font-medium">Schedule</label>
        <div className="space-y-2">
          {form.scheduleItems.map((item, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="time"
                className="input-field w-28"
                value={item.time}
                onChange={(e) => updateScheduleItem(i, "time", e.target.value)}
              />
              <input
                className="input-field flex-1"
                placeholder="Session title"
                value={item.title}
                onChange={(e) => updateScheduleItem(i, "title", e.target.value)}
              />
              <input
                className="input-field w-36"
                placeholder="Speaker"
                value={item.speaker}
                onChange={(e) =>
                  updateScheduleItem(i, "speaker", e.target.value)
                }
              />
              {form.scheduleItems.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeScheduleItem(i)}
                  className="rounded-lg border border-red-500/20 px-2 text-red-400 hover:bg-red-500/10"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addScheduleItem}
          className="mt-2 text-sm text-primary hover:underline"
        >
          + Add schedule item
        </button>
      </div>

      {/* Sponsors */}
      <div>
        <label className="mb-1.5 block text-sm font-medium">
          Sponsors (optional)
        </label>
        <div className="space-y-2">
          {form.sponsors.map((s, i) => (
            <div key={i} className="flex gap-2">
              <input
                className="input-field"
                placeholder="Sponsor name"
                value={s}
                onChange={(e) => {
                  const arr = [...form.sponsors];
                  arr[i] = e.target.value;
                  set("sponsors", arr);
                }}
              />
              {form.sponsors.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    set(
                      "sponsors",
                      form.sponsors.filter((_, idx) => idx !== i)
                    )
                  }
                  className="rounded-lg border border-red-500/20 px-2 text-red-400 hover:bg-red-500/10"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => set("sponsors", [...form.sponsors, ""])}
          className="mt-2 text-sm text-primary hover:underline"
        >
          + Add sponsor
        </button>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium">
          Registration CTA
        </label>
        <input
          className="input-field"
          value={form.registrationCta}
          onChange={(e) => set("registrationCta", e.target.value)}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-glow w-full rounded-xl py-3 text-sm font-semibold text-white disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate Website"}
      </button>
    </form>
  );
}

// ---- Proposal Form ----
function ProposalForm({
  onSubmit,
  loading,
}: {
  onSubmit: (data: Record<string, unknown>) => void;
  loading: boolean;
}) {
  const [form, setForm] = useState({
    companyName: "",
    proposalTitle: "",
    executiveSummary: "",
    problemStatement: "",
    solutionDescription: "",
    teamMembers: [{ name: "", role: "" }],
    keyMetrics: "",
    contactInfo: "",
    accessPassword: "",
  });

  const set = (key: string, val: unknown) =>
    setForm((p) => ({ ...p, [key]: val }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({
          ...form,
          teamMembers: form.teamMembers.filter((m) => m.name.trim()),
        });
      }}
      className="space-y-5"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium">
            Company Name
          </label>
          <input
            className="input-field"
            placeholder="e.g. Acme Corp"
            value={form.companyName}
            onChange={(e) => set("companyName", e.target.value)}
            required
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">
            Proposal Title
          </label>
          <input
            className="input-field"
            placeholder="e.g. Series A Funding Pitch"
            value={form.proposalTitle}
            onChange={(e) => set("proposalTitle", e.target.value)}
            required
          />
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium">
          Executive Summary
        </label>
        <textarea
          className="input-field min-h-[100px] resize-y"
          placeholder="Brief overview of your proposal..."
          value={form.executiveSummary}
          onChange={(e) => set("executiveSummary", e.target.value)}
          required
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium">
          Problem Statement
        </label>
        <textarea
          className="input-field min-h-[80px] resize-y"
          placeholder="What problem are you solving?"
          value={form.problemStatement}
          onChange={(e) => set("problemStatement", e.target.value)}
          required
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium">
          Solution Description
        </label>
        <textarea
          className="input-field min-h-[80px] resize-y"
          placeholder="How does your solution work?"
          value={form.solutionDescription}
          onChange={(e) => set("solutionDescription", e.target.value)}
          required
        />
      </div>

      {/* Team */}
      <div>
        <label className="mb-1.5 block text-sm font-medium">Team Members</label>
        <div className="space-y-2">
          {form.teamMembers.map((m, i) => (
            <div key={i} className="flex gap-2">
              <input
                className="input-field flex-1"
                placeholder="Name"
                value={m.name}
                onChange={(e) => {
                  const members = [...form.teamMembers];
                  members[i] = { ...members[i], name: e.target.value };
                  set("teamMembers", members);
                }}
              />
              <input
                className="input-field flex-1"
                placeholder="Role"
                value={m.role}
                onChange={(e) => {
                  const members = [...form.teamMembers];
                  members[i] = { ...members[i], role: e.target.value };
                  set("teamMembers", members);
                }}
              />
              {form.teamMembers.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    set(
                      "teamMembers",
                      form.teamMembers.filter((_, idx) => idx !== i)
                    )
                  }
                  className="rounded-lg border border-red-500/20 px-2 text-red-400 hover:bg-red-500/10"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() =>
            set("teamMembers", [...form.teamMembers, { name: "", role: "" }])
          }
          className="mt-2 text-sm text-primary hover:underline"
        >
          + Add team member
        </button>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium">
          Key Metrics (optional)
        </label>
        <input
          className="input-field"
          placeholder="e.g. $2M revenue, 50K users, 98% retention"
          value={form.keyMetrics}
          onChange={(e) => set("keyMetrics", e.target.value)}
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium">
          Contact Info
        </label>
        <input
          className="input-field"
          placeholder="e.g. john@acmecorp.com"
          value={form.contactInfo}
          onChange={(e) => set("contactInfo", e.target.value)}
          required
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium">
          Access Password 🔒
        </label>
        <input
          type="password"
          className="input-field"
          placeholder="Viewers will need this to see the proposal"
          value={form.accessPassword}
          onChange={(e) => set("accessPassword", e.target.value)}
          required
        />
        <p className="mt-1 text-xs text-muted">
          This password will be required to view the published proposal.
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-glow w-full rounded-xl py-3 text-sm font-semibold text-white disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate Proposal"}
      </button>
    </form>
  );
}

// ---- Main Page ----
const CATEGORY_TITLES: Record<string, string> = {
  social: "Social Event",
  business_event: "Business Event",
  proposal: "Business Proposal",
};

const CATEGORY_ICONS: Record<string, string> = {
  social: "🎉",
  business_event: "💼",
  proposal: "🔒",
};

export default function CreateCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const category = params.category as string;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState<string[]>([]);

  async function handleSubmit(formData: Record<string, unknown>) {
    setLoading(true);
    setError("");
    setProgress([]);

    try {
      setProgress(["Sending to AI..."]);

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, formData }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Generation failed");
      }

      const { projectId } = await res.json();
      setProgress((p) => [...p, "Website generated!", "Redirecting to editor..."]);

      setTimeout(() => {
        router.push(`/editor/${projectId}`);
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  if (!CATEGORY_TITLES[category]) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <p className="text-5xl">🤔</p>
          <h1 className="mt-4 text-xl font-semibold">Category not found</h1>
          <Link href="/create" className="mt-4 inline-block text-primary hover:underline">
            Go back
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="glass border-b border-border/50 px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="text-xl font-bold gradient-text">
            TempSite
          </Link>
          <Link
            href="/create"
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            ← Back
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-2xl px-6 py-12">
        <div className="mb-8 text-center">
          <span className="text-4xl">{CATEGORY_ICONS[category]}</span>
          <h1 className="mt-3 text-2xl font-bold">
            Create a{" "}
            <span className="gradient-text">{CATEGORY_TITLES[category]}</span>{" "}
            Website
          </h1>
          <p className="mt-2 text-sm text-muted">
            Fill in the details below and AI will generate your website.
          </p>
        </div>

        <div className="glass rounded-2xl p-6 sm:p-8">
          {category === "social" && (
            <SocialEventForm onSubmit={handleSubmit} loading={loading} />
          )}
          {category === "business_event" && (
            <BusinessEventForm onSubmit={handleSubmit} loading={loading} />
          )}
          {category === "proposal" && (
            <ProposalForm onSubmit={handleSubmit} loading={loading} />
          )}
        </div>

        {/* Progress */}
        {progress.length > 0 && (
          <div className="mt-6 glass rounded-xl p-4">
            {progress.map((msg, i) => (
              <p key={i} className="text-sm text-muted">
                ✓ {msg}
              </p>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

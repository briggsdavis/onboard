import { useState } from "react"
import { useQuery } from "convex/react"
import { api } from "../convex/_generated/api"
import type { Id } from "../convex/_generated/dataModel"
import { ArrowLeft } from "@phosphor-icons/react"
import { questions } from "./questions"

const MONO = "font-mono text-xs uppercase tracking-widest"

function formatDate(submittedAt: string) {
  return new Date(submittedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function formatField(id: string, value: unknown): string {
  if (value === null || value === undefined) return "—"

  if (typeof value === "string") {
    if (value.startsWith("other:")) return value.slice("other:".length).trim() || "—"
    return value.trim() || "—"
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return "—"
    const first = value[0]
    if (typeof first === "number") {
      const [lo, hi] = value as number[]
      return `$${lo.toLocaleString()} – $${hi.toLocaleString()}`
    }
    if (typeof first === "string") return (value as string[]).join(", ")
    if (first && typeof first === "object") {
      if ("storageId" in first) return (value as any[]).map((f) => f.name).join(", ")
      if ("kind" in first && "name" in first)
        return (value as any[])
          .filter((o) => o.name?.trim())
          .map((o) => `${o.name} (${o.kind})`)
          .join(", ")
      if ("name" in first)
        return (value as any[])
          .map((i) => i.name)
          .filter(Boolean)
          .join(", ")
    }
  }

  if (typeof value === "object" && value !== null) {
    const lv = value as { links?: string[]; files?: any[] }
    const parts: string[] = []
    const links = (lv.links ?? []).filter((l) => l.trim())
    if (links.length) parts.push(links.join(", "))
    if (lv.files?.length) parts.push(`${lv.files.length} file${lv.files.length === 1 ? "" : "s"}`)
    return parts.join(" · ") || "—"
  }

  return "—"
}

function AdminList({ onSelect }: { onSelect: (id: string) => void }) {
  const submissions = useQuery(api.admin.listSubmissions)
  const [search, setSearch] = useState("")

  const filtered = (submissions ?? []).filter((s) => {
    if (!search.trim()) return true
    return (s.business_name ?? "").toLowerCase().includes(search.trim().toLowerCase())
  })

  return (
    <main className="min-h-screen px-8 py-16 sm:px-12 lg:px-20">
      <div className="mx-auto max-w-2xl flex flex-col gap-10">
        <div className="flex flex-col gap-6">
          <div className={`${MONO} text-muted`}>Submissions</div>
          <input
            type="text"
            placeholder="Search by name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border-b border-rule bg-transparent pb-3 font-light text-fg placeholder:text-muted focus:border-fg focus:outline-none text-base"
          />
        </div>

        <div className="flex flex-col divide-y divide-rule border-t border-rule">
          {submissions === undefined ? (
            <div className={`${MONO} text-muted py-8`}>Loading…</div>
          ) : filtered.length === 0 ? (
            <div className={`${MONO} text-muted py-8`}>
              {search ? "No results." : "No submissions yet."}
            </div>
          ) : (
            filtered.map((s) => (
              <button
                key={s._id}
                onClick={() => onSelect(s._id)}
                className="group flex items-center justify-between gap-4 -mx-2 px-2 py-5 text-left transition-colors hover:bg-white/[0.03]"
              >
                <span className="font-light text-fg text-base tracking-tight">
                  {s.business_name || "Unnamed"}
                </span>
                <span className={`${MONO} text-muted shrink-0`}>{formatDate(s.submittedAt)}</span>
              </button>
            ))
          )}
        </div>
      </div>
    </main>
  )
}

function AdminDetail({ id, onBack }: { id: string; onBack: () => void }) {
  const submission = useQuery(api.admin.getSubmission, {
    id: id as Id<"submissions">,
  })

  if (submission === undefined) {
    return (
      <main className="min-h-screen px-8 py-16 sm:px-12 lg:px-20">
        <div className="mx-auto max-w-2xl">
          <div className={`${MONO} text-muted`}>Loading…</div>
        </div>
      </main>
    )
  }

  if (submission === null) {
    return (
      <main className="min-h-screen px-8 py-16 sm:px-12 lg:px-20">
        <div className="mx-auto max-w-2xl flex flex-col gap-8">
          <button
            onClick={onBack}
            className={`${MONO} text-muted flex items-center gap-2 hover:text-fg transition-colors self-start`}
          >
            <ArrowLeft size={12} />
            Back
          </button>
          <div className={`${MONO} text-muted`}>Not found.</div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen px-8 py-16 sm:px-12 lg:px-20">
      <div className="mx-auto max-w-2xl flex flex-col gap-10">
        <div className="flex flex-col gap-8">
          <button
            onClick={onBack}
            className={`${MONO} text-muted flex items-center gap-2 hover:text-fg transition-colors self-start`}
          >
            <ArrowLeft size={12} />
            Back
          </button>
          <div className="flex items-baseline justify-between gap-6 flex-wrap">
            <h1 className="text-3xl font-light tracking-tight">
              {submission.business_name || "Unnamed"}
            </h1>
            <span className={`${MONO} text-muted`}>{formatDate(submission.submittedAt)}</span>
          </div>
        </div>

        <div className="flex flex-col divide-y divide-rule border-t border-rule">
          {questions.map((q) => {
            const val = (submission as Record<string, unknown>)[q.id]
            const formatted = formatField(q.id, val)
            const empty = formatted === "—"
            return (
              <div key={q.id} className="flex flex-col gap-2 py-6">
                <div className={`${MONO} text-muted`}>{q.prompt}</div>
                <div
                  className={`font-light text-base leading-relaxed tracking-tight ${
                    empty ? "text-muted italic" : "text-fg"
                  }`}
                >
                  {formatted}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}

export default function Admin() {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  if (selectedId) {
    return <AdminDetail id={selectedId} onBack={() => setSelectedId(null)} />
  }
  return <AdminList onSelect={setSelectedId} />
}

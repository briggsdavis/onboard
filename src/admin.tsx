import { Archive, ArrowLeft, Trash } from "@phosphor-icons/react"
import { useMutation, useQuery } from "convex/react"
import { Component, useState, type ReactNode } from "react"
import { api } from "../convex/_generated/api"
import type { Doc, Id } from "../convex/_generated/dataModel"
import { FileGallery } from "./file-preview"
import { questions, type LinksValue, type UploadedFile } from "./questions"

const MONO = "font-mono text-xs uppercase tracking-widest"
const CREATIVE_IDS = new Set(["logo", "colors", "images", "imagery", "inspiration", "competitors"])
const COLOR_ROLES = ["Primary", "Secondary", "Tertiary", "Accent"]

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null }
  static getDerivedStateFromError(error: Error) {
    return { error }
  }
  render() {
    if (this.state.error) {
      return (
        <main className="min-h-screen px-8 py-24 sm:px-12 lg:px-20">
          <div className="mx-auto flex max-w-2xl flex-col gap-4">
            <div className={`${MONO} text-muted`}>Admin error</div>
            <p className="text-sm font-light text-muted">{(this.state.error as Error).message}</p>
          </div>
        </main>
      )
    }
    return this.props.children
  }
}

function formatDate(submittedAt: string) {
  return new Date(submittedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function formatField(value: unknown): string {
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
      if ("storageId" in first) return (value as UploadedFile[]).map((file) => file.name).join(", ")
      if ("kind" in first && "name" in first) {
        return (value as Array<{ name: string; kind: string }>)
          .filter((item) => item.name.trim())
          .map((item) => `${item.name} (${item.kind})`)
          .join(", ")
      }
      if ("name" in first) {
        return (value as Array<{ name: string }>)
          .map((item) => item.name)
          .filter(Boolean)
          .join(", ")
      }
    }
  }
  return "—"
}

function AdminList({ onSelect }: { onSelect: (id: string) => void }) {
  const submissions = useQuery(api.admin.listSubmissions)
  const [search, setSearch] = useState("")
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [showArchived, setShowArchived] = useState(false)

  const filtered = (submissions ?? []).filter((submission) => {
    if (Boolean(submission.archived) !== showArchived) return false
    if (
      search.trim() &&
      !(submission.business_name ?? "").toLowerCase().includes(search.trim().toLowerCase())
    ) {
      return false
    }
    const submittedDate = submission.submittedAt.slice(0, 10)
    if (from && submittedDate < from) return false
    if (to && submittedDate > to) return false
    return true
  })

  return (
    <main className="min-h-screen px-8 py-24 sm:px-12 lg:px-20">
      <div className="mx-auto flex max-w-3xl flex-col gap-10">
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className={`${MONO} text-muted`}>
              {showArchived ? "Archived submissions" : "Submissions"}
            </div>
            <button
              onClick={() => setShowArchived((value) => !value)}
              className={`${MONO} flex items-center gap-2 border border-rule px-4 py-3 text-muted transition-colors hover:border-fg hover:text-fg`}
            >
              <Archive size={14} />
              {showArchived ? "View active" : "View archived"}
            </button>
          </div>
          <input
            type="search"
            placeholder="Search by client name…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full border-b border-rule bg-transparent pb-3 text-base font-light text-fg placeholder:text-muted focus:border-fg focus:outline-none"
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className={`${MONO} text-muted`}>From</span>
              <input
                type="date"
                value={from}
                onChange={(event) => setFrom(event.target.value)}
                className="border border-rule bg-transparent px-4 py-3 font-mono text-xs tracking-widest text-fg uppercase focus:border-fg focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className={`${MONO} text-muted`}>To</span>
              <input
                type="date"
                value={to}
                onChange={(event) => setTo(event.target.value)}
                className="border border-rule bg-transparent px-4 py-3 font-mono text-xs tracking-widest text-fg uppercase focus:border-fg focus:outline-none"
              />
            </label>
          </div>
        </div>

        <div className="flex flex-col divide-y divide-rule border-t border-rule">
          {submissions === undefined ? (
            <div className={`${MONO} py-8 text-muted`}>Loading…</div>
          ) : filtered.length === 0 ? (
            <div className={`${MONO} py-8 text-muted`}>No matching submissions.</div>
          ) : (
            filtered.map((submission) => (
              <button
                key={submission._id}
                onClick={() => onSelect(submission._id)}
                className="group -mx-2 flex items-center justify-between gap-4 px-2 py-5 text-left transition-colors hover:bg-white/5"
              >
                <span className="text-base font-light tracking-tight text-fg">
                  {submission.business_name || "Unnamed"}
                </span>
                <span className={`${MONO} shrink-0 text-muted`}>
                  {formatDate(submission.submittedAt)}
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </main>
  )
}

function AdminField({
  questionId,
  prompt,
  value,
}: {
  questionId: string
  prompt: string
  value: unknown
}) {
  if (questionId === "colors" && Array.isArray(value) && value.length > 0) {
    return (
      <AdminFieldShell prompt={prompt}>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {(value as string[]).map((color, index) => (
            <div key={color} className="flex items-center gap-3">
              <span
                className="h-12 w-12 shrink-0 border border-rule"
                style={{ backgroundColor: color }}
              />
              <div className="flex flex-col gap-1">
                <span className={`${MONO} text-muted`}>{COLOR_ROLES[index]}</span>
                <span className="font-mono text-sm text-fg uppercase">{color}</span>
              </div>
            </div>
          ))}
        </div>
      </AdminFieldShell>
    )
  }

  if (Array.isArray(value) && value.length > 0 && typeof value[0] === "object" && value[0]) {
    if ("storageId" in value[0]) {
      return (
        <AdminFieldShell prompt={prompt}>
          <FileGallery files={value as UploadedFile[]} downloadable />
        </AdminFieldShell>
      )
    }
  }

  if (value && typeof value === "object" && !Array.isArray(value) && "links" in value) {
    const linksValue = value as LinksValue
    const links = linksValue.links.filter((link) => link.trim())
    return (
      <AdminFieldShell prompt={prompt}>
        <div className="flex flex-col gap-5">
          {links.length > 0 ? (
            <div className="flex flex-col gap-2">
              {links.map((link) => (
                <a
                  key={link}
                  href={link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-light break-all text-fg underline decoration-rule underline-offset-4 hover:decoration-fg"
                >
                  {link}
                </a>
              ))}
            </div>
          ) : null}
          <FileGallery files={linksValue.files} downloadable />
          {links.length === 0 && linksValue.files.length === 0 ? (
            <span className="text-base font-light text-muted italic">—</span>
          ) : null}
        </div>
      </AdminFieldShell>
    )
  }

  const formatted = formatField(value)
  return (
    <AdminFieldShell prompt={prompt}>
      <div
        className={`text-base leading-relaxed font-light tracking-tight ${
          formatted === "—" ? "text-muted italic" : "whitespace-pre-wrap text-fg"
        }`}
      >
        {formatted}
      </div>
    </AdminFieldShell>
  )
}

function AdminFieldShell({ prompt, children }: { prompt: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3 border-t border-rule py-6">
      <div className={`${MONO} text-muted`}>{prompt}</div>
      {children}
    </section>
  )
}

function DetailColumn({
  submission,
  creative,
}: {
  submission: Doc<"submissions">
  creative: boolean
}) {
  return (
    <div>
      <div className={`${MONO} mb-4 text-muted`}>{creative ? "Creative" : "Project details"}</div>
      {questions
        .filter((question) => CREATIVE_IDS.has(question.id) === creative)
        .map((question) => (
          <AdminField
            key={question.id}
            questionId={question.id}
            prompt={question.prompt}
            value={(submission as Record<string, unknown>)[question.id]}
          />
        ))}
    </div>
  )
}

function DeleteConfirmation({
  name,
  onCancel,
  onConfirm,
}: {
  name: string
  onCancel: () => void
  onConfirm: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg/90 px-6">
      <div className="flex w-full max-w-md flex-col gap-6 border border-rule bg-bg p-8">
        <div className={`${MONO} text-muted`}>Confirm deletion</div>
        <h2 className="text-2xl font-light tracking-tight">Delete {name}?</h2>
        <p className="text-sm leading-relaxed font-light text-muted">
          This permanently removes the questionnaire entry. This action cannot be undone.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={onCancel}
            className={`${MONO} border border-rule px-4 py-3 text-muted transition-colors hover:border-fg hover:text-fg`}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`${MONO} border border-fg bg-fg px-4 py-3 text-bg transition-opacity hover:opacity-80`}
          >
            Delete permanently
          </button>
        </div>
      </div>
    </div>
  )
}

function AdminDetail({ id, onBack }: { id: string; onBack: () => void }) {
  const submission = useQuery(api.admin.getSubmission, { id: id as Id<"submissions"> })
  const setArchived = useMutation(api.admin.setArchived)
  const deleteSubmission = useMutation(api.admin.deleteSubmission)
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  if (submission === undefined) {
    return <main className={`${MONO} min-h-screen px-8 py-24 text-muted`}>Loading…</main>
  }
  if (submission === null) {
    return (
      <main className="min-h-screen px-8 py-24">
        <button onClick={onBack} className={`${MONO} border border-rule px-4 py-3 text-muted`}>
          Back
        </button>
      </main>
    )
  }

  const name = submission.business_name || "Unnamed"
  const handleDelete = async () => {
    await deleteSubmission({ id: submission._id })
    onBack()
  }

  return (
    <main className="min-h-screen lg:h-screen lg:overflow-hidden">
      <div className="grid min-h-screen lg:h-screen lg:grid-cols-2">
        <section className="border-rule px-8 pt-24 pb-16 lg:h-screen lg:overflow-y-auto lg:border-r lg:px-12">
          <DetailColumn submission={submission} creative />
        </section>
        <section className="px-8 pt-12 pb-16 lg:h-screen lg:overflow-y-auto lg:px-12 lg:pt-24">
          <div className="mb-10 flex flex-col gap-8">
            <button
              onClick={onBack}
              className={`${MONO} group flex items-center gap-2 self-start border border-rule px-4 py-3 text-muted transition-colors hover:border-fg hover:text-fg`}
            >
              <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
              Back
            </button>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-light tracking-tight">{name}</h1>
                <span className={`${MONO} text-muted`}>{formatDate(submission.submittedAt)}</span>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={async () => {
                    await setArchived({ id: submission._id, archived: !submission.archived })
                    onBack()
                  }}
                  className={`${MONO} flex items-center gap-2 border border-rule px-4 py-3 text-muted transition-colors hover:border-fg hover:text-fg`}
                >
                  <Archive size={14} />
                  {submission.archived ? "Restore" : "Archive"}
                </button>
                <button
                  onClick={() => setConfirmingDelete(true)}
                  className={`${MONO} flex items-center gap-2 border border-rule px-4 py-3 text-muted transition-colors hover:border-fg hover:text-fg`}
                >
                  <Trash size={14} />
                  Delete
                </button>
              </div>
            </div>
          </div>
          <DetailColumn submission={submission} creative={false} />
        </section>
      </div>
      {confirmingDelete ? (
        <DeleteConfirmation
          name={name}
          onCancel={() => setConfirmingDelete(false)}
          onConfirm={handleDelete}
        />
      ) : null}
    </main>
  )
}

function AdminInner() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  return selectedId ? (
    <AdminDetail id={selectedId} onBack={() => setSelectedId(null)} />
  ) : (
    <AdminList onSelect={setSelectedId} />
  )
}

export default function Admin() {
  return (
    <ErrorBoundary>
      <AdminInner />
    </ErrorBoundary>
  )
}

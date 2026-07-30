import { ArrowLeft, ArrowRight } from "@phosphor-icons/react"
import { useMutation, useQuery } from "convex/react"
import { useEffect, useMemo, useState } from "react"
import { api } from "../convex/_generated/api"
import type { Id } from "../convex/_generated/dataModel"
import {
  ColorField,
  FileUpload,
  LinksField,
  ListField,
  LongText,
  MultiSelect,
  OfferingsField,
  RangeSlider,
  ShortText,
  SingleSelect,
} from "./fields"
import { FileGallery } from "./file-preview"
import { LandingPage } from "./landing"
import { QuestionGraphic, GThankYou } from "./motion-graphics"
import { extractPalette } from "./palette"
import {
  questions,
  type Answers,
  type AnswerValue,
  type LinksValue,
  type ListItem,
  type Offering,
  type Question,
  type UploadedFile,
} from "./questions"

const STORAGE_KEY = "sidebrary.intake.v1"

type Saved = { answers: Answers; index: number; reachedReview: boolean }

const REVIEW_INDEX = questions.length

// Coerce a saved answer to the shape its question's current `kind` expects.
// Saved progress can predate a question changing kind (e.g. `vibe` went from
// single_select to multi_select), which would otherwise crash a field that
// calls `.map` on what is now the wrong type. Returns undefined to drop it.
function normalizeAnswer(q: Question, v: AnswerValue): AnswerValue | undefined {
  switch (q.kind) {
    case "short_text":
    case "long_text":
    case "single_select":
      return typeof v === "string" ? v : undefined
    case "multi_select":
    case "color":
      // Old single_select/single-color saved a bare string; wrap it.
      if (typeof v === "string") return v ? [v] : []
      return Array.isArray(v) && v.every((x) => typeof x === "string") ? v : undefined
    case "range":
      return Array.isArray(v) && v.length === 2 && v.every((x) => typeof x === "number")
        ? (v as AnswerValue)
        : undefined
    case "file_upload":
    case "list":
    case "offerings":
      return Array.isArray(v) ? v : undefined
    case "links":
      return v &&
        typeof v === "object" &&
        !Array.isArray(v) &&
        Array.isArray((v as LinksValue).links)
        ? v
        : undefined
  }
}

function normalizeAnswers(raw: Answers): Answers {
  const byId = new Map(questions.map((q) => [q.id, q]))
  const out: Answers = {}
  for (const [id, value] of Object.entries(raw)) {
    const q = byId.get(id)
    if (!q) continue // drop answers for questions that no longer exist
    const normalized = normalizeAnswer(q, value)
    if (normalized !== undefined) out[id] = normalized
  }
  return out
}

function loadSaved(): Saved {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Saved
      const clamped = Math.max(0, Math.min(parsed.index ?? 0, REVIEW_INDEX))
      return {
        answers: normalizeAnswers(parsed.answers ?? {}),
        index: clamped,
        reachedReview: parsed.reachedReview ?? clamped === REVIEW_INDEX,
      }
    }
  } catch {}
  return { answers: {}, index: 0, reachedReview: false }
}

function defaultValue(q: Question | undefined): AnswerValue {
  if (!q) return ""
  if (q.kind === "multi_select" || q.kind === "color") return []
  if (q.kind === "file_upload") return []
  if (q.kind === "range") return [q.min, q.max]
  if (q.kind === "list") return []
  if (q.kind === "offerings") return [] as Offering[]
  if (q.kind === "links") return { links: [""], files: [] } as LinksValue
  return ""
}

function isEmpty(v: AnswerValue) {
  if (typeof v === "string") {
    if (v.startsWith("other:")) return v.slice("other:".length).trim() === ""
    return v.trim() === ""
  }
  if (Array.isArray(v)) return v.length === 0
  // LinksValue
  const lv = v as LinksValue
  return lv.links.filter((l) => l.trim() !== "").length === 0 && lv.files.length === 0
}

type SubmitState = { kind: "idle" } | { kind: "success" } | { kind: "error" }

function hasAnyProgress(answers: Answers, index: number) {
  if (index > 0) return true
  return Object.values(answers).some((v) => {
    if (typeof v === "string") return v.trim() !== ""
    if (Array.isArray(v)) return v.length > 0
    return true
  })
}

export default function App() {
  const [screen, setScreen] = useState<"landing" | "questionnaire">("landing")
  const [{ answers, index, reachedReview }, setState] = useState<Saved>(() => loadSaved())
  const [submitState, setSubmitState] = useState<SubmitState>({ kind: "idle" })
  const submitMutation = useMutation(api.submissions.submit)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, index, reachedReview }))
  }, [answers, index, reachedReview])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Enter") return
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === "INPUT" || tag === "TEXTAREA") return
      next()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  })

  const total = questions.length
  const isReview = index === REVIEW_INDEX

  const [displayIndex, setDisplayIndex] = useState(index)
  const [phase, setPhase] = useState<"in" | "out">("in")

  useEffect(() => {
    if (displayIndex === index) return
    setPhase("out")
    const t = setTimeout(() => {
      setDisplayIndex(index)
      setPhase("in")
    }, 240)
    return () => clearTimeout(t)
  }, [index, displayIndex])

  const isDisplayReview = displayIndex === REVIEW_INDEX
  const q = questions[displayIndex]

  const value = useMemo(() => (q ? (answers[q.id] ?? defaultValue(q)) : ""), [answers, q])

  const sourceLogoStorageId = useMemo(() => {
    if (q?.kind !== "color" || !q.sourceAnswerId) return null
    const src = answers[q.sourceAnswerId]
    if (!Array.isArray(src) || src.length === 0) return null
    const first = src[0] as UploadedFile | string
    return typeof first === "string" ? null : (first?.storageId ?? null)
  }, [answers, q])

  const sourceLogoUrl = useQuery(
    api.files.getUrl,
    sourceLogoStorageId ? { storageId: sourceLogoStorageId as Id<"_storage"> } : "skip",
  )

  const [suggested, setSuggested] = useState<string[]>([])
  useEffect(() => {
    if (!sourceLogoUrl) {
      setSuggested([])
      return
    }
    let cancelled = false
    extractPalette(sourceLogoUrl)
      .then((p) => {
        if (!cancelled) setSuggested(p)
      })
      .catch(() => {
        if (!cancelled) setSuggested([])
      })
    return () => {
      cancelled = true
    }
  }, [sourceLogoUrl])

  const { prompt, listNoun } = useMemo(() => {
    if (q?.kind === "list" && q.itemNounSource) {
      const src = answers[q.itemNounSource.answerId]
      const hit = typeof src === "string" ? q.itemNounSource.map[src] : undefined
      if (hit) return { prompt: hit.prompt, listNoun: hit.noun }
    }
    return { prompt: q?.prompt ?? "", listNoun: q?.kind === "list" ? q.itemNoun : "" }
  }, [answers, q])

  const setValue = (v: AnswerValue) =>
    setState((s) => ({ ...s, answers: { ...s.answers, [q.id]: v } }))

  const canAdvance = isReview || !q?.required || !isEmpty(answers[q.id] ?? defaultValue(q))

  const next = () => {
    if (phase === "out" || !canAdvance) return
    if (index < REVIEW_INDEX) {
      setState((s) => {
        const nextIndex = s.index + 1
        return {
          ...s,
          index: nextIndex,
          reachedReview: s.reachedReview || nextIndex === REVIEW_INDEX,
        }
      })
    } else {
      submit()
    }
  }

  const prev = () => {
    if (phase === "out") return
    if (index > 0) setState((s) => ({ ...s, index: s.index - 1 }))
  }

  const submit = async () => {
    try {
      const known = new Set(questions.map((q) => q.id))
      const filtered = Object.fromEntries(Object.entries(answers).filter(([k]) => known.has(k)))
      await submitMutation({
        ...filtered,
        submittedAt: new Date().toISOString(),
      })
      localStorage.removeItem(STORAGE_KEY)
      setSubmitState({ kind: "success" })
    } catch (e) {
      console.error("[submit]", e)
      setSubmitState({ kind: "error" })
    }
  }

  if (screen === "landing") {
    return (
      <LandingPage
        hasProgress={hasAnyProgress(answers, index)}
        onContinue={() => setScreen("questionnaire")}
        onStartNew={() => {
          localStorage.removeItem(STORAGE_KEY)
          setState({ answers: {}, index: 0, reachedReview: false })
          setScreen("questionnaire")
        }}
      />
    )
  }

  if (submitState.kind === "success") {
    return (
      <main className="flex min-h-screen">
        <div className="flex w-full flex-col justify-center px-8 py-16 lg:w-1/2 lg:px-16">
          <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
            <h1 className="text-4xl font-light tracking-tight sm:text-5xl">Thank you.</h1>
            <p className="max-w-sm text-base leading-relaxed font-light text-muted">
              Our team will review everything you've shared and start making preparations. We'll be
              in touch shortly to set up a meeting where we can align on the details, fill any gaps,
              and get the project moving.
            </p>
            <div className="font-mono text-xs tracking-widest text-muted uppercase">
              You'll hear from us soon.
            </div>
          </div>
        </div>
        <aside className="hidden items-center justify-center border-l border-rule lg:flex lg:w-1/2">
          <div className="flex h-full w-full items-center justify-center p-8">
            <GThankYou />
          </div>
        </aside>
      </main>
    )
  }

  if (submitState.kind === "error") {
    return (
      <main className="flex min-h-screen">
        <div className="flex flex-1 flex-col justify-center px-8 py-16 lg:px-16">
          <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
            <div className="font-mono text-xs tracking-widest text-muted uppercase">
              Something went wrong
            </div>
            <h1 className="text-4xl font-light tracking-tight sm:text-5xl">
              We couldn't build your preview.
            </h1>
            <p className="max-w-md text-sm text-muted">
              Your answers are saved. Give it another try.
            </p>
            <button
              onClick={submit}
              className="group flex items-center gap-2 self-start border border-rule px-4 py-3 font-mono text-xs tracking-widest text-fg uppercase transition-colors hover:border-fg"
            >
              Try again
              <ArrowRight
                size={14}
                weight="regular"
                className="transition-transform group-hover:translate-x-1"
              />
            </button>
          </div>
        </div>
      </main>
    )
  }

  // Progress: front-loaded curve so early questions feel fast
  const progressFraction = isDisplayReview ? 1 : (displayIndex + 1) / (total + 1)
  const progress = Math.pow(progressFraction, 0.6)

  return (
    <main className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        {/* Left: question content */}
        <section className="flex w-full flex-col lg:w-1/2">
          <div className="flex flex-1 flex-col justify-center">
            <div className="mx-auto w-full max-w-xl px-8 py-16 sm:px-10">
              <div
                key={isDisplayReview ? "__review__" : q.id}
                className={`flex flex-col gap-8 ${phase === "out" ? "animate-question-out" : "animate-question-in"}`}
              >
                {isDisplayReview && (
                  <div className="font-mono text-xs tracking-widest text-muted uppercase">
                    Review
                  </div>
                )}

                <h1 className="text-4xl font-light tracking-tight sm:text-5xl">
                  {isDisplayReview ? "Review your answers." : prompt}
                </h1>
                {!isDisplayReview && q.hint ? (
                  <p className="-mt-4 max-w-lg text-sm leading-relaxed font-light text-muted">
                    {q.hint}
                  </p>
                ) : null}

                {isDisplayReview ? (
                  <ReviewSummary
                    answers={answers}
                    onEdit={(i) => setState((s) => ({ ...s, index: i }))}
                  />
                ) : (
                  <Field
                    q={q}
                    value={value}
                    setValue={setValue}
                    onSubmit={next}
                    suggested={suggested}
                    listNoun={listNoun}
                  />
                )}

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  {index === 0 ? (
                    <button
                      onClick={() => setScreen("landing")}
                      className="group flex items-center gap-2 border border-rule px-4 py-3 font-mono text-xs tracking-widest text-muted uppercase transition-colors hover:border-fg hover:text-fg"
                    >
                      <ArrowLeft
                        size={14}
                        weight="regular"
                        className="transition-transform group-hover:-translate-x-1"
                      />
                      Landing
                    </button>
                  ) : (
                    <button
                      onClick={prev}
                      className="group flex items-center gap-2 border border-rule px-4 py-3 font-mono text-xs tracking-widest text-fg uppercase transition-colors hover:border-fg"
                    >
                      <ArrowLeft
                        size={14}
                        weight="regular"
                        className="transition-transform group-hover:-translate-x-1"
                      />
                      Back
                    </button>
                  )}
                  <button
                    onClick={next}
                    disabled={!canAdvance}
                    className="group flex items-center gap-2 border border-rule px-4 py-3 font-mono text-xs tracking-widest text-fg uppercase transition-colors hover:border-fg disabled:opacity-15"
                  >
                    {isReview ? "Submit" : "Next"}
                    <ArrowRight
                      size={14}
                      weight="regular"
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </button>
                  {!isReview && reachedReview ? (
                    <button
                      onClick={() => setState((state) => ({ ...state, index: REVIEW_INDEX }))}
                      className="group flex items-center gap-2 border border-rule px-4 py-3 font-mono text-xs tracking-widest text-muted uppercase transition-colors hover:border-fg hover:text-fg"
                    >
                      Back to review
                      <ArrowRight
                        size={14}
                        weight="regular"
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Right: motion graphic */}
        <aside className="hidden items-center justify-center border-l border-rule lg:flex lg:w-1/2">
          <div
            key={isDisplayReview ? "__review__" : q?.id}
            className={`flex h-full w-full items-center justify-center p-8 ${phase === "out" ? "animate-graphic-out" : "animate-graphic-in"}`}
          >
            <QuestionGraphic index={displayIndex} isReview={isDisplayReview} />
          </div>
        </aside>
      </div>

      {/* Full-width progress bar */}
      <div className="relative h-px w-full bg-rule">
        <div
          className="absolute inset-y-0 left-0 bg-fg transition-[width] duration-700 ease-out"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </main>
  )
}

function Field({
  q,
  value,
  setValue,
  onSubmit,
  suggested,
  listNoun,
}: {
  q: (typeof questions)[number]
  value: AnswerValue
  setValue: (v: AnswerValue) => void
  onSubmit: () => void
  suggested: string[]
  listNoun: string
}) {
  switch (q.kind) {
    case "short_text":
      return <ShortText q={q} value={value as string} onChange={setValue} onSubmit={onSubmit} />
    case "long_text":
      return <LongText q={q} value={value as string} onChange={setValue} onSubmit={onSubmit} />
    case "color":
      return (
        <ColorField q={q} value={value as string[]} onChange={setValue} suggested={suggested} />
      )
    case "file_upload":
      return <FileUpload q={q} value={value as any} onChange={setValue} />
    case "single_select":
      return <SingleSelect q={q} value={value as string} onChange={setValue} />
    case "multi_select":
      return <MultiSelect q={q} value={value as string[]} onChange={setValue} />
    case "range":
      return <RangeSlider q={q} value={value as [number, number]} onChange={setValue} />
    case "list":
      return <ListField q={q} value={value as ListItem[]} onChange={setValue} noun={listNoun} />
    case "offerings":
      return <OfferingsField q={q} value={value as Offering[]} onChange={setValue} />
    case "links":
      return <LinksField q={q} value={value as LinksValue} onChange={setValue} />
  }
}

function formatAnswer(q: Question, value: AnswerValue): string {
  if (value === undefined || value === null) return ""
  switch (q.kind) {
    case "short_text":
    case "long_text": {
      const s = value as string
      return s.startsWith("other:") ? s.slice("other:".length) : s
    }
    case "single_select": {
      const s = value as string
      if (s.startsWith("other:")) return s.slice("other:".length) || "Other"
      const hit = q.options.find((o) => o.value === s)
      return hit?.label ?? s
    }
    case "multi_select": {
      const arr = value as string[]
      return arr
        .map((v) => {
          if (v.startsWith("other:")) return v.slice("other:".length) || "Other"
          return q.options.find((o) => o.value === v)?.label ?? v
        })
        .join(", ")
    }
    case "color":
      return (value as string[]).join(", ")
    case "range": {
      const [lo, hi] = value as [number, number]
      if (q.format === "currency") return `$${lo.toLocaleString()} – $${hi.toLocaleString()}`
      return `${lo} – ${hi}`
    }
    case "file_upload": {
      const files = value as UploadedFile[]
      if (files.length === 0) return ""
      return files.map((f) => f.name).join(", ")
    }
    case "list": {
      const items = value as ListItem[]
      return items
        .map((i) => i.name)
        .filter(Boolean)
        .join(", ")
    }
    case "offerings": {
      const items = value as Offering[]
      return items
        .filter((i) => i.name.trim() !== "")
        .map((i) => `${i.name} (${i.kind})`)
        .join(", ")
    }
    case "links": {
      const lv = value as LinksValue
      const links = lv.links.filter((l) => l.trim() !== "")
      const parts: string[] = []
      if (links.length) parts.push(links.join(", "))
      if (lv.files.length) parts.push(`${lv.files.length} file${lv.files.length === 1 ? "" : "s"}`)
      return parts.join(" · ")
    }
  }
}

function ReviewSummary({ answers, onEdit }: { answers: Answers; onEdit: (index: number) => void }) {
  return (
    <div className="flex flex-col divide-y divide-rule border-t border-b border-rule">
      {questions.map((q, i) => {
        const raw = answers[q.id]
        const v = raw === undefined ? defaultValue(q) : raw
        const formatted = formatAnswer(q, v)
        const empty = isEmpty(v) || formatted === ""
        return (
          <div key={q.id} className="group flex items-start gap-4 px-4 py-4">
            <span className="w-8 shrink-0 font-mono text-xs tracking-widest text-muted uppercase">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-3">
              <span className="font-mono text-xs tracking-widest text-muted uppercase">
                {q.prompt}
              </span>
              {empty ? (
                <span className="text-base font-light tracking-tight text-muted italic">—</span>
              ) : (
                <ReviewAnswer q={q} value={v} formatted={formatted} />
              )}
            </div>
            <button
              type="button"
              onClick={() => onEdit(i)}
              className="shrink-0 border border-rule px-3 py-2 font-mono text-xs tracking-widest text-muted uppercase transition-colors hover:border-fg hover:text-fg"
            >
              Edit
            </button>
          </div>
        )
      })}
    </div>
  )
}

function ReviewAnswer({
  q,
  value,
  formatted,
}: {
  q: Question
  value: AnswerValue
  formatted: string
}) {
  if (q.kind === "color") {
    return (
      <div className="flex flex-wrap gap-3">
        {(value as string[]).map((color, index) => (
          <div key={color} className="flex items-center gap-2">
            <span
              className="h-8 w-8 shrink-0 border border-rule"
              style={{ backgroundColor: color }}
            />
            <span className="font-mono text-xs tracking-widest text-muted uppercase">
              {["Primary", "Secondary", "Tertiary", "Accent"][index]} · {color}
            </span>
          </div>
        ))}
      </div>
    )
  }

  if (q.kind === "file_upload") {
    return <FileGallery files={value as UploadedFile[]} />
  }

  if (q.kind === "links") {
    const linkValue = value as LinksValue
    const links = linkValue.links.filter((link) => link.trim())
    return (
      <div className="flex flex-col gap-4">
        {links.length > 0 ? (
          <div className="flex flex-col gap-2">
            {links.map((link) => (
              <a
                key={link}
                href={link}
                target="_blank"
                rel="noreferrer"
                className="truncate text-sm font-light text-fg underline decoration-rule underline-offset-4 hover:decoration-fg"
              >
                {link}
              </a>
            ))}
          </div>
        ) : null}
        <FileGallery files={linkValue.files} />
      </div>
    )
  }

  return <span className="text-base font-light tracking-tight text-fg">{formatted}</span>
}

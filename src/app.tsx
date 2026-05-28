import { useEffect, useMemo, useState } from "react"
import { QuestionGraphic, GThankYou } from "./motion-graphics"
import { LandingPage } from "./landing"
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react"
import { useMutation, useQuery } from "convex/react"
import { api } from "../convex/_generated/api"
import type { Id } from "../convex/_generated/dataModel"
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
import { extractPalette } from "./palette"

const STORAGE_KEY = "sidebrary.intake.v1"

type Saved = { answers: Answers; index: number }

const REVIEW_INDEX = questions.length

function loadSaved(): Saved {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Saved
      const clamped = Math.max(0, Math.min(parsed.index ?? 0, REVIEW_INDEX))
      return { answers: parsed.answers ?? {}, index: clamped }
    }
  } catch {}
  return { answers: {}, index: 0 }
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
  const [{ answers, index }, setState] = useState<Saved>(() => loadSaved())
  const [submitState, setSubmitState] = useState<SubmitState>({ kind: "idle" })
  const submitMutation = useMutation(api.submissions.submit)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, index }))
  }, [answers, index])

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
    }, 200)
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
      setState((s) => ({ ...s, index: s.index + 1 }))
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
          setState({ answers: {}, index: 0 })
          setScreen("questionnaire")
        }}
      />
    )
  }

  if (submitState.kind === "success") {
    return (
      <main className="flex min-h-screen">
        <div className="flex w-full flex-col justify-center px-8 py-16 lg:w-1/2 lg:px-16">
          <div className="mx-auto w-full max-w-xl flex flex-col gap-6">
            <h1 className="text-4xl font-light tracking-tight sm:text-5xl">Thank you.</h1>
            <p className="text-base font-light text-muted leading-relaxed max-w-sm">
              Our team will review everything you've shared and start making preparations. We'll be
              in touch shortly to set up a meeting where we can align on the details, fill any gaps,
              and get the project moving.
            </p>
            <div className="font-mono text-xs uppercase tracking-widest text-muted">
              You'll hear from us soon.
            </div>
          </div>
        </div>
        <aside className="hidden lg:flex lg:w-1/2 items-center justify-center border-l border-rule">
          <div className="flex items-center justify-center p-8 w-full h-full">
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
          <div className="mx-auto w-full max-w-xl flex flex-col gap-6">
            <div className="font-mono text-xs uppercase tracking-widest text-muted">
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
              className="flex items-center gap-2 self-start font-mono text-xs uppercase tracking-widest text-fg transition-opacity hover:opacity-70"
            >
              Try again
              <ArrowRight size={14} weight="regular" />
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
                  <div className="font-mono text-xs uppercase tracking-widest text-muted">
                    Review
                  </div>
                )}

                <h1 className="text-4xl font-light tracking-tight sm:text-5xl">
                  {isDisplayReview ? "Review your answers." : prompt}
                </h1>

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

                <div className="flex items-center gap-6 pt-2">
                  {index === 0 ? (
                    <button
                      onClick={() => setScreen("landing")}
                      className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted transition-opacity hover:opacity-70"
                    >
                      <ArrowLeft size={14} weight="regular" />
                      Landing
                    </button>
                  ) : (
                    <button
                      onClick={prev}
                      className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-fg transition-opacity hover:opacity-70"
                    >
                      <ArrowLeft size={14} weight="regular" />
                      Back
                    </button>
                  )}
                  <button
                    onClick={next}
                    disabled={!canAdvance}
                    className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-fg transition-opacity hover:opacity-70 disabled:opacity-15"
                  >
                    {isReview ? "Submit" : "Next"}
                    <ArrowRight size={14} weight="regular" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Right: motion graphic */}
        <aside className="hidden lg:flex lg:w-1/2 items-center justify-center border-l border-rule">
          <div
            key={isDisplayReview ? "__review__" : q?.id}
            className={`flex items-center justify-center p-8 w-full h-full ${phase === "out" ? "animate-graphic-out" : "animate-graphic-in"}`}
          >
            <QuestionGraphic index={displayIndex} isReview={isDisplayReview} />
          </div>
        </aside>
      </div>

      {/* Full-width progress bar */}
      <div className="relative h-px w-full bg-rule">
        <div
          className="absolute inset-y-0 left-0 bg-fg transition-[width] duration-500 ease-out"
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
          <button
            key={q.id}
            onClick={() => onEdit(i)}
            className="group flex items-center gap-4 px-4 py-4 text-left transition-colors hover:bg-white/5"
          >
            <span className="font-mono w-8 shrink-0 text-xs uppercase tracking-widest text-muted">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="flex flex-1 flex-col gap-1">
              <span className="font-mono text-xs uppercase tracking-widest text-muted">
                {q.prompt}
              </span>
              <span
                className={`text-base font-light tracking-tight ${empty ? "text-muted italic" : "text-fg"}`}
              >
                {empty ? "—" : formatted}
              </span>
            </div>
            <span className="font-mono shrink-0 text-xs uppercase tracking-widest text-muted opacity-0 transition-opacity group-hover:opacity-100">
              Edit
            </span>
          </button>
        )
      })}
    </div>
  )
}

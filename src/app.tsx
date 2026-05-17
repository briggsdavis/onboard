import { useEffect, useMemo, useState } from "react"
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react"
import { useMutation, useQuery } from "convex/react"
import { api } from "../convex/_generated/api"
import type { Id } from "../convex/_generated/dataModel"
import {
  questions,
  type Answers,
  type AnswerValue,
  type ListItem,
  type Question,
  type UploadedFile,
} from "./questions"
import {
  ColorField,
  FileUpload,
  ListField,
  LongText,
  MultiSelect,
  RangeSlider,
  ShortText,
  SingleSelect,
} from "./fields"
import { extractPalette } from "./palette"

const STORAGE_KEY = "sidebrary.intake.v1"

type Saved = { answers: Answers; index: number }

function loadSaved(): Saved {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Saved
      const clamped = Math.max(0, Math.min(parsed.index ?? 0, questions.length - 1))
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
  return ""
}

function isEmpty(v: AnswerValue) {
  if (typeof v === "string") {
    if (v.startsWith("other:")) return v.slice("other:".length).trim() === ""
    return v.trim() === ""
  }
  return v.length === 0
}

type SubmitState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error" }

export default function App() {
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

  const q = questions[displayIndex]

  const value = useMemo(() => answers[q?.id] ?? defaultValue(q), [answers, q])

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

  const canAdvance = !q?.required || !isEmpty(answers[q.id] ?? defaultValue(q))

  const next = () => {
    if (phase === "out" || !canAdvance) return
    if (index < total - 1) {
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
    setSubmitState({ kind: "submitting" })
    try {
      await submitMutation({
        answers,
        submittedAt: new Date().toISOString(),
      })
      localStorage.removeItem(STORAGE_KEY)
      setSubmitState({ kind: "success" })
    } catch (e) {
      console.error("[submit]", e)
      setSubmitState({ kind: "error" })
    }
  }

  if (submitState.kind === "submitting") {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl items-center px-6 sm:px-10">
        <div className="flex flex-col gap-4">
          <div className="font-mono text-xs uppercase tracking-widest text-muted">
            Building your preview
          </div>
          <h1 className="text-4xl font-light tracking-tight sm:text-5xl">One moment.</h1>
        </div>
      </main>
    )
  }

  if (submitState.kind === "success") {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl items-center px-6 sm:px-10">
        <div className="flex flex-col gap-6">
          <h1 className="text-4xl font-light tracking-tight sm:text-5xl">Thank you.</h1>
          <div className="font-mono text-xs uppercase tracking-widest text-muted">
            Your responses have been saved.
          </div>
        </div>
      </main>
    )
  }

  if (submitState.kind === "error") {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl items-center px-6 sm:px-10">
        <div className="flex flex-col gap-6">
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
      </main>
    )
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-8 px-6 sm:px-10">
      <div
        key={q.id}
        className={`flex flex-col gap-8 ${phase === "out" ? "animate-question-out" : "animate-question-in"}`}
      >
        <div className="font-mono text-xs uppercase tracking-widest text-muted">
          {String(displayIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </div>

        <h1 className="text-4xl font-light tracking-tight sm:text-5xl">{prompt}</h1>

        <Field
          q={q}
          value={value}
          setValue={setValue}
          onSubmit={next}
          suggested={suggested}
          listNoun={listNoun}
        />

        <div className="flex items-center gap-6 pt-2">
          <button
            onClick={prev}
            disabled={index === 0}
            className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-fg transition-opacity hover:opacity-70 disabled:opacity-15"
          >
            <ArrowLeft size={14} weight="regular" />
            Back
          </button>
          <button
            onClick={next}
            disabled={!canAdvance}
            className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-fg transition-opacity hover:opacity-70 disabled:opacity-15"
          >
            {index === total - 1 ? "Submit" : "Next"}
            <ArrowRight size={14} weight="regular" />
          </button>
        </div>
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
  }
}

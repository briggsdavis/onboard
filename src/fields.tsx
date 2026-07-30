import { DotsSixVertical, Plus, X, UploadSimple } from "@phosphor-icons/react"
import { useMutation, useQuery } from "convex/react"
import { useEffect, useRef, useState } from "react"
import { HexColorPicker, HexColorInput } from "react-colorful"
import { api } from "../convex/_generated/api"
import type {
  LinksValue,
  ListItem,
  Offering,
  Question,
  RangeValue,
  UploadedFile,
} from "./questions"

function StoredImage({
  storageId,
  alt,
  className,
}: {
  storageId: string
  alt: string
  className?: string
}) {
  const url = useQuery(api.files.getUrl, storageId ? { storageId } : "skip")
  if (!url) return <div className={`${className ?? ""} bg-rule/30`} />
  return <img src={url} alt={alt} className={className} />
}

export function ShortText({
  q,
  value,
  onChange,
  onSubmit,
}: {
  q: Extract<Question, { kind: "short_text" }>
  value: string
  onChange: (v: string) => void
  onSubmit: () => void
}) {
  return (
    <input
      autoFocus
      type="text"
      value={value}
      placeholder={q.placeholder}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault()
          onSubmit()
        }
      }}
      className="w-full border-b border-rule bg-transparent pb-2 text-2xl font-light tracking-tight text-fg placeholder:text-muted focus:outline-none"
    />
  )
}

export function LongText({
  q,
  value,
  onChange,
  onSubmit,
}: {
  q: Extract<Question, { kind: "long_text" }>
  value: string
  onChange: (v: string) => void
  onSubmit: () => void
}) {
  return (
    <textarea
      autoFocus
      value={value}
      placeholder={q.placeholder}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault()
          onSubmit()
        }
      }}
      rows={4}
      className="w-full resize-none border-b border-rule bg-transparent pb-2 text-xl font-light tracking-tight text-fg placeholder:text-muted focus:outline-none"
    />
  )
}

const DEFAULT_PALETTE = [
  "#ffffff",
  "#000000",
  "#e5e5e5",
  "#b8341d",
  "#1f3a5f",
  "#3d6b3a",
  "#e8b04b",
  "#7a4a8c",
]

const COLOR_ROLES = ["Primary", "Secondary", "Tertiary", "Accent"]
const LOGO_LABELS = ["Main Logo", "Secondary Logo", "Tertiary Logo", "Fourth Logo", "Fifth Logo"]

function Swatch({
  color,
  onClick,
  disabled,
  children,
  size,
}: {
  color: string
  onClick: () => void
  disabled?: boolean
  children?: React.ReactNode
  size: "sm" | "lg"
}) {
  const dim = size === "lg" ? "h-16 w-16" : "h-6 w-6"
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`group relative border border-rule transition-opacity hover:opacity-80 disabled:opacity-30 ${dim}`}
      style={{ backgroundColor: color }}
      aria-label={color}
    >
      {children}
    </button>
  )
}

function ColorPickerPopover({
  onAdd,
  onClose,
}: {
  onAdd: (c: string) => void
  onClose: () => void
}) {
  const [draft, setDraft] = useState("#888888")
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("mousedown", onDown)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onDown)
      document.removeEventListener("keydown", onKey)
    }
  }, [onClose])

  const commit = () => {
    onAdd(draft.toLowerCase())
    onClose()
  }

  return (
    <div
      ref={ref}
      className="absolute top-full left-0 z-40 mt-3 flex flex-col gap-3 border border-rule bg-bg p-3"
    >
      <HexColorPicker color={draft} onChange={setDraft} />
      <div className="flex items-center gap-2">
        <span className="font-mono text-xs tracking-widest text-muted uppercase">#</span>
        <HexColorInput
          color={draft}
          onChange={setDraft}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit()
          }}
          prefixed={false}
          className="w-24 border-b border-rule bg-transparent pb-1 font-mono text-sm text-fg uppercase focus:outline-none"
        />
        <button
          onClick={commit}
          className="ml-auto border border-rule px-3 py-1 font-mono text-xs tracking-widest text-fg uppercase transition-colors hover:bg-fg hover:text-bg"
        >
          Add
        </button>
      </div>
    </div>
  )
}

export function ColorField({
  q,
  value,
  onChange,
  suggested,
}: {
  q: Extract<Question, { kind: "color" }>
  value: string[]
  onChange: (v: string[]) => void
  suggested?: string[]
}) {
  const max = q.max ?? 4
  const [picking, setPicking] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const add = (c: string) => {
    if (value.includes(c) || value.length >= max) return
    onChange([...value, c])
  }
  const remove = (c: string) => onChange(value.filter((x) => x !== c))
  const reorder = (to: number) => {
    if (draggedIndex === null || draggedIndex === to) return
    const reordered = [...value]
    const [moved] = reordered.splice(draggedIndex, 1)
    reordered.splice(to, 0, moved)
    onChange(reordered)
    setDraggedIndex(to)
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="relative flex flex-wrap items-start gap-x-12 gap-y-6">
        {value.map((c, index) => (
          <div
            key={c}
            draggable
            onDragStart={() => setDraggedIndex(index)}
            onDragOver={(event) => {
              event.preventDefault()
              reorder(index)
            }}
            onDragEnd={() => setDraggedIndex(null)}
            className={`flex w-16 cursor-grab flex-col items-center gap-2 transition-opacity active:cursor-grabbing ${
              draggedIndex === index ? "opacity-50" : ""
            }`}
          >
            <div className="flex items-center justify-center gap-1 font-mono text-xs tracking-widest whitespace-nowrap text-muted uppercase">
              <DotsSixVertical size={14} />
              {COLOR_ROLES[index]}
            </div>
            <Swatch color={c} onClick={() => remove(c)} size="lg">
              <span className="absolute inset-0 flex items-center justify-center text-fg opacity-0 mix-blend-difference transition-opacity group-hover:opacity-100">
                <X size={18} weight="regular" />
              </span>
            </Swatch>
            <span className="text-center font-mono text-xs tracking-widest whitespace-nowrap text-muted uppercase">
              {c}
            </span>
          </div>
        ))}
        {value.length < max && (
          <div className="flex w-16 flex-col items-center gap-2">
            <span className="h-4" aria-hidden="true" />
            <button
              onClick={() => setPicking((p) => !p)}
              className="flex h-16 w-16 items-center justify-center border border-rule text-muted transition-colors hover:border-fg hover:text-fg"
              aria-label="Add color"
            >
              <Plus size={20} weight="regular" />
            </button>
          </div>
        )}
        {picking && <ColorPickerPopover onAdd={add} onClose={() => setPicking(false)} />}
      </div>
      {suggested && suggested.length > 0 && (
        <div>
          <div className="mb-3 font-mono text-xs tracking-widest text-muted uppercase">
            From your logo
          </div>
          <div className="flex flex-wrap gap-2">
            {suggested.map((c, index) => (
              <span
                key={c}
                className="animate-palette-rise"
                style={{ animationDelay: `${index * 55}ms` }}
              >
                <Swatch
                  color={c}
                  size="sm"
                  onClick={() => add(c)}
                  disabled={value.includes(c) || value.length >= max}
                />
              </span>
            ))}
          </div>
        </div>
      )}
      <div>
        <div className="mb-3 font-mono text-xs tracking-widest text-muted uppercase">Starter</div>
        <div className="flex flex-wrap gap-2">
          {DEFAULT_PALETTE.map((c) => (
            <Swatch
              key={c}
              color={c}
              size="sm"
              onClick={() => add(c)}
              disabled={value.includes(c) || value.length >= max}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export function FileUpload({
  q,
  value,
  onChange,
}: {
  q: Extract<Question, { kind: "file_upload" }>
  value: UploadedFile[]
  onChange: (v: UploadedFile[]) => void
}) {
  const ref = useRef<HTMLInputElement>(null)
  const [pending, setPending] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const generateUploadUrl = useMutation(api.files.generateUploadUrl)

  const uploadOne = async (file: File): Promise<UploadedFile> => {
    const uploadUrl = await generateUploadUrl()
    const res = await fetch(uploadUrl, {
      method: "POST",
      // Many files the browser can't classify (e.g. Adobe .ai) report an empty
      // file.type. An empty Content-Type header is rejected by the storage
      // endpoint with HTTP 400, so fall back to a generic binary type.
      headers: { "Content-Type": file.type || "application/octet-stream" },
      body: file,
    })
    if (!res.ok) throw new Error(`Upload failed: ${res.status}`)
    const { storageId } = (await res.json()) as { storageId: string }
    return {
      key: `${file.name}-${file.size}-${file.lastModified}`,
      name: file.name,
      type: file.type,
      size: file.size,
      storageId,
    }
  }

  const handle = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setError(null)
    const available = q.maxFiles === undefined ? files.length : q.maxFiles - value.length
    if (available <= 0) {
      setError(`You can upload up to ${q.maxFiles} files.`)
      return
    }
    const list = Array.from(files).slice(0, available)
    setPending((p) => p + list.length)
    try {
      const uploaded = (await Promise.all(list.map(uploadOne))).map((file, index) =>
        q.editableLabels ? { ...file, label: LOGO_LABELS[value.length + index] } : file,
      )
      onChange(q.multiple ? [...value, ...uploaded] : uploaded.slice(0, 1))
    } catch (e: any) {
      setError(e?.message ?? "Upload failed")
    } finally {
      setPending((p) => p - list.length)
    }
  }
  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i))
  const rename = (i: number, label: string) =>
    onChange(value.map((file, index) => (index === i ? { ...file, label } : file)))

  return (
    <div className="flex flex-col gap-6">
      <div
        onClick={() => ref.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          handle(e.dataTransfer.files)
        }}
        className="cursor-pointer border border-rule px-6 py-10 text-center transition-colors hover:border-fg"
      >
        <div className="flex flex-col items-center gap-3 text-muted">
          <UploadSimple size={20} weight="regular" />
          <span className="font-mono text-xs tracking-widest uppercase">
            {pending > 0 ? `Uploading ${pending}...` : "Drop files or click to browse"}
          </span>
        </div>
        <input
          ref={ref}
          type="file"
          accept={q.accept}
          multiple={q.multiple}
          className="hidden"
          onChange={(e) => handle(e.target.files)}
        />
      </div>
      {error && <div className="font-mono text-xs tracking-widest text-fg uppercase">{error}</div>}
      {value.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {value.map((f, i) => (
            <div key={f.key} className="group flex min-w-0 flex-col gap-2">
              <div className="relative aspect-square">
                {f.type.startsWith("image/") ? (
                  <StoredImage
                    storageId={f.storageId}
                    alt={f.name}
                    className="h-full w-full border border-rule object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center border border-rule px-2 text-center font-mono text-xs tracking-widest break-all text-muted uppercase">
                    {f.name}
                  </div>
                )}
                <button
                  onClick={() => remove(i)}
                  className="absolute top-1 right-1 bg-fg px-2 py-0.5 font-mono text-xs tracking-widest text-bg uppercase opacity-0 transition-opacity group-hover:opacity-100"
                >
                  remove
                </button>
              </div>
              {q.editableLabels && (
                <input
                  type="text"
                  value={f.label ?? LOGO_LABELS[i]}
                  aria-label={`Title for ${f.name}`}
                  onChange={(event) => rename(i, event.target.value)}
                  className="w-full border-b border-rule bg-transparent pb-1 text-sm font-light text-fg placeholder:text-muted focus:border-fg focus:outline-none"
                />
              )}
              {!q.editableLabels && (
                <div className="truncate text-xs font-light text-muted" title={f.name}>
                  {f.name}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function SingleSelect({
  q,
  value,
  onChange,
}: {
  q: Extract<Question, { kind: "single_select" }>
  value: string
  onChange: (v: string) => void
}) {
  const isOther = value.startsWith("other:") || value === "other"
  const otherText = value.startsWith("other:") ? value.slice("other:".length) : ""
  const otherInputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (isOther) otherInputRef.current?.focus()
  }, [isOther])

  return (
    <div className="flex flex-col">
      {q.options.map((opt) => {
        const active = value === opt.value
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className="flex items-baseline gap-6 border-t border-rule px-4 py-4 text-left transition-colors last:border-b hover:bg-white/5"
          >
            <span
              className={`text-lg font-light tracking-tight ${active ? "text-fg" : "text-muted"}`}
            >
              {opt.label}
            </span>
            {opt.blurb && (
              <span className="ml-auto hidden max-w-xs text-right text-sm text-muted sm:block">
                {opt.blurb}
              </span>
            )}
          </button>
        )
      })}
      {q.allowOther && (
        <div
          role="button"
          tabIndex={0}
          onClick={() => {
            if (!isOther) onChange("other:")
          }}
          onKeyDown={(e) => {
            if ((e.key === "Enter" || e.key === " ") && !isOther) {
              e.preventDefault()
              onChange("other:")
            }
          }}
          className="flex cursor-pointer items-baseline gap-6 border-t border-b border-rule px-4 py-4 text-left transition-colors hover:bg-white/5"
        >
          <span
            className={`text-lg font-light tracking-tight ${isOther ? "text-fg" : "text-muted"}`}
          >
            {q.allowOther.label}
          </span>
          <input
            ref={otherInputRef}
            type="text"
            value={otherText}
            placeholder={q.allowOther.placeholder}
            tabIndex={isOther ? 0 : -1}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => onChange(`other:${e.target.value}`)}
            className={`ml-auto w-full max-w-xs bg-transparent text-right text-base font-light text-fg placeholder:text-muted focus:outline-none ${isOther ? "" : "pointer-events-none opacity-0"}`}
          />
        </div>
      )}
    </div>
  )
}

function formatNumber(n: number, format?: "currency") {
  if (format === "currency") {
    if (n >= 1000) {
      const k = n / 1000
      const s = k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)
      return `$${s}k`
    }
    return `$${n}`
  }
  return String(n)
}

export function RangeSlider({
  q,
  value,
  onChange,
}: {
  q: Extract<Question, { kind: "range" }>
  value: RangeValue
  onChange: (v: RangeValue) => void
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState<"lo" | "hi" | null>(null)
  const [lo, hi] = value
  const span = q.max - q.min

  const valueAt = (clientX: number) => {
    const rect = trackRef.current?.getBoundingClientRect()
    if (!rect) return q.min
    const t = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    const raw = q.min + t * span
    const stepped = Math.round(raw / q.step) * q.step
    return Math.max(q.min, Math.min(q.max, stepped))
  }

  useEffect(() => {
    if (!dragging) return
    const onMove = (e: PointerEvent) => {
      const v = valueAt(e.clientX)
      if (dragging === "lo") onChange([Math.min(v, hi), hi])
      else onChange([lo, Math.max(v, lo)])
    }
    const onUp = () => setDragging(null)
    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", onUp)
    return () => {
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onUp)
    }
  }, [dragging, lo, hi])

  const pct = (n: number) => `${((n - q.min) / span) * 100}%`

  const onTrackPointerDown = (e: React.PointerEvent) => {
    const v = valueAt(e.clientX)
    const which = Math.abs(v - lo) <= Math.abs(v - hi) ? "lo" : "hi"
    if (which === "lo") onChange([v, hi])
    else onChange([lo, v])
    setDragging(which)
  }

  const onThumbKey = (which: "lo" | "hi") => (e: React.KeyboardEvent) => {
    const delta =
      e.key === "ArrowLeft" || e.key === "ArrowDown"
        ? -q.step
        : e.key === "ArrowRight" || e.key === "ArrowUp"
          ? q.step
          : 0
    if (!delta) return
    e.preventDefault()
    if (which === "lo") onChange([Math.max(q.min, Math.min(lo + delta, hi)), hi])
    else onChange([lo, Math.min(q.max, Math.max(hi + delta, lo))])
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-baseline justify-between font-mono text-xs tracking-widest text-muted uppercase">
        <span className="text-fg">{formatNumber(lo, q.format)}</span>
        <span className="text-fg">{formatNumber(hi, q.format)}</span>
      </div>
      <div className="relative h-10 touch-none px-2 select-none">
        <div
          ref={trackRef}
          onPointerDown={onTrackPointerDown}
          className="relative h-full cursor-pointer"
        >
          <div className="absolute top-1/2 right-0 left-0 h-px -translate-y-1/2 bg-rule" />
          <div
            className="absolute top-1/2 h-px -translate-y-1/2 bg-fg"
            style={{ left: pct(lo), right: `calc(100% - ${pct(hi)})` }}
          />
          {(["lo", "hi"] as const).map((which) => {
            const v = which === "lo" ? lo : hi
            return (
              <div
                key={which}
                role="slider"
                tabIndex={0}
                aria-valuemin={q.min}
                aria-valuemax={q.max}
                aria-valuenow={v}
                onPointerDown={(e) => {
                  e.stopPropagation()
                  setDragging(which)
                }}
                onKeyDown={onThumbKey(which)}
                className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 border border-fg bg-white focus:outline-none"
                style={{ left: pct(v) }}
              />
            )
          })}
        </div>
      </div>
      <div className="flex justify-between font-mono text-xs tracking-widest text-muted uppercase">
        <span>{formatNumber(q.min, q.format)}</span>
        <span>{formatNumber(q.max, q.format)}</span>
      </div>
    </div>
  )
}

export function ListField({
  value,
  onChange,
  noun,
}: {
  q: Extract<Question, { kind: "list" }>
  value: ListItem[]
  onChange: (v: ListItem[]) => void
  noun: string
}) {
  const update = (id: string, patch: Partial<ListItem>) =>
    onChange(value.map((it) => (it.id === id ? { ...it, ...patch } : it)))
  const remove = (id: string) => onChange(value.filter((it) => it.id !== id))
  const add = () => onChange([...value, { id: crypto.randomUUID(), name: "", description: "" }])

  return (
    <div className="flex flex-col gap-4">
      {value.map((item, i) => (
        <div
          key={item.id}
          className="group relative flex flex-col gap-2 border border-rule px-4 py-4"
        >
          <div className="flex items-baseline gap-3">
            <span className="w-6 font-mono text-xs tracking-widest text-muted uppercase">
              {String(i + 1).padStart(2, "0")}
            </span>
            <input
              autoFocus={i === value.length - 1}
              type="text"
              value={item.name}
              placeholder={`${noun.charAt(0).toUpperCase() + noun.slice(1)} name`}
              onChange={(e) => update(item.id, { name: e.target.value })}
              className="flex-1 border-b border-rule bg-transparent pb-1 text-lg font-light tracking-tight text-fg placeholder:text-muted focus:outline-none"
            />
            <button
              onClick={() => remove(item.id)}
              aria-label="Remove"
              className="text-muted opacity-0 transition-opacity group-hover:opacity-100 hover:text-fg"
            >
              <X size={16} weight="regular" />
            </button>
          </div>
          <textarea
            value={item.description}
            placeholder="Description (optional)"
            onChange={(e) => update(item.id, { description: e.target.value })}
            rows={2}
            className="ml-9 w-[calc(100%-2.25rem)] resize-none bg-transparent pb-1 text-sm font-light text-fg placeholder:text-muted focus:outline-none"
          />
        </div>
      ))}
      <button
        onClick={add}
        className="flex items-center gap-2 self-start border border-rule px-4 py-2 font-mono text-xs tracking-widest text-muted uppercase transition-colors hover:border-fg hover:text-fg"
      >
        <Plus size={14} weight="regular" />
        Add {noun}
      </button>
    </div>
  )
}

export function MultiSelect({
  q,
  value,
  onChange,
}: {
  q: Extract<Question, { kind: "multi_select" }>
  value: string[]
  onChange: (v: string[]) => void
}) {
  const otherIndices = value
    .map((v, i) => (v.startsWith("other:") || v === "other" ? i : -1))
    .filter((i) => i >= 0)
  const lastOtherRef = useRef<HTMLInputElement>(null)

  const selectedValues = value.filter((v) => !v.startsWith("other:") && v !== "other")
  const atMax = q.max !== undefined && value.length >= q.max

  const clashWarning = q.clashes
    ? (() => {
        for (const [a, b] of q.clashes) {
          if (selectedValues.includes(a) && selectedValues.includes(b)) {
            const labelA = q.options.find((o) => o.value === a)?.label ?? a
            const labelB = q.options.find((o) => o.value === b)?.label ?? b
            return `${labelA} and ${labelB} tend to clash — they might pull the design in opposite directions.`
          }
        }
        return null
      })()
    : null

  const toggle = (v: string) =>
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v])

  const addOther = () => {
    onChange([...value, "other:"])
    setTimeout(() => lastOtherRef.current?.focus(), 0)
  }

  const setOtherAt = (i: number, text: string) =>
    onChange(value.map((v, idx) => (idx === i ? `other:${text}` : v)))

  const removeAt = (i: number) => onChange(value.filter((_, idx) => idx !== i))

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {q.options.map((opt) => {
          const active = value.includes(opt.value)
          const disabled = !active && atMax
          return (
            <button
              key={opt.value}
              onClick={() => !disabled && toggle(opt.value)}
              disabled={disabled}
              className={`border px-4 py-2 text-base font-light tracking-tight transition-colors ${
                active
                  ? "border-fg bg-fg text-bg"
                  : disabled
                    ? "cursor-not-allowed border-rule text-muted opacity-30"
                    : "border-rule text-muted hover:border-fg hover:text-fg"
              }`}
            >
              {opt.label}
            </button>
          )
        })}
        {q.allowOther && (
          <button
            onClick={addOther}
            disabled={atMax}
            className={`flex items-center gap-2 border border-rule px-4 py-2 text-base font-light tracking-tight text-muted transition-colors ${atMax ? "cursor-not-allowed opacity-30" : "hover:border-fg hover:text-fg"}`}
          >
            <Plus size={14} weight="regular" />
            {q.allowOther.label}
          </button>
        )}
      </div>
      {clashWarning && <p className="text-sm font-light text-red-500">{clashWarning}</p>}
      {q.allowOther && otherIndices.length > 0 && (
        <div className="flex flex-col gap-2">
          {otherIndices.map((vi, n) => {
            const raw = value[vi]
            const text = raw.startsWith("other:") ? raw.slice("other:".length) : ""
            const isLast = n === otherIndices.length - 1
            return (
              <div key={vi} className="group flex items-center gap-3">
                <input
                  ref={isLast ? lastOtherRef : undefined}
                  type="text"
                  value={text}
                  placeholder={q.allowOther!.placeholder}
                  onChange={(e) => setOtherAt(vi, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      if (text.trim() !== "") addOther()
                    }
                  }}
                  className="flex-1 border-b border-rule bg-transparent pb-1 text-lg font-light tracking-tight text-fg placeholder:text-muted focus:outline-none"
                />
                <button
                  onClick={() => removeAt(vi)}
                  aria-label="Remove"
                  className="text-muted opacity-0 transition-opacity group-hover:opacity-100 hover:text-fg"
                >
                  <X size={16} weight="regular" />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export function OfferingsField({
  value,
  onChange,
}: {
  q: Extract<Question, { kind: "offerings" }>
  value: Offering[]
  onChange: (v: Offering[]) => void
}) {
  const update = (id: string, patch: Partial<Offering>) =>
    onChange(value.map((it) => (it.id === id ? { ...it, ...patch } : it)))
  const remove = (id: string) => onChange(value.filter((it) => it.id !== id))
  const add = () =>
    onChange([...value, { id: crypto.randomUUID(), name: "", description: "", kind: "service" }])

  return (
    <div className="flex flex-col gap-4">
      {value.map((item, i) => (
        <div
          key={item.id}
          className="group relative flex flex-col gap-3 border border-rule px-4 py-4"
        >
          <div className="flex items-baseline gap-3">
            <span className="w-6 font-mono text-xs tracking-widest text-muted uppercase">
              {String(i + 1).padStart(2, "0")}
            </span>
            <input
              autoFocus={i === value.length - 1}
              type="text"
              value={item.name}
              placeholder={item.kind === "product" ? "Product name" : "Service name"}
              onChange={(e) => update(item.id, { name: e.target.value })}
              className="flex-1 border-b border-rule bg-transparent pb-1 text-lg font-light tracking-tight text-fg placeholder:text-muted focus:outline-none"
            />
            <button
              onClick={() => remove(item.id)}
              aria-label="Remove"
              className="text-muted opacity-0 transition-opacity group-hover:opacity-100 hover:text-fg"
            >
              <X size={16} weight="regular" />
            </button>
          </div>
          <textarea
            value={item.description}
            placeholder="Description (optional)"
            onChange={(e) => update(item.id, { description: e.target.value })}
            rows={2}
            className="ml-9 w-[calc(100%-2.25rem)] resize-none bg-transparent pb-1 text-sm font-light text-fg placeholder:text-muted focus:outline-none"
          />
          <div className="ml-9 flex gap-2">
            {(["service", "product"] as const).map((k) => {
              const active = item.kind === k
              return (
                <button
                  key={k}
                  onClick={() => update(item.id, { kind: k })}
                  className={`border px-3 py-1 font-mono text-xs tracking-widest uppercase transition-colors ${
                    active
                      ? "border-fg bg-fg text-bg"
                      : "border-rule text-muted hover:border-fg hover:text-fg"
                  }`}
                >
                  {k}
                </button>
              )
            })}
          </div>
        </div>
      ))}
      <button
        onClick={add}
        className="flex items-center gap-2 self-start border border-rule px-4 py-2 font-mono text-xs tracking-widest text-muted uppercase transition-colors hover:border-fg hover:text-fg"
      >
        <Plus size={14} weight="regular" />
        Add {value.length === 0 ? "service or product" : "another"}
      </button>
    </div>
  )
}

export function LinksField({
  q,
  value,
  onChange,
}: {
  q: Extract<Question, { kind: "links" }>
  value: LinksValue
  onChange: (v: LinksValue) => void
}) {
  const links = value.links
  const files = value.files
  const lastInputRef = useRef<HTMLInputElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const [pending, setPending] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const generateUploadUrl = useMutation(api.files.generateUploadUrl)

  const setLink = (i: number, v: string) =>
    onChange({ ...value, links: links.map((l, idx) => (idx === i ? v : l)) })
  const addLink = () => {
    onChange({ ...value, links: [...links, ""] })
    setTimeout(() => lastInputRef.current?.focus(), 0)
  }
  const removeLink = (i: number) =>
    onChange({ ...value, links: links.filter((_, idx) => idx !== i) })

  const uploadOne = async (file: File): Promise<UploadedFile> => {
    const uploadUrl = await generateUploadUrl()
    const res = await fetch(uploadUrl, {
      method: "POST",
      // Many files the browser can't classify (e.g. Adobe .ai) report an empty
      // file.type. An empty Content-Type header is rejected by the storage
      // endpoint with HTTP 400, so fall back to a generic binary type.
      headers: { "Content-Type": file.type || "application/octet-stream" },
      body: file,
    })
    if (!res.ok) throw new Error(`Upload failed: ${res.status}`)
    const { storageId } = (await res.json()) as { storageId: string }
    return {
      key: `${file.name}-${file.size}-${file.lastModified}`,
      name: file.name,
      type: file.type,
      size: file.size,
      storageId,
    }
  }

  const handleFiles = async (incoming: FileList | null) => {
    if (!incoming || incoming.length === 0) return
    setError(null)
    const list = Array.from(incoming)
    setPending((p) => p + list.length)
    try {
      const uploaded = await Promise.all(list.map(uploadOne))
      onChange({ ...value, files: [...files, ...uploaded] })
    } catch (e: any) {
      setError(e?.message ?? "Upload failed")
    } finally {
      setPending((p) => p - list.length)
    }
  }
  const removeFile = (i: number) =>
    onChange({ ...value, files: files.filter((_, idx) => idx !== i) })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        {links.map((link, i) => (
          <div key={i} className="group flex items-center gap-3">
            <span className="w-6 font-mono text-xs tracking-widest text-muted uppercase">
              {String(i + 1).padStart(2, "0")}
            </span>
            <input
              ref={i === links.length - 1 ? lastInputRef : undefined}
              autoFocus={i === links.length - 1 && link === ""}
              type="url"
              value={link}
              placeholder={q.placeholder ?? "https://…"}
              onChange={(e) => setLink(i, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  if (link.trim() !== "") addLink()
                }
              }}
              className="flex-1 border-b border-rule bg-transparent pb-1 text-lg font-light tracking-tight text-fg placeholder:text-muted focus:outline-none"
            />
            <button
              onClick={() => removeLink(i)}
              aria-label="Remove link"
              className="text-muted opacity-0 transition-opacity group-hover:opacity-100 hover:text-fg"
            >
              <X size={16} weight="regular" />
            </button>
          </div>
        ))}
        <button
          onClick={addLink}
          className="flex items-center gap-2 self-start border border-rule px-4 py-2 font-mono text-xs tracking-widest text-muted uppercase transition-colors hover:border-fg hover:text-fg"
        >
          <Plus size={14} weight="regular" />
          Add link
        </button>
      </div>

      {q.uploads && (
        <div className="flex flex-col gap-3">
          {q.uploads.hint && (
            <div className="font-mono text-xs tracking-widest text-muted uppercase">
              {q.uploads.hint}
            </div>
          )}
          <div
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault()
              handleFiles(e.dataTransfer.files)
            }}
            className="cursor-pointer border border-rule px-6 py-8 text-center transition-colors hover:border-fg"
          >
            <div className="flex flex-col items-center gap-3 text-muted">
              <UploadSimple size={20} weight="regular" />
              <span className="font-mono text-xs tracking-widest uppercase">
                {pending > 0 ? `Uploading ${pending}...` : "Drop files or click to browse"}
              </span>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept={q.uploads.accept}
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </div>
          {error && (
            <div className="font-mono text-xs tracking-widest text-fg uppercase">{error}</div>
          )}
          {files.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {files.map((f, i) => (
                <div key={f.key} className="group relative aspect-square">
                  {f.type.startsWith("image/") ? (
                    <StoredImage
                      storageId={f.storageId}
                      alt={f.name}
                      className="h-full w-full border border-rule object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center border border-rule px-2 text-center font-mono text-xs tracking-widest break-all text-muted uppercase">
                      {f.name}
                    </div>
                  )}
                  <button
                    onClick={() => removeFile(i)}
                    className="absolute top-1 right-1 bg-fg px-2 py-0.5 font-mono text-xs tracking-widest text-bg uppercase opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

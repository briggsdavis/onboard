import { useEffect, useRef, useState } from "react"
import { Plus, X, UploadSimple } from "@phosphor-icons/react"
import { HexColorPicker, HexColorInput } from "react-colorful"
import { useMutation, useQuery } from "convex/react"
import { api } from "../convex/_generated/api"
import type { Id } from "../convex/_generated/dataModel"
import type { ListItem, Question, RangeValue, UploadedFile } from "./questions"

function StoredImage({
  storageId,
  alt,
  className,
}: {
  storageId: string
  alt: string
  className?: string
}) {
  const url = useQuery(api.files.getUrl, { storageId: storageId as Id<"_storage"> })
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
      className="absolute left-0 top-full z-40 mt-3 flex flex-col gap-3 border border-rule bg-bg p-3"
    >
      <HexColorPicker color={draft} onChange={setDraft} />
      <div className="flex items-center gap-2">
        <span className="font-mono text-xs uppercase tracking-widest text-muted">#</span>
        <HexColorInput
          color={draft}
          onChange={setDraft}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit()
          }}
          prefixed={false}
          className="font-mono w-24 border-b border-rule bg-transparent pb-1 text-sm uppercase text-fg focus:outline-none"
        />
        <button
          onClick={commit}
          className="font-mono ml-auto border border-rule px-3 py-1 text-xs uppercase tracking-widest text-fg transition-colors hover:bg-fg hover:text-bg"
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
  const add = (c: string) => {
    if (value.includes(c) || value.length >= max) return
    onChange([...value, c])
  }
  const remove = (c: string) => onChange(value.filter((x) => x !== c))

  return (
    <div className="flex flex-col gap-8">
      <div className="relative flex flex-wrap gap-3">
        {value.map((c) => (
          <Swatch key={c} color={c} onClick={() => remove(c)} size="lg">
            <span className="font-mono absolute inset-x-0 -bottom-5 text-center text-xs uppercase tracking-widest text-muted">
              {c}
            </span>
            <span className="absolute inset-0 flex mix-blend-difference items-center justify-center text-fg opacity-0 transition-opacity group-hover:opacity-100">
              <X size={18} weight="regular" />
            </span>
          </Swatch>
        ))}
        {value.length < max && (
          <button
            onClick={() => setPicking((p) => !p)}
            className="flex h-16 w-16 items-center justify-center border border-rule text-muted transition-colors hover:border-fg hover:text-fg"
          >
            <Plus size={20} weight="regular" />
          </button>
        )}
        {picking && <ColorPickerPopover onAdd={add} onClose={() => setPicking(false)} />}
      </div>
      {suggested && suggested.length > 0 && (
        <div>
          <div className="font-mono mb-3 text-xs uppercase tracking-widest text-muted">
            From your logo
          </div>
          <div className="flex flex-wrap gap-2">
            {suggested.map((c) => (
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
      )}
      <div>
        <div className="font-mono mb-3 text-xs uppercase tracking-widest text-muted">Starter</div>
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
      headers: { "Content-Type": file.type },
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
    const list = Array.from(files)
    setPending((p) => p + list.length)
    try {
      const uploaded = await Promise.all(list.map(uploadOne))
      onChange(q.multiple ? [...value, ...uploaded] : uploaded.slice(0, 1))
    } catch (e: any) {
      setError(e?.message ?? "Upload failed")
    } finally {
      setPending((p) => p - list.length)
    }
  }
  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i))

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
          <span className="font-mono text-xs uppercase tracking-widest">
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
      {error && <div className="font-mono text-xs uppercase tracking-widest text-fg">{error}</div>}
      {value.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {value.map((f, i) => (
            <div key={f.key} className="group relative aspect-square">
              {f.type.startsWith("image/") ? (
                <StoredImage
                  storageId={f.storageId}
                  alt={f.name}
                  className="h-full w-full border border-rule object-cover"
                />
              ) : (
                <div className="font-mono flex h-full w-full items-center justify-center border border-rule px-2 text-center text-xs uppercase tracking-widest text-muted break-all">
                  {f.name}
                </div>
              )}
              <button
                onClick={() => remove(i)}
                className="font-mono absolute right-1 top-1 bg-fg px-2 py-0.5 text-xs uppercase tracking-widest text-bg opacity-0 transition-opacity group-hover:opacity-100"
              >
                remove
              </button>
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
      <div className="flex items-baseline justify-between font-mono text-xs uppercase tracking-widest text-muted">
        <span className="text-fg">{formatNumber(lo, q.format)}</span>
        <span className="text-fg">{formatNumber(hi, q.format)}</span>
      </div>
      <div className="relative h-10 select-none touch-none px-2">
        <div
          ref={trackRef}
          onPointerDown={onTrackPointerDown}
          className="relative h-full cursor-pointer"
        >
          <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-rule" />
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
      <div className="flex justify-between font-mono text-xs uppercase tracking-widest text-muted">
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
            <span className="font-mono w-6 text-xs uppercase tracking-widest text-muted">
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
        className="flex items-center gap-2 self-start border border-rule px-4 py-2 font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:border-fg hover:text-fg"
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
  const toggle = (v: string) =>
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v])
  return (
    <div className="flex flex-wrap gap-2">
      {q.options.map((opt) => {
        const active = value.includes(opt.value)
        return (
          <button
            key={opt.value}
            onClick={() => toggle(opt.value)}
            className={`border px-4 py-2 text-base font-light tracking-tight transition-colors ${
              active
                ? "border-fg bg-fg text-bg"
                : "border-rule text-muted hover:border-fg hover:text-fg"
            }`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

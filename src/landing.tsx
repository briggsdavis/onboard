import { ArrowRight } from "@phosphor-icons/react"

const FG = "#ffffff"
const MUTED = "#6b6b6b"
const RULE = "#1f1f1f"
const MONO = "Geist Mono Variable, ui-monospace, monospace"
const SANS = "Geist Variable, sans-serif"

const QUESTIONS = [
  "What is the name of your business?",
  "What do you sell?",
  "Who is it for?",
  "Pick a vibe.",
  "How much branding do you have?",
  "Upload your logo.",
  "Choose your colors.",
]

function LandingFormGraphic() {
  const n = QUESTIONS.length
  const dur = 10
  const step = 1 / n
  const resetAt = 0.96

  return (
    <svg
      viewBox="0 0 260 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="w-full h-full max-w-[488px] max-h-[488px]"
    >
      {QUESTIONS.map((label, i) => {
        const rowY = 28 + i * 32
        const boxY = rowY - 10

        const s = i * step
        const tickAt = s + 0.07
        const doneAt = Math.min((i + 1) * step, resetAt)

        // keyTimes: must be strictly increasing, from 0 to 1
        const kts: number[] = [0]
        if (i > 0) {
          kts.push(+(s - 0.01).toFixed(4))
          kts.push(+(s + 0.02).toFixed(4))
        }
        kts.push(+(tickAt).toFixed(4))
        kts.push(+(tickAt + 0.04).toFixed(4))
        if (doneAt > tickAt + 0.05) kts.push(+(doneAt).toFixed(4))
        if (resetAt > doneAt + 0.01) kts.push(+(resetAt).toFixed(4))
        kts.push(1)

        // Deduplicate and ensure strictly increasing
        const cleanKts = kts.filter((v, idx) => idx === 0 || v > kts[idx - 1])

        const textVals = cleanKts.map((t) => {
          if (t < s - 0.005) return 0.18          // future
          if (t < tickAt + 0.03) return 0.85      // active
          if (t < resetAt - 0.005) return 0.45    // done
          return 0.18                             // reset
        })

        const checkVals = cleanKts.map((t) => {
          if (t < tickAt + 0.03) return 0
          if (t < resetAt - 0.005) return 1
          return 0
        })

        const ktsStr = cleanKts.join(";")
        const textStr = textVals.join(";")
        const checkStr = checkVals.join(";")

        return (
          <g key={i}>
            {/* Checkbox outline */}
            <rect x="30" y={boxY} width="12" height="12" rx="2"
              stroke={MUTED} strokeWidth="0.75" fill="none" />

            {/* Checkbox fill */}
            <rect x="30" y={boxY} width="12" height="12" rx="2" fill={FG} opacity="0">
              <animate attributeName="opacity" values={checkStr}
                keyTimes={ktsStr} dur={`${dur}s`} repeatCount="indefinite" />
            </rect>

            {/* Checkmark */}
            <polyline
              points={`${33},${boxY + 6} ${36},${boxY + 9} ${40},${boxY + 3}`}
              stroke="#000" strokeWidth="1.5" fill="none"
              strokeLinecap="round" strokeLinejoin="round" opacity="0"
            >
              <animate attributeName="opacity" values={checkStr}
                keyTimes={ktsStr} dur={`${dur}s`} repeatCount="indefinite" />
            </polyline>

            {/* Question number */}
            <text x="50" y={rowY} fontFamily={MONO} fontSize="7" fill={MUTED}
              letterSpacing="1" opacity="0">
              {String(i + 1).padStart(2, "0")}
              <animate attributeName="opacity" values={textVals.map(v => v * 0.7).join(";")}
                keyTimes={ktsStr} dur={`${dur}s`} repeatCount="indefinite" />
            </text>

            {/* Question text */}
            <text x="66" y={rowY} fontFamily={SANS} fontSize="8.5" fontWeight="200"
              fill={FG} opacity="0">
              {label}
              <animate attributeName="opacity" values={textStr}
                keyTimes={ktsStr} dur={`${dur}s`} repeatCount="indefinite" />
            </text>

            {/* Divider */}
            <line x1="30" y1={rowY + 10} x2="230" y2={rowY + 10}
              stroke={RULE} strokeWidth="0.5" />
          </g>
        )
      })}
    </svg>
  )
}

export function LandingPage({
  hasProgress,
  onContinue,
  onStartNew,
}: {
  hasProgress: boolean
  onContinue: () => void
  onStartNew: () => void
}) {
  return (
    <main className="flex min-h-screen">
      {/* Left: message + actions */}
      <div className="flex w-full flex-col justify-center px-8 py-16 lg:w-1/2 lg:px-16">
        <div className="mx-auto w-full max-w-sm flex flex-col gap-10">
          <h1 className="text-4xl font-light tracking-tight sm:text-5xl">
            We're so glad you're here, and we can't wait to get started.
          </h1>
          <div className="flex flex-col items-start gap-5">
            <button
              onClick={onContinue}
              className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-fg transition-opacity hover:opacity-70"
            >
              {hasProgress ? "Continue questionnaire" : "Begin questionnaire"}
              <ArrowRight size={14} />
            </button>
            {hasProgress && (
              <button
                onClick={onStartNew}
                className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted transition-opacity hover:opacity-70"
              >
                Start new
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Right: checklist animation */}
      <aside className="hidden lg:flex lg:w-1/2 items-center justify-center border-l border-rule">
        <div className="flex items-center justify-center p-8 w-full h-full">
          <LandingFormGraphic />
        </div>
      </aside>
    </main>
  )
}

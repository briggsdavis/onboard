import { ArrowRight } from "@phosphor-icons/react"

const FG = "#ffffff"
const MUTED = "#6b6b6b"
const RULE = "#1f1f1f"
const MONO = "Geist Mono Variable, ui-monospace, monospace"

function LandingBackground() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* Fine static dot grid */}
        <pattern id="lbg-fine" width="28" height="28" patternUnits="userSpaceOnUse">
          <circle cx="14" cy="14" r="0.65" fill="#ffffff" opacity="0.05" />
        </pattern>
        {/* Sparse pulsing accent dots */}
        <pattern id="lbg-pulse" width="112" height="112" patternUnits="userSpaceOnUse">
          <circle cx="56" cy="56" r="1.2" fill="#ffffff">
            <animate attributeName="opacity" values="0;0.12;0" dur="5s" repeatCount="indefinite" />
          </circle>
          <circle cx="0" cy="0" r="0.9" fill="#ffffff">
            <animate attributeName="opacity" values="0;0.08;0" dur="5s" begin="1.8s" repeatCount="indefinite" />
          </circle>
          <circle cx="112" cy="0" r="0.9" fill="#ffffff">
            <animate attributeName="opacity" values="0;0.08;0" dur="5s" begin="3.6s" repeatCount="indefinite" />
          </circle>
          <circle cx="0" cy="112" r="0.9" fill="#ffffff">
            <animate attributeName="opacity" values="0;0.08;0" dur="5s" begin="0.9s" repeatCount="indefinite" />
          </circle>
          <circle cx="112" cy="112" r="0.9" fill="#ffffff">
            <animate attributeName="opacity" values="0;0.08;0" dur="5s" begin="2.7s" repeatCount="indefinite" />
          </circle>
        </pattern>
        {/* Slow diagonal sweep line */}
        <pattern id="lbg-line" width="200" height="200" patternUnits="userSpaceOnUse">
          <line x1="0" y1="200" x2="200" y2="0" stroke="#ffffff" strokeWidth="0.5" opacity="0">
            <animate attributeName="opacity" values="0;0.04;0" dur="8s" repeatCount="indefinite" />
          </line>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#lbg-fine)" />
      <rect width="100%" height="100%" fill="url(#lbg-pulse)" />
      <rect width="100%" height="100%" fill="url(#lbg-line)" />
    </svg>
  )
}

function LandingFormGraphic() {
  const dur = 9

  return (
    <svg
      viewBox="0 0 260 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="w-full h-full max-w-[488px] max-h-[488px]"
    >
      {/* ── Phase 1 (0–30%): text field being typed ── */}
      <g>
        <animate
          attributeName="opacity"
          values="0;1;1;0;0;0;0"
          keyTimes="0;0.04;0.26;0.30;0.5;0.8;1"
          dur={`${dur}s`} repeatCount="indefinite"
        />
        <text x="40" y="88" fontFamily={MONO} fontSize="7" fill={MUTED} letterSpacing="2">
          01 — BUSINESS NAME
        </text>
        <text
          x="40" y="132"
          fontFamily="Geist Variable, sans-serif"
          fontSize="30" fontWeight="200" fill={FG} letterSpacing="-0.5"
        >
          Cedar &amp; Stone
          <animate
            attributeName="opacity"
            values="0;0;1;1;0;0;0"
            keyTimes="0;0.08;0.15;0.26;0.30;0.5;1"
            dur={`${dur}s`} repeatCount="indefinite"
          />
        </text>
        <line x1="40" y1="142" x2="220" y2="142" stroke={RULE} strokeWidth="1" />

        {/* Typing cursor */}
        <rect y="104" width="2" height="28" fill={FG}>
          <animate
            attributeName="x"
            values="40;40;194;194"
            keyTimes="0;0.04;0.15;1"
            dur={`${dur}s`} repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="1;1;1;0;1;0;1;0;0;0"
            keyTimes="0;0.15;0.17;0.18;0.20;0.21;0.23;0.25;0.30;1"
            dur={`${dur}s`} repeatCount="indefinite"
          />
        </rect>

        <text x="40" y="170" fontFamily={MONO} fontSize="7" fill={MUTED} letterSpacing="2" opacity="0">
          NEXT →
          <animate
            attributeName="opacity"
            values="0;0;0;0.45;0.45;0;0"
            keyTimes="0;0.08;0.19;0.22;0.26;0.30;1"
            dur={`${dur}s`} repeatCount="indefinite"
          />
        </text>
      </g>

      {/* ── Phase 2 (33–65%): multi-select options ── */}
      <g>
        <animate
          attributeName="opacity"
          values="0;0;0;1;1;0;0"
          keyTimes="0;0.30;0.35;0.38;0.62;0.66;1"
          dur={`${dur}s`} repeatCount="indefinite"
        />
        <text x="40" y="76" fontFamily={MONO} fontSize="7" fill={MUTED} letterSpacing="2">
          05 — BRANDING
        </text>

        {([
          { label: "Logo only",  y: 106, checked: false },
          { label: "Some ideas", y: 136, checked: true  },
          { label: "Full kit",   y: 166, checked: false },
        ] as const).map((opt, i) => {
          const appear = 0.38 + i * 0.05
          return (
            <g key={opt.label}>
              <rect
                x="40" y={opt.y - 11} width="13" height="13" rx="2"
                stroke={opt.checked ? FG : MUTED} strokeWidth="1" fill="none"
              />
              {opt.checked && (
                <>
                  <rect x="40" y={opt.y - 11} width="13" height="13" rx="2" fill={FG} opacity="0">
                    <animate
                      attributeName="opacity"
                      values={`0;0;0;0;0.95;0.95;0;0`}
                      keyTimes={`0;0.30;0.35;${appear};${appear + 0.04};0.62;0.66;1`}
                      dur={`${dur}s`} repeatCount="indefinite"
                    />
                  </rect>
                  <polyline
                    points={`${43},${opt.y - 4} ${46},${opt.y - 1} ${51},${opt.y - 8}`}
                    stroke="#000" strokeWidth="1.5" fill="none"
                    strokeLinecap="round" strokeLinejoin="round" opacity="0"
                  >
                    <animate
                      attributeName="opacity"
                      values={`0;0;0;0;0.95;0.95;0;0`}
                      keyTimes={`0;0.30;0.35;${appear};${appear + 0.04};0.62;0.66;1`}
                      dur={`${dur}s`} repeatCount="indefinite"
                    />
                  </polyline>
                </>
              )}
              <text
                x="61" y={opt.y}
                fontFamily="Geist Variable, sans-serif"
                fontSize="13" fontWeight="200"
                fill={opt.checked ? FG : MUTED}
                opacity="0"
              >
                {opt.label}
                <animate
                  attributeName="opacity"
                  values={`0;0;0;0;${opt.checked ? 0.9 : 0.45};${opt.checked ? 0.9 : 0.45};0;0`}
                  keyTimes={`0;0.30;0.35;${appear};${appear + 0.04};0.62;0.66;1`}
                  dur={`${dur}s`} repeatCount="indefinite"
                />
              </text>
            </g>
          )
        })}
      </g>

      {/* ── Phase 3 (68–97%): browser wireframe loading ── */}
      <g>
        <animate
          attributeName="opacity"
          values="0;0;0;0;1;1;0"
          keyTimes="0;0.30;0.62;0.68;0.71;0.95;1"
          dur={`${dur}s`} repeatCount="indefinite"
        />
        <text x="40" y="76" fontFamily={MONO} fontSize="7" fill={MUTED} letterSpacing="2">
          09 — INSPIRATION
        </text>
        <rect x="40" y="88" width="180" height="108" stroke={RULE} strokeWidth="1" rx="2" />
        <rect x="52" y="97" width="120" height="9" stroke={RULE} strokeWidth="1" rx="1" />
        <rect x="56" y="99" width="0" height="5" fill={RULE} rx="1">
          <animate
            attributeName="width"
            values="0;0;0;0;0;0;72;72;0"
            keyTimes="0;0.30;0.62;0.68;0.71;0.75;0.88;0.95;1"
            dur={`${dur}s`} repeatCount="indefinite"
          />
        </rect>
        {[116, 130, 144, 158, 172].map((y, i) => (
          <rect key={y} x="52" y={y} width={[140, 100, 120, 75, 90][i]} height="5" fill={RULE} rx="1" opacity="0">
            <animate
              attributeName="opacity"
              values={`0;0;0;0;0;0;${0.25 - i * 0.03};${0.25 - i * 0.03};0`}
              keyTimes={`0;0.30;0.62;0.68;0.71;${0.76 + i * 0.025};${0.82 + i * 0.025};0.95;1`}
              dur={`${dur}s`} repeatCount="indefinite"
            />
          </rect>
        ))}
      </g>

      {/* ── Progress bar (always visible, advances through phases) ── */}
      <rect x="40" y="242" width="180" height="1.5" fill={RULE} />
      <rect x="40" y="242" width="0" height="1.5" fill={FG} rx="0.5">
        <animate
          attributeName="width"
          values="0;60;60;120;120;172;172;0"
          keyTimes="0;0.26;0.32;0.62;0.68;0.95;0.99;1"
          dur={`${dur}s`} repeatCount="indefinite"
          calcMode="spline"
          keySplines="0.4 0 0.2 1;1 0 1 0;0.4 0 0.2 1;1 0 1 0;0.4 0 0.2 1;1 0 1 0;1 0 1 0"
        />
      </rect>
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
    <main className="relative flex min-h-screen overflow-hidden">
      <LandingBackground />

      {/* Left: message + actions */}
      <div className="relative z-10 flex w-full flex-col justify-center px-8 py-16 lg:w-1/2 lg:px-16">
        <div className="mx-auto w-full max-w-sm flex flex-col gap-10">
          <p className="text-lg font-light leading-relaxed text-fg max-w-xs">
            Tell us about your brand — the more we know, the better we can bring your vision to life.
          </p>
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

      {/* Right: form animation */}
      <aside className="hidden lg:flex lg:w-1/2 items-center justify-center border-l border-rule relative z-10">
        <div className="flex items-center justify-center p-8 w-full h-full">
          <LandingFormGraphic />
        </div>
      </aside>
    </main>
  )
}

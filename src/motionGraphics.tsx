// Motion graphics for each onboarding question
// Dark minimal theme: white on black, gray accents

const FG = "#ffffff"
const MUTED = "#6b6b6b"
const RULE = "#1f1f1f"
const MONO = "Geist Mono Variable, ui-monospace, monospace"

function Wrap({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 260 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="w-full h-full max-w-[390px] max-h-[390px]"
    >
      {children}
    </svg>
  )
}

// Q1: Business name — blinking cursor on a nameplate baseline
function G01() {
  return (
    <Wrap>
      <line x1="40" y1="148" x2="220" y2="148" stroke={RULE} strokeWidth="1" />
      <text x="40" y="140" fontFamily={MONO} fontSize="8" fill={MUTED} letterSpacing="3">
        BUSINESS NAME
      </text>
      <text x="40" y="138" fontFamily="Geist Variable, sans-serif" fontSize="36" fontWeight="200" fill={FG} letterSpacing="-1">
        <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.1;0.25;0.8;1" dur="4s" repeatCount="indefinite" />
        Cedar &amp; Stone
      </text>
      {/* Blinking cursor */}
      <rect x="42" y="112" width="2" height="30" fill={FG}>
        <animate attributeName="opacity" values="1;1;0;0" keyTimes="0;0.45;0.5;1" dur="1s" repeatCount="indefinite" />
        <animate attributeName="x" values="42;42;196;196" keyTimes="0;0.1;0.6;1" dur="4s" repeatCount="indefinite" />
      </rect>
    </Wrap>
  )
}

// Q2: Offerings (services/products) — three shapes orbiting slowly
function G02() {
  return (
    <Wrap>
      {/* Orbit ring */}
      <circle cx="130" cy="130" r="72" stroke={RULE} strokeWidth="1" strokeDasharray="3 5" />
      {/* Center dot */}
      <circle cx="130" cy="130" r="4" fill={MUTED} />
      {/* Orbiting shapes group */}
      <g>
        <animateTransform attributeName="transform" type="rotate" values="0 130 130;360 130 130" dur="14s" repeatCount="indefinite" />
        {/* Circle — service */}
        <circle cx="130" cy="58" r="11" stroke={FG} strokeWidth="1.5" />
        {/* Square — product */}
        <rect x="183" y="157" width="22" height="22" stroke={FG} strokeWidth="1.5" />
        {/* Triangle — both */}
        <polygon points="57,172 68,151 79,172" stroke={FG} strokeWidth="1.5" />
      </g>
    </Wrap>
  )
}

// Q3: Audience — bullseye rings pulsing outward
function G03() {
  return (
    <Wrap>
      <circle cx="130" cy="130" r="80" stroke={RULE} strokeWidth="1" />
      <circle cx="130" cy="130" r="54" stroke={RULE} strokeWidth="1" />
      <circle cx="130" cy="130" r="28" stroke={RULE} strokeWidth="1" />
      {/* Pulse wave 1 */}
      <circle cx="130" cy="130" r="6" stroke={FG} strokeWidth="1" opacity="0">
        <animate attributeName="r" values="6;82" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.9;0" dur="3s" repeatCount="indefinite" />
      </circle>
      {/* Pulse wave 2 */}
      <circle cx="130" cy="130" r="6" stroke={FG} strokeWidth="1" opacity="0">
        <animate attributeName="r" values="6;82" dur="3s" begin="1s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.9;0" dur="3s" begin="1s" repeatCount="indefinite" />
      </circle>
      {/* Pulse wave 3 */}
      <circle cx="130" cy="130" r="6" stroke={FG} strokeWidth="1" opacity="0">
        <animate attributeName="r" values="6;82" dur="3s" begin="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.9;0" dur="3s" begin="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="130" cy="130" r="6" fill={FG} />
    </Wrap>
  )
}

// Q4: Vibe — a shape that morphs through different aesthetic "feels"
function G04() {
  // We animate the shape's appearance via stroke-dasharray cycles
  // representing editorial→brutalist→playful→luxury→organic→technical
  const labels = ["EDITORIAL", "BRUTALIST", "PLAYFUL", "LUXURY", "ORGANIC", "TECHNICAL"]
  const n = labels.length
  const dur = 7.2 // total cycle = 1.2s per vibe

  return (
    <Wrap>
      {/* Large morphing rect */}
      <rect x="55" y="65" width="150" height="130" stroke={FG} strokeWidth="1.5" rx="0">
        <animate
          attributeName="rx"
          values="0;0;65;0;20;0"
          keyTimes="0;0.18;0.35;0.52;0.68;1"
          dur={`${dur}s`}
          repeatCount="indefinite"
        />
        <animate
          attributeName="strokeDasharray"
          values="none;4 4;none;none;none;3 8"
          keyTimes="0;0.18;0.35;0.52;0.68;1"
          dur={`${dur}s`}
          repeatCount="indefinite"
        />
        <animate
          attributeName="strokeWidth"
          values="1.5;3;1.5;0.5;1.5;1"
          keyTimes="0;0.18;0.35;0.52;0.68;1"
          dur={`${dur}s`}
          repeatCount="indefinite"
        />
      </rect>
      {/* Vibe label cycling */}
      {labels.map((label, i) => {
        const start = i / n
        const mid = (i + 0.4) / n
        const end = (i + 0.7) / n
        return (
          <text
            key={label}
            x="130"
            y="222"
            textAnchor="middle"
            fontFamily={MONO}
            fontSize="8"
            fill={MUTED}
            letterSpacing="3"
            opacity="0"
          >
            {label}
            <animate
              attributeName="opacity"
              values={`0;0;1;1;0`}
              keyTimes={`0;${start};${(start + mid) / 2};${mid};${end}`}
              dur={`${dur}s`}
              repeatCount="indefinite"
            />
          </text>
        )
      })}
    </Wrap>
  )
}

// Q5: Branding — a progress bar filling through 4 levels
function G05() {
  return (
    <Wrap>
      {/* Track */}
      <rect x="40" y="118" width="180" height="2" fill={RULE} />
      {/* Fill bar */}
      <rect x="40" y="118" width="0" height="2" fill={FG}>
        <animate
          attributeName="width"
          values="0;0;45;45;90;90;135;135;180;180;0"
          keyTimes="0;0.05;0.15;0.3;0.4;0.55;0.65;0.8;0.9;0.97;1"
          dur="5s"
          repeatCount="indefinite"
        />
      </rect>
      {/* Level ticks */}
      {[0, 45, 90, 135, 180].map((x, i) => (
        <rect key={i} x={40 + x} y="114" width="1" height="10" fill={RULE} />
      ))}
      {/* Level labels */}
      {["None", "Logo", "Some", "Full"].map((label, i) => (
        <text key={label} x={40 + i * 45 + 22} y="108" textAnchor="middle" fontFamily={MONO} fontSize="7" fill={MUTED} letterSpacing="1">
          {label}
        </text>
      ))}
      {/* Dot indicator */}
      <circle cx="40" cy="119" r="4" fill={FG}>
        <animate
          attributeName="cx"
          values="40;40;85;85;130;130;175;175;220;220;40"
          keyTimes="0;0.05;0.15;0.3;0.4;0.55;0.65;0.8;0.9;0.97;1"
          dur="5s"
          repeatCount="indefinite"
        />
      </circle>
    </Wrap>
  )
}

// Q6: Logo upload — geometric mark inside a frame, slowly rotating
function G06() {
  return (
    <Wrap>
      {/* Frame */}
      <rect x="65" y="65" width="130" height="130" stroke={RULE} strokeWidth="1" />
      {/* Rotating geometric mark */}
      <g>
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="0 130 130;360 130 130"
          dur="20s"
          repeatCount="indefinite"
        />
        <polygon points="130,90 158,148 102,148" stroke={FG} strokeWidth="1.5" />
        <circle cx="130" cy="130" r="22" stroke={FG} strokeWidth="1" />
      </g>
      {/* Corner accents */}
      <line x1="65" y1="75" x2="65" y2="65" stroke={FG} strokeWidth="1" />
      <line x1="65" y1="65" x2="75" y2="65" stroke={FG} strokeWidth="1" />
      <line x1="185" y1="65" x2="195" y2="65" stroke={FG} strokeWidth="1" />
      <line x1="195" y1="65" x2="195" y2="75" stroke={FG} strokeWidth="1" />
      <line x1="195" y1="185" x2="195" y2="195" stroke={FG} strokeWidth="1" />
      <line x1="185" y1="195" x2="195" y2="195" stroke={FG} strokeWidth="1" />
      <line x1="75" y1="195" x2="65" y2="195" stroke={FG} strokeWidth="1" />
      <line x1="65" y1="195" x2="65" y2="185" stroke={FG} strokeWidth="1" />
    </Wrap>
  )
}

// Q7: Colors — four circles appearing and glowing
function G07() {
  const positions = [
    { cx: 96, cy: 96 },
    { cx: 164, cy: 96 },
    { cx: 96, cy: 164 },
    { cx: 164, cy: 164 },
  ]
  const fills = [FG, MUTED, "#3a3a3a", FG]
  return (
    <Wrap>
      {positions.map((pos, i) => (
        <g key={i}>
          <circle cx={pos.cx} cy={pos.cy} r="26" stroke={RULE} strokeWidth="1" />
          <circle cx={pos.cx} cy={pos.cy} r="22" fill={fills[i]} opacity="0">
            <animate
              attributeName="opacity"
              values="0;0;0.9;0.9;0"
              keyTimes={`0;${i * 0.18};${i * 0.18 + 0.12};0.85;1`}
              dur="4s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="r"
              values="10;10;22;22;10"
              keyTimes={`0;${i * 0.18};${i * 0.18 + 0.12};0.85;1`}
              dur="4s"
              repeatCount="indefinite"
            />
          </circle>
        </g>
      ))}
    </Wrap>
  )
}

// Q8: Brand assets — stacked file rectangles that float up
function G08() {
  const files = [
    { y: 160, delay: "0s" },
    { y: 148, delay: "0.15s" },
    { y: 136, delay: "0.3s" },
  ]
  return (
    <Wrap>
      {files.map((f, i) => (
        <g key={i}>
          <rect x={60 + i * 6} y={f.y} width="130" height="90" stroke={i === 2 ? FG : MUTED} strokeWidth="1" fill="#000" opacity={i === 2 ? 1 : 0.8}>
            <animate
              attributeName="y"
              values={`${f.y};${f.y - 18};${f.y}`}
              dur="3.5s"
              begin={f.delay}
              repeatCount="indefinite"
            />
          </rect>
          {/* File content lines */}
          <line x1={68 + i * 6} y1={f.y + 18} x2={170 + i * 6} y2={f.y + 18} stroke={RULE} strokeWidth="1">
            <animate
              attributeName="y1"
              values={`${f.y + 18};${f.y};${f.y + 18}`}
              dur="3.5s"
              begin={f.delay}
              repeatCount="indefinite"
            />
            <animate
              attributeName="y2"
              values={`${f.y + 18};${f.y};${f.y + 18}`}
              dur="3.5s"
              begin={f.delay}
              repeatCount="indefinite"
            />
          </line>
        </g>
      ))}
    </Wrap>
  )
}

// Q9: Sites you like — browser wireframe skeleton loading
function G09() {
  const bars = [
    { x: 55, y: 118, w: 150 },
    { x: 55, y: 134, w: 110 },
    { x: 55, y: 150, w: 130 },
    { x: 55, y: 166, w: 80 },
  ]
  return (
    <Wrap>
      {/* Browser chrome */}
      <rect x="40" y="68" width="180" height="130" stroke={RULE} strokeWidth="1" rx="2" />
      {/* URL bar */}
      <rect x="52" y="78" width="156" height="10" stroke={RULE} strokeWidth="1" rx="2" />
      <rect x="56" y="80" width="60" height="6" fill={RULE} rx="1">
        <animate attributeName="width" values="0;60;60;0" keyTimes="0;0.3;0.8;1" dur="3s" repeatCount="indefinite" />
      </rect>
      {/* Nav dots */}
      {[44, 52, 60].map((x) => (
        <circle key={x} cx={x} cy="83" r="2" fill={RULE} />
      ))}
      {/* Content skeleton bars */}
      {bars.map((bar, i) => (
        <rect key={i} x={bar.x} y={bar.y} width="0" height="6" fill={RULE} rx="1">
          <animate
            attributeName="width"
            values={`0;0;${bar.w};${bar.w};0`}
            keyTimes={`0;${0.1 + i * 0.08};${0.25 + i * 0.08};0.85;1`}
            dur="3s"
            repeatCount="indefinite"
          />
        </rect>
      ))}
    </Wrap>
  )
}

// Q10: Competitors — scatter plot, one dot highlighted
function G10() {
  const dots = [
    { cx: 80, cy: 90 }, { cx: 120, cy: 110 }, { cx: 155, cy: 80 },
    { cx: 170, cy: 140 }, { cx: 95, cy: 160 }, { cx: 145, cy: 165 },
    { cx: 105, cy: 130 }, { cx: 180, cy: 100 },
  ]
  return (
    <Wrap>
      {/* Axes */}
      <line x1="50" y1="50" x2="50" y2="210" stroke={RULE} strokeWidth="1" />
      <line x1="50" y1="210" x2="210" y2="210" stroke={RULE} strokeWidth="1" />
      {/* All competitor dots */}
      {dots.map((d, i) => (
        <circle key={i} cx={d.cx} cy={d.cy} r="4" fill={MUTED} />
      ))}
      {/* Highlighted dot — "you" — scanning with a circle */}
      <circle cx="130" cy="130" r="4" fill={FG} />
      <circle cx="130" cy="130" r="4" stroke={FG} strokeWidth="1" fill="none">
        <animate attributeName="r" values="4;18;4" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;0;1" dur="2.5s" repeatCount="indefinite" />
      </circle>
    </Wrap>
  )
}

// Q11: Pages — site map tree drawing itself
function G11() {
  // Root → 3 children → some grandchildren
  const lineProps = (i: number) => ({
    stroke: FG,
    strokeWidth: "1" as const,
    opacity: "0" as const,
    children: (
      <animate
        attributeName="opacity"
        values="0;0;1"
        keyTimes={`0;${i * 0.07};${i * 0.07 + 0.1}`}
        dur="4s"
        repeatCount="indefinite"
      />
    ),
  })
  return (
    <Wrap>
      {/* Root */}
      <circle cx="130" cy="52" r="6" stroke={FG} strokeWidth="1.5" {...{ opacity: "0" }}>
        <animate attributeName="opacity" values="0;0;1" keyTimes="0;0;0.07" dur="4s" repeatCount="indefinite" />
      </circle>
      {/* Root → L1 lines */}
      <line x1="130" y1="58" x2="72" y2="100" {...lineProps(1)} />
      <line x1="130" y1="58" x2="130" y2="100" {...lineProps(2)} />
      <line x1="130" y1="58" x2="188" y2="100" {...lineProps(3)} />
      {/* L1 nodes */}
      {[72, 130, 188].map((cx, i) => (
        <circle key={cx} cx={cx} cy="106" r="5" stroke={FG} strokeWidth="1" opacity="0">
          <animate attributeName="opacity" values="0;0;1" keyTimes={`0;${(i + 4) * 0.07};${(i + 4) * 0.07 + 0.1}`} dur="4s" repeatCount="indefinite" />
        </circle>
      ))}
      {/* L1 → L2 lines */}
      <line x1="72" y1="111" x2="52" y2="150" {...lineProps(7)} />
      <line x1="72" y1="111" x2="92" y2="150" {...lineProps(8)} />
      <line x1="130" y1="111" x2="120" y2="150" {...lineProps(9)} />
      <line x1="130" y1="111" x2="140" y2="150" {...lineProps(10)} />
      <line x1="188" y1="111" x2="178" y2="150" {...lineProps(11)} />
      <line x1="188" y1="111" x2="198" y2="150" {...lineProps(12)} />
      {/* L2 nodes */}
      {[52, 92, 120, 140, 178, 198].map((cx, i) => (
        <circle key={cx} cx={cx} cy="155" r="4" stroke={FG} strokeWidth="1" opacity="0">
          <animate attributeName="opacity" values="0;0;1" keyTimes={`0;${(i + 13) * 0.05};${(i + 13) * 0.05 + 0.08}`} dur="4s" repeatCount="indefinite" />
        </circle>
      ))}
    </Wrap>
  )
}

// Q12: Features — grid of toggles switching on
function G12() {
  const toggles = [
    { x: 60, y: 72 }, { x: 112, y: 72 }, { x: 164, y: 72 },
    { x: 60, y: 118 }, { x: 112, y: 118 }, { x: 164, y: 118 },
    { x: 60, y: 164 }, { x: 112, y: 164 }, { x: 164, y: 164 },
  ]
  return (
    <Wrap>
      {toggles.map((t, i) => {
        const delay = (i * 0.4) % 3.6
        return (
          <g key={i}>
            {/* Track */}
            <rect x={t.x} y={t.y} width="36" height="18" rx="9" stroke={MUTED} strokeWidth="1" fill="none" />
            {/* Fill when on */}
            <rect x={t.x} y={t.y} width="36" height="18" rx="9" fill={FG} opacity="0">
              <animate
                attributeName="opacity"
                values="0;0;0;0.9;0.9;0.9;0"
                keyTimes="0;0.1;0.3;0.35;0.7;0.9;1"
                dur="3.6s"
                begin={`${delay}s`}
                repeatCount="indefinite"
              />
            </rect>
            {/* Knob */}
            <circle cx={t.x + 9} cy={t.y + 9} r="6" fill={MUTED}>
              <animate
                attributeName="cx"
                values={`${t.x + 9};${t.x + 9};${t.x + 27};${t.x + 27};${t.x + 9}`}
                keyTimes="0;0.3;0.4;0.9;1"
                dur="3.6s"
                begin={`${delay}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="fill"
                values={`${MUTED};${MUTED};#000;#000;${MUTED}`}
                keyTimes="0;0.3;0.4;0.9;1"
                dur="3.6s"
                begin={`${delay}s`}
                repeatCount="indefinite"
              />
            </circle>
          </g>
        )
      })}
    </Wrap>
  )
}

// Q13: Budget — circular arc dial filling up
function G13() {
  // circumference of r=80 ≈ 502.6
  const r = 80
  const circ = 2 * Math.PI * r
  return (
    <Wrap>
      {/* Background arc track */}
      <circle cx="130" cy="140" r={r} stroke={RULE} strokeWidth="8" strokeLinecap="round"
        strokeDasharray={`${circ * 0.75} ${circ}`}
        strokeDashoffset={circ * 0.125}
        transform="rotate(-225 130 140)"
      />
      {/* Animated fill arc */}
      <circle cx="130" cy="140" r={r} stroke={FG} strokeWidth="8" strokeLinecap="round"
        strokeDasharray={`0 ${circ}`}
        strokeDashoffset={circ * 0.125}
        transform="rotate(-225 130 140)"
      >
        <animate
          attributeName="strokeDasharray"
          values={`0 ${circ};${circ * 0.75} ${circ};${circ * 0.75} ${circ};0 ${circ}`}
          keyTimes="0;0.55;0.75;1"
          dur="4s"
          repeatCount="indefinite"
        />
      </circle>
      {/* Dollar label */}
      <text x="130" y="132" textAnchor="middle" fontFamily={MONO} fontSize="20" fontWeight="200" fill={FG} letterSpacing="-1">
        $5K
        <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.1;0.35;0.75;1" dur="4s" repeatCount="indefinite" />
      </text>
      <text x="130" y="148" textAnchor="middle" fontFamily={MONO} fontSize="7" fill={MUTED} letterSpacing="2">
        BUDGET
      </text>
    </Wrap>
  )
}

// Q14: Deadline — clock face with sweeping hand
function G14() {
  return (
    <Wrap>
      {/* Clock face */}
      <circle cx="130" cy="130" r="80" stroke={RULE} strokeWidth="1" />
      <circle cx="130" cy="130" r="72" stroke={RULE} strokeWidth="0.5" />
      {/* Hour ticks */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * 2 * Math.PI - Math.PI / 2
        const r1 = 64, r2 = 72
        return (
          <line
            key={i}
            x1={130 + r1 * Math.cos(angle)}
            y1={130 + r1 * Math.sin(angle)}
            x2={130 + r2 * Math.cos(angle)}
            y2={130 + r2 * Math.sin(angle)}
            stroke={MUTED}
            strokeWidth="1"
          />
        )
      })}
      {/* Minute hand */}
      <line x1="130" y1="130" x2="130" y2="60" stroke={FG} strokeWidth="1.5" strokeLinecap="round">
        <animateTransform attributeName="transform" type="rotate" values="0 130 130;360 130 130" dur="10s" repeatCount="indefinite" />
      </line>
      {/* Hour hand */}
      <line x1="130" y1="130" x2="130" y2="80" stroke={FG} strokeWidth="2.5" strokeLinecap="round">
        <animateTransform attributeName="transform" type="rotate" values="0 130 130;360 130 130" dur="120s" repeatCount="indefinite" />
      </line>
      {/* Center dot */}
      <circle cx="130" cy="130" r="3" fill={FG} />
    </Wrap>
  )
}

// Q15: Anything else — blank notepad lines with scanning cursor
function G15() {
  const lines = [80, 104, 128, 152, 176]
  return (
    <Wrap>
      {lines.map((y) => (
        <line key={y} x1="50" y1={y} x2="210" y2={y} stroke={RULE} strokeWidth="1" />
      ))}
      {/* Text appearing on lines */}
      {lines.slice(0, 3).map((y, i) => (
        <rect key={y} x="50" y={y - 14} height="12" width="0" fill={MUTED} rx="1" opacity="0.4">
          <animate
            attributeName="width"
            values={`0;0;${[120, 80, 95][i]};${[120, 80, 95][i]};0`}
            keyTimes={`0;${0.05 + i * 0.1};${0.25 + i * 0.1};0.8;1`}
            dur="5s"
            repeatCount="indefinite"
          />
        </rect>
      ))}
      {/* Blinking cursor on the active line */}
      <rect x="50" y="114" width="2" height="12" fill={FG}>
        <animate attributeName="x" values="50;50;50;145;145" keyTimes="0;0.04;0.25;0.4;1" dur="5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;1;0;0;1;0;1;0;1" keyTimes="0;0.22;0.23;0.35;0.36;0.44;0.45;0.52;1" dur="5s" repeatCount="indefinite" />
      </rect>
    </Wrap>
  )
}

// Q16: Questions for us — two speech bubbles alternating
function G16() {
  return (
    <Wrap>
      {/* Left bubble (us asking) */}
      <g opacity="0">
        <animate attributeName="opacity" values="0;0;1;1;0;0;0;0" keyTimes="0;0.05;0.15;0.45;0.5;0.55;0.95;1" dur="5s" repeatCount="indefinite" />
        <rect x="40" y="82" width="120" height="50" rx="8" stroke={MUTED} strokeWidth="1" />
        <polygon points="52,132 52,148 68,132" fill="#000" stroke={MUTED} strokeWidth="1" />
        <rect x="52" y="96" width="80" height="6" fill={RULE} rx="2" />
        <rect x="52" y="108" width="56" height="6" fill={RULE} rx="2" />
      </g>
      {/* Right bubble (them answering) */}
      <g opacity="0">
        <animate attributeName="opacity" values="0;0;0;0;0;1;1;0" keyTimes="0;0.05;0.45;0.5;0.55;0.65;0.9;1" dur="5s" repeatCount="indefinite" />
        <rect x="100" y="140" width="120" height="50" rx="8" stroke={FG} strokeWidth="1" />
        <polygon points="208,140 208,124 192,140" fill="#000" stroke={FG} strokeWidth="1" />
        <rect x="112" y="154" width="80" height="6" fill={MUTED} rx="2" />
        <rect x="112" y="166" width="48" height="6" fill={MUTED} rx="2" />
      </g>
    </Wrap>
  )
}

// Review screen — all dots lit up
function GReview() {
  return (
    <Wrap>
      <text x="130" y="116" textAnchor="middle" fontFamily="Geist Variable, sans-serif" fontSize="52" fontWeight="200" fill={FG}>
        ✓
        <animate attributeName="opacity" values="0;1" keyTimes="0;0.3" dur="1s" fill="freeze" />
      </text>
      <text x="130" y="148" textAnchor="middle" fontFamily={MONO} fontSize="8" fill={MUTED} letterSpacing="3">
        ALL DONE
      </text>
    </Wrap>
  )
}

const GRAPHICS = [G01, G02, G03, G04, G05, G06, G07, G08, G09, G10, G11, G12, G13, G14, G15, G16]

export function QuestionGraphic({ index, isReview }: { index: number; isReview: boolean }) {
  if (isReview) return <GReview />
  const Graphic = GRAPHICS[index] ?? G01
  return <Graphic />
}

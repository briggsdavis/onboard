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
      className="h-full max-h-[488px] w-full max-w-[488px]"
    >
      {children}
    </svg>
  )
}

// Q1: Business name — blinking cursor on a nameplate baseline
function G01() {
  return (
    <Wrap>
      {/* Label above */}
      <text x="40" y="100" fontFamily={MONO} fontSize="8" fill={MUTED} letterSpacing="3">
        BUSINESS NAME
      </text>
      {/* Name text */}
      <text
        x="40"
        y="148"
        fontFamily="Geist Variable, sans-serif"
        fontSize="36"
        fontWeight="200"
        fill={FG}
        letterSpacing="-1"
      >
        <animate
          attributeName="opacity"
          values="0;0;1;1;0"
          keyTimes="0;0.1;0.25;0.8;1"
          dur="4s"
          repeatCount="indefinite"
        />
        Cedar &amp; Stone
      </text>
      {/* Baseline */}
      <line x1="40" y1="158" x2="220" y2="158" stroke={RULE} strokeWidth="1" />
      {/* Blinking cursor */}
      <rect x="42" y="118" width="2" height="32" fill="#E84855">
        <animate
          attributeName="opacity"
          values="1;1;0;0"
          keyTimes="0;0.45;0.5;1"
          dur="1s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="x"
          values="42;42;196;196"
          keyTimes="0;0.1;0.6;1"
          dur="4s"
          repeatCount="indefinite"
        />
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
      <circle cx="130" cy="130" r="4" fill="#3B82F6" />
      {/* Orbiting shapes group */}
      <g>
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="0 130 130;360 130 130"
          dur="14s"
          repeatCount="indefinite"
        />
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
        <animate
          attributeName="opacity"
          values="0.9;0"
          dur="3s"
          begin="1s"
          repeatCount="indefinite"
        />
      </circle>
      {/* Pulse wave 3 */}
      <circle cx="130" cy="130" r="6" stroke={FG} strokeWidth="1" opacity="0">
        <animate attributeName="r" values="6;82" dur="3s" begin="2s" repeatCount="indefinite" />
        <animate
          attributeName="opacity"
          values="0.9;0"
          dur="3s"
          begin="2s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="130" cy="130" r="6" fill="#E84855" />
    </Wrap>
  )
}

// Q4: Vibe — shape morphs + per-vibe secondary elements + dynamic label entry
function G04() {
  const labels = ["EDITORIAL", "BRUTALIST", "PLAYFUL", "LUXURY", "ORGANIC", "TECHNICAL"]
  const n = labels.length
  const dur = 8.4 // 1.4s per vibe

  return (
    <Wrap>
      {/* Main morphing rect */}
      <rect x="60" y="68" width="140" height="124" stroke={FG} strokeWidth="1.5" rx="0" fill="none">
        <animate
          attributeName="rx"
          values="0;0;0;65;20;0;0"
          keyTimes="0;0.17;0.33;0.5;0.67;0.83;1"
          dur={`${dur}s`}
          repeatCount="indefinite"
        />
        <animate
          attributeName="strokeWidth"
          values="1.5;4;1.5;0.5;1.5;1;1.5"
          keyTimes="0;0.17;0.33;0.5;0.67;0.83;1"
          dur={`${dur}s`}
          repeatCount="indefinite"
        />
        <animate
          attributeName="strokeDasharray"
          values="none;none;none;none;none;2 6;none"
          keyTimes="0;0.17;0.33;0.5;0.67;0.83;1"
          dur={`${dur}s`}
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="1;1;0;0;1;1;1"
          keyTimes="0;0.3;0.33;0.48;0.52;0.67;1"
          dur={`${dur}s`}
          repeatCount="indefinite"
        />
      </rect>

      {/* EDITORIAL — two bold horizontal dividers inside the frame */}
      <line x1="60" y1="108" x2="200" y2="108" stroke={FG} strokeWidth="1" opacity="0">
        <animate
          attributeName="opacity"
          values="0.7;0;0;0;0;0;0.7"
          keyTimes="0;0.15;0.17;0.5;0.67;0.85;1"
          dur={`${dur}s`}
          repeatCount="indefinite"
        />
      </line>
      <line x1="60" y1="148" x2="200" y2="148" stroke={FG} strokeWidth="1" opacity="0">
        <animate
          attributeName="opacity"
          values="0.7;0;0;0;0;0;0.7"
          keyTimes="0;0.15;0.17;0.5;0.67;0.85;1"
          dur={`${dur}s`}
          repeatCount="indefinite"
        />
      </line>

      {/* BRUTALIST — heavy offset shadow rect */}
      <rect
        x="67"
        y="75"
        width="140"
        height="124"
        stroke={FG}
        strokeWidth="5"
        rx="0"
        fill="none"
        opacity="0"
      >
        <animate
          attributeName="opacity"
          values="0;0.5;0;0;0;0;0"
          keyTimes="0;0.17;0.32;0.5;0.67;0.83;1"
          dur={`${dur}s`}
          repeatCount="indefinite"
        />
      </rect>

      {/* PLAYFUL — scattered bouncing circles */}
      {(
        [
          { cx: 95, cy: 105, r: 16 },
          { cx: 165, cy: 93, r: 11 },
          { cx: 132, cy: 148, r: 20 },
          { cx: 78, cy: 158, r: 9 },
          { cx: 178, cy: 158, r: 13 },
        ] as const
      ).map((c, i) => (
        <circle
          key={i}
          cx={c.cx}
          cy={c.cy}
          r={0}
          stroke={["#E84855", "#3B82F6", "#10B981", "#F59E0B", "#E84855"][i]}
          strokeWidth="1.5"
          fill="none"
          opacity="0"
        >
          <animate
            attributeName="opacity"
            values={`0;0;${i % 2 === 0 ? 1 : 0.7};0;0;0;0`}
            keyTimes="0;0.31;0.38;0.5;0.67;0.83;1"
            dur={`${dur}s`}
            repeatCount="indefinite"
            begin={`${i * 0.06}s`}
          />
          <animate
            attributeName="r"
            values={`0;0;${c.r};${c.r};0;0;0`}
            keyTimes="0;0.31;0.38;0.48;0.5;0.67;1"
            dur={`${dur}s`}
            repeatCount="indefinite"
            begin={`${i * 0.06}s`}
          />
        </circle>
      ))}

      {/* LUXURY — fine parallel horizontal lines */}
      {[82, 95, 108, 121, 134, 147, 160, 173].map((y, i) => (
        <line key={y} x1="60" y1={y} x2="200" y2={y} stroke={FG} strokeWidth="0.4" opacity="0">
          <animate
            attributeName="opacity"
            values={`0;0;0;0;0.7;0;0`}
            keyTimes="0;0.17;0.33;0.5;0.58;0.67;1"
            dur={`${dur}s`}
            repeatCount="indefinite"
            begin={`${i * 0.025}s`}
          />
        </line>
      ))}

      {/* ORGANIC — two soft overlapping circles */}
      <circle cx="108" cy="128" r="0" stroke={FG} strokeWidth="1" fill="none" opacity="0">
        <animate
          attributeName="r"
          values="0;0;0;0;0;38;38;0"
          keyTimes="0;0.17;0.33;0.5;0.65;0.72;0.83;1"
          dur={`${dur}s`}
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0;0;0;0;0;1;1;0"
          keyTimes="0;0.17;0.33;0.5;0.65;0.72;0.83;1"
          dur={`${dur}s`}
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="152" cy="128" r="0" stroke={FG} strokeWidth="1" fill="none" opacity="0">
        <animate
          attributeName="r"
          values="0;0;0;0;0;38;38;0"
          keyTimes="0;0.17;0.33;0.5;0.67;0.74;0.83;1"
          dur={`${dur}s`}
          repeatCount="indefinite"
          begin="0.15s"
        />
        <animate
          attributeName="opacity"
          values="0;0;0;0;0;1;1;0"
          keyTimes="0;0.17;0.33;0.5;0.67;0.74;0.83;1"
          dur={`${dur}s`}
          repeatCount="indefinite"
          begin="0.15s"
        />
      </circle>

      {/* TECHNICAL — crosshair marks */}
      <line
        x1="130"
        y1="68"
        x2="130"
        y2="192"
        stroke={FG}
        strokeWidth="0.5"
        strokeDasharray="2 4"
        opacity="0"
      >
        <animate
          attributeName="opacity"
          values="0;0;0;0;0;0;0.5;0"
          keyTimes="0;0.17;0.33;0.5;0.67;0.83;0.9;1"
          dur={`${dur}s`}
          repeatCount="indefinite"
        />
      </line>
      <line
        x1="60"
        y1="130"
        x2="200"
        y2="130"
        stroke={FG}
        strokeWidth="0.5"
        strokeDasharray="2 4"
        opacity="0"
      >
        <animate
          attributeName="opacity"
          values="0;0;0;0;0;0;0.5;0"
          keyTimes="0;0.17;0.33;0.5;0.67;0.83;0.9;1"
          dur={`${dur}s`}
          repeatCount="indefinite"
        />
      </line>
      <circle cx="130" cy="130" r="8" stroke={FG} strokeWidth="0.5" fill="none" opacity="0">
        <animate
          attributeName="opacity"
          values="0;0;0;0;0;0;0.5;0"
          keyTimes="0;0.17;0.33;0.5;0.67;0.83;0.9;1"
          dur={`${dur}s`}
          repeatCount="indefinite"
        />
      </circle>

      {/* Labels — slide up on entry */}
      {labels.map((label, i) => {
        const s = i / n
        const e = (i + 0.82) / n
        const mid = (s + e) / 2
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
              keyTimes={`0;${s};${s + 0.04};${mid};${e}`}
              dur={`${dur}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="y"
              values={`228;228;222;222;218`}
              keyTimes={`0;${s};${s + 0.04};${mid};${e}`}
              dur={`${dur}s`}
              repeatCount="indefinite"
            />
          </text>
        )
      })}
    </Wrap>
  )
}

// Q5: Branding — canvas fills with brand identity elements phase by phase
function G05() {
  const dur = 8.0

  return (
    <Wrap>
      {/* Canvas frame */}
      <rect x="75" y="62" width="110" height="136" stroke={RULE} strokeWidth="1" fill="none" />

      {/* NONE: blinking cursor in corner */}
      <rect x="81" y="68" width="2" height="10" fill={MUTED} opacity="0">
        <animate
          attributeName="opacity"
          values="0;1;0;1;0;1;0;0;0"
          keyTimes="0;0.04;0.08;0.12;0.16;0.20;0.24;0.25;1"
          dur={`${dur}s`}
          repeatCount="indefinite"
        />
      </rect>

      {/* LOGO: circle draws itself in */}
      <circle
        cx="130"
        cy="110"
        r="26"
        stroke={FG}
        strokeWidth="1.5"
        fill="none"
        strokeDasharray="163.4"
        strokeDashoffset="163.4"
      >
        <animate
          attributeName="strokeDashoffset"
          values="163.4;163.4;0;0;0;0;163.4"
          keyTimes="0;0.25;0.38;0.5;0.75;0.95;1"
          dur={`${dur}s`}
          repeatCount="indefinite"
          calcMode="spline"
          keySplines="1 0 1 0;0.3 0 0.1 1;1 0 1 0;1 0 1 0;0.4 0 0.2 1;1 0 1 0"
        />
      </circle>
      {/* inner horizontal crosshair */}
      <line x1="116" y1="110" x2="144" y2="110" stroke={FG} strokeWidth="0.75" opacity="0">
        <animate
          attributeName="opacity"
          values="0;0;0;0.5;0.5;0.5;0;0"
          keyTimes="0;0.25;0.38;0.43;0.5;0.95;0.97;1"
          dur={`${dur}s`}
          repeatCount="indefinite"
        />
      </line>
      {/* inner vertical crosshair */}
      <line x1="130" y1="97" x2="130" y2="123" stroke={FG} strokeWidth="0.75" opacity="0">
        <animate
          attributeName="opacity"
          values="0;0;0;0.5;0.5;0.5;0;0"
          keyTimes="0;0.25;0.40;0.45;0.5;0.95;0.97;1"
          dur={`${dur}s`}
          repeatCount="indefinite"
        />
      </line>

      {/* SOME IDEAS: color swatches slide in */}
      {(["#E84855", "#3B82F6", "#10B981", "#F59E0B"] as const).map((color, i) => (
        <rect
          key={i}
          x={82 + i * 25}
          y="150"
          width="19"
          height="11"
          rx="2"
          fill={color}
          opacity="0"
        >
          <animate
            attributeName="opacity"
            values={`0;0;0;${0.9 - i * 0.05};${0.9 - i * 0.05};0;0`}
            keyTimes={`0;0.5;${0.53 + i * 0.02};${0.59 + i * 0.02};0.95;0.97;1`}
            dur={`${dur}s`}
            repeatCount="indefinite"
          />
        </rect>
      ))}

      {/* FULL KIT: Aa type specimen */}
      <text
        x="130"
        y="143"
        textAnchor="middle"
        fontFamily="Geist Variable, sans-serif"
        fontSize="16"
        fontWeight="200"
        fill={FG}
        opacity="0"
        letterSpacing="6"
      >
        Aa
        <animate
          attributeName="opacity"
          values="0;0;0;0;0.75;0.75;0;0"
          keyTimes="0;0.75;0.78;0.83;0.87;0.95;0.97;1"
          dur={`${dur}s`}
          repeatCount="indefinite"
        />
      </text>
      {/* Small dot grid in top-right corner of canvas */}
      {[0, 1, 2].flatMap((row) =>
        [0, 1, 2].map((col) => (
          <circle
            key={`${row}-${col}`}
            cx={153 + col * 9}
            cy={69 + row * 9}
            r="1.5"
            fill={MUTED}
            opacity="0"
          >
            <animate
              attributeName="opacity"
              values="0;0;0;0;0.4;0.4;0;0"
              keyTimes={`0;0.75;0.79;${0.83 + (row * 3 + col) * 0.005};${0.87 + (row * 3 + col) * 0.005};0.95;0.97;1`}
              dur={`${dur}s`}
              repeatCount="indefinite"
            />
          </circle>
        )),
      )}

      {/* Level labels */}
      {(["NONE", "LOGO ONLY", "SOME IDEAS", "FULL KIT"] as const).map((label, i) => {
        const s = i * 0.25
        const fadeIn = s + 0.04
        const hold = i < 3 ? (i + 1) * 0.25 - 0.02 : 0.95
        const gone = Math.min(hold + 0.02, 0.99)
        return (
          <text
            key={label}
            x="130"
            y="228"
            textAnchor="middle"
            fontFamily={MONO}
            fontSize="7"
            fill={MUTED}
            letterSpacing="3"
            opacity="0"
          >
            {label}
            <animate
              attributeName="opacity"
              values="0;0;1;1;0;0"
              keyTimes={`0;${s > 0 ? s : 0.001};${fadeIn};${hold};${gone};1`}
              dur={`${dur}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="y"
              values="234;234;228;228;224;224"
              keyTimes={`0;${s > 0 ? s : 0.001};${fadeIn};${hold};${gone};1`}
              dur={`${dur}s`}
              repeatCount="indefinite"
            />
          </text>
        )
      })}
    </Wrap>
  )
}

// Q6: Logo upload — circular icon placeholder with orbital ring and pulsing inner mark
function G06() {
  return (
    <Wrap>
      {/* Outer counter-rotating dashed orbit ring */}
      <circle
        cx="130"
        cy="130"
        r="72"
        stroke={MUTED}
        strokeWidth="0.75"
        strokeDasharray="4 8"
        fill="none"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="0 130 130;-360 130 130"
          dur="22s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Icon boundary circle */}
      <circle cx="130" cy="130" r="52" stroke={FG} strokeWidth="1.5" fill="none" />

      {/* Inner ring — breathes */}
      <circle cx="130" cy="130" r="38" stroke={RULE} strokeWidth="1" fill="none">
        <animate
          attributeName="r"
          values="38;42;38"
          dur="4s"
          repeatCount="indefinite"
          calcMode="spline"
          keySplines="0.4 0 0.6 1;0.4 0 0.6 1"
        />
        <animate
          attributeName="opacity"
          values="1;0.4;1"
          dur="4s"
          repeatCount="indefinite"
          calcMode="spline"
          keySplines="0.4 0 0.6 1;0.4 0 0.6 1"
        />
      </circle>

      {/* Abstract inner mark — two bars forming a minimal monogram */}
      <rect x="118" y="118" width="24" height="4" fill={FG}>
        <animate attributeName="opacity" values="1;0.5;1" dur="4s" repeatCount="indefinite" />
      </rect>
      <rect x="118" y="126" width="16" height="4" fill={FG}>
        <animate
          attributeName="opacity"
          values="1;0.5;1"
          dur="4s"
          begin="0.2s"
          repeatCount="indefinite"
        />
      </rect>
      <rect x="118" y="134" width="24" height="4" fill={FG}>
        <animate
          attributeName="opacity"
          values="1;0.5;1"
          dur="4s"
          begin="0.4s"
          repeatCount="indefinite"
        />
      </rect>

      {/* Orbiting dot */}
      <g>
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="0 130 130;360 130 130"
          dur="6s"
          repeatCount="indefinite"
        />
        <circle cx="182" cy="130" r="4" fill="#10B981" />
        {/* Trailing glow */}
        <circle cx="182" cy="130" r="7" fill="#10B981" opacity="0.15" />
      </g>

      {/* Second slower orbiting dot, offset 180° */}
      <g>
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="180 130 130;540 130 130"
          dur="6s"
          repeatCount="indefinite"
        />
        <circle cx="182" cy="130" r="2.5" fill={MUTED} />
      </g>

      {/* Pulse ring expanding from icon */}
      <circle cx="130" cy="130" r="52" stroke={FG} strokeWidth="1" fill="none" opacity="0">
        <animate attributeName="r" values="52;80;80" dur="3.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;0;0" dur="3.5s" repeatCount="indefinite" />
      </circle>
    </Wrap>
  )
}

// Q7: Colors — four circles in distinct vivid colors, independently pulsing with glow rings
function G07() {
  const positions = [
    { cx: 96, cy: 96 },
    { cx: 164, cy: 96 },
    { cx: 96, cy: 164 },
    { cx: 164, cy: 164 },
  ]
  const fills = ["#E84855", "#3B82F6", "#10B981", "#F59E0B"]
  const delays = ["0s", "0.7s", "1.4s", "2.1s"]
  const durations = ["3.2s", "3.8s", "2.9s", "4.1s"]

  return (
    <Wrap>
      {positions.map((pos, i) => (
        <g key={i}>
          {/* Static outer ring */}
          <circle cx={pos.cx} cy={pos.cy} r="28" stroke={RULE} strokeWidth="1" />
          {/* Expanding glow ring */}
          <circle
            cx={pos.cx}
            cy={pos.cy}
            r="22"
            fill="none"
            stroke={fills[i]}
            strokeWidth="1"
            opacity="0"
          >
            <animate
              attributeName="opacity"
              values="0;0.5;0"
              keyTimes="0;0.25;0.7"
              dur={durations[i]}
              begin={delays[i]}
              repeatCount="indefinite"
            />
            <animate
              attributeName="r"
              values="22;34;42"
              keyTimes="0;0.25;0.7"
              dur={durations[i]}
              begin={delays[i]}
              repeatCount="indefinite"
            />
          </circle>
          {/* Filled circle */}
          <circle cx={pos.cx} cy={pos.cy} r="8" fill={fills[i]} opacity="0">
            <animate
              attributeName="opacity"
              values="0;0.9;0.9;0"
              keyTimes="0;0.18;0.7;1"
              dur={durations[i]}
              begin={delays[i]}
              repeatCount="indefinite"
            />
            <animate
              attributeName="r"
              values="8;22;22;8"
              keyTimes="0;0.18;0.7;1"
              dur={durations[i]}
              begin={delays[i]}
              repeatCount="indefinite"
            />
          </circle>
        </g>
      ))}
    </Wrap>
  )
}

// Q8: Brand assets — stacked files with content previews floating upward
function G08() {
  const files = [
    { x: 60, y: 162, delay: "0s" },
    { x: 68, y: 148, delay: "0.22s" },
    { x: 76, y: 134, delay: "0.44s" },
  ]
  const swatchColors = ["#E84855", "#3B82F6", "#10B981", "#F59E0B"]

  return (
    <Wrap>
      {files.map((f, i) => {
        const floatY = `${f.y};${f.y - 22};${f.y}`
        const spline = "0.45 0 0.55 1;0.45 0 0.55 1"
        const animProps = {
          dur: "4.2s",
          begin: f.delay,
          repeatCount: "indefinite" as const,
          calcMode: "spline" as const,
          keySplines: spline,
        }
        return (
          <g key={i}>
            {/* Card body */}
            <rect
              x={f.x}
              y={f.y}
              width="126"
              height="82"
              stroke={i === 2 ? FG : MUTED}
              strokeWidth="1"
              fill="#000"
            >
              <animate attributeName="y" values={floatY} {...animProps} />
            </rect>
            {/* Header strip */}
            <rect x={f.x} y={f.y} width="126" height="14" fill={i === 2 ? "#141414" : "#0a0a0a"}>
              <animate attributeName="y" values={floatY} {...animProps} />
            </rect>
            {/* Window dots */}
            {[7, 16, 25].map((dx, j) => (
              <circle
                key={j}
                cx={f.x + dx}
                cy={f.y + 7}
                r="2.5"
                fill={j === 0 ? "#3a3a3a" : j === 1 ? "#2a2a2a" : "#222"}
              >
                <animate
                  attributeName="cy"
                  values={`${f.y + 7};${f.y - 15};${f.y + 7}`}
                  {...animProps}
                />
              </circle>
            ))}
            {/* Content: top file shows color swatches */}
            {i === 2 &&
              swatchColors.map((color, j) => (
                <rect
                  key={j}
                  x={f.x + 8 + j * 27}
                  y={f.y + 22}
                  width="21"
                  height="52"
                  fill={color}
                  opacity="0.88"
                >
                  <animate
                    attributeName="y"
                    values={`${f.y + 22};${f.y};${f.y + 22}`}
                    {...animProps}
                  />
                </rect>
              ))}
            {/* Content: middle file shows type preview lines */}
            {i === 1 &&
              [28, 43, 56, 66].map((yOff, j) => (
                <rect
                  key={j}
                  x={f.x + 8}
                  y={f.y + yOff}
                  width={[100, 80, 90, 65][j]}
                  height="7"
                  fill={MUTED}
                  opacity="0.35"
                  rx="2"
                >
                  <animate
                    attributeName="y"
                    values={`${f.y + yOff};${f.y + yOff - 22};${f.y + yOff}`}
                    {...animProps}
                  />
                </rect>
              ))}
            {/* Content: bottom file shows logo sketch lines */}
            {i === 0 && (
              <>
                <line
                  x1={f.x + 10}
                  y1={f.y + 32}
                  x2={f.x + 116}
                  y2={f.y + 32}
                  stroke={RULE}
                  strokeWidth="1"
                >
                  <animate
                    attributeName="y1"
                    values={`${f.y + 32};${f.y + 10};${f.y + 32}`}
                    {...animProps}
                  />
                  <animate
                    attributeName="y2"
                    values={`${f.y + 32};${f.y + 10};${f.y + 32}`}
                    {...animProps}
                  />
                </line>
                <line
                  x1={f.x + 10}
                  y1={f.y + 52}
                  x2={f.x + 80}
                  y2={f.y + 52}
                  stroke={RULE}
                  strokeWidth="1"
                >
                  <animate
                    attributeName="y1"
                    values={`${f.y + 52};${f.y + 30};${f.y + 52}`}
                    {...animProps}
                  />
                  <animate
                    attributeName="y2"
                    values={`${f.y + 52};${f.y + 30};${f.y + 52}`}
                    {...animProps}
                  />
                </line>
              </>
            )}
          </g>
        )
      })}
      {/* Upload particle rising from top file */}
      <circle cx="139" cy="134" r="3" fill={FG} opacity="0">
        <animate
          attributeName="cy"
          values="134;80;80"
          keyTimes="0;0.55;1"
          dur="3.2s"
          begin="0.8s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0;0;0.8;0.8;0"
          keyTimes="0;0.08;0.18;0.5;0.65"
          dur="3.2s"
          begin="0.8s"
          repeatCount="indefinite"
        />
      </circle>
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
      <rect x="56" y="80" width="60" height="6" fill="#3B82F6" rx="1" opacity="0.65">
        <animate
          attributeName="width"
          values="0;60;60;0"
          keyTimes="0;0.3;0.8;1"
          dur="3s"
          repeatCount="indefinite"
        />
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

// Q10: Competitors — scatter plot with radar sweep, staggered dots, YOU label
function G10() {
  const dots = [
    { cx: 80, cy: 90 },
    { cx: 120, cy: 110 },
    { cx: 155, cy: 80 },
    { cx: 170, cy: 140 },
    { cx: 95, cy: 160 },
    { cx: 145, cy: 165 },
    { cx: 105, cy: 130 },
    { cx: 180, cy: 100 },
  ]
  return (
    <Wrap>
      <defs>
        <clipPath id="chartArea">
          <rect x="50" y="50" width="162" height="162" />
        </clipPath>
      </defs>

      {/* Subtle background grid */}
      {[90, 130, 170].map((v) => (
        <line key={`h${v}`} x1="50" y1={v} x2="212" y2={v} stroke={RULE} strokeWidth="0.5" />
      ))}
      {[90, 130, 170].map((v) => (
        <line key={`v${v}`} x1={v} y1="50" x2={v} y2="212" stroke={RULE} strokeWidth="0.5" />
      ))}

      {/* Axes */}
      <line x1="50" y1="50" x2="50" y2="212" stroke={MUTED} strokeWidth="1" />
      <line x1="50" y1="212" x2="212" y2="212" stroke={MUTED} strokeWidth="1" />

      {/* Radar sweep line */}
      <line
        x1="130"
        y1="130"
        x2="214"
        y2="130"
        stroke={FG}
        strokeWidth="0.6"
        opacity="0.28"
        clipPath="url(#chartArea)"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="0 130 130;360 130 130"
          dur="7s"
          repeatCount="indefinite"
        />
      </line>

      {/* Competitor dots — staggered fade-in */}
      {dots.map((d, i) => (
        <circle key={i} cx={d.cx} cy={d.cy} r="4" fill={MUTED} opacity="0">
          <animate
            attributeName="opacity"
            values="0;0;0.55;0.55"
            keyTimes={`0;${0.05 + i * 0.06};${0.12 + i * 0.06};1`}
            dur="5s"
            repeatCount="indefinite"
          />
        </circle>
      ))}

      {/* YOU — highlighted dot */}
      <circle cx="130" cy="130" r="5" fill="#E84855" />
      {/* Pulse ring 1 */}
      <circle cx="130" cy="130" r="5" stroke="#E84855" strokeWidth="1" fill="none">
        <animate attributeName="r" values="5;22;5" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.8;0;0.8" dur="2.5s" repeatCount="indefinite" />
      </circle>
      {/* Pulse ring 2 — offset */}
      <circle cx="130" cy="130" r="5" stroke="#E84855" strokeWidth="0.5" fill="none">
        <animate
          attributeName="r"
          values="5;30;5"
          dur="2.5s"
          begin="0.8s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.4;0;0.4"
          dur="2.5s"
          begin="0.8s"
          repeatCount="indefinite"
        />
      </circle>
      {/* YOU label */}
      <text
        x="138"
        y="125"
        fontFamily={MONO}
        fontSize="7"
        fill={FG}
        letterSpacing="1.5"
        opacity="0"
      >
        YOU
        <animate
          attributeName="opacity"
          values="0;0;1;1"
          keyTimes="0;0.4;0.55;1"
          dur="5s"
          repeatCount="indefinite"
        />
      </text>
    </Wrap>
  )
}

// Q11: Pages — page cards pop in as a staggered grid, each with a tiny wireframe inside
function G11() {
  const pages = [
    { label: "HOME", x: 42, y: 68 },
    { label: "ABOUT", x: 103, y: 68 },
    { label: "WORK", x: 164, y: 68 },
    { label: "SHOP", x: 42, y: 155 },
    { label: "JOURNAL", x: 103, y: 155 },
    { label: "CONTACT", x: 164, y: 155 },
  ]
  const cardW = 52
  const cardH = 72
  const dur = 5.4
  const accentColors = ["#E84855", "#3B82F6", "#10B981", "#F59E0B", "#E84855", "#3B82F6"]

  return (
    <Wrap>
      {pages.map((p, i) => {
        const begin = `${i * 0.22}s`
        return (
          <g key={p.label}>
            {/* Card outline */}
            <rect
              x={p.x}
              y={p.y}
              width={cardW}
              height={cardH}
              stroke={MUTED}
              strokeWidth="0.75"
              fill="none"
              rx="1"
              opacity="0"
            >
              <animate
                attributeName="opacity"
                values="0;1;1;0"
                keyTimes="0;0.12;0.82;1"
                dur={`${dur}s`}
                begin={begin}
                repeatCount="indefinite"
              />
              <animate
                attributeName="stroke"
                values={`${MUTED};${accentColors[i]};${MUTED};${MUTED}`}
                keyTimes="0;0.15;0.6;1"
                dur={`${dur}s`}
                begin={begin}
                repeatCount="indefinite"
              />
            </rect>
            {/* Hero strip */}
            <rect
              x={p.x + 4}
              y={p.y + 4}
              width={cardW - 8}
              height={18}
              fill={RULE}
              rx="1"
              opacity="0"
            >
              <animate
                attributeName="opacity"
                values="0;0.6;0.6;0"
                keyTimes="0;0.15;0.82;1"
                dur={`${dur}s`}
                begin={begin}
                repeatCount="indefinite"
              />
            </rect>
            {/* Content lines */}
            <rect
              x={p.x + 4}
              y={p.y + 28}
              width={cardW - 8}
              height="4"
              fill={RULE}
              rx="1"
              opacity="0"
            >
              <animate
                attributeName="opacity"
                values="0;0.4;0.4;0"
                keyTimes="0;0.18;0.82;1"
                dur={`${dur}s`}
                begin={begin}
                repeatCount="indefinite"
              />
            </rect>
            <rect
              x={p.x + 4}
              y={p.y + 36}
              width={cardW - 18}
              height="4"
              fill={RULE}
              rx="1"
              opacity="0"
            >
              <animate
                attributeName="opacity"
                values="0;0.3;0.3;0"
                keyTimes="0;0.2;0.82;1"
                dur={`${dur}s`}
                begin={begin}
                repeatCount="indefinite"
              />
            </rect>
            <rect
              x={p.x + 4}
              y={p.y + 44}
              width={cardW - 12}
              height="4"
              fill={RULE}
              rx="1"
              opacity="0"
            >
              <animate
                attributeName="opacity"
                values="0;0.25;0.25;0"
                keyTimes="0;0.22;0.82;1"
                dur={`${dur}s`}
                begin={begin}
                repeatCount="indefinite"
              />
            </rect>
            {/* Page label */}
            <text
              x={p.x + cardW / 2}
              y={p.y + cardH - 7}
              textAnchor="middle"
              fontFamily={MONO}
              fontSize="5"
              fill={MUTED}
              letterSpacing="1.5"
              opacity="0"
            >
              {p.label}
              <animate
                attributeName="opacity"
                values="0;0.6;0.6;0"
                keyTimes="0;0.18;0.82;1"
                dur={`${dur}s`}
                begin={begin}
                repeatCount="indefinite"
              />
              <animate
                attributeName="fill"
                values={`${MUTED};${FG};${MUTED};${MUTED}`}
                keyTimes="0;0.18;0.55;1"
                dur={`${dur}s`}
                begin={begin}
                repeatCount="indefinite"
              />
            </text>
          </g>
        )
      })}
    </Wrap>
  )
}

// Q12: Features — checklist that checks off sequentially
function G12() {
  const items = ["E-commerce", "Blog / News", "Booking", "Analytics", "Search"]
  const totalDur = 5.5
  const stepDur = 0.76

  return (
    <Wrap>
      {items.map((item, i) => {
        const s = (i * stepDur) / totalDur
        const mid = s + 0.06
        const hold = 0.84
        const kts = `0;${s};${mid};${hold};1`
        const checkKts = `0;${mid};${mid + 0.04};${hold};1`
        const y = 74 + i * 30
        return (
          <g key={i}>
            {/* Checkbox outline */}
            <rect
              x="50"
              y={y}
              width="17"
              height="17"
              rx="3"
              stroke={MUTED}
              strokeWidth="1"
              fill="none"
            />
            {/* Checkbox fill */}
            <rect x="50" y={y} width="17" height="17" rx="3" fill="#3B82F6" opacity="0">
              <animate
                attributeName="opacity"
                values={`0;0;1;1;0`}
                keyTimes={kts}
                dur={`${totalDur}s`}
                repeatCount="indefinite"
              />
            </rect>
            {/* Checkmark */}
            <polyline
              points={`${53},${y + 8.5} ${57},${y + 13} ${65},${y + 4}`}
              stroke="#000"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0"
            >
              <animate
                attributeName="opacity"
                values={`0;0;1;1;0`}
                keyTimes={checkKts}
                dur={`${totalDur}s`}
                repeatCount="indefinite"
              />
            </polyline>
            {/* Label slides in */}
            <text
              x="90"
              y={y + 12}
              fontFamily={MONO}
              fontSize="9"
              fill={FG}
              letterSpacing="1"
              opacity="0"
            >
              {item}
              <animate
                attributeName="opacity"
                values={`0;0;0.85;0.85;0`}
                keyTimes={kts}
                dur={`${totalDur}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="x"
                values={`96;96;78;78;78`}
                keyTimes={kts}
                dur={`${totalDur}s`}
                repeatCount="indefinite"
              />
            </text>
          </g>
        )
      })}
    </Wrap>
  )
}

// Q13: Budget — arc gauge cycles through four tiers
function G13() {
  const r = 80
  const circ = 2 * Math.PI * r
  const track = circ * 0.75
  const totalDur = 7.2 // 1.8s × 4 tiers

  const arcVals = [
    `0 ${circ}`,
    `${track * 0.25} ${circ}`,
    `${track * 0.25} ${circ}`,
    `${track * 0.5} ${circ}`,
    `${track * 0.5} ${circ}`,
    `${track * 0.75} ${circ}`,
    `${track * 0.75} ${circ}`,
    `${track * 1.0} ${circ}`,
    `${track * 1.0} ${circ}`,
    `0 ${circ}`,
  ].join(";")

  const tiers = ["$2K", "$8K", "$20K", "$50K+"]

  return (
    <Wrap>
      {/* Background arc track */}
      <circle
        cx="130"
        cy="140"
        r={r}
        stroke={RULE}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={`${track} ${circ}`}
        strokeDashoffset={circ * 0.125}
        transform="rotate(-225 130 140)"
      />
      {/* Animated fill arc — steps through tiers */}
      <circle
        cx="130"
        cy="140"
        r={r}
        stroke="#10B981"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={`0 ${circ}`}
        strokeDashoffset={circ * 0.125}
        transform="rotate(-225 130 140)"
      >
        <animate
          attributeName="strokeDasharray"
          values={arcVals}
          keyTimes="0;0.08;0.25;0.33;0.5;0.58;0.75;0.83;0.95;1"
          dur={`${totalDur}s`}
          repeatCount="indefinite"
          calcMode="spline"
          keySplines="0.4 0 0.2 1;1 0 1 0;0.4 0 0.2 1;1 0 1 0;0.4 0 0.2 1;1 0 1 0;0.4 0 0.2 1;1 0 1 0;0.4 0 0.2 1"
        />
      </circle>
      {/* Tier amount labels */}
      {tiers.map((tier, i) => {
        const s = i * 0.25
        const fadeIn = s + 0.08
        const hold = s + 0.22
        const gone = Math.min(s + 0.24, 0.99)
        return (
          <text
            key={tier}
            x="130"
            y="133"
            textAnchor="middle"
            fontFamily={MONO}
            fontSize="22"
            fontWeight="200"
            fill={FG}
            letterSpacing="-1"
            opacity="0"
          >
            {tier}
            <animate
              attributeName="opacity"
              values="0;0;1;1;0;0"
              keyTimes={`0;${s > 0 ? s : 0.001};${fadeIn};${hold};${gone};1`}
              dur={`${totalDur}s`}
              repeatCount="indefinite"
            />
          </text>
        )
      })}
      <text
        x="130"
        y="149"
        textAnchor="middle"
        fontFamily={MONO}
        fontSize="7"
        fill={MUTED}
        letterSpacing="2"
      >
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
        const r1 = 64,
          r2 = 72
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
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="0 130 130;360 130 130"
          dur="10s"
          repeatCount="indefinite"
        />
      </line>
      {/* Hour hand */}
      <line x1="130" y1="130" x2="130" y2="80" stroke={FG} strokeWidth="2.5" strokeLinecap="round">
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="0 130 130;360 130 130"
          dur="120s"
          repeatCount="indefinite"
        />
      </line>
      {/* Center dot */}
      <circle cx="130" cy="130" r="3" fill="#E84855" />
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
      <rect x="50" y="114" width="2" height="12" fill="#3B82F6">
        <animate
          attributeName="x"
          values="50;50;50;145;145"
          keyTimes="0;0.04;0.25;0.4;1"
          dur="5s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="1;1;0;0;1;0;1;0;1"
          keyTimes="0;0.22;0.23;0.35;0.36;0.44;0.45;0.52;1"
          dur="5s"
          repeatCount="indefinite"
        />
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
        <animate
          attributeName="opacity"
          values="0;0;1;1;0;0;0;0"
          keyTimes="0;0.05;0.15;0.45;0.5;0.55;0.95;1"
          dur="5s"
          repeatCount="indefinite"
        />
        <rect x="40" y="82" width="120" height="50" rx="8" stroke={MUTED} strokeWidth="1" />
        <polygon points="52,132 52,148 68,132" fill="#000" stroke={MUTED} strokeWidth="1" />
        <rect x="52" y="96" width="80" height="6" fill={RULE} rx="2" />
        <rect x="52" y="108" width="56" height="6" fill={RULE} rx="2" />
      </g>
      {/* Right bubble (them answering) */}
      <g opacity="0">
        <animate
          attributeName="opacity"
          values="0;0;0;0;0;1;1;0"
          keyTimes="0;0.05;0.45;0.5;0.55;0.65;0.9;1"
          dur="5s"
          repeatCount="indefinite"
        />
        <rect x="100" y="140" width="120" height="50" rx="8" stroke="#10B981" strokeWidth="1" />
        <polygon points="208,140 208,124 192,140" fill="#000" stroke="#10B981" strokeWidth="1" />
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
      <text
        x="130"
        y="116"
        textAnchor="middle"
        fontFamily="Geist Variable, sans-serif"
        fontSize="52"
        fontWeight="200"
        fill="#10B981"
      >
        ✓
        <animate attributeName="opacity" values="0;1" keyTimes="0;0.3" dur="1s" fill="freeze" />
      </text>
      <text
        x="130"
        y="148"
        textAnchor="middle"
        fontFamily={MONO}
        fontSize="8"
        fill={MUTED}
        letterSpacing="3"
      >
        ALL DONE
      </text>
    </Wrap>
  )
}

// Thank you screen — submission confirmed, four colored dots radiate from center
export function GThankYou() {
  const colors = ["#E84855", "#3B82F6", "#10B981", "#F59E0B"]
  const angles = [315, 45, 135, 225]

  return (
    <Wrap>
      {/* Expanding ring */}
      <circle cx="130" cy="130" r="0" stroke={MUTED} strokeWidth="0.5" fill="none">
        <animate
          attributeName="r"
          values="0;70;70"
          keyTimes="0;0.6;1"
          dur="3s"
          repeatCount="indefinite"
          calcMode="spline"
          keySplines="0.2 0 0.2 1;1 0 1 0"
        />
        <animate
          attributeName="opacity"
          values="0.5;0.15;0"
          keyTimes="0;0.6;1"
          dur="3s"
          repeatCount="indefinite"
        />
      </circle>
      {/* Four colored dots radiating from center */}
      {colors.map((color, i) => {
        const angle = (angles[i] * Math.PI) / 180
        const tx = Math.round(130 + Math.cos(angle) * 58)
        const ty = Math.round(130 + Math.sin(angle) * 58)
        return (
          <circle key={i} cx="130" cy="130" r="4" fill={color} opacity="0">
            <animate
              attributeName="cx"
              values={`130;${tx}`}
              dur="3s"
              begin={`${i * 0.12}s`}
              repeatCount="indefinite"
              calcMode="spline"
              keySplines="0.2 0 0.2 1"
            />
            <animate
              attributeName="cy"
              values={`130;${ty}`}
              dur="3s"
              begin={`${i * 0.12}s`}
              repeatCount="indefinite"
              calcMode="spline"
              keySplines="0.2 0 0.2 1"
            />
            <animate
              attributeName="opacity"
              values="0;0.9;0"
              keyTimes="0;0.35;0.75"
              dur="3s"
              begin={`${i * 0.12}s`}
              repeatCount="indefinite"
            />
          </circle>
        )
      })}
      {/* Center checkmark */}
      <text
        x="130"
        y="138"
        textAnchor="middle"
        fontFamily="Geist Variable, sans-serif"
        fontSize="48"
        fontWeight="200"
        fill={FG}
      >
        ✓
        <animate attributeName="opacity" values="0;1" keyTimes="0;0.3" dur="1s" fill="freeze" />
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

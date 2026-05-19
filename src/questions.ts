export type Question =
  | {
      id: string
      kind: "short_text"
      prompt: string
      hint?: string
      placeholder?: string
      required?: boolean
    }
  | {
      id: string
      kind: "long_text"
      prompt: string
      hint?: string
      placeholder?: string
      required?: boolean
    }
  | {
      id: string
      kind: "color"
      prompt: string
      hint?: string
      max?: number
      required?: boolean
      sourceAnswerId?: string
    }
  | {
      id: string
      kind: "file_upload"
      prompt: string
      hint?: string
      multiple?: boolean
      accept?: string
      required?: boolean
    }
  | {
      id: string
      kind: "single_select"
      prompt: string
      hint?: string
      options: { value: string; label: string; blurb?: string }[]
      allowOther?: { label: string; placeholder?: string }
      required?: boolean
    }
  | {
      id: string
      kind: "multi_select"
      prompt: string
      hint?: string
      options: { value: string; label: string; blurb?: string }[]
      allowOther?: { label: string; placeholder?: string }
      max?: number
      clashes?: [string, string][]
      required?: boolean
    }
  | {
      id: string
      kind: "range"
      prompt: string
      hint?: string
      min: number
      max: number
      step: number
      format?: "currency"
      required?: boolean
    }
  | {
      id: string
      kind: "list"
      prompt: string
      hint?: string
      itemNoun: string
      itemNounSource?: { answerId: string; map: Record<string, { prompt: string; noun: string }> }
      required?: boolean
    }
  | {
      id: string
      kind: "offerings"
      prompt: string
      hint?: string
      required?: boolean
    }
  | {
      id: string
      kind: "links"
      prompt: string
      hint?: string
      placeholder?: string
      uploads?: { hint?: string; accept?: string }
      required?: boolean
    }

export type UploadedFile = {
  key: string
  name: string
  type: string
  size: number
  storageId: string
}

export type RangeValue = [number, number]

export type ListItem = { id: string; name: string; description: string }

export type Offering = {
  id: string
  name: string
  description: string
  kind: "service" | "product"
}

export type LinksValue = {
  links: string[]
  files: UploadedFile[]
}

export type AnswerValue =
  | string
  | string[]
  | UploadedFile[]
  | RangeValue
  | ListItem[]
  | Offering[]
  | LinksValue

export type Answers = Record<string, AnswerValue>

export const questions: Question[] = [
  {
    id: "business_name",
    kind: "short_text",
    prompt: "What is the name of your business?",
    hint: "The name as you'd want it to appear on the site.",
    placeholder: "e.g. Cedar & Stone",
    required: true,
  },
  {
    id: "offerings",
    kind: "offerings",
    prompt: "What do you sell?",
    hint: "Add each service or product. A name, optional description, and whether it's a service or a product.",
    required: true,
  },
  {
    id: "audience",
    kind: "short_text",
    prompt: "Who is it for?",
    hint: "Your ideal customer or visitor.",
    placeholder: "e.g. independent restaurant owners",
  },
  {
    id: "vibe",
    kind: "multi_select",
    prompt: "Pick a vibe.",
    hint: "Choose up to 3. We'll blend them into something that feels like you.",
    options: [
      {
        value: "editorial",
        label: "Editorial",
        blurb: "Serif type, calm whitespace, magazine-like.",
      },
      { value: "brutalist", label: "Brutalist", blurb: "Raw, mono, unapologetic grids." },
      { value: "playful", label: "Playful", blurb: "Color, motion, rounded forms." },
      { value: "luxury", label: "Luxury", blurb: "Restrained, dark, gilded accents." },
      { value: "organic", label: "Organic", blurb: "Earthy palette, soft shapes." },
      { value: "technical", label: "Technical", blurb: "Dense, precise, schematic." },
    ],
    max: 3,
    clashes: [
      ["organic", "luxury"],
      ["organic", "brutalist"],
      ["organic", "technical"],
      ["playful", "luxury"],
      ["playful", "technical"],
      ["brutalist", "luxury"],
      ["editorial", "playful"],
    ],
    required: true,
  },
  {
    id: "branding_amount",
    kind: "single_select",
    prompt: "How much branding do you already have?",
    hint: "Be honest — we'll work with whatever you've got.",
    options: [
      { value: "none", label: "Nothing at all", blurb: "Starting from scratch." },
      { value: "logo_only", label: "Just a logo" },
      { value: "basic", label: "Some basic ideas", blurb: "Colors, a font, a vague direction." },
      { value: "full_kit", label: "Full brand kit", blurb: "Guidelines, assets, the works." },
    ],
    allowOther: { label: "Other", placeholder: "Describe what you have…" },
  },
  {
    id: "logo",
    kind: "file_upload",
    prompt: "Upload your logo, if you have one.",
    hint: "SVG, PNG, or JPG. Skip if you don't.",
    multiple: false,
    accept: "image/*",
  },
  {
    id: "colors",
    kind: "color",
    prompt: "Choose your colors.",
    hint: "Up to four. Hover a swatch to remove it.",
    max: 4,
    sourceAnswerId: "logo",
  },
  {
    id: "imagery",
    kind: "file_upload",
    prompt: "Share any brand assets or reference material.",
    hint: "Brand kits, style guides, PDFs, photos, anything that describes the company.",
    multiple: true,
  },
  {
    id: "inspiration",
    kind: "links",
    prompt: "Sites you like?",
    hint: "Add links one at a time, and drop in any screenshots that capture the look you're after.",
    placeholder: "https://…",
    uploads: { hint: "Screenshots of sites you like", accept: "image/*" },
  },
  {
    id: "competitors",
    kind: "links",
    prompt: "Links to competitors?",
    hint: "Anyone you're benchmarking against or want to differentiate from. Add one at a time.",
    placeholder: "https://…",
  },
  {
    id: "pages",
    kind: "multi_select",
    prompt: "Which pages do you need?",
    options: [
      { value: "home", label: "Home" },
      { value: "about", label: "About" },
      { value: "work", label: "Work / Portfolio" },
      { value: "shop", label: "Shop" },
      { value: "blog", label: "Journal / Blog" },
      { value: "contact", label: "Contact" },
      { value: "booking", label: "Booking" },
      { value: "menu", label: "Menu" },
    ],
    allowOther: { label: "Other", placeholder: "Describe the page…" },
    required: true,
  },
  {
    id: "features",
    kind: "multi_select",
    prompt: "Which features matter?",
    options: [
      { value: "newsletter", label: "Newsletter signup" },
      { value: "cms", label: "CMS so you can edit" },
      { value: "ecom", label: "E-commerce" },
      { value: "booking", label: "Booking / scheduling" },
      { value: "i18n", label: "Multiple languages" },
      { value: "search", label: "Search" },
      { value: "auth", label: "Login / accounts" },
      { value: "analytics", label: "Analytics" },
    ],
    allowOther: { label: "Other", placeholder: "Describe the feature…" },
  },
  {
    id: "budget",
    kind: "range",
    prompt: "What's your budget?",
    hint: "Drag the handles to set a range.",
    min: 1000,
    max: 10000,
    step: 500,
    format: "currency",
  },
  {
    id: "deadline",
    kind: "short_text",
    prompt: "Any deadline?",
    hint: "A launch date, an event, or 'whenever'.",
    placeholder: "e.g. before March",
  },
  {
    id: "notes",
    kind: "long_text",
    prompt: "Anything else we should know?",
    placeholder: "References, must-haves, things to avoid…",
  },
  {
    id: "questions_for_us",
    kind: "long_text",
    prompt: "Do you have any questions for us?",
    hint: "Anything you'd like us to address.",
    placeholder: "Ask away…",
  },
]

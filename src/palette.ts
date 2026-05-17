export async function extractPalette(url: string, count = 6): Promise<string[]> {
  const img = await loadImage(url)
  const canvas = document.createElement("canvas")
  const max = 96
  const scale = Math.min(1, max / Math.max(img.width, img.height))
  canvas.width = Math.max(1, Math.round(img.width * scale))
  canvas.height = Math.max(1, Math.round(img.height * scale))
  const ctx = canvas.getContext("2d", { willReadFrequently: true })
  if (!ctx) return []
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height)

  const buckets = new Map<string, { r: number; g: number; b: number; n: number }>()
  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3]
    if (a < 200) continue
    const r = data[i],
      g = data[i + 1],
      b = data[i + 2]
    const max = Math.max(r, g, b),
      min = Math.min(r, g, b)
    if (max > 245 && min > 245) continue
    if (max < 12) continue
    const key = `${r >> 5}-${g >> 5}-${b >> 5}`
    const cur = buckets.get(key)
    if (cur) {
      cur.r += r
      cur.g += g
      cur.b += b
      cur.n += 1
    } else {
      buckets.set(key, { r, g, b, n: 1 })
    }
  }

  const sorted = [...buckets.values()].sort((a, b) => b.n - a.n)
  const out: string[] = []
  for (const b of sorted) {
    const hex = toHex(b.r / b.n, b.g / b.n, b.b / b.n)
    if (out.some((h) => dist(h, hex) < 40)) continue
    out.push(hex)
    if (out.length >= count) break
  }
  return out
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = url
  })
}

function toHex(r: number, g: number, b: number) {
  const h = (n: number) =>
    Math.max(0, Math.min(255, Math.round(n)))
      .toString(16)
      .padStart(2, "0")
  return `#${h(r)}${h(g)}${h(b)}`
}

function dist(a: string, b: string) {
  const pa = parse(a),
    pb = parse(b)
  return Math.hypot(pa[0] - pb[0], pa[1] - pb[1], pa[2] - pb[2])
}

function parse(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff]
}

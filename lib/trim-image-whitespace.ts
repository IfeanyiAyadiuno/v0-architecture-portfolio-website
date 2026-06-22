/** Aggressive trim tuned for Instagram / screenshot exports with gray-white mats. */
const MIN_LUMINANCE = 215
const MAX_CHROMA = 28
const ROW_FILL_RATIO = 0.93
const MAX_PASSES = 2

function luminance(r: number, g: number, b: number) {
  return 0.299 * r + 0.587 * g + 0.114 * b
}

function isBorderPixel(r: number, g: number, b: number, a: number): boolean {
  if (a < 16) return true

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const chroma = max - min

  if (chroma > MAX_CHROMA) return false
  return luminance(r, g, b) >= MIN_LUMINANCE
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = document.createElement("img")
    img.decoding = "async"
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`))
    img.src = src
  })
}

function getImageDataFromSource(src: string): Promise<{
  data: Uint8ClampedArray
  width: number
  height: number
  canvas: HTMLCanvasElement
}> {
  return loadImage(src).then((img) => {
    const width = img.naturalWidth
    const height = img.naturalHeight
    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext("2d", { willReadFrequently: true })
    if (!ctx) throw new Error("Canvas unavailable")
    ctx.drawImage(img, 0, 0)
    const { data } = ctx.getImageData(0, 0, width, height)
    return { data, width, height, canvas }
  })
}

function rowBorderRatio(
  y: number,
  left: number,
  right: number,
  width: number,
  data: Uint8ClampedArray
): number {
  let border = 0
  const span = right - left + 1
  for (let x = left; x <= right; x++) {
    const i = (y * width + x) * 4
    if (isBorderPixel(data[i], data[i + 1], data[i + 2], data[i + 3])) border++
  }
  return border / span
}

function columnBorderRatio(
  x: number,
  top: number,
  bottom: number,
  width: number,
  data: Uint8ClampedArray
): number {
  let border = 0
  const span = bottom - top + 1
  for (let y = top; y <= bottom; y++) {
    const i = (y * width + x) * 4
    if (isBorderPixel(data[i], data[i + 1], data[i + 2], data[i + 3])) border++
  }
  return border / span
}

function findCropBounds(
  width: number,
  height: number,
  data: Uint8ClampedArray
): { top: number; bottom: number; left: number; right: number } | null {
  let top = 0
  let bottom = height - 1
  let left = 0
  let right = width - 1

  while (top < height && rowBorderRatio(top, 0, width - 1, width, data) >= ROW_FILL_RATIO) {
    top++
  }

  while (
    bottom > top &&
    rowBorderRatio(bottom, 0, width - 1, width, data) >= ROW_FILL_RATIO
  ) {
    bottom--
  }

  while (
    left < width &&
    columnBorderRatio(left, top, bottom, width, data) >= ROW_FILL_RATIO
  ) {
    left++
  }

  while (
    right > left &&
    columnBorderRatio(right, top, bottom, width, data) >= ROW_FILL_RATIO
  ) {
    right--
  }

  const cropW = right - left + 1
  const cropH = bottom - top + 1

  if (cropW < 8 || cropH < 8) return null
  if (cropW === width && cropH === height) return null

  // Avoid over-cropping if margins were mis-detected.
  if (cropW < width * 0.45 || cropH < height * 0.45) return null

  return { top, bottom, left, right }
}

function cropCanvas(
  source: HTMLCanvasElement,
  bounds: { top: number; bottom: number; left: number; right: number }
): HTMLCanvasElement {
  const cropW = bounds.right - bounds.left + 1
  const cropH = bounds.bottom - bounds.top + 1
  const trimmed = document.createElement("canvas")
  trimmed.width = cropW
  trimmed.height = cropH
  const ctx = trimmed.getContext("2d")
  if (!ctx) return source
  ctx.drawImage(
    source,
    bounds.left,
    bounds.top,
    cropW,
    cropH,
    0,
    0,
    cropW,
    cropH
  )
  return trimmed
}

/**
 * Trims uniform white / light-gray margins from raster images.
 * Returns a data URL when cropping applies; otherwise the original src.
 */
export async function trimImageWhitespace(src: string): Promise<{
  src: string
  width: number
  height: number
  trimmed: boolean
}> {
  let currentSrc = src
  let trimmed = false

  for (let pass = 0; pass < MAX_PASSES; pass++) {
    const { data, width, height, canvas } = await getImageDataFromSource(currentSrc)
    if (width < 2 || height < 2) break

    const bounds = findCropBounds(width, height, data)
    if (!bounds) break

    const nextCanvas = cropCanvas(canvas, bounds)
    if (nextCanvas === canvas) break

    currentSrc = nextCanvas.toDataURL("image/jpeg", 0.94)
    trimmed = true
  }

  if (!trimmed) {
    const img = await loadImage(src)
    return {
      src,
      width: img.naturalWidth,
      height: img.naturalHeight,
      trimmed: false,
    }
  }

  const final = await loadImage(currentSrc)
  return {
    src: currentSrc,
    width: final.naturalWidth,
    height: final.naturalHeight,
    trimmed: true,
  }
}

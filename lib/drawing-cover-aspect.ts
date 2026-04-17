import { isPdfPath } from "@/lib/utils"

/** Typical ANSI B / tabloid landscape (11×8.5) for PDF covers when not measured. */
export const DEFAULT_PDF_COVER_ASPECT = 11 / 8.5

/** Neutral guess for raster covers before `onLoadingComplete` runs. */
export const DEFAULT_RASTER_COVER_ASPECT = 4 / 3

export function clampCoverAspectRatio(widthOverHeight: number): number {
  return Math.min(2.4, Math.max(0.55, widthOverHeight))
}

export function initialCoverAspectRatio(
  coverSrc: string,
  coverAspectRatio: number | undefined
): number {
  if (coverAspectRatio != null && Number.isFinite(coverAspectRatio)) {
    return clampCoverAspectRatio(coverAspectRatio)
  }
  if (isPdfPath(coverSrc)) {
    return clampCoverAspectRatio(DEFAULT_PDF_COVER_ASPECT)
  }
  if (coverSrc.endsWith("placeholder.svg")) {
    return 1
  }
  return clampCoverAspectRatio(DEFAULT_RASTER_COVER_ASPECT)
}

/** Index grid: span two columns when the cover is strongly landscape. */
export function isWideCoverTile(aspectRatio: number): boolean {
  return aspectRatio >= 1.55
}

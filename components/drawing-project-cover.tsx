"use client"

import Image from "next/image"
import { isPdfPath, pdfIframeSrc } from "@/lib/utils"

type DrawingProjectCoverProps = {
  src: string
  alt: string
  sizes?: string
  /** Raster covers only: intrinsic pixels after decode (for aspect-aware layouts). */
  onRasterLoaded?: (dimensions: { width: number; height: number }) => void
}

/**
 * Grid / card cover: raster via `next/image`, PDF cover via embedded viewer.
 * Rasters use `contain` so wide cover art (e.g. elevations) shows the full sheet/building inside the frame.
 */
export function DrawingProjectCover({
  src,
  alt,
  sizes = "(max-width: 768px) 50vw, 25vw",
  onRasterLoaded,
}: DrawingProjectCoverProps) {
  if (isPdfPath(src)) {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden bg-black">
        <iframe
          title={alt}
          src={pdfIframeSrc(src, { view: "FitH", compactUi: true })}
          className="absolute left-1/2 top-[-6%] h-[128%] w-[108%] max-w-none border-0 bg-transparent"
          style={{
            transform: "translateX(-50%) scale(0.98)",
            transformOrigin: "50% 0%",
          }}
        />
      </div>
    )
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-contain opacity-70 transition-opacity duration-300 group-hover:opacity-100"
      sizes={sizes}
      onLoadingComplete={(img) =>
        onRasterLoaded?.({
          width: img.naturalWidth,
          height: img.naturalHeight,
        })
      }
    />
  )
}

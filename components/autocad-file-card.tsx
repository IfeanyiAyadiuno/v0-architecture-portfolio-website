"use client"

import { useCallback, useEffect, useState } from "react"
import type { AutoCADFile } from "@/lib/autocad-data"
import {
  clampCoverAspectRatio,
  DEFAULT_PDF_COVER_ASPECT,
} from "@/lib/drawing-cover-aspect"
import { FxCardShine } from "./fx-card-shine"
import { PdfSheetPreview } from "./pdf-sheet-preview-lazy"

type AutoCADFileCardProps = {
  file: AutoCADFile
  onSelect?: () => void
  /** Lightbox: full black & white sheet. */
  view?: "cover" | "sheet"
}

export function AutoCADFileCard({
  file,
  onSelect,
  view = "cover",
}: AutoCADFileCardProps) {
  const [aspectRatio, setAspectRatio] = useState(() =>
    clampCoverAspectRatio(DEFAULT_PDF_COVER_ASPECT)
  )

  const onPageDimensions = useCallback(
    ({ width, height }: { width: number; height: number }) => {
      if (height < 1) return
      setAspectRatio(clampCoverAspectRatio(width / height))
    },
    []
  )

  const src = view === "cover" ? file.coverUrl : file.sheetUrl

  useEffect(() => {
    setAspectRatio(clampCoverAspectRatio(DEFAULT_PDF_COVER_ASPECT))
  }, [src, file.id])

  const previewBox = (
    <div
      className="relative w-full overflow-hidden border border-[#333333] bg-[#0a0a0a] transition-[border-color] duration-300 group-hover:border-white"
      style={{ aspectRatio }}
    >
      <PdfSheetPreview src={src} fit="contain" onPageDimensions={onPageDimensions} />
      {view === "cover" ? <FxCardShine /> : null}
      {view === "cover" ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[12] bg-gradient-to-t from-black/85 via-black/40 to-transparent px-3 pb-3 pt-10 md:opacity-0 md:transition-opacity md:duration-300 md:group-hover:opacity-100">
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/90">
            {file.title}
          </p>
        </div>
      ) : null}
    </div>
  )

  if (view === "sheet") {
    return (
      <article className="w-full">
        {previewBox}
        <p className="mt-2 truncate font-mono text-xs text-white">{file.title}</p>
      </article>
    )
  }

  const cover = (
    <>
      {previewBox}
      <div className="mt-2 flex shrink-0 items-start justify-between gap-2">
        <p className="min-w-0 flex-1 truncate font-mono text-xs text-white">
          {file.title}
        </p>
        <span className="hidden shrink-0 pt-0.5 font-mono text-[10px] uppercase tracking-wider text-[#555555] transition-colors duration-300 group-hover:text-[#AAAAAA] md:block">
          View
        </span>
      </div>
    </>
  )

  if (!onSelect) {
    return <div className="w-full">{cover}</div>
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      data-clickable="true"
      className="group w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      aria-label={`View ${file.title}`}
    >
      {cover}
    </button>
  )
}

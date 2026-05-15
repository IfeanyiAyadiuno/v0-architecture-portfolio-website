"use client"

import type { AutoCADFile } from "@/lib/autocad-data"
import { PdfSheetPreview } from "./pdf-sheet-preview-lazy"

type AutoCADFileCardProps = {
  file: AutoCADFile
  onSelect: () => void
}

export function AutoCADFileCard({ file, onSelect }: AutoCADFileCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      data-clickable="true"
      className="group relative block w-full overflow-hidden border border-[#333333] bg-black text-left outline-none transition-colors hover:border-white focus-visible:border-white focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#f7f6f3]">
        <PdfSheetPreview src={file.coverUrl} />
        <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
          <p className="font-mono text-[10px] uppercase tracking-wide text-white md:text-xs">
            {file.title} — {file.year}
          </p>
        </div>
      </div>
    </button>
  )
}

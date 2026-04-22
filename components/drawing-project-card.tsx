"use client"

import { useCallback, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { coverImageForProject, type DrawingProject } from "@/lib/data"
import {
  clampCoverAspectRatio,
  initialCoverAspectRatio,
  isWideCoverTile,
} from "@/lib/drawing-cover-aspect"
import { cn, isPdfPath } from "@/lib/utils"
import { DrawingProjectCover } from "./drawing-project-cover"
import { FxCardShine } from "./fx-card-shine"

type DrawingProjectCardLayout = "home" | "index"

type DrawingProjectCardProps = {
  project: DrawingProject
  onSelect: (project: DrawingProject) => void
  sizes?: string
  layout?: DrawingProjectCardLayout
  showShine?: boolean
  className?: string
}

export function DrawingProjectCard({
  project,
  onSelect,
  sizes = "(max-width: 768px) 50vw, 25vw",
  layout = "home",
  showShine = true,
  className,
}: DrawingProjectCardProps) {
  const coverSrc = coverImageForProject(project)
  const pdfCover = isPdfPath(coverSrc)

  const [measuredRatio, setMeasuredRatio] = useState<number | null>(null)

  const aspectRatio = useMemo(() => {
    if (measuredRatio != null) {
      return clampCoverAspectRatio(measuredRatio)
    }
    return initialCoverAspectRatio(coverSrc, project.coverAspectRatio)
  }, [coverSrc, project.coverAspectRatio, measuredRatio])

  const onRasterLoaded = useCallback(
    ({ width, height }: { width: number; height: number }) => {
      if (height < 1) return
      setMeasuredRatio(width / height)
    },
    []
  )

  const categoryLabel =
    project.category === "commercial" ? "Commercial" : "Residential"

  const indexSpanClass =
    layout === "index" && isWideCoverTile(aspectRatio) ? "col-span-2" : ""

  const shellClass = cn(indexSpanClass, className)

  /** Home grid: fixed ratio so every tile in a row matches height (no black band under shorter cards). */
  const coverBoxAspect = layout === "home" ? 4 / 3 : aspectRatio

  const inner = (
    <>
      <button
        type="button"
        onClick={() => onSelect(project)}
        data-clickable="true"
        className="group w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      >
        <div
          className="relative w-full overflow-hidden border border-[#333333] bg-[#0a0a0a] transition-[border-color] duration-300 group-hover:border-white"
          style={{ aspectRatio: coverBoxAspect }}
        >
          <DrawingProjectCover
            src={coverSrc}
            alt={project.title}
            sizes={sizes}
            onRasterLoaded={pdfCover ? undefined : onRasterLoaded}
          />
          {showShine ? <FxCardShine /> : null}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[12] bg-gradient-to-t from-black/85 via-black/40 to-transparent px-3 pb-3 pt-10 md:opacity-0 md:transition-opacity md:duration-300 md:group-hover:opacity-100">
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/90">
              {project.title}
            </p>
            <p className="mt-0.5 font-mono text-[9px] uppercase tracking-wide text-[#AAAAAA]">
              {project.year} · {categoryLabel}
            </p>
          </div>
        </div>

        <div className="mt-2 flex shrink-0 items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="truncate font-mono text-xs text-white">
              {project.title}
            </p>
            <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wide text-[#AAAAAA]">
              {project.year} — {categoryLabel}
            </p>
          </div>
          <span className="hidden shrink-0 pt-0.5 font-mono text-[10px] uppercase tracking-wider text-[#555555] transition-colors duration-300 group-hover:text-[#AAAAAA] md:block">
            View
          </span>
        </div>
      </button>
    </>
  )

  if (layout === "index") {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.94 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        className={shellClass}
      >
        {inner}
      </motion.div>
    )
  }

  return <div className={shellClass}>{inner}</div>
}

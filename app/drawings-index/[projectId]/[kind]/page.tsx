"use client"

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { useParams, useSearchParams } from "next/navigation"
import { motion, useReducedMotion } from "framer-motion"
import Image from "next/image"
import { ArrowLeft, Maximize2, Minimize2 } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { CustomCursor } from "@/components/custom-cursor"
import { Footer } from "@/components/footer"
import { PageTransition } from "@/components/page-transition"
import { getDrawingProjectById, slugToKind } from "@/lib/data"
import { cn, isPdfPath, pdfIframeSrc } from "@/lib/utils"

/** Human-readable file name from a public URL (e.g. plans PDF path → "MAIN FLOOR PLAN.pdf"). */
function sheetFileLabelFromUrl(src: string): string {
  const path = src.split("?")[0] ?? src
  const segment = path.split("/").pop() ?? path
  try {
    return decodeURIComponent(segment)
  } catch {
    return segment
  }
}

function requestFullscreenEl(el: HTMLElement) {
  const anyEl = el as HTMLElement & {
    webkitRequestFullscreen?: () => Promise<void>
  }
  return (
    el.requestFullscreen?.() ??
    anyEl.webkitRequestFullscreen?.() ??
    Promise.resolve()
  )
}

function getFullscreenElement(): Element | null {
  const doc = document as Document & {
    webkitFullscreenElement?: Element | null
  }
  return document.fullscreenElement ?? doc.webkitFullscreenElement ?? null
}

function exitFullscreenDoc() {
  const doc = document as Document & {
    webkitExitFullscreen?: () => Promise<void>
  }
  if (document.fullscreenElement) {
    return document.exitFullscreen?.() ?? Promise.resolve()
  }
  if (getFullscreenElement()) {
    return doc.webkitExitFullscreen?.() ?? Promise.resolve()
  }
  return Promise.resolve()
}

/** True when native element fullscreen is unreliable; use CSS immersive mode instead. */
function useImmersiveFullscreenFallback(): boolean {
  if (typeof window === "undefined") return false
  const ua = navigator.userAgent
  if (/iPad|iPhone|iPod/i.test(ua)) return true
  return window.matchMedia("(pointer: coarse)").matches
}

function DrawingFigureMedia({
  src,
  alt,
  isPdf,
  fileLabel,
}: {
  src: string
  alt: string
  isPdf: boolean
  fileLabel: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [nativeFs, setNativeFs] = useState(false)
  const [immersiveFs, setImmersiveFs] = useState(false)
  const immersiveFallback = useMemo(() => useImmersiveFullscreenFallback(), [])

  const isFs = nativeFs || immersiveFs

  useEffect(() => {
    const sync = () => {
      setNativeFs(getFullscreenElement() === containerRef.current)
    }
    document.addEventListener("fullscreenchange", sync)
    document.addEventListener("webkitfullscreenchange", sync as EventListener)
    return () => {
      document.removeEventListener("fullscreenchange", sync)
      document.removeEventListener("webkitfullscreenchange", sync as EventListener)
    }
  }, [])

  useEffect(() => {
    if (!immersiveFs) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [immersiveFs])

  const toggleFullscreen = useCallback(async () => {
    const el = containerRef.current
    if (!el) return

    if (immersiveFs) {
      setImmersiveFs(false)
      return
    }
    if (getFullscreenElement() === el) {
      await exitFullscreenDoc()
      return
    }

    if (immersiveFallback) {
      setImmersiveFs(true)
      return
    }

    try {
      await requestFullscreenEl(el)
    } catch {
      setImmersiveFs(true)
    }
  }, [immersiveFs, immersiveFallback])

  const pdfSrc = useMemo(
    () =>
      isPdf
        ? pdfIframeSrc(src, {
            // Fit entire page in the viewer (width + height). FitH only fits width and
            // clips tall sheets (e.g. stacked floor plans on 2nd/3rd floor PDFs).
            view: "Fit",
            compactUi: false,
          })
        : src,
    [isPdf, src]
  )

  return (
    <div className="flex flex-col">
      <div
        ref={containerRef}
        className={cn(
          "relative flex w-full flex-col bg-[#0a0a0a]",
          isFs && "min-h-0 justify-stretch",
          immersiveFs &&
            "fixed inset-0 z-[280] max-h-[100dvh] overscroll-none",
          nativeFs && !immersiveFs && "min-h-screen"
        )}
      >
        {/* File name + fullscreen — always visible so users know the sheet before expanding */}
        <div className="relative z-30 flex shrink-0 items-start justify-between gap-3 border-b border-[#333333] px-3 py-2.5 md:px-4 md:py-3">
          <p className="min-w-0 flex-1 break-words font-mono text-[11px] font-medium leading-snug tracking-wide text-white md:text-xs">
            {fileLabel}
          </p>
          <button
            type="button"
            onClick={() => void toggleFullscreen()}
            className="shrink-0 touch-manipulation border border-[#333333] bg-black/95 px-3 py-2 font-mono text-[10px] uppercase tracking-wide text-white backdrop-blur-sm transition-colors hover:border-white hover:text-white active:bg-white/10 md:px-3 md:py-2"
            data-clickable="true"
          >
            {isFs ? (
              <span className="inline-flex items-center gap-1.5">
                <Minimize2 className="h-3.5 w-3.5" aria-hidden />
                Exit
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5">
                <Maximize2 className="h-3.5 w-3.5" aria-hidden />
                Fullscreen
              </span>
            )}
          </button>
        </div>
        {isPdf ? (
          isFs ? (
            <iframe
              key={pdfSrc}
              title={fileLabel}
              src={pdfSrc}
              className="min-h-0 w-full flex-1 basis-0 border-0 bg-black"
            />
          ) : (
            /* ~ANSI B / tabloid landscape (11×8.5) — matches many sheets so Chrome’s #view=Fit leaves little grey inside the iframe */
            <div className="relative aspect-[11/8.5] w-full">
              <iframe
                key={pdfSrc}
                title={fileLabel}
                src={pdfSrc}
                className="absolute inset-0 h-full w-full border-0 bg-black"
              />
            </div>
          )
        ) : (
          <div
            className={cn(
              "relative w-full bg-black",
              /* `object-contain` (below) so PNG elevations show the full sheet in preview and fullscreen — `cover` was cropping when the flex area was taller than the image aspect. */
              isFs ? "min-h-0 flex-1" : "aspect-[4/3]"
            )}
          >
            <Image
              src={src}
              alt={fileLabel}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        )}
      </div>
      {isPdf ? (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[#333333] px-4 py-3">
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs uppercase tracking-wide text-white underline decoration-[#AAAAAA] underline-offset-4 transition-colors hover:text-[#AAAAAA]"
            data-clickable="true"
          >
            Open PDF in new tab
          </a>
        </div>
      ) : null}
    </div>
  )
}

const backLinkClassIndex =
  "inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] text-[#AAAAAA] transition-colors hover:text-white"

const backLinkClassBase =
  "inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] transition-colors"

function DrawingsKindBackLink({ projectId }: { projectId: number }) {
  const searchParams = useSearchParams()
  const reduceMotion = useReducedMotion()
  const reopen = searchParams.get("reopen")
  const returnTo = searchParams.get("returnTo")
  const id = Number(projectId)
  const backToProjectModal =
    reopen != null && Number.isFinite(id) && reopen === String(id)
  const href = backToProjectModal
    ? returnTo === "home"
      ? `/?project=${encodeURIComponent(String(id))}`
      : `/drawings-index?project=${encodeURIComponent(String(id))}`
    : "/drawings-index"
  const label = backToProjectModal ? "Back to project" : "Drawings index"

  const linkClass = cn(
    backLinkClassBase,
    backToProjectModal
      ? "font-bold text-white hover:text-[#DDDDDD]"
      : "text-[#AAAAAA] hover:text-white"
  )

  const link = (
    <Link href={href} className={linkClass} data-clickable="true">
      <ArrowLeft className="h-4 w-4 shrink-0" />
      {label}
    </Link>
  )

  if (backToProjectModal && !reduceMotion) {
    return (
      <motion.span
        className="inline-flex will-change-transform"
        animate={{ y: [0, -5, 0, -2.5, 0] }}
        transition={{
          duration: 1.85,
          repeat: Infinity,
          ease: [0.34, 1.3, 0.64, 1],
          repeatDelay: 0.35,
        }}
      >
        {link}
      </motion.span>
    )
  }

  return link
}

export default function ProjectDrawingKindPage() {
  const params = useParams()
  const projectId = Number(params.projectId)
  const kind = slugToKind(String(params.kind ?? ""))

  const project = useMemo(
    () => (Number.isFinite(projectId) ? getDrawingProjectById(projectId) : undefined),
    [projectId]
  )

  const sheet = project && kind ? project.drawings[kind] : undefined

  /** AMBULANCE STATION Plans: floor + RCP as one row (side by side from `md`). */
  const ambulancePlanPairRows = useMemo(() => {
    if (!project || !kind || !sheet?.images.length) return null
    if (project.id !== 1 || kind !== "Plans") return null
    const rows: string[][] = []
    for (let i = 0; i < sheet.images.length; i += 2) {
      rows.push(sheet.images.slice(i, i + 2))
    }
    return rows
  }, [project, kind, sheet])

  if (!project || !kind || !sheet) {
    return (
      <>
        <CustomCursor />
        <Navigation />
        <PageTransition>
          <main className="min-h-screen bg-black px-6 pb-20 pt-32 text-white">
            <p className="font-mono text-sm text-[#AAAAAA]">
              Project or drawing type not found.
            </p>
            <Suspense
              fallback={
                <Link
                  href="/drawings-index"
                  className="mt-6 inline-flex items-center gap-2 font-mono text-sm uppercase tracking-wide text-white hover:text-[#AAAAAA]"
                  data-clickable="true"
                >
                  <ArrowLeft className="h-4 w-4" />
                  DRAWINGS INDEX
                </Link>
              }
            >
              <div className="mt-6">
                <DrawingsKindBackLink projectId={projectId} />
              </div>
            </Suspense>
          </main>
        </PageTransition>
      </>
    )
  }

  return (
    <>
      <CustomCursor />
      <Navigation />
      <PageTransition>
        <main className="min-h-screen bg-black px-6 pb-20 pt-24">
          <div className="mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <div className="mb-10">
                <Suspense
                  fallback={
                    <Link
                      href="/drawings-index"
                      className={backLinkClassIndex}
                      data-clickable="true"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      DRAWINGS INDEX
                    </Link>
                  }
                >
                  <DrawingsKindBackLink projectId={projectId} />
                </Suspense>
              </div>

              <header className="mb-12 border-b border-[#333333] pb-10">
                <p className="font-mono text-xs uppercase tracking-[0.15em] text-[#AAAAAA]">
                  {project.category} — {kind}
                </p>
                <h1 className="mt-3 font-[family-name:var(--font-space-grotesk)] text-3xl font-bold uppercase tracking-[0.05em] text-white md:text-4xl">
                  {project.title}
                </h1>
                <p className="mt-2 font-mono text-sm text-[#AAAAAA]">
                  {project.year}
                </p>
                <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 font-mono text-[10px] uppercase tracking-wide text-[#AAAAAA]">
                  <span>Scale: {sheet.scale}</span>
                  <span>Software: {sheet.software}</span>
                </div>
              </header>

              {ambulancePlanPairRows ? (
                <div className="flex flex-col gap-8">
                  {ambulancePlanPairRows.map((row, rowIndex) => (
                    <div
                      key={`ambulance-plan-pair-${rowIndex}`}
                      className="grid grid-cols-1 gap-8 md:grid-cols-2"
                    >
                      {row.map((src, colIndex) => {
                        const index = rowIndex * 2 + colIndex
                        const fileLabel = sheetFileLabelFromUrl(src)
                        return (
                          <motion.figure
                            key={`${src}-${index}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              duration: 0.4,
                              delay: index * 0.06,
                            }}
                            className="min-w-0 border border-[#333333] bg-[#0a0a0a]"
                          >
                            <DrawingFigureMedia
                              src={src}
                              alt={`${project.title} — ${kind} — ${fileLabel}`}
                              isPdf={isPdfPath(src)}
                              fileLabel={fileLabel}
                            />
                            <figcaption className="border-t border-[#333333] px-4 py-3 font-mono text-[10px] tracking-wide text-[#AAAAAA]">
                              <span className="text-white/90">{fileLabel}</span>
                              {sheet.images.length > 1 ? (
                                <span className="mt-1 block normal-case tracking-normal text-[#888888]">
                                  {index + 1} of {sheet.images.length} in{" "}
                                  {kind}
                                </span>
                              ) : null}
                            </figcaption>
                          </motion.figure>
                        )
                      })}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  {sheet.images.map((src, index) => {
                    const fileLabel = sheetFileLabelFromUrl(src)
                    return (
                      <motion.figure
                        key={`${src}-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.06 }}
                        className="border border-[#333333] bg-[#0a0a0a]"
                      >
                        <DrawingFigureMedia
                          src={src}
                          alt={`${project.title} — ${kind} — ${fileLabel}`}
                          isPdf={isPdfPath(src)}
                          fileLabel={fileLabel}
                        />
                        <figcaption className="border-t border-[#333333] px-4 py-3 font-mono text-[10px] tracking-wide text-[#AAAAAA]">
                          <span className="text-white/90">{fileLabel}</span>
                          {sheet.images.length > 1 ? (
                            <span className="mt-1 block normal-case tracking-normal text-[#888888]">
                              {index + 1} of {sheet.images.length} in {kind}
                            </span>
                          ) : null}
                        </figcaption>
                      </motion.figure>
                    )
                  })}
                </div>
              )}
            </motion.div>
          </div>

          <div className="mt-24">
            <Footer />
          </div>
        </main>
      </PageTransition>
    </>
  )
}

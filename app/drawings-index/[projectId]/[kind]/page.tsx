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

function DrawingFigureMedia({
  src,
  alt,
  isPdf,
}: {
  src: string
  alt: string
  isPdf: boolean
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isFs, setIsFs] = useState(false)

  useEffect(() => {
    const sync = () => {
      setIsFs(getFullscreenElement() === containerRef.current)
    }
    document.addEventListener("fullscreenchange", sync)
    document.addEventListener("webkitfullscreenchange", sync as EventListener)
    return () => {
      document.removeEventListener("fullscreenchange", sync)
      document.removeEventListener("webkitfullscreenchange", sync as EventListener)
    }
  }, [])

  const toggleFullscreen = useCallback(async () => {
    const el = containerRef.current
    if (!el) return
    if (getFullscreenElement() === el) {
      await exitFullscreenDoc()
    } else {
      await requestFullscreenEl(el).catch(() => {})
    }
  }, [])

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
          isFs ? "min-h-screen justify-stretch" : ""
        )}
      >
        {isPdf ? (
          isFs ? (
            <iframe
              key={pdfSrc}
              title={alt}
              src={pdfSrc}
              className="min-h-0 w-full flex-1 border-0 bg-black"
            />
          ) : (
            /* ~ANSI B / tabloid landscape (11×8.5) — matches many sheets so Chrome’s #view=Fit leaves little grey inside the iframe */
            <div className="relative aspect-[11/8.5] w-full">
              <iframe
                key={pdfSrc}
                title={alt}
                src={pdfSrc}
                className="absolute inset-0 h-full w-full border-0 bg-black"
              />
            </div>
          )
        ) : (
          <div
            className={cn(
              "relative w-full",
              isFs ? "min-h-0 flex-1" : "aspect-[4/3]"
            )}
          >
            <Image
              src={src}
              alt={alt}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        )}
        <div className="absolute right-2 top-2 z-[1] flex gap-2">
          <button
            type="button"
            onClick={() => void toggleFullscreen()}
            className="border border-[#333333] bg-black/90 px-3 py-2 font-mono text-[10px] uppercase tracking-wide text-white backdrop-blur-sm transition-colors hover:border-white hover:text-white"
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
                  Drawings index
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
                      Drawings index
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
                  <span>Sheet: {sheet.sheetNumber}</span>
                </div>
              </header>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {sheet.images.map((src, index) => (
                  <motion.figure
                    key={`${src}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.06 }}
                    className="border border-[#333333] bg-[#0a0a0a]"
                  >
                    <DrawingFigureMedia
                      src={src}
                      alt={`${project.title} — ${kind} — ${index + 1}`}
                      isPdf={isPdfPath(src)}
                    />
                    <figcaption className="border-t border-[#333333] px-4 py-3 font-mono text-[10px] uppercase tracking-wide text-[#AAAAAA]">
                      {kind}{" "}
                      {sheet.images.length > 1
                        ? `— ${index + 1} / ${sheet.images.length}`
                        : ""}
                    </figcaption>
                  </motion.figure>
                ))}
              </div>
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

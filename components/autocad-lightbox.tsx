"use client"

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react"
import type { AutoCADFile } from "@/lib/autocad-data"
import {
  exitFullscreenDoc,
  getFullscreenElement,
  requestFullscreenEl,
  useImmersiveFullscreenFallback,
} from "@/lib/fullscreen"
import { cn, isPdfPath, pdfIframeSrc } from "@/lib/utils"
import { PdfSheetPreview } from "./pdf-sheet-preview-lazy"

interface AutoCADLightboxProps {
  files: AutoCADFile[]
  currentIndex: number
  onClose: () => void
  onNext: () => void
  onPrev: () => void
}

export function AutoCADLightbox({
  files,
  currentIndex,
  onClose,
  onNext,
  onPrev,
}: AutoCADLightboxProps) {
  const current = files[currentIndex]
  const containerRef = useRef<HTMLDivElement>(null)
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null)
  const [nativeFs, setNativeFs] = useState(false)
  const [immersiveFs, setImmersiveFs] = useState(false)
  const immersiveFallback = useMemo(() => useImmersiveFullscreenFallback(), [])

  const isFs = nativeFs || immersiveFs

  useLayoutEffect(() => {
    setPortalRoot(document.body)
  }, [])

  const closeViewer = useCallback(async () => {
    setImmersiveFs(false)
    await exitFullscreenDoc()
    onClose()
  }, [onClose])

  useLayoutEffect(() => {
    const el = containerRef.current
    if (!el) return

    let cancelled = false

    ;(async () => {
      if (immersiveFallback) {
        if (!cancelled) setImmersiveFs(true)
        return
      }
      try {
        await requestFullscreenEl(el)
      } catch {
        if (!cancelled) setImmersiveFs(true)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [immersiveFallback])

  useEffect(() => {
    const sync = () => {
      setNativeFs(getFullscreenElement() === containerRef.current)
    }
    document.addEventListener("fullscreenchange", sync)
    document.addEventListener("webkitfullscreenchange", sync as EventListener)
    return () => {
      document.removeEventListener("fullscreenchange", sync)
      document.removeEventListener(
        "webkitfullscreenchange",
        sync as EventListener
      )
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

  useEffect(() => {
    return () => {
      void exitFullscreenDoc()
    }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        void closeViewer()
        return
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault()
        onPrev()
        return
      }
      if (e.key === "ArrowRight") {
        e.preventDefault()
        onNext()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [closeViewer, onNext, onPrev])

  if (!current || !portalRoot) return null

  const sheetSrc = current.sheetUrl
  const sheetIsPdf = isPdfPath(sheetSrc)
  const pdfFullscreenSrc = sheetIsPdf
    ? pdfIframeSrc(sheetSrc, { view: "Fit", compactUi: false })
    : sheetSrc

  return createPortal(
    <AnimatePresence>
      <motion.div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-label={current.title}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "flex flex-col bg-black pt-[4.5rem] text-white",
          immersiveFs
            ? "fixed inset-0 z-[350] max-h-[100dvh] overscroll-none"
            : "fixed inset-0 z-[350]",
          nativeFs && !immersiveFs && "min-h-screen"
        )}
      >
        <div className="relative z-30 flex shrink-0 items-center gap-3 border-b border-[#333333] px-3 py-2.5 md:px-4 md:py-3">
          <button
            type="button"
            onClick={() => void closeViewer()}
            className="inline-flex shrink-0 touch-manipulation items-center gap-2 border border-[#333333] bg-black/95 px-3 py-2 font-mono text-[10px] uppercase tracking-wide text-white transition-colors hover:border-white hover:text-white active:bg-white/10 md:text-xs"
            aria-label="Back to drawings"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            Back
          </button>
          <p className="min-w-0 flex-1 truncate font-mono text-[11px] font-medium uppercase tracking-wide md:text-xs">
            {current.title}
          </p>
          {files.length > 1 ? (
            <p className="shrink-0 font-mono text-[10px] text-[#AAAAAA]">
              {currentIndex + 1} / {files.length}
            </p>
          ) : null}
        </div>

        <div className="relative min-h-0 flex-1">
          {sheetIsPdf ? (
            <iframe
              key={pdfFullscreenSrc}
              title={current.title}
              src={pdfFullscreenSrc}
              className="absolute inset-0 h-full w-full border-0 bg-[#f7f6f3]"
            />
          ) : (
            <PdfSheetPreview src={sheetSrc} fit="contain" />
          )}

          {files.length > 1 ? (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onPrev()
                }}
                className="absolute top-1/2 left-2 z-20 inline-flex h-12 w-12 -translate-y-1/2 touch-manipulation items-center justify-center rounded-md bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-black/80 md:left-4"
                data-clickable="true"
                aria-label="Previous"
              >
                <ChevronLeft className="h-7 w-7" aria-hidden />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onNext()
                }}
                className="absolute top-1/2 right-2 z-20 inline-flex h-12 w-12 -translate-y-1/2 touch-manipulation items-center justify-center rounded-md bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-black/80 md:right-4"
                data-clickable="true"
                aria-label="Next"
              >
                <ChevronRight className="h-7 w-7" aria-hidden />
              </button>
            </>
          ) : null}
        </div>
      </motion.div>
    </AnimatePresence>,
    portalRoot
  )
}

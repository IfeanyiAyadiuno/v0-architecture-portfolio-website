"use client"

import { useEffect, useLayoutEffect, useState } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import type { AutoCADFile } from "@/lib/autocad-data"
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
  const [container, setContainer] = useState<HTMLElement | null>(null)

  useLayoutEffect(() => {
    setContainer(document.body)
  }, [])

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        onClose()
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
  }, [onClose, onNext, onPrev])

  if (!current || !container) return null

  return createPortal(
    <AnimatePresence>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={current.title}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[350] flex flex-col bg-black"
        onClick={onClose}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onClose()
          }}
          className="fixed top-[calc(env(safe-area-inset-top,0px)+5.25rem)] right-3 z-[360] inline-flex h-12 w-12 touch-manipulation items-center justify-center rounded-md text-white transition-colors hover:bg-white/10 hover:text-[#AAAAAA] active:bg-white/15 md:right-5 md:top-[calc(env(safe-area-inset-top,0px)+4.75rem)]"
          data-clickable="true"
          aria-label="Close"
        >
          <X className="pointer-events-none h-6 w-6 shrink-0" aria-hidden />
        </button>

        {files.length > 1 ? (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onPrev()
              }}
              className="fixed top-1/2 left-2 z-[360] inline-flex h-14 w-14 -translate-y-1/2 touch-manipulation items-center justify-center rounded-md text-white transition-colors hover:bg-white/10 hover:text-[#AAAAAA] active:bg-white/15 md:left-4"
              data-clickable="true"
              aria-label="Previous"
            >
              <ChevronLeft className="pointer-events-none h-8 w-8 shrink-0" aria-hidden />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onNext()
              }}
              className="fixed top-1/2 right-2 z-[360] inline-flex h-14 w-14 -translate-y-1/2 touch-manipulation items-center justify-center rounded-md text-white transition-colors hover:bg-white/10 hover:text-[#AAAAAA] active:bg-white/15 md:right-4"
              data-clickable="true"
              aria-label="Next"
            >
              <ChevronRight className="pointer-events-none h-8 w-8 shrink-0" aria-hidden />
            </button>
          </>
        ) : null}

        <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-6 pt-[calc(env(safe-area-inset-top,0px)+6.5rem)] md:px-6 md:pt-24">
          <motion.div
            key={current.id}
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.98, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="relative h-[min(70dvh,720px)] w-full max-w-5xl overflow-hidden border border-[#333333] bg-[#f7f6f3]"
            onClick={(e) => e.stopPropagation()}
          >
            <PdfSheetPreview src={current.sheetUrl} />
          </motion.div>
        </div>

        <motion.div
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.35 }}
          className="shrink-0 border-t border-[#333333] px-4 py-5 text-center md:px-6"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="font-mono text-sm text-white">
            {current.title} — AutoCAD — {current.year}
          </p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-wide text-[#666666]">
            Black &amp; white sheet
          </p>
          {current.description ? (
            <p className="mx-auto mt-2 max-w-xl font-sans text-sm text-[#AAAAAA]">
              {current.description}
            </p>
          ) : null}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={current.coverUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex border border-[#333333] px-4 py-2 font-mono text-xs uppercase tracking-wide text-white transition-colors hover:border-white"
              data-clickable="true"
            >
              Coloured PDF
            </Link>
            <Link
              href={current.sheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex border border-[#333333] px-4 py-2 font-mono text-xs uppercase tracking-wide text-white transition-colors hover:border-white"
              data-clickable="true"
            >
              B&amp;W PDF
            </Link>
          </div>
          {files.length > 1 ? (
            <p className="mt-3 font-mono text-xs text-[#AAAAAA]">
              {currentIndex + 1} / {files.length}
            </p>
          ) : null}
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    container
  )
}

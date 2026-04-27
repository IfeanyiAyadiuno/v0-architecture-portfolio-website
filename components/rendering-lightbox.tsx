"use client"

import { useEffect, useLayoutEffect, useState } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import type { Rendering } from "@/lib/data"

interface RenderingLightboxProps {
  works: Rendering[]
  currentIndex: number
  onClose: () => void
  onNext: () => void
  onPrev: () => void
}

export function RenderingLightbox({
  works,
  currentIndex,
  onClose,
  onNext,
  onPrev,
}: RenderingLightboxProps) {
  const current = works[currentIndex]
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
        aria-label="Rendering"
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

        <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-6 pt-[calc(env(safe-area-inset-top,0px)+6.5rem)] md:px-6 md:pt-24">
          <motion.div
            key={current.id}
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.94, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="relative h-[min(70dvh,720px)] w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={current.image}
              alt={current.title}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
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
            {current.title} — {current.type} — {current.software} — {current.year}
          </p>
          <p className="mt-2 font-mono text-xs text-[#AAAAAA]">
            {currentIndex + 1} / {works.length}
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    container
  )
}

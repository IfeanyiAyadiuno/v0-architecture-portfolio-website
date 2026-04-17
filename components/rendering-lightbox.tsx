"use client"

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
  if (!current) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[110] flex flex-col bg-black"
        onClick={onClose}
      >
        <div className="relative flex flex-1 items-center justify-center p-6">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onClose()
            }}
            className="absolute right-6 top-6 z-10 p-2 text-white transition-colors hover:text-[#AAAAAA]"
            data-clickable="true"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onPrev()
            }}
            className="absolute left-6 top-1/2 z-10 -translate-y-1/2 p-2 text-white transition-colors hover:text-[#AAAAAA]"
            data-clickable="true"
            aria-label="Previous"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onNext()
            }}
            className="absolute right-6 top-1/2 z-10 -translate-y-1/2 p-2 text-white transition-colors hover:text-[#AAAAAA]"
            data-clickable="true"
            aria-label="Next"
          >
            <ChevronRight className="h-8 w-8" />
          </button>

          <motion.div
            key={current.id}
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.94, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="relative h-[min(70vh,720px)] w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={current.image}
              alt={current.title}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </motion.div>
        </div>

        <motion.div
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.35 }}
          className="border-t border-[#333333] px-6 py-5 text-center"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="font-mono text-sm text-white">
            {current.title} — {current.type} — {current.software} —{" "}
            {current.year}
          </p>
          <p className="mt-2 font-mono text-xs text-[#AAAAAA]">
            {currentIndex + 1} / {works.length}
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

"use client"

import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import type { ArtistWork } from "@/lib/data"

interface LightboxProps {
  works: ArtistWork[]
  currentIndex: number
  onClose: () => void
  onNext: () => void
  onPrev: () => void
}

export function Lightbox({ works, currentIndex, onClose, onNext, onPrev }: LightboxProps) {
  const currentWork = works[currentIndex]
  if (!currentWork) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-black z-[100] flex flex-col"
        onClick={onClose}
      >
        <div className="flex-1 flex items-center justify-center p-6 relative">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onClose()
            }}
            className="absolute top-6 right-6 z-10 p-2 text-white hover:text-[#AAAAAA] transition-colors"
            data-clickable="true"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              onPrev()
            }}
            className="absolute left-6 top-1/2 -translate-y-1/2 p-2 text-white hover:text-[#AAAAAA] transition-colors"
            data-clickable="true"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              onNext()
            }}
            className="absolute right-6 top-1/2 -translate-y-1/2 p-2 text-white hover:text-[#AAAAAA] transition-colors"
            data-clickable="true"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          <motion.div
            key={currentWork.id}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative max-w-4xl max-h-[70vh] w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={currentWork.image}
              alt={currentWork.title}
              fill
              className="object-contain"
            />
          </motion.div>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="p-6 text-center"
        >
          <p className="font-mono text-sm text-white">
            {currentWork.title} — {currentWork.medium} — {currentWork.dimensions} — {currentWork.year}
          </p>
          <p className="font-mono text-xs text-[#AAAAAA] mt-2">
            {currentIndex + 1} / {works.length}
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

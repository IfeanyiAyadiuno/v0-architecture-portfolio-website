"use client"

import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { X } from "lucide-react"
import type { Project } from "@/lib/data"

interface DrawingModalProps {
  project: Project | null
  onClose: () => void
}

export function DrawingModal({ project, onClose }: DrawingModalProps) {
  if (!project) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative max-w-5xl w-full bg-black border border-[#333333]"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 text-white hover:text-[#AAAAAA] transition-colors"
            data-clickable="true"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="aspect-[4/3] relative">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-contain"
            />
          </div>

          <div className="p-6 border-t border-[#333333]">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold uppercase tracking-[0.05em] text-white">
                  {project.title}
                </h3>
                <p className="font-mono text-sm text-[#AAAAAA] mt-1">
                  {project.drawingType} — {project.year}
                </p>
              </div>
              <div className="font-mono text-xs text-[#AAAAAA] uppercase text-right space-y-1">
                <p>Scale: {project.scale}</p>
                <p>Software: {project.software}</p>
                <p>Sheet: {project.sheetNumber}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

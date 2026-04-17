"use client"

import { useMemo } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { ArrowRight, X } from "lucide-react"
import {
  DRAWING_KINDS,
  coverImageForProject,
  type DrawingProject,
  kindToSlug,
} from "@/lib/data"

interface DrawingModalProps {
  project: DrawingProject | null
  onClose: () => void
}

/** Choose drawing type (stacked controls); navigates to `/drawings-index/[id]/[slug]`. */
export function DrawingModal({ project, onClose }: DrawingModalProps) {
  const router = useRouter()

  const availableKinds = useMemo(() => {
    if (!project) return []
    return DRAWING_KINDS.filter((k) => project.drawings[k])
  }, [project])

  if (!project) return null

  const categoryLabel =
    project.category === "commercial" ? "Commercial" : "Residential"

  const openKind = (slug: string) => {
    onClose()
    router.push(`/drawings-index/${project.id}/${slug}`)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 md:p-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.96, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative w-full max-w-4xl border border-[#333333] bg-black"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 p-2 text-white transition-colors hover:text-[#AAAAAA]"
            data-clickable="true"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="flex flex-col gap-10 p-6 pt-16 md:flex-row md:items-stretch md:gap-12 md:p-10 md:pt-10">
            <div className="min-w-0 flex-1 space-y-4">
              <div className="relative aspect-[4/3] w-full max-w-xl bg-[#0a0a0a]">
                <Image
                  src={coverImageForProject(project)}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold uppercase tracking-[0.05em] text-white md:text-2xl">
                  {project.title}
                </h3>
                <p className="mt-2 font-mono text-sm text-[#AAAAAA]">
                  {project.year} — {categoryLabel}
                </p>
              </div>
            </div>

            <div
              className="flex w-full flex-col justify-center border-t border-[#333333] pt-8 md:w-[min(100%,300px)] md:border-l md:border-t-0 md:pl-10 md:pt-0"
              role="group"
              aria-label="Drawing type"
            >
              <p className="mb-4 font-mono text-xs uppercase tracking-[0.12em] text-[#AAAAAA]">
                Drawing type
              </p>
              {availableKinds.length === 0 ? (
                <p className="font-mono text-sm text-[#666666]">
                  No drawings available for this project.
                </p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {availableKinds.map((k) => (
                    <li key={k}>
                      <button
                        type="button"
                        onClick={() => openKind(kindToSlug(k))}
                        className="group flex w-full items-center justify-between border border-[#333333] bg-black px-4 py-3.5 text-left font-mono text-xs uppercase tracking-[0.1em] text-[#AAAAAA] transition-colors duration-300 hover:border-white hover:text-white"
                        data-clickable="true"
                      >
                        <span>{k}</span>
                        <ArrowRight className="h-4 w-4 shrink-0 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

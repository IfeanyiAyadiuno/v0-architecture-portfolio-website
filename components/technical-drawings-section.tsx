"use client"

import { Suspense, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useReducedMotion } from "framer-motion"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowRight, ChevronDown } from "lucide-react"
import {
  commercialProjects,
  getDrawingProjectById,
  type DrawingProject,
} from "@/lib/data"
import { DrawingModal } from "./drawing-modal"
import { DrawingProjectCard } from "./drawing-project-card"

const TECHNOLOGIST_PATH = "/technologist"

function DrawingGrid({
  projects,
  onSelect,
}: {
  projects: DrawingProject[]
  onSelect: (project: DrawingProject) => void
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08, duration: 0.45 }}
          >
            <DrawingProjectCard
              project={project}
              onSelect={onSelect}
              sizes="(max-width: 1024px) 50vw, 25vw"
            />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function TechnicalDrawingsSectionInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const reduceMotion = useReducedMotion()
  const [selectedProject, setSelectedProject] = useState<DrawingProject | null>(
    null
  )

  useEffect(() => {
    const raw = searchParams.get("project")
    if (raw == null || raw === "") return
    const id = Number(raw)
    if (!Number.isFinite(id)) return
    const p = getDrawingProjectById(id)
    if (!p) return
    setSelectedProject(p)
    router.replace(TECHNOLOGIST_PATH, { scroll: false })
  }, [searchParams, router])

  return (
    <section id="drawings" className="relative scroll-mt-28 px-6 py-12 md:py-16">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8 md:mb-10"
        >
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-4xl font-bold uppercase tracking-[0.05em] text-white md:text-5xl lg:text-6xl">
            Architectural Technologist
          </h2>
          <p className="mt-4 font-sans text-lg text-[#AAAAAA]">
            SHOP DRAWINGS - AUTOCAD DETAILS - RENDERINGS
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-6 md:mb-8"
        >
          <h3 className="mb-4 font-mono text-xs uppercase tracking-[0.15em] text-[#AAAAAA] md:mb-5">
            Shop Drawings
          </h3>
        </motion.div>

        <DrawingGrid
          projects={commercialProjects}
          onSelect={setSelectedProject}
        />

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ delay: 0.2, duration: 0.45 }}
          className="mt-8 border border-[#333333] bg-black/30 px-5 py-4 md:px-6 md:py-5"
        >
          <Link
            href="/glazing-simulator"
            className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-white transition-colors hover:text-[#AAAAAA] md:text-sm"
            data-clickable="true"
          >
            CHECK OUT MY GLAZING SIMULATOR
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mt-10 flex justify-center md:mt-12"
      >
        <Link
          href="#autocad"
          data-clickable="true"
          className="group flex flex-col items-center gap-2 outline-none transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          <span className="sr-only">Scroll to AutoCAD work</span>
          <span
            aria-hidden
            className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#AAAAAA] transition-colors group-hover:text-white/90"
          >
            Scroll
          </span>
          <motion.span
            aria-hidden
            className="flex flex-col items-center text-white/80 transition-colors group-hover:text-white"
            animate={reduceMotion ? { y: 0 } : { y: [0, 6, 0] }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
            }
          >
            <ChevronDown className="h-6 w-6" strokeWidth={1.5} />
          </motion.span>
        </Link>
      </motion.div>

      {selectedProject && (
        <DrawingModal
          project={selectedProject}
          linkKindReturnToIndexModal
          kindReturnOrigin="technologist"
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  )
}

export function TechnicalDrawingsSection() {
  return (
    <Suspense fallback={null}>
      <TechnicalDrawingsSectionInner />
    </Suspense>
  )
}

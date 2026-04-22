"use client"

import { Suspense, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useRouter, useSearchParams } from "next/navigation"
import {
  commercialProjects,
  getDrawingProjectById,
  type DrawingProject,
} from "@/lib/data"
import { DrawingModal } from "./drawing-modal"
import { DrawingProjectCard } from "./drawing-project-card"

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
    router.replace("/", { scroll: false })
  }, [searchParams, router])

  return (
    <section id="drawings" className="scroll-mt-28 px-6 py-12 md:py-16">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8 md:mb-10"
        >
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-4xl font-bold uppercase tracking-[0.05em] text-white md:text-5xl lg:text-6xl">
            Junior Technologist
          </h2>
          <p className="mt-4 font-sans text-lg text-[#AAAAAA]">
            Technical Drawings + Renderings
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
            Technical Drawings
          </h3>
        </motion.div>

        <DrawingGrid
          projects={commercialProjects}
          onSelect={setSelectedProject}
        />
      </div>

      {selectedProject && (
        <DrawingModal
          project={selectedProject}
          linkKindReturnToIndexModal
          kindReturnOrigin="home"
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

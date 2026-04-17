"use client"

import { Suspense, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useRouter, useSearchParams } from "next/navigation"
import {
  commercialProjects,
  residentialProjects,
  getDrawingProjectById,
  type DrawingProject,
} from "@/lib/data"
import { DrawingModal } from "./drawing-modal"
import { DrawingProjectCard } from "./drawing-project-card"

function DrawingGrid({
  title,
  projects,
  onSelect,
}: {
  title: string
  projects: DrawingProject[]
  onSelect: (project: DrawingProject) => void
}) {
  return (
    <div className="space-y-6">
      <h4 className="font-mono text-xs uppercase tracking-[0.1em] text-[#AAAAAA]">
        {title}
      </h4>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
    <section className="px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
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
          className="mb-12"
        >
          <h3 className="mb-8 font-mono text-xs uppercase tracking-[0.15em] text-[#AAAAAA]">
            Technical Drawings
          </h3>
        </motion.div>

        <div
          className={
            residentialProjects.length > 0
              ? "relative grid grid-cols-1 gap-12 lg:grid-cols-2"
              : "mx-auto max-w-3xl"
          }
        >
          <DrawingGrid
            title="Commercial"
            projects={commercialProjects}
            onSelect={setSelectedProject}
          />

          {residentialProjects.length > 0 ? (
            <>
              <motion.div
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                className="absolute bottom-0 left-1/2 top-0 hidden w-px origin-top bg-white/25 lg:block"
              />

              <DrawingGrid
                title="Residential"
                projects={residentialProjects}
                onSelect={setSelectedProject}
              />
            </>
          ) : null}
        </div>
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

"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import {
  commercialProjects,
  residentialProjects,
  coverImageForProject,
  type DrawingProject,
} from "@/lib/data"
import { DrawingModal } from "./drawing-modal"
import { FxCardShine } from "./fx-card-shine"

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
      <div className="grid grid-cols-2 gap-5">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="group relative aspect-square overflow-hidden border border-[#333333] bg-black transition-colors duration-300 hover:border-white"
            onClick={() => onSelect(project)}
            data-clickable="true"
          >
            <Image
              src={coverImageForProject(project)}
              alt={project.title}
              fill
              className="object-cover opacity-70 transition-all duration-300 group-hover:scale-[1.02] group-hover:opacity-100"
            />
            <FxCardShine />
            <div className="absolute inset-0 z-[15] flex items-end bg-black/60 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <p className="font-mono text-xs uppercase tracking-wide text-white">
                {project.title} — {project.year}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export function TechnicalDrawingsSection() {
  const [selectedProject, setSelectedProject] = useState<DrawingProject | null>(
    null
  )

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

        <div className="relative grid grid-cols-1 gap-12 lg:grid-cols-2">
          <DrawingGrid
            title="Commercial"
            projects={commercialProjects}
            onSelect={setSelectedProject}
          />

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
        </div>
      </div>

      {selectedProject && (
        <DrawingModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  )
}

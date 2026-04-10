"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { commercialProjects, residentialProjects, type Project } from "@/lib/data"
import { DrawingModal } from "./drawing-modal"

function DrawingGrid({
  title,
  projects,
  onSelect,
}: {
  title: string
  projects: Project[]
  onSelect: (project: Project) => void
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
            className="group relative aspect-square bg-black border border-[#333333] hover:border-white transition-colors duration-300 overflow-hidden"
            onClick={() => onSelect(project)}
            data-clickable="true"
          >
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover opacity-70 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-300"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <p className="font-mono text-xs text-white uppercase tracking-wide">
                {project.title} — {project.year} — {project.drawingType}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export function TechnicalDrawingsSection() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-[0.05em] text-white">
            Junior Technologist
          </h2>
          <p className="font-sans text-lg text-[#AAAAAA] mt-4">
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
          <h3 className="font-mono text-xs uppercase tracking-[0.15em] text-[#AAAAAA] mb-8">
            Technical Drawings
          </h3>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative">
          <DrawingGrid
            title="Commercial"
            projects={commercialProjects}
            onSelect={setSelectedProject}
          />

          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-white/20" />

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

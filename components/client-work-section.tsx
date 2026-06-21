"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { clientProjects, type ClientProject, type ArtistWork } from "@/lib/data"
import { Lightbox } from "./lightbox"

function projectToLightboxWorks(project: ClientProject): ArtistWork[] {
  if (project.images.length === 0) return []

  return project.images.map((image, index) => ({
    id: index + 1,
    category: "personal" as const,
    title: project.title,
    medium: project.type,
    dimensions: project.client,
    year: project.year,
    image: image.src,
    client: project.client,
    role: project.role,
    projectType: project.type,
  }))
}

function ClientProjectCard({
  project,
  index,
  onSelect,
}: {
  project: ClientProject
  index: number
  onSelect: (project: ClientProject) => void
}) {
  const hasCover = Boolean(project.cover)
  const hasGallery = project.images.length > 0
  const isInteractive = hasCover || hasGallery

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.45 }}
    >
      <button
        type="button"
        onClick={() => isInteractive && onSelect(project)}
        disabled={!isInteractive}
        data-clickable={isInteractive ? "true" : undefined}
        className="group relative block w-full overflow-hidden border border-[#333333] text-left outline-none transition-[border-color,opacity] duration-300 hover:border-white focus-visible:border-white focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:cursor-default"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-[#0a0a0a]">
          {hasCover ? (
            <Image
              src={project.cover!}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          ) : (
            <div
              className="absolute inset-0 bg-[linear-gradient(145deg,#111111_0%,#0a0a0a_45%,#151515_100%)]"
              aria-hidden
            />
          )}

          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,rgba(0,0,0,0.85)_100%)]"
            aria-hidden
          />

          <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#888888]">
              {String(index + 1).padStart(2, "0")} · {project.type}
            </p>
            <h3 className="mt-2 font-[family-name:var(--font-space-grotesk)] text-xl font-bold uppercase tracking-[0.04em] text-white md:text-2xl">
              {project.title}
            </h3>
            <p className="mt-2 font-mono text-xs text-[#AAAAAA]">{project.client}</p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-wide text-[#666666]">
              {project.role} · {project.year}
            </p>
          </div>
        </div>
      </button>
    </motion.div>
  )
}

export function ClientWorkSection() {
  const [lightboxWorks, setLightboxWorks] = useState<ArtistWork[] | null>(null)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const openProject = (project: ClientProject) => {
    const works = projectToLightboxWorks(project)
    if (works.length === 0) return
    setLightboxWorks(works)
    setLightboxIndex(0)
  }

  const closeLightbox = () => setLightboxWorks(null)

  const goNext = () => {
    if (!lightboxWorks) return
    setLightboxIndex((lightboxIndex + 1) % lightboxWorks.length)
  }

  const goPrev = () => {
    if (!lightboxWorks) return
    setLightboxIndex(
      (lightboxIndex - 1 + lightboxWorks.length) % lightboxWorks.length
    )
  }

  return (
    <section id="client-work" className="scroll-mt-28 px-6 py-12 md:py-16">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.35 }}
          className="mb-8 md:mb-10"
        >
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-4xl font-bold uppercase tracking-[0.05em] text-white md:text-5xl lg:text-6xl">
            Client Work
          </h2>
          <p className="mt-4 max-w-2xl font-sans text-lg text-[#AAAAAA]">
            Ad direction, spatial design, and creative direction for brands,
            shows, and collaborators.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
          {clientProjects.map((project, index) => (
            <ClientProjectCard
              key={project.id}
              project={project}
              index={index}
              onSelect={openProject}
            />
          ))}
        </div>
      </div>

      {lightboxWorks && lightboxWorks.length > 0 && (
        <Lightbox
          works={lightboxWorks}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onNext={goNext}
          onPrev={goPrev}
          variant="client"
        />
      )}
    </section>
  )
}

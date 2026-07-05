"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { motion } from "framer-motion"
import { TrimmedImage } from "./trimmed-image"
import type { ClientProject } from "@/lib/client-work-data"
import type { ArtistWork } from "@/lib/data"
import { useClientProjects } from "@/hooks/use-client-projects"
import { useMounted } from "@/hooks/use-mounted"

const ClientMagazineViewer = dynamic(
  () =>
    import("./client-magazine-viewer").then((m) => m.ClientMagazineViewer),
  { ssr: false }
)

const Lightbox = dynamic(
  () => import("./lightbox").then((m) => m.Lightbox),
  { ssr: false }
)

function projectToLightboxWorks(project: ClientProject): ArtistWork[] {
  const imageMedia = project.images.filter((item) => item.type === "image")
  if (imageMedia.length === 0) return []

  return imageMedia.map((image, index) => ({
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
  const mounted = useMounted()
  const hasCover = Boolean(project.cover)
  const hasGallery = project.images.length > 0
  const isInteractive = hasCover || hasGallery

  return (
    <motion.div
      initial={mounted ? { opacity: 0, y: 24 } : false}
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
        {hasCover ? (
          <div className="relative w-full leading-none">
            <TrimmedImage
              src={project.cover!}
              alt={project.title}
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={index < 2}
              className="block h-auto w-full transition-transform duration-500 group-hover:scale-[1.005]"
            />
          </div>
        ) : (
          <div
            className="aspect-[4/3] w-full bg-[linear-gradient(145deg,#111111_0%,#0a0a0a_45%,#151515_100%)]"
            aria-hidden
          />
        )}

        <div className="border-t border-[#222222] p-5 md:p-6">
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
      </button>
    </motion.div>
  )
}

export function ClientWorkSection({
  initialProjects,
}: {
  initialProjects?: ClientProject[]
} = {}) {
  const mounted = useMounted()
  const { projects, loading, error } = useClientProjects(initialProjects)
  const [magazineProject, setMagazineProject] = useState<ClientProject | null>(null)
  const [lightboxWorks, setLightboxWorks] = useState<ArtistWork[] | null>(null)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const openProject = (project: ClientProject) => {
    if (project.displayMode === "magazine") {
      if (project.images.length === 0 && !project.cover) return
      setMagazineProject(project)
      return
    }

    const works = projectToLightboxWorks(project)
    if (works.length === 0) return
    setLightboxWorks(works)
    setLightboxIndex(0)
  }

  const closeMagazine = () => setMagazineProject(null)

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
          initial={mounted ? { opacity: 0, y: 16 } : false}
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

        {loading ? (
          <p className="font-mono text-sm text-[#666666]">Loading client work…</p>
        ) : error ? (
          <p className="font-mono text-sm text-[#888888]">{error}</p>
        ) : projects.length === 0 ? (
          <p className="font-mono text-sm text-[#666666]">
            Add project folders under{" "}
            <span className="text-[#AAAAAA]">public/art/CLIENT/</span>
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
            {projects.map((project, index) => (
              <ClientProjectCard
                key={project.id}
                project={project}
                index={index}
                onSelect={openProject}
              />
            ))}
          </div>
        )}
      </div>

      {magazineProject ? (
        <ClientMagazineViewer project={magazineProject} onClose={closeMagazine} />
      ) : null}

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

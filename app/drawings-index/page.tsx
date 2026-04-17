"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence, LayoutGroup } from "framer-motion"
import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { CustomCursor } from "@/components/custom-cursor"
import { Footer } from "@/components/footer"
import { PageTransition } from "@/components/page-transition"
import { DrawingModal } from "@/components/drawing-modal"
import {
  allDrawingProjects,
  commercialProjects,
  residentialProjects,
  coverImageForProject,
  DRAWING_KINDS,
  type DrawingKind,
  type DrawingProject,
} from "@/lib/data"
import { ChevronDown } from "lucide-react"

const filterOptions = [
  "All",
  "Commercial",
  "Residential",
  "Plan",
  "Section",
  "Elevation",
  "Detail",
] as const

const sortOptions = [
  { label: "Project", value: "title" as const },
  { label: "Year", value: "year" as const },
]

function isDrawingKind(value: string): value is DrawingKind {
  return (DRAWING_KINDS as readonly string[]).includes(value)
}

export default function DrawingsIndexPage() {
  const [activeFilter, setActiveFilter] = useState<string>("All")
  const [sortBy, setSortBy] = useState<"title" | "year">("title")
  const [selectedProject, setSelectedProject] = useState<DrawingProject | null>(
    null
  )
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false)

  const filteredAndSortedProjects = useMemo(() => {
    let filtered: DrawingProject[] = [...allDrawingProjects]

    if (activeFilter === "Commercial") {
      filtered = commercialProjects
    } else if (activeFilter === "Residential") {
      filtered = residentialProjects
    } else if (activeFilter !== "All" && isDrawingKind(activeFilter)) {
      filtered = allDrawingProjects.filter((p) => p.drawings[activeFilter])
    }

    return [...filtered].sort((a, b) => {
      if (sortBy === "year") {
        return b.year.localeCompare(a.year)
      }
      return a.title.localeCompare(b.title)
    })
  }, [activeFilter, sortBy])

  return (
    <>
      <CustomCursor />
      <Navigation />
      <PageTransition>
        <main className="min-h-screen bg-black pt-24">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <h1 className="mb-8 font-[family-name:var(--font-space-grotesk)] text-3xl font-bold uppercase tracking-[0.05em] text-white md:text-4xl">
                Drawings Index
              </h1>

              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <LayoutGroup>
                  <div className="flex flex-wrap gap-2">
                    {filterOptions.map((filter) => (
                      <motion.button
                        key={filter}
                        layout
                        onClick={() => setActiveFilter(filter)}
                        className={`relative px-4 py-2 font-mono text-xs uppercase tracking-wide transition-colors ${
                          activeFilter === filter
                            ? "text-black"
                            : "text-[#AAAAAA] hover:text-white"
                        }`}
                        data-clickable="true"
                      >
                        {activeFilter === filter && (
                          <motion.div
                            layoutId="activeFilter"
                            className="absolute inset-0 bg-white"
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 30,
                            }}
                          />
                        )}
                        <span className="relative z-10">{filter}</span>
                      </motion.button>
                    ))}
                  </div>
                </LayoutGroup>

                <div className="relative">
                  <button
                    onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                    className="flex items-center gap-2 border border-[#333333] px-4 py-2 font-mono text-xs uppercase tracking-wide text-[#AAAAAA] transition-colors hover:border-white hover:text-white"
                    data-clickable="true"
                  >
                    Sort: {sortOptions.find((s) => s.value === sortBy)?.label}
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  <AnimatePresence>
                    {sortDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full z-10 mt-2 border border-[#333333] bg-black"
                      >
                        {sortOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              setSortBy(option.value)
                              setSortDropdownOpen(false)
                            }}
                            className={`block w-full px-4 py-2 text-left font-mono text-xs uppercase tracking-wide transition-colors hover:bg-white hover:text-black ${
                              sortBy === option.value
                                ? "text-white"
                                : "text-[#AAAAAA]"
                            }`}
                            data-clickable="true"
                          >
                            {option.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

            <LayoutGroup>
              <motion.div
                layout
                className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4"
              >
                <AnimatePresence mode="popLayout">
                  {filteredAndSortedProjects.map((project) => (
                    <motion.div
                      key={project.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                      className="group"
                      onClick={() => setSelectedProject(project)}
                      data-clickable="true"
                    >
                      <div className="relative aspect-square overflow-hidden border border-[#333333] bg-black transition-colors duration-300 group-hover:border-white">
                        <Image
                          src={coverImageForProject(project)}
                          alt={project.title}
                          fill
                          className="object-cover opacity-70 transition-all duration-300 group-hover:scale-[1.02] group-hover:opacity-100"
                        />
                      </div>
                      <div className="mt-3 space-y-1">
                        <p className="truncate font-mono text-xs text-white">
                          {project.title}
                        </p>
                        <p className="font-mono text-[10px] uppercase text-[#AAAAAA]">
                          {project.year} — {project.category}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </LayoutGroup>

            {filteredAndSortedProjects.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-20 text-center"
              >
                <p className="font-mono text-sm text-[#AAAAAA]">
                  No drawings found for this filter.
                </p>
              </motion.div>
            )}
          </div>

          <div className="mt-20">
            <Footer />
          </div>
        </main>
      </PageTransition>

      {selectedProject && (
        <DrawingModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </>
  )
}

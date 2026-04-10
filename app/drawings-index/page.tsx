"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence, LayoutGroup } from "framer-motion"
import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { CustomCursor } from "@/components/custom-cursor"
import { Footer } from "@/components/footer"
import { PageTransition } from "@/components/page-transition"
import { DrawingModal } from "@/components/drawing-modal"
import { allDrawings, commercialProjects, residentialProjects, type Project } from "@/lib/data"
import { ChevronDown } from "lucide-react"

const filterOptions = [
  "All",
  "Commercial",
  "Residential",
  "Plan",
  "Section",
  "Elevation",
  "Detail",
]

const sortOptions = [
  { label: "Project", value: "title" },
  { label: "Year", value: "year" },
  { label: "Drawing Type", value: "drawingType" },
]

export default function DrawingsIndexPage() {
  const [activeFilter, setActiveFilter] = useState("All")
  const [sortBy, setSortBy] = useState("title")
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false)

  const filteredAndSortedDrawings = useMemo(() => {
    let filtered = [...allDrawings]

    if (activeFilter === "Commercial") {
      filtered = commercialProjects
    } else if (activeFilter === "Residential") {
      filtered = residentialProjects
    } else if (activeFilter !== "All") {
      filtered = allDrawings.filter(
        (d) => d.drawingType.toLowerCase() === activeFilter.toLowerCase()
      )
    }

    return filtered.sort((a, b) => {
      if (sortBy === "year") {
        return b.year.localeCompare(a.year)
      } else if (sortBy === "drawingType") {
        return a.drawingType.localeCompare(b.drawingType)
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
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl md:text-4xl font-bold uppercase tracking-[0.05em] text-white mb-8">
                Drawings Index
              </h1>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
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
                    className="flex items-center gap-2 px-4 py-2 font-mono text-xs uppercase tracking-wide text-[#AAAAAA] hover:text-white border border-[#333333] hover:border-white transition-colors"
                    data-clickable="true"
                  >
                    Sort: {sortOptions.find((s) => s.value === sortBy)?.label}
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  <AnimatePresence>
                    {sortDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full mt-2 bg-black border border-[#333333] z-10"
                      >
                        {sortOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              setSortBy(option.value)
                              setSortDropdownOpen(false)
                            }}
                            className={`block w-full px-4 py-2 font-mono text-xs uppercase tracking-wide text-left hover:bg-white hover:text-black transition-colors ${
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
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
              >
                <AnimatePresence mode="popLayout">
                  {filteredAndSortedDrawings.map((project) => (
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
                      <div className="aspect-square relative bg-black border border-[#333333] hover:border-white transition-colors duration-300 overflow-hidden">
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          className="object-cover opacity-70 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-300"
                        />
                      </div>
                      <div className="mt-3 space-y-1">
                        <p className="font-mono text-xs text-white truncate">
                          {project.title}
                        </p>
                        <p className="font-mono text-[10px] text-[#AAAAAA] uppercase">
                          {project.drawingType} — {project.scale}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </LayoutGroup>

            {filteredAndSortedDrawings.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
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

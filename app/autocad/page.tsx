"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, ChevronDown } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { CustomCursor } from "@/components/custom-cursor"
import { Footer } from "@/components/footer"
import { PageTransition } from "@/components/page-transition"
import { AutoCADFileCard } from "@/components/autocad-file-card"
import { AutoCADLightbox } from "@/components/autocad-lightbox"
import { useAutoCADFiles } from "@/hooks/use-autocad-files"

const sortOptions = [
  { label: "Title", value: "title" as const },
  { label: "Year", value: "year" as const },
]

export default function AutoCADPage() {
  const { files, loading } = useAutoCADFiles()
  const [sortBy, setSortBy] = useState<"title" | "year">("title")
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const sortedFiles = useMemo(() => {
    return [...files].sort((a, b) => {
      if (sortBy === "year") {
        return b.year.localeCompare(a.year)
      }
      return a.title.localeCompare(b.title)
    })
  }, [files, sortBy])

  const openLightbox = (sortedIndex: number) => {
    const file = sortedFiles[sortedIndex]
    if (!file) return
    const globalIndex = files.findIndex((f) => f.id === file.id)
    setLightboxIndex(globalIndex >= 0 ? globalIndex : sortedIndex)
  }

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
              <Link
                href="/technologist#autocad"
                className="mb-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] text-[#AAAAAA] transition-colors hover:text-white"
                data-clickable="true"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to portfolio
              </Link>

              <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold uppercase tracking-[0.05em] text-white md:text-4xl">
                AutoCAD
              </h1>
              <div className="mt-6 flex justify-end">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                    className="flex items-center gap-2 border border-[#333333] px-4 py-2 font-mono text-xs uppercase tracking-wide text-[#AAAAAA] transition-colors hover:border-white hover:text-white"
                    data-clickable="true"
                  >
                    Sort: {sortOptions.find((s) => s.value === sortBy)?.label}
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  <AnimatePresence>
                    {sortDropdownOpen ? (
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
                            type="button"
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
                    ) : null}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

            {loading ? (
              <p className="py-20 text-center font-mono text-sm text-[#AAAAAA]">
                Loading drawings…
              </p>
            ) : sortedFiles.length > 0 ? (
              <motion.div layout className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                <AnimatePresence mode="popLayout">
                  {sortedFiles.map((file, index) => (
                    <motion.div
                      key={file.id}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 12 }}
                      transition={{ duration: 0.25 }}
                    >
                      <AutoCADFileCard
                        file={file}
                        onSelect={() => openLightbox(index)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border border-[#333333] py-20 text-center"
              >
                <p className="font-mono text-sm text-[#AAAAAA]">
                  No AutoCAD files to show yet.
                </p>
                <p className="mx-auto mt-3 max-w-md font-mono text-[10px] uppercase leading-relaxed tracking-wide text-[#666666]">
                  Add matching PDFs to public/autocad/CAD FILES/coloured and
                  black &amp; white with the same filename.
                </p>
              </motion.div>
            )}
          </div>

          <div className="mt-20">
            <Footer />
          </div>
        </main>
      </PageTransition>

      {lightboxIndex !== null && files.length > 0 ? (
        <AutoCADLightbox
          files={files}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNext={() =>
            setLightboxIndex((i) =>
              i === null ? null : (i + 1) % files.length
            )
          }
          onPrev={() =>
            setLightboxIndex((i) =>
              i === null ? null : (i - 1 + files.length) % files.length
            )
          }
        />
      ) : null}
    </>
  )
}

"use client"

import { useCallback, useState } from "react"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowRight, ChevronDown } from "lucide-react"
import { getFeaturedAutoCADFiles } from "@/lib/autocad-data"
import { useAutoCADFiles } from "@/hooks/use-autocad-files"
import { AutoCADFileCard } from "./autocad-file-card"
import { AutoCADLightbox } from "./autocad-lightbox"

export function AutoCADSection() {
  const reduceMotion = useReducedMotion()
  const { files, loading } = useAutoCADFiles()
  const featured = getFeaturedAutoCADFiles(files)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const openAtFeaturedIndex = useCallback(
    (featuredIndex: number) => {
      const file = featured[featuredIndex]
      if (!file) return
      const globalIndex = files.findIndex((f) => f.id === file.id)
      setLightboxIndex(globalIndex >= 0 ? globalIndex : featuredIndex)
    },
    [featured, files]
  )

  const closeLightbox = useCallback(() => setLightboxIndex(null), [])
  const goNext = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i + 1) % files.length))
  }, [files.length])
  const goPrev = useCallback(() => {
    setLightboxIndex((i) =>
      i === null ? null : (i - 1 + files.length) % files.length
    )
  }, [files.length])

  return (
    <section id="autocad" className="scroll-mt-28 px-6 py-12 md:py-16">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8 md:mb-10"
        >
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-4xl font-bold uppercase tracking-[0.05em] text-white md:text-5xl lg:text-6xl">
            AutoCAD
          </h2>
          <p className="mt-4 max-w-xl font-sans text-lg text-[#AAAAAA]">
            Native AutoCAD work — coloured covers, black &amp; white sheets
          </p>
        </motion.div>

        {loading ? (
          <p className="font-mono text-sm text-[#AAAAAA]">Loading drawings…</p>
        ) : featured.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
            {featured.map((file, index) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06, duration: 0.45 }}
              >
                <AutoCADFileCard
                  file={file}
                  onSelect={() => openAtFeaturedIndex(index)}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="border border-[#333333] px-6 py-10 text-center"
          >
            <p className="font-mono text-sm text-[#AAAAAA]">
              Add matching PDFs to{" "}
              <span className="text-white">public/autocad/CAD FILES/coloured</span>{" "}
              and{" "}
              <span className="text-white">
                public/autocad/CAD FILES/black &amp; white
              </span>{" "}
              with the same filename.
            </p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-10 flex justify-end"
        >
          <Link
            href="/autocad"
            className="group inline-flex items-center gap-2 font-mono text-sm text-white transition-colors hover:text-[#AAAAAA]"
            data-clickable="true"
          >
            View all AutoCAD
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="mt-10 flex justify-center md:mt-12"
        >
          <Link
            href="/#art"
            data-clickable="true"
            className="group flex flex-col items-center gap-2 outline-none transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            <span className="sr-only">Scroll to artist work</span>
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
      </div>

      {lightboxIndex !== null && files.length > 0 ? (
        <AutoCADLightbox
          files={files}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onNext={goNext}
          onPrev={goPrev}
        />
      ) : null}
    </section>
  )
}

"use client"

import { useCallback, useState } from "react"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowRight, ChevronDown } from "lucide-react"
import { useAutoCADFiles } from "@/hooks/use-autocad-files"
import { AutoCADFileCard } from "./autocad-file-card"
import { AutoCADLightbox } from "./autocad-lightbox"

export function AutoCADSection() {
  const reduceMotion = useReducedMotion()
  const { files, loading } = useAutoCADFiles()
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const openAtIndex = useCallback((index: number) => {
    setLightboxIndex(index)
  }, [])

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
    <section id="autocad" className="relative scroll-mt-28 px-6 pb-10 pt-6 md:pb-12 md:pt-8">
      <div className="mx-auto max-w-7xl">
        <h3 className="mb-4 font-mono text-xs uppercase tracking-[0.15em] text-[#AAAAAA]">
          AutoCAD
        </h3>

        {loading ? (
          <p className="font-mono text-sm text-[#AAAAAA]">Loading…</p>
        ) : files.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
            {files.map((file, index) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06, duration: 0.4 }}
              >
                <AutoCADFileCard
                  file={file}
                  onSelect={() => openAtIndex(index)}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="font-mono text-sm text-[#AAAAAA]">
            Add matching PDFs to{" "}
            <span className="text-white">CAD FILES/coloured</span> and{" "}
            <span className="text-white">CAD FILES/black &amp; white</span>.
          </p>
        )}

        {files.length > 0 ? (
          <Link
            href="/autocad"
            className="group mt-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.15em] text-[#AAAAAA] transition-colors hover:text-white"
            data-clickable="true"
          >
            View all AutoCAD
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        ) : null}

        <div className="mt-8 flex justify-center md:mt-10">
          <Link
            href="#renderings"
            data-clickable="true"
            className="group flex flex-col items-center gap-1.5 outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            <span className="sr-only">Scroll to renderings</span>
            <span
              aria-hidden
              className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#AAAAAA] transition-colors group-hover:text-white/90"
            >
              Scroll
            </span>
            <motion.span
              aria-hidden
              className="text-white/80 transition-colors group-hover:text-white"
              animate={reduceMotion ? { y: 0 } : { y: [0, 5, 0] }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
              }
            >
              <ChevronDown className="h-5 w-5" strokeWidth={1.5} />
            </motion.span>
          </Link>
        </div>
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

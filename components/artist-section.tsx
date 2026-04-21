"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { artistWorks } from "@/lib/data"
import { Lightbox } from "./lightbox"

export function ArtistSection() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const openLightbox = (index: number) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)

  const goNext = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % artistWorks.length)
    }
  }

  const goPrev = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + artistWorks.length) % artistWorks.length)
    }
  }

  return (
    <section id="art" className="scroll-mt-28 py-20 px-6">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.35 }}
          className="mb-16"
        >
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-4xl font-bold uppercase tracking-[0.05em] text-white md:text-5xl lg:text-6xl">
            Artist
          </h2>
          <p className="mt-4 font-sans text-lg text-[#AAAAAA]">
            Personal work — studies — experiments
          </p>
        </motion.div>

        {/* Grid avoids CSS columns reflow cost; no per-card Framer or shine overlays */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {artistWorks.map((work, index) => (
            <button
              key={work.id}
              type="button"
              onClick={() => openLightbox(index)}
              data-clickable="true"
              className="group relative block w-full overflow-hidden border border-transparent text-left outline-none transition-[border-color,opacity] duration-200 hover:border-white hover:opacity-[0.98] focus-visible:border-white focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              <div
                className={`relative overflow-hidden ${
                  index % 3 === 0
                    ? "aspect-[3/4]"
                    : index % 3 === 1
                      ? "aspect-square"
                      : "aspect-[4/3]"
                }`}
              >
                <Image
                  src={work.image}
                  alt={work.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                  loading={index < 4 ? "eager" : "lazy"}
                  priority={index < 3}
                  decoding="async"
                />
              </div>
            </button>
          ))}
        </div>
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          works={artistWorks}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onNext={goNext}
          onPrev={goPrev}
        />
      )}
    </section>
  )
}

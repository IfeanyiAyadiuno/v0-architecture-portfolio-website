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
            Artist
          </h2>
          <p className="font-sans text-lg text-[#AAAAAA] mt-4">
            Personal work — studies — experiments
          </p>
        </motion.div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-5 space-y-5">
          {artistWorks.map((work, index) => (
            <motion.div
              key={work.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="break-inside-avoid group relative overflow-hidden border border-transparent hover:border-white transition-colors duration-300"
              onClick={() => openLightbox(index)}
              data-clickable="true"
            >
              <div className={`relative ${index % 3 === 0 ? "aspect-[3/4]" : index % 3 === 1 ? "aspect-square" : "aspect-[4/3]"}`}>
                <Image
                  src={work.image}
                  alt={work.title}
                  fill
                  className="object-cover group-hover:grayscale-[30%] transition-all duration-300"
                />
              </div>
            </motion.div>
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

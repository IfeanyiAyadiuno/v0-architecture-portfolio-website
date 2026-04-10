"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { CustomCursor } from "@/components/custom-cursor"
import { Footer } from "@/components/footer"
import { PageTransition } from "@/components/page-transition"
import { processNotes } from "@/lib/data"
import { ChevronDown, X } from "lucide-react"

export default function ProcessPage() {
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [zoomedImage, setZoomedImage] = useState<string | null>(null)

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <>
      <CustomCursor />
      <Navigation />
      <PageTransition>
        <main className="min-h-screen bg-black pt-24">
          <div className="max-w-3xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl md:text-4xl font-bold uppercase tracking-[0.05em] text-white mb-4">
                Process
              </h1>
              <p className="font-sans text-lg text-[#AAAAAA]">
                Documentation of iterations, studies, and experiments
              </p>
            </motion.div>

            <div className="space-y-20">
              {processNotes.map((note, index) => (
                <motion.article
                  key={note.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="border-b border-[#333333] pb-20 last:border-0"
                >
                  <button
                    onClick={() => toggleExpand(note.id)}
                    className="w-full text-left group"
                    data-clickable="true"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-mono text-xs uppercase tracking-[0.1em] text-[#AAAAAA] mb-2">
                          {note.date}
                        </p>
                        <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl md:text-2xl font-bold uppercase tracking-[0.05em] text-white group-hover:text-[#AAAAAA] transition-colors">
                          {note.title}
                        </h2>
                      </div>
                      <motion.div
                        animate={{ rotate: expandedId === note.id ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-2"
                      >
                        <ChevronDown className="w-5 h-5 text-[#AAAAAA] group-hover:text-white transition-colors" />
                      </motion.div>
                    </div>
                  </button>

                  <AnimatePresence>
                    {expandedId === note.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="pt-8 space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {note.images.map((image, imgIndex) => (
                              <motion.div
                                key={imgIndex}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: imgIndex * 0.1, duration: 0.4 }}
                                className="relative aspect-video bg-black border border-[#333333] hover:border-white transition-colors overflow-hidden group"
                                onClick={() => setZoomedImage(image)}
                                data-clickable="true"
                              >
                                <Image
                                  src={image}
                                  alt={`${note.title} - Image ${imgIndex + 1}`}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              </motion.div>
                            ))}
                          </div>

                          <p className="font-sans text-base text-white leading-relaxed">
                            {note.caption}
                          </p>

                          <div className="flex flex-wrap gap-2">
                            {note.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-3 py-1 font-mono text-[10px] uppercase tracking-wide text-[#AAAAAA] border border-[#333333]"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.article>
              ))}
            </div>
          </div>

          <div className="mt-20">
            <Footer />
          </div>
        </main>
      </PageTransition>

      <AnimatePresence>
        {zoomedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black z-[100] flex items-center justify-center p-6"
            onClick={() => setZoomedImage(null)}
          >
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute top-6 right-6 z-10 p-2 text-white hover:text-[#AAAAAA] transition-colors"
              data-clickable="true"
            >
              <X className="w-6 h-6" />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative max-w-4xl w-full aspect-video"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={zoomedImage}
                alt="Process image"
                fill
                className="object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

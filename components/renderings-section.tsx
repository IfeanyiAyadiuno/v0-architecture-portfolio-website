"use client"

import { useRef, useState } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { renderings } from "@/lib/data"
import { ArrowRight } from "lucide-react"

export function RenderingsSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(1)
  const x = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 300, damping: 30 })

  const cardWidth = 400
  const gap = 20
  const totalWidth = (cardWidth + gap) * renderings.length

  const handleDrag = (_: never, info: { offset: { x: number } }) => {
    const newIndex = Math.round(-info.offset.x / (cardWidth + gap))
    const clampedIndex = Math.max(0, Math.min(renderings.length - 1, newIndex))
    setActiveIndex(clampedIndex)
  }

  return (
    <section className="py-20 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h3 className="font-mono text-xs uppercase tracking-[0.15em] text-[#AAAAAA]">
            Renderings
          </h3>
        </motion.div>

        <div ref={containerRef} className="relative">
          <motion.div
            drag="x"
            dragConstraints={{ left: -totalWidth + cardWidth * 3, right: 0 }}
            onDrag={handleDrag}
            style={{ x: springX }}
            className="flex gap-5"
          >
            {renderings.map((rendering, index) => {
              const isActive = index === activeIndex
              const distance = Math.abs(index - activeIndex)
              const scale = isActive ? 1.05 : distance === 1 ? 0.95 : 0.9

              return (
                <motion.div
                  key={rendering.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  animate={{ scale }}
                  className="flex-shrink-0 w-[400px] group relative"
                  data-clickable="true"
                >
                  <div className="aspect-video relative overflow-hidden bg-black border border-[#333333] hover:border-white transition-colors duration-300">
                    <Image
                      src={rendering.image}
                      alt={rendering.title}
                      fill
                      className="object-cover"
                    />

                    <div className="absolute top-4 left-4">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-white px-2 py-1 border border-white/50 bg-transparent">
                        {rendering.type}
                      </span>
                    </div>

                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <p className="font-mono text-xs text-white uppercase tracking-wide">
                        {rendering.title} — {rendering.software} — {rendering.year}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>

          <div className="flex justify-center gap-2 mt-8">
            {renderings.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setActiveIndex(index)
                  x.set(-(cardWidth + gap) * index)
                }}
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  index === activeIndex ? "bg-white" : "bg-[#333333]"
                }`}
                data-clickable="true"
              />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-12 flex justify-end"
          >
            <Link
              href="/drawings-index"
              className="inline-flex items-center gap-2 font-mono text-sm text-white hover:text-[#AAAAAA] transition-colors group"
              data-clickable="true"
            >
              View all renderings
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

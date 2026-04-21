"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import { motion, useReducedMotion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { renderings } from "@/lib/data"
import { ArrowRight } from "lucide-react"
import { RenderingLightbox } from "./rendering-lightbox"

const SLIDE_GAP_PX = 20

export function RenderingsSection() {
  const reducedMotion = useReducedMotion()
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const plugins = useMemo(
    () =>
      reducedMotion === true
        ? []
        : [
            Autoplay({
              delay: 4500,
              // With stopOnInteraction true, pointerUp is never wired — first drag kills autoplay forever.
              stopOnInteraction: false,
              // With stopOnMouseEnter true + stopOnInteraction true, mouseleave is never wired — first hover kills autoplay forever.
              stopOnMouseEnter: false,
              stopOnFocusIn: true,
              stopOnLastSnap: false,
              playOnInit: true,
            }),
          ],
    [reducedMotion]
  )

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: "start",
      axis: "x",
      loop: true,
      dragFree: false,
    },
    plugins
  )

  const [activeIndex, setActiveIndex] = useState(0)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setActiveIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onSelect)
    onSelect()
    return () => {
      emblaApi.off("select", onSelect)
      emblaApi.off("reInit", onSelect)
    }
  }, [emblaApi, onSelect])

  useEffect(() => {
    if (!emblaApi) return
    const id = requestAnimationFrame(() => {
      emblaApi.reInit()
    })
    return () => cancelAnimationFrame(id)
  }, [emblaApi])

  const scrollTo = useCallback(
    (index: number) => {
      emblaApi?.scrollTo(index)
    },
    [emblaApi]
  )

  const closeLightbox = useCallback(() => setLightboxIndex(null), [])
  const goNextLightbox = useCallback(() => {
    setLightboxIndex((i) =>
      i === null ? null : (i + 1) % renderings.length
    )
  }, [])
  const goPrevLightbox = useCallback(() => {
    setLightboxIndex((i) =>
      i === null ? null : (i - 1 + renderings.length) % renderings.length
    )
  }, [])

  return (
    <section className="overflow-hidden px-6 py-20">
      <div className="mx-auto max-w-7xl">
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

        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div
              className="flex touch-pan-x"
              style={{ marginLeft: -SLIDE_GAP_PX }}
            >
              {renderings.map((rendering, index) => {
                return (
                  <div
                    key={rendering.id}
                    className="min-w-0 shrink-0 grow-0"
                    style={{
                      flex: `0 0 min(420px, calc(100vw - 48px))`,
                      paddingLeft: SLIDE_GAP_PX,
                      boxSizing: "border-box",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setLightboxIndex(index)}
                      className="group relative block w-full max-w-[400px] border-0 bg-transparent p-0 text-left outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                      data-clickable="true"
                      aria-label={`Open ${rendering.title}`}
                    >
                      <div className="relative w-full">
                        <div className="relative aspect-video overflow-hidden border border-[#333333] bg-black transition-colors duration-300 group-hover:border-white group-focus-visible:border-white">
                          <Image
                            src={rendering.image}
                            alt={rendering.title}
                            fill
                            className="object-cover"
                            draggable={false}
                            sizes="(max-width: 768px) 90vw, 400px"
                            loading={index < 2 ? "eager" : "lazy"}
                            priority={index === 0}
                            decoding="async"
                          />

                          <div className="absolute left-4 top-4 z-[15]">
                            <span className="border border-white/50 bg-transparent px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-white">
                              {rendering.type}
                            </span>
                          </div>

                          <div className="absolute inset-0 z-[15] flex items-end bg-black/60 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                            <p className="font-mono text-xs uppercase tracking-wide text-white">
                              {rendering.title} — {rendering.software} —{" "}
                              {rendering.year}
                            </p>
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-2">
            {renderings.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => scrollTo(index)}
                className={`h-2 w-2 rounded-full transition-colors duration-300 ${
                  index === activeIndex ? "bg-white" : "bg-[#333333]"
                }`}
                data-clickable="true"
                aria-label={`Go to slide ${index + 1}`}
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
              className="group inline-flex items-center gap-2 font-mono text-sm text-white transition-colors hover:text-[#AAAAAA]"
              data-clickable="true"
            >
              View all renderings
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </div>

      {lightboxIndex !== null && (
        <RenderingLightbox
          works={renderings}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onNext={goNextLightbox}
          onPrev={goPrevLightbox}
        />
      )}
    </section>
  )
}

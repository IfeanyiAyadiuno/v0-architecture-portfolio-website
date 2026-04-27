"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, useReducedMotion } from "framer-motion"
import Image from "next/image"
import { artistWorks } from "@/lib/data"
import { Lightbox } from "./lightbox"

const TRAIN_VIDEO_MP4 = "/art/IMG_2757.mp4"
const TRAIN_VIDEO_MOV = "/art/IMG_2757.mov"

function ArtistVideoStrip({
  mp4Src,
  movSrc,
  caption,
  ariaLabel,
  errorFilename,
}: {
  mp4Src: string
  movSrc: string
  caption: string
  ariaLabel: string
  errorFilename: string
}) {
  const reduceMotion = useReducedMotion()
  const [failed, setFailed] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const stripRef = useRef<HTMLDivElement>(null)

  const tryPlay = useCallback(() => {
    const video = videoRef.current
    if (!video || failed) return
    if (reduceMotion === true) {
      video.pause()
      return
    }
    void video.play().catch(() => {})
  }, [reduceMotion, failed])

  useEffect(() => {
    const video = videoRef.current
    const root = stripRef.current
    if (!video || !root) return

    const onCanPlay = () => tryPlay()
    video.addEventListener("canplay", onCanPlay)

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) tryPlay()
        }
      },
      { threshold: 0.08 }
    )
    io.observe(root)
    tryPlay()

    return () => {
      video.removeEventListener("canplay", onCanPlay)
      io.disconnect()
    }
  }, [tryPlay])

  return (
    <motion.div
      ref={stripRef}
      initial={{ y: 14 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full max-w-3xl"
    >
      <div className="relative aspect-[2.35/1] w-full overflow-hidden rounded-md border border-white/[0.14] bg-[#0a0a0a] shadow-[0_12px_48px_rgba(0,0,0,0.55)]">
        {!failed ? (
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover object-center"
            muted
            playsInline
            loop
            preload="metadata"
            autoPlay={reduceMotion !== true}
            onError={() => setFailed(true)}
            aria-label={ariaLabel}
          >
            <source src={mp4Src} type="video/mp4" />
            <source src={movSrc} type="video/quicktime" />
          </video>
        ) : null}

        {failed ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#111] px-4 text-center">
            <p className="font-mono text-xs text-[#AAAAAA]">
              This clip cannot play in your browser (common with iPhone{" "}
              <span className="whitespace-nowrap">.mov</span> / HEVC).
            </p>
            <p className="max-w-sm font-mono text-[10px] uppercase leading-relaxed tracking-wide text-[#666666]">
              Add an <span className="text-white/80">H.264</span>{" "}
              <span className="text-white/80">.mp4</span> as{" "}
              <span className="text-white/80">{errorFilename}</span> in{" "}
              <span className="text-white/80">public/art/</span>.
            </p>
          </div>
        ) : null}

        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(95deg,rgba(0,0,0,0.45)_0%,transparent_35%,transparent_65%,rgba(0,0,0,0.4)_100%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-black/20"
          aria-hidden
        />

        <p className="pointer-events-none absolute bottom-2 left-3 font-mono text-[9px] uppercase tracking-[0.35em] text-white/50 md:bottom-3 md:left-4">
          {caption}
        </p>
      </div>
    </motion.div>
  )
}

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
    <section id="art" className="scroll-mt-28 bg-black px-6 py-12 md:py-16">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.35 }}
          className="mb-6 md:mb-8"
        >
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-4xl font-bold uppercase tracking-[0.05em] text-white md:text-5xl lg:text-6xl">
            Artist
          </h2>
          <p className="mt-4 max-w-xl font-sans text-lg text-[#AAAAAA]">
            Personal work — studies — experiments
          </p>
        </motion.div>

        <div className="mb-8 md:mb-10">
          <ArtistVideoStrip
            mp4Src={TRAIN_VIDEO_MP4}
            movSrc={TRAIN_VIDEO_MOV}
            caption="In motion"
            ariaLabel="Decorative clip of a train in motion"
            errorFilename="IMG_2757.mp4"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {artistWorks.map((work, index) => (
            <button
              key={work.id}
              type="button"
              onClick={() => openLightbox(index)}
              data-clickable="true"
              className="group relative block w-full overflow-hidden border border-transparent text-left outline-none transition-[border-color,opacity] duration-200 hover:border-white hover:opacity-[0.98] focus-visible:border-white focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
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

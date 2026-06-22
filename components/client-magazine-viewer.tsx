"use client"

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { Volume2, VolumeX, X } from "lucide-react"
import type { ClientProject, ClientProjectImage, ClientProjectSection } from "@/lib/client-work-data"
import { resolveSectionLabel } from "@/lib/client-work-metadata"
import { TrimmedImage } from "./trimmed-image"

const DEFAULT_ACCENT = "#d41818"

type MagazineBlock =
  | { kind: "cover" }
  | { kind: "chapter"; name: string; index: number; backdrop?: string }
  | {
      kind: "spread"
      left: ClientProjectImage | null
      right: ClientProjectImage | null
      leftPage: number | null
      rightPage: number | null
      sectionName?: string
    }
  | { kind: "colophon" }

function encodePublicPath(path: string) {
  return path
    .split("/")
    .map((segment, i) => (i === 0 && segment === "" ? "" : encodeURIComponent(segment)))
    .join("/")
}

function Folio({
  page,
  total,
  align,
}: {
  page: number
  total: number
  align: "left" | "right"
}) {
  return (
    <span
      className={`pointer-events-none absolute bottom-3 z-10 font-mono text-[9px] uppercase tracking-[0.35em] text-white/55 md:bottom-4 ${
        align === "left" ? "left-3 md:left-4" : "right-3 md:right-4"
      }`}
    >
      {String(page).padStart(2, "0")}
      <span className="text-white/30"> / {String(total).padStart(2, "0")}</span>
    </span>
  )
}

function MagazinePage({
  image,
  page,
  total,
  folioAlign,
}: {
  image: ClientProjectImage
  page: number
  total: number
  folioAlign: "left" | "right"
}) {
  return (
    <figure className="relative w-full leading-none">
      <TrimmedImage
        src={image.src}
        alt={image.alt ?? ""}
        sizes="(max-width: 768px) 100vw, 50vw"
        className="block h-auto w-full"
      />
      <Folio page={page} total={total} align={folioAlign} />
    </figure>
  )
}

function MagazineAmbient({
  src,
}: {
  src?: string
}) {
  const reduceMotion = useReducedMotion()
  const audioRef = useRef<HTMLAudioElement>(null)
  const [soundOn, setSoundOn] = useState(false)
  const [missing, setMissing] = useState(false)

  const tryPlay = useCallback(async () => {
    const audio = audioRef.current
    if (!audio || missing) return false
    audio.volume = 0.32
    try {
      await audio.play()
      setSoundOn(true)
      return true
    } catch {
      setSoundOn(false)
      return false
    }
  }, [missing])

  useEffect(() => {
    if (!src || reduceMotion === true || missing) return
    void tryPlay()
  }, [src, reduceMotion, missing, tryPlay])

  useEffect(() => {
    const audio = audioRef.current
    return () => {
      audio?.pause()
    }
  }, [])

  if (!src || missing) return null

  return (
    <>
      <audio
        ref={audioRef}
        src={encodePublicPath(src)}
        loop
        preload="auto"
        onError={() => setMissing(true)}
      />
      <button
        type="button"
        onClick={() => {
          const audio = audioRef.current
          if (!audio) return
          if (soundOn) {
            audio.pause()
            setSoundOn(false)
            return
          }
          void tryPlay()
        }}
        className="inline-flex h-10 items-center gap-2 rounded-md px-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#888888] transition-colors hover:bg-white/10 hover:text-white"
        data-clickable="true"
        aria-label={soundOn ? "Mute ambient audio" : "Play ambient audio"}
      >
        {soundOn ? (
          <Volume2 className="h-4 w-4 shrink-0" aria-hidden />
        ) : (
          <VolumeX className="h-4 w-4 shrink-0" aria-hidden />
        )}
        <span className="hidden sm:inline">{soundOn ? "Sound on" : "Sound off"}</span>
      </button>
    </>
  )
}

/** Clear space between header block bottom and poster red rule. */
const COVER_HEADER_GAP = "clamp(1.75rem, 4vw, 3.5rem)"
const DEFAULT_COVER_RED_LINE_RATIO = 0.28

function CoverHeaderContent({
  project,
  overlaid = false,
}: {
  project: ClientProject
  overlaid?: boolean
}) {
  return (
    <>
      <p
        className={`font-mono uppercase tracking-[0.55em] ${
          overlaid ? "text-[11px] text-[#777777] md:text-xs" : "text-[10px] text-[#666666]"
        }`}
      >
        {project.client}
      </p>

      <span
        className={`magazine-chapter-accent h-[3px] ${
          overlaid ? "mt-1.5 w-10 md:mt-2 md:w-12" : "mt-3 w-12 md:mt-4 md:w-16"
        }`}
        aria-hidden
      />

      <h1
        className={`font-[family-name:var(--font-space-grotesk)] font-bold uppercase tracking-[0.04em] text-white ${
          overlaid
            ? "mt-1.5 text-3xl leading-[0.9] md:mt-2 md:text-5xl lg:text-6xl"
            : "mt-2 text-4xl leading-[0.92] md:mt-3 md:text-7xl lg:text-8xl"
        }`}
      >
        {project.title}
      </h1>

      <p
        className={`font-mono uppercase tracking-[0.35em] text-[#888888] ${
          overlaid ? "mt-1.5 text-[11px] md:mt-2 md:text-xs" : "mt-3 text-xs md:mt-4"
        }`}
      >
        {project.type} · {project.year}
      </p>
    </>
  )
}

function MagazineCover({
  project,
}: {
  project: ClientProject
}) {
  const cover = project.cover
  const redLineRatio = project.coverRedLineRatio ?? DEFAULT_COVER_RED_LINE_RATIO
  const [coverLayoutReady, setCoverLayoutReady] = useState(false)

  useEffect(() => {
    setCoverLayoutReady(false)
  }, [cover])

  if (!cover) {
    return (
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="magazine-cover snap-start snap-always border-b border-[#222222]"
      >
        <div className="bg-[#050505] px-6 py-8 text-center md:px-10 md:py-10">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto flex w-full max-w-4xl flex-col items-center"
          >
            <CoverHeaderContent project={project} />
          </motion.div>
        </div>
      </motion.section>
    )
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="magazine-cover snap-start snap-always border-b border-[#222222]"
    >
      <figure className="relative w-full leading-none">
        <TrimmedImage
          src={cover}
          alt={`${project.title} cover`}
          priority
          sizes="100vw"
          className="block h-auto w-full"
          onLayoutReady={() => setCoverLayoutReady(true)}
        />
        {coverLayoutReady ? (
          <div
            className="pointer-events-none absolute inset-x-0 top-0 z-10 overflow-hidden px-6 pt-6 text-center md:px-10 md:pt-10"
            style={{
              bottom: `calc(${(1 - redLineRatio) * 100}% + ${COVER_HEADER_GAP})`,
            }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/55 via-black/20 to-transparent"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative mx-auto flex w-full max-w-4xl flex-col items-center"
            >
              <CoverHeaderContent project={project} overlaid />
            </motion.div>
          </div>
        ) : null}
      </figure>
    </motion.section>
  )
}

function ChapterOpener({
  index,
  name,
  backdrop,
}: {
  index: number
  name: string
  backdrop?: string
}) {
  const num = String(index).padStart(2, "0")

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="magazine-chapter relative snap-start snap-always min-h-[78dvh] overflow-hidden border-b border-[#222222] md:min-h-[82dvh]"
    >
      {backdrop ? (
        <>
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <TrimmedImage
              src={backdrop}
              alt=""
              fill
              trimWhitespace={false}
              sizes="100vw"
              className="scale-110 object-cover opacity-90 blur-2xl brightness-[0.55]"
            />
          </div>
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <TrimmedImage
              src={backdrop}
              alt=""
              fill
              trimWhitespace={false}
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/75"
            aria-hidden
          />
        </>
      ) : null}

      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[38%] z-[1] -translate-x-1/2 -translate-y-1/2 select-none font-[family-name:var(--font-space-grotesk)] text-[clamp(5.5rem,24vw,13rem)] font-bold leading-none tracking-tight text-white/[0.07]"
      >
        {num}
      </span>

      <div className="relative z-10 flex min-h-[78dvh] flex-col items-center justify-start px-6 pb-14 pt-16 text-center md:min-h-[82dvh] md:px-10 md:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ delay: 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex w-full max-w-3xl flex-col items-center"
        >
          <div className="flex w-full max-w-xs items-center gap-3 md:max-w-sm">
            <span className="h-px flex-1 bg-white/30" aria-hidden />
            <span className="font-mono text-[10px] uppercase tracking-[0.55em] text-white/80">
              Chapter {num}
            </span>
            <span className="h-px flex-1 bg-white/30" aria-hidden />
          </div>

          <span className="magazine-chapter-accent mt-5 h-[3px] w-16 md:mt-6 md:w-20" aria-hidden />

          <h2 className="mt-5 font-[family-name:var(--font-space-grotesk)] text-[clamp(2rem,6vw,3.75rem)] font-bold uppercase leading-[1.02] tracking-[0.06em] text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.65)] md:mt-6">
            {name}
          </h2>

          <span
            className="magazine-chapter-accent mt-5 h-[3px] w-10 opacity-80 md:mt-6"
            aria-hidden
          />
        </motion.div>
      </div>
    </motion.section>
  )
}

function sectionChapterName(
  section: ClientProjectSection,
  sectionLabels?: Record<string, string>
): string {
  if (section.folderName) {
    return resolveSectionLabel(section.folderName, sectionLabels)
  }
  return section.name
}

function buildMagazineBlocks(project: ClientProject): {
  blocks: MagazineBlock[]
  totalPages: number
} {
  const sectionLabels = project.sectionLabels
  const sections =
    project.sections.length > 0
      ? project.sections
      : [{ name: project.title, images: project.images }]

  const totalPages = sections.reduce((sum, s) => sum + s.images.length, 0)
  const blocks: MagazineBlock[] = [{ kind: "cover" }]

  let pageCounter = 0

  for (let sIdx = 0; sIdx < sections.length; sIdx++) {
    const section = sections[sIdx]
    if (section.images.length === 0) continue

    const chapterName = sectionChapterName(section, sectionLabels)

    blocks.push({
      kind: "chapter",
      name: chapterName,
      index: sIdx + 1,
      backdrop: section.images[0]?.src,
    })

    for (let i = 0; i < section.images.length; i += 2) {
      const left = section.images[i] ?? null
      const right = section.images[i + 1] ?? null
      const leftPage = left ? ++pageCounter : null
      const rightPage = right ? ++pageCounter : null

      blocks.push({
        kind: "spread",
        left,
        right,
        leftPage,
        rightPage,
        sectionName: chapterName,
      })
    }
  }

  blocks.push({ kind: "colophon" })
  return { blocks, totalPages }
}

type ClientMagazineViewerProps = {
  project: ClientProject
  onClose: () => void
}

export function ClientMagazineViewer({ project, onClose }: ClientMagazineViewerProps) {
  const [container, setContainer] = useState<HTMLElement | null>(null)
  const { blocks, totalPages } = useMemo(() => buildMagazineBlocks(project), [project])
  const accentColor = project.accentColor ?? DEFAULT_ACCENT

  useLayoutEffect(() => {
    setContainer(document.body)
  }, [])

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        onClose()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  if (!container || totalPages === 0) return null

  return createPortal(
    <AnimatePresence>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={`${project.title} magazine`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35 }}
        className="fixed inset-0 z-[350] flex flex-col bg-[#050505]"
        style={{ "--magazine-accent": accentColor } as React.CSSProperties}
      >
        <div className="shrink-0 border-b border-[#222222] bg-black/95 px-4 py-3 backdrop-blur-sm md:px-6">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
            <p className="min-w-0 truncate font-mono text-[10px] uppercase tracking-[0.45em] text-[#555555]">
              Magazine · {project.client}
            </p>
            <div className="flex shrink-0 items-center gap-2">
              <MagazineAmbient src={project.ambientAudio} />
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-10 w-10 items-center justify-center rounded-md text-white transition-colors hover:bg-white/10"
                data-clickable="true"
                aria-label="Close"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
          </div>
        </div>

        <div className="magazine-scroll min-h-0 flex-1 overflow-y-auto scroll-smooth">
          <div className="mx-auto w-full max-w-6xl">
            {blocks.map((block, index) => {
              if (block.kind === "cover") {
                return <MagazineCover key="cover" project={project} />
              }

              if (block.kind === "chapter") {
                return (
                  <ChapterOpener
                    key={`chapter-${block.name}`}
                    index={block.index}
                    name={block.name}
                    backdrop={block.backdrop}
                  />
                )
              }

              if (block.kind === "spread") {
                return (
                  <section
                    key={`spread-${index}-${block.left?.src ?? "x"}`}
                    className="magazine-spread snap-start snap-always border-b border-[#222222]"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 md:divide-x md:divide-[#222222]">
                      {block.left ? (
                        <MagazinePage
                          image={block.left}
                          page={block.leftPage!}
                          total={totalPages}
                          folioAlign="left"
                        />
                      ) : (
                        <div className="hidden min-h-[12rem] md:block md:min-h-0" aria-hidden />
                      )}
                      {block.right ? (
                        <MagazinePage
                          image={block.right}
                          page={block.rightPage!}
                          total={totalPages}
                          folioAlign="right"
                        />
                      ) : block.left ? (
                        <div className="hidden bg-[#080808] md:block" aria-hidden />
                      ) : null}
                    </div>
                  </section>
                )
              }

              return (
                <section
                  key="colophon"
                  className="snap-start px-6 py-16 md:px-10 md:py-24"
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.5em] text-[#555555]">
                    Colophon
                  </p>
                  <div className="mt-6 space-y-2 font-mono text-xs leading-relaxed text-[#888888]">
                    <p className="text-white">{project.title}</p>
                    <p>{project.client}</p>
                    <p>{project.role}</p>
                    <p>{project.year}</p>
                  </div>
                  <p className="mt-10 font-mono text-[10px] uppercase tracking-[0.4em] text-[#444444]">
                    End of issue
                  </p>
                </section>
              )
            })}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>,
    container
  )
}

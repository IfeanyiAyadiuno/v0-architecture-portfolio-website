"use client"

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { Volume2, VolumeX, X } from "lucide-react"
import type { ClientProject, ClientProjectMedia, ClientProjectSection } from "@/lib/client-work-data"
import { resolveSectionLabel } from "@/lib/client-work-metadata"
import { useRegisterOverlayClose, useRegisterScrollContainer } from "@/contexts/scroll-scope"
import { MagazinePdfPage } from "./pdf-sheet-preview-lazy"
import { TrimmedImage } from "./trimmed-image"

const DEFAULT_ACCENT = "#d41818"

type MagazineChapter = {
  index: number
  name: string
  id: string
}

type MagazineBlock =
  | { kind: "cover" }
  | { kind: "chapter"; name: string; index: number; id: string; backdrop?: string }
  | {
      kind: "spread"
      left: ClientProjectMedia | null
      right: ClientProjectMedia | null
      leftPage: number | null
      rightPage: number | null
      sectionName?: string
      fullWidth?: boolean
    }
  | { kind: "colophon" }

/** Encode each path segment once — safe for catalog URLs that are already encoded. */
function encodePublicPath(path: string) {
  return path
    .split("/")
    .map((segment, i) => {
      if (i === 0 && segment === "") return ""
      try {
        return encodeURIComponent(decodeURIComponent(segment))
      } catch {
        return encodeURIComponent(segment)
      }
    })
    .join("/")
}

function chapterSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
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

function isFullWidthMedia(media: ClientProjectMedia) {
  return media.type === "pdf" || media.type === "video"
}

function videoSourcesFromSrc(src: string) {
  const encoded = encodePublicPath(src)
  const ext = src.match(/\.([^.]+)$/i)?.[1]?.toLowerCase()
  if (ext === "mov") {
    return [
      { src: encoded.replace(/\.mov$/i, ".mp4"), type: "video/mp4" },
      { src: encoded, type: "video/quicktime" },
    ]
  }
  if (ext === "webm") {
    return [{ src: encoded, type: "video/webm" }]
  }
  return [{ src: encoded, type: "video/mp4" }]
}

function MagazineScrollVideo({
  src,
  alt,
  scrollRootRef,
}: {
  src: string
  alt?: string
  scrollRootRef: React.RefObject<HTMLDivElement | null>
}) {
  const [failed, setFailed] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const stripRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const sources = useMemo(() => videoSourcesFromSrc(src), [src])

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
    const target = stripRef.current
    const root = scrollRootRef.current
    if (!video || !target || !root) return

    const onCanPlay = () => tryPlay()
    video.addEventListener("canplay", onCanPlay)

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) tryPlay()
        }
      },
      { root, threshold: 0.08 }
    )
    io.observe(target)
    tryPlay()

    return () => {
      video.removeEventListener("canplay", onCanPlay)
      io.disconnect()
    }
  }, [scrollRootRef, tryPlay])

  return (
    <div ref={stripRef} className="relative w-full">
      {!failed ? (
        <video
          ref={videoRef}
          className="block h-auto w-full"
          muted
          playsInline
          loop
          preload="metadata"
          autoPlay={reduceMotion !== true}
          onError={() => setFailed(true)}
          aria-label={alt ?? "Project video"}
        >
          {sources.map((source) => (
            <source key={source.src} src={source.src} type={source.type} />
          ))}
        </video>
      ) : (
        <div className="flex min-h-[12rem] flex-col items-center justify-center gap-2 bg-[#111] px-4 py-8 text-center">
          <p className="font-mono text-xs text-[#AAAAAA]">
            This clip cannot play in your browser (common with iPhone{" "}
            <span className="whitespace-nowrap">.mov</span> / HEVC).
          </p>
          <p className="max-w-sm font-mono text-[10px] uppercase leading-relaxed tracking-wide text-[#666666]">
            Add an <span className="text-white/80">H.264</span>{" "}
            <span className="text-white/80">.mp4</span> alongside the{" "}
            <span className="text-white/80">.mov</span> in the project folder.
          </p>
        </div>
      )}
    </div>
  )
}

function MagazineMediaPage({
  media,
  page,
  total,
  folioAlign,
  scrollRootRef,
}: {
  media: ClientProjectMedia
  page: number
  total: number
  folioAlign: "left" | "right"
  scrollRootRef: React.RefObject<HTMLDivElement | null>
}) {
  return (
    <figure className="relative w-full leading-none">
      {media.type === "image" ? (
        <TrimmedImage
          src={media.src}
          alt={media.alt ?? ""}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="block h-auto w-full"
        />
      ) : media.type === "video" ? (
        <MagazineScrollVideo
          src={media.src}
          alt={media.alt}
          scrollRootRef={scrollRootRef}
        />
      ) : (
        <MagazinePdfPage
          src={encodePublicPath(media.src)}
          title={media.alt ?? "PDF document"}
        />
      )}
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

function CoverHeaderContent({
  project,
  compact = false,
}: {
  project: ClientProject
  compact?: boolean
}) {
  return (
    <>
      <p
        className={`font-mono uppercase tracking-[0.55em] text-[#666666] ${
          compact
            ? "text-[10px] leading-tight sm:text-[11px]"
            : "text-[10px]"
        }`}
      >
        {project.client}
      </p>

      <span
        className={`magazine-chapter-accent h-[3px] ${
          compact ? "mt-2 w-10 sm:mt-2.5 md:w-12" : "mt-3 w-12 md:mt-4 md:w-16"
        }`}
        aria-hidden
      />

      <h1
        className={`font-[family-name:var(--font-space-grotesk)] font-bold uppercase tracking-[0.04em] text-white ${
          compact
            ? "mt-2 text-2xl leading-none sm:text-3xl md:text-5xl lg:text-6xl"
            : "mt-2 text-4xl leading-[0.92] md:mt-3 md:text-7xl lg:text-8xl"
        }`}
      >
        {project.title}
      </h1>

      <p
        className={`font-mono uppercase tracking-[0.35em] text-[#888888] ${
          compact ? "mt-2 text-[10px] sm:text-[11px]" : "mt-3 text-xs md:mt-4"
        }`}
      >
        {project.type} · {project.year}
      </p>
    </>
  )
}

function CoverChapterToc({
  chapters,
  onChapterClick,
}: {
  chapters: MagazineChapter[]
  onChapterClick: (id: string) => void
}) {
  if (chapters.length === 0) return null

  return (
    <nav
      aria-label="Chapters"
      className="mx-auto w-full max-w-xs border-t border-[#222222] pt-4 md:mx-0 md:w-auto md:border-t-0 md:pt-0 md:text-right"
    >
      <p className="font-mono text-[9px] uppercase tracking-[0.45em] text-[#555555]">
        Contents
      </p>
      <ul className="mt-2 space-y-1.5 md:mt-2.5">
        {chapters.map((chapter) => (
          <li key={chapter.id}>
            <button
              type="button"
              onClick={() => onChapterClick(chapter.id)}
              className="group inline-flex w-full items-baseline gap-2 font-mono text-[9px] uppercase tracking-[0.22em] text-[#666666] transition-colors hover:text-[var(--magazine-accent)] md:justify-end"
              data-clickable="true"
            >
              <span className="shrink-0 text-[#444444] transition-colors group-hover:text-[var(--magazine-accent)]">
                {String(chapter.index).padStart(2, "0")}
              </span>
              <span>{chapter.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

function MagazineCover({
  project,
  chapters,
  onChapterClick,
}: {
  project: ClientProject
  chapters: MagazineChapter[]
  onChapterClick: (id: string) => void
}) {
  const cover = project.cover

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="magazine-cover snap-start snap-always border-b border-[#222222]"
    >
      <div
        className={`bg-[#050505] px-6 md:px-10 ${
          cover ? "py-5 md:py-6" : "py-8 md:py-10"
        }`}
      >
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto grid w-full max-w-6xl grid-cols-1 items-start gap-5 md:grid-cols-[1fr_minmax(0,auto)_minmax(0,11rem)] md:gap-x-6 lg:grid-cols-[1fr_minmax(0,auto)_13rem]"
        >
          <div className="hidden md:block" aria-hidden />

          <div className="flex flex-col items-center text-center">
            <CoverHeaderContent project={project} compact={Boolean(cover)} />
          </div>

          <CoverChapterToc chapters={chapters} onChapterClick={onChapterClick} />
        </motion.div>
      </div>
      {cover ? (
        <figure className="w-full leading-none">
          <TrimmedImage
            src={cover}
            alt={`${project.title} cover`}
            priority
            sizes="100vw"
            className="block h-auto w-full"
          />
        </figure>
      ) : null}
    </motion.section>
  )
}

function ChapterOpener({
  id,
  index,
  name,
  backdrop,
}: {
  id: string
  index: number
  name: string
  backdrop?: string
}) {
  const num = String(index).padStart(2, "0")

  return (
    <motion.section
      id={id}
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

function sectionFolderKey(section: ClientProjectSection): string {
  return (section.folderName ?? section.name).toLowerCase()
}

/** All magazine chapters — honors sectionOrder even when folders have no images. */
function resolveMagazineSections(project: ClientProject): ClientProjectSection[] {
  const { sectionLabels, sectionOrder, sections, title, images } = project

  if (sectionOrder?.length) {
    const byFolder = new Map(
      sections.map((section) => [sectionFolderKey(section), section] as const)
    )

    const ordered = sectionOrder.map((folderName) => {
      const existing = byFolder.get(folderName.toLowerCase())
      if (existing) return existing
      return {
        folderName,
        name: resolveSectionLabel(folderName, sectionLabels),
        images: [],
      }
    })

    const extras = sections.filter(
      (section) =>
        !sectionOrder.some(
          (ordered) => ordered.toLowerCase() === sectionFolderKey(section)
        )
    )

    return [...ordered, ...extras]
  }

  if (sections.length > 0) return sections

  return [{ name: title, images }]
}

function buildMagazineBlocks(project: ClientProject): {
  blocks: MagazineBlock[]
  totalPages: number
} {
  const sectionLabels = project.sectionLabels
  const sections = resolveMagazineSections(project)

  const totalPages = sections.reduce((sum, s) => sum + s.images.length, 0)
  const blocks: MagazineBlock[] = [{ kind: "cover" }]

  let pageCounter = 0

  for (let sIdx = 0; sIdx < sections.length; sIdx++) {
    const section = sections[sIdx]
    const chapterName = sectionChapterName(section, sectionLabels)

    blocks.push({
      kind: "chapter",
      name: chapterName,
      index: sIdx + 1,
      id: `chapter-${chapterSlug(chapterName)}`,
      backdrop: section.images.find((item) => item.type === "image")?.src,
    })

    for (let i = 0; i < section.images.length; i++) {
      const media = section.images[i]!

      if (isFullWidthMedia(media)) {
        blocks.push({
          kind: "spread",
          left: media,
          right: null,
          leftPage: ++pageCounter,
          rightPage: null,
          sectionName: chapterName,
          fullWidth: true,
        })
        continue
      }

      const left = media
      const right =
        i + 1 < section.images.length && !isFullWidthMedia(section.images[i + 1]!)
          ? section.images[++i]!
          : null
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
  const scrollRef = useRef<HTMLDivElement>(null)
  const { blocks, totalPages } = useMemo(() => buildMagazineBlocks(project), [project])
  const chapters = useMemo(
    () =>
      blocks
        .filter((block): block is Extract<MagazineBlock, { kind: "chapter" }> => block.kind === "chapter")
        .map((block) => ({ index: block.index, name: block.name, id: block.id })),
    [blocks]
  )
  const accentColor = project.accentColor ?? DEFAULT_ACCENT

  const scrollToChapter = useCallback((chapterId: string) => {
    const container = scrollRef.current
    const target = document.getElementById(chapterId)
    if (!container || !target) return

    const top =
      target.getBoundingClientRect().top -
      container.getBoundingClientRect().top +
      container.scrollTop

    container.scrollTo({ top, behavior: "smooth" })
  }, [])

  const isOpen = Boolean(container && totalPages > 0)

  useRegisterScrollContainer(scrollRef, isOpen)
  useRegisterOverlayClose(onClose, isOpen)

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

        <div
          ref={scrollRef}
          className="magazine-scroll min-h-0 flex-1 overflow-y-auto scroll-smooth"
        >
          <div className="mx-auto w-full max-w-6xl">
            {blocks.map((block, index) => {
              if (block.kind === "cover") {
                return (
                  <MagazineCover
                    key="cover"
                    project={project}
                    chapters={chapters}
                    onChapterClick={scrollToChapter}
                  />
                )
              }

              if (block.kind === "chapter") {
                return (
                  <ChapterOpener
                    key={block.id}
                    id={block.id}
                    index={block.index}
                    name={block.name}
                    backdrop={block.backdrop}
                  />
                )
              }

              if (block.kind === "spread") {
                if (block.fullWidth && block.left) {
                  return (
                    <section
                      key={`spread-${index}-${block.left.src}`}
                      className="magazine-spread snap-start snap-always border-b border-[#222222]"
                    >
                      <MagazineMediaPage
                        media={block.left}
                        page={block.leftPage!}
                        total={totalPages}
                        folioAlign="left"
                        scrollRootRef={scrollRef}
                      />
                    </section>
                  )
                }

                return (
                  <section
                    key={`spread-${index}-${block.left?.src ?? "x"}`}
                    className="magazine-spread snap-start snap-always border-b border-[#222222]"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 md:divide-x md:divide-[#222222]">
                      {block.left ? (
                        <MagazineMediaPage
                          media={block.left}
                          page={block.leftPage!}
                          total={totalPages}
                          folioAlign="left"
                          scrollRootRef={scrollRef}
                        />
                      ) : (
                        <div className="hidden min-h-[12rem] md:block md:min-h-0" aria-hidden />
                      )}
                      {block.right ? (
                        <MagazineMediaPage
                          media={block.right}
                          page={block.rightPage!}
                          total={totalPages}
                          folioAlign="right"
                          scrollRootRef={scrollRef}
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

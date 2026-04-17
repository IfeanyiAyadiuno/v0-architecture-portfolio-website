"use client"

import { useMemo } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { CustomCursor } from "@/components/custom-cursor"
import { Footer } from "@/components/footer"
import { PageTransition } from "@/components/page-transition"
import { getDrawingProjectById, slugToKind } from "@/lib/data"

export default function ProjectDrawingKindPage() {
  const params = useParams()
  const projectId = Number(params.projectId)
  const kind = slugToKind(String(params.kind ?? ""))

  const project = useMemo(
    () => (Number.isFinite(projectId) ? getDrawingProjectById(projectId) : undefined),
    [projectId]
  )

  const sheet = project && kind ? project.drawings[kind] : undefined

  if (!project || !kind || !sheet) {
    return (
      <>
        <CustomCursor />
        <Navigation />
        <PageTransition>
          <main className="min-h-screen bg-black px-6 pb-20 pt-32 text-white">
            <p className="font-mono text-sm text-[#AAAAAA]">
              Project or drawing type not found.
            </p>
            <Link
              href="/drawings-index"
              className="mt-6 inline-flex items-center gap-2 font-mono text-sm uppercase tracking-wide text-white hover:text-[#AAAAAA]"
              data-clickable="true"
            >
              <ArrowLeft className="h-4 w-4" />
              Drawings index
            </Link>
          </main>
        </PageTransition>
      </>
    )
  }

  return (
    <>
      <CustomCursor />
      <Navigation />
      <PageTransition>
        <main className="min-h-screen bg-black px-6 pb-20 pt-24">
          <div className="mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <Link
                href="/drawings-index"
                className="mb-10 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] text-[#AAAAAA] transition-colors hover:text-white"
                data-clickable="true"
              >
                <ArrowLeft className="h-4 w-4" />
                Drawings index
              </Link>

              <header className="mb-12 border-b border-[#333333] pb-10">
                <p className="font-mono text-xs uppercase tracking-[0.15em] text-[#AAAAAA]">
                  {project.category} — {kind}
                </p>
                <h1 className="mt-3 font-[family-name:var(--font-space-grotesk)] text-3xl font-bold uppercase tracking-[0.05em] text-white md:text-4xl">
                  {project.title}
                </h1>
                <p className="mt-2 font-mono text-sm text-[#AAAAAA]">
                  {project.year}
                </p>
                <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 font-mono text-[10px] uppercase tracking-wide text-[#AAAAAA]">
                  <span>Scale: {sheet.scale}</span>
                  <span>Software: {sheet.software}</span>
                  <span>Sheet: {sheet.sheetNumber}</span>
                </div>
              </header>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {sheet.images.map((src, index) => (
                  <motion.figure
                    key={`${src}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.06 }}
                    className="border border-[#333333] bg-[#0a0a0a]"
                  >
                    <div className="relative aspect-[4/3] w-full">
                      <Image
                        src={src}
                        alt={`${project.title} — ${kind} — ${index + 1}`}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                    <figcaption className="border-t border-[#333333] px-4 py-3 font-mono text-[10px] uppercase tracking-wide text-[#AAAAAA]">
                      {kind} {sheet.images.length > 1 ? `— ${index + 1} / ${sheet.images.length}` : ""}
                    </figcaption>
                  </motion.figure>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="mt-24">
            <Footer />
          </div>
        </main>
      </PageTransition>
    </>
  )
}

"use client"

import { useEffect, useMemo, useState } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import { cn } from "@/lib/utils"

type PdfSheetPreviewProps = {
  src: string
  className?: string
}

// Configure worker for `react-pdf` / pdf.js
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const workerSrc = (pdfjs as any)?.GlobalWorkerOptions?.workerSrc

export function PdfSheetPreview({ src, className }: PdfSheetPreviewProps) {
  const [containerEl, setContainerEl] = useState<HTMLDivElement | null>(null)
  const [width, setWidth] = useState<number>(0)
  const [loadFailed, setLoadFailed] = useState(false)

  const worker = useMemo(() => {
    // Prefer CDN worker to avoid Next bundling edge-cases.
    const version =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((pdfjs as any)?.version as string | undefined) ?? "4.0.0"
    return `https://unpkg.com/pdfjs-dist@${version}/build/pdf.worker.min.mjs`
  }, [])

  useEffect(() => {
    if (workerSrc) return
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(pdfjs as any).GlobalWorkerOptions.workerSrc = worker
  }, [worker])

  useEffect(() => {
    if (!containerEl) return

    const ro = new ResizeObserver((entries) => {
      const next = entries[0]?.contentRect?.width ?? 0
      setWidth(Math.max(0, Math.floor(next)))
    })
    ro.observe(containerEl)
    return () => ro.disconnect()
  }, [containerEl])

  const fileUrl = useMemo(() => {
    if (typeof window === "undefined") return src
    if (src.startsWith("http://") || src.startsWith("https://")) return src
    // pdf.js fetch behaves more reliably with absolute same-origin URLs in dev.
    return new URL(src, window.location.origin).toString()
  }, [src])

  return (
    <div
      ref={setContainerEl}
      className={cn("absolute inset-0 grid place-items-center", className)}
    >
      {loadFailed ? null : (
      <Document
        file={fileUrl}
        loading={null}
        error={null}
        noData={null}
        onLoadError={() => setLoadFailed(true)}
        className="pointer-events-none select-none bg-white"
      >
        <Page
          pageNumber={1}
          width={Math.max(1, width)}
          renderAnnotationLayer={false}
          renderTextLayer={false}
          onRenderError={() => setLoadFailed(true)}
          className="bg-white"
        />
      </Document>
      )}
    </div>
  )
}


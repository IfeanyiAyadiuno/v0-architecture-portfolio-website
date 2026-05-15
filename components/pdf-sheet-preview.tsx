"use client"

import { useEffect, useMemo, useState } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import { cn } from "@/lib/utils"

type PdfSheetPreviewProps = {
  src: string
  className?: string
  /** `width` fills container width (may crop tall sheets). `contain` scales to show the full page. */
  fit?: "width" | "contain"
  /** Fired when page 1 dimensions are known (for aspect-aware card frames). */
  onPageDimensions?: (size: { width: number; height: number }) => void
}

// Configure worker for `react-pdf` / pdf.js
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const workerSrc = (pdfjs as any)?.GlobalWorkerOptions?.workerSrc

export function PdfSheetPreview({
  src,
  className,
  fit = "width",
  onPageDimensions,
}: PdfSheetPreviewProps) {
  const [containerEl, setContainerEl] = useState<HTMLDivElement | null>(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const [containerHeight, setContainerHeight] = useState(0)
  const [pageSize, setPageSize] = useState<{ width: number; height: number } | null>(
    null
  )
  const [loadFailed, setLoadFailed] = useState(false)

  const worker = useMemo(() => {
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
    setPageSize(null)
    setLoadFailed(false)
  }, [src])

  useEffect(() => {
    if (!containerEl) return

    const ro = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect
      setContainerWidth(Math.max(0, Math.floor(rect?.width ?? 0)))
      setContainerHeight(Math.max(0, Math.floor(rect?.height ?? 0)))
    })
    ro.observe(containerEl)
    return () => ro.disconnect()
  }, [containerEl])

  const fileUrl = useMemo(() => {
    if (typeof window === "undefined") return src
    if (src.startsWith("http://") || src.startsWith("https://")) return src
    return new URL(src, window.location.origin).toString()
  }, [src])

  const renderWidth = useMemo(() => {
    const cw = Math.max(1, containerWidth)
    const ch = Math.max(1, containerHeight)

    if (fit === "width" || !pageSize) {
      return cw
    }

    const scale = Math.min(cw / pageSize.width, ch / pageSize.height)
    return Math.max(1, Math.floor(pageSize.width * scale))
  }, [fit, containerWidth, containerHeight, pageSize])

  return (
    <div
      ref={setContainerEl}
      className={cn("absolute inset-0 grid place-items-center overflow-hidden", className)}
    >
      {loadFailed ? null : (
        <Document
          file={fileUrl}
          loading={null}
          error={null}
          noData={null}
          onLoadError={() => setLoadFailed(true)}
          className="pointer-events-none flex select-none items-center justify-center bg-transparent"
        >
          <Page
            pageNumber={1}
            width={renderWidth}
            renderAnnotationLayer={false}
            renderTextLayer={false}
            onLoadSuccess={(page) => {
              const viewport = page.getViewport({ scale: 1 })
              const size = { width: viewport.width, height: viewport.height }
              setPageSize(size)
              onPageDimensions?.(size)
            }}
            onRenderError={() => setLoadFailed(true)}
            className="max-h-full max-w-full bg-white shadow-sm"
          />
        </Document>
      )}
    </div>
  )
}

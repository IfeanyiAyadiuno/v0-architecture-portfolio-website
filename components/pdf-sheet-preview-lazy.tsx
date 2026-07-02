"use client"

import dynamic from "next/dynamic"

export const PdfSheetPreview = dynamic(
  () => import("./pdf-sheet-preview").then((m) => m.PdfSheetPreview),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 animate-pulse bg-[#f7f6f3]" aria-hidden />
    ),
  }
)

export const MagazinePdfPage = dynamic(
  () => import("./pdf-sheet-preview").then((m) => m.MagazinePdfPage),
  {
    ssr: false,
    loading: () => (
      <div className="w-full bg-[#050505] leading-none" aria-hidden>
        <div className="aspect-[4/3] w-full animate-pulse bg-[#111111]" />
      </div>
    ),
  }
)

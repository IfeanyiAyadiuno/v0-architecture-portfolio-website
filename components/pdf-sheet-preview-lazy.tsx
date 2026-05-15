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

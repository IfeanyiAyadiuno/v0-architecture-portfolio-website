import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** True when URL points to a PDF (public path or absolute). */
export function isPdfPath(url: string): boolean {
  const path = url.split('?')[0]?.split('#')[0] ?? url
  return path.toLowerCase().endsWith('.pdf')
}

export type PdfIframeOptions = {
  /**
   * Chrome/Edge PDF viewer: `Fit` scales the whole page into the viewer (default);
   * `FitH` fits page width only (tall sheets can clip vertically).
   */
  view?: 'Fit' | 'FitH'
  /** Hide Chrome PDF chrome for more room (mainly useful in fullscreen). */
  compactUi?: boolean
}

/**
 * Build `src` for embedding PDFs in an iframe. Chromium honors `#view=…`;
 * other browsers may ignore the fragment (PDF still loads).
 */
export function pdfIframeSrc(url: string, opts: PdfIframeOptions = {}): string {
  if (!isPdfPath(url)) return url
  const { view = 'Fit', compactUi = false } = opts
  const sharp = url.indexOf('#')
  const base = sharp === -1 ? url : url.slice(0, sharp)
  const frag = sharp === -1 ? '' : url.slice(sharp + 1)
  const params = new URLSearchParams(frag)
  params.set('view', view)
  if (compactUi) {
    params.set('toolbar', '0')
    params.set('navpanes', '0')
  } else {
    params.delete('toolbar')
    params.delete('navpanes')
  }
  const serialized = params.toString()
  return serialized ? `${base}#${serialized}` : `${base}#view=${view}`
}

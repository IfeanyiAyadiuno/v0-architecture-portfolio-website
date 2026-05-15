/**
 * AutoCAD portfolio — files live in `public/autocad/CAD FILES/`.
 * - `coloured/` — card covers (paired by filename)
 * - `black & white/` — full sheets in the lightbox
 */

export type AutoCADFile = {
  id: number
  title: string
  year: string
  /** Original PDF filename in both folders. */
  filename: string
  /** Coloured export — used on cards. */
  coverUrl: string
  /** Black & white export — used in the lightbox. */
  sheetUrl: string
  description?: string
  featured?: boolean
}

export function getFeaturedAutoCADFiles(files: AutoCADFile[]): AutoCADFile[] {
  const featured = files.filter((f) => f.featured)
  if (featured.length > 0) return featured
  return files.slice(0, 4)
}

export function getAutoCADFileById(
  files: AutoCADFile[],
  id: number
): AutoCADFile | undefined {
  return files.find((f) => f.id === id)
}

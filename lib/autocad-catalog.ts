import { readdir } from "node:fs/promises"
import path from "node:path"
import type { AutoCADFile } from "@/lib/autocad-data"

const CAD_FILES_DIR = "CAD FILES"
const COLOURED_DIR = "coloured"
const BLACK_WHITE_DIR = "black & white"

function isPdf(name: string) {
  return /\.pdf$/i.test(name)
}

/** Public URL for a file under `public/autocad/CAD FILES/…`. */
export function autocadPublicUrl(subfolder: string, filename: string): string {
  const segments = ["autocad", CAD_FILES_DIR, subfolder, filename].map((s) =>
    encodeURIComponent(s)
  )
  return `/${segments.join("/")}`
}

function titleFromFilename(filename: string): string {
  return filename.replace(/\.pdf$/i, "").trim()
}

async function listPdfsInSubfolder(subfolder: string): Promise<string[]> {
  const dir = path.join(
    process.cwd(),
    "public",
    "autocad",
    CAD_FILES_DIR,
    subfolder
  )
  try {
    const entries = await readdir(dir)
    return entries
      .filter(isPdf)
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  } catch {
    return []
  }
}

/**
 * Pair coloured (cover) and black & white (sheet) PDFs by identical filename.
 * Coloured folder is the source of truth for which projects appear.
 */
export async function listAutoCADFiles(): Promise<AutoCADFile[]> {
  const [coloured, blackWhite] = await Promise.all([
    listPdfsInSubfolder(COLOURED_DIR),
    listPdfsInSubfolder(BLACK_WHITE_DIR),
  ])

  const bwByName = new Map(
    blackWhite.map((name) => [name.toLowerCase(), name] as const)
  )

  const files: AutoCADFile[] = []

  coloured.forEach((filename, index) => {
    const bwName = bwByName.get(filename.toLowerCase())
    files.push({
      id: index + 1,
      title: titleFromFilename(filename),
      year: "2026",
      filename,
      coverUrl: autocadPublicUrl(COLOURED_DIR, filename),
      sheetUrl: bwName
        ? autocadPublicUrl(BLACK_WHITE_DIR, bwName)
        : autocadPublicUrl(COLOURED_DIR, filename),
    })
  })

  return files
}

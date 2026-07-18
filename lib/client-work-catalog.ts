import { readdir } from "node:fs/promises"
import path from "node:path"
import { unstable_cache } from "next/cache"
import type {
  ClientProject,
  ClientProjectMedia,
  ClientProjectMediaType,
  ClientProjectSection,
} from "@/lib/client-work-data"
import {
  CLIENT_FOLDER_ORDER,
  metaForFolder,
  resolveSectionLabel,
} from "@/lib/client-work-metadata"

const CLIENT_ROOT = ["art", "CLIENT"] as const
const COVER_FOLDER = "COVER"

const MEDIA_EXT = /\.(jpe?g|png|webp|gif|pdf|mov|mp4|webm)$/i

function mediaTypeForFile(name: string): ClientProjectMediaType | null {
  const ext = name.match(/\.([^.]+)$/i)?.[1]?.toLowerCase()
  if (!ext) return null
  if (/^(jpe?g|png|webp|gif)$/.test(ext)) return "image"
  if (ext === "pdf") return "pdf"
  if (/^(mov|mp4|webm)$/.test(ext)) return "video"
  return null
}

function isMediaFile(name: string) {
  return MEDIA_EXT.test(name)
}

function mediaEntry(
  projectFolder: string,
  relativeParts: string[],
  filename: string
): ClientProjectMedia {
  return {
    type: mediaTypeForFile(filename) ?? "image",
    src: clientWorkPublicUrl(projectFolder, ...relativeParts, filename),
    alt: filename.replace(/\.[^.]+$/, ""),
  }
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

/** Public URL for a file under `public/art/CLIENT/…`. */
export function clientWorkPublicUrl(
  projectFolder: string,
  ...rest: string[]
): string {
  const segments = [...CLIENT_ROOT, projectFolder, ...rest].map((s) =>
    encodeURIComponent(s)
  )
  return `/${segments.join("/")}`
}

async function listMediaInDir(
  absoluteDir: string,
  projectFolder: string,
  relativeParts: string[]
): Promise<ClientProjectMedia[]> {
  try {
    const entries = await readdir(absoluteDir)
    const mediaFiles = entries.filter(isMediaFile)
    const movStems = new Set(
      mediaFiles
        .filter((name) => /\.mov$/i.test(name))
        .map((name) => name.replace(/\.mov$/i, "").toLowerCase())
    )
    return mediaFiles
      .filter((name) => {
        if (/\.mp4$/i.test(name)) {
          const stem = name.replace(/\.mp4$/i, "").toLowerCase()
          if (movStems.has(stem)) return false
        }
        return true
      })
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map((filename) => mediaEntry(projectFolder, relativeParts, filename))
  } catch {
    return []
  }
}

function sortSectionEntries(
  names: string[],
  sectionOrder?: string[]
): string[] {
  if (!sectionOrder?.length) {
    return [...names].sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true })
    )
  }

  const orderIndex = new Map(
    sectionOrder.map((name, index) => [name.toLowerCase(), index] as const)
  )

  return [...names].sort((a, b) => {
    const ai = orderIndex.get(a.toLowerCase())
    const bi = orderIndex.get(b.toLowerCase())
    if (ai !== undefined && bi !== undefined) return ai - bi
    if (ai !== undefined) return -1
    if (bi !== undefined) return 1
    return a.localeCompare(b, undefined, { numeric: true })
  })
}

async function listGallerySections(
  projectDir: string,
  folderName: string,
  sectionLabels?: Record<string, string>,
  sectionOrder?: string[]
): Promise<ClientProjectSection[]> {
  let entries: { name: string; isDirectory: () => boolean }[]
  try {
    entries = await readdir(projectDir, { withFileTypes: true })
  } catch {
    return []
  }

  const sectionDirs = new Map(
    entries
      .filter((e) => e.isDirectory())
      .filter((e) => e.name.toLowerCase() !== COVER_FOLDER.toLowerCase())
      .map((e) => [e.name.toLowerCase(), e.name] as const)
  )

  const orderedNames = sortSectionEntries(
    sectionOrder?.length
      ? [
          ...sectionOrder,
          ...[...sectionDirs.values()].filter(
            (name) =>
              !sectionOrder.some(
                (ordered) => ordered.toLowerCase() === name.toLowerCase()
              )
          ),
        ]
      : [...sectionDirs.values()],
    sectionOrder
  )

  const sections: ClientProjectSection[] = []

  for (const entryName of orderedNames) {
    const diskName = sectionDirs.get(entryName.toLowerCase()) ?? entryName
    const images = sectionDirs.has(entryName.toLowerCase())
      ? await listMediaInDir(
          path.join(projectDir, diskName),
          folderName,
          [diskName]
        )
      : []
    const inOrder = sectionOrder?.some(
      (ordered) => ordered.toLowerCase() === entryName.toLowerCase()
    )
    if (images.length > 0 || inOrder) {
      sections.push({
        folderName: diskName,
        name: resolveSectionLabel(entryName, sectionLabels),
        images,
      })
    }
  }

  return sections
}

async function walkGalleryMedia(
  absoluteDir: string,
  projectFolder: string,
  relativeParts: string[] = []
): Promise<ClientProjectMedia[]> {
  let entries: { name: string; isDirectory: () => boolean }[]
  try {
    entries = await readdir(absoluteDir, { withFileTypes: true })
  } catch {
    return []
  }

  const media: ClientProjectMedia[] = []

  for (const entry of entries.sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { numeric: true })
  )) {
    const rel = [...relativeParts, entry.name]

    if (entry.isDirectory()) {
      if (entry.name.toLowerCase() === COVER_FOLDER.toLowerCase()) continue
      media.push(
        ...(await walkGalleryMedia(
          path.join(absoluteDir, entry.name),
          projectFolder,
          rel
        ))
      )
      continue
    }

    if (isMediaFile(entry.name)) {
      media.push(mediaEntry(projectFolder, rel, entry.name))
    }
  }

  return media
}

function sortProjects(projects: ClientProject[]): ClientProject[] {
  const orderIndex = new Map(
    CLIENT_FOLDER_ORDER.map((name, i) => [name, i] as const)
  )

  return [...projects].sort((a, b) => {
    const ai = orderIndex.get(a.folderName) ?? 999
    const bi = orderIndex.get(b.folderName) ?? 999
    if (ai !== bi) return ai - bi
    return a.folderName.localeCompare(b.folderName)
  })
}

export async function listClientProjects(): Promise<ClientProject[]> {
  const rootDir = path.join(process.cwd(), "public", ...CLIENT_ROOT)

  let entries: { name: string; isDirectory: () => boolean }[]
  try {
    entries = await readdir(rootDir, { withFileTypes: true })
  } catch {
    return []
  }

  const projectDirs = entries.filter((e) => e.isDirectory())
  const projects: ClientProject[] = []

  for (const dir of projectDirs) {
    const folderName = dir.name
    const projectDir = path.join(rootDir, folderName)
    const meta = metaForFolder(folderName)

    const coverEntries = await listMediaInDir(
      path.join(projectDir, COVER_FOLDER),
      folderName,
      [COVER_FOLDER]
    )
    const coverImages = coverEntries.filter((item) => item.type === "image")
    const sections = await listGallerySections(
      projectDir,
      folderName,
      meta.sectionLabels,
      meta.sectionOrder
    )
    const galleryImages =
      sections.length > 0
        ? sections.flatMap((section) => section.images)
        : await walkGalleryMedia(projectDir, folderName)

    const cover = coverImages[0]?.src ?? galleryImages[0]?.src
    const images =
      galleryImages.length > 0
        ? galleryImages
        : coverImages.length > 0
          ? coverImages
          : []

    projects.push({
      id: slugify(folderName),
      folderName,
      ...meta,
      cover,
      images,
      sections,
    })
  }

  return sortProjects(projects)
}

/** Production: 1h Data Cache. Dev: bypass so new files under `public/art/CLIENT` show immediately. */
const getCachedClientProjectsCached = unstable_cache(
  listClientProjects,
  ["client-work-projects"],
  { revalidate: 3600 }
)

export async function getCachedClientProjects(): Promise<ClientProject[]> {
  if (process.env.NODE_ENV === "development") {
    return listClientProjects()
  }
  return getCachedClientProjectsCached()
}

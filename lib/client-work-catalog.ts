import { readdir } from "node:fs/promises"
import path from "node:path"
import type {
  ClientProject,
  ClientProjectImage,
  ClientProjectSection,
} from "@/lib/client-work-data"
import {
  CLIENT_FOLDER_ORDER,
  metaForFolder,
  resolveSectionLabel,
} from "@/lib/client-work-metadata"

const CLIENT_ROOT = ["art", "CLIENT"] as const
const COVER_FOLDER = "COVER"

const IMAGE_EXT = /\.(jpe?g|png|webp|gif)$/i

function isImageFile(name: string) {
  return IMAGE_EXT.test(name)
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

async function listImagesInDir(
  absoluteDir: string,
  projectFolder: string,
  relativeParts: string[]
): Promise<ClientProjectImage[]> {
  try {
    const entries = await readdir(absoluteDir)
    return entries
      .filter(isImageFile)
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map((filename) => ({
        src: clientWorkPublicUrl(projectFolder, ...relativeParts, filename),
        alt: filename.replace(/\.[^.]+$/, ""),
      }))
  } catch {
    return []
  }
}

async function listGallerySections(
  projectDir: string,
  folderName: string,
  sectionLabels?: Record<string, string>
): Promise<ClientProjectSection[]> {
  let entries: { name: string; isDirectory: () => boolean }[]
  try {
    entries = await readdir(projectDir, { withFileTypes: true })
  } catch {
    return []
  }

  const sections: ClientProjectSection[] = []

  for (const entry of entries
    .filter((e) => e.isDirectory())
    .filter((e) => e.name.toLowerCase() !== COVER_FOLDER.toLowerCase())
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }))) {
    const images = await listImagesInDir(
      path.join(projectDir, entry.name),
      folderName,
      [entry.name]
    )
    if (images.length > 0) {
      sections.push({
        folderName: entry.name,
        name: resolveSectionLabel(entry.name, sectionLabels),
        images,
      })
    }
  }

  return sections
}

async function walkGalleryImages(
  absoluteDir: string,
  projectFolder: string,
  relativeParts: string[] = []
): Promise<ClientProjectImage[]> {
  let entries: { name: string; isDirectory: () => boolean }[]
  try {
    entries = await readdir(absoluteDir, { withFileTypes: true })
  } catch {
    return []
  }

  const images: ClientProjectImage[] = []

  for (const entry of entries.sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { numeric: true })
  )) {
    const rel = [...relativeParts, entry.name]

    if (entry.isDirectory()) {
      if (entry.name.toLowerCase() === COVER_FOLDER.toLowerCase()) continue
      images.push(
        ...(await walkGalleryImages(
          path.join(absoluteDir, entry.name),
          projectFolder,
          rel
        ))
      )
      continue
    }

    if (isImageFile(entry.name)) {
      images.push({
        src: clientWorkPublicUrl(projectFolder, ...rel),
        alt: entry.name.replace(/\.[^.]+$/, ""),
      })
    }
  }

  return images
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

    const coverImages = await listImagesInDir(
      path.join(projectDir, COVER_FOLDER),
      folderName,
      [COVER_FOLDER]
    )
    const sections = await listGallerySections(
      projectDir,
      folderName,
      meta.sectionLabels
    )
    const galleryImages =
      sections.length > 0
        ? sections.flatMap((section) => section.images)
        : await walkGalleryImages(projectDir, folderName)

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

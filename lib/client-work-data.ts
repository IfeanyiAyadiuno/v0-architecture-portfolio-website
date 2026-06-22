/**
 * Client work — one folder per project under `public/art/CLIENT/`.
 *
 * Folder layout:
 *   CLIENT/
 *     MyHoop/
 *       COVER/          ← card thumbnail (first image)
 *       …/              ← any subfolder with gallery images
 *     Syndicate Collection/
 *       COVER/
 *       Runway pictures/
 */

export type ClientProjectType = "Ad Direction" | "Spatial Design"

export type ClientProjectDisplayMode = "magazine" | "gallery"

export type ClientProjectImage = {
  src: string
  alt?: string
}

export type ClientProjectSection = {
  /** Display title (may differ from on-disk folder name). */
  name: string
  /** Exact subfolder name under the project directory. */
  folderName?: string
  images: ClientProjectImage[]
}

export type ClientProject = {
  id: string
  folderName: string
  title: string
  client: string
  type: ClientProjectType
  role: string
  year: string
  displayMode: ClientProjectDisplayMode
  accentColor?: string
  /** Display titles for gallery subfolders — keyed by exact folder name. */
  sectionLabels?: Record<string, string>
  ambientAudio?: string
  /** Magazine cover: Y position of artwork red rule as fraction of image height (0–1). */
  coverRedLineRatio?: number
  cover?: string
  images: ClientProjectImage[]
  /** Magazine layout: one chapter per subfolder (excluding COVER). */
  sections: ClientProjectSection[]
}

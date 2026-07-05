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
 *       Planning/
 *       Setup/
 *       Runway pictures/
 */

export type ClientProjectType = "Ad Direction" | "Spatial Design"

export type ClientProjectDisplayMode = "magazine" | "gallery"

export type ClientProjectMediaType = "image" | "pdf" | "video"

export type ClientProjectMedia = {
  type: ClientProjectMediaType
  src: string
  alt?: string
}

/** @deprecated Alias for {@link ClientProjectMedia} — all section items are media entries. */
export type ClientProjectImage = ClientProjectMedia

export type ClientProjectSection = {
  /** Display title (may differ from on-disk folder name). */
  name: string
  /** Exact subfolder name under the project directory. */
  folderName?: string
  images: ClientProjectMedia[]
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
  /** Chapter order — exact subfolder names; overrides alphabetical sort. */
  sectionOrder?: string[]
  /** Editorial context for magazine chapter openers — keyed by exact folder name. */
  sectionContext?: Record<string, string>
  ambientAudio?: string
  cover?: string
  images: ClientProjectMedia[]
  /** Magazine layout: one chapter per subfolder (excluding COVER). */
  sections: ClientProjectSection[]
}

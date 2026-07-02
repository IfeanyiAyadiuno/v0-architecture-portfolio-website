import type { ClientProjectDisplayMode, ClientProjectType } from "@/lib/client-work-data"

type ClientProjectMeta = {
  title: string
  client: string
  type: ClientProjectType
  role: string
  year: string
  displayMode?: ClientProjectDisplayMode
  /** Magazine accent — hex color for chapter rules / highlights */
  accentColor?: string
  /** Display titles for subfolders — keyed by exact folder name */
  sectionLabels?: Record<string, string>
  /** Chapter order — exact subfolder names; overrides alphabetical sort */
  sectionOrder?: string[]
  /** Looping ambient track — path under public/ */
  ambientAudio?: string
}

/** Metadata keyed by exact folder name under `public/art/CLIENT/`. */
export const CLIENT_FOLDER_META: Record<string, ClientProjectMeta> = {
  MyHoop: {
    title: "MYHOOP AD",
    client: "MyHoop",
    type: "Ad Direction",
    role: "Creative Director",
    year: "2026",
    accentColor: "#f5f5f5",
  },
  "Syndicate Collection": {
    title: "FASHION SHOW",
    client: "Syndicate Collections",
    type: "Spatial Design",
    role: "Technical Event Designer — Space Design",
    year: "2026",
    displayMode: "magazine",
    accentColor: "#d41818",
    sectionLabels: {
      Planning: "THE PLANNING",
      Setup: "THE SETUP",
      "Runway pictures": "THE RUNWAY",
    },
    sectionOrder: ["Planning", "Setup", "Runway pictures"],
    ambientAudio: "/art/CLIENT/Syndicate Collection/ambient.mp3",
  },
}

/** Display order when multiple project folders exist. */
export const CLIENT_FOLDER_ORDER: string[] = ["MyHoop", "Syndicate Collection"]

/** Map a gallery subfolder name to its display label (case-insensitive fallback). */
export function resolveSectionLabel(
  folderName: string,
  sectionLabels?: Record<string, string>
): string {
  if (!sectionLabels) return folderName
  const exact = sectionLabels[folderName]
  if (exact) return exact
  const lower = folderName.toLowerCase()
  for (const [key, label] of Object.entries(sectionLabels)) {
    if (key.toLowerCase() === lower) return label
  }
  return folderName
}

export function metaForFolder(folderName: string): ClientProjectMeta & {
  displayMode: ClientProjectDisplayMode
} {
  const known = CLIENT_FOLDER_META[folderName]
  if (known) {
    return {
      ...known,
      displayMode: known.displayMode ?? "gallery",
    }
  }

  return {
    title: folderName.toUpperCase(),
    client: folderName,
    type: "Ad Direction",
    role: "Creative Director",
    year: "2026",
    displayMode: "gallery",
  }
}

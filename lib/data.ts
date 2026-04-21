import { isPdfPath } from "@/lib/utils"

// —— Technical drawings: project-first model (Plans / Sections / Elevations / Details) ——

export const DRAWING_KINDS = ["Plans", "Sections", "Elevations", "Details"] as const
export type DrawingKind = (typeof DRAWING_KINDS)[number]

export type DrawingSheet = {
  /** One or more images for this drawing type (e.g. multiple sheets). */
  images: string[]
  scale: string
  software: string
  sheetNumber: string
}

export type ProjectCategory = "commercial" | "residential"

export type DrawingProject = {
  id: number
  title: string
  year: string
  category: ProjectCategory
  /**
   * Optional cover for drawings index / modal: basename only, file at
   * `public/covers/drawings/<coverFile>` (e.g. `CAFE COVER.jpg`, `COVER PAGE AMBULANCE.jpg`).
   */
  coverFile?: string
  /**
   * Cover width ÷ height (e.g. from image metadata). Improves first paint before load;
   * raster covers still refine from intrinsic size when this is omitted.
   */
  coverAspectRatio?: number
  drawings: Partial<Record<DrawingKind, DrawingSheet>>
}

export const KIND_TO_SLUG: Record<DrawingKind, string> = {
  Plans: "plan",
  Sections: "section",
  Elevations: "elevation",
  Details: "detail",
}

export function kindToSlug(kind: DrawingKind): string {
  return KIND_TO_SLUG[kind]
}

export function slugToKind(slug: string): DrawingKind | null {
  const found = (Object.entries(KIND_TO_SLUG) as [DrawingKind, string][]).find(
    ([, s]) => s === slug.toLowerCase()
  )
  return found ? found[0] : null
}

function sheet(
  scale: string,
  software: string,
  sheetNumber: string,
  images: string | string[] = "/placeholder.svg"
): DrawingSheet {
  const list = typeof images === "string" ? [images] : images
  return { images: list, scale, software, sheetNumber }
}

export const commercialProjects: DrawingProject[] = [
  {
    id: 1,
    title: "AMBULANCE STATION",
    year: "2026",
    category: "commercial",
    coverFile: "COVER PAGE AMBULANCE.jpg",
    coverAspectRatio: 1499 / 656,
    drawings: {
      Plans: sheet("1:100", "Revit", "A2.1/A2.4", [
        "/drawings/ambulance-station/AMBULANCE%20STATION%20MAIN%20FLOOR%20PLAN.pdf",
        "/drawings/ambulance-station/AMBULANCE%20STATION%20MAIN%20FLOOR%20RCP%20-%20A2.4.pdf",
      ]),
      Sections: sheet("1:100", "Rhino", "A-101", [
        "/drawings/ambulance-station/AMBULANCE%20STATION%20PLAN%20%26%20SECTION%20DETAILS.pdf",
      ]),
      Elevations: sheet("1:150", "AutoCAD", "A-102", [
        "/drawings/ambulance-station/AMBULANCE%20STATION%20ELEVATION.pdf",
      ]),
      Details: sheet("1:20", "Rhino", "A-103", [
        "/drawings/ambulance-station/AMBULANCE%20STATION%20LEGEND%20%26%20SCHEDULES.pdf",
      ]),
    },
  },
  {
    id: 2,
    title: "CAFE",
    year: "2026",
    category: "commercial",
    coverFile: "CAFE COVER.jpg",
    coverAspectRatio: 1311 / 792,
    drawings: {
      Plans: sheet("1:200", "Revit", "A-102", [
        "/drawings/cafe/MAIN%20FLOOR%20PLAN.pdf",
        "/drawings/cafe/SECOND%20FLOOR%20PLAN.pdf",
        "/drawings/cafe/THIRD%20FLOOR%20PLAN.pdf",
      ]),
      Sections: sheet("1:100", "Revit", "A-103", [
        "/drawings/cafe/BUILDING%20SECTION.pdf",
        "/drawings/cafe/STAIR%20SECTION.pdf",
      ]),
      Elevations: sheet("1:150", "Revit", "A-104", [
        "/drawings/cafe/CAFE%20EAST%20ELEVATION.pdf",
        "/drawings/cafe/CAFE%20NORTH%20ELEVATION.pdf",
        "/drawings/cafe/CAFE%20SOUTH%20ELEVATION.pdf",
      ]),
      Details: sheet("1:25", "Rhino", "A-105"),
    },
  },
]

/** Same `DrawingProject` shape as commercial; append entries when you add residential work. */
export const residentialProjects: DrawingProject[] = []

export const allDrawingProjects: DrawingProject[] = [
  ...commercialProjects,
  ...residentialProjects,
]

export function getDrawingProjectById(id: number): DrawingProject | undefined {
  return allDrawingProjects.find((p) => p.id === id)
}

function coverFilePublicUrl(coverFile: string): string {
  const base = coverFile.replace(/\\/g, "/").split("/").pop()?.trim() ?? ""
  if (!base) return "/placeholder.svg"
  return `/covers/drawings/${encodeURIComponent(base)}`
}

export function coverImageForProject(project: DrawingProject): string {
  if (project.coverFile != null && project.coverFile.trim() !== "") {
    return coverFilePublicUrl(project.coverFile)
  }
  for (const kind of DRAWING_KINDS) {
    const s = project.drawings[kind]
    if (!s?.images?.length) continue
    for (const url of s.images) {
      if (!isPdfPath(url)) return url
    }
  }
  return "/placeholder.svg"
}

// Renderings data
export const renderings = [
  { id: 1, title: "Lobby Perspective", software: "Enscape", year: "2024", type: "INTERIOR", image: "/placeholder.svg" },
  { id: 2, title: "Aerial View", software: "V-Ray", year: "2023", type: "AERIAL", image: "/placeholder.svg" },
  { id: 3, title: "Facade Study", software: "Twinmotion", year: "2024", type: "EXTERIOR", image: "/placeholder.svg" },
  { id: 4, title: "Material Detail", software: "Enscape", year: "2023", type: "INTERIOR", image: "/placeholder.svg" },
  { id: 5, title: "Night View", software: "V-Ray", year: "2024", type: "EXTERIOR", image: "/placeholder.svg" },
  { id: 6, title: "Site Context", software: "Twinmotion", year: "2023", type: "AERIAL", image: "/placeholder.svg" },
]

// Artist works — files in `public/art/` (`%28` / `%29` = parentheses in filenames)
export const artistWorks = [
  {
    id: 1,
    title: "Study — 01",
    medium: "Photograph",
    dimensions: "Archive print",
    year: "2024",
    image: "/art/E70C3504-2DB5-4088-B45B-661A5B93E321.jpeg",
  },
  {
    id: 2,
    title: "Study — 02",
    medium: "Photograph",
    dimensions: "Archive print",
    year: "2024",
    image: "/art/IMG_0201%28art%29.jpeg",
  },
  {
    id: 3,
    title: "Study — 03",
    medium: "Photograph",
    dimensions: "Archive print",
    year: "2024",
    image: "/art/IMG_0245%28art%29.jpeg",
  },
  {
    id: 4,
    title: "Study — 04",
    medium: "Photograph",
    dimensions: "Archive print",
    year: "2024",
    image: "/art/IMG_0349%28art%29.jpeg",
  },
  {
    id: 5,
    title: "Study — 05",
    medium: "Photograph",
    dimensions: "Archive print",
    year: "2024",
    image: "/art/IMG_2691%28art%29.jpeg",
  },
  {
    id: 6,
    title: "Study — 06",
    medium: "Photograph",
    dimensions: "Archive print",
    year: "2024",
    image: "/art/IMG_2766%28art%29.jpeg",
  },
  {
    id: 7,
    title: "Study — 07",
    medium: "Photograph",
    dimensions: "Archive print",
    year: "2024",
    image: "/art/IMG_2774%28art%29.jpeg",
  },
  {
    id: 8,
    title: "Study — 08",
    medium: "Photograph",
    dimensions: "Archive print",
    year: "2024",
    image: "/art/IMG_2830%28art%29.jpeg",
  },
  {
    id: 9,
    title: "Study — 09",
    medium: "Photograph",
    dimensions: "Archive print",
    year: "2024",
    image: "/art/IMG_3084%28art%29.jpeg",
  },
  {
    id: 10,
    title: "Study — 10",
    medium: "Photograph",
    dimensions: "Archive print",
    year: "2024",
    image: "/art/IMG_3821.jpeg",
  },
  {
    id: 11,
    title: "Study — 11",
    medium: "Photograph",
    dimensions: "Archive print",
    year: "2024",
    image: "/art/IMG_4458%28art%29.jpeg",
  },
  {
    id: 12,
    title: "Study — 12",
    medium: "Photograph",
    dimensions: "Archive print",
    year: "2024",
    image: "/art/IMG_5097%28art%29.jpeg",
  },
  {
    id: 13,
    title: "Study — 13",
    medium: "Photograph",
    dimensions: "Archive print",
    year: "2024",
    image: "/art/IMG_5098%28art%29.jpeg",
  },
  {
    id: 14,
    title: "Study — 14",
    medium: "Photograph",
    dimensions: "Archive print",
    year: "2024",
    image: "/art/IMG_5126%28art%29.jpeg",
  },
  {
    id: 15,
    title: "Study — 15",
    medium: "Photograph",
    dimensions: "Archive print",
    year: "2024",
    image: "/art/IMG_5154%28art%29.jpeg",
  },
]

// Process notes data
export const processNotes = [
  {
    id: 1,
    title: "Roof Truss Iterations",
    date: "March 2024",
    images: ["/placeholder.svg"],
    caption:
      "12 iterations of steel truss configurations for the Canyon House. Explored diamond, Warren, and Pratt patterns before settling on a hybrid approach that balanced structural efficiency with aesthetic intent.",
    tags: ["Iteration", "Structural"],
  },
  {
    id: 2,
    title: "Failed Concrete Study",
    date: "January 2024",
    images: ["/placeholder.svg"],
    caption:
      "Attempted self-supporting folded plate. Failed at 1:5 scale. Learned about reinforcement placement and formwork pressure. The failure led to valuable insights about material behavior under stress.",
    tags: ["Failed study", "Material test"],
  },
  {
    id: 3,
    title: "Parametric Facade Script",
    date: "February 2024",
    images: ["/placeholder.svg"],
    caption:
      "Grasshopper definition for generating responsive facade panels. The script optimizes panel density based on solar exposure analysis, resulting in a gradient effect across the building envelope.",
    tags: ["Script", "Iteration"],
  },
]

export type Rendering = (typeof renderings)[0]
export type ArtistWork = (typeof artistWorks)[0]
export type ProcessNote = (typeof processNotes)[0]

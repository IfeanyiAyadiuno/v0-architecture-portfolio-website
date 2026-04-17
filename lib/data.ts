// —— Technical drawings: project-first model (Plan / Section / Elevation / Detail) ——

export const DRAWING_KINDS = ["Plan", "Section", "Elevation", "Detail"] as const
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
  drawings: Partial<Record<DrawingKind, DrawingSheet>>
}

export const KIND_TO_SLUG: Record<DrawingKind, string> = {
  Plan: "plan",
  Section: "section",
  Elevation: "elevation",
  Detail: "detail",
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
    title: "Downtown Office Tower",
    year: "2024",
    category: "commercial",
    drawings: {
      Plan: sheet("1:200", "Revit", "A-100", [
        "/placeholder.svg",
        "/placeholder.svg",
        "/placeholder.svg",
      ]),
      Section: sheet("1:100", "Rhino", "A-101"),
      Elevation: sheet("1:150", "AutoCAD", "A-102"),
      Detail: sheet("1:20", "Rhino", "A-103"),
    },
  },
  {
    id: 2,
    title: "Mixed-Use Plaza",
    year: "2023",
    category: "commercial",
    drawings: {
      Plan: sheet("1:200", "Revit", "A-102"),
      Section: sheet("1:100", "Revit", "A-103"),
      Elevation: sheet("1:150", "Revit", "A-104"),
      Detail: sheet("1:25", "Rhino", "A-105"),
    },
  },
  {
    id: 3,
    title: "Tech Campus Hub",
    year: "2024",
    category: "commercial",
    drawings: {
      Plan: sheet("1:250", "AutoCAD", "A-103"),
      Section: sheet("1:125", "AutoCAD", "A-104"),
      Elevation: sheet("1:150", "AutoCAD", "A-105"),
      Detail: sheet("1:15", "Rhino", "A-106"),
    },
  },
  {
    id: 4,
    title: "Retail Pavilion",
    year: "2023",
    category: "commercial",
    drawings: {
      Plan: sheet("1:150", "Rhino", "A-104"),
      Section: sheet("1:75", "Rhino", "A-105"),
      Elevation: sheet("1:100", "Revit", "A-106"),
      Detail: sheet("1:20", "Rhino", "A-107"),
    },
  },
]

export const residentialProjects: DrawingProject[] = [
  {
    id: 5,
    title: "Canyon House",
    year: "2024",
    category: "residential",
    drawings: {
      Plan: sheet("1:100", "Revit", "A-201"),
      Section: sheet("1:50", "Revit", "A-202"),
      Elevation: sheet("1:75", "Rhino", "A-203"),
      Detail: sheet("1:10", "Revit", "A-204"),
    },
  },
  {
    id: 6,
    title: "Urban Loft",
    year: "2023",
    category: "residential",
    drawings: {
      Plan: sheet("1:100", "AutoCAD", "A-202"),
      Section: sheet("1:50", "AutoCAD", "A-203"),
      Elevation: sheet("1:75", "AutoCAD", "A-204"),
      Detail: sheet("1:12", "Revit", "A-205"),
    },
  },
  {
    id: 7,
    title: "Weekend Retreat",
    year: "2024",
    category: "residential",
    drawings: {
      Plan: sheet("1:80", "Rhino", "A-203"),
      Section: sheet("1:40", "Rhino", "A-204"),
      Elevation: sheet("1:75", "Rhino", "A-205"),
      Detail: sheet("1:8", "Revit", "A-206"),
    },
  },
  {
    id: 8,
    title: "Courtyard Apartments",
    year: "2023",
    category: "residential",
    drawings: {
      Plan: sheet("1:125", "Revit", "A-204"),
      Section: sheet("1:60", "Revit", "A-205"),
      Elevation: sheet("1:100", "Revit", "A-206"),
      Detail: sheet("1:10", "Revit", "A-207"),
    },
  },
]

export const allDrawingProjects: DrawingProject[] = [
  ...commercialProjects,
  ...residentialProjects,
]

export function getDrawingProjectById(id: number): DrawingProject | undefined {
  return allDrawingProjects.find((p) => p.id === id)
}

export function coverImageForProject(project: DrawingProject): string {
  for (const kind of DRAWING_KINDS) {
    const s = project.drawings[kind]
    if (s?.images[0]) return s.images[0]
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

// Artist works data
export const artistWorks = [
  { id: 1, title: "Study No. 1", medium: "Graphite on paper", dimensions: "11x14in", year: "2024", image: "/placeholder.svg" },
  { id: 2, title: "Model Fragment", medium: "Cardboard, plaster", dimensions: "12x12x8in", year: "2023", image: "/placeholder.svg" },
  { id: 3, title: "Light Study", medium: "Digital photograph", dimensions: "24x36in", year: "2024", image: "/placeholder.svg" },
  { id: 4, title: "Sketch Series III", medium: "Ink on tracing paper", dimensions: "9x12in", year: "2023", image: "/placeholder.svg" },
  { id: 5, title: "Installation View", medium: "Mixed media", dimensions: "Variable", year: "2024", image: "/placeholder.svg" },
  { id: 6, title: "Material Palette", medium: "Digital collage", dimensions: "16x20in", year: "2023", image: "/placeholder.svg" },
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

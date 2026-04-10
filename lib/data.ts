// Projects data for Technical Drawings
export const commercialProjects = [
  { id: 1, title: "Downtown Office Tower", year: "2024", drawingType: "Section", scale: "1:100", software: "Rhino", image: "/placeholder.svg", sheetNumber: "A-101" },
  { id: 2, title: "Mixed-Use Plaza", year: "2023", drawingType: "Plan", scale: "1:200", software: "Revit", image: "/placeholder.svg", sheetNumber: "A-102" },
  { id: 3, title: "Tech Campus Hub", year: "2024", drawingType: "Elevation", scale: "1:150", software: "AutoCAD", image: "/placeholder.svg", sheetNumber: "A-103" },
  { id: 4, title: "Retail Pavilion", year: "2023", drawingType: "Detail", scale: "1:20", software: "Rhino", image: "/placeholder.svg", sheetNumber: "A-104" }
];

export const residentialProjects = [
  { id: 5, title: "Canyon House", year: "2024", drawingType: "Section", scale: "1:50", software: "Revit", image: "/placeholder.svg", sheetNumber: "A-201" },
  { id: 6, title: "Urban Loft", year: "2023", drawingType: "Plan", scale: "1:100", software: "AutoCAD", image: "/placeholder.svg", sheetNumber: "A-202" },
  { id: 7, title: "Weekend Retreat", year: "2024", drawingType: "Elevation", scale: "1:75", software: "Rhino", image: "/placeholder.svg", sheetNumber: "A-203" },
  { id: 8, title: "Courtyard Apartments", year: "2023", drawingType: "Detail", scale: "1:10", software: "Revit", image: "/placeholder.svg", sheetNumber: "A-204" }
];

// Renderings data
export const renderings = [
  { id: 1, title: "Lobby Perspective", software: "Enscape", year: "2024", type: "INTERIOR", image: "/placeholder.svg" },
  { id: 2, title: "Aerial View", software: "V-Ray", year: "2023", type: "AERIAL", image: "/placeholder.svg" },
  { id: 3, title: "Facade Study", software: "Twinmotion", year: "2024", type: "EXTERIOR", image: "/placeholder.svg" },
  { id: 4, title: "Material Detail", software: "Enscape", year: "2023", type: "INTERIOR", image: "/placeholder.svg" },
  { id: 5, title: "Night View", software: "V-Ray", year: "2024", type: "EXTERIOR", image: "/placeholder.svg" },
  { id: 6, title: "Site Context", software: "Twinmotion", year: "2023", type: "AERIAL", image: "/placeholder.svg" }
];

// Artist works data
export const artistWorks = [
  { id: 1, title: "Study No. 1", medium: "Graphite on paper", dimensions: "11x14in", year: "2024", image: "/placeholder.svg" },
  { id: 2, title: "Model Fragment", medium: "Cardboard, plaster", dimensions: "12x12x8in", year: "2023", image: "/placeholder.svg" },
  { id: 3, title: "Light Study", medium: "Digital photograph", dimensions: "24x36in", year: "2024", image: "/placeholder.svg" },
  { id: 4, title: "Sketch Series III", medium: "Ink on tracing paper", dimensions: "9x12in", year: "2023", image: "/placeholder.svg" },
  { id: 5, title: "Installation View", medium: "Mixed media", dimensions: "Variable", year: "2024", image: "/placeholder.svg" },
  { id: 6, title: "Material Palette", medium: "Digital collage", dimensions: "16x20in", year: "2023", image: "/placeholder.svg" }
];

// Process notes data
export const processNotes = [
  { 
    id: 1, 
    title: "Roof Truss Iterations", 
    date: "March 2024", 
    images: ["/placeholder.svg"], 
    caption: "12 iterations of steel truss configurations for the Canyon House. Explored diamond, Warren, and Pratt patterns before settling on a hybrid approach that balanced structural efficiency with aesthetic intent.", 
    tags: ["Iteration", "Structural"] 
  },
  { 
    id: 2, 
    title: "Failed Concrete Study", 
    date: "January 2024", 
    images: ["/placeholder.svg"], 
    caption: "Attempted self-supporting folded plate. Failed at 1:5 scale. Learned about reinforcement placement and formwork pressure. The failure led to valuable insights about material behavior under stress.", 
    tags: ["Failed study", "Material test"] 
  },
  { 
    id: 3, 
    title: "Parametric Facade Script", 
    date: "February 2024", 
    images: ["/placeholder.svg"], 
    caption: "Grasshopper definition for generating responsive facade panels. The script optimizes panel density based on solar exposure analysis, resulting in a gradient effect across the building envelope.", 
    tags: ["Script", "Iteration"] 
  }
];

// All drawings combined for index page
export const allDrawings = [...commercialProjects, ...residentialProjects];

export type Project = typeof commercialProjects[0];
export type Rendering = typeof renderings[0];
export type ArtistWork = typeof artistWorks[0];
export type ProcessNote = typeof processNotes[0];

import { listClientProjects } from "@/lib/client-work-catalog"
import { CreativeDirectorClient } from "./creative-director-client"

export default async function CreativeDirectorPage() {
  const initialProjects = await listClientProjects()
  return <CreativeDirectorClient initialProjects={initialProjects} />
}

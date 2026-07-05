import { getCachedClientProjects } from "@/lib/client-work-catalog"
import { CreativeDirectorClient } from "./creative-director-client"

export default async function CreativeDirectorPage() {
  const initialProjects = await getCachedClientProjects()
  return <CreativeDirectorClient initialProjects={initialProjects} />
}

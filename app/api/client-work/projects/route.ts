import { NextResponse } from "next/server"
import { getCachedClientProjects } from "@/lib/client-work-catalog"

export const revalidate = 3600

export async function GET() {
  const projects = await getCachedClientProjects()
  return NextResponse.json(
    { projects },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    }
  )
}

import { NextResponse } from "next/server"
import { getCachedClientProjects } from "@/lib/client-work-catalog"

export const revalidate = 3600

export async function GET() {
  const projects = await getCachedClientProjects()
  const isDev = process.env.NODE_ENV === "development"
  return NextResponse.json(
    { projects },
    {
      headers: {
        "Cache-Control": isDev
          ? "no-store"
          : "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    }
  )
}

import { NextResponse } from "next/server"
import { listClientProjects } from "@/lib/client-work-catalog"

export async function GET() {
  const projects = await listClientProjects()
  return NextResponse.json({ projects })
}

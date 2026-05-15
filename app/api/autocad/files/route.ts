import { NextResponse } from "next/server"
import { listAutoCADFiles } from "@/lib/autocad-catalog"

export async function GET() {
  const files = await listAutoCADFiles()
  return NextResponse.json({ files })
}

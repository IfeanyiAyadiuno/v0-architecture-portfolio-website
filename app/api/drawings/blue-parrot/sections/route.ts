import { NextResponse } from "next/server"
import { readdir } from "node:fs/promises"
import path from "node:path"

function isPdf(name: string) {
  return /\.pdf$/i.test(name)
}

export async function GET() {
  const dir = path.join(
    process.cwd(),
    "public",
    "drawings",
    "blue parrot",
    "sections"
  )

  let entries: string[] = []
  try {
    entries = await readdir(dir)
  } catch {
    entries = []
  }

  const files = entries
    .filter(isPdf)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((name) => `/drawings/blue%20parrot/sections/${encodeURIComponent(name)}`)

  return NextResponse.json({ files })
}


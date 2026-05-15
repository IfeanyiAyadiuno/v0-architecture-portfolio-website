"use client"

import { useEffect, useState } from "react"
import type { AutoCADFile } from "@/lib/autocad-data"

export function useAutoCADFiles() {
  const [files, setFiles] = useState<AutoCADFile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch("/api/autocad/files")
        if (!res.ok) throw new Error("Failed to load AutoCAD files")
        const data = (await res.json()) as { files?: AutoCADFile[] }
        if (!cancelled) {
          setFiles(data.files ?? [])
          setError(null)
        }
      } catch (e) {
        if (!cancelled) {
          setFiles([])
          setError(e instanceof Error ? e.message : "Failed to load")
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [])

  return { files, loading, error }
}

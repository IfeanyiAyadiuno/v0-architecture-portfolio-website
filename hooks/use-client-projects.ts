"use client"

import { useEffect, useState } from "react"
import type { ClientProject } from "@/lib/client-work-data"

export function useClientProjects() {
  const [projects, setProjects] = useState<ClientProject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch("/api/client-work/projects")
        if (!res.ok) throw new Error("Failed to load client projects")
        const data = (await res.json()) as { projects?: ClientProject[] }
        if (!cancelled) {
          setProjects(data.projects ?? [])
          setError(null)
        }
      } catch (e) {
        if (!cancelled) {
          setProjects([])
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

  return { projects, loading, error }
}

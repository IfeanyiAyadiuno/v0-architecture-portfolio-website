"use client"

import { usePathname } from "next/navigation"
import { useCallback } from "react"
import { scrollToSectionId } from "@/lib/scroll-to-top"

export function useSectionNavClick() {
  const pathname = usePathname()

  return useCallback(
    (sectionId: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault()
      scrollToSectionId(sectionId, pathname)
    },
    [pathname]
  )
}

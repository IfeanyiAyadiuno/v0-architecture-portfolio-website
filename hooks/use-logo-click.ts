"use client"

import { usePathname } from "next/navigation"
import { useCallback } from "react"
import {
  clearHashFromUrl,
  getActiveOverlayClose,
  getActiveScrollContainer,
  isActiveScrollContainerAtTop,
  isScrolledPastThreshold,
  scrollToTop,
} from "@/lib/scroll-to-top"

export function useLogoClick() {
  const pathname = usePathname()

  return useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      const activeContainer = getActiveScrollContainer()

      if (activeContainer && !isActiveScrollContainerAtTop()) {
        e.preventDefault()
        scrollToTop()
        clearHashFromUrl(pathname)
        return
      }

      if (isScrolledPastThreshold()) {
        e.preventDefault()
        scrollToTop()
        clearHashFromUrl(pathname)
        return
      }

      const overlayClose = getActiveOverlayClose()
      if (overlayClose) {
        e.preventDefault()
        overlayClose()
        clearHashFromUrl(pathname)
        return
      }

      if (pathname === "/") {
        e.preventDefault()
        clearHashFromUrl("/")
      }
    },
    [pathname]
  )
}

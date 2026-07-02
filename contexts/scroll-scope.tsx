"use client"

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  type ReactNode,
  type RefObject,
} from "react"
import { setActiveOverlayClose, setActiveScrollContainer } from "@/lib/scroll-to-top"

type ScrollScopeContextValue = {
  registerScrollContainer: (el: HTMLElement | null) => void
  registerOverlayClose: (handler: (() => void) | null) => void
}

const ScrollScopeContext = createContext<ScrollScopeContextValue | null>(null)

export function ScrollScopeProvider({ children }: { children: ReactNode }) {
  const registerScrollContainer = useCallback((el: HTMLElement | null) => {
    setActiveScrollContainer(el)
  }, [])

  const registerOverlayClose = useCallback((handler: (() => void) | null) => {
    setActiveOverlayClose(handler)
  }, [])

  return (
    <ScrollScopeContext.Provider value={{ registerScrollContainer, registerOverlayClose }}>
      {children}
    </ScrollScopeContext.Provider>
  )
}

export function useRegisterScrollContainer(
  ref: RefObject<HTMLElement | null>,
  enabled = true
) {
  const ctx = useContext(ScrollScopeContext)

  useLayoutEffect(() => {
    if (!ctx || !enabled) {
      ctx?.registerScrollContainer(null)
      return
    }

    ctx.registerScrollContainer(ref.current)
    return () => ctx.registerScrollContainer(null)
  })
}

export function useRegisterOverlayClose(onClose: () => void, enabled = true) {
  const ctx = useContext(ScrollScopeContext)

  useLayoutEffect(() => {
    if (!ctx || !enabled) {
      ctx?.registerOverlayClose(null)
      return
    }

    ctx.registerOverlayClose(onClose)
    return () => ctx.registerOverlayClose(null)
  }, [ctx, enabled, onClose])
}

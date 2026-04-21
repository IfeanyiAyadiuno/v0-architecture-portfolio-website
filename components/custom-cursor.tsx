"use client"

import { useEffect, useRef, useState } from "react"

/**
 * Lightweight cursor: no trail (trail caused heavy React re-renders + paint).
 * Position updates via rAF + direct DOM writes to avoid layout thrash.
 */
export function CustomCursor() {
  const [finePointer, setFinePointer] = useState(false)
  const dotRef = useRef<HTMLDivElement>(null)
  const posRef = useRef({ x: 0, y: 0 })
  const hoverRef = useRef(false)
  const visibleRef = useRef(false)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)")
    const syncPointer = () => setFinePointer(mq.matches)
    syncPointer()
    mq.addEventListener("change", syncPointer)
    return () => mq.removeEventListener("change", syncPointer)
  }, [])

  useEffect(() => {
    if (!finePointer) return

    const paint = () => {
      rafRef.current = null
      const el = dotRef.current
      if (!el) return
      const { x, y } = posRef.current
      const h = hoverRef.current
      const size = h ? 24 : 8
      const off = h ? 12 : 4
      el.style.opacity = visibleRef.current ? "1" : "0"
      el.style.width = `${size}px`
      el.style.height = `${size}px`
      el.style.transform = `translate3d(${x - off}px, ${y - off}px, 0)`
    }

    const schedule = () => {
      if (rafRef.current == null) {
        rafRef.current = requestAnimationFrame(paint)
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY }
      visibleRef.current = true
      schedule()
    }

    const handleMouseEnter = () => {
      visibleRef.current = true
      schedule()
    }
    const handleMouseLeave = () => {
      visibleRef.current = false
      schedule()
    }

    const handleHoverStart = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const interactive =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        !!target.closest("a") ||
        !!target.closest("button") ||
        target.dataset.clickable === "true" ||
        !!target.closest("[data-clickable='true']")
      hoverRef.current = interactive
      schedule()
    }

    const handleHoverEnd = () => {
      hoverRef.current = false
      schedule()
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    document.addEventListener("mouseenter", handleMouseEnter)
    document.addEventListener("mouseleave", handleMouseLeave)
    document.addEventListener("mouseover", handleHoverStart)
    document.addEventListener("mouseout", handleHoverEnd)

    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
      window.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseenter", handleMouseEnter)
      document.removeEventListener("mouseleave", handleMouseLeave)
      document.removeEventListener("mouseover", handleHoverStart)
      document.removeEventListener("mouseout", handleHoverEnd)
    }
  }, [finePointer])

  if (!finePointer) return null

  return (
    <div
      ref={dotRef}
      className="pointer-events-none fixed left-0 top-0 z-[9999] rounded-full bg-white mix-blend-difference will-change-[transform,width,height,opacity]"
      style={{
        width: 8,
        height: 8,
        opacity: 0,
        transform: "translate3d(0,0,0)",
      }}
      aria-hidden
    />
  )
}

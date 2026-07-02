"use client"

import { useEffect, useRef, useState } from "react"
import { useMounted } from "@/hooks/use-mounted"

const DOT_SIZE = 8
const DOT_OFFSET = DOT_SIZE / 2

/**
 * Lightweight custom cursor — fixed size, always visible (including over the header).
 * Position updates via rAF + direct DOM writes to avoid layout thrash.
 */
export function CustomCursor() {
  const mounted = useMounted()
  const [finePointer, setFinePointer] = useState(false)
  const dotRef = useRef<HTMLDivElement>(null)
  const posRef = useRef({ x: 0, y: 0 })
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
      el.style.opacity = visibleRef.current ? "1" : "0"
      el.style.transform = `translate3d(${x - DOT_OFFSET}px, ${y - DOT_OFFSET}px, 0)`
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

    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    document.addEventListener("mouseenter", handleMouseEnter)
    document.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
      window.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseenter", handleMouseEnter)
      document.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [finePointer])

  if (!mounted || !finePointer) return null

  return (
    <div
      ref={dotRef}
      className="pointer-events-none fixed left-0 top-0 z-[10001] rounded-full bg-white mix-blend-difference will-change-transform"
      style={{
        width: DOT_SIZE,
        height: DOT_SIZE,
        opacity: 0,
        transform: "translate3d(0,0,0)",
        boxShadow: "0 0 0 1px rgba(0,0,0,0.35)",
      }}
      aria-hidden
    />
  )
}

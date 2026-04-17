"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

const MAX_TRAIL = 36
const MIN_DIST_SQ = 4
const IDLE_MS = 100
const DECAY_MS = 40

export function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [trail, setTrail] = useState<{ x: number; y: number }[]>([])
  const [isHovering, setIsHovering] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const lastMoveRef = useRef(0)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      lastMoveRef.current = Date.now()
      setPosition({ x: e.clientX, y: e.clientY })
      setIsVisible(true)
      setTrail((prev) => {
        const last = prev[prev.length - 1]
        if (last) {
          const dx = e.clientX - last.x
          const dy = e.clientY - last.y
          if (dx * dx + dy * dy < MIN_DIST_SQ) return prev
        }
        return [...prev, { x: e.clientX, y: e.clientY }].slice(-MAX_TRAIL)
      })
    }

    const handleMouseEnter = () => setIsVisible(true)
    const handleMouseLeave = () => setIsVisible(false)

    const handleHoverStart = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.dataset.clickable === "true" ||
        target.closest("[data-clickable='true']")
      ) {
        setIsHovering(true)
      }
    }

    const handleHoverEnd = () => {
      setIsHovering(false)
    }

    window.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseenter", handleMouseEnter)
    document.addEventListener("mouseleave", handleMouseLeave)
    document.addEventListener("mouseover", handleHoverStart)
    document.addEventListener("mouseout", handleHoverEnd)

    const decayId = window.setInterval(() => {
      if (Date.now() - lastMoveRef.current < IDLE_MS) return
      setTrail((t) => (t.length > 0 ? t.slice(1) : t))
    }, DECAY_MS)

    return () => {
      window.clearInterval(decayId)
      window.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseenter", handleMouseEnter)
      document.removeEventListener("mouseleave", handleMouseLeave)
      document.removeEventListener("mouseover", handleHoverStart)
      document.removeEventListener("mouseout", handleHoverEnd)
    }
  }, [])

  return (
    <>
      <div
        className="fixed inset-0 pointer-events-none z-[9998] overflow-hidden"
        aria-hidden
      >
        {trail.map((p, i) => {
          const denom = Math.max(trail.length - 1, 1)
          const t = trail.length === 1 ? 1 : i / denom
          const opacity = 0.05 + t * 0.5
          const size = 4 + t * 20
          const blur = (1 - t) * 6
          return (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                left: p.x,
                top: p.y,
                width: size,
                height: size,
                opacity,
                transform: "translate(-50%, -50%)",
                filter: blur > 0.5 ? `blur(${blur}px)` : undefined,
                boxShadow: `0 0 ${8 + t * 16}px rgba(255, 255, 255, ${0.15 + t * 0.35})`,
              }}
            />
          )
        })}
      </div>
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full bg-white mix-blend-difference"
        animate={{
          x: position.x - (isHovering ? 12 : 4),
          y: position.y - (isHovering ? 12 : 4),
          width: isHovering ? 24 : 8,
          height: isHovering ? 24 : 8,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 28,
          mass: 0.5,
        }}
      />
    </>
  )
}

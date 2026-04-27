"use client"

import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import { ReactNode, useLayoutEffect, useRef } from "react"

interface PageTransitionProps {
  children: ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const prevPathname = useRef<string | null>(null)

  useLayoutEffect(() => {
    if (prevPathname.current === null) {
      prevPathname.current = pathname
      return
    }
    if (prevPathname.current === pathname) return
    prevPathname.current = pathname

    const hash = window.location.hash.slice(1)
    if (hash) {
      const el = document.getElementById(hash)
      requestAnimationFrame(() =>
        el?.scrollIntoView({ behavior: "auto", block: "start" })
      )
      return
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" })
  }, [pathname])

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

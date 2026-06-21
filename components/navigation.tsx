"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"

const TECHNOLOGIST_PATH = "/technologist"

export function Navigation() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  const isHome = pathname === "/"
  const isCreativeDirector = pathname === "/creative-director"
  const isTechnologistArea =
    pathname === TECHNOLOGIST_PATH ||
    pathname.startsWith("/drawings-index") ||
    pathname === "/autocad" ||
    pathname === "/glazing-simulator"

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname !== "/") return
    e.preventDefault()
    const instant = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    window.scrollTo({ top: 0, behavior: instant ? "auto" : "smooth" })
    if (window.location.hash) {
      window.history.replaceState(null, "", "/")
    }
  }

  const navLinkClass =
    "group relative font-mono text-sm tracking-[0.05em] text-white transition-opacity hover:opacity-70"

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className="fixed top-0 left-0 right-0 z-[10000] px-6 py-4 transition-all duration-300"
      style={{
        backgroundColor: scrolled || !isHome ? "rgba(0, 0, 0, 0.92)" : "transparent",
        backdropFilter: scrolled || !isHome ? "blur(4px)" : "none",
      }}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between">
        <Link
          href="/"
          onClick={handleHomeClick}
          className="font-mono text-sm tracking-[0.05em] text-white transition-opacity hover:opacity-70"
        >
          [CHIDERA UZO]
        </Link>

        {!isHome ? (
          <div className="flex items-center gap-8">
            {isTechnologistArea ? (
              <>
                <Link href="/drawings-index" className={navLinkClass}>
                  DRAWINGS INDEX
                  <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-100 bg-white transition-transform" />
                </Link>
                <Link href="/glazing-simulator" className={navLinkClass}>
                  GLAZING SIMULATOR
                  <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-100 bg-white transition-transform" />
                </Link>
                <Link href="/autocad" className={navLinkClass}>
                  AUTOCAD
                  <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-100 bg-white transition-transform" />
                </Link>
                <Link href="/creative-director" className={navLinkClass}>
                  CREATIVE DIRECTOR
                  <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-100 bg-white transition-transform" />
                </Link>
              </>
            ) : null}
            {isCreativeDirector ? (
              <Link href={TECHNOLOGIST_PATH} className={navLinkClass}>
                TECHNOLOGIST
                <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-100 bg-white transition-transform" />
              </Link>
            ) : null}
          </div>
        ) : null}
      </nav>
    </motion.header>
  )
}

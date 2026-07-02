"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { useLogoClick } from "@/hooks/use-logo-click"
import { useMounted } from "@/hooks/use-mounted"
import { SCROLL_THRESHOLD } from "@/lib/scroll-to-top"

const TECHNOLOGIST_PATH = "/technologist"

// Hydration warnings showing `data-cursor-ref` on nav links are injected by the
// Cursor IDE embedded browser for automation — not present in app source or prod.
export function Navigation() {
  const mounted = useMounted()
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
      setScrolled(window.scrollY > SCROLL_THRESHOLD)
    }
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogoClick = useLogoClick()

  const navLinkClass =
    "group relative font-mono text-sm tracking-[0.05em] text-white transition-opacity hover:opacity-70"

  return (
    <motion.header
      initial={mounted ? { y: -100, opacity: 0 } : false}
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
          onClick={handleLogoClick}
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
                <Link
                  href={
                    pathname === TECHNOLOGIST_PATH
                      ? "#autocad"
                      : `${TECHNOLOGIST_PATH}#autocad`
                  }
                  className={navLinkClass}
                >
                  AUTOCAD DETAILS
                  <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-100 bg-white transition-transform" />
                </Link>
                <Link href="/creative-director" className={navLinkClass}>
                  CREATIVE DIRECTOR
                  <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-100 bg-white transition-transform" />
                </Link>
              </>
            ) : null}
            {isCreativeDirector ? (
              <>
                <Link href="#client-work" className={navLinkClass}>
                  CLIENT WORK
                  <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-100 bg-white transition-transform" />
                </Link>
                <Link href="#art" className={navLinkClass}>
                  PERSONAL WORK
                  <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-100 bg-white transition-transform" />
                </Link>
                <Link href={TECHNOLOGIST_PATH} className={navLinkClass}>
                  TECHNOLOGIST
                  <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-100 bg-white transition-transform" />
                </Link>
              </>
            ) : null}
          </div>
        ) : null}
      </nav>
    </motion.header>
  )
}

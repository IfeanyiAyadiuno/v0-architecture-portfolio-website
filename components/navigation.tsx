"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function Navigation() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-[400] px-6 py-4 transition-all duration-300"
      style={{
        backgroundColor: scrolled ? "rgba(0, 0, 0, 0.9)" : "transparent",
        backdropFilter: scrolled ? "blur(10px)" : "none",
      }}
    >
      <nav className="flex items-center justify-between max-w-7xl mx-auto">
        <Link
          href="/"
          className="font-mono text-sm tracking-[0.05em] text-white hover:opacity-70 transition-opacity"
        >
          [CHIDERA UZO]
        </Link>

        <Link
          href="/drawings-index"
          className="group relative font-mono text-sm tracking-[0.05em] text-white transition-opacity hover:opacity-70"
        >
          Drawings index
          <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-100 bg-white transition-transform" />
        </Link>
      </nav>
    </motion.header>
  )
}

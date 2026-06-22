"use client"

import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { ShootingStars } from "./shooting-stars"
import { Footer } from "./footer"

const paths = [
  {
    href: "/technologist",
    index: "01",
    title: "CHIDERA AS AN ARCHITECTURAL TECHNOLOGIST",
    description: "Technical drawings — shop drawings — renderings",
    accent: "from-white/[0.04] to-transparent",
  },
  {
    href: "/creative-director",
    index: "02",
    title: "CHIDERA AS A CREATIVE DIRECTOR",
    description: "Client work — personal studies — experiments",
    accent: "from-white/[0.03] to-transparent",
  },
] as const

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

export function HomeGateway() {
  const reduceMotion = useReducedMotion()

  return (
    <>
      {/* Identity hero */}
      <section className="relative flex min-h-[52vh] flex-col items-center justify-center px-6 pt-28 pb-10 md:min-h-[48vh] md:pb-14">
        <ShootingStars
          className="pointer-events-none absolute inset-0 z-0 opacity-60"
          meanIntervalMs={7000}
          intensity={0.5}
          maxStars={2}
        />
        <motion.div
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          aria-hidden
        >
          <motion.div
            className="h-[min(70vw,480px)] w-[min(70vw,480px)] rounded-full bg-white/[0.035] blur-[56px] md:blur-[72px]"
            animate={
              reduceMotion
                ? { scale: 1, opacity: 0.35 }
                : { scale: [1, 1.04, 1], opacity: [0.28, 0.42, 0.28] }
            }
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <motion.p
            custom={0.1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mb-5 font-mono text-[10px] uppercase tracking-[0.45em] text-[#888888] md:text-xs"
          >
            Architecture &amp; Design
          </motion.p>

          <motion.h1
            custom={0.25}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="hero-headline-glow font-[family-name:var(--font-space-grotesk)] text-4xl font-bold uppercase tracking-[0.06em] text-white md:text-6xl lg:text-7xl"
          >
            [CHIDERA UZO]
          </motion.h1>

          <motion.p
            custom={0.45}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mt-5 font-mono text-sm text-[#AAAAAA] md:text-base"
          >
            Based in [Edmonton] — Available 2026
          </motion.p>

          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 0.75, duration: 0.8, ease: "easeInOut" }}
            className="mx-auto mt-8 h-px w-full max-w-xs origin-center bg-white/40 md:max-w-sm"
          />
        </div>
      </section>

      {/* Path selector */}
      <section className="relative z-10 border-t border-[#222222]">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="border-b border-[#222222] px-6 py-4 text-center font-mono text-[10px] uppercase tracking-[0.4em] text-[#666666]"
        >
          Select a portfolio
        </motion.p>

        <div className="grid min-h-[48vh] grid-cols-1 md:min-h-[52vh] md:grid-cols-2">
          {paths.map((path, index) => (
            <motion.div
              key={path.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + index * 0.15, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className={index === 0 ? "border-b border-[#222222] md:border-b-0 md:border-r" : ""}
            >
              <Link
                href={path.href}
                data-clickable="true"
                className="group relative flex h-full min-h-[44vh] flex-col justify-between overflow-hidden p-8 transition-colors duration-500 hover:bg-white/[0.025] focus-visible:bg-white/[0.025] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white md:min-h-[52vh] md:p-12 lg:p-16"
              >
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${path.accent} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                  aria-hidden
                />
                <div
                  className="pointer-events-none absolute bottom-0 left-0 h-px w-0 bg-white transition-all duration-700 ease-out group-hover:w-full"
                  aria-hidden
                />

                <div className="relative z-10 flex items-start justify-between gap-4">
                  <span className="font-mono text-xs tracking-[0.2em] text-[#555555] transition-colors group-hover:text-[#888888]">
                    {path.index}
                  </span>
                  <ArrowUpRight
                    className="h-5 w-5 shrink-0 text-[#444444] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white md:h-6 md:w-6"
                    strokeWidth={1.25}
                  />
                </div>

                <div className="relative z-10 mt-auto pt-16 md:pt-24">
                  <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold uppercase leading-[1.15] tracking-[0.04em] text-white transition-transform duration-500 group-hover:translate-x-1 md:text-3xl lg:text-[2.35rem]">
                    {path.title}
                  </h2>
                  <p className="mt-4 max-w-md font-mono text-xs uppercase leading-relaxed tracking-wide text-[#888888] transition-colors group-hover:text-[#BBBBBB] md:text-sm">
                    {path.description}
                  </p>
                  <span className="mt-8 inline-block font-mono text-[10px] uppercase tracking-[0.35em] text-[#555555] transition-colors group-hover:text-white">
                    Enter portfolio
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  )
}

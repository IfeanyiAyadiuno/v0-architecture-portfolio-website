"use client"

import { motion } from "framer-motion"

const letterVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.03,
      duration: 0.4,
      ease: "easeOut",
    },
  }),
}

function AnimatedText({ text, className }: { text: string; className?: string }) {
  return (
    <span className={className}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          custom={i}
          variants={letterVariants}
          initial="hidden"
          animate="visible"
          className="inline-block"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  )
}

export function HeroSection() {
  const line1 = "JUNIOR TECHNOLOGIST + ARTIST"
  const line2 = "[CHIDERA UZO]"
  const line3 = "Based in [Edmonton] — Available 2025"

  return (
    <section className="relative isolate z-10 flex h-screen flex-col items-center justify-center px-6">
      <motion.div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        aria-hidden
      >
        <motion.div
          className="h-[min(88vw,640px)] w-[min(88vw,640px)] rounded-full bg-white/[0.045] blur-[110px]"
          animate={{
            scale: [1, 1.12, 1],
            opacity: [0.35, 0.65, 0.35],
          }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      <div className="relative z-10 space-y-6 text-center">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-sm md:text-base font-bold uppercase tracking-[0.2em] text-[#AAAAAA]">
          <AnimatedText text={line1} />
        </h2>

        <h1 className="hero-headline-glow font-[family-name:var(--font-space-grotesk)] text-4xl font-bold uppercase tracking-[0.05em] text-white md:text-6xl lg:text-7xl">
          <AnimatedText text={line2} />
        </h1>

        <p className="font-mono text-sm md:text-base text-[#AAAAAA]">
          <AnimatedText text={line3} />
        </p>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.5, duration: 0.8, ease: "easeInOut" }}
          className="w-full max-w-md mx-auto h-px bg-white origin-left"
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.6 }}
        className="absolute bottom-12 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-12 bg-gradient-to-b from-white to-transparent"
        />
      </motion.div>
    </section>
  )
}

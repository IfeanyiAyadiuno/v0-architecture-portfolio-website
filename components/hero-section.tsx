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
  const line2 = "[Your Name]"
  const line3 = "Based in [City] — Available 2025"

  return (
    <section className="h-screen flex flex-col items-center justify-center px-6 relative">
      <div className="text-center space-y-6">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-sm md:text-base font-bold uppercase tracking-[0.2em] text-[#AAAAAA]">
          <AnimatedText text={line1} />
        </h2>

        <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl md:text-6xl lg:text-7xl font-bold uppercase tracking-[0.05em] text-white">
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
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
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

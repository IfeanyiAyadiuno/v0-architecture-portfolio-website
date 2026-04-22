"use client"

import { motion } from "framer-motion"
import Link from "next/link"

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="py-20 px-6 border-t border-[#333333]"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <h3 className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold uppercase tracking-[0.05em] text-white">
              [CHIDERA UZO]
            </h3>
            <div className="space-y-2 font-mono text-sm text-[#AAAAAA]">
              <p>
                <Link
                  href="mailto:chiderauzoh2003@gmail.com"
                  className="hover:text-white transition-colors relative group"
                >
                  chiderauzoh2003@gmail.com
                  <span className="absolute left-0 -bottom-px w-0 h-px bg-white group-hover:w-full transition-all duration-300" />
                </Link>
              </p>
              <p>
                <Link
                  href="https://www.linkedin.com/in/chidera-uzo-6128532aa/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors relative group"
                >
                  LinkedIn
                  <span className="absolute left-0 -bottom-px w-0 h-px bg-white group-hover:w-full transition-all duration-300" />
                </Link>
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-end items-start md:items-end space-y-2 font-mono text-sm text-[#AAAAAA]">
            <p>&copy; 2025</p>
            <p>Built with Next.js + Framer Motion</p>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}

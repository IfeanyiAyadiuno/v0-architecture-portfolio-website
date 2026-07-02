import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function GlazingSimulatorPage() {
  return (
    <main className="h-screen bg-black pt-16">
        <div className="pointer-events-none absolute left-6 top-20 z-10">
          <Link
            href="/technologist"
            className="pointer-events-auto inline-flex items-center gap-2 border border-[#333333] bg-black/80 px-3 py-2 font-mono text-xs uppercase tracking-[0.12em] text-[#AAAAAA] transition-colors hover:border-white hover:text-white"
            data-clickable="true"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to portfolio page
          </Link>
        </div>
        <iframe
          title="Glazing Performance Simulator"
          src="/glazing-simulator-v4.html"
          className="h-[calc(100vh-64px)] w-full border-0 bg-black"
        />
      </main>
  )
}


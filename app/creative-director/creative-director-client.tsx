"use client"

import { PageVisualFx } from "@/components/page-visual-fx"
import { HeroSection } from "@/components/hero-section"
import { ClientWorkSection } from "@/components/client-work-section"
import { ArtistSection } from "@/components/artist-section"
import { Footer } from "@/components/footer"
import { PageTransition } from "@/components/page-transition"
import type { ClientProject } from "@/lib/client-work-data"

export function CreativeDirectorClient({
  initialProjects,
}: {
  initialProjects: ClientProject[]
}) {
  return (
    <PageTransition>
      <main className="relative min-h-screen bg-black">
        <PageVisualFx />
        <div className="relative z-10">
          <HeroSection roleLine="CREATIVE DIRECTOR" scrollTarget="#client-work" />
          <ClientWorkSection initialProjects={initialProjects} />
          <ArtistSection />
          <Footer />
        </div>
      </main>
    </PageTransition>
  )
}

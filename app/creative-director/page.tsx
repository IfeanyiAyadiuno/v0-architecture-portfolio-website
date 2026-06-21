"use client"

import { Navigation } from "@/components/navigation"
import { CustomCursor } from "@/components/custom-cursor"
import { PageVisualFx } from "@/components/page-visual-fx"
import { HeroSection } from "@/components/hero-section"
import { ClientWorkSection } from "@/components/client-work-section"
import { ArtistSection } from "@/components/artist-section"
import { Footer } from "@/components/footer"
import { PageTransition } from "@/components/page-transition"

export default function CreativeDirectorPage() {
  return (
    <>
      <CustomCursor />
      <Navigation />
      <PageTransition>
        <main className="relative min-h-screen bg-black">
          <PageVisualFx />
          <div className="relative z-10">
            <HeroSection roleLine="CREATIVE DIRECTOR" scrollTarget="#client-work" />
            <ClientWorkSection />
            <ArtistSection />
            <Footer />
          </div>
        </main>
      </PageTransition>
    </>
  )
}

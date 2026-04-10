"use client"

import { Navigation } from "@/components/navigation"
import { CustomCursor } from "@/components/custom-cursor"
import { HeroSection } from "@/components/hero-section"
import { TechnicalDrawingsSection } from "@/components/technical-drawings-section"
import { RenderingsSection } from "@/components/renderings-section"
import { ArtistSection } from "@/components/artist-section"
import { Footer } from "@/components/footer"
import { PageTransition } from "@/components/page-transition"

export default function HomePage() {
  return (
    <>
      <CustomCursor />
      <Navigation />
      <PageTransition>
        <main className="min-h-screen bg-black">
          <HeroSection />
          <TechnicalDrawingsSection />
          <RenderingsSection />
          <ArtistSection />
          <Footer />
        </main>
      </PageTransition>
    </>
  )
}

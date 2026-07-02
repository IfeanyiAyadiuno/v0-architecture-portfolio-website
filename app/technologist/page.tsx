"use client"

import { PageVisualFx } from "@/components/page-visual-fx"
import { HeroSection } from "@/components/hero-section"
import { TechnicalDrawingsSection } from "@/components/technical-drawings-section"
import { RenderingsSection } from "@/components/renderings-section"
import { AutoCADSection } from "@/components/autocad-section"
import { Footer } from "@/components/footer"
import { PageTransition } from "@/components/page-transition"

export default function TechnologistPage() {
  return (
    <PageTransition>
      <main className="relative min-h-screen bg-black">
        <PageVisualFx />
        <div className="relative z-10">
          <HeroSection />
          <TechnicalDrawingsSection />
          <AutoCADSection />
          <RenderingsSection />
          <Footer />
        </div>
      </main>
    </PageTransition>
  )
}

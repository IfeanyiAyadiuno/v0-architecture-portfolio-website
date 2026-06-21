"use client"

import { Navigation } from "@/components/navigation"
import { CustomCursor } from "@/components/custom-cursor"
import { PageVisualFx } from "@/components/page-visual-fx"
import { HomeGateway } from "@/components/home-gateway"
import { PageTransition } from "@/components/page-transition"

export default function HomePage() {
  return (
    <>
      <CustomCursor />
      <Navigation />
      <PageTransition>
        <main className="relative min-h-screen bg-black">
          <PageVisualFx />
          <HomeGateway />
        </main>
      </PageTransition>
    </>
  )
}

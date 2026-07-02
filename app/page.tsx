"use client"

import { PageVisualFx } from "@/components/page-visual-fx"
import { HomeGateway } from "@/components/home-gateway"
import { PageTransition } from "@/components/page-transition"

export default function HomePage() {
  return (
    <PageTransition>
      <main className="relative min-h-screen bg-black">
        <PageVisualFx />
        <HomeGateway />
      </main>
    </PageTransition>
  )
}

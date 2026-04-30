"use client"

import { useEffect, useRef } from "react"

type ShootingStarsProps = {
  /** Average time between stars (ms). Randomized around this value. */
  meanIntervalMs?: number
  /** Opacity multiplier for the streaks (0..1). */
  intensity?: number
  /** Maximum concurrent stars. */
  maxStars?: number
  className?: string
}

type Star = {
  x: number
  y: number
  vx: number
  vy: number
  len: number
  lifeMs: number
  ageMs: number
  width: number
  alpha: number
}

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n))
}

function rand(min: number, max: number) {
  return min + Math.random() * (max - min)
}

function nextDelay(mean: number) {
  // Slightly jittery "periodic" timing without looking too mechanical.
  // Range roughly [0.55..1.55] * mean.
  return Math.round(mean * rand(0.55, 1.55))
}

export function ShootingStars({
  meanIntervalMs = 6500,
  intensity = 0.6,
  maxStars = 3,
  className,
}: ShootingStarsProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const reduceMotionMq = window.matchMedia?.("(prefers-reduced-motion: reduce)")
    if (reduceMotionMq?.matches) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const stars: Star[] = []
    let raf = 0
    let last = performance.now()
    let spawnTimer = 0
    let spawnDelay = nextDelay(meanIntervalMs)

    const resize = () => {
      const parent = canvas.parentElement
      const rect = parent?.getBoundingClientRect()
      const w = Math.max(1, Math.floor(rect?.width ?? window.innerWidth))
      const h = Math.max(1, Math.floor(rect?.height ?? window.innerHeight))

      const dpr = Math.min(2, window.devicePixelRatio || 1)
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const spawn = () => {
      if (stars.length >= maxStars) return

      const parent = canvas.parentElement
      const rect = parent?.getBoundingClientRect()
      const w = Math.max(1, rect?.width ?? window.innerWidth)
      const h = Math.max(1, rect?.height ?? window.innerHeight)

      // Spawn near the upper-left / upper-right edges so streaks feel like background.
      const fromLeft = Math.random() < 0.6
      const x = fromLeft ? rand(-w * 0.05, w * 0.35) : rand(w * 0.65, w * 1.05)
      const y = rand(-h * 0.05, h * 0.35)

      // Diagonal direction downward, slight variance.
      const speed = rand(700, 1150) // px/s
      const angle = fromLeft ? rand(0.78, 1.08) : rand(2.05, 2.32) // radians
      const vx = Math.cos(angle) * speed
      const vy = Math.sin(angle) * speed

      stars.push({
        x,
        y,
        vx,
        vy,
        len: rand(120, 220),
        lifeMs: rand(700, 1150),
        ageMs: 0,
        width: rand(1.1, 1.8),
        alpha: rand(0.22, 0.38) * clamp01(intensity),
      })
    }

    const draw = (dtMs: number) => {
      const parent = canvas.parentElement
      const rect = parent?.getBoundingClientRect()
      const w = Math.max(1, rect?.width ?? window.innerWidth)
      const h = Math.max(1, rect?.height ?? window.innerHeight)

      ctx.clearRect(0, 0, w, h)

      for (let i = stars.length - 1; i >= 0; i--) {
        const s = stars[i]
        s.ageMs += dtMs
        const t = s.ageMs / s.lifeMs
        if (t >= 1) {
          stars.splice(i, 1)
          continue
        }

        const dt = dtMs / 1000
        s.x += s.vx * dt
        s.y += s.vy * dt

        // Ease in/out alpha: quick appear, longer fade.
        const fadeIn = Math.min(1, t / 0.18)
        const fadeOut = 1 - Math.max(0, (t - 0.25) / 0.75)
        const a = s.alpha * fadeIn * fadeOut

        const dx = s.vx
        const dy = s.vy
        const mag = Math.max(1, Math.hypot(dx, dy))
        const ux = dx / mag
        const uy = dy / mag

        const x2 = s.x - ux * s.len
        const y2 = s.y - uy * s.len

        ctx.save()
        ctx.globalCompositeOperation = "lighter"
        ctx.lineCap = "round"
        ctx.lineWidth = s.width

        // Subtle glow gradient along the streak.
        const grad = ctx.createLinearGradient(s.x, s.y, x2, y2)
        grad.addColorStop(0, `rgba(255,255,255,${a})`)
        grad.addColorStop(0.35, `rgba(160,220,255,${a * 0.55})`)
        grad.addColorStop(1, `rgba(255,255,255,0)`)
        ctx.strokeStyle = grad

        ctx.beginPath()
        ctx.moveTo(s.x, s.y)
        ctx.lineTo(x2, y2)
        ctx.stroke()
        ctx.restore()
      }
    }

    const loop = (now: number) => {
      const dt = Math.min(40, now - last)
      last = now

      spawnTimer += dt
      if (spawnTimer >= spawnDelay) {
        spawnTimer = 0
        spawnDelay = nextDelay(meanIntervalMs)
        spawn()

        // Very occasional second star right after the first (tiny "burst").
        if (Math.random() < 0.18) {
          setTimeout(() => spawn(), rand(120, 420))
        }
      }

      draw(dt)
      raf = requestAnimationFrame(loop)
    }

    resize()
    const onResize = () => resize()
    window.addEventListener("resize", onResize)
    raf = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener("resize", onResize)
      cancelAnimationFrame(raf)
      stars.splice(0, stars.length)
    }
  }, [intensity, maxStars, meanIntervalMs])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
    />
  )
}


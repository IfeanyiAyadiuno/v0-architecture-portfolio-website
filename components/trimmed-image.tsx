"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { trimImageWhitespace } from "@/lib/trim-image-whitespace"

type TrimmedImageProps = {
  src: string
  alt: string
  className?: string
  sizes?: string
  trimWhitespace?: boolean
  fill?: boolean
  priority?: boolean
  onLayoutReady?: () => void
}

export function TrimmedImage({
  src,
  alt,
  className,
  sizes = "100vw",
  trimWhitespace = true,
  fill = false,
  priority = false,
  onLayoutReady,
}: TrimmedImageProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(priority)
  const [display, setDisplay] = useState<{
    src: string
    width: number
    height: number
  } | null>(null)

  useEffect(() => {
    if (priority) {
      setVisible(true)
      return
    }

    const el = containerRef.current
    if (!el) return

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          io.disconnect()
        }
      },
      { rootMargin: "240px 0px" }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [priority, src])

  useEffect(() => {
    if (!visible) return

    let cancelled = false

    async function prepare() {
      try {
        if (trimWhitespace) {
          const result = await trimImageWhitespace(src)
          if (!cancelled) {
            setDisplay({
              src: result.src,
              width: result.width,
              height: result.height,
            })
          }
          return
        }

        const img = await new Promise<HTMLImageElement>((resolve, reject) => {
          const el = document.createElement("img")
          el.onload = () => resolve(el)
          el.onerror = reject
          el.src = src
        })

        if (!cancelled) {
          setDisplay({
            src,
            width: img.naturalWidth,
            height: img.naturalHeight,
          })
        }
      } catch {
        if (!cancelled) {
          setDisplay({ src, width: 1400, height: 1800 })
        }
      }
    }

    void prepare()
    return () => {
      cancelled = true
    }
  }, [src, trimWhitespace, visible])

  if (!display) {
    return (
      <div
        ref={containerRef}
        className={fill ? `absolute inset-0 ${className ?? ""}` : className}
        style={fill ? undefined : { aspectRatio: "3 / 4", width: "100%" }}
        aria-hidden={fill || !alt}
      />
    )
  }

  return (
    <Image
      src={display.src}
      alt={alt}
      width={fill ? undefined : display.width}
      height={fill ? undefined : display.height}
      fill={fill}
      sizes={sizes}
      priority={priority}
      unoptimized={display.src.startsWith("data:")}
      className={className}
      onLoad={onLayoutReady}
    />
  )
}

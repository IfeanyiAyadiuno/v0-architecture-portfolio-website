export function requestFullscreenEl(el: HTMLElement) {
  const anyEl = el as HTMLElement & {
    webkitRequestFullscreen?: () => Promise<void>
  }
  return (
    el.requestFullscreen?.() ??
    anyEl.webkitRequestFullscreen?.() ??
    Promise.resolve()
  )
}

export function getFullscreenElement(): Element | null {
  const doc = document as Document & {
    webkitFullscreenElement?: Element | null
  }
  return document.fullscreenElement ?? doc.webkitFullscreenElement ?? null
}

export function exitFullscreenDoc() {
  const doc = document as Document & {
    webkitExitFullscreen?: () => Promise<void>
  }
  if (document.fullscreenElement) {
    return document.exitFullscreen?.() ?? Promise.resolve()
  }
  if (getFullscreenElement()) {
    return doc.webkitExitFullscreen?.() ?? Promise.resolve()
  }
  return Promise.resolve()
}

/** True when native element fullscreen is unreliable; use CSS immersive mode instead. */
export function useImmersiveFullscreenFallback(): boolean {
  if (typeof window === "undefined") return false
  const ua = navigator.userAgent
  if (/iPad|iPhone|iPod/i.test(ua)) return true
  return window.matchMedia("(pointer: coarse)").matches
}

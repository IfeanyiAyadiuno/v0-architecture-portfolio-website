export const SCROLL_THRESHOLD = 50

let activeScrollContainer: HTMLElement | null = null
let activeOverlayClose: (() => void) | null = null

export function setActiveScrollContainer(el: HTMLElement | null) {
  activeScrollContainer = el
}

export function setActiveOverlayClose(handler: (() => void) | null) {
  activeOverlayClose = handler
}

export function getActiveOverlayClose() {
  return activeOverlayClose
}

export function getActiveScrollContainer() {
  return activeScrollContainer
}

function isElementScrolledPastThreshold(el: HTMLElement) {
  return el.scrollTop > SCROLL_THRESHOLD
}

export function isScrolledPastThreshold(scrollY = window.scrollY) {
  if (activeScrollContainer && isElementScrolledPastThreshold(activeScrollContainer)) {
    return true
  }
  return scrollY > SCROLL_THRESHOLD
}

export function isActiveScrollContainerAtTop() {
  if (!activeScrollContainer) return true
  return activeScrollContainer.scrollTop <= SCROLL_THRESHOLD
}

export function scrollToTop() {
  const instant = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  const behavior = instant ? "auto" : "smooth"

  if (activeScrollContainer && isElementScrolledPastThreshold(activeScrollContainer)) {
    activeScrollContainer.scrollTo({ top: 0, behavior })
    return
  }

  window.scrollTo({ top: 0, behavior })
}

export function clearHashFromUrl(pathname: string) {
  if (window.location.hash) {
    window.history.replaceState(null, "", pathname)
  }
}

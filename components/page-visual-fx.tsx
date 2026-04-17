"use client"

export function PageVisualFx() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <div className="fx-aurora" />
      <div className="fx-sweep-mask absolute inset-0">
        <div className="fx-sweep" />
      </div>
      <div className="fx-grid absolute inset-0" />
      <div className="fx-vignette absolute inset-0" />
      <div className="fx-grain absolute inset-0" />
    </div>
  )
}

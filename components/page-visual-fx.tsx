"use client"

export function PageVisualFx() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      {/* Each layer needs `pointer-events-none`: children default to `auto` and can steal hits. */}
      <div className="pointer-events-none fx-aurora" />
      <div className="pointer-events-none fx-sweep-mask absolute inset-0">
        <div className="pointer-events-none fx-sweep" />
      </div>
      <div className="pointer-events-none fx-grid absolute inset-0" />
      <div className="pointer-events-none fx-vignette absolute inset-0" />
      <div className="pointer-events-none fx-grain absolute inset-0" />
    </div>
  )
}

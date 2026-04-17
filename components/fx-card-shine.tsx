/** Subtle light sweep on hover — parent must have `group` and `relative overflow-hidden`. */
export function FxCardShine() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-[5] overflow-hidden opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      aria-hidden
    >
      <div className="absolute inset-0 -translate-x-full -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full" />
    </div>
  )
}

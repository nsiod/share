export function HeroBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* Grid pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--hero-grid-color) 1px, transparent 1px),
            linear-gradient(to bottom, var(--hero-grid-color) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
        }}
      />
      {/* Radial fade mask — hides grid at edges */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 60% 50% at 50% 50%, transparent 0%, var(--hero-bg) 100%)`,
        }}
      />
    </div>
  )
}

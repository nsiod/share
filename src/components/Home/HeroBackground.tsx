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
      {/* Soft glow accents */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[300px] rounded-full opacity-30 blur-[120px] animate-[hero-glow_8s_ease-in-out_infinite] bg-blue-400/20 dark:bg-blue-500/15" />
      <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[250px] rounded-full opacity-25 blur-[100px] animate-[hero-glow_8s_ease-in-out_2s_infinite] bg-indigo-300/20 dark:bg-indigo-400/10" />
    </div>
  )
}

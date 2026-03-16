export function HeroBackground() {
  const maskValue = `
    repeating-linear-gradient(
      to right,
      black 0px,
      black 3px,
      transparent 3px,
      transparent 8px
    ),
    repeating-linear-gradient(
      to bottom,
      black 0px,
      black 3px,
      transparent 3px,
      transparent 8px
    ),
    radial-gradient(ellipse 60% 60% at 50% 50%, #000 30%, transparent 70%)
  `

  return (
    <div
      className="absolute inset-0 -z-10"
      style={{
        backgroundImage: `
          linear-gradient(to right, var(--hero-grid-color) 1px, transparent 1px),
          linear-gradient(to bottom, var(--hero-grid-color) 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px',
        maskImage: maskValue,
        WebkitMaskImage: maskValue,
        maskComposite: 'intersect',
        WebkitMaskComposite: 'source-in',
      }}
    />
  )
}

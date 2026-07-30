export function SiteLogo() {
  return (
    <a href="/" aria-label="Satisfaction home" className="fixed top-6 left-8 z-50 sm:left-10">
      <img
        src="/satisfaction.png"
        alt="Satisfaction"
        className="h-10 w-10 object-contain transition-transform duration-300 hover:scale-110"
      />
    </a>
  )
}

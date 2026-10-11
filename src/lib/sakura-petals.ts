/** CSS owns the animation; this controller only reconciles visibility/preferences. */
export function initSakuraPetals(): { setEnabled(enabled: boolean): void } {
  const layers = document.querySelectorAll<HTMLElement>('[data-sakura-petals]')
  if (!layers.length) return { setEnabled() {} }

  const reduced = matchMedia('(prefers-reduced-motion: reduce)')
  let requested = false

  function update() {
    const active = requested && !reduced.matches && !document.hidden
    layers.forEach((layer) => layer.toggleAttribute('data-sakura-active', active))
  }

  reduced.addEventListener('change', update)
  document.addEventListener('visibilitychange', update)
  window.addEventListener('pagehide', () => {
    layers.forEach((layer) => layer.removeAttribute('data-sakura-active'))
  })
  window.addEventListener('pageshow', update)

  return {
    setEnabled(value) {
      requested = value
      update()
    }
  }
}

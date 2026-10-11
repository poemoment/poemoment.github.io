import '@/assets/styles/stardust-trail.css'

/** Small, short-lived sparks confined to decorative illustrations. */
export function initStardustTrail(): { setEnabled(enabled: boolean): void } {
  const regions = [...document.querySelectorAll<HTMLElement>('[data-stardust-trail]')]
  if (!regions.length) return { setEnabled() {} }

  const mouse = matchMedia('(hover: hover) and (pointer: fine)')
  const reduced = matchMedia('(prefers-reduced-motion: reduce)')
  const particles = new Map<HTMLElement, Animation>()
  const positions = new Map<HTMLElement, { x: number; y: number; time: number }>()
  let requested = false
  let enabled = false
  let focused = true
  let pageVisible = true
  let sequence = 0

  function clear() {
    for (const [particle, animation] of particles) {
      animation.cancel()
      particle.remove()
    }
    particles.clear()
    positions.clear()
  }

  function updateMode() {
    clear()
    enabled =
      requested && mouse.matches && !reduced.matches && !document.hidden && focused && pageVisible
    regions.forEach((region) => region.toggleAttribute('data-stardust-ready', enabled))
  }

  for (const region of regions) {
    const layer = region.querySelector<HTMLElement>('[data-stardust-layer]')
    if (!layer) continue

    region.addEventListener(
      'pointermove',
      (event) => {
        if (!enabled || document.hidden || event.pointerType !== 'mouse') return
        const bounds = region.getBoundingClientRect()
        const x = event.clientX - bounds.left
        const y = event.clientY - bounds.top
        const now = performance.now()
        const last = positions.get(region)
        if (
          particles.size >= 8 ||
          (last && (now - last.time < 75 || Math.hypot(x - last.x, y - last.y) < 32))
        )
          return
        positions.set(region, { x, y, time: now })

        const variation = sequence++ % 4
        const particle = document.createElement('span')
        particle.className = 'stardust-particle'
        particle.dataset.tone = variation % 2 ? 'pink' : 'blue'
        particle.style.left = `${x}px`
        particle.style.top = `${y}px`
        particle.style.setProperty('--spark-size', `${7 + variation}px`)
        layer.append(particle)

        const origin = 'translate(-50%, -50%)'
        const drift = (variation - 1.5) * 5
        const animation = particle.animate(
          [
            { opacity: 0, transform: `${origin} scale(.35) rotate(-15deg)`, offset: 0 },
            { opacity: 0.85, transform: `${origin} scale(1) rotate(0deg)`, offset: 0.16 },
            {
              opacity: 0,
              transform: `${origin} translate(${drift}px, -16px) scale(.15) rotate(35deg)`,
              offset: 1
            }
          ],
          { duration: 620, easing: 'cubic-bezier(.2,.65,.3,1)', fill: 'forwards' }
        )
        particles.set(particle, animation)
        const remove = () => {
          particles.delete(particle)
          particle.remove()
        }
        animation.finished.then(remove, remove)
      },
      { passive: true }
    )
    // Existing sparks finish naturally; re-entry starts a fresh gesture.
    region.addEventListener('pointerleave', () => positions.delete(region))
    region.addEventListener('pointercancel', clear)
  }

  mouse.addEventListener('change', updateMode)
  reduced.addEventListener('change', updateMode)
  document.addEventListener('visibilitychange', updateMode)
  window.addEventListener('pageshow', () => {
    pageVisible = true
    updateMode()
  })
  window.addEventListener('pagehide', () => {
    pageVisible = false
    updateMode()
  })
  window.addEventListener('blur', () => {
    focused = false
    updateMode()
  })
  window.addEventListener('focus', () => {
    focused = true
    updateMode()
  })
  window.addEventListener('scroll', clear, { passive: true })
  window.addEventListener('resize', clear, { passive: true })

  return {
    setEnabled(value) {
      requested = value
      updateMode()
    }
  }
}

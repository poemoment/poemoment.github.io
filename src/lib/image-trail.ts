import '@/assets/styles/image-trail.css'

/** A bounded, event-driven postcard trail confined to the decorative home illustration. */
export function initImageTrail() {
  const regions = document.querySelectorAll<HTMLElement>('[data-image-trail]')
  if (!regions.length) return { setEnabled() {} }
  const mouse = matchMedia('(hover: hover) and (pointer: fine)')
  const animations = new Set<Animation>()
  const cards = new Set<HTMLElement>()
  const crops = [
    { position: '50% 50%', size: 'cover' },
    { position: '50% 88%', size: '210%' },
    { position: '5% 20%', size: '180%' },
    { position: '95% 45%', size: '180%' },
    { position: '50% 50%', size: 'cover' }
  ]
  let enabled = false
  let sequence = 0
  let lastX: number | undefined
  let lastY: number | undefined
  let lastTime = 0

  function clear() {
    for (const animation of animations) animation.cancel()
    animations.clear()
    for (const card of cards) card.remove()
    cards.clear()
    lastX = lastY = undefined
    lastTime = 0
  }

  function sync() {
    clear()
    for (const region of regions) {
      region.toggleAttribute('data-trail-ready', enabled && mouse.matches)
    }
  }

  for (const region of regions) {
    const layer = region.querySelector<HTMLElement>('[data-trail-layer]')
    if (!layer) continue
    region.addEventListener(
      'pointermove',
      (event) => {
        if (!enabled || !mouse.matches || event.pointerType !== 'mouse') return
        const bounds = region.getBoundingClientRect()
        const x = event.clientX - bounds.left
        const y = event.clientY - bounds.top
        const now = performance.now()
        const distance = lastX === undefined ? Infinity : Math.hypot(x - lastX, y - (lastY ?? y))
        if (distance < 58 || now - lastTime < 70 || cards.size >= 8) return
        const direction = lastX === undefined ? 1 : Math.sign(x - lastX) || 1
        lastX = x
        lastY = y
        lastTime = now

        const card = document.createElement('span')
        card.className = 'image-trail-card'
        card.style.left = `${x}px`
        card.style.top = `${y}px`
        card.style.zIndex = String(sequence)
        const crop = crops[sequence++ % crops.length]
        const picture = document.createElement('span')
        picture.style.backgroundPosition = crop.position
        picture.style.backgroundSize = crop.size
        card.append(picture)
        layer.append(card)
        cards.add(card)

        const angle = ((sequence % 5) - 2) * 4 + direction * 3
        const base = 'translate(-50%, -50%)'
        const animation = card.animate(
          [
            {
              opacity: 0,
              transform: `${base} rotate(${angle - direction * 8}deg) scale(.55)`,
              offset: 0
            },
            { opacity: 0.96, transform: `${base} rotate(${angle}deg) scale(1)`, offset: 0.16 },
            {
              opacity: 0.9,
              transform: `${base} translateY(-8px) rotate(${angle}deg) scale(1)`,
              offset: 0.5
            },
            {
              opacity: 0,
              transform: `${base} translateY(-30px) rotate(${angle + direction * 5}deg) scale(.82)`,
              offset: 1
            }
          ],
          { duration: 1250, easing: 'cubic-bezier(.2,.65,.3,1)', fill: 'forwards' }
        )
        animations.add(animation)
        const remove = () => {
          animations.delete(animation)
          cards.delete(card)
          card.remove()
        }
        animation.finished.then(remove, remove)
      },
      { passive: true }
    )
    region.addEventListener('pointerleave', () => {
      lastX = lastY = undefined
    })
    region.addEventListener('pointercancel', clear)
  }

  mouse.addEventListener('change', sync)
  window.addEventListener('blur', clear)
  window.addEventListener('pagehide', clear)
  window.addEventListener('resize', clear, { passive: true })
  // A stationary cursor should never draw a trail just because the page moved.
  window.addEventListener('scroll', clear, { passive: true })
  return {
    setEnabled(value: boolean) {
      enabled = value
      sync()
    }
  }
}

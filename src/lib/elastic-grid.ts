/** Scroll impulses settle back to the static grid; no work runs between gestures. */
export function initElasticGrid(): { setEnabled(enabled: boolean): void } {
  const grid = document.querySelector<HTMLElement>('[data-elastic-grid]')
  if (!grid) return { setEnabled() {} }

  const desktop = matchMedia('(min-width: 768px) and (hover: hover) and (pointer: fine)')
  const reduced = matchMedia('(prefers-reduced-motion: reduce)')
  const cards = [...grid.querySelectorAll<HTMLElement>('[data-elastic-item]')].map(
    (element, index) => ({
      element,
      factor: index % 2 === 0 ? 0.65 : -1,
      offset: 0,
      velocity: 0,
      hovered: false
    })
  )
  let requested = false
  let enabled = false
  let frame = 0
  let lastFrame = 0
  let lastScroll = window.scrollY

  function resetCard(card: (typeof cards)[number]) {
    card.offset = 0
    card.velocity = 0
    card.element.style.removeProperty('--elastic-y')
  }

  function reset() {
    cancelAnimationFrame(frame)
    frame = 0
    lastFrame = 0
    lastScroll = window.scrollY
    cards.forEach(resetCard)
  }

  function isHeld(card: (typeof cards)[number]) {
    return card.hovered || card.element.contains(document.activeElement)
  }

  function paint(time: number) {
    frame = 0
    if (!enabled || document.hidden) return reset()
    const elapsed = lastFrame ? Math.min((time - lastFrame) / 16.667, 2) : 1
    lastFrame = time
    // Two bounded integration steps keep the spring stable after a slow frame.
    const step = elapsed / 2
    let moving = false
    for (const card of cards) {
      if (isHeld(card)) {
        resetCard(card)
        continue
      }
      for (let index = 0; index < 2; index++) {
        card.velocity += (-card.offset * 0.12 - card.velocity * 0.23) * step
        card.offset += card.velocity * step
      }
      card.offset = Math.max(-22, Math.min(22, card.offset))
      if (Math.abs(card.offset) < 0.08 && Math.abs(card.velocity) < 0.08) {
        resetCard(card)
      } else {
        card.element.style.setProperty('--elastic-y', `${card.offset.toFixed(2)}px`)
        moving = true
      }
    }
    if (moving) frame = requestAnimationFrame(paint)
    else lastFrame = 0
  }

  function updateMode() {
    enabled = requested && desktop.matches && !reduced.matches && !document.hidden
    reset()
  }

  for (const card of cards) {
    card.element.addEventListener('pointerenter', (event) => {
      if (event.pointerType !== 'mouse') return
      card.hovered = true
      resetCard(card)
    })
    card.element.addEventListener('pointerleave', () => {
      card.hovered = false
    })
    card.element.addEventListener('pointercancel', () => {
      card.hovered = false
      resetCard(card)
    })
    card.element.addEventListener('focusin', () => resetCard(card))
  }

  window.addEventListener(
    'scroll',
    () => {
      const current = window.scrollY
      const delta = Math.max(-100, Math.min(100, current - lastScroll))
      lastScroll = current
      if (!enabled || delta === 0) return
      const bounds = grid.getBoundingClientRect()
      if (bounds.bottom < -24 || bounds.top > window.innerHeight + 24) return reset()
      for (const card of cards) {
        if (isHeld(card)) continue
        card.velocity = Math.max(-7, Math.min(7, card.velocity + delta * 0.065 * card.factor))
      }
      if (!frame) frame = requestAnimationFrame(paint)
    },
    { passive: true }
  )
  window.addEventListener('resize', updateMode, { passive: true })
  window.addEventListener('blur', reset)
  window.addEventListener('pagehide', reset)
  document.addEventListener('visibilitychange', updateMode)
  desktop.addEventListener('change', updateMode)
  reduced.addEventListener('change', updateMode)

  return {
    setEnabled(value) {
      requested = value
      updateMode()
    }
  }
}

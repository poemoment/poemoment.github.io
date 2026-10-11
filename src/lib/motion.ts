import { initElasticGrid } from '@/lib/elastic-grid'
import { initImageTrail } from '@/lib/image-trail'
import { initProjectStacks } from '@/lib/project-stack'
import { initSakuraPetals } from '@/lib/sakura-petals'

/** Progressive enhancement: content and links remain visible without this module. */
export function initMotion() {
  const root = document.documentElement
  const reduced = matchMedia('(prefers-reduced-motion: reduce)')
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)')
  const controls = document.querySelectorAll<HTMLButtonElement>('[data-motion-toggle]')
  const surfaces = document.querySelectorAll<HTMLElement>('[data-motion-surface]')
  const reveals = document.querySelectorAll<HTMLElement>('[data-motion-reveal]')
  const animations = new Set<Animation>()
  const features = [initImageTrail(), initProjectStacks(), initElasticGrid(), initSakuraPetals()]
  const english = root.lang.startsWith('en')
  let paused = false
  let enabled = false
  let observer: IntersectionObserver | undefined
  let frame = 0
  let active: HTMLElement | null = null
  let bounds: DOMRect | null = null
  let pointerX = 0
  let pointerY = 0

  try {
    paused = localStorage.getItem('poemoment:motion') === 'off'
  } catch {
    /* Storage is optional. */
  }

  function resetPointer() {
    cancelAnimationFrame(frame)
    frame = 0
    if (active) {
      for (const key of ['--pointer-x', '--pointer-y', '--tilt-x', '--tilt-y']) {
        active.style.removeProperty(key)
      }
      active.removeAttribute('data-pointer-active')
    }
    active = null
    bounds = null
  }

  function paintPointer() {
    frame = 0
    if (!active || !bounds) return
    const x = Math.max(0, Math.min(1, (pointerX - bounds.left) / bounds.width))
    const y = Math.max(0, Math.min(1, (pointerY - bounds.top) / bounds.height))
    active.style.setProperty('--pointer-x', `${x * 100}%`)
    active.style.setProperty('--pointer-y', `${y * 100}%`)
    active.style.setProperty('--tilt-x', `${(0.5 - y) * 5}deg`)
    active.style.setProperty('--tilt-y', `${(x - 0.5) * 6}deg`)
    active.setAttribute('data-pointer-active', '')
  }

  for (const surface of surfaces) {
    surface.addEventListener(
      'pointermove',
      (event) => {
        if (!enabled || !finePointer.matches || event.pointerType !== 'mouse') return
        if (active !== surface) {
          resetPointer()
          active = surface
          bounds = surface.getBoundingClientRect()
        }
        pointerX = event.clientX
        pointerY = event.clientY
        if (!frame) frame = requestAnimationFrame(paintPointer)
      },
      { passive: true }
    )
    surface.addEventListener('pointerleave', resetPointer)
    surface.addEventListener('pointercancel', resetPointer)
  }

  function update() {
    enabled = !paused && !reduced.matches
    root.dataset.motion = enabled ? 'on' : 'off'
    observer?.disconnect()
    for (const animation of animations) animation.cancel()
    animations.clear()
    resetPointer()
    for (const feature of features) feature.setEnabled(enabled && !document.hidden)

    for (const control of controls) {
      control.hidden = false
      control.disabled = reduced.matches
      control.setAttribute('aria-pressed', String(enabled))
      const label = reduced.matches
        ? english
          ? 'Motion reduced by system'
          : '系统已减少动态效果'
        : enabled
          ? english
            ? 'Pause motion'
            : '暂停动态效果'
          : english
            ? 'Enable motion'
            : '开启动态效果'
      control.title = label
      control.setAttribute('aria-label', label)
      const text = control.querySelector('[data-motion-label]')
      if (text) text.textContent = label
    }

    if (!enabled || !('IntersectionObserver' in window)) return
    observer = new IntersectionObserver(
      (entries) => {
        let stagger = 0
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const element = entry.target as HTMLElement
          observer?.unobserve(element)
          element.dataset.motionSeen = 'true'
          // A separate translate property leaves pointer-driven transforms intact.
          const animation = element.animate(
            [
              { opacity: 0, translate: '0 16px' },
              { opacity: 1, translate: '0 0' }
            ],
            {
              duration: 620,
              delay: Math.min(stagger++ * 65, 195),
              easing: 'cubic-bezier(.2,.7,.2,1)',
              fill: 'backwards'
            }
          )
          animations.add(animation)
          animation.finished.then(
            () => animations.delete(animation),
            () => animations.delete(animation)
          )
        }
      },
      { threshold: 0.08 }
    )
    reveals.forEach((element) => {
      if (!element.dataset.motionSeen) observer?.observe(element)
    })
  }

  for (const control of controls) {
    control.addEventListener('click', () => {
      paused = !paused
      try {
        localStorage.setItem('poemoment:motion', paused ? 'off' : 'on')
      } catch {
        /* Optional. */
      }
      update()
    })
  }
  reduced.addEventListener('change', update)
  finePointer.addEventListener('change', resetPointer)
  window.addEventListener('scroll', resetPointer, { passive: true })
  window.addEventListener('resize', resetPointer, { passive: true })
  window.addEventListener('blur', resetPointer)
  window.addEventListener('pagehide', resetPointer)
  // Restore controllers when a document returns from the browser's back/forward cache.
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) update()
  })
  document.addEventListener('visibilitychange', () => {
    root.toggleAttribute('data-motion-hidden', document.hidden)
    if (document.hidden) resetPointer()
    for (const feature of features) feature.setEnabled(enabled && !document.hidden)
  })
  // Keep the preference coherent across tabs without requiring localStorage.
  window.addEventListener('storage', (event) => {
    if (event.key === 'poemoment:motion' || event.key === null) {
      paused = event.newValue === 'off'
      update()
    }
  })
  update()
}

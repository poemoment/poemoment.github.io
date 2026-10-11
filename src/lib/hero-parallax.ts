interface ParallaxHero {
  element: HTMLElement
  image: HTMLElement
  frame: number
  pointerX: number
  pointerY: number
}

/** A small image-only displacement; CSS eases each event without an idle render loop. */
export function initHeroParallax(): { setEnabled(enabled: boolean): void } {
  const heroes: ParallaxHero[] = Array.from(
    document.querySelectorAll<HTMLElement>('[data-hero-parallax]')
  ).flatMap((element) => {
    const image = element.querySelector<HTMLElement>('[data-parallax-image]')
    return image ? [{ element, image, frame: 0, pointerX: 0, pointerY: 0 }] : []
  })
  if (!heroes.length) return { setEnabled() {} }

  const finePointer = matchMedia('(hover: hover) and (pointer: fine)')
  const reduced = matchMedia('(prefers-reduced-motion: reduce)')
  let enabled = false
  let focused = true
  let pageVisible = true

  function canMove() {
    return (
      enabled &&
      finePointer.matches &&
      !reduced.matches &&
      !document.hidden &&
      focused &&
      pageVisible
    )
  }

  function reset(hero: ParallaxHero, smooth: boolean) {
    cancelAnimationFrame(hero.frame)
    hero.frame = 0
    // Removing the transition first also cancels an in-flight CSS interpolation.
    if (!smooth) hero.element.removeAttribute('data-parallax-enabled')
    hero.image.style.removeProperty('--hero-parallax-x')
    hero.image.style.removeProperty('--hero-parallax-y')
  }

  function resetAll() {
    heroes.forEach((hero) => reset(hero, false))
  }

  for (const hero of heroes) {
    hero.element.addEventListener(
      'pointermove',
      (event) => {
        if (!canMove() || event.pointerType !== 'mouse') return
        hero.pointerX = event.clientX
        hero.pointerY = event.clientY
        if (hero.frame) return
        hero.frame = requestAnimationFrame(() => {
          hero.frame = 0
          if (!canMove()) return
          const bounds = hero.element.getBoundingClientRect()
          if (!bounds.width || !bounds.height) return
          const x = Math.max(
            -1,
            Math.min(1, ((hero.pointerX - bounds.left) / bounds.width) * 2 - 1)
          )
          const y = Math.max(
            -1,
            Math.min(1, ((hero.pointerY - bounds.top) / bounds.height) * 2 - 1)
          )
          hero.element.setAttribute('data-parallax-enabled', '')
          hero.image.style.setProperty('--hero-parallax-x', `${x * 6}px`)
          hero.image.style.setProperty('--hero-parallax-y', `${y * 4}px`)
        })
      },
      { passive: true }
    )
    hero.element.addEventListener('pointerleave', () => reset(hero, canMove()))
    hero.element.addEventListener('pointercancel', () => reset(hero, false))
  }

  finePointer.addEventListener('change', resetAll)
  reduced.addEventListener('change', resetAll)
  document.addEventListener('visibilitychange', resetAll)
  window.addEventListener('scroll', resetAll, { passive: true })
  window.addEventListener('resize', resetAll, { passive: true })
  window.addEventListener('blur', () => {
    focused = false
    resetAll()
  })
  window.addEventListener('focus', () => {
    focused = true
  })
  window.addEventListener('pagehide', () => {
    pageVisible = false
    resetAll()
  })
  window.addEventListener('pageshow', () => {
    pageVisible = true
    resetAll()
  })

  return {
    setEnabled(value) {
      enabled = value
      resetAll()
    }
  }
}

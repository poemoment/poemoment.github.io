interface ProjectStack {
  element: HTMLElement
  cards: HTMLElement[]
  hovered: boolean
  focused: boolean
}

const properties = [
  '--stack-order',
  '--stack-x',
  '--stack-y',
  '--stack-z',
  '--stack-rx',
  '--stack-rz',
  '--stack-scale'
]

/** Scroll moves the outer wrappers, leaving reveal and pointer effects independent. */
export function initProjectStacks(): { setEnabled(enabled: boolean): void } {
  const stacks: ProjectStack[] = Array.from(
    document.querySelectorAll<HTMLElement>('[data-project-stack]')
  ).map((element) => ({
    element,
    cards: Array.from(element.querySelectorAll<HTMLElement>('[data-project-stack-item]')),
    hovered: false,
    focused: false
  }))
  if (!stacks.length) return { setEnabled() {} }
  const desktop = window.matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)')
  let enabled = false
  let active = false
  let frame = 0

  function reset() {
    cancelAnimationFrame(frame)
    frame = 0
    for (const stack of stacks) {
      stack.element.removeAttribute('data-project-stack-active')
      stack.element.removeAttribute('data-project-stack-interacting')
      for (const card of stack.cards) {
        for (const property of properties) card.style.removeProperty(property)
      }
    }
  }

  function draw() {
    frame = 0
    if (!active) return
    const viewport = window.innerHeight
    for (const { element, cards } of stacks) {
      const bounds = element.getBoundingClientRect()
      const progress = Math.max(
        0,
        Math.min(1, (viewport * 0.88 - bounds.top) / (viewport * 0.78 + bounds.height * 0.55))
      )
      const fan = Math.sin(progress * Math.PI)
      cards.forEach((card, index) => {
        const rank = index / Math.max(1, cards.length - 1)
        const direction = rank * 2 - 1
        card.style.setProperty('--stack-order', String(index + 1))
        card.style.setProperty('--stack-x', `${direction * fan * 5}px`)
        card.style.setProperty('--stack-y', `${(8 - rank * 14) * fan}px`)
        card.style.setProperty('--stack-z', `${-(1 - rank) * fan * 34}px`)
        card.style.setProperty('--stack-rx', `${(6 - rank * 8) * fan}deg`)
        card.style.setProperty('--stack-rz', `${direction * fan * 2}deg`)
        card.style.setProperty('--stack-scale', String(1 - (1 - rank) * fan * 0.035))
      })
    }
  }

  function schedule() {
    if (active && !frame) frame = requestAnimationFrame(draw)
  }

  function synchronize() {
    reset()
    active = enabled && desktop.matches && !document.hidden
    if (!active) return
    for (const stack of stacks) {
      stack.element.setAttribute('data-project-stack-active', '')
      if (stack.hovered || stack.focused) {
        stack.element.setAttribute('data-project-stack-interacting', '')
      }
    }
    schedule()
  }

  function updateInteraction(stack: ProjectStack) {
    if (!active) return
    stack.element.toggleAttribute('data-project-stack-interacting', stack.hovered || stack.focused)
  }

  for (const stack of stacks) {
    stack.element.addEventListener('pointerenter', (event) => {
      if (event.pointerType !== 'mouse') return
      stack.hovered = true
      updateInteraction(stack)
    })
    stack.element.addEventListener('pointerleave', () => {
      stack.hovered = false
      updateInteraction(stack)
    })
    stack.element.addEventListener('focusin', () => {
      stack.focused = true
      updateInteraction(stack)
    })
    stack.element.addEventListener('focusout', (event) => {
      stack.focused =
        event.relatedTarget instanceof Node && stack.element.contains(event.relatedTarget)
      updateInteraction(stack)
    })
  }
  window.addEventListener('scroll', schedule, { passive: true })
  window.addEventListener('resize', schedule, { passive: true })
  desktop.addEventListener('change', synchronize)
  window.addEventListener('pagehide', () => {
    active = false
    reset()
  })

  return {
    setEnabled(value) {
      enabled = value
      synchronize()
    }
  }
}

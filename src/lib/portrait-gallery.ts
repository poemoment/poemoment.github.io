export function initPortraitGalleries() {
  for (const gallery of document.querySelectorAll<HTMLElement>('[data-portrait-gallery]')) {
    if (gallery.dataset.galleryInitialized) continue

    const track = gallery.querySelector<HTMLElement>('[data-gallery-track]')
    const controls = gallery.querySelector<HTMLElement>('[data-gallery-controls]')
    const previous = gallery.querySelector<HTMLButtonElement>('[data-gallery-previous]')
    const next = gallery.querySelector<HTMLButtonElement>('[data-gallery-next]')
    const dialog = gallery.querySelector<HTMLDialogElement>('[data-gallery-dialog]')
    const close = gallery.querySelector<HTMLButtonElement>('[data-gallery-close]')
    const image = gallery.querySelector<HTMLImageElement>('[data-dialog-image]')
    const title = gallery.querySelector<HTMLElement>('[data-dialog-title]')
    if (!track || !controls || !previous || !next || !dialog || !close || !image || !title) continue

    gallery.dataset.galleryInitialized = 'true'
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let opener: HTMLAnchorElement | null = null
    let backdropPointerDown = false

    const updateControls = () => {
      const end = track.scrollWidth - track.clientWidth
      controls.hidden = end <= 2
      previous.disabled = track.scrollLeft <= 2
      next.disabled = track.scrollLeft >= end - 2
    }
    const move = (direction: number) => {
      const cards = [...track.querySelectorAll<HTMLElement>('.gallery-poster')]
      const trackStart = track.getBoundingClientRect().left
      const current = track.scrollLeft
      const positions = cards.map(
        (card) => card.getBoundingClientRect().left - trackStart + current
      )
      const target =
        direction > 0
          ? (positions.find((position) => position > current + 8) ?? track.scrollWidth)
          : (positions.reverse().find((position) => position < current - 8) ?? 0)
      const animate = !reducedMotion.matches && document.documentElement.dataset.motion !== 'off'
      track.scrollTo({ left: Math.max(0, target - 4), behavior: animate ? 'smooth' : 'instant' })
    }
    previous.addEventListener('click', () => move(-1))
    next.addEventListener('click', () => move(1))
    track.addEventListener('scroll', updateControls, { passive: true })
    new ResizeObserver(updateControls).observe(track)
    updateControls()

    if (typeof dialog.showModal !== 'function') continue

    for (const link of gallery.querySelectorAll<HTMLAnchorElement>('[data-gallery-image]')) {
      link.addEventListener('click', (event) => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
          return
        const source = link.querySelector<HTMLImageElement>('img')
        if (!source) return
        event.preventDefault()
        opener = link
        image.src = link.href
        image.alt = source.alt
        image.width = source.naturalWidth || Number(source.getAttribute('width'))
        image.height = source.naturalHeight || Number(source.getAttribute('height'))
        title.textContent = link.dataset.imageTitle ?? ''
        dialog.showModal()
        close.focus({ preventScroll: true })
      })
    }
    close.addEventListener('click', () => dialog.close())
    dialog.addEventListener('pointerdown', (event) => {
      backdropPointerDown = event.button === 0 && event.target === dialog
    })
    dialog.addEventListener('pointercancel', () => {
      backdropPointerDown = false
    })
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog && backdropPointerDown) dialog.close()
      backdropPointerDown = false
    })
    dialog.addEventListener('close', () => {
      backdropPointerDown = false
      opener?.focus({ preventScroll: true })
      opener = null
    })
  }
}

import type { MarkdownHeading } from 'astro'

export interface TocItem extends MarkdownHeading {
  subheadings: TocItem[]
}

/** Keep valid heading order even when a document starts at h3 or skips a level. */
export function generateToc(headings: readonly MarkdownHeading[]) {
  const toc: TocItem[] = []
  const ancestors: TocItem[] = []
  for (const heading of headings) {
    if (heading.depth <= 1 || !heading.text.trim() || !heading.slug) continue
    const item: TocItem = { ...heading, subheadings: [] }
    while (ancestors.length && ancestors[ancestors.length - 1].depth >= item.depth) ancestors.pop()
    const parent = ancestors[ancestors.length - 1]
    if (parent) parent.subheadings.push(item)
    else toc.push(item)
    ancestors.push(item)
  }
  return toc
}

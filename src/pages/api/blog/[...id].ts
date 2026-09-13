import type { APIRoute } from 'astro'
import { createMarkdownProcessor } from '@astrojs/markdown-remark'
import { getCollection, getEntry } from 'astro:content'

/**
 * Plaintext-ish endpoint consumed by the dev-mode `cat post` viewer.
 * Returns rendered HTML (with shiki syntax-highlighted code blocks)
 * plus a flat heading list for in-viewer navigation.
 *
 * 纯静态站:构建时为每篇文章预生成一份 JSON。
 */

export const prerender = true

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => !data.draft)
  return posts.map((post) => ({
    params: { id: post.id }
  }))
}

let processorPromise: Promise<Awaited<ReturnType<typeof createMarkdownProcessor>>> | null = null

function getProcessor() {
  if (!processorPromise) {
    processorPromise = createMarkdownProcessor({
      gfm: true,
      smartypants: true,
      shikiConfig: {
        themes: { light: 'github-light', dark: 'github-dark' }
      }
    })
  }
  return processorPromise
}

export const GET: APIRoute = async ({ params }) => {
  const id = params.id
  if (!id) return new Response('Not found', { status: 404 })
  const entry = await getEntry('blog', id)
  if (!entry) return new Response('Not found', { status: 404 })

  const raw = (entry as { body?: string }).body ?? ''
  const cleaned = stripMdxMachinery(raw)
  const processor = await getProcessor()
  const result = await processor.render(cleaned)

  // Astro markdown returns metadata.headings as { depth, slug, text }[].
  const headings = (result.metadata?.headings ?? []) as Array<{
    depth: number
    slug: string
    text: string
  }>

  return new Response(
    JSON.stringify({
      html: result.code,
      headings
    }),
    {
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'public, max-age=300, s-maxage=86400'
      }
    }
  )
}

/**
 * Drop mdx-only constructs so the body parses cleanly as plain markdown.
 * (Imports/exports up top, JSX components.) The processor itself doesn't
 * understand mdx, only markdown — anything left over gets rendered as
 * literal text and looks ugly.
 */
function stripMdxMachinery(body: string): string {
  return (
    body
      .replace(/^[ \t]*import\s+[^\n]*\n/gm, '')
      .replace(/^[ \t]*export\s+[^\n]*\n/gm, '')
      .replace(/^[ \t]*<[A-Z][\s\S]*?\/>\s*$/gm, '')
      .replace(/<([A-Z][A-Za-z0-9]*)\b[^>]*>([\s\S]*?)<\/\1>/g, '$2')
      .replace(/\n{3,}/g, '\n\n')
      .trim() + '\n'
  )
}

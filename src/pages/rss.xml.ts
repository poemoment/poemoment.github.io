import path from 'node:path'
import type { APIRoute, ImageMetadata } from 'astro'
import { getImage } from 'astro:assets'
import { getCollection, type CollectionEntry } from 'astro:content'
import rss, { type RSSFeedItem } from '@astrojs/rss'
import type { Root } from 'mdast'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import { visit } from 'unist-util-visit'
import config from 'virtual:config'

export const prerender = true

const imagesGlob = import.meta.glob<{ default: ImageMetadata }>(
  '/src/content/{blog,archive}/**/*.{jpeg,jpg,png,gif,webp,avif}'
)

type AuthoredEntry = CollectionEntry<'blog' | 'archive'>

const renderContent = async (post: AuthoredEntry, site: URL, permalink: string) => {
  function remarkAbsoluteLinks() {
    return async function (tree: Root) {
      const images: Promise<void>[] = []
      visit(tree, 'link', (node) => {
        node.url = new URL(node.url, permalink).href
      })
      visit(tree, 'image', (node) => {
        // Bundled images resolve relative to the Markdown source, not its public route.
        const sourceFile = post.filePath
          ? path.relative(process.cwd(), path.resolve(post.filePath)).replaceAll('\\', '/')
          : ''
        const imageKey = path.posix.resolve('/', path.posix.dirname(sourceFile), node.url)
        const bundledImage = !/^(?:[a-z]+:|\/)/i.test(node.url) && imagesGlob[imageKey]
        if (bundledImage) {
          images.push(
            bundledImage().then(async ({ default: src }) => {
              node.url = new URL((await getImage({ src })).src, site).href
            })
          )
        } else {
          node.url = new URL(node.url, permalink).href
        }
      })
      await Promise.all(images)
    }
  }

  const file = await unified()
    .use(remarkParse)
    .use(remarkAbsoluteLinks)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(post.body ?? '')

  return String(file)
}

const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (character) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]!
  )

export const GET: APIRoute = async ({ site }) => {
  const siteUrl = site ?? new URL(import.meta.env.SITE)
  const [posts, notes, curated] = await Promise.all([
    getCollection('blog', ({ data }) => !data.draft),
    getCollection('archive', ({ data }) => !data.draft),
    getCollection('curated', ({ data }) => !data.draft)
  ])

  const authoredItems: RSSFeedItem[] = await Promise.all(
    [...posts, ...notes].map(async (entry) => {
      const link = new URL(`/${entry.collection}/${encodeURI(entry.id)}/`, siteUrl).href
      return {
        title: entry.data.title,
        description: entry.data.description,
        pubDate: 'publishDate' in entry.data ? entry.data.publishDate : entry.data.date,
        link,
        categories: [entry.collection === 'blog' ? '文章' : '随记', ...entry.data.tags],
        content: await renderContent(entry, siteUrl, link)
      }
    })
  )

  const curatedItems: RSSFeedItem[] = curated.map((entry) => ({
    title: entry.data.sourceTitle || entry.data.title,
    description: entry.data.why || entry.data.description,
    pubDate: entry.data.date,
    link: new URL(`/curated/#curated-${encodeURIComponent(entry.id)}`, siteUrl).href,
    categories: ['收藏', ...entry.data.tags],
    // These are recommendations, not copies of the external article.
    content: `<p>${escapeHtml(entry.data.why || entry.data.description)}</p><p><a href="${escapeHtml(entry.data.source)}">阅读原文：${escapeHtml(entry.data.sourceTitle || entry.data.title)}</a></p>`
  }))

  return rss({
    trailingSlash: true,
    stylesheet: '/scripts/pretty-feed-v3.xsl',

    title: config.title,
    description: config.description,
    site: siteUrl,
    items: [...authoredItems, ...curatedItems].sort(
      (a, b) => new Date(b.pubDate!).getTime() - new Date(a.pubDate!).getTime()
    )
  })
}

import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'
import type { SearchDoc } from '@/lib/search-client'

/**
 * 构建时生成站内搜索索引(纯静态站)。
 * 客户端由 `@/lib/search-client` 拉取本文件并本地打分。
 */
export const prerender = true

export const GET: APIRoute = async () => {
  const docs = await buildSearchDocs()
  return new Response(JSON.stringify({ docs }), {
    headers: { 'content-type': 'application/json; charset=utf-8' }
  })
}

async function buildSearchDocs(): Promise<SearchDoc[]> {
  const [blogPosts, archiveEntries, curatedEntries, englishPosts, englishNotes] = await Promise.all(
    [
      getCollection('blog', ({ data }) => !data.draft),
      getCollection('archive', ({ data }) => !data.draft),
      getCollection('curated', ({ data }) => !data.draft),
      getCollection('blogEn', ({ data }) => !data.draft && !!data.translationKey),
      getCollection('archiveEn', ({ data }) => !data.draft && !!data.translationKey)
    ]
  )

  const blogDocs = blogPosts.map<SearchDoc>((entry) => ({
    collection: 'blog',
    language: 'zh',
    title: entry.data.title,
    description: entry.data.description,
    url: `/blog/${encodeURI(entry.id)}/`,
    date: formatDate(entry.data.publishDate),
    tags: entry.data.tags,
    body: normalizeBody((entry as { body?: string }).body ?? '')
  }))

  const archiveDocs = archiveEntries.map<SearchDoc>((entry) => ({
    collection: 'archive',
    language: 'zh',
    title: entry.data.title,
    description: entry.data.description,
    url: `/archive/${encodeURI(entry.id)}/`,
    date: formatDate(entry.data.date),
    tags: entry.data.tags,
    body: normalizeBody((entry as { body?: string }).body ?? '')
  }))

  const curatedDocs = curatedEntries.map<SearchDoc>((entry) => ({
    collection: 'curated',
    language: 'zh',
    title: entry.data.sourceTitle || entry.data.title,
    description: entry.data.why || entry.data.description,
    url: `/curated/#curated-${encodeURIComponent(entry.id)}`,
    date: formatDate(entry.data.date),
    tags: entry.data.tags,
    body: normalizeBody(
      [
        entry.data.sourceTitle,
        entry.data.sourceAuthor,
        entry.data.why,
        (entry as { body?: string }).body
      ]
        .filter(Boolean)
        .join(' ')
    )
  }))

  const englishDocs: SearchDoc[] = [
    ...englishPosts.map<SearchDoc>((entry) => ({
      collection: 'blog',
      language: 'en',
      title: entry.data.title,
      description: entry.data.description,
      url: `/en/blog/${encodeURI(entry.data.translationKey!)}/`,
      date: formatDate(entry.data.publishDate),
      tags: entry.data.tags,
      body: normalizeBody(entry.body ?? '')
    })),
    ...englishNotes.map<SearchDoc>((entry) => ({
      collection: 'archive',
      language: 'en',
      title: entry.data.title,
      description: entry.data.description,
      url: `/en/archive/${encodeURI(entry.data.translationKey!)}/`,
      date: formatDate(entry.data.date),
      tags: entry.data.tags,
      body: normalizeBody(entry.body ?? '')
    }))
  ]

  return [...blogDocs, ...archiveDocs, ...curatedDocs, ...englishDocs]
}

function normalizeBody(body: string) {
  return (
    body
      .replace(/^[ \t]*import\s+[^\n]*\n/gm, '')
      .replace(/^[ \t]*export\s+[^\n]*\n/gm, '')
      // Keep code terms searchable, but omit fences and rendering-only markup.
      .replace(/^\s*```[^\n]*$/gm, ' ')
      .replace(/<([A-Z][A-Za-z0-9]*)\b[^>]*>([\s\S]*?)<\/\1>/g, '$2')
      .replace(/^[ \t]*<[A-Z][\s\S]*?\/>\s*$/gm, '')
      .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
      .replace(/\[([^\]]+)]\([^)]*\)/g, '$1')
    .replace(/^\s{0,3}(?:#{1,6}\s+|>\s?)/gm, ' ')
    .replace(/^\s*[-+*]\s+/gm, ' ')
    .replace(/[*`~|]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  )
}

function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat('en-CA', {
    year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Shanghai'
  }).format(date instanceof Date ? date : new Date(date))
}

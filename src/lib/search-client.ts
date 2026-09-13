/**
 * 站内搜索:构建时生成索引 + 浏览器端打分(纯静态站方案)。
 *
 * 背景:原先 /api/search.json 是运行时端点(SSR),GitHub Pages 静态托管无法保留。
 * 现在 `/api/search-index.json` 在构建时把所有内容打成一份索引,客户端首次搜索时
 * 拉取并本地打分——中英文都是子串匹配,与改造前的行为一致。
 */

export type SearchCollection = 'blog' | 'archive' | 'curated'

export interface SearchDoc {
  collection: SearchCollection
  title: string
  description?: string
  url: string
  date: string
  tags: string[]
  body: string
}

export type SearchResult = Omit<SearchDoc, 'body'> & {
  excerpt: string
  score: number
}

/** 索引在页面生命周期内只拉一次 */
let indexPromise: Promise<SearchDoc[]> | null = null

export function loadSearchIndex(): Promise<SearchDoc[]> {
  if (!indexPromise) {
    indexPromise = fetch('/api/search-index.json')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json() as Promise<{ docs: SearchDoc[] }>
      })
      .then((payload) => payload.docs ?? [])
      .catch((error) => {
        indexPromise = null // 失败允许下次重试
        throw error
      })
  }
  return indexPromise
}

export async function searchLocal(query: string, limit = 10): Promise<SearchResult[]> {
  const normalized = query.trim()
  const docs = await loadSearchIndex()
  return docs
    .map((doc) => scoreDoc(doc, normalized))
    .filter((result): result is SearchResult => Boolean(result))
    .sort((a, b) => b.score - a.score || b.date.localeCompare(a.date))
    .slice(0, clampLimit(limit))
}

function clampLimit(limit: number) {
  if (!Number.isFinite(limit)) return 10
  return Math.max(1, Math.min(20, Math.floor(limit)))
}

function scoreDoc(doc: SearchDoc, query: string): SearchResult | null {
  const terms = tokenize(query)
  if (terms.length === 0) return null

  const title = doc.title.toLowerCase()
  const description = (doc.description ?? '').toLowerCase()
  const tags = doc.tags.join(' ').toLowerCase()
  const body = doc.body.toLowerCase()
  const haystack = `${title} ${description} ${tags} ${body}`

  let score = 0
  for (const term of terms) {
    if (!haystack.includes(term)) return null
    if (title.includes(term)) score += 12
    if (description.includes(term)) score += 7
    if (tags.includes(term)) score += 5
    score += countOccurrences(body, term)
  }

  return {
    collection: doc.collection,
    title: doc.title,
    description: doc.description,
    url: doc.url,
    date: doc.date,
    tags: doc.tags,
    excerpt: makeExcerpt(doc, terms),
    score
  }
}

function tokenize(query: string) {
  const normalized = query.toLowerCase().trim()
  const parts = normalized.split(/\s+/).filter(Boolean)
  return parts.length > 1 ? parts : normalized.length >= 2 ? [normalized] : []
}

function countOccurrences(text: string, term: string) {
  let count = 0
  let idx = text.indexOf(term)
  while (idx !== -1) {
    count += 1
    idx = text.indexOf(term, idx + term.length)
  }
  return count
}

function makeExcerpt(doc: SearchDoc, terms: string[]) {
  const source = doc.body || doc.description || doc.title
  const lower = source.toLowerCase()
  const hit = terms
    .map((term) => lower.indexOf(term))
    .filter((idx) => idx >= 0)
    .sort((a, b) => a - b)[0]

  const start = Math.max(0, (hit ?? 0) - 52)
  const end = Math.min(source.length, start + 168)
  const prefix = start > 0 ? '...' : ''
  const suffix = end < source.length ? '...' : ''
  return `${prefix}${source.slice(start, end).trim()}${suffix}`
}

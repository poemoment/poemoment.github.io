/** Home discovery paths follow published content, not writing maturity. */
export interface SiteColumn {
  slug: string
  name: string
  definition: string
  href: string
  collection: 'blog' | 'archive' | 'curated' | null
  tag?: string
}

export interface SiteColumnEn extends SiteColumn {
  unit: string
}

export const siteColumns: SiteColumn[] = [
  {
    slug: 'retrospective',
    name: '工程复盘',
    definition: '从真实项目出发，记录设计取舍、验证过程与尚未解决的问题。',
    href: '/archive/tags/工程复盘/',
    collection: 'archive',
    tag: '工程复盘'
  },
  {
    slug: 'projects',
    name: '项目实践',
    definition: '正在构建的工具与已公开的作品，连接实现、使用场景和开发记录。',
    href: '/projects/',
    collection: null
  },
  {
    slug: 'curated',
    name: '资料收藏',
    definition: '值得继续阅读的论文、源码与工程文章，附收录理由和原始出处。',
    href: '/curated/',
    collection: 'curated'
  }
]

export const siteColumnsEn: SiteColumnEn[] = [
  {
    slug: 'retrospective',
    name: 'Engineering notes',
    definition: 'Design decisions, validation, and open questions from real projects. Written in Chinese.',
    href: '/archive/tags/工程复盘/',
    collection: 'archive',
    tag: '工程复盘',
    unit: 'notes'
  },
  {
    slug: 'projects',
    name: 'Projects',
    definition: 'Tools in development and public work, connected to their implementation stories.',
    href: '/en/projects/',
    collection: null,
    unit: ''
  },
  {
    slug: 'curated',
    name: 'Reading collection',
    definition: 'Selected papers, source code, and engineering articles, with context and original sources.',
    href: '/en/curated/',
    collection: 'curated',
    unit: 'entries'
  }
]

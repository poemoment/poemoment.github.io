/**
 * 站点栏目定义 —— 首页「栏目索引」的数据源（设计方案：研究档案室 / 技术刊物）。
 *
 * 栏目名称描述内容生产方式，而不是页面板块：
 * - 研究笔记：论文、源码与课程的理解整理，最终写成完整文章（/blog）。
 * - 工程复盘：真实项目中的决策、失误与修正（/projects）。
 * - 随手记录：尚未成熟但值得保留的判断与片段（/archive）。
 *
 * 视觉菜单 ⑪：每条定义句以「边界从句」结尾（学自 maggieappleton 的内容类型词典），
 * 让相邻栏目的分界线一眼可读：研究笔记 = 已想清楚，随手记录 = 还没想清楚。
 *
 * 设计稿要求：所有栏目定义都必须能在文章数据中找到对应内容；
 * 若长期找不到对应文章，应先修改定义或停止展示该栏目。
 */

export interface SiteColumn {
  slug: string
  name: string
  definition: string
  href: string
  /** 用于在首页统计条目数的集合；projects 页不是集合，填 null。 */
  collection: 'blog' | 'archive' | 'curated' | null
}

/** 英文站（/en）栏目索引数据源——与 siteColumns 逐条对应，边界从句同步。 */
export interface SiteColumnEn {
  slug: string
  name: string
  definition: string
  href: string
  collection: SiteColumn['collection']
  /** 计数单位（Research notes: 5 posts / Quick notes: 1 entry） */
  unit: string
}

export const siteColumnsEn: SiteColumnEn[] = [
  {
    slug: 'research',
    name: 'Research notes',
    definition:
      'Papers, source code, and courses distilled into full articles — the parts I have already thought through.',
    href: '/en/blog',
    collection: 'blog',
    unit: 'posts'
  },
  {
    slug: 'retrospective',
    name: 'Engineering retrospectives',
    definition: 'Decisions, mistakes, and corrections from real projects — things I have actually built.',
    href: '/en/projects',
    collection: null,
    unit: ''
  },
  {
    slug: 'notes',
    name: 'Quick notes',
    definition:
      'Judgments and fragments that are not mature yet but worth keeping — the parts I have not thought through but keep an eye on.',
    href: '/en/archive',
    collection: 'archive',
    unit: 'entries'
  }
]

export const siteColumns: SiteColumn[] = [
  {
    slug: 'research',
    name: '研究笔记',
    definition: '论文、源码与课程的理解整理，写成完整的文章——已经想清楚的部分。',
    href: '/blog',
    collection: 'blog'
  },
  {
    slug: 'retrospective',
    name: '工程复盘',
    definition: '真实项目中的决策、失误与修正——来自亲手做过的东西。',
    href: '/projects',
    collection: null
  },
  {
    slug: 'notes',
    name: '随手记录',
    definition: '尚未成熟但值得保留的判断与片段——还没想清楚、但值得盯着的部分。',
    href: '/archive',
    collection: 'archive'
  }
]

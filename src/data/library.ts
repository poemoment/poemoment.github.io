/**
 * 书单页数据 —— /library 页面（视觉菜单 ⑩，学自 maggieappleton 的 Library / Antilibrary）。
 *
 * 维护规则（与 reading.ts 相同的「空则隐藏」约定）：
 * - 只列真实存在、真实在推进的材料；某个分节清空后该节整体隐藏，不显示占位文案。
 * - antilibrary（读不完）来自 Maggie Appleton 的诚实自我披露：
 *   收藏的是「喜欢'已经读过它'这个想法」的书——列出来是为了防止自欺。
 */

export interface LibraryItem {
  title: string
  author?: string
  /** 一句话说明：它和你的研究/写作的关系，或当前推进到哪 */
  note?: string
  /** 可选站内链接：相关文章、随记或收藏条目 */
  href?: string
  /** 可选外部链接：出版社、原文或仓库 */
  source?: string
}

export interface LibrarySection {
  key: 'reading' | 'wishlist' | 'antilibrary'
  name: string
  description: string
  items: LibraryItem[]
}

export const librarySections: LibrarySection[] = [
  {
    key: 'reading',
    name: '在读',
    description: '正在读、且实际在推进的材料。',
    items: [
      {
        title: '《深入理解 AI Agent》',
        author: '李博杰',
        note: '教学总纲的直接依据；配套开源实验仓库（github.com/bojieli/ai-agent-book，★-★★★ 分级实验）已收进收藏页，见首页右栏的阶段记录。'
      },
      {
        title: 'Refactoring UI',
        author: 'Steve Schoger & Adam Wathan',
        note: '精读中——本站这一轮视觉改版的判断清单全部来自它。'
      },
      {
        title: '《手撕 Claude Code 源码：从零理解 Agent Harness》',
        note: '精读稿在 Obsidian「ai提取」；与 dsh 源码对照，理解 harness 最小内核。'
      },
      {
        title: 'DeepSeek Harness（dsh）源码',
        note: '本地克隆在 agent项目尝试/dsh；「一切皆插件」极简路线，收藏页有条目卡。'
      }
    ]
  },
  {
    key: 'wishlist',
    name: '想读',
    description: '排队中的材料，读了会先记到这里再移上去。',
    items: []
  },
  {
    key: 'antilibrary',
    name: '读不完',
    description: '喜欢「已经读过它」这个想法、但还没有读的书。列出来防止自欺。',
    items: []
  }
]

/** 全部为空时 /library 页显示空状态。 */
export const hasLibrary = librarySections.some((section) => section.items.length > 0)

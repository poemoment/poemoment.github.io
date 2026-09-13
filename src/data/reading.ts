/**
 * 「正在理解」主题清单 —— 首页右栏数据源（设计方案：研究档案室）。
 *
 * 维护规则（设计稿硬约束）：
 * - 只在这里维护真实在进行的主题；数组为空时首页右栏整体隐藏，不显示占位文案。
 * - stage 描述当前所处的阶段：阅读 → 复现 → 实验 → 整理。
 * - updated 写最近一次实际推进的日期（YYYY-MM-DD）。
 */

export type ReadingStage = '阅读' | '复现' | '实验' | '整理'

export interface ReadingTopic {
  title: string
  /** 正在读的材料来源：书 / 论文 / 课程 / 仓库 */
  source?: string
  stage: ReadingStage
  /** ISO 日期字符串 */
  updated: string
  /** 可选：指向相关文章或随记的站内链接 */
  href?: string
}

export const readingTopics: ReadingTopic[] = [
  {
    title: 'Agent 概念地图：Harness、上下文工程与评估',
    source: '《深入理解 AI Agent》',
    stage: '整理',
    updated: '2026-07-26'
  },
  {
    title: 'AI Infra：数据基座、存储分层与算力集群',
    source: '训练数据基础设施公开资料',
    stage: '阅读',
    updated: '2026-07-26'
  },
  {
    title: 'Agent Harness 源码：dsh「一切皆插件」路线与 Claude Code 对照',
    source: 'deepseek-ai/deepseek-harness（本地克隆）+《手撕 Claude Code 源码》精读稿',
    stage: '阅读',
    updated: '2026-09-09',
    href: '/curated'
  },
  {
    title: 'Pi / Tau：真实 Agent Loop 的源码走读',
    source: 'tau-0.2.4（本地克隆，agent项目尝试/）',
    stage: '阅读',
    updated: '2026-09-09'
  }
]

/** 空列表时首页应整体隐藏该栏，而不是渲染占位内容。 */
export const hasReadingTopics = readingTopics.length > 0

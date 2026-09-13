---
title: 'DeepSeek Harness(dsh):「一切皆插件」的极简 Agent Harness'
description: '2026-08-13 发布当晚 3.6k→8 万+ star。极简模式 62 行,仅持久 bash(pty,300s 超时)与 str_replace_editor 两个工具,模型、工具、会话、沙箱、循环全部由插件组合,运行时基于 cordis 依赖注入。'
date: 2026-09-09
source: 'https://github.com/deepseek-ai/deepseek-harness'
sourceTitle: 'deepseek-ai/deepseek-harness'
sourceAuthor: 'DeepSeek'
why: '当前 Agent Harness 设计的当代参照系:「一切皆插件」极简路线与 Claude Code 形成对照,读源码、提 issue 都有简历价值。认准官方仓库,勿装 thinkany-ai/dscode 冒牌。'
tags: ['agent', 'harness', '源码研究']
type: 'repo'
status: 'digested'
difficulty: 'deep'
draft: false
---

本地克隆在 `agent项目尝试/dsh`,与《手撕 Claude Code 源码:从零理解 Agent Harness》精读稿对照阅读。

要点:
- 极简模式 62 行 = 持久 bash(pty,300s 超时)+ str_replace_editor 两个工具,其余一切皆插件
- 运行时基于 cordis(TS/JS 元框架 + 依赖注入,源自 koishi 核心团队)
- 生态:dsh-web-ui、子代理插件(调 claude code/codex/ACP)、识图插件
- 群内观点并列:有人视其为「唯一 self evolution 的路」,也有人指出插件间 debug 链路难走——两种判断都值得记录


# 个人博客模板上手与开源手册

这份手册按实际动手顺序写：先本地跑起来，再改成你的博客，再发布给别人访问，最后正式开源到 GitHub。

## 1. 这个项目现在是什么

这是一个 Astro 博客前端模板，保留了这些能力：

- 终端式首页和普通页面首页。
- Blog 正式文章。
- Notes 短笔记。
- Curated 收藏资料。
- Projects 项目展示。
- Links 友链或资源页。
- Search 搜索。
- RSS、站点地图、OG 图片、`.well-known/site-manifest.json`。

已经清理掉的内容：

- 原个人主页文案、经历、学校、地点、社交账号。
- 微信、QQ群、收款码、头像等个人图片。
- 原博客正文和旧笔记。
- `.vercel`、`dist`、`.astro` 等发布或构建产物。
- 疑似 SSH key 文件。

## 2. 本地运行

进入项目目录：

```bash
cd blog-main
npm install
npm run dev
```

打开：

```text
http://localhost:4321
```

常用命令：

```bash
npm run dev      # 本地开发
npm run build    # 正式构建
npm run preview  # 本地预览构建结果
npm run check    # Astro 类型检查
npm run lint     # 代码检查
npm run format   # 自动格式化
```

## 3. 最先改哪几个文件

先改这些，不要一上来大改样式：

```text
src/site.config.ts
src/pages/index.astro
src/pages/about/index.astro
src/pages/contact/index.astro
src/pages/projects/index.astro
src/content/blog
public/links.json
```

`src/site.config.ts`：

- `title`: 站点名。
- `author`: 你的名字或网名。
- `description`: 网站一句话介绍。
- `header.menu`: 顶部导航。
- `footer.social.github`: 你的 GitHub。
- `integ.links.applyTip`: 友链申请展示信息。

`src/pages/index.astro`：

- 首页头像缩写 `YN`。
- 首页简介。
- 技能数组：`languages`、`frontend`、`backend`、`design`、`workflow`。
- 首页各个占位卡片。

`src/pages/contact/index.astro`：

- 只放你愿意长期公开的信息。
- 不建议把私人微信、手机号、群号、收款码提交进公开仓库。

`public/links.json`：

- 友链或资源链接数据。
- 不需要友链功能时，可以从 `src/site.config.ts` 的导航里删掉 Links。

## 4. 写文章和笔记

正式文章放在：

```text
src/content/blog/日期 - slug/post.mdx
```

英文镜像文章放在同一目录：

```text
src/content/blog/日期 - slug/post.en.mdx
```

示例：

```mdx
---
title: '我的第一篇博客'
description: '这篇文章用来说明我为什么开始写博客。'
publishDate: 2026-06-23
tags: ['blog', 'life']
language: 'zh-CN'
comment: false
---

正文从这里开始。
```

短笔记放在：

```text
src/content/archive
```

收藏资料放在：

```text
src/content/curated
```

建议先只维护 Blog。等你真的写了 5 到 10 篇文章，再决定 Notes 和 Curated 是否保留。

## 5. 改前端样式的路线

不要从全局 CSS 开始乱改。按这个顺序来：

1. 先改文案和数据。
2. 再改页面结构。
3. 最后改组件和 CSS。

常见修改位置：

```text
src/pages/index.astro                  # 首页布局
src/components/home/LinkCard.astro     # 首页卡片
src/components/home/Section.astro      # 首页分区标题
src/components/Header.astro            # 顶部导航
src/components/terminal                # 终端交互层
src/assets/styles/app.css              # 站点补充样式
public/styles/global.css               # 全局样式
uno.config.ts                          # UnoCSS 配置
```

改样式时每次只做一个主题，例如：

- 只改颜色。
- 只改首页卡片间距。
- 只改字体大小。
- 只改导航。

每改完一次都运行：

```bash
npm run check
npm run build
```

## 6. 让别人访问你的博客

### 路线 A：Vercel，推荐

当前项目已经使用 Vercel adapter 和 server 输出，因此先用 Vercel 最省心。

步骤：

1. 把项目推到 GitHub。
2. 打开 Vercel，新建项目，选择你的 GitHub 仓库。
3. Framework 选择 Astro。
4. Build command 使用 `npm run build`。
5. 部署完成后，Vercel 会给你一个 `*.vercel.app` 地址。
6. 需要自定义域名时，在 Vercel 的 Domains 里添加域名，再按提示配置 DNS。

官方文档：

- [Vercel Astro 文档](https://vercel.com/docs/frameworks/astro)
- [Vercel Domains 文档](https://vercel.com/docs/domains)

### 路线 B：GitHub Pages

GitHub Pages 适合静态站点。当前项目有动态 API 路由和 Vercel server 配置，所以如果你想用 GitHub Pages，需要把项目改成静态构建路线。

大致要做：

1. 移除 `astro.config.ts` 里的 Vercel adapter。
2. 改成静态输出。
3. 确认不依赖运行时 API 路由，或者把 API 路由改成可预渲染。
4. 添加 GitHub Actions workflow 构建并发布 `dist`。

官方文档：

- [GitHub Pages 基础说明](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages)
- [使用自定义 GitHub Actions 发布 Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [GitHub Pages 自定义域名](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages)

### 临时给同一 Wi-Fi 下的人访问

本地临时演示：

```bash
npm run dev -- --host 0.0.0.0
```

然后让对方访问：

```text
http://你的局域网IP:4321
```

这只适合临时预览，不是正式发布。

## 7. 正式开源到 GitHub

如果这个目录没有可用 Git 仓库，可以重新初始化：

```bash
git init
git add .
git commit -m "Initial open-source blog template"
```

在 GitHub 新建仓库后，按页面提示连接远程仓库：

```bash
git branch -M main
git remote add origin https://github.com/你的用户名/你的仓库名.git
git push -u origin main
```

开源前检查：

```bash
rg -n -i "password|secret|token|wechat|phone|email|身份证|手机号|地址|joye|joyehuang|deshiou|vercel"
```

你还应该手动检查：

- `.env`、`.env.local` 是否被提交。
- `.vercel` 是否被提交。
- `dist`、`.astro` 是否被提交。
- 二维码、证件照、头像、简历截图是否被提交。
- 文章里是否有私人经历、真实联系人、聊天记录、内部链接。

仓库公开前建议补齐：

- `README.md`: 项目是什么、怎么运行、怎么部署。
- `LICENSE`: 开源许可证。
- `CODE_OF_CONDUCT.md`: 社区行为准则。
- `CONTRIBUTING.md`: 如何贡献。
- `.github/ISSUE_TEMPLATE`: Issue 模板。
- `.github/pull_request_template.md`: PR 模板。

许可证参考：

- [GitHub 许可证文档](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository)
- [Choose a License](https://choosealicense.com/)

## 8. 作为开源开发者要掌握的 GitHub 功能

你不需要一次学完，但这些功能迟早会用到：

- Repository: 仓库设置、描述、About 区、Topics、默认分支。
- Commit: 每次变更的历史记录。
- Branch: 用分支隔离开发，不直接在 `main` 上乱改。
- Pull Request: 合并代码、展示改动、让别人 review。
- Issue: 记录 bug、想法、任务和讨论。
- Labels: 给 Issue/PR 分类，例如 `bug`、`docs`、`good first issue`。
- Milestones: 把一组 Issue 归到一个版本或目标。
- Discussions: 适合问答、想法、社区讨论。
- Actions: 自动构建、测试、部署。
- Releases 和 Tags: 发布正式版本，写版本说明。
- Pages: 托管静态网站或项目文档。
- Wiki: 写较长的项目文档，可选。
- Projects: 看板式任务管理。
- Security: Dependabot、security advisories、secret scanning。
- Insights: 看贡献者、流量、fork、star 趋势。
- Fork 和 Star: 社区协作和项目传播的基本机制。
- Watch: 订阅仓库动态。
- Code Review: 对 PR 做逐行评论、提出修改建议。

最小学习路线：

1. 会创建仓库、写 README、选择 license。
2. 会 commit、push、branch、pull request。
3. 会开 issue、打 label、关 issue。
4. 会看 GitHub Actions 是否通过。
5. 会发 release。
6. 会处理别人提的 issue 和 PR。

## 9. 你的第一周任务清单

第 1 天：

- 改 `src/site.config.ts`。
- 改首页名字、简介、技能。
- 跑通 `npm run dev`。

第 2 天：

- 写第一篇短文章。
- 改 About 和 Contact。

第 3 天：

- 改 Projects。
- 删除不需要的导航项。

第 4 天：

- 跑 `npm run check` 和 `npm run build`。
- 清理所有私人信息。

第 5 天：

- 新建 GitHub 仓库。
- 推送代码。
- 写好 README、LICENSE、CONTRIBUTING。

第 6 天：

- 用 Vercel 部署。
- 绑定域名或先使用 Vercel 默认域名。

第 7 天：

- 在 GitHub 仓库 About 区补描述、网站链接、Topics。
- 发第一条 Release。
- 写一篇“我为什么开源这个博客模板”的文章。

## 10. 开源前最后一句提醒

个人博客最容易泄露的不是代码，而是内容：旧文章、截图、二维码、构建产物、部署配置、聊天记录和联系方式。每次公开前都跑一遍关键词搜索，再用人工看一遍首页、关于页、联系页、项目页和文章正文。

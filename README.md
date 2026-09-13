# poemoment

poemoment 的个人博客，基于 Astro 搭建。保留了博客、随记、收藏、项目、友链、搜索、RSS、站点地图与站内终端（`/terminal`）能力。

## 快速开始

```bash
npm install
npm run dev
```

本地打开 `http://localhost:4321`。

## 常用命令

```bash
npm run dev      # 本地开发
npm run build    # 构建生产版本
npm run preview  # 预览构建结果
npm run check    # Astro 类型检查
npm run lint     # ESLint
npm run format   # Prettier 格式化
```

## 你最先要改的地方

- `src/site.config.ts`: 站点标题、作者、描述、导航、社交链接。
- `src/pages/index.astro`: 首页的头像缩写、简介、技能和首页卡片。
- `src/pages/about/index.astro`: 关于页。
- `src/pages/contact/index.astro`: 公开联系方式。
- `src/pages/projects/index.astro`: 项目展示。
- `src/content/blog`: 正式文章。
- `src/content/archive`: 短笔记。
- `src/content/curated`: 收藏资料。

完整上手、发布和 GitHub 开源流程见 [BLOG_TEMPLATE_GUIDE.md](./BLOG_TEMPLATE_GUIDE.md)。

## Credits

本站基于 [Astro](https://github.com/withastro/astro)、[Astro Theme Pure](https://github.com/cworld1/astro-theme-pure) 与 Joye 的博客设计改造，保留上游项目的许可证和致谢。

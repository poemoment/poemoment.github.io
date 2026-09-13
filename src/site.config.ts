import type {
  CardListData,
  Config,
  IntegrationUserConfig,
  ThemeUserConfig
} from 'astro-pure/types'

export const theme: ThemeUserConfig = {
  title: 'poemoment',
  author: 'poemoment',
  description:
    'poemoment 的个人博客：以长期理解为目标的技术学习笔记、实践记录与公开思考。',
  favicon: '/favicon/favicon.ico',
  locale: {
    lang: 'zh-CN',
    attrs: 'zh_CN',
    dateLocale: 'zh-CN',
    dateOptions: {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }
  },
  logo: {
    src: '/favicon/favicon-32x32.png',
    alt: 'Site logo'
  },
  titleDelimiter: '|',
  prerender: true,
  npmCDN: 'https://cdn.jsdelivr.net/npm',
  head: [],
  customCss: [],
  header: {
    menu: [
      { title: '文章', link: '/blog' },
      { title: '随记', link: '/archive' },
      { title: '收藏', link: '/curated' },
      { title: '项目', link: '/projects' },
      { title: '关于', link: '/about' }
    ]
  },
  footer: {
    links: [
      // 视觉菜单 ③：页脚迷你导航（学自 rauno.me）——次级页面入口收在页脚，不占主导航
      {
        title: '更新日志',
        link: '/changelog',
        pos: 1
      },
      {
        title: '书单',
        link: '/library',
        pos: 1
      },
      {
        title: '站内终端',
        link: '/terminal',
        pos: 1
      },
      {
        title: 'Site Policy',
        link: '/terms/list',
        pos: 2
      }
    ],
    credits: true,
    social: {
      github: 'https://github.com/'
    }
  },
  content: {
    externalLinksContent: ' ->',
    blogPageSize: 8,
    externalLinkArrow: true,
    share: ['x']
  }
}

export const integ: IntegrationUserConfig = {
  links: {
    logbook: [
      { date: '2026-06-17', content: '完成模板化清理，站点以占位内容运行。' },
      { date: '2026-07-26', content: '确定站名 poemoment，首页转向以阅读为中心的简洁风格。' },
      {
        date: '2026-09-06',
        content:
          '按《博客设计方案-三种方向》落地推荐组合：首页改为研究档案室（3/6/3 首屏 + 栏目索引），全局色板、圆角、阴影统一，文章页正文 70ch 并支持修订状态与「尚未解决的问题」字段。'
      },
      {
        date: '2026-09-08',
        content:
          '按《博客视觉菜单》两批细节迭代首页与全站：文章行间隔号元数据、置顶字段、相对时间、未读圆点、栏目边界句，新增 /changelog 与 /library 页，页脚收纳次级入口并补全键盘快捷键。'
      }
    ],
    applyTip: [
      { name: 'Name', val: theme.title },
      { name: 'Desc', val: theme.description || 'Null' },
      { name: 'Link', val: 'http://localhost:4321/' },
      { name: 'Avatar', val: 'http://localhost:4321/favicon/favicon.ico' }
    ]
  },
  pagefind: true,
  quote: {
    server: 'https://api.quotable.io/quotes/random?maxLength=60',
    target: `(data) => data[0]?.content || 'Placeholder quote'`
  },
  typography: {
    class: 'prose text-base text-foreground'
  },
  mediumZoom: {
    enable: true,
    selector: '.prose .zoomable',
    options: {
      className: 'zoomable'
    }
  },
  waline: {
    enable: false,
    server: '',
    additionalConfigs: {
      pageview: false,
      comment: false
    }
  }
}

export const terms: CardListData = {
  title: 'Terms content',
  list: [
    {
      title: 'Privacy Policy',
      link: '/terms/privacy-policy'
    },
    {
      title: 'Terms and Conditions',
      link: '/terms/terms-and-conditions'
    },
    {
      title: 'Copyright',
      link: '/terms/copyright'
    },
    {
      title: 'Disclaimer',
      link: '/terms/disclaimer'
    }
  ]
}

const config = { ...theme, integ } as Config
export default config

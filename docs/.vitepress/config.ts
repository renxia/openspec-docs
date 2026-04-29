import { defineConfig } from 'vitepress'

const SITE_TITLE = 'OpenSpec'
const SITE_DESCRIPTION = 'OpenSpec Documentation'

type SidebarItem = {
  text: Record<string, string>
  link?: string
}

const sidebarConfig: SidebarItem[] = [
  { text: { en: 'Getting Started', 'zh-CN': '快速开始' }, link: '/getting-started' },
  { text: { en: 'Installation', 'zh-CN': '安装' }, link: '/installation' },
  { text: { en: 'Concepts', 'zh-CN': '核心概念' }, link: '/concepts' },
  { text: { en: 'Commands', 'zh-CN': '命令参考' }, link: '/commands' },
  { text: { en: 'CLI Reference', 'zh-CN': 'CLI 参考' }, link: '/cli' },
  { text: { en: 'Workflows', 'zh-CN': '工作流' }, link: '/workflows' },
  { text: { en: 'OPSX Workflow', 'zh-CN': 'OPSX 工作流' }, link: '/opsx' },
  { text: { en: 'Customization', 'zh-CN': '自定义' }, link: '/customization' },
  { text: { en: 'Supported Tools', 'zh-CN': '支持的工具' }, link: '/supported-tools' },
  { text: { en: 'Multi-Language', 'zh-CN': '多语言' }, link: '/multi-language' },
  { text: { en: 'Migration Guide', 'zh-CN': '迁移指南' }, link: '/migration-guide' },
]

function buildSidebar(lang: string) {
  return sidebarConfig.map((item) => ({
    text: item.text[lang],
    link: `/${lang}${item.link}`,
  }))
}

export default defineConfig({
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  lastUpdated: true,

  // 子目录部署配置
  base: '/docs/openspec/',

  // SEO: 基础 URL 和规范链接
  head: [
    // 基础 meta
    ['meta', { name: 'keywords', content: 'openspec, documentation, docs' }],
    // Open Graph
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: SITE_TITLE }],
    // Twitter Card
    ['meta', { name: 'twitter:card', content: 'summary' }],
    // 多语言 hreflang（静态注入）
    ['link', { rel: 'alternate', type: 'application/rss+xml', title: 'OpenSpec RSS', href: '/feed.json' }],
    // 公共脚本
    ['script', { src: 'https://lzw.me/x/lib/utils/h5-common.min.js?v=3da9ebdd', defer: '' }],
  ],

  // 多语言 hreflang 配置（VitePress 会自动处理，但需确保正确）
  sitemap: {
    hostname: 'https://lzw.me/docs/openspec',
  },

  themeConfig: {
    search: {
      provider: 'local',
    },
    nav: [
      { text: '更多文档', link: 'https://lzw.me/docs/' },
      { text: 'Home', link: '/' },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/renxia/openspec-docs.git' },
      { icon: 'github', link: 'https://github.com/Fission-AI/OpenSpec.git' },
    ],
  },

  locales: {
    root: {
      label: 'Select Language',
      lang: 'en',
      description: 'OpenSpec Documentation',
    },
    en: {
      label: 'English',
      lang: 'en',
      link: '/en/',
      description: 'OpenSpec Documentation',
      themeConfig: {
        // nav: [{ text: 'Docs', link: '/en/getting-started' }],
        sidebar: buildSidebar('en'),
      },
    },
    'zh-CN': {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/zh-CN/',
      description: 'OpenSpec 中文文档',
      themeConfig: {
        // nav: [{ text: '文档', link: '/zh-CN/getting-started' }],
        sidebar: buildSidebar('zh-CN'),
      },
    },
  },
})

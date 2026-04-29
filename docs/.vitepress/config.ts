import { defineConfig } from 'vitepress'

const SITE_TITLE = 'OpenSpec'
const SITE_DESCRIPTION = 'OpenSpec Documentation'

// 语言配置映射
const LANGUAGES = {
  // 高优先级
  en: { label: 'English', native: 'English', description: 'OpenSpec Documentation' },
  'zh-CN': { label: '简体中文', native: '简体中文', description: 'OpenSpec 中文文档' },
  ja: { label: '日本語', native: '日本語', description: 'OpenSpec 日本語ドキュメント' },
  es: { label: 'Español', native: 'Español', description: 'Documentación de OpenSpec' },
  ko: { label: '한국어', native: '한국어', description: 'OpenSpec 한국어 문서' },
  ru: { label: 'Русский', native: 'Русский', description: 'Документация OpenSpec' },
  'pt-BR': { label: 'Português (BR)', native: 'Português (Brasil)', description: 'Documentação do OpenSpec' },
  // 中优先级
  fr: { label: 'Français', native: 'Français', description: 'Documentation OpenSpec' },
  de: { label: 'Deutsch', native: 'Deutsch', description: 'OpenSpec Dokumentation' },
  id: { label: 'Bahasa Indonesia', native: 'Bahasa Indonesia', description: 'Dokumentasi OpenSpec' },
  vi: { label: 'Tiếng Việt', native: 'Tiếng Việt', description: 'Tài liệu OpenSpec' },
  ar: { label: 'العربية', native: 'العربية', description: 'وثائق OpenSpec' },
  // 扩展语言（可按需启用）
  'zh-TW': { label: '繁體中文', native: '繁體中文', description: 'OpenSpec 繁體中文文檔' },
  it: { label: 'Italiano', native: 'Italiano', description: 'Documentazione OpenSpec' },
  uk: { label: 'Українська', native: 'Українська', description: 'Документація OpenSpec' },
  pl: { label: 'Polski', native: 'Polski', description: 'Dokumentacja OpenSpec' },
  tr: { label: 'Türkçe', native: 'Türkçe', description: 'OpenSpec Belgelendirme' },
  th: { label: 'ภาษาไทย', native: 'ภาษาไทย', description: 'เอกสาร OpenSpec' },
  hi: { label: 'हिन्दी', native: 'हिन्दी', description: 'OpenSpec दस्तावेज़ीकरण' },
  nl: { label: 'Nederlands', native: 'Nederlands', description: 'OpenSpec Documentatie' },
} as const

type LangCode = keyof typeof LANGUAGES

type SidebarItem = {
  text: Partial<Record<LangCode, string>>
  link?: string
}

const sidebarConfig: SidebarItem[] = [
    {
        "text": {
            "en": "Getting Started",
            "zh-CN": "快速开始",
            "ja": "はじめに",
            "es": "Primeros pasos",
            "ko": "시작하기",
            "ru": "Начало работы",
            "pt-BR": "Começando",
            "fr": "Pour Commencer",
            "de": "Erste Schritte",
            "id": "Memulai",
            "vi": "Bắt đầu",
            "ar": "البدء",
            "zh-TW": "快速開始",
            "it": "Iniziare",
            "uk": "Початок роботи",
            "pl": "Pierwsze kroki",
            "tr": "Başlangıç",
            "th": "เริ่มต้น",
            "hi": "शुरू करें",
            "nl": "Aan de slag"
        },
        "link": "/getting-started"
    },
    {
        "text": {
            "en": "Installation",
            "zh-CN": "安装",
            "ja": "インストール",
            "es": "Instalación",
            "ko": "설치",
            "ru": "Установка",
            "pt-BR": "Instalação",
            "fr": "Installation",
            "de": "Installation",
            "id": "Instalasi",
            "vi": "Cài đặt",
            "ar": "التثبيت",
            "zh-TW": "安裝",
            "it": "Installazione",
            "uk": "Встановлення",
            "pl": "Instalacja",
            "tr": "Kurulum",
            "th": "การติดตั้ง",
            "hi": "इंस्टॉलेशन",
            "nl": "Installatie"
        },
        "link": "/installation"
    },
    {
        "text": {
            "en": "Concepts",
            "zh-CN": "核心概念",
            "ja": "コンセプト",
            "es": "Conceptos",
            "ko": "개념",
            "ru": "Концепции",
            "pt-BR": "Conceitos",
            "fr": "Concepts",
            "de": "Konzepte",
            "id": "Konsep",
            "vi": "Khái niệm",
            "ar": "المفاهيم",
            "zh-TW": "核心概念",
            "it": "Concetti",
            "uk": "Концепції",
            "pl": "Koncepcje",
            "tr": "Kavramlar",
            "th": "แนวคิด",
            "hi": "अवधारणाएं",
            "nl": "Concepten"
        },
        "link": "/concepts"
    },
    {
        "text": {
            "en": "Commands",
            "zh-CN": "命令参考",
            "ja": "コマンド",
            "es": "Comandos",
            "ko": "명령어",
            "ru": "Команды",
            "pt-BR": "Comandos",
            "fr": "Commandes",
            "de": "Befehle",
            "id": "Perintah",
            "vi": "Lệnh",
            "ar": "الأوامر",
            "zh-TW": "命令參考",
            "it": "Comandi",
            "uk": "Команди",
            "pl": "Polecenia",
            "tr": "Komutlar",
            "th": "คำสั่ง",
            "hi": "कमांड्स",
            "nl": "Opdrachten"
        },
        "link": "/commands"
    },
    {
        "text": {
            "en": "CLI Reference",
            "zh-CN": "CLI 参考",
            "ja": "CLI リファレンス",
            "es": "Referencia CLI",
            "ko": "CLI 참조",
            "ru": "Справка по CLI",
            "pt-BR": "Referência CLI",
            "fr": "Référence CLI",
            "de": "CLI-Referenz",
            "id": "Referensi CLI",
            "vi": "Tham chiếu CLI",
            "ar": "مرجع CLI",
            "zh-TW": "CLI 參考",
            "it": "Riferimento CLI",
            "uk": "Довідник CLI",
            "pl": "Dokumentacja CLI",
            "tr": "CLI Referansı",
            "th": "คู่มือ CLI",
            "hi": "CLI संदर्भ",
            "nl": "CLI Referentie"
        },
        "link": "/cli"
    },
    {
        "text": {
            "en": "Workflows",
            "zh-CN": "工作流",
            "ja": "ワークフロー",
            "es": "Flujos de trabajo",
            "ko": "워크플로우",
            "ru": "Рабочие процессы",
            "pt-BR": "Fluxos de trabalho",
            "fr": "Flux de travail",
            "de": "Workflows",
            "id": "Alur kerja",
            "vi": "Quy trình",
            "ar": "سير العمل",
            "zh-TW": "工作流",
            "it": "Workflows",
            "uk": "Робочі процеси",
            "pl": "Przepływy pracy",
            "tr": "İş Akışları",
            "th": "เวิร์กโฟลว์",
            "hi": "वर्कफ़्लो",
            "nl": "Werkmethoden"
        },
        "link": "/workflows"
    },
    {
        "text": {
            "en": "OPSX Workflow",
            "zh-CN": "OPSX 工作流",
            "ja": "OPSX ワークフロー",
            "es": "Flujo OPSX",
            "ko": "OPSX 워크플로우",
            "ru": "OPSX Рабочий процесс",
            "pt-BR": "Fluxo OPSX",
            "fr": "Flux OPSX",
            "de": "OPSX Workflow",
            "id": "Alur kerja OPSX",
            "vi": "Quy trình OPSX",
            "ar": "سير عمل OPSX",
            "zh-TW": "OPSX 工作流",
            "it": "Workflow OPSX",
            "uk": "OPSX Робочий процес",
            "pl": "Przepływ OPSX",
            "tr": "OPSX İş Akışı",
            "th": "เวิร์กโฟลว์ OPSX",
            "hi": "OPSX वर्कफ़्लो",
            "nl": "OPSX Workflow"
        },
        "link": "/opsx"
    },
    {
        "text": {
            "en": "Customization",
            "zh-CN": "自定义",
            "ja": "カスタマイズ",
            "es": "Personalización",
            "ko": "사용자 정의",
            "ru": "Настройка",
            "pt-BR": "Personalização",
            "fr": "Personnalisation",
            "de": "Anpassung",
            "id": "Kustomisasi",
            "vi": "Tùy chỉnh",
            "ar": "التخصيص",
            "zh-TW": "自定義",
            "it": "Personalizzazione",
            "uk": "Налаштування",
            "pl": "Dostosowywanie",
            "tr": "Özelleştirme",
            "th": "การปรับแต่ง",
            "hi": "कस्टमाइज़ेशन",
            "nl": "Aanpassing"
        },
        "link": "/customization"
    },
    {
        "text": {
            "en": "Supported Tools",
            "zh-CN": "支持的工具",
            "ja": "サポートツール",
            "es": "Herramientas soportadas",
            "ko": "지원 도구",
            "ru": "Поддерживаемые инструменты",
            "pt-BR": "Ferramentas suportadas",
            "fr": "Outils supportés",
            "de": "Unterstützte Tools",
            "id": "Alat yang didukung",
            "vi": "Công cụ hỗ trợ",
            "ar": "الأدوات المدعومة",
            "zh-TW": "支援的工具",
            "it": "Strumenti supportati",
            "uk": "Підтримувані інструменти",
            "pl": "Obsługiwane narzędzia",
            "tr": "Desteklenen Araçlar",
            "th": "เครื่องมือที่รองรับ",
            "hi": "समर्थित उपकरण",
            "nl": "Ondersteunde tools"
        },
        "link": "/supported-tools"
    },
    {
        "text": {
            "en": "Multi-Language",
            "zh-CN": "多语言",
            "ja": "多言語",
            "es": "Multiidioma",
            "ko": "다국어",
            "ru": "Многоязычность",
            "pt-BR": "Multilíngue",
            "fr": "Multilingue",
            "de": "Mehrsprachig",
            "id": " multibahasa",
            "vi": "Đa ngôn ngữ",
            "ar": "متعدد اللغات",
            "zh-TW": "多語言",
            "it": "Multilingua",
            "uk": "Багатомовність",
            "pl": "Wielojęzyczność",
            "tr": "Çok Dilli",
            "th": "หลายภาษา",
            "hi": "बहुभाषी",
            "nl": "Meertalig"
        },
        "link": "/multi-language"
    },
    {
        "text": {
            "en": "Migration Guide",
            "zh-CN": "迁移指南",
            "ja": "マイグレーションガイド",
            "es": "Guía de migración",
            "ko": "마이그레이션 가이드",
            "ru": "Руководство по миграции",
            "pt-BR": "Guia de migração",
            "fr": "Guide de migration",
            "de": "Migrationsanleitung",
            "id": "Panduan migrasi",
            "vi": "Hướng dẫn di chuyển",
            "ar": "دليل الترحيل",
            "zh-TW": "遷移指南",
            "it": "Guida alla migrazione",
            "uk": "Посібник з міграції",
            "pl": "Przewodnik migracji",
            "tr": "Geçiş Kılavuzu",
            "th": "คู่มือการย้ายข้อมูล",
            "hi": "माइग्रेशन गाइड",
            "nl": "Migratiehandleiding"
        },
        "link": "/migration-guide"
    }
]

function buildSidebar(lang: LangCode) {
  return sidebarConfig.map((item) => ({
    text: item.text[lang] || item.text.en || '',
    link: `/${lang}${item.link}`,
  }))
}

// 构建 locales 配置
function buildLocales() {
  const locales: Record<string, any> = {}
  for (const [code, config] of Object.entries(LANGUAGES)) {
    locales[code] = {
      label: config.label,
      lang: code,
      link: `/${code}/`,
      description: config.description,
      themeConfig: {
        sidebar: buildSidebar(code as LangCode),
      },
    }
  }
  return locales
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
    ...buildLocales(),
  },
})

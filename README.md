# OpenSpec Docs

OpenSpec 官方文档的多语言版本，基于 [OpenSpec](https://github.com/Fission-AI/OpenSpec) 官方英文文档生成。

## 在线访问

| 语言 | 网址 |
|------|------|
| English | https://lzw.me/docs/openspec/en/ |
| 简体中文 | https://lzw.me/docs/openspec/zh-CN/ |
| 繁體中文 | https://lzw.me/docs/openspec/zh-TW/ |
| 日本語 | https://lzw.me/docs/openspec/ja/ |
| 한국어 | https://lzw.me/docs/openspec/ko/ |
| Español | https://lzw.me/docs/openspec/es/ |
| Português (Brasil) | https://lzw.me/docs/openspec/pt-BR/ |
| Русский | https://lzw.me/docs/openspec/ru/ |
| Français | https://lzw.me/docs/openspec/fr/ |
| Deutsch | https://lzw.me/docs/openspec/de/ |
| Bahasa Indonesia | https://lzw.me/docs/openspec/id/ |
| Tiếng Việt | https://lzw.me/docs/openspec/vi/ |
| العربية | https://lzw.me/docs/openspec/ar/ |
| Italiano | https://lzw.me/docs/openspec/it/ |
| Українська | https://lzw.me/docs/openspec/uk/ |
| Polski | https://lzw.me/docs/openspec/pl/ |
| Türkçe | https://lzw.me/docs/openspec/tr/ |
| ภาษาไทย | https://lzw.me/docs/openspec/th/ |
| हिन्दी | https://lzw.me/docs/openspec/hi/ |
| Nederlands | https://lzw.me/docs/openspec/nl/ |

## 开发

```bash
# 安装依赖
pnpm install

# 本地开发
pnpm dev

# 构建静态站点
pnpm build

# 翻译文档
pnpm translate -p docs/en -t zh-CN
```

## 翻译脚本使用

```bash
# 从英语翻译到简体中文
bun scripts/translate.ts -p docs/en -t zh-CN

# 从简体中文翻译到日语
bun scripts/translate.ts -p docs/zh-CN -t ja -s zh-CN

# 支持的语言代码
en, zh-CN, zh-TW, ja, ko, es, pt-BR, ru, fr, de, id, vi, ar, it, uk, pl, tr, th, hi, nl
```

## 项目结构

```
openspec-docs/
├── docs/                  # 文档源文件
│   ├── en/               # 英文文档
│   ├── zh-CN/            # 简体中文文档
│   └── ...
├── scripts/              # 构建和翻译脚本
│   ├── build.ts          # 构建脚本
│   └── translate.ts      # 翻译脚本
└── translate-records.json # 翻译记录
```

## 许可证

MIT

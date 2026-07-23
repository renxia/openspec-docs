#!/usr/bin/env bun

import { Command } from 'commander';
import env from 'dotenv';
import { md5, NLogger, color, concurrency, mkdirp, Limiter } from '@lzwme/fe-utils';
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync, rmSync, unlinkSync } from 'node:fs';
import { join, dirname, relative, extname, sep, basename } from 'node:path';
import build from './build';
import { execSync } from 'node:child_process';

env.config();
const ROOT_DIR = process.cwd()

const program = new Command();
const logger = new NLogger('T');
// 用于记录已翻译的文件，避免重复翻译
const RECORD_FILE = join(process.cwd(), './translate-records.json');
// 文本分段最大长度阈值，默认 8000 字符
const MAX_CHUNK_SIZE = Number(process.env.TRANSLATE_MAX_CHUNK_SIZE || 8000);
// Translation records
const translateRecords: { [filepath: string]: { srcMd5: string; } & { [targetpath: string]: string } } = existsSync(RECORD_FILE) ? JSON.parse(readFileSync(RECORD_FILE, 'utf-8')) : {};

// ---- LLM API 客户端配置 ----
/** 单组 LLM API 配置 */
interface LLMClientConfig {
  baseUrl: string;
  apiKey: string;
  model: string;
  /** 该 key 允许的最大并发请求数 */
  maxConcurrency: number;
  /** 标签，用于日志区分 */
  label?: string;
}

/** 解析多组 API key 配置（环境变量） */
function parseMultiKeyConfigs(): LLMClientConfig[] {
  const configs: LLMClientConfig[] = [];
  const defaultBaseUrl = process.env.OPENAI_BASE_URL || 'http://localhost:11434/v1';
  const defaultModel = process.env.TRANSLATE_OPENAI_MODEL || 'qwen3.5:latest';
  const defaultConcurrency = Number(process.env.TRANSLATE_API_CONCURRENCY || '3');

  // OPENAI_API_KEY_1, OPENAI_API_KEY_2, ... 每项支持逗号分隔多个 key
  // 同一编号下的 key 共享 baseUrl/model/concurrency 配置
  let idx = 1;
  while (true) {
    const keyRaw = process.env[`OPENAI_API_KEY_${idx}`];
    if (!keyRaw) break;

    const keyBaseUrl = process.env[`OPENAI_BASE_URL_${idx}`] || defaultBaseUrl;
    const keyModel = process.env[`TRANSLATE_OPENAI_MODEL_${idx}`] || defaultModel;
    const keyConcurrency = Number(process.env[`TRANSLATE_API_CONCURRENCY_${idx}`] || defaultConcurrency);

    // 支持逗号分隔多个 key，共享同一组 baseUrl/model/concurrency
    const keys = keyRaw.split(',').map(k => k.trim()).filter(Boolean);
    for (let j = 0; j < keys.length; j++) {
      const label = keys.length > 1 ? `key-${idx}-${j + 1}` : `key-${idx}`;
      configs.push({ baseUrl: keyBaseUrl, apiKey: keys[j], model: keyModel, maxConcurrency: keyConcurrency, label });
    }
    idx++;
  }

  // 兼容：如果都没有，回退到默认的 OPENAI_API_KEY
  if (configs.length === 0) {
    const fallbackKey = process.env.OPENAI_API_KEY || '';
    configs.push({ baseUrl: defaultBaseUrl, apiKey: fallbackKey, model: defaultModel, maxConcurrency: defaultConcurrency, label: 'default' });
  }

  return configs;
}

// ---- LLMClient：封装单组 API key + 并发控制 ----
class LLMClient {
  readonly config: LLMClientConfig;
  private limiter: Limiter<any>;

  constructor(config: LLMClientConfig) {
    this.config = config;
    this.limiter = new Limiter(config.maxConcurrency);
  }

  /** 当前队列中待处理 + 执行中的任务数 */
  get load(): number {
    return this.limiter.size;
  }

  /**
   * 发送翻译请求（自动排队）
   * @param content 待翻译文本
   * @param systemPrompt 系统提示词
   * @param timeoutMs 超时时间
   */
  req(content: string, systemPrompt: string, timeoutMs = 300_000): Promise<string> {
    return this.limiter.queue(async () => {
      const { baseUrl, apiKey, model } = this.config;

      const body = {
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content },
        ],
        temperature: 0.3,
      };

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);

      try {
        const response = await fetch(`${baseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify(body),
          signal: controller.signal,
        });

        if (response.ok) {
          const json = await response.json();
          return json.choices[0].message.content.trim();
        }

        const text = await response.text();
        throw new Error(`API error ${response.status}: ${text}`);
      } finally {
        clearTimeout(timer);
      }
    });
  }

  dispose() {
    this.limiter.dispose();
  }
}

// ---- 翻译任务调度器 ----
class TranslateScheduler {
  private clients: LLMClient[];

  constructor(clients: LLMClient[]) {
    this.clients = clients;
    logger.log(`Scheduler initialized with ${color.yellow(clients.length)} API client(s), total concurrency: ${color.yellow(clients.reduce((s, c) => s + c.config.maxConcurrency, 0))}`);
    for (const c of clients) {
      logger.log(`  [${color.cyan(c.config.label || '?')}] ${c.config.baseUrl} (concurrency=${c.config.maxConcurrency})`);
    }
  }

  /** 获取总并发能力 */
  get totalCapacity(): number {
    return this.clients.reduce((s, c) => s + c.config.maxConcurrency, 0);
  }

  /**
   * 选择一个客户端来执行任务。
   * 策略：优先选择负载最低的客户端（load / maxConcurrency 比值最小）
   */
  private pickClient(): LLMClient {
    let best = this.clients[0];
    let bestRatio = Infinity;
    for (const c of this.clients) {
      const ratio = c.load / c.config.maxConcurrency;
      if (ratio < bestRatio) {
        bestRatio = ratio;
        best = c;
      }
    }
    return best;
  }

  /**
   * 分发单个翻译请求到负载最低的 client
   */
  dispatch(content: string, systemPrompt: string, timeoutMs?: number): Promise<string> {
    const client = this.pickClient();
    return client.req(content, systemPrompt, timeoutMs);
  }

  dispose() {
    for (const c of this.clients) c.dispose();
  }
}

/** 全局调度器实例（在 main 中初始化） */
let scheduler: TranslateScheduler | null = null;

// 语言代码到语言名称的映射
const LANGUAGE_NAMES: Record<string, { native: string; english: string }> = {
  'en': { native: 'English', english: 'English' },
  'zh-CN': { native: '简体中文', english: 'Simplified Chinese' },
  'zh-TW': { native: '繁體中文', english: 'Traditional Chinese' },
  'ja': { native: '日本語', english: 'Japanese' },
  'ko': { native: '한국어', english: 'Korean' },
  'es': { native: 'Español', english: 'Spanish' },
  'pt-BR': { native: 'Português (Brasil)', english: 'Brazilian Portuguese' },
  'pt': { native: 'Português', english: 'Portuguese' },
  'ru': { native: 'Русский', english: 'Russian' },
  'fr': { native: 'Français', english: 'French' },
  'de': { native: 'Deutsch', english: 'German' },
  'it': { native: 'Italiano', english: 'Italian' },
  'ar': { native: 'العربية', english: 'Arabic' },
  'hi': { native: 'हिन्दी', english: 'Hindi' },
  'id': { native: 'Bahasa Indonesia', english: 'Indonesian' },
  'vi': { native: 'Tiếng Việt', english: 'Vietnamese' },
  'th': { native: 'ภาษาไทย', english: 'Thai' },
  'tr': { native: 'Türkçe', english: 'Turkish' },
  'pl': { native: 'Polski', english: 'Polish' },
  'nl': { native: 'Nederlands', english: 'Dutch' },
  'uk': { native: 'Українська', english: 'Ukrainian' },
}

const INDEX_META = `---
layout: home

hero:
  name: "OpenSpec"
  text: "Specification-Driven Development for AI Assistants"
  tagline: A lightweight spec for building and managing AI assistant projects.
  actions:
    - theme: brand
      text: Get Started
      link: ./getting-started
    - theme: alt
      text: Home
      link: /

features:
  - title: Spec-First Workflow
    details: Define requirements before writing code.
  - title: AI-Native Design
    details: Built for Claude Code, Cursor, Windsurf and more.
  - title: Multi-Language
    details: Documentation available in multiple languages.
---
`

// 获取语言显示名称
function getLanguageDisplayName(langCode: string, forSource = false): string {
  const lang = LANGUAGE_NAMES[langCode] || { native: langCode, english: langCode }
  // 对于目标语言，使用本地名称更友好
  if (!forSource && lang.native !== langCode) {
    return `${lang.native} (${lang.english})`
  }
  return lang.english
}

// 受支持的语言列表（用于 CLI 选项）
const SUPPORTED_LANGUAGES = Object.keys(LANGUAGE_NAMES)

program
  .name('translate-docs')
  .description('Translate documentation files using LLM (supports multiple API keys for higher throughput)')
  .version('1.0.0')
  .requiredOption('-p, --path <path>', 'Path to file or directory to translate', 'docs/en')
  .option('-s, --source-lang <lang>', 'Source language (default: en)', 'en')
  .option('-t, --target-lang <lang>', 'Target language (e.g., zh-CN, ja, es, all)', 'all')
  .option('--timeout <ms>', 'Timeout per request in milliseconds. default: 300_000')
  .option('-B, --build', 'Build docs after translation', false)
  .option('-S, --sync', 'Sync docs from hermes-agent repository before translating', false)
  .option('-D, --debug', 'Debug mode')
  .addHelpText('after', `
Supported languages: ${SUPPORTED_LANGUAGES.join(', ')}

Environment variables for multi-key configuration:
  OPENAI_BASE_URL          - Default LLM API base URL
  TRANSLATE_OPENAI_MODEL   - Default model name
  TRANSLATE_API_CONCURRENCY - Concurrency per API key (default: 3)
  TRANSLATE_MAX_CHUNK_SIZE - Max characters per chunk (default: 8000)
  TRANSLATE_MAX_RETRIES    - Max retries on failure (default: 3)

  Single key (backward compatible):
    OPENAI_API_KEY         - API key

  Multiple keys (increases total RPM capacity):
    OPENAI_API_KEY_1       - API key(s), comma-separated for multiple keys
    OPENAI_API_KEY_2       - Second group
    ... (OPENAI_API_KEY_N)
    OPENAI_BASE_URL_1      - Optional: custom base URL for group 1
    TRANSLATE_OPENAI_MODEL_1     - Optional: custom model for group 1
    TRANSLATE_API_CONCURRENCY_1  - Optional: custom concurrency for group 1

    Keys within the same group share baseUrl/model/concurrency.
    Example: OPENAI_API_KEY_1=sk-a,sk-b,sk-c

Examples:
  bun translate.ts -p docs/en -t zh-CN       # English to Chinese
  bun translate.ts -p docs/en -t ja          # English to Japanese
  bun translate.ts -p docs/zh-CN -t es -s zh-CN  # Chinese to Spanish
`);

program.parse();
const options = program.opts();

if (options.debug) logger.updateOptions({ levelType: 'debug' })
logger.debug('options:', options)

// ---- Text Chunking ----
function splitBySection(text: string): string[] {
  const lines = text.split('\n')
  const chunks: string[] = []
  let currentChunk: string[] = []
  let currentLength = 0
  let insideFence = false

  for (const line of lines) {
    const lineLength = line.length + 1
    const isSectionHeader = /^##\s/.test(line)

    // Track fenced code block state (```, ~~~, etc.)
    if (/^```/.test(line.trim())) {
      insideFence = !insideFence
    }

    // 仅在不在 code block 内部时才按 ## 切分
    if (isSectionHeader && !insideFence && currentLength > MAX_CHUNK_SIZE && currentChunk.length > 0) {
      chunks.push(currentChunk.join('\n'))
      currentChunk = [line]
      currentLength = lineLength
    } else {
      currentChunk.push(line)
      currentLength += lineLength
    }
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join('\n'))
  }

  return chunks
}

function splitByParagraph(text: string): string[] {
  if (text.length <= MAX_CHUNK_SIZE) {
    return [text]
  }

  // Try splitting by ## first
  const sidx = text.indexOf('\n## ')
  if (sidx > 0) {
    const nextIdx = text.indexOf('\n## ', sidx + 5)
    if (sidx <= MAX_CHUNK_SIZE / 3 && nextIdx > -1) {
      return [text.slice(0, nextIdx), text.slice(nextIdx)]
    }
    return [text.slice(0, sidx), text.slice(sidx)]
  }

  // 将原始 text 按段落拆分，但合并 fenced code block 内部的段落
  const rawParagraphs = text.split(/\n\n+/)
  const paragraphs: string[] = []
  let insideFence = false
  let pending: string[] = []

  for (const para of rawParagraphs) {
    const lines = para.split('\n')
    for (const line of lines) {
      if (/^```/.test(line.trim())) {
        insideFence = !insideFence
      }
    }
    pending.push(para)
    // 只有在非 fence 内部时才确认一个真正的段落边界
    if (!insideFence) {
      paragraphs.push(pending.join('\n\n'))
      pending = []
    }
  }
  // 收尾：如果 fence 未闭合，将剩余部分合并到一起
  if (pending.length > 0) {
    paragraphs.push(pending.join('\n\n'))
  }

  const chunks: string[] = []
  let currentChunk = ''

  for (const para of paragraphs) {
    if ((currentChunk + '\n\n' + para).length <= MAX_CHUNK_SIZE) {
      currentChunk = currentChunk ? currentChunk + '\n\n' + para : para
    } else {
      if (currentChunk) chunks.push(currentChunk)
      if (para.length > MAX_CHUNK_SIZE) {
        // Split by sentence for very long paragraphs
        const sentences = para.split(/(?<=[。！？.!?])\s*/)
        currentChunk = ''
        for (const sentence of sentences) {
          if ((currentChunk + ' ' + sentence).length <= MAX_CHUNK_SIZE) {
            currentChunk = currentChunk ? currentChunk + ' ' + sentence : sentence
          } else {
            if (currentChunk) chunks.push(currentChunk)
            currentChunk = sentence
          }
        }
      } else {
        currentChunk = para
      }
    }
  }

  if (currentChunk) chunks.push(currentChunk)
  return chunks
}

// ---- Translation via API ----
function buildSystemPrompt(sourceLang: string, targetLang: string): string {
  const sourceLangDisplay = getLanguageDisplayName(sourceLang, true)
  const targetLangDisplay = getLanguageDisplayName(targetLang)

  return `You are a professional technical documentation translator.

## Task
Translate the following markdown documentation from **${sourceLangDisplay}** to **${targetLangDisplay}**.

## Language Requirements
- Use natural, professional technical terminology appropriate for ${targetLangDisplay}.
- Maintain consistent terminology throughout the document.
- For code-related terms without local equivalents, keep them in English.

## Rules
1. **Preserve exactly as-is**: Markdown formatting, code blocks, syntax highlighting, tables, and frontmatter.
2. **Translate only prose**: Comments in code, descriptions, and explanatory text.
3. **Do NOT translate**: Code examples, variable names, function names, CLI commands, file paths, URLs, and technical identifiers.
4. **Keep links intact**: All URLs and internal links must remain unchanged.
5. **Preserve YAML frontmatter**: Keep frontmatter keys unchanged, only translate their values.
6. **No extra content**: Do NOT add any explanations, comments, or notes outside the translated content.
7. **Output format**: Output ONLY the translated markdown content, nothing else.

## Text to translate:`
}

/** 单次翻译请求（带重试），通过调度器分发 */
async function translateSingleChunk(content: string, sourceLang: string, targetLang: string, id = ''): Promise<string> {
  const systemPrompt = buildSystemPrompt(sourceLang, targetLang);
  const MAX_RETRIES = Number(process.env.TRANSLATE_MAX_RETRIES) || 3;
  const BASE_DELAY_MS = 1000;
  const timeoutMs = Number(options.timeout) || 300_000;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await scheduler!.dispatch(content, systemPrompt, timeoutMs);
    } catch (err: any) {
      const is429 = err.message?.includes('API error 429') || err.message?.includes('status 429');
      const isNetworkErr = err instanceof Error && (
        err.message.includes('socket connection was closed') ||
        err.message.includes('ECONNRESET') ||
        err.message.includes('ETIMEDOUT') ||
        err.message.includes('fetch failed') ||
        err.name === 'AbortError'
      );

      if ((is429 || isNetworkErr) && attempt < MAX_RETRIES) {
        const delay = Math.min(BASE_DELAY_MS * Math.pow(2, attempt - 1), 60_000);
        const jitter = Math.random() * 1000;
        const totalDelay = delay + jitter;
        const reason = is429 ? 'Rate limited (429)' : `Connection error (${err.message})`;
        logger.log(`  ${reason}, retrying in ${Math.round(totalDelay)}ms (attempt ${attempt}/${MAX_RETRIES})... ${color.gray(id)}`);
        await new Promise(resolve => setTimeout(resolve, totalDelay));
        continue;
      }
      throw err;
    }
  }

  throw new Error('Exceeded maximum retry attempts due to rate limiting');
}

/** 翻译文本（自动分段 + 并行执行各分段） */
async function translateText(text: string, sourceLang: string, targetLang: string, id = ''): Promise<string> {
  // 如果文本长度超过阈值，先分段
  if (text.length > MAX_CHUNK_SIZE) {
    logger.log(`  Content length (${text.length}) exceeds threshold (${MAX_CHUNK_SIZE}), splitting...`);

    // 第一步：按二级标题 ## 分割
    let chunks = splitBySection(text);

    // 第二步：对仍超过阈值的块，按段落进一步分割
    const finalChunks: string[] = [];
    for (const chunk of chunks) {
      if (chunk.length > MAX_CHUNK_SIZE) {
        finalChunks.push(...splitByParagraph(chunk));
      } else {
        finalChunks.push(chunk);
      }
    }

    const total = finalChunks.length;
    if (total >= 3 && finalChunks[total - 1].length + finalChunks[total - 2].length < MAX_CHUNK_SIZE) {
      finalChunks[total - 2] += finalChunks[total - 1];
      finalChunks.pop();
    }

    logger.log(`  Split into ${finalChunks.length} chunks, translating in parallel...`, finalChunks.map(c => c.length));

    // 并行翻译各块（结果保持顺序）
    const translatedResults = await Promise.all(
      finalChunks.map((chunk, i) => {
        const chunkId = `${id}#chunk${i + 1}/${finalChunks.length}`;
        let t = Date.now();
        logger.log(`  [${color.cyan(sourceLang)}->${color.green(targetLang)}]Translating chunk ${i + 1}/${finalChunks.length} (${color.green(chunk.length)} chars)... ${color.gray(chunkId)}`);
        return translateSingleChunk(chunk, sourceLang, targetLang, chunkId)
          .then(translated => {
            logger.log(`  -> [${color.cyan(sourceLang)}->${color.green(targetLang)}]Translated chunk ${i + 1}/${finalChunks.length} (${color.green(chunk.length)} chars) in ${color.magenta(Date.now() - t)}ms ${color.gray(chunkId)}`);
            return translated;
          });
      })
    );

    return translatedResults.join('\n\n');
  }

  return translateSingleChunk(text, sourceLang, targetLang, id);
}

// ---- File processing ----
async function translateFile(srcFile: string, sourceLang: string, targetLang: string, idx: number, total: number) {
  const srcFileRelative = relative(ROOT_DIR, srcFile)
  const destFile = srcFileRelative.replace(`docs${sep}${sourceLang}${sep}`, `docs${sep}${targetLang}${sep}`)
  const startTime = Date.now();
  const content = readFileSync(srcFile, 'utf-8')

  if (srcFileRelative === destFile) {
    logger.error(`${srcFileRelative}`, destFile)
    process.exit()
  }

  const srcMd5 = md5(content);
  const fileCacheKey = srcFile.replace(process.cwd(), '').replace(/\\/g, '/');

  // 源文件发生变更则更新 srcMd5，并删除已翻译的记录
  if (translateRecords[fileCacheKey]?.srcMd5 !== srcMd5) translateRecords[fileCacheKey] = { srcMd5 };

  // 目标文件已存在，根据 translateRecord 判断是否需要更新
  if (existsSync(destFile) && translateRecords[fileCacheKey]?.srcMd5 === srcMd5 && translateRecords[fileCacheKey][targetLang]) {
    if (options.debug) console.log(`- [${idx}/${total}][${color.gray(srcFile)} -> ${color.cyan(targetLang)}] already exists, skipping...`);
    return;
  }


  console.log(`- [${idx}/${total}][${color.yellow(content.length)} chars] Translating ${color.cyan(srcFile)} ${sourceLang} -> ${targetLang}(${color.gray(getLanguageDisplayName(targetLang))}`);
  let translatedContent = await translateText(content, sourceLang, targetLang, srcFileRelative);

  if (!translatedContent) {
    console.log(color.red(`- [${idx}/${total}] Translating ${color.cyan(srcFile)} failed!`));
    return;
  }

  // Ensure directory exists
  const targetDir = dirname(destFile);
  if (!existsSync(targetDir)) mkdirSync(targetDir, { recursive: true });

  // 如果是 json 文件，则解析为对象，然后再序列化为 json 字符串
  if (extname(srcFile) === '.json') {
    const json = JSON.parse(translatedContent.trim().replace(/^```json/, '').replace(/```$/, '').trim());
    translatedContent = JSON.stringify(json, null, 2);
  }

  writeFileSync(destFile, translatedContent, 'utf-8');
  translateRecords[fileCacheKey][targetLang] = md5(translatedContent);
  writeFileSync(RECORD_FILE, JSON.stringify(translateRecords, null, 2), 'utf-8');
  console.log(`  -> Translated to ${color.green(destFile)} [${color.gray(content.length)}->${color.gray(translatedContent.length)}]. Time Cost: ${color.yellow(Date.now() - startTime)}ms`);
}

/** 同步官方文档 */
async function syncDocs() {
  const cacheDir = join(process.cwd(), 'cache')
  const repoDir = join(cacheDir, 'OpenSpec')
  const sourceDocsDir = join(repoDir, 'docs')
  const targetDocsDir = join(ROOT_DIR, 'docs/en')

  logger.log('Starting docs sync...')

  if (existsSync(repoDir)) {
    logger.log('Repository exists, pulling latest changes...')
    try {
      execSync('git pull -r -n', { cwd: repoDir, stdio: 'inherit' });
    } catch {
      logger.log(color.yellow('git pull failed, trying git stash then pull...'))
      execSync('git stash && git pull -r', { cwd: repoDir, stdio: 'inherit' })
    }
  } else {
    logger.log('Cloning repository...')
    if (!existsSync(cacheDir)) mkdirSync(cacheDir, { recursive: true })
    execSync('git clone https://github.com/Fission-AI/OpenSpec.git', { cwd: cacheDir, stdio: 'inherit' })
  }

  if (!existsSync(sourceDocsDir)) {
    logger.error(`Source docs directory not found: ${sourceDocsDir}`)
    process.exit(1)
  }

  // 先删除目标目录，确保全量同步（避免孤儿文件残留）
  if (existsSync(targetDocsDir)) {
    rmSync(targetDocsDir, { recursive: true, force: true });
    logger.log(`Removed existing ${color.yellow(targetDocsDir)} for clean sync`);
  }

  const srcFiles = getAllMdFiles(sourceDocsDir);
  logger.log(`Copying ${color.yellow(sourceDocsDir)} to ${color.cyan(targetDocsDir)}. Found ${color.magenta(srcFiles.length)} files...`)
  console.log()
  for (const srcFile of srcFiles) {
    let destFile = srcFile.replace(sourceDocsDir, targetDocsDir)
    let content = readFileSync(srcFile, 'utf8').replaceAll('](docs/', '](').replaceAll('README.md', 'index.md')
    mkdirp(dirname(destFile));
    // 如果是 README.md 文件，则写入 index.md
    if (basename(srcFile) === 'README.md') {
      destFile = destFile.replace('README.md', 'index.md')
      content = `${INDEX_META}\n${content}`
    }

    writeFileSync(destFile, content, 'utf8');
  }

  logger.log(color.green('Docs sync completed!'));
}

// ---- Main ----
function getAllMdFiles(dirPath = 'docs'): string[] {
  const files: string[] = [];

  function scanDir(currentPath: string) {
    const items = readdirSync(currentPath);
    for (const item of items) {
      const fullPath = join(currentPath, item);
      const stat = statSync(fullPath);
      if (stat.isDirectory()) {
        // continue; // 只获取一级
        scanDir(fullPath);
      } else if (['.md', '.json'].includes(extname(fullPath))) {
        files.push(fullPath);
      }
    }
  }

  scanDir(dirPath);
  return files;
}

/** 清理多语言目录中的孤儿文件（对应 en 源文件已不存在） */
function cleanupOrphanFiles() {
  let deletedCount = 0;
  let recordsChanged = false;

  for (const key of Object.keys(translateRecords)) {
    // key 格式: "/docs/en/xxx.md"
    const enPath = join(ROOT_DIR, key.replace(/^\//, ''));

    // en 源文件仍存在，跳过
    if (existsSync(enPath)) continue;

    const record = translateRecords[key];

    // 删除各语言对应的翻译文件
    for (const lang of Object.keys(record).filter(k => k !== 'srcMd5')) {
      const targetPath = enPath.replace(`/en/`, `/${lang}/`);
      if (existsSync(targetPath)) {
        unlinkSync(targetPath);
        deletedCount++;
        logger.log(`  [cleanup] Deleted orphan: ${color.yellow(relative(ROOT_DIR, targetPath).replace(/\\/g, '/'))}`);
      }
    }

    // 删除记录
    delete translateRecords[key];
    recordsChanged = true;
    logger.log(`  [cleanup] Removed stale record: ${color.yellow(key)}`);
  }

  if (recordsChanged) {
    writeFileSync(RECORD_FILE, JSON.stringify(translateRecords, null, 2), 'utf-8');
  }

  if (deletedCount > 0 || recordsChanged) {
    logger.log(color.green(`Cleanup completed: ${deletedCount} orphan files deleted`));
  }
}

async function main(opts = options) {
  const { path: inputPath, sourceLang, targetLang, sync } = opts;

  // 前置：同步文档
  if (sync) await syncDocs();

  // 初始化 LLM 调度器（多 API key 支持）
  const clientConfigs = parseMultiKeyConfigs();
  scheduler = new TranslateScheduler(clientConfigs.map(c => new LLMClient(c)));

  // 验证语言代码
  if (!LANGUAGE_NAMES[sourceLang]) {
    logger.error(`Unsupported source language: ${color.red(sourceLang)}. Supported: ${SUPPORTED_LANGUAGES.join(', ')}`);
    process.exit(1);
  }

  const sourceLangDisplay = getLanguageDisplayName(sourceLang, true);
  let targetLangDisplay: string;

  if (targetLang === 'all') {
    targetLangDisplay = 'All Languages';
  } else {
    if (!LANGUAGE_NAMES[targetLang]) {
      logger.error(`Unsupported target language: ${color.red(targetLang)}. Supported: ${SUPPORTED_LANGUAGES.join(', ')}`);
      process.exit(1);
    }
    if (sourceLang === targetLang) {
      logger.error(`Source and target language cannot be the same: ${color.red(sourceLang)}`);
      process.exit(1);
    }
    targetLangDisplay = getLanguageDisplayName(targetLang);
  }

  logger.log(`Translation: ${color.cyan(sourceLangDisplay)} → ${color.green(targetLangDisplay)}`);

  if (!existsSync(inputPath)) {
    logger.error(`Path does not exist: ${color.red(inputPath)}`);
    process.exit(1);
  }

  const stat = statSync(inputPath);
  let filesToTranslate: string[];

  if (stat.isFile()) {
    if (!['.md', '.json'].includes(extname(inputPath))) {
      logger.error('Input file must be a .md or .json file');
      process.exit(1);
    }
    filesToTranslate = [inputPath];
  } else {
    filesToTranslate = getAllMdFiles(inputPath);
  }

  logger.log(`Found ${color.yellow(filesToTranslate.length)} files to translate`);
  logger.log(`Scheduler capacity: ${color.green(scheduler.totalCapacity)} concurrent requests`);

  // 收集所有待翻译任务
  const tasks: (() => Promise<void>)[] = [];

  if (targetLang === 'all') {
    // 扁平化：收集 文件数 × 语言数 的所有任务对
    const targetLangs = Object.keys(LANGUAGE_NAMES).filter(l => l !== sourceLang);
    logger.log(`Target languages: ${color.yellow(targetLangs.length)} → total tasks: ${color.yellow(filesToTranslate.length * targetLangs.length)}`);

    for (const lang of targetLangs) {
      let idx = 0;
      const total = filesToTranslate.length;
      for (const file of filesToTranslate) {
        const f = file;
        const l = lang;
        const i = ++idx;
        tasks.push(() => translateFile(f, sourceLang, l, i, total).catch(error => logger.error(`Error translating ${f} to ${l}:`, error)));
      }
    }
  } else {
    let current = 0;
    const total = filesToTranslate.length;
    for (const file of filesToTranslate) {
      tasks.push(() => translateFile(file, sourceLang, targetLang, ++current, total).catch(error => logger.error(`Error translating ${file}:`, error)));
    }
  }

  // 使用调度器的总并发能力执行所有任务
  const totalConcurrency = scheduler.totalCapacity;
  await concurrency(tasks, totalConcurrency);

  logger.log(color.greenBright('Translation completed!'));

  // 以 docs/en/ 为基准，清理多语言目录中的孤儿文件
  cleanupOrphanFiles();

  // 清理调度器
  scheduler.dispose();

  if (opts.build) await build();
}

main().catch(logger.error);

#!/usr/bin/env bun

import { Command } from 'commander';
import env from 'dotenv';
import { md5, NLogger, color, concurrency } from '@lzwme/fe-utils';
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync, cpSync, rmSync } from 'node:fs';
import { join, dirname, relative, extname, sep } from 'node:path';
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
  .description('Translate documentation files using LLM')
  .version('1.0.0')
  .requiredOption('-p, --path <path>', 'Path to file or directory to translate', 'docs/en')
  .option('-s, --source-lang <lang>', 'Source language (default: en)', 'en')
  .option('-t, --target-lang <lang>', 'Target language (e.g., zh-CN, ja, es, all)', 'all')
  .option('--timeout <ms>', 'Timeout in milliseconds. default: 300_000')
  .option('-c, --concurrency <thread>', 'Concurrency. default: 1', process.env.TRANSLATE_CONCURRENCY || '3')
  .option('-u, --base-url <url>', 'LLM base URL', process.env.OPENAI_BASE_URL || 'http://localhost:11434/v1')
  .option('-m, --model <model>', 'LLM model', process.env.TRANSLATE_OPENAI_MODEL || 'qwen3.5:latest')
  .option('-k, --api-key <key>', 'API key', process.env.OPENAI_API_KEY || '')
  .option('-B, --build', 'Build docs after translation', false)
  .option('-S, --sync', 'Sync docs from hermes-agent repository before translating', false)
  .option('-D, --debug', 'Debug mode')
  .addHelpText('after', `
Supported languages: ${SUPPORTED_LANGUAGES.join(', ')}

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
async function translateSingleChunk(content: string, sourceLang: string, targetLang: string): Promise<string> {
  const sourceLangDisplay = getLanguageDisplayName(sourceLang, true)
  const targetLangDisplay = getLanguageDisplayName(targetLang)

  const prompt = `You are a professional technical documentation translator.

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

## Text to translate:

${content}`

  const MAX_RETRIES = 10
  const BASE_DELAY_MS = 1000

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(`${options.baseUrl}/chat/completions`, {
        method: 'POST',
        verbose: options.debug,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${options.apiKey}`,
        },
        body: JSON.stringify({
          model: options.model,
          messages: [
            { role: 'user', content: prompt },
          ],
          temperature: 0.3,
        }),
      })

      if (response.ok) {
        const json = await response.json()
        return json.choices[0].message.content.trim()
      }

      if (response.status === 429 && attempt < MAX_RETRIES) {
        const delay = Math.min(BASE_DELAY_MS * Math.pow(2, attempt - 1), 60_000)
        const jitter = Math.random() * 1000
        const totalDelay = delay + jitter
        logger.log(`  Rate limited (429), retrying in ${Math.round(totalDelay)}ms (attempt ${attempt}/${MAX_RETRIES})...`)
        await new Promise(resolve => setTimeout(resolve, totalDelay))
        continue
      }

      const text = await response.text()
      throw new Error(`API error ${response.status}: ${text}`)
    } catch (err) {
      // 网络连接错误（如 socket 关闭）也视为临时故障进行重试
      if (attempt < MAX_RETRIES && err instanceof Error && (
        err.message.includes('socket connection was closed') ||
        err.message.includes('ECONNRESET') ||
        err.message.includes('ETIMEDOUT') ||
        err.message.includes('fetch failed')
      )) {
        const delay = Math.min(BASE_DELAY_MS * Math.pow(2, attempt - 1), 60_000)
        const jitter = Math.random() * 1000
        const totalDelay = delay + jitter
        logger.log(`  Connection error (${err.message}), retrying in ${Math.round(totalDelay)}ms (attempt ${attempt}/${MAX_RETRIES})...`)
        await new Promise(resolve => setTimeout(resolve, totalDelay))
        continue
      }
      throw err
    }
  }

  throw new Error('Exceeded maximum retry attempts due to rate limiting')
}

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

    const total = finalChunks.length
    if (total >= 3 && finalChunks[total - 1].length + finalChunks[total - 2].length < MAX_CHUNK_SIZE) {
      finalChunks[total - 2] += finalChunks[total - 1]
      finalChunks.pop()
    }

    logger.log(`  Split into ${finalChunks.length} chunks`, finalChunks.map(c => c.length));

    // 逐个翻译各块
    const translatedChunks: string[] = [];
    for (let i = 0; i < finalChunks.length; i++) {
      const chunk = finalChunks[i];
      logger.log(`  [${color.cyan(sourceLang)}->${color.green(targetLang)}]Translating chunk ${i + 1}/${finalChunks.length} (${color.green(chunk.length)} chars)... ${color.gray(id)}`);

      const translated = await translateSingleChunk(chunk, sourceLang, targetLang);
      translatedChunks.push(translated);
    }

    // 拼接翻译结果
    return translatedChunks.join('\n\n');
  }

  return translateSingleChunk(text, sourceLang, targetLang);
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
    console.log(`- [${idx}/${total}][${color.gray(srcFile)} -> ${color.cyan(targetLang)}] already exists, skipping...`);
    return;
  }


  console.log(`- [${idx}/${total}][${color.yellow(content.length)} chars] Translating ${color.cyan(srcFile)} ${sourceLang} -> ${targetLang}`);
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

  const srcFiles = getAllMdFiles(sourceDocsDir);
  logger.log(`Copying ${color.yellow(sourceDocsDir)} to ${color.cyan(targetDocsDir)}. Found ${color.magenta(srcFiles.length)} files...`)
  // cpSync(sourceDocsDir, sourceDocsDir, { force: true, recursive: true });
  console.log()
  for (const srcFile of srcFiles) {
    const destFile = srcFile.replace(sourceDocsDir, targetDocsDir)
    let content = readFileSync(srcFile, 'utf8').replaceAll('](docs/', '](').replace('../README.md', 'index.md')
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
        continue; // 只获取一级
        // scanDir(fullPath);
      } else if (['.md', '.json'].includes(extname(fullPath))) {
        files.push(fullPath);
      }
    }
  }

  scanDir(dirPath);
  return files;
}

async function main(opts = options) {
  const { path: inputPath, sourceLang, targetLang, concurrency: threads = 1, sync } = opts;

  // 前置：同步文档
  if (sync) await syncDocs();

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
      logger.error('Input file must be a .md file');
      process.exit(1);
    }
    filesToTranslate = [inputPath];
  } else {
    filesToTranslate = getAllMdFiles(inputPath);
  }

  logger.log(`Found ${color.yellow(filesToTranslate.length)} files to translate`);
  logger.log(`Use Model: ${color.green(opts.model)}`);

  const tasks: (() => Promise<void>)[] = [];

  if (targetLang === 'all') {
    // 扁平化：收集 文件数 × 语言数 的所有任务对，最大化并发
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

  await concurrency(tasks, Number(threads));

  logger.log(color.greenBright('Translation completed!'));

  if (opts.build) await build();
}

main().catch(logger.error);

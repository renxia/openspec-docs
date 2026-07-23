/**
 * 文档构建
 * 1. 执行 `npm run build`，产出 `build` 目录
 * 2. 重命名 build 目录为 dist/${RELEASE_NAME} 目录
 * 3. 复制 static/_index.html 到 dist/${RELEASE_NAME} 目录
 * 4. 进入 dist 目录，使用 zip 命令压缩 ${RELEASE_NAME} 为 ${RELEASE_NAME}.zip
 */

import {  existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';

const RELEASE_NAME = 'openspec';

const rootDir = process.cwd();
// const outputDir = join(rootDir, 'docs/.vitepress/dist');
const releaseDir = join(rootDir, 'dist/docs');

function build() {
  const zipFileName = `${RELEASE_NAME}.zip`;
  let setp = 1;

  // Step 1: 执行 build，产出 build 目录
  console.log(`[step ${setp++}] 执行 build...`);
  execSync('npm run build', { stdio: 'inherit', cwd: rootDir, windowsHide: true });

  const targetDir = join(releaseDir, RELEASE_NAME);
  if (!existsSync(targetDir)) {
    console.error(`构建失败，请检查构建产物目录 ${targetDir} 是否存在`)
    process.exit(1);
  }

  // Step 2: 进入 dist 目录，压缩 ${RELEASE_NAME} 为 ${RELEASE_NAME}.zip
  console.log(`[setp ${setp++}] 压缩为 ${RELEASE_NAME}.zip...`);
  const zipPath = join(releaseDir, zipFileName);
  if (existsSync(zipPath)) {
    rmSync(zipPath, { force: true });
  }
  execSync(`zip -r -q ${zipFileName} ${RELEASE_NAME}`, { stdio: 'inherit', cwd: releaseDir, windowsHide: true });

  console.log(`\n构建完成！产出文件：${zipPath}`);
}

export default build;

if (import.meta.main) build();


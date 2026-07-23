# 문제 해결

구체적인 문제에 대한 구체적인 해결책입니다. 각 항목은 증상을 명시하고, 한 문장으로 원인을 설명한 후 해결 방법을 제시합니다. 여기에 원하는 문제가 없다면 [FAQ](faq.md)에서 도움을 얻을 수 있고, [Discord](https://discord.gg/YctCnvvshC)에서도 확실히 도움을 받을 수 있습니다.

## 설치 및 설정

### `openspec: command not found`

CLI가 설치되지 않았거나 셸에서 해당 명령을 찾을 수 없는 상태입니다. 전역으로 설치한 후 확인하세요:

```bash
npm install -g @fission-ai/openspec@latest
openspec --version
```

설치했는데도 여전히 찾을 수 없다면 전역 npm bin 디렉터리가 `PATH`에 등록되지 않았을 가능성이 높습니다. `npm bin -g` 명령으로 전역 바이너리가 설치된 경로를 확인한 후, 해당 경로가 셸 프로필에 포함되어 있는지 확인하세요.

### "Requires Node.js 20.19.0 or higher"

OpenSpec는 Node.js 20.19.0 이상에서 실행됩니다. 버전을 확인한 후 필요시 업그레이드하세요:

```bash
node --version
```

bun으로 OpenSpec를 설치하는 경우에도 OpenSpec는 여전히 Node.js 환경에서 실행되므로, `PATH`에 Node.js 20.19.0 이상이 등록되어 있어야 합니다. 자세한 내용은 [설치](installation.md) 문서를 참고하세요.

### `openspec init` didn't configure my AI tool

초기화 과정에서 설정할 도구를 선택합니다. 원하는 도구를 건너뛰었거나 다른 도구를 추가하려면 다시 실행하거나 비대화형 모드를 사용하세요:

```bash
openspec init --tools claude,cursor
```

지원 도구의 전체 ID 목록은 [지원 도구](supported-tools.md) 문서에서 확인할 수 있습니다. `--tools all`로 모든 도구를 설정하고, `--tools none`으로 도구 설정을 건너뛸 수 있습니다.

## 명령어가 표시되지 않을 때

`/opsx:propose`(또는 사용 중인 도구의 해당 명령)가 표시되지 않거나 작동하지 않는 경우 아래 목록을 순서대로 확인하세요. 가장 빠르게 확인할 수 있는 항목부터 정렬되어 있습니다.

1. **잘못된 위치에서 사용하고 있을 수 있습니다.** 슬래시 명령은 AI 어시스턴트 채팅에서 사용해야 하며 터미널에서 사용할 수 없습니다. 셸에 `/opsx:propose`를 입력했다면 이것이 원인입니다. 자세한 내용은 [명령어 작동 방식](how-commands-work.md) 문서를 참고하세요.

2. **파일을 다시 생성하세요.** 프로젝트 루트 디렉터리에서 다음 명령을 실행하세요:
   ```bash
   openspec update
   ```
   이 명령은 설정한 모든 도구의 스킬과 명령 파일을 다시 작성합니다.

3. **어시스턴트를 재시작하세요.** 대부분의 도구는 시작 시 스킬과 명령을 스캔하므로 새 창을 열면 해결되는 경우가 많습니다.

4. **파일이 존재하는지 확인하세요.** Claude Code의 경우 `.claude/skills/` 디렉터리에 `openspec-*` 폴더가 포함되어 있는지 확인하세요. 다른 도구는 각자의 디렉터리를 사용하며, 전체 목록은 [지원 도구](supported-tools.md)에서 확인할 수 있습니다.

5. **프로젝트 초기화를 진행했는지 확인하세요.** 스킬은 프로젝트별로 작성됩니다. 저장소를 클론했거나 폴더를 이동한 경우 해당 위치에서 `openspec init`(또는 `openspec update`) 명령을 실행하세요.

6. **사용 중인 도구가 명령 파일을 지원하는지 확인하세요.** Codex와 일부 다른 도구(CodeArts, Kimi CLI, ForgeCode, Mistral Vibe)는 `opsx-*` 명령 파일이 생성되지 않고 스킬 기반 호출 방식을 사용합니다. Codex의 경우 `.codex/skills/openspec-*` 디렉터리를 확인하세요. 도구별 사용 방식이 다르므로 [지원 도구](supported-tools.md)와 [명령어 작동 방식](how-commands-work.md#slash-command-syntax-by-tool) 문서를 참고하세요.

## 변경 사항 작업하기

### "Change not found"

명령이 지정한 변경 사항을 식별할 수 없습니다. 변경 사항 이름을 명시적으로 지정하거나, 존재하는 변경 사항을 확인하세요:

```bash
openspec list                    # 활성 변경 사항 확인
/opsx:apply add-dark-mode        # 채팅에서 변경 사항 이름 지정
```

또한 올바른 프로젝트 디렉터리에 위치해 있는지 확인하세요.

### "No artifacts ready"

모든 아티팩트는 이미 생성되었거나 의존성 대기로 차단된 상태입니다. 차단 원인을 확인하세요:

```bash
openspec status --change <name>
```

먼저 누락된 의존성을 생성하세요. 순서를 기억하세요: 제안(proposal)이 명세(specs)와 설계(design)를 활성화하고, 명세와 설계가 모두 완료되어야 작업(tasks)을 활성화할 수 있습니다.

### `openspec validate` reports warnings or errors

검증(validate) 명령은 명세와 변경 사항의 구조적 문제를 확인합니다. 출력 메시지에 문제가 발생한 파일과 구체적인 이슈가 명시되어 있으니 확인하세요:

```bash
openspec validate <name>           # 단일 항목 검증
openspec validate --all            # 전체 항목 검증
openspec validate --all --strict   # 엄격한 검증, CI에 적합
```

대표적인 원인으로는 필수 섹션 누락(예: 시나리오가 없는 명세)이나 잘못된 델타 헤더가 있습니다. 파일을 수정한 후 명령을 다시 실행하세요. 출력 형식은 [CLI 참고 문서](cli.md#openspec-validate)에서 확인할 수 있습니다.

### The AI created incomplete or wrong artifacts

AI가 충분한 컨텍스트를 갖지 못해 아티팩트가 불완전하거나 잘못 생성된 경우입니다. 아래 방법으로 개선할 수 있습니다:
- `openspec/config.yaml`에 프로젝트 컨텍스트를 추가하면 스택과 규약이 모든 요청에 자동으로 주입됩니다. 자세한 내용은 [커스터마이징](customization.md#project-configuration) 문서를 참고하세요.
- 아티팩트별 `rules:`를 추가하여 명세 등 특정 아티팩트에만 적용되는 가이드라인을 설정할 수 있습니다.
- 제안(propose) 단계에서 더 상세한 설명을 작성하세요.
- 한 번에 모든 아티팩트를 생성하는 `/opsx:ff` 대신 확장된 `/opsx:continue` 명령을 사용하여 아티팩트를 하나씩 생성하고 검토하세요.

### Archive won't finish, or warns about incomplete tasks

아카이브(archive)는 미완료 작업으로 인해 실행을 차단하지는 않지만, 보통 아카이브는 작업이 완료된 상태에서 실행하는 것이 일반적이므로 경고 메시지를 표시합니다. 의도적으로 작업을 남겨두는 경우(부분 변경 사항을 제출하는 경우)에는 그대로 진행하세요. 그렇지 않다면 먼저 작업을 완료하세요. 아직 델타 명세를 메인 명세와 동기화하지 않은 경우 아카이브 과정에서 동기화를 제안합니다. 특별한 이유가 없다면 동기화를 진행하세요.

## 설정

### My `config.yaml` isn't being applied

대표적인 원인 3가지입니다:
1. **파일명이 잘못되었습니다.** 파일명은 `.yml`이 아닌 `openspec/config.yaml`이어야 합니다.
2. **YAML 형식이 올바르지 않습니다.** YAML 검사 도구로 형식을 확인하세요. CLI도 줄 번호와 함께 구문 오류를 보고합니다.
3. **재시작이 필요할 것으로 예상하셨나요?** 재시작이 필요 없습니다. 설정 변경은 즉시 적용됩니다.

### "Unknown artifact ID in rules: X"

`rules:` 아래의 키가 스키마에 정의된 아티팩트와 일치하지 않을 때 발생하는 오류입니다. 기본 `spec-driven` 스키마에서 유효한 ID는 `proposal`, `specs`, `design`, `tasks`입니다. 다른 스키마의 ID를 확인하려면 다음 명령을 실행하세요:

```bash
openspec schemas --json
```

### "Context too large"

`context:` 필드는 모든 요청에 주입되기 때문에 의도적으로 50KB로 용량이 제한되어 있습니다. 긴 문서는 붙여넣기 대신 요약하거나 링크로 연결하세요. 간결한 컨텍스트는 더 좋고 빠른 결과를 만들어냅니다.

### "Schema not found"

참조한 스키마 이름이 존재하지 않을 때 발생하는 오류입니다. 사용 가능한 스키마를 목록으로 확인하고 철자를 확인하세요:

```bash
openspec schemas                    # 사용 가능한 스키마 목록
openspec schema which <name>        # 스키마가 참조되는 위치 확인
openspec schema init <name>         # 커스텀 스키마 생성
```

자세한 내용은 [커스터마이징](customization.md#custom-schemas) 문서를 참고하세요.

## 기존 워크플로우에서 마이그레이션하기

### "Legacy files detected in non-interactive mode"

CI 환경이나 비대화형 셸에서 실행 중이며, OpenSpec가 정리할 기존 파일을 발견했지만 사용자 확인을 받을 수 없는 상태입니다. 자동으로 승인하려면 다음 명령을 실행하세요:

```bash
openspec init --force
```

Codex의 경우 OpenSpec가 `$CODEX_HOME/prompts`나 `~/.codex/prompts` 디렉터리에 있는 기존 관리형 프롬프트 파일을 감지할 수 있습니다. 해당 정리 작업은 OpenSpec의 허용 목록에 등록된 기존 Codex 프롬프트 파일명으로 제한되며, 비대화형 모드에서 실행한 `openspec init`은 대체 파일인 `.codex/skills/openspec-*` 스킬이 존재하는 파일만 삭제합니다. `--force` 옵션을 전달하지 않는 한 비대화형 모드의 `openspec update`는 기존 파일 정리 작업을 수행하지 않습니다.

### Commands didn't appear after migrating

IDE를 재시작하세요. 스킬은 시작 시 감지됩니다. 그래도 표시되지 않는다면 `openspec update` 명령을 실행한 후 [지원 도구](supported-tools.md) 문서에서 파일 위치를 확인하세요.

### My old `project.md` wasn't migrated

이것은 의도적인 동작입니다. OpenSpec는 사용자가 작성한 컨텍스트가 포함될 수 있으므로 `project.md` 파일을 자동으로 삭제하지 않습니다. 유용한 부분을 `config.yaml`의 `context:` 섹션으로 옮긴 후 직접 파일을 삭제하세요. 이 과정에 대한 상세 안내는 [마이그레이션 가이드](migration-guide.md#migrating-projectmd-to-configyaml)에서 확인할 수 있으며, AI에게 컨텍스트 추출을 요청할 수 있는 프롬프트도 포함되어 있습니다.

## 여전히 문제가 해결되지 않나요?

- **Discord:** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues:** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **터미널에서:** `openspec feedback "문제가 발생한 내용"` 명령을 실행하면 이슈를 자동으로 생성해줍니다.

문제를 보고할 때는 OpenSpec 버전(`openspec --version`), Node.js 버전(`node --version`), 사용 중인 AI 도구, 실행한 명령과 출력 결과를 함께 포함해주세요. 더 빠르게 문제를 해결할 수 있습니다.
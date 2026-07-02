# 문제 해결

명확한 문제에 대한 확실한 해결책입니다. 각 항목은 증상을 명시하고, 한 문장으로 발생 가능한 원인을 설명하며, 해결 방법을 제시합니다. 여기서 문제를 찾지 못했다면 [FAQ](faq.md)가 도움이 될 수 있으며, [Discord](https://discord.gg/YctCnvvshC)는 확실히 도움을 줄 것입니다.

## 설치 및 설정

### `openspec: command not found`

CLI가 설치되지 않았거나 셸에서 찾을 수 없는 경우입니다. 전역으로 설치하고 확인하십시오:

```bash
npm install -g @fission-ai/openspec@latest
openspec --version
```

설치되었지만 여전히 찾을 수 없다면, 글로벌 npm bin 디렉토리가 `PATH`에 포함되어 있지 않을 가능성이 높습니다. `npm bin -g`를 실행하여 전역 바이너리(global binaries)가 어디에 있는지 확인하고 해당 경로가 셸 프로필드에 있는지 확인하십시오.

### "Requires Node.js 20.19.0 or higher"

OpenSpec은 Node 20.19.0 이상에서 실행됩니다. 버전을 확인하고 필요한 경우 업그레이드하십시오:

```bash
node --version
```

bun을 사용하여 OpenSpec을 설치하는 경우, OpenSpec이 여전히 Node에서 *실행*되므로, 어떤 경우든 `PATH`에 Node 20.19.0 이상이 제공되어야 함을 유념하십시오. [Installation](installation.md)을 참조하십시오.

### `openspec init`이 제 AI 도구를 설정하지 않았습니다

Init은 어떤 도구를 설정할지 묻습니다. 도구를 건너뛰었거나 다른 도구를 추가하고 싶다면 다시 실행하거나 비대화형(non-interactive) 양식을 사용하십시오:

```bash
openspec init --tools claude,cursor
```

모든 도구 ID 목록은 [Supported Tools](supported-tools.md)에 있습니다. 모든 것을 원하면 `--tools all`을, 도구 설정을 건너뛰려면 `--tools none`을 사용하십시오.

## 명령어가 나타나지 않습니다

만약 `/opsx:propose` (또는 사용 중인 도구의 해당 명령어)가 나타나지 않거나 아무런 동작을 하지 않는다면, 이 목록을 순서대로 확인하십시오. 순서는 가장 빨리 확인할 수 있는 것부터입니다.

1. **잘못된 위치에 있을 수 있습니다.** 슬래시 명령어는 터미널이 아닌 AI 어시스턴트의 채팅창에 입력해야 합니다. 셸(shell)에 `/opsx:propose`를 입력했다면 그것이 문제입니다. [How Commands Work](how-commands-work.md)를 참조하십시오.

2. **파일을 재생성합니다.** 프로젝트 루트에서:

   ```bash
   openspec update
   ```

   이는 구성한 모든 도구에 대한 스킬 및 명령어 파일을 다시 작성(rewrite)합니다.

3. **어시스턴트를 재시작합니다.** 대부분의 도구는 시작 시 스킬과 명령어를 스캔합니다. 새 창을 여는 것이 종종 이 문제를 해결해 줍니다.

4. **파일이 존재하는지 확인합니다.** Claude Code의 경우, `.claude/skills/`에 `openspec-*` 폴더가 포함되어 있는지 확인하십시오. 다른 도구들은 자체 디렉토리를 사용하며, 모두 [Supported Tools](supported-tools.md)에 나열되어 있습니다.

5. **이 프로젝트를 초기화했는지 확인합니다.** 스킬은 프로젝트별로 작성됩니다. 리포지토리(repo)를 클론하거나 폴더를 변경했다면 해당 위치에서 `openspec init` (또는 `openspec update`)을 실행하십시오.

6. **도구가 명령어 파일을 지원하는지 확인합니다.** 일부 도구(Kimi CLI, Trae, ForgeCode, Mistral Vibe)는 `opsx-*` 명령어 파일이 생성되지 않으며, 대신 스킬 기반 호출을 사용합니다. 각 도구별 양식이 다르므로 [Supported Tools](supported-tools.md)와 [How Commands Work](how-commands-work.md#slash-command-syntax-by-tool)를 참조하십시오.

## 변경 사항 작업하기

### "Change not found"

명령어가 어떤 변경 사항을 의미하는지 알 수 없었습니다. 명시적으로 이름을 지정하거나 존재하는 항목을 확인하십시오:

```bash
openspec list                    # 활성 변경 사항 보기
/opsx:apply add-dark-mode        # 채팅에서 변경 사항 이름 지정
```

또한 올바른 프로젝트 디렉토리에 있는지 확인하십시오.

### "No artifacts ready"

모든 아티팩트(artifact)는 이미 생성되었거나 종속성(dependency)을 기다리며 차단되어 있습니다. 무엇이 막고 있는지 확인하십시오:

```bash
openspec status --change <name>
```

그런 다음 누락된 종속성을 먼저 생성하십시오. 순서를 기억하십시오: proposal은 specs와 design을 활성화하고, specs와 design은 함께 tasks를 활성화합니다.

### `openspec validate`가 경고 또는 오류를 보고합니다

유효성 검사(Validation)는 구조적 문제를 위해 스펙과 변경 사항을 확인합니다. 메시지를 읽으십시오: 파일명과 이슈를 명시하고 있습니다.

```bash
openspec validate <name>           # 항목 하나 유효성 검사
openspec validate --all            # 모든 항목 유효성 검사
openspec validate --all --strict   # 더 엄격한 검사, CI에 유용함
```

일반적인 원인은 필수 섹션 누락(예: 시나리오가 없는 spec) 또는 잘못 구성된 delta 헤더입니다. 파일을 수정하고 다시 실행하십시오. [CLI reference](cli.md#openspec-validate)에 출력 형식이 문서화되어 있습니다.

### AI가 불완전하거나 잘못된 아티팩트를 생성했습니다

AI에게 충분한 컨텍스트(context)를 제공하지 못했을 수 있습니다. 몇 가지 방법이 도움이 될 수 있습니다:

- `openspec/config.yaml`에 프로젝트 컨텍스트를 추가하여 스택과 관례가 모든 요청에 주입되도록 하십시오. [Customization](customization.md#project-configuration)을 참조하십시오.
- 특정 섹션(예: specs)에만 적용되는 지침을 위해 아티팩트별 `rules:`를 추가하십시오.
- 제안할 때 더 자세한 설명을 제공하십시오.
- 모든 것을 한 번에 처리하는 `/opsx:ff` 대신, 하나씩 생성하고 각 항목을 검토하기 위해 확장된 `/opsx:continue`를 사용하십시오.

### Archive가 완료되지 않거나 불완전한 작업에 대해 경고합니다

Archive는 불완전한 작업을 *차단하지* 않지만, 일반적으로 아카이빙(archiving)은 작업이 완료되었음을 의미하므로 경고를 표시합니다. 의도적으로 작업이 남아있는 경우(부분적인 변경 사항을 제출하는 경우) 계속 진행하십시오. 그렇지 않은 경우 먼저 작업을 완료하십시오. Archive는 아직 동기화하지 않았다면 delta specs를 메인 스펙으로 동기화할지 제안할 것입니다. 특별한 이유가 없다면 예라고 답하십시오.

## 구성

### 제 `config.yaml`이 적용되지 않습니다

세 가지 일반적인 용의자(suspect)가 있습니다:

1. **잘못된 파일 이름.** 반드시 `openspec/config.yaml`이어야 하며, `.yml`이어서는 안 됩니다.
2. **유효하지 않은 YAML.** 모든 YAML 검증기(validator)를 통해 실행해 보십시오. CLI도 줄 번호와 함께 구문 오류를 보고합니다.
3. **재시작을 기대했습니다.** 재시작할 필요가 없습니다. 구성 변경 사항은 즉시 적용됩니다.

### "Unknown artifact ID in rules: X"

`rules:` 아래의 키가 스키마에 있는 어떤 아티팩트와도 일치하지 않습니다. 기본 `spec-driven` 스키마에서 유효한 ID는 `proposal`, `specs`, `design`, `tasks`입니다. 모든 스키마의 ID를 보려면:

```bash
openspec schemas --json
```

### "Context too large"

`context:` 필드는 모든 요청에 주입되기 때문에 의도적으로 50KB로 제한됩니다. 요약하거나 붙여넣는 대신 더 긴 문서를 링크하십시오. 간결한 컨텍스트가 더 좋고 빠른 결과를 생성합니다.

### "Schema not found"

참조한 스키마 이름이 존재하지 않습니다. 사용 가능한 항목을 나열하고 철자를 확인하십시오:

```bash
openspec schemas                    # 사용 가능한 스키마 목록 보기
openspec schema which <name>        # 스키마가 어디에서 해결되는지 보기
openspec schema init <name>         # 사용자 지정 스키마 생성
```

[Customization](customization.md#custom-schemas)을 참조하십시오.

## 레거시 워크플로우에서 마이그레이션

### "Legacy files detected in non-interactive mode"

CI 또는 비대화형 셸(shell)에 있으며, OpenSpec이 정리할 오래된 파일을 찾았지만 사용자에게 프롬프트를 제공할 수 없습니다. 자동으로 승인합니다:

```bash
openspec init --force
```

### 마이그레이션 후에도 명령어가 나타나지 않습니다

IDE를 재시작하십시오. 스킬은 시작 시 감지됩니다. 여전히 나타나지 않는다면 `openspec update`을 실행하고 [Supported Tools](supported-tools.md)에서 파일 위치를 확인하십시오.

### 제 오래된 `project.md`가 마이그레이션되지 않았습니다

이는 의도된 사항입니다. OpenSpec은 사용자가 작성한 컨텍스트를 담고 있을 수 있으므로 `project.md`를 자동으로 삭제하지 않습니다. 유용한 부분을 `config.yaml`의 `context:` 섹션으로 옮긴 다음 직접 삭제하십시오. [Migration Guide](migration-guide.md#migrating-projectmd-to-configyaml)는 AI에게 전달하여 정수(distilling) 작업을 수행할 수 있는 프롬프트를 포함하여 이 과정을 안내합니다.

## 여전히 막혀 있나요?

- **Discord:** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues:** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **터미널에서:** `openspec feedback "what went wrong"`을 실행하면 이슈가 생성됩니다.

문제를 보고할 때는 OpenSpec 버전 (`openspec --version`), Node 버전 (`node --version`), AI 도구, 그리고 정확한 명령어와 출력을 포함하십시오. 그러면 도움을 받는 과정이 훨씬 빨라집니다.
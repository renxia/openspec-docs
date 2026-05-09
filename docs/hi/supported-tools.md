# समर्थित उपकरण

OpenSpec कई AI कोडिंग सहायकों के साथ काम करता है। जब आप `openspec init` चलाते हैं, तो OpenSpec आपकी सक्रिय प्रोफ़ाइल/कार्यप्रवाह चयन और वितरण मोड का उपयोग करके चयनित उपकरणों को कॉन्फ़िगर करता है।

## यह कैसे काम करता है

प्रत्येक चयनित उपकरण के लिए, OpenSpec इंस्टॉल कर सकता है:

1. **कौशल** (यदि वितरण में कौशल शामिल हैं): `.../skills/openspec-*/SKILL.md`
2. **कमांड** (यदि वितरण में कमांड शामिल हैं): उपकरण-विशिष्ट `opsx-*` कमांड फ़ाइलें

डिफ़ॉल्ट रूप से, OpenSpec `core` प्रोफ़ाइल का उपयोग करता है, जिसमें शामिल हैं:
- `propose`
- `explore`
- `apply`
- `sync`
- `archive`

आप `openspec config profile` के माध्यम से विस्तारित कार्यप्रवाह (`new`, `continue`, `ff`, `verify`, `bulk-archive`, `onboard`) सक्षम कर सकते हैं, फिर `openspec update` चलाएं।

## उपकरण निर्देशिका संदर्भ

| उपकरण (ID) | कौशल पथ पैटर्न | कमांड पथ पैटर्न |
|-----------|---------------------|----------------------|
| Amazon Q Developer (`amazon-q`) | `.amazonq/skills/openspec-*/SKILL.md` | `.amazonq/prompts/opsx-<id>.md` |
| Antigravity (`antigravity`) | `.agent/skills/openspec-*/SKILL.md` | `.agent/workflows/opsx-<id>.md` |
| Auggie (`auggie`) | `.augment/skills/openspec-*/SKILL.md` | `.augment/commands/opsx-<id>.md` |
| IBM Bob Shell (`bob`) | `.bob/skills/openspec-*/SKILL.md` | `.bob/commands/opsx-<id>.md` |
| Claude Code (`claude`) | `.claude/skills/openspec-*/SKILL.md` | `.claude/commands/opsx/<id>.md` |
| Cline (`cline`) | `.cline/skills/openspec-*/SKILL.md` | `.clinerules/workflows/opsx-<id>.md` |
| CodeBuddy (`codebuddy`) | `.codebuddy/skills/openspec-*/SKILL.md` | `.codebuddy/commands/opsx/<id>.md` |
| Codex (`codex`) | `.codex/skills/openspec-*/SKILL.md` | `$CODEX_HOME/prompts/opsx-<id>.md`\* |
| ForgeCode (`forgecode`) | `.forge/skills/openspec-*/SKILL.md` | उत्पन्न नहीं होता (कोई कमांड एडाप्टर नहीं; कौशल-आधारित `/openspec-*` आह्वान का उपयोग करें) |
| Continue (`continue`) | `.continue/skills/openspec-*/SKILL.md` | `.continue/prompts/opsx-<id>.prompt` |
| CoStrict (`costrict`) | `.cospec/skills/openspec-*/SKILL.md` | `.cospec/openspec/commands/opsx-<id>.md` |
| Crush (`crush`) | `.crush/skills/openspec-*/SKILL.md` | `.crush/commands/opsx/<id>.md` |
| Cursor (`cursor`) | `.cursor/skills/openspec-*/SKILL.md` | `.cursor/commands/opsx-<id>.md` |
| Factory Droid (`factory`) | `.factory/skills/openspec-*/SKILL.md` | `.factory/commands/opsx-<id>.md` |
| Gemini CLI (`gemini`) | `.gemini/skills/openspec-*/SKILL.md` | `.gemini/commands/opsx/<id>.toml` |
| GitHub Copilot (`github-copilot`) | `.github/skills/openspec-*/SKILL.md` | `.github/prompts/opsx-<id>.prompt.md`\*\* |
| iFlow (`iflow`) | `.iflow/skills/openspec-*/SKILL.md` | `.iflow/commands/opsx-<id>.md` |
| Junie (`junie`) | `.junie/skills/openspec-*/SKILL.md` | `.junie/commands/opsx-<id>.md` |
| Kilo Code (`kilocode`) | `.kilocode/skills/openspec-*/SKILL.md` | `.kilocode/workflows/opsx-<id>.md` |
| Kimi CLI (`kimi`) | `.kimi/skills/openspec-*/SKILL.md` | उत्पन्न नहीं होता (कोई कमांड एडाप्टर नहीं; कौशल-आधारित `/skill:openspec-*` आह्वान का उपयोग करें) |
| Kiro (`kiro`) | `.kiro/skills/openspec-*/SKILL.md` | `.kiro/prompts/opsx-<id>.prompt.md` |
| Lingma (`lingma`) | `.lingma/skills/openspec-*/SKILL.md` | `.lingma/commands/opsx/<id>.md` |
| OpenCode (`opencode`) | `.opencode/skills/openspec-*/SKILL.md` | `.opencode/commands/opsx-<id>.md` |
| Pi (`pi`) | `.pi/skills/openspec-*/SKILL.md` | `.pi/prompts/opsx-<id>.md` |
| Qoder (`qoder`) | `.qoder/skills/openspec-*/SKILL.md` | `.qoder/commands/opsx/<id>.md` |
| Qwen Code (`qwen`) | `.qwen/skills/openspec-*/SKILL.md` | `.qwen/commands/opsx-<id>.toml` |
| RooCode (`roocode`) | `.roo/skills/openspec-*/SKILL.md` | `.roo/commands/opsx-<id>.md` |
| Trae (`trae`) | `.trae/skills/openspec-*/SKILL.md` | उत्पन्न नहीं होता (कोई कमांड एडाप्टर नहीं; कौशल-आधारित `/openspec-*` आह्वान का उपयोग करें) |
| Windsurf (`windsurf`) | `.windsurf/skills/openspec-*/SKILL.md` | `.windsurf/workflows/opsx-<id>.md` |

\* Codex कमांड वैश्विक Codex होम (`$CODEX_HOME/prompts/` यदि सेट है, अन्यथा `~/.codex/prompts/`) में इंस्टॉल होती हैं, आपकी प्रोजेक्ट निर्देशिका में नहीं।

\*\* GitHub Copilot प्रॉम्प्ट फ़ाइलों को IDE एक्सटेंशन (VS Code, JetBrains, Visual Studio) में कस्टम स्लैश कमांड के रूप में पहचाना जाता है। Copilot CLI वर्तमान में `.github/prompts/*.prompt.md` को सीधे उपभोग नहीं करता है।

## गैर-इंटरैक्टिव सेटअप

CI/CD या स्क्रिप्टेड सेटअप के लिए, `--tools` (और वैकल्पिक रूप से `--profile`) का उपयोग करें:

```bash
# विशिष्ट उपकरण कॉन्फ़िगर करें
openspec init --tools claude,cursor

# सभी समर्थित उपकरण कॉन्फ़िगर करें
openspec init --tools all

# उपकरण कॉन्फ़िगरेशन छोड़ें
openspec init --tools none

# इस init रन के लिए प्रोफ़ाइल ओवरराइड करें
openspec init --profile core
```

**उपलब्ध उपकरण ID (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `opencode`, `pi`, `qoder`, `lingma`, `qwen`, `roocode`, `trae`, `windsurf`

## कार्यप्रवाह-निर्भर इंस्टॉलेशन

OpenSpec चयनित कार्यप्रवाहों के आधार पर कार्यप्रवाह आर्टिफैक्ट्स इंस्टॉल करता है:

- **कोर प्रोफ़ाइल (डिफ़ॉल्ट):** `propose`, `explore`, `apply`, `sync`, `archive`
- **कस्टम चयन:** सभी कार्यप्रवाह ID का कोई भी उपसमूह:
  `propose`, `explore`, `new`, `continue`, `apply`, `ff`, `sync`, `archive`, `bulk-archive`, `verify`, `onboard`

दूसरे शब्दों में, कौशल/कमांड की संख्या प्रोफ़ाइल-निर्भर और वितरण-निर्भर है, निश्चित नहीं।

## उत्पन्न कौशल नाम

जब प्रोफ़ाइल/कार्यप्रवाह कॉन्फ़िगरेशन द्वारा चयनित किया जाता है, तो OpenSpec ये कौशल उत्पन्न करता है:

- `openspec-propose`
- `openspec-explore`
- `openspec-new-change`
- `openspec-continue-change`
- `openspec-apply-change`
- `openspec-ff-change`
- `openspec-sync-specs`
- `openspec-archive-change`
- `openspec-bulk-archive-change`
- `openspec-verify-change`
- `openspec-onboard`

कमांड व्यवहार के लिए [Commands](commands.md) और `init`/`update` विकल्पों के लिए [CLI](cli.md) देखें।

## संबंधित

- [CLI संदर्भ](cli.md) — टर्मिनल कमांड
- [कमांड](commands.md) — स्लैश कमांड और कौशल
- [शुरू करना](getting-started.md) — पहली बार सेटअप
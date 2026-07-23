# समर्थित टूल्स

OpenSpec कई AI कोडिंग सहायकों के साथ काम करता है। जब आप `openspec init` चलाते हैं, तो OpenSpec अपनी सक्रिय प्रोफाइल/वर्कफ़्लो चयन और डिलीवरी मोड का उपयोग करके चुने गए टूल्स को कॉन्फ़िगर करता है।

## यह कैसे काम करता है

प्रत्येक चुने गए टूल के लिए, OpenSpec निम्नलिखित स्थापित कर सकता है:
1. **स्किल्स** (यदि डिलीवरी में स्किल्स शामिल हो): `.../skills/openspec-*/SKILL.md`
2. **कमांड्स** (यदि डिलीवरी में कमांड्स शामिल हो): टूल-विशिष्ट `opsx-*` कमांड फाइलें

कोडेक्स सिर्फ स्किल्स-ऑनली है: OpenSpec डिलीवरी `commands` पर सेट होने पर भी कोडेक्स के लिए `.codex/skills/openspec-*/SKILL.md` स्थापित करता है, और यह कोडेक्स कस्टम प्रॉम्प्ट फाइलें नहीं जनरेट करता है।

डिफ़ॉल्ट रूप से, OpenSpec `core` प्रोफाइल का उपयोग करता है, जिसमें निम्नलिखित शामिल होते हैं:
- `propose`
- `explore`
- `apply`
- `sync`
- `archive`

आप `openspec config profile` के माध्यम से विस्तारित वर्कफ़्लो (`new`, `continue`, `ff`, `verify`, `bulk-archive`, `onboard`) सक्षम कर सकते हैं, फिर `openspec update` चला सकते हैं।

## टूल डिरेक्टरी संदर्भ

| टूल (आईडी) | स्किल्स पाथ पैटर्न | कमांड पाथ पैटर्न |
|-----------|---------------------|----------------------|
| Amazon Q Developer (`amazon-q`) | `.amazonq/skills/openspec-*/SKILL.md` | `.amazonq/prompts/opsx-<id>.md` |
| Antigravity (`antigravity`) | `.agent/skills/openspec-*/SKILL.md` | `.agent/workflows/opsx-<id>.md` |
| Auggie (`auggie`) | `.augment/skills/openspec-*/SKILL.md` | `.augment/commands/opsx-<id>.md` |
| IBM Bob Shell (`bob`) | `.bob/skills/openspec-*/SKILL.md` | `.bob/commands/opsx-<id>.md` |
| Claude Code (`claude`) | `.claude/skills/openspec-*/SKILL.md` | `.claude/commands/opsx/<id>.md` |
| Cline (`cline`) | `.cline/skills/openspec-*/SKILL.md` | `.clinerules/workflows/opsx-<id>.md` |
| CodeArts (`codeartsagent`) | `.codeartsdoer/skills/openspec-*/SKILL.md` | Not generated (no command adapter; use skill-based `/openspec-*` invocations) |
| CodeBuddy (`codebuddy`) | `.codebuddy/skills/openspec-*/SKILL.md` | `.codebuddy/commands/opsx/<id>.md` |
| Codex (`codex`) | `.codex/skills/openspec-*/SKILL.md` | Not generated (skills-only; use `.codex/skills/openspec-*`) |
| ForgeCode (`forgecode`) | `.forge/skills/openspec-*/SKILL.md` | Not generated (no command adapter; use skill-based `/openspec-*` invocations) |
| Continue (`continue`) | `.continue/skills/openspec-*/SKILL.md` | `.continue/prompts/opsx-<id>.prompt` |
| CoStrict (`costrict`) | `.cospec/skills/openspec-*/SKILL.md` | `.cospec/openspec/commands/opsx-<id>.md` |
| Crush (`crush`) | `.crush/skills/openspec-*/SKILL.md` | `.crush/commands/opsx/<id>.md` |
| Cursor (`cursor`) | `.cursor/skills/openspec-*/SKILL.md` | `.cursor/commands/opsx-<id>.md` |
| Factory Droid (`factory`) | `.factory/skills/openspec-*/SKILL.md` | `.factory/commands/opsx-<id>.md` |
| Gemini CLI (`gemini`) | `.gemini/skills/openspec-*/SKILL.md` | `.gemini/commands/opsx/<id>.toml` |
| GitHub Copilot (`github-copilot`) | `.github/skills/openspec-*/SKILL.md` | `.github/prompts/opsx-<id>.prompt.md`\*\* |
| Hermes Agent (`hermes`) | `.hermes/skills/openspec-*/SKILL.md`\*\*\* | Not generated (no command adapter; use skill-based `/openspec-*` invocations) |
| iFlow (`iflow`) | `.iflow/skills/openspec-*/SKILL.md` | `.iflow/commands/opsx-<id>.md` |
| Junie (`junie`) | `.junie/skills/openspec-*/SKILL.md` | `.junie/commands/opsx-<id>.md` |
| Kilo Code (`kilocode`) | `.kilocode/skills/openspec-*/SKILL.md` | `.kilocode/workflows/opsx-<id>.md` |
| Kimi Code (`kimi`) | `.kimi-code/skills/openspec-*/SKILL.md` | Not generated (no command adapter; use skill-based `/skill:openspec-*` invocations) |
| Kiro (`kiro`) | `.kiro/skills/openspec-*/SKILL.md` | `.kiro/prompts/opsx-<id>.prompt.md` |
| Lingma (`lingma`) | `.lingma/skills/openspec-*/SKILL.md` | `.lingma/commands/opsx/<id>.md` |
| Mistral Vibe (`vibe`) | `.vibe/skills/openspec-*/SKILL.md` | Not generated (no command adapter; use skill-based `/openspec-*` invocations) |
| Oh My Pi (`oh-my-pi`) | `.omp/skills/openspec-*/SKILL.md` | `.omp/commands/opsx-<id>.md` |
| OpenCode (`opencode`) | `.opencode/skills/openspec-*/SKILL.md` | `.opencode/commands/opsx-<id>.md` |
| Pi (`pi`) | `.pi/skills/openspec-*/SKILL.md` | `.pi/prompts/opsx-<id>.md` |
| Qoder (`qoder`) | `.qoder/skills/openspec-*/SKILL.md` | `.qoder/commands/opsx/<id>.md` |
| Qwen Code (`qwen`) | `.qwen/skills/openspec-*/SKILL.md` | `.qwen/commands/opsx-<id>.md` |
| [Zoo Code](https://github.com/Zoo-Code-Org/Zoo-Code) (`roocode`) | `.roo/skills/openspec-*/SKILL.md` | `.roo/commands/opsx-<id>.md` |
| Trae (`trae`) | `.trae/skills/openspec-*/SKILL.md` | `.trae/commands/opsx-<id>.md` |
| Windsurf (`windsurf`) | `.windsurf/skills/openspec-*/SKILL.md` | `.windsurf/workflows/opsx-<id>.md` |
| ZCode (`zcode`) | `.zcode/skills/openspec-*/SKILL.md` | `.zcode/commands/opsx/<id>.md` |

\*\* गिटहब कॉपिलॉट प्रॉम्प्ट फाइलें IDE एक्सटेंशन (VS Code, JetBrains, Visual Studio) में कस्टम स्लैश कमांड के रूप में पहचानी जाती हैं। कॉपिलॉट CLI वर्तमान में सीधे `.github/prompts/*.prompt.md` का उपयोग नहीं करता है।

\*\*\* हर्मेस डिफ़ॉल्ट रूप से `~/.hermes/skills/` से स्किल्स लोड करता है। प्रोजेक्ट-लोकल OpenSpec स्किल्स का उपयोग करने के लिए, प्रोजेक्ट `.hermes/skills/` डिरेक्ट्री को `~/.hermes/config.yaml` में `skills.external_dirs` में जोड़ें; इसके बाद हर्मेस स्किल्स को उपयोगकर्ता-फेसिंग स्लैश इनवोकेशन जैसे `/openspec-propose` के साथ एक्सपोज करता है।

## नॉन-इंटरैक्टिव सेटअप

CI/CD या स्क्रिप्टेड सेटअप के लिए, `--tools` (वैकल्पिक रूप से `--profile`) का उपयोग करें:

```bash
# विशिष्ट टूल्स को कॉन्फ़िगर करें
openspec init --tools claude,cursor

# सभी समर्थित टूल्स को कॉन्फ़िगर करें
openspec init --tools all

# टूल कॉन्फ़िगरेशन को छोड़ें
openspec init --tools none

# इस इनिट रन के लिए प्रोफाइल ओवरराइड करें
openspec init --profile core
```

**उपलब्ध टूल आईडी (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codeartsagent`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `hermes`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `lingma`, `vibe`, `oh-my-pi`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `windsurf`, `zcode`

## वर्कफ़्लो-निर्भर स्थापना

OpenSpec चुने गए वर्कफ़्लो के आधार पर वर्कफ़्लो आर्टिफैक्ट्स स्थापित करता है:
- **कोर प्रोफाइल (डिफ़ॉल्ट):** `propose`, `explore`, `apply`, `sync`, `archive`
- **कस्टम चयन:** सभी वर्कफ़्लो आईडी का कोई भी सबसेट:
  `propose`, `explore`, `new`, `continue`, `apply`, `ff`, `sync`, `archive`, `bulk-archive`, `verify`, `onboard`

दूसरे शब्दों में, स्किल/कमांड संख्या प्रोफाइल-निर्भर और डिलीवरी-निर्भर होती है, न कि स्थिर।

## जनरेट की गई स्किल नाम

प्रोफाइल/वर्कफ़्लो कॉन्फ़िगरेशन द्वारा चुने जाने पर, OpenSpec ये स्किल जनरेट करता है:
- `openspec-propose`
- `openspec-explore`
- `openspec-new-change`
- `openspec-continue-change`
- `openspec-apply-change`
- `openspec-update-change`
- `openspec-ff-change`
- `openspec-sync-specs`
- `openspec-archive-change`
- `openspec-bulk-archive-change`
- `openspec-verify-change`
- `openspec-onboard`

कमांड के व्यवहार के लिए [Commands](commands.md) और `init`/`update` विकल्पों के लिए [CLI](cli.md) देखें।

## संबंधित
- [CLI Reference](cli.md) — टर्मिनल कमांड्स
- [Commands](commands.md) — स्लैश कमांड और स्किल्स
- [Getting Started](getting-started.md) — पहली बार सेटअप
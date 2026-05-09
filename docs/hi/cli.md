# CLI संदर्भ

OpenSpec CLI (`openspec`) प्रोजेक्ट सेटअप, सत्यापन, स्थिति निरीक्षण और प्रबंधन के लिए टर्मिनल कमांड प्रदान करता है। ये कमांड [Commands](commands.md) में दस्तावेज़ किए गए AI स्लैश कमांड (जैसे `/opsx:propose`) को पूरक करते हैं।

## सारांश

| श्रेणी | कमांड | उद्देश्य |
|----------|----------|---------|
| **Setup** | `init`, `update` | अपने प्रोजेक्ट में OpenSpec को इनिशियलाइज़ और अपडेट करें |
| **Workspaces (beta)** | `workspace setup`, `workspace list`, `workspace ls`, `workspace link`, `workspace relink`, `workspace doctor`, `workspace open` | लिंक किए गए रिपो या फ़ोल्डरों में प्लानिंग सेट करें |
| **Browsing** | `list`, `view`, `show` | परिवर्तनों और स्पेक्स का अन्वेषण करें |
| **Validation** | `validate` | समस्याओं के लिए परिवर्तनों और स्पेक्स की जाँच करें |
| **Lifecycle** | `archive` | पूर्ण किए गए परिवर्तनों को अंतिम रूप दें |
| **Workflow** | `status`, `instructions`, `templates`, `schemas` | आर्टिफैक्ट-संचालित वर्कफ़्लो समर्थन |
| **Schemas** | `schema init`, `schema fork`, `schema validate`, `schema which` | कस्टम वर्कफ़्लो बनाएं और प्रबंधित करें |
| **Config** | `config` | सेटिंग्स देखें और संशोधित करें |
| **Utility** | `feedback`, `completion` | फीडबैक और शेल इंटीग्रेशन |

---

## मानव बनाम एजेंट कमांड

अधिकांश CLI कमांड टर्मिनल में **मानव उपयोग** के लिए डिज़ाइन किए गए हैं। कुछ कमांड JSON आउटपुट के माध्यम से **एजेंट/स्क्रिप्ट उपयोग** का भी समर्थन करते हैं।

### केवल मानव कमांड

ये कमांड इंटरैक्टिव हैं और टर्मिनल उपयोग के लिए डिज़ाइन किए गए हैं:

| कमांड | उद्देश्य |
|---------|---------|
| `openspec init` | प्रोजेक्ट आरंभ करें (इंटरैक्टिव प्रॉम्प्ट) |
| `openspec view` | इंटरैक्टिव डैशबोर्ड |
| `openspec config edit` | कॉन्फ़िग को एडिटर में खोलें |
| `openspec feedback` | GitHub के माध्यम से फीडबैक सबमिट करें |
| `openspec completion install` | शेल कम्प्लीशन इंस्टॉल करें |

### एजेंट-संगत कमांड

ये कमांड AI एजेंट और स्क्रिप्ट द्वारा प्रोग्रामेटिक उपयोग के लिए `--json` आउटपुट का समर्थन करते हैं:

| कमांड | मानव उपयोग | एजेंट उपयोग |
|---------|-----------|-----------|
| `openspec list` | परिवर्तन/स्पेक्स ब्राउज़ करें | संरचित डेटा के लिए `--json` |
| `openspec show <item>` | सामग्री पढ़ें | पार्सिंग के लिए `--json` |
| `openspec validate` | समस्याओं की जाँच करें | बल्क वैलिडेशन के लिए `--all --json` |
| `openspec status` | आर्टिफैक्ट प्रगति देखें | संरचित स्थिति के लिए `--json` |
| `openspec instructions` | अगले चरण प्राप्त करें | एजेंट निर्देशों के लिए `--json` |
| `openspec templates` | टेम्पलेट पथ खोजें | पथ रिज़ॉल्यूशन के लिए `--json` |
| `openspec schemas` | उपलब्ध स्कीमा सूचीबद्ध करें | स्कीमा खोज के लिए `--json` |
| `openspec workspace setup --no-interactive` | स्पष्ट इनपुट के साथ वर्कस्पेस बनाएं | संरचित सेटअप आउटपुट के लिए `--json` |
| `openspec workspace list` | ज्ञात वर्कस्पेस ब्राउज़ करें | टाइप किए गए वर्कस्पेस ऑब्जेक्ट के लिए `--json` |
| `openspec workspace link` | रेपो या फ़ोल्डर लिंक करें | संरचित लिंक आउटपुट के लिए `--json` |
| `openspec workspace relink` | लिंक किए गए पथ की मरम्मत करें | संरचित लिंक आउटपुट के लिए `--json` |
| `openspec workspace doctor` | एक वर्कस्पेस की जाँच करें | संरचित स्थिति आउटपुट के लिए `--json` |

---

## ग्लोबल विकल्प

ये विकल्प सभी कमांड के साथ काम करते हैं:

| विकल्प | विवरण |
|--------|-------------|
| `--version`, `-V` | संस्करण संख्या दिखाएं |
| `--no-color` | रंग आउटपुट अक्षम करें |
| `--help`, `-h` | कमांड के लिए सहायता प्रदर्शित करें |

---

## सेटअप कमांड

### `openspec init`

अपने प्रोजेक्ट में OpenSpec आरंभ करें। फ़ोल्डर संरचना बनाता है और AI टूल इंटीग्रेशन कॉन्फ़िगर करता है।

डिफ़ॉल्ट व्यवहार ग्लोबल कॉन्फ़िग डिफ़ॉल्ट का उपयोग करता है: प्रोफ़ाइल `core`, डिलीवरी `both`, वर्कफ़्लो `propose, explore, apply, sync, archive`।

```
openspec init [path] [options]
```

**आर्ग्यूमेंट:**

| आर्ग्यूमेंट | आवश्यक | विवरण |
|----------|----------|-------------|
| `path` | नहीं | लक्ष्य निर्देशिका (डिफ़ॉल्ट: वर्तमान निर्देशिका) |

**विकल्प:**

| विकल्प | विवरण |
|--------|-------------|
| `--tools <list>` | गैर-इंटरैक्टिव रूप से AI टूल कॉन्फ़िगर करें। `all`, `none`, या अल्पविराम से अलग की गई सूची का उपयोग करें |
| `--force` | बिना प्रॉम्प्ट किए लेगेसी फ़ाइलों को ऑटो-क्लीन करें |
| `--profile <profile>` | इस init रन के लिए ग्लोबल प्रोफ़ाइल ओवरराइड करें (`core` या `custom`) |

`--profile custom` ग्लोबल कॉन्फ़िग (`openspec config profile`) में वर्तमान में चयनित वर्कफ़्लो का उपयोग करता है।

**समर्थित टूल ID (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `opencode`, `pi`, `qoder`, `lingma`, `qwen`, `roocode`, `trae`, `windsurf`

**उदाहरण:**

```bash
# इंटरैक्टिव आरंभीकरण
openspec init

# एक विशिष्ट निर्देशिका में आरंभ करें
openspec init ./my-project

# गैर-इंटरैक्टिव: Claude और Cursor के लिए कॉन्फ़िगर करें
openspec init --tools claude,cursor

# सभी समर्थित टूल के लिए कॉन्फ़िगर करें
openspec init --tools all

# इस रन के लिए प्रोफ़ाइल ओवरराइड करें
openspec init --profile core

# प्रॉम्प्ट छोड़ें और लेगेसी फ़ाइलों को ऑटो-क्लीन करें
openspec init --force
```

**यह क्या बनाता है:**

```
openspec/
├── specs/              # आपके स्पेसिफिकेशन (सत्य का स्रोत)
├── changes/            # प्रस्तावित परिवर्तन
└── config.yaml         # प्रोजेक्ट कॉन्फ़िगरेशन

.claude/skills/         # Claude Code कौशल (यदि claude चयनित है)
.cursor/skills/         # Cursor कौशल (यदि cursor चयनित है)
.cursor/commands/       # Cursor OPSX कमांड (यदि डिलीवरी में कमांड शामिल हैं)
... (अन्य टूल कॉन्फ़िग)
```

---

### `openspec update`

CLI अपग्रेड करने के बाद OpenSpec निर्देश फ़ाइलें अपडेट करें। आपकी वर्तमान ग्लोबल प्रोफ़ाइल, चयनित वर्कफ़्लो और डिलीवरी मोड का उपयोग करके AI टूल कॉन्फ़िगरेशन फ़ाइलें पुनर्जनरेट करता है।

```
openspec update [path] [options]
```

**आर्ग्यूमेंट:**

| आर्ग्यूमेंट | आवश्यक | विवरण |
|----------|----------|-------------|
| `path` | नहीं | लक्ष्य निर्देशिका (डिफ़ॉल्ट: वर्तमान निर्देशिका) |

**विकल्प:**

| विकल्प | विवरण |
|--------|-------------|
| `--force` | फ़ाइलें अप टू डेट होने पर भी अपडेट करने के लिए बाध्य करें |

**उदाहरण:**

```bash
# npm अपग्रेड के बाद निर्देश फ़ाइलें अपडेट करें
npm update @fission-ai/openspec
openspec update
```

---

## वर्कस्पेस कमांड

वर्कस्पेस कमांड सक्रिय विकास में हैं और अभी उपयोग के लिए तैयार नहीं हैं। इस कमांड सतह के ऊपर बाहरी ऑटोमेशन, इंटीग्रेशन या लंबे समय तक चलने वाले वर्कफ़्लो न बनाएं; कमांड व्यवहार, स्थिति फ़ाइलें और JSON आउटपुट किसी भी समय बदल सकते हैं।

समन्वय वर्कस्पेस उस कार्य के लिए योजना गृह हैं जो कई रेपो या फ़ोल्डर तक फैला होता है। वर्कस्पेस दृश्यता परिवर्तन प्रतिबद्धता नहीं है: उन रेपो या फ़ोल्डर को लिंक करें जिनके बारे में OpenSpec को जानना चाहिए, फिर विशिष्ट कार्य की योजना बनाने के लिए तैयार होने पर परिवर्तन बनाएं।

### `openspec workspace setup`

मानक OpenSpec वर्कस्पेस स्थान में एक वर्कस्पेस बनाएं और कम से कम एक मौजूदा रेपो या फ़ोल्डर लिंक करें।

```bash
openspec workspace setup [options]
```

**विकल्प:**

| विकल्प | विवरण |
|--------|-------------|
| `--name <name>` | वर्कस्पेस नाम। नाम kebab-case होने चाहिए |
| `--link <path>` | एक मौजूदा रेपो या फ़ोल्डर लिंक करें और फ़ोल्डर नाम से लिंक नाम अनुमानित करें |
| `--link <name>=<path>` | एक स्पष्ट लिंक नाम के साथ मौजूदा रेपो या फ़ोल्डर लिंक करें |
| `--opener <id>` | गैर-इंटरैक्टिव सेटअप के दौरान पसंदीदा ओपनर संग्रहीत करें: `codex`, `claude`, `github-copilot`, या `editor` |
| `--no-interactive` | प्रॉम्प्ट अक्षम करें; `--name` और कम से कम एक `--link` आवश्यक है |
| `--json` | JSON आउटपुट करें; `--no-interactive` आवश्यक है |

**उदाहरण:**

```bash
openspec workspace setup
openspec workspace setup --no-interactive --name platform --link /repos/api --link web=/repos/web
openspec workspace setup --no-interactive --name platform --link /repos/api --opener codex
openspec workspace setup --no-interactive --json --name checkout --link /repos/platform/apps/checkout
```

इंटरैक्टिव सेटअप एक पसंदीदा ओपनर के लिए पूछता है और इसे मशीन-लोकल वर्कस्पेस स्थिति में संग्रहीत करता है। गैर-इंटरैक्टिव सेटअप एक पसंदीदा ओपनर केवल तभी संग्रहीत करता है जब `--opener` प्रदान किया जाता है; अन्यथा `workspace open` बाद में इंटरैक्टिव टर्मिनल में प्रॉम्प्ट करता है जब एक समर्थित ओपनर उपलब्ध होता है, या स्क्रिप्ट से `--agent <tool>` या `--editor` पास करने के लिए कहता है।

### `openspec workspace list`

स्थानीय रजिस्ट्री से ज्ञात OpenSpec वर्कस्पेस सूचीबद्ध करें।

```bash
openspec workspace list [--json]
openspec workspace ls [--json]
```

सूची प्रत्येक वर्कस्पेस स्थान और लिंक किए गए रेपो या फ़ोल्डर दिखाती है। पुरानी रजिस्ट्री रिकॉर्ड रिपोर्ट किए जाते हैं लेकिन बदले नहीं जाते।

### `openspec workspace link`

एक वर्कस्पेस के लिए मौजूदा रेपो या फ़ोल्डर रिकॉर्ड करें।

```bash
openspec workspace link [name] <path> [options]
```

**विकल्प:**

| विकल्प | विवरण |
|--------|-------------|
| `--workspace <name>` | स्थानीय रजिस्ट्री से एक ज्ञात वर्कस्पेस चुनें |
| `--json` | JSON आउटपुट करें |
| `--no-interactive` | वर्कस्पेस पिकर प्रॉम्प्ट अक्षम करें |

**उदाहरण:**

```bash
openspec workspace link /repos/api
openspec workspace link api-service /repos/api
openspec workspace link --workspace platform /repos/platform/apps/checkout
```

पथ पहले से मौजूद होना चाहिए। सापेक्ष पथ OpenSpec द्वारा सत्यापित पूर्ण पथ को मशीन-लोकल वर्कस्पेस स्थिति में संग्रहीत करने से पहले कमांड की वर्तमान निर्देशिका के सापेक्ष हल किए जाते हैं। लिंक किए गए पथ पूर्ण रेपो, पैकेज, सेवाएं, ऐप्स या रेपो-लोकल `openspec/` स्थिति के बिना फ़ोल्डर हो सकते हैं।

### `openspec workspace relink`

मौजूदा लिंक के लिए स्थानीय पथ की मरम्मत या परिवर्तन करें।

```bash
openspec workspace relink <name> <path> [options]
```

पथ पहले से मौजूद होना चाहिए। Relink केवल स्थिर लिंक नाम के लिए मशीन-लोकल पथ को अपडेट करता है।

### `openspec workspace doctor`

जाँचें कि एक वर्कस्पेस वर्तमान मशीन पर क्या हल कर सकता है।

```bash
openspec workspace doctor [options]
```

Doctor वर्कस्पेस स्थान, योजना पथ, लिंक किए गए रेपो या फ़ोल्डर, गायब पथ, मौजूद होने पर रेपो-लोकल स्पेक्स पथ और सुझाए गए सुधार दिखाता है। यह केवल समस्याओं की रिपोर्ट करता है; यह उन्हें स्वचालित रूप से ठीक नहीं करता है।

जिन कमांड को एक वर्कस्पेस की आवश्यकता होती है, वे वर्कस्पेस फ़ोल्डर या सबडायरेक्टरी के अंदर से चलाए जाने पर वर्तमान वर्कस्पेस का उपयोग करते हैं। कहीं और से, `--workspace <name>` पास करें, इंटरैक्टिव टर्मिनल में पिकर से चुनें, या केवल एक ज्ञात वर्कस्पेस पर भरोसा करें जब ठीक एक मौजूद हो। `--json` या `--no-interactive` मोड में, अस्पष्ट चयन एक संरचित स्थिति त्रुटि के साथ विफल हो जाता है और `--workspace <name>` का सुझाव देता है।

JSON प्रतिक्रियाएं टाइप किए गए ऑब्जेक्ट और `status` एरे का उपयोग करती हैं। प्राथमिक डेटा `workspace`, `workspaces`, या `link` में रहता है; चेतावनियाँ और त्रुटियाँ `status` में रहती हैं।

### `openspec workspace open`

संग्रहीत पसंदीदा ओपनर, एक-सत्र एजेंट ओवरराइड, या VS Code एडिटर मोड के माध्यम से वर्कस्पेस वर्किंग सेट खोलें।

```bash
openspec workspace open [name] [options]
```

**विकल्प:**

| विकल्प | विवरण |
|--------|-------------|
| `--workspace <name>` | स्थिति वर्कस्पेस नाम के लिए उपनाम |
| `--agent <tool>` | एक-सत्र एजेंट ओवरराइड: `codex`, `claude`, या `github-copilot` |
| `--editor` | बनाए रखे गए VS Code वर्कस्पेस फ़ाइल को सामान्य एडिटर वर्कस्पेस के रूप में खोलें |
| `--no-interactive` | वर्कस्पेस और ओपनर पिकर प्रॉम्प्ट अक्षम करें |

**उदाहरण:**

```bash
openspec workspace open
openspec workspace open platform
openspec workspace open platform --agent github-copilot
openspec workspace open --agent codex
openspec workspace open --editor
```

`workspace open` एक के अंदर चलाए जाने पर वर्तमान वर्कस्पेस का उपयोग करता है, कहीं और से चलाए जाने पर केवल एक ज्ञात वर्कस्पेस को ऑटो-चयनित करता है, और कई वर्कस्पेस ज्ञात होने पर उपयोगकर्ता से चुनने के लिए कहता है। `--agent` और `--editor` संग्रहीत पसंदीदा ओपनर को नहीं बदलते हैं। दोनों ओपनर ओवरराइड पास करना एक त्रुटि है; या तो `--agent <tool>` या `--editor` चुनें।

OpenSpec VS Code एडिटर और GitHub Copilot-in-VS-Code ओपन के लिए वर्कस्पेस रूट पर `<workspace-name>.code-workspace` बनाए रखता है। वह फ़ाइल मशीन-लोकल है और एक विशिष्ट `<workspace-name>.code-workspace` `.gitignore` एंट्री के साथ डिफ़ॉल्ट रूप से अनदेखी की जाती है, ताकि उपयोगकर्ता-लिखित `*.code-workspace` फ़ाइलें ट्रैकिंग के लिए पात्र बनी रहें।

बनाए रखा गया VS Code वर्कस्पेस समन्वय रूट को `.` के रूप में और मान्य लिंक किए गए रेपो या फ़ोल्डर को अतिरिक्त रूट के रूप में शामिल करता है। VS Code उन प्रविष्टियों को एक मल्टी-रूट वर्कस्पेस के रूप में प्रदर्शित करता है।

रूट वर्कस्पेस ओपन लिंक किए गए रेपो या फ़ोल्डर में अन्वेषण और योजना का समर्थन करता है। कार्यान्वयन संपादन केवल एक स्पष्ट उपयोगकर्ता अनुरोध और एक सामान्य OpenSpec कार्यान्वयन वर्कफ़्लो के बाद शुरू होना चाहिए।

---

## ब्राउज़िंग कमांड्स

### `openspec list`

अपने प्रोजेक्ट में परिवर्तनों या स्पेक्स की सूची बनाएं।

```
openspec list [options]
```

**विकल्प:**

| विकल्प | विवरण |
|--------|-------------|
| `--specs` | परिवर्तनों के बजाय स्पेक्स की सूची बनाएं |
| `--changes` | परिवर्तनों की सूची बनाएं (डिफ़ॉल्ट) |
| `--sort <order>` | `recent` (डिफ़ॉल्ट) या `name` के अनुसार क्रमबद्ध करें |
| `--json` | JSON के रूप में आउटपुट दें |

**उदाहरण:**

```bash
# सभी सक्रिय परिवर्तनों की सूची बनाएं
openspec list

# सभी स्पेक्स की सूची बनाएं
openspec list --specs

# स्क्रिप्ट्स के लिए JSON आउटपुट
openspec list --json
```

**आउटपुट (टेक्स्ट):**

```
Active changes:
  add-dark-mode     UI theme switching support
  fix-login-bug     Session timeout handling
```

---

### `openspec view`

स्पेक्स और परिवर्तनों को एक्सप्लोर करने के लिए एक इंटरैक्टिव डैशबोर्ड प्रदर्शित करें।

```
openspec view
```

आपके प्रोजेक्ट की स्पेसिफिकेशन और परिवर्तनों को नेविगेट करने के लिए एक टर्मिनल-आधारित इंटरफ़ेस खोलता है।

---

### `openspec show`

किसी परिवर्तन या स्पेक का विवरण प्रदर्शित करें।

```
openspec show [item-name] [options]
```

**आर्ग्यूमेंट्स:**

| आर्ग्यूमेंट | आवश्यक | विवरण |
|----------|----------|-------------|
| `item-name` | नहीं | परिवर्तन या स्पेक का नाम (यदि छोड़ दिया जाए तो प्रॉम्प्ट करता है) |

**विकल्प:**

| विकल्प | विवरण |
|--------|-------------|
| `--type <type>` | प्रकार निर्दिष्ट करें: `change` या `spec` (यदि अस्पष्ट हो तो ऑटो-डिटेक्ट होता है) |
| `--json` | JSON के रूप में आउटपुट दें |
| `--no-interactive` | प्रॉम्प्ट्स को अक्षम करें |

**परिवर्तन-विशिष्ट विकल्प:**

| विकल्प | विवरण |
|--------|-------------|
| `--deltas-only` | केवल डेल्टा स्पेक्स दिखाएं (JSON मोड) |

**स्पेक-विशिष्ट विकल्प:**

| विकल्प | विवरण |
|--------|-------------|
| `--requirements` | केवल आवश्यकताएं दिखाएं, परिदृश्यों को छोड़ दें (JSON मोड) |
| `--no-scenarios` | परिदृश्य सामग्री को छोड़ दें (JSON मोड) |
| `-r, --requirement <id>` | 1-आधारित इंडेक्स द्वारा विशिष्ट आवश्यकता दिखाएं (JSON मोड) |

**उदाहरण:**

```bash
# इंटरैक्टिव चयन
openspec show

# एक विशिष्ट परिवर्तन दिखाएं
openspec show add-dark-mode

# एक विशिष्ट स्पेक दिखाएं
openspec show auth --type spec

# पार्सिंग के लिए JSON आउटपुट
openspec show add-dark-mode --json
```

---

## सत्यापन कमांड्स

### `openspec validate`

संरचनात्मक समस्याओं के लिए परिवर्तनों और स्पेक्स को सत्यापित करें।

```
openspec validate [item-name] [options]
```

**आर्ग्यूमेंट्स:**

| आर्ग्यूमेंट | आवश्यक | विवरण |
|----------|----------|-------------|
| `item-name` | नहीं | सत्यापित करने के लिए विशिष्ट आइटम (यदि छोड़ दिया जाए तो प्रॉम्प्ट करता है) |

**विकल्प:**

| विकल्प | विवरण |
|--------|-------------|
| `--all` | सभी परिवर्तनों और स्पेक्स को सत्यापित करें |
| `--changes` | सभी परिवर्तनों को सत्यापित करें |
| `--specs` | सभी स्पेक्स को सत्यापित करें |
| `--type <type>` | जब नाम अस्पष्ट हो तो प्रकार निर्दिष्ट करें: `change` या `spec` |
| `--strict` | सख्त सत्यापन मोड सक्षम करें |
| `--json` | JSON के रूप में आउटपुट दें |
| `--concurrency <n>` | अधिकतम समानांतर सत्यापन (डिफ़ॉल्ट: 6, या `OPENSPEC_CONCURRENCY` env) |
| `--no-interactive` | प्रॉम्प्ट्स को अक्षम करें |

**उदाहरण:**

```bash
# इंटरैक्टिव सत्यापन
openspec validate

# एक विशिष्ट परिवर्तन सत्यापित करें
openspec validate add-dark-mode

# सभी परिवर्तनों को सत्यापित करें
openspec validate --changes

# JSON आउटपुट के साथ सब कुछ सत्यापित करें (CI/स्क्रिप्ट्स के लिए)
openspec validate --all --json

# बढ़ी हुई समानांतरता के साथ सख्त सत्यापन
openspec validate --all --strict --concurrency 12
```

**आउटपुट (टेक्स्ट):**

```
Validating add-dark-mode...
  ✓ proposal.md valid
  ✓ specs/ui/spec.md valid
  ⚠ design.md: missing "Technical Approach" section

1 warning found
```

**आउटपुट (JSON):**

```json
{
  "version": "1.0.0",
  "results": {
    "changes": [
      {
        "name": "add-dark-mode",
        "valid": true,
        "warnings": ["design.md: missing 'Technical Approach' section"]
      }
    ]
  },
  "summary": {
    "total": 1,
    "valid": 1,
    "invalid": 0
  }
}
```

---

## लाइफसाइकल आदेश

### `openspec archive`

एक पूर्ण परिवर्तन को संग्रहित करें और डेल्टा स्पेक्स को मुख्य स्पेक्स में मर्ज करें।

```
openspec archive [change-name] [options]
```

**आर्ग्यूमेंट्स:**

| आर्ग्यूमेंट | आवश्यक | विवरण |
|----------|----------|-------------|
| `change-name` | नहीं | संग्रहित करने के लिए परिवर्तन (यदि छोड़ दिया जाए तो प्रॉम्प्ट करता है) |

**विकल्प:**

| विकल्प | विवरण |
|--------|-------------|
| `-y, --yes` | पुष्टिकरण प्रॉम्प्ट को छोड़ दें |
| `--skip-specs` | स्पेक अपडेट को छोड़ दें (केवल इन्फ्रास्ट्रक्चर/टूलिंग/डॉक परिवर्तनों के लिए) |
| `--no-validate` | सत्यापन को छोड़ दें (पुष्टिकरण आवश्यक) |

**उदाहरण:**

```bash
# इंटरैक्टिव संग्रह
openspec archive

# विशिष्ट परिवर्तन संग्रहित करें
openspec archive add-dark-mode

# बिना प्रॉम्प्ट के संग्रहित करें (CI/स्क्रिप्ट)
openspec archive add-dark-mode --yes

# एक टूलिंग परिवर्तन संग्रहित करें जो स्पेक्स को प्रभावित नहीं करता
openspec archive update-ci-config --skip-specs
```

**यह क्या करता है:**

1. परिवर्तन को सत्यापित करता है (जब तक `--no-validate` न हो)
2. पुष्टिकरण के लिए प्रॉम्प्ट करता है (जब तक `--yes` न हो)
3. डेल्टा स्पेक्स को `openspec/specs/` में मर्ज करता है
4. परिवर्तन फ़ोल्डर को `openspec/changes/archive/YYYY-MM-DD-<name>/` में ले जाता है

---

## वर्कफ़्लो आदेश

ये आदेश आर्टिफैक्ट-संचालित OPSX वर्कफ़्लो का समर्थन करते हैं। ये प्रगति की जाँच करने वाले मनुष्यों और अगले चरण निर्धारित करने वाले एजेंट्स दोनों के लिए उपयोगी हैं।

### `openspec status`

किसी परिवर्तन के लिए आर्टिफैक्ट पूर्णता स्थिति प्रदर्शित करें।

```
openspec status [options]
```

**विकल्प:**

| विकल्प | विवरण |
|--------|-------------|
| `--change <id>` | परिवर्तन का नाम (यदि छोड़ दिया जाए तो प्रॉम्प्ट करता है) |
| `--schema <name>` | स्कीमा ओवरराइड (परिवर्तन के कॉन्फ़िग से ऑटो-डिटेक्ट) |
| `--json` | JSON के रूप में आउटपुट |

**उदाहरण:**

```bash
# इंटरैक्टिव स्थिति जाँच
openspec status

# विशिष्ट परिवर्तन के लिए स्थिति
openspec status --change add-dark-mode

# एजेंट उपयोग के लिए JSON
openspec status --change add-dark-mode --json
```

**आउटपुट (टेक्स्ट):**

```
Change: add-dark-mode
Schema: spec-driven
Progress: 2/4 artifacts complete

[x] proposal
[ ] design
[x] specs
[-] tasks (blocked by: design)
```

**आउटपुट (JSON):**

```json
{
  "changeName": "add-dark-mode",
  "schemaName": "spec-driven",
  "isComplete": false,
  "applyRequires": ["tasks"],
  "artifacts": [
    {"id": "proposal", "outputPath": "proposal.md", "status": "done"},
    {"id": "design", "outputPath": "design.md", "status": "ready"},
    {"id": "specs", "outputPath": "specs/**/*.md", "status": "done"},
    {"id": "tasks", "outputPath": "tasks.md", "status": "blocked", "missingDeps": ["design"]}
  ]
}
```

---

### `openspec instructions`

किसी आर्टिफैक्ट बनाने या कार्य लागू करने के लिए समृद्ध निर्देश प्राप्त करें। AI एजेंट्स द्वारा अगला क्या बनाना है यह समझने के लिए उपयोग किया जाता है।

```
openspec instructions [artifact] [options]
```

**आर्ग्यूमेंट्स:**

| आर्ग्यूमेंट | आवश्यक | विवरण |
|----------|----------|-------------|
| `artifact` | नहीं | आर्टिफैक्ट ID: `proposal`, `specs`, `design`, `tasks`, या `apply` |

**विकल्प:**

| विकल्प | विवरण |
|--------|-------------|
| `--change <id>` | परिवर्तन का नाम (गैर-इंटरैक्टिव मोड में आवश्यक) |
| `--schema <name>` | स्कीमा ओवरराइड |
| `--json` | JSON के रूप में आउटपुट |

**विशेष मामला:** कार्य कार्यान्वयन निर्देश प्राप्त करने के लिए `apply` को आर्टिफैक्ट के रूप में उपयोग करें।

**उदाहरण:**

```bash
# अगले आर्टिफैक्ट के लिए निर्देश प्राप्त करें
openspec instructions --change add-dark-mode

# विशिष्ट आर्टिफैक्ट निर्देश प्राप्त करें
openspec instructions design --change add-dark-mode

# लागू/कार्यान्वयन निर्देश प्राप्त करें
openspec instructions apply --change add-dark-mode

# एजेंट उपभोग के लिए JSON
openspec instructions design --change add-dark-mode --json
```

**आउटपुट में शामिल हैं:**

- आर्टिफैक्ट के लिए टेम्पलेट सामग्री
- कॉन्फ़िग से प्रोजेक्ट संदर्भ
- निर्भरता आर्टिफैक्ट्स से सामग्री
- कॉन्फ़िग से प्रति-आर्टिफैक्ट नियम

---

### `openspec templates`

किसी स्कीमा में सभी आर्टिफैक्ट्स के लिए हल किए गए टेम्पलेट पथ दिखाएं।

```
openspec templates [options]
```

**विकल्प:**

| विकल्प | विवरण |
|--------|-------------|
| `--schema <name>` | निरीक्षण करने के लिए स्कीमा (डिफ़ॉल्ट: `spec-driven`) |
| `--json` | JSON के रूप में आउटपुट |

**उदाहरण:**

```bash
# डिफ़ॉल्ट स्कीमा के लिए टेम्पलेट पथ दिखाएं
openspec templates

# कस्टम स्कीमा के लिए टेम्पलेट दिखाएं
openspec templates --schema my-workflow

# प्रोग्रामेटिक उपयोग के लिए JSON
openspec templates --json
```

**आउटपुट (टेक्स्ट):**

```
Schema: spec-driven

Templates:
  proposal  → ~/.openspec/schemas/spec-driven/templates/proposal.md
  specs     → ~/.openspec/schemas/spec-driven/templates/specs.md
  design    → ~/.openspec/schemas/spec-driven/templates/design.md
  tasks     → ~/.openspec/schemas/spec-driven/templates/tasks.md
```

---

### `openspec schemas`

उनके विवरण और आर्टिफैक्ट प्रवाह के साथ उपलब्ध वर्कफ़्लो स्कीमा सूचीबद्ध करें।

```
openspec schemas [options]
```

**विकल्प:**

| विकल्प | विवरण |
|--------|-------------|
| `--json` | JSON के रूप में आउटपुट |

**उदाहरण:**

```bash
openspec schemas
```

**आउटपुट:**

```
Available schemas:

  spec-driven (package)
    The default spec-driven development workflow
    Flow: proposal → specs → design → tasks

  my-custom (project)
    Custom workflow for this project
    Flow: research → proposal → tasks
```

---

## स्कीमा आदेश

कस्टम वर्कफ़्लो स्कीमा बनाने और प्रबंधित करने के लिए आदेश।

### `openspec schema init`

एक नया प्रोजेक्ट-लोकल स्कीमा बनाएं।

```
openspec schema init <name> [options]
```

**आर्ग्यूमेंट्स:**

| आर्ग्यूमेंट | आवश्यक | विवरण |
|----------|----------|-------------|
| `name` | हाँ | स्कीमा का नाम (kebab-case) |

**विकल्प:**

| विकल्प | विवरण |
|--------|-------------|
| `--description <text>` | स्कीमा विवरण |
| `--artifacts <list>` | कॉमा-सेपरेटेड आर्टिफैक्ट ID (डिफ़ॉल्ट: `proposal,specs,design,tasks`) |
| `--default` | प्रोजेक्ट डिफ़ॉल्ट स्कीमा के रूप में सेट करें |
| `--no-default` | डिफ़ॉल्ट के रूप में सेट करने के लिए प्रॉम्प्ट न करें |
| `--force` | मौजूदा स्कीमा को ओवरराइट करें |
| `--json` | JSON के रूप में आउटपुट |

**उदाहरण:**

```bash
# इंटरैक्टिव स्कीमा निर्माण
openspec schema init research-first

# विशिष्ट आर्टिफैक्ट्स के साथ गैर-इंटरैक्टिव
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

**यह क्या बनाता है:**

```
openspec/schemas/<name>/
├── schema.yaml           # स्कीमा परिभाषा
└── templates/
    ├── proposal.md       # प्रत्येक आर्टिफैक्ट के लिए टेम्पलेट
    ├── specs.md
    ├── design.md
    └── tasks.md
```

---

### `openspec schema fork`

अनुकूलन के लिए अपने प्रोजेक्ट में एक मौजूदा स्कीमा की कॉपी बनाएं।

```
openspec schema fork <source> [name] [options]
```

**आर्ग्यूमेंट्स:**

| आर्ग्यूमेंट | आवश्यक | विवरण |
|----------|----------|-------------|
| `source` | हाँ | कॉपी करने के लिए स्कीमा |
| `name` | नहीं | नया स्कीमा नाम (डिफ़ॉल्ट: `<source>-custom`) |

**विकल्प:**

| विकल्प | विवरण |
|--------|-------------|
| `--force` | मौजूदा गंतव्य को ओवरराइट करें |
| `--json` | JSON के रूप में आउटपुट |

**उदाहरण:**

```bash
# बिल्ट-इन spec-driven स्कीमा को फोर्क करें
openspec schema fork spec-driven my-workflow
```

---

### `openspec schema validate`

किसी स्कीमा की संरचना और टेम्पलेट्स को सत्यापित करें।

```
openspec schema validate [name] [options]
```

**आर्ग्यूमेंट्स:**

| आर्ग्यूमेंट | आवश्यक | विवरण |
|----------|----------|-------------|
| `name` | नहीं | सत्यापित करने के लिए स्कीमा (यदि छोड़ दिया जाए तो सभी को सत्यापित करता है) |

**विकल्प:**

| विकल्प | विवरण |
|--------|-------------|
| `--verbose` | विस्तृत सत्यापन चरण दिखाएं |
| `--json` | JSON के रूप में आउटपुट |

**उदाहरण:**

```bash
# एक विशिष्ट स्कीमा सत्यापित करें
openspec schema validate my-workflow

# सभी स्कीमा सत्यापित करें
openspec schema validate
```

---

### `openspec schema which`

दिखाएं कि कोई स्कीमा कहाँ से रिज़ॉल्व होता है (प्राथमिकता डीबग करने के लिए उपयोगी)।

```
openspec schema which [name] [options]
```

**आर्ग्यूमेंट्स:**

| आर्ग्यूमेंट | आवश्यक | विवरण |
|----------|----------|-------------|
| `name` | नहीं | स्कीमा का नाम |

**विकल्प:**

| विकल्प | विवरण |
|--------|-------------|
| `--all` | उनके स्रोतों के साथ सभी स्कीमा सूचीबद्ध करें |
| `--json` | JSON के रूप में आउटपुट |

**उदाहरण:**

```bash
# जाँचें कि कोई स्कीमा कहाँ से आता है
openspec schema which spec-driven
```

**आउटपुट:**

```
spec-driven resolves from: package
  Source: /usr/local/lib/node_modules/@fission-ai/openspec/schemas/spec-driven
```

**स्कीमा प्राथमिकता:**

1. प्रोजेक्ट: `openspec/schemas/<name>/`
2. उपयोगकर्ता: `~/.local/share/openspec/schemas/<name>/`
3. पैकेज: बिल्ट-इन स्कीमा

---

## कॉन्फ़िगरेशन कमांड

### `openspec config`

वैश्विक OpenSpec कॉन्फ़िगरेशन देखें और संशोधित करें।

```
openspec config <subcommand> [options]
```

**उपकमांड:**

| उपकमांड | विवरण |
|------------|-------------|
| `path` | कॉन्फ़िग फ़ाइल का स्थान दिखाएं |
| `list` | सभी वर्तमान सेटिंग्स दिखाएं |
| `get <key>` | एक विशिष्ट मान प्राप्त करें |
| `set <key> <value>` | एक मान सेट करें |
| `unset <key>` | एक कुंजी हटाएं |
| `reset` | डिफ़ॉल्ट पर रीसेट करें |
| `edit` | `$EDITOR` में खोलें |
| `profile [preset]` | वर्कफ़्लो प्रोफ़ाइल को इंटरैक्टिव रूप से या प्रीसेट के माध्यम से कॉन्फ़िगर करें |

**उदाहरण:**

```bash
# कॉन्फ़िग फ़ाइल पथ दिखाएं
openspec config path

# सभी सेटिंग्स सूचीबद्ध करें
openspec config list

# एक विशिष्ट मान प्राप्त करें
openspec config get telemetry.enabled

# एक मान सेट करें
openspec config set telemetry.enabled false

# एक स्ट्रिंग मान स्पष्ट रूप से सेट करें
openspec config set user.name "My Name" --string

# एक कस्टम सेटिंग हटाएं
openspec config unset user.name

# सभी कॉन्फ़िगरेशन रीसेट करें
openspec config reset --all --yes

# अपने एडिटर में कॉन्फ़िग संपादित करें
openspec config edit

# एक्शन-आधारित विज़ार्ड के साथ प्रोफ़ाइल कॉन्फ़िगर करें
openspec config profile

# तेज़ प्रीसेट: वर्कफ़्लो को कोर में बदलें (डिलीवरी मोड रखता है)
openspec config profile core
```

`openspec config profile` एक वर्तमान-स्थिति सारांश से शुरू होता है, फिर आपको चुनने देता है:
- डिलीवरी + वर्कफ़्लो बदलें
- केवल डिलीवरी बदलें
- केवल वर्कफ़्लो बदलें
- वर्तमान सेटिंग्स रखें (बाहर निकलें)

यदि आप वर्तमान सेटिंग्स रखते हैं, तो कोई परिवर्तन नहीं लिखे जाते हैं और कोई अपडेट प्रॉम्प्ट नहीं दिखाया जाता है।
यदि कोई कॉन्फ़िग परिवर्तन नहीं हैं लेकिन वर्तमान प्रोजेक्ट फ़ाइलें आपकी वैश्विक प्रोफ़ाइल/डिलीवरी से सिंक में नहीं हैं, तो OpenSpec एक चेतावनी दिखाएगा और `openspec update` चलाने का सुझाव देगा।
`Ctrl+C` दबाने से भी प्रवाह साफ तरीके से रद्द हो जाता है (कोई स्टैक ट्रेस नहीं) और कोड `130` के साथ बाहर निकल जाता है।
वर्कफ़्लो चेकलिस्ट में, `[x]` का अर्थ है कि वर्कफ़्लो वैश्विक कॉन्फ़िग में चयनित है। इन चयनों को प्रोजेक्ट फ़ाइलों पर लागू करने के लिए, `openspec update` चलाएं (या प्रोजेक्ट के अंदर प्रॉम्प्ट किए जाने पर `Apply changes to this project now?` चुनें)।

**इंटरैक्टिव उदाहरण:**

```bash
# केवल डिलीवरी अपडेट
openspec config profile
# चुनें: Change delivery only
# डिलीवरी चुनें: Skills only

# केवल वर्कफ़्लो अपडेट
openspec config profile
# चुनें: Change workflows only
# चेकलिस्ट में वर्कफ़्लो टॉगल करें, फिर पुष्टि करें
```

---

## यूटिलिटी कमांड

### `openspec feedback`

OpenSpec के बारे में प्रतिक्रिया सबमिट करें। एक GitHub इश्यू बनाता है।

```
openspec feedback <message> [options]
```

**आर्ग्यूमेंट:**

| आर्ग्यूमेंट | आवश्यक | विवरण |
|----------|----------|-------------|
| `message` | हाँ | प्रतिक्रिया संदेश |

**विकल्प:**

| विकल्प | विवरण |
|--------|-------------|
| `--body <text>` | विस्तृत विवरण |

**आवश्यकताएं:** GitHub CLI (`gh`) इंस्टॉल और प्रमाणित होना चाहिए।

**उदाहरण:**

```bash
openspec feedback "Add support for custom artifact types" \
  --body "I'd like to define my own artifact types beyond the built-in ones."
```

---

### `openspec completion`

OpenSpec CLI के लिए शेल कम्प्लीशन प्रबंधित करें।

```
openspec completion <subcommand> [shell]
```

**उपकमांड:**

| उपकमांड | विवरण |
|------------|-------------|
| `generate [shell]` | कम्प्लीशन स्क्रिप्ट को stdout पर आउटपुट करें |
| `install [shell]` | अपने शेल के लिए कम्प्लीशन इंस्टॉल करें |
| `uninstall [shell]` | इंस्टॉल किए गए कम्प्लीशन हटाएं |

**समर्थित शेल:** `bash`, `zsh`, `fish`, `powershell`

**उदाहरण:**

```bash
# कम्प्लीशन इंस्टॉल करें (शेल का स्वतः पता लगाता है)
openspec completion install

# विशिष्ट शेल के लिए इंस्टॉल करें
openspec completion install zsh

# मैनुअल इंस्टॉलेशन के लिए स्क्रिप्ट जनरेट करें
openspec completion generate bash > ~/.bash_completion.d/openspec

# अनइंस्टॉल करें
openspec completion uninstall
```

---

## एग्ज़िट कोड

| कोड | अर्थ |
|------|---------|
| `0` | सफलता |
| `1` | त्रुटि (सत्यापन विफलता, गुम फ़ाइलें, आदि) |

---

## एनवायरनमेंट वेरिएबल्स

| वेरिएबल | विवरण |
|----------|-------------|
| `OPENSPEC_TELEMETRY` | टेलीमेट्री अक्षम करने के लिए `0` पर सेट करें |
| `DO_NOT_TRACK` | टेलीमेट्री अक्षम करने के लिए `1` पर सेट करें (मानक DNT सिग्नल) |
| `OPENSPEC_CONCURRENCY` | बल्क सत्यापन के लिए डिफ़ॉल्ट समवर्तिता (डिफ़ॉल्ट: 6) |
| `EDITOR` या `VISUAL` | `openspec config edit` के लिए एडिटर |
| `NO_COLOR` | सेट होने पर रंग आउटपुट अक्षम करें |

---

## संबंधित दस्तावेज़

- [Commands](commands.md) - AI स्लैश कमांड (`/opsx:propose`, `/opsx:apply`, आदि)
- [Workflows](workflows.md) - सामान्य पैटर्न और प्रत्येक कमांड का उपयोग कब करें
- [Customization](customization.md) - कस्टम स्कीमा और टेम्पलेट बनाएं
- [Getting Started](getting-started.md) - पहली बार सेटअप गाइड
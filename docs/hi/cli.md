# CLI संदर्भ

OpenSpec CLI (`openspec`) प्रोजेक्ट सेटअप, सत्यापन, स्थिति निरीक्षण और प्रबंधन के लिए टर्मिनल कमांड प्रदान करता है। ये कमांड [कमांड](commands.md) में दस्तावेज़ किए गए AI स्लैश कमांड (जैसे `/opsx:propose`) के पूरक हैं।

## सारांश

| श्रेणी | कमांड | उद्देश्य |
|----------|----------|---------|
| **सेटअप** | `init`, `update` | अपने प्रोजेक्ट में OpenSpec को आरंभ और अपडेट करें |
| **ब्राउज़िंग** | `list`, `view`, `show` | परिवर्तनों और स्पेसिफिकेशन का अन्वेषण करें |
| **सत्यापन** | `validate` | परिवर्तनों और स्पेसिफिकेशन की जाँच करें |
| **जीवनचक्र** | `archive` | पूर्ण परिवर्तनों को अंतिम रूप दें |
| **वर्कफ़्लो** | `status`, `instructions`, `templates`, `schemas` | आर्टिफ़ैक्ट-संचालित वर्कफ़्लो समर्थन |
| **स्कीमा** | `schema init`, `schema fork`, `schema validate`, `schema which` | कस्टम वर्कफ़्लो बनाएँ और प्रबंधित करें |
| **कॉन्फ़िग** | `config` | सेटिंग्स देखें और संशोधित करें |
| **उपयोगिता** | `feedback`, `completion` | प्रतिक्रिया और शेल इंटीग्रेशन |

---

## मानव बनाम एजेंट कमांड

अधिकांश CLI कमांड **मानव उपयोग** के लिए टर्मिनल में डिज़ाइन किए गए हैं। कुछ कमांड JSON आउटपुट के माध्यम से **एजेंट/स्क्रिप्ट उपयोग** भी समर्थित करते हैं।

### केवल मानव कमांड

ये कमांड इंटरैक्टिव हैं और टर्मिनल उपयोग के लिए डिज़ाइन किए गए हैं:

| कमांड | उद्देश्य |
|---------|---------|
| `openspec init` | प्रोजेक्ट इनिशियलाइज़ करें (इंटरैक्टिव प्रॉम्प्ट) |
| `openspec view` | इंटरैक्टिव डैशबोर्ड |
| `openspec config edit` | एडिटर में कॉन्फ़िग खोलें |
| `openspec feedback` | GitHub के माध्यम से फीडबैक सबमिट करें |
| `openspec completion install` | शेल कम्प्लीशन इंस्टॉल करें |

### एजेंट-संगत कमांड

ये कमांड AI एजेंट्स और स्क्रिप्ट्स द्वारा प्रोग्रामेटिक उपयोग के लिए `--json` आउटपुट का समर्थन करते हैं:

| कमांड | मानव उपयोग | एजेंट उपयोग |
|---------|-----------|-----------|
| `openspec list` | परिवर्तन/स्पेक्स ब्राउज़ करें | संरचित डेटा के लिए `--json` |
| `openspec show <item>` | सामग्री पढ़ें | पार्सिंग के लिए `--json` |
| `openspec validate` | समस्याओं की जाँच करें | बल्क वैलिडेशन के लिए `--all --json` |
| `openspec status` | आर्टिफैक्ट प्रगति देखें | संरचित स्थिति के लिए `--json` |
| `openspec instructions` | अगले कदम प्राप्त करें | एजेंट निर्देशों के लिए `--json` |
| `openspec templates` | टेम्पलेट पथ खोजें | पथ संकल्पना के लिए `--json` |
| `openspec schemas` | उपलब्ध स्कीमा सूचीबद्ध करें | स्कीमा खोज के लिए `--json` |

---

## वैश्विक विकल्प

ये विकल्प सभी कमांड्स के साथ काम करते हैं:

| विकल्प | विवरण |
|--------|-------------|
| `--version`, `-V` | संस्करण संख्या दिखाएँ |
| `--no-color` | रंग आउटपुट अक्षम करें |
| `--help`, `-h` | कमांड के लिए सहायता प्रदर्शित करें |

---

## सेटअप कमांड

### `openspec init`

अपने प्रोजेक्ट में OpenSpec इनिशियलाइज़ करें। फ़ोल्डर संरचना बनाता है और AI टूल इंटीग्रेशन कॉन्फ़िगर करता है।

डिफ़ॉल्ट व्यवहार वैश्विक कॉन्फ़िग डिफ़ॉल्ट्स का उपयोग करता है: प्रोफ़ाइल `core`, डिलीवरी `both`, वर्कफ़्लो `propose, explore, apply, archive`।

```
openspec init [path] [options]
```

**तर्क:**

| तर्क | आवश्यक | विवरण |
|----------|----------|-------------|
| `path` | नहीं | लक्ष्य निर्देशिका (डिफ़ॉल्ट: वर्तमान निर्देशिका) |

**विकल्प:**

| विकल्प | विवरण |
|--------|-------------|
| `--tools <list>` | गैर-इंटरैक्टिव रूप से AI टूल्स कॉन्फ़िगर करें। `all`, `none`, या अल्पविराम से अलग की गई सूची का उपयोग करें |
| `--force` | प्रॉम्प्ट के बिना लेगेसी फ़ाइलों को स्वचालित रूप से साफ़ करें |
| `--profile <profile>` | इस init रन के लिए वैश्विक प्रोफ़ाइल ओवरराइड करें (`core` या `custom`) |

`--profile custom` वैश्विक कॉन्फ़िग (`openspec config profile`) में वर्तमान में चयनित वर्कफ़्लो का उपयोग करता है।

**समर्थित टूल आईडी (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `claude`, `cline`, `codex`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `kilocode`, `kiro`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `windsurf`

**उदाहरण:**

```bash
# इंटरैक्टिव इनिशियलाइज़ेशन
openspec init

# एक विशिष्ट निर्देशिका में इनिशियलाइज़ करें
openspec init ./my-project

# गैर-इंटरैक्टिव: Claude और Cursor के लिए कॉन्फ़िगर करें
openspec init --tools claude,cursor

# सभी समर्थित टूल्स के लिए कॉन्फ़िगर करें
openspec init --tools all

# इस रन के लिए प्रोफ़ाइल ओवरराइड करें
openspec init --profile core

# प्रॉम्प्ट्स को स्किप करें और लेगेसी फ़ाइलों को स्वचालित रूप से साफ़ करें
openspec init --force
```

**यह क्या बनाता है:**

```
openspec/
├── specs/              # आपकी स्पेसिफिकेशन्स (सत्य का स्रोत)
├── changes/            # प्रस्तावित परिवर्तन
└── config.yaml         # प्रोजेक्ट कॉन्फ़िगरेशन

.claude/skills/         # Claude Code स्किल्स (यदि claude चयनित हो)
.cursor/skills/         # Cursor स्किल्स (यदि cursor चयनित हो)
.cursor/commands/       # Cursor OPSX कमांड्स (यदि डिलीवरी में कमांड्स शामिल हों)
... (अन्य टूल कॉन्फ़िग्स)
```

---

### `openspec update`

CLI अपग्रेड करने के बाद OpenSpec निर्देश फ़ाइलें अपडेट करें। आपकी वर्तमान वैश्विक प्रोफ़ाइल, चयनित वर्कफ़्लो और डिलीवरी मोड का उपयोग करके AI टूल कॉन्फ़िगरेशन फ़ाइलें पुनः जनरेट करता है।

```
openspec update [path] [options]
```

**तर्क:**

| तर्क | आवश्यक | विवरण |
|----------|----------|-------------|
| `path` | नहीं | लक्ष्य निर्देशिका (डिफ़ॉल्ट: वर्तमान निर्देशिका) |

**विकल्प:**

| विकल्प | विवरण |
|--------|-------------|
| `--force` | फ़ाइलें अप टू डेट होने पर भी अपडेट बाध्य करें |

**उदाहरण:**

```bash
# npm अपग्रेड के बाद निर्देश फ़ाइलें अपडेट करें
npm update @fission-ai/openspec
openspec update
```

---

## ब्राउज़िंग कमांड

### `openspec list`

अपने प्रोजेक्ट में परिवर्तन या स्पेक्स सूचीबद्ध करें।

```
openspec list [options]
```

**विकल्प:**

| विकल्प | विवरण |
|--------|-------------|
| `--specs` | परिवर्तनों के बजाय स्पेक्स सूचीबद्ध करें |
| `--changes` | परिवर्तन सूचीबद्ध करें (डिफ़ॉल्ट) |
| `--sort <order>` | `recent` (डिफ़ॉल्ट) या `name` के अनुसार क्रमबद्ध करें |
| `--json` | JSON के रूप में आउटपुट करें |

**उदाहरण:**

```bash
# सभी सक्रिय परिवर्तन सूचीबद्ध करें
openspec list

# सभी स्पेक्स सूचीबद्ध करें
openspec list --specs

# स्क्रिप्ट्स के लिए JSON आउटपुट
openspec list --json
```

**आउटपुट (पाठ):**

```
Active changes:
  add-dark-mode     UI theme switching support
  fix-login-bug     Session timeout handling
```

---

### `openspec view`

स्पेक्स और परिवर्तनों का पता लगाने के लिए एक इंटरैक्टिव डैशबोर्ड प्रदर्शित करें।

```
openspec view
```

आपके प्रोजेक्ट की स्पेसिफिकेशन्स और परिवर्तनों को नेविगेट करने के लिए एक टर्मिनल-आधारित इंटरफ़ेस खोलता है।

---

### `openspec show`

परिवर्तन या स्पेक का विवरण प्रदर्शित करें।

```
openspec show [item-name] [options]
```

**तर्क:**

| तर्क | आवश्यक | विवरण |
|----------|----------|-------------|
| `item-name` | नहीं | परिवर्तन या स्पेक का नाम (छोड़ दिए जाने पर प्रॉम्प्ट करता है) |

**विकल्प:**

| विकल्प | विवरण |
|--------|-------------|
| `--type <type>` | प्रकार निर्दिष्ट करें: `change` या `spec` (अस्पष्ट होने पर स्वतः पता लगाता है) |
| `--json` | JSON के रूप में आउटपुट करें |
| `--no-interactive` | प्रॉम्प्ट्स अक्षम करें |

**परिवर्तन-विशिष्ट विकल्प:**

| विकल्प | विवरण |
|--------|-------------|
| `--deltas-only` | केवल डेल्टा स्पेक्स दिखाएँ (JSON मोड) |

**स्पेक-विशिष्ट विकल्प:**

| विकल्प | विवरण |
|--------|-------------|
| `--requirements` | केवल आवश्यकताएँ दिखाएँ, परिदृश्यों को बाहर करें (JSON मोड) |
| `--no-scenarios` | परिदृश्य सामग्री को बाहर करें (JSON मोड) |
| `-r, --requirement <id>` | 1-आधारित इंडेक्स द्वारा विशिष्ट आवश्यकता दिखाएँ (JSON मोड) |

**उदाहरण:**

```bash
# इंटरैक्टिव चयन
openspec show

# एक विशिष्ट परिवर्तन दिखाएँ
openspec show add-dark-mode

# एक विशिष्ट स्पेक दिखाएँ
openspec show auth --type spec

# पार्सिंग के लिए JSON आउटपुट
openspec show add-dark-mode --json
```

---

## वैलिडेशन कमांड

### `openspec validate`

संरचनात्मक समस्याओं के लिए परिवर्तन और स्पेक्स को मान्य करें।

```
openspec validate [item-name] [options]
```

**तर्क:**

| तर्क | आवश्यक | विवरण |
|----------|----------|-------------|
| `item-name` | नहीं | मान्य करने के लिए विशिष्ट आइटम (छोड़ दिए जाने पर प्रॉम्प्ट करता है) |

**विकल्प:**

| विकल्प | विवरण |
|--------|-------------|
| `--all` | सभी परिवर्तन और स्पेक्स मान्य करें |
| `--changes` | सभी परिवर्तन मान्य करें |
| `--specs` | सभी स्पेक्स मान्य करें |
| `--type <type>` | नाम अस्पष्ट होने पर प्रकार निर्दिष्ट करें: `change` या `spec` |
| `--strict` | सख्त वैलिडेशन मोड सक्षम करें |
| `--json` | JSON के रूप में आउटपुट करें |
| `--concurrency <n>` | अधिकतम समानांतर वैलिडेशन (डिफ़ॉल्ट: 6, या `OPENSPEC_CONCURRENCY` env) |
| `--no-interactive` | प्रॉम्प्ट्स अक्षम करें |

**उदाहरण:**

```bash
# इंटरैक्टिव वैलिडेशन
openspec validate

# एक विशिष्ट परिवर्तन मान्य करें
openspec validate add-dark-mode

# सभी परिवर्तन मान्य करें
openspec validate --changes

# JSON आउटपुट के साथ सब कुछ मान्य करें (CI/स्क्रिप्ट्स के लिए)
openspec validate --all --json

# बढ़ी हुई समानांतरता के साथ सख्त वैलिडेशन
openspec validate --all --strict --concurrency 12
```

**आउटपुट (पाठ):**

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

## लाइफ़साइकिल कमांड

### `openspec archive`

एक पूर्ण परिवर्तन को आर्काइव करें और डेल्टा स्पेक्स को मुख्य स्पेक्स में मर्ज करें।

```
openspec archive [change-name] [options]
```

**तर्क:**

| तर्क | आवश्यक | विवरण |
|----------|----------|-------------|
| `change-name` | नहीं | आर्काइव करने के लिए परिवर्तन (छोड़ दिए जाने पर प्रॉम्प्ट करता है) |

**विकल्प:**

| विकल्प | विवरण |
|--------|-------------|
| `-y, --yes` | पुष्टिकरण प्रॉम्प्ट्स को स्किप करें |
| `--skip-specs` | स्पेक अपडेट्स को स्किप करें (केवल इंफ्रास्ट्रक्चर/टूलिंग/डॉक परिवर्तनों के लिए) |
| `--no-validate` | वैलिडेशन को स्किप करें (पुष्टि की आवश्यकता है) |

**उदाहरण:**

```bash
# इंटरैक्टिव आर्काइव
openspec archive

# विशिष्ट परिवर्तन आर्काइव करें
openspec archive add-dark-mode

# प्रॉम्प्ट्स के बिना आर्काइव करें (CI/स्क्रिप्ट्स)
openspec archive add-dark-mode --yes

# एक टूलिंग परिवर्तन आर्काइव करें जो स्पेक्स को प्रभावित नहीं करता
openspec archive update-ci-config --skip-specs
```

**यह क्या करता है:**

1. परिवर्तन को मान्य करता है (जब तक `--no-validate` न हो)
2. पुष्टि के लिए प्रॉम्प्ट करता है (जब तक `--yes` न हो)
3. डेल्टा स्पेक्स को `openspec/specs/` में मर्ज करता है
4. परिवर्तन फ़ोल्डर को `openspec/changes/archive/YYYY-MM-DD-<name>/` में ले जाता है

---

## वर्कफ़्लो कमांड

ये कमांड आर्टिफैक्ट-संचालित OPSX वर्कफ़्लो का समर्थन करते हैं। ये प्रगति की जाँच करने वाले मानवों और अगले कदम निर्धारित करने वाले एजेंट्स दोनों के लिए उपयोगी हैं।

### `openspec status`

परिवर्तन के लिए आर्टिफैक्ट पूर्णता स्थिति प्रदर्शित करें।

```
openspec status [options]
```

**विकल्प:**

| विकल्प | विवरण |
|--------|-------------|
| `--change <id>` | परिवर्तन का नाम (छोड़ दिए जाने पर प्रॉम्प्ट करता है) |
| `--schema <name>` | स्कीमा ओवरराइड (परिवर्तन के कॉन्फ़िग से स्वतः पता लगाया जाता है) |
| `--json` | JSON के रूप में आउटपुट करें |

**उदाहरण:**

```bash
# इंटरैक्टिव स्थिति जाँच
openspec status

# विशिष्ट परिवर्तन के लिए स्थिति
openspec status --change add-dark-mode

# एजेंट उपयोग के लिए JSON
openspec status --change add-dark-mode --json
```

**आउटपुट (पाठ):**

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

एक आर्टिफैक्ट बनाने या टास्क लागू करने के लिए समृद्ध निर्देश प्राप्त करें। AI एजेंट्स द्वारा यह समझने के लिए उपयोग किया जाता है कि अगला क्या बनाना है।

```
openspec instructions [artifact] [options]
```

**तर्क:**

| तर्क | आवश्यक | विवरण |
|----------|----------|-------------|
| `artifact` | नहीं | आर्टिफैक्ट आईडी: `proposal`, `specs`, `design`, `tasks`, या `apply` |

**विकल्प:**

| विकल्प | विवरण |
|--------|-------------|
| `--change <id>` | परिवर्तन का नाम (गैर-इंटरैक्टिव मोड में आवश्यक) |
| `--schema <name>` | स्कीमा ओवरराइड |
| `--json` | JSON के रूप में आउटपुट करें |

**विशेष स्थिति:** टास्क कार्यान्वयन निर्देश प्राप्त करने के लिए आर्टिफैक्ट के रूप में `apply` का उपयोग करें।

**उदाहरण:**

```bash
# अगले आर्टिफैक्ट के लिए निर्देश प्राप्त करें
openspec instructions --change add-dark-mode

# विशिष्ट आर्टिफैक्ट निर्देश प्राप्त करें
openspec instructions design --change add-dark-mode

# अप्लाई/कार्यान्वयन निर्देश प्राप्त करें
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

एक स्कीमा में सभी आर्टिफैक्ट्स के लिए संकलित टेम्पलेट पथ दिखाएँ।

```
openspec templates [options]
```

**विकल्प:**

| विकल्प | विवरण |
|--------|-------------|
| `--schema <name>` | निरीक्षण के लिए स्कीमा (डिफ़ॉल्ट: `spec-driven`) |
| `--json` | JSON के रूप में आउटपुट करें |

**उदाहरण:**

```bash
# डिफ़ॉल्ट स्कीमा के लिए टेम्पलेट पथ दिखाएँ
openspec templates

# कस्टम स्कीमा के लिए टेम्पलेट दिखाएँ
openspec templates --schema my-workflow

# प्रोग्रामेटिक उपयोग के लिए JSON
openspec templates --json
```

**आउटपुट (पाठ):**

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

उनके विवरण और आर्टिफैक्ट फ़्लो के साथ उपलब्ध वर्कफ़्लो स्कीमा सूचीबद्ध करें।

```
openspec schemas [options]
```

**विकल्प:**

| विकल्प | विवरण |
|--------|-------------|
| `--json` | JSON के रूप में आउटपुट करें |

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

## स्कीमा कमांड्स

कस्टम वर्कफ़्लो स्कीमाज़ बनाने और प्रबंधित करने के लिए कमांड्स।

### `openspec schema init`

एक नई प्रोजेक्ट-लोकल स्कीमा बनाएं।

```
openspec schema init <name> [options]
```

**आर्गुमेंट्स:**

| आर्गुमेंट | आवश्यक | विवरण |
|----------|----------|-------------|
| `name` | हाँ | स्कीमा का नाम (kebab-case) |

**विकल्प:**

| विकल्प | विवरण |
|--------|-------------|
| `--description <text>` | स्कीमा का विवरण |
| `--artifacts <list>` | अल्पविराम से अलग किए गए आर्टिफ़ैक्ट आईडी (डिफ़ॉल्ट: `proposal,specs,design,tasks`) |
| `--default` | प्रोजेक्ट की डिफ़ॉल्ट स्कीमा के रूप में सेट करें |
| `--no-default` | डिफ़ॉल्ट के रूप में सेट करने के लिए न पूछें |
| `--force` | मौजूदा स्कीमा को ओवरराइट करें |
| `--json` | JSON के रूप में आउटपुट करें |

**उदाहरण:**

```bash
# इंटरैक्टिव स्कीमा निर्माण
openspec schema init research-first

# विशिष्ट आर्टिफ़ैक्ट्स के साथ गैर-इंटरैक्टिव
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
    ├── proposal.md       # प्रत्येक आर्टिफ़ैक्ट के लिए टेम्पलेट
    ├── specs.md
    ├── design.md
    └── tasks.md
```

---

### `openspec schema fork`

कस्टमाइज़ेशन के लिए अपने प्रोजेक्ट में एक मौजूदा स्कीमा की प्रतिलिपि बनाएं।

```
openspec schema fork <source> [name] [options]
```

**आर्गुमेंट्स:**

| आर्गुमेंट | आवश्यक | विवरण |
|----------|----------|-------------|
| `source` | हाँ | कॉपी करने के लिए स्कीमा |
| `name` | नहीं | नई स्कीमा का नाम (डिफ़ॉल्ट: `<source>-custom`) |

**विकल्प:**

| विकल्प | विवरण |
|--------|-------------|
| `--force` | मौजूदा गंतव्य को ओवरराइट करें |
| `--json` | JSON के रूप में आउटपुट करें |

**उदाहरण:**

```bash
# बिल्ट-इन spec-driven स्कीमा को फ़ोर्क करें
openspec schema fork spec-driven my-workflow
```

---

### `openspec schema validate`

एक स्कीमा की संरचना और टेम्पलेट्स को मान्य करें।

```
openspec schema validate [name] [options]
```

**आर्गुमेंट्स:**

| आर्गुमेंट | आवश्यक | विवरण |
|----------|----------|-------------|
| `name` | नहीं | मान्य करने के लिए स्कीमा (छोड़ने पर सभी को मान्य करता है) |

**विकल्प:**

| विकल्प | विवरण |
|--------|-------------|
| `--verbose` | विस्तृत मान्यता चरण दिखाएं |
| `--json` | JSON के रूप में आउटपुट करें |

**उदाहरण:**

```bash
# एक विशिष्ट स्कीमा को मान्य करें
openspec schema validate my-workflow

# सभी स्कीमाज़ को मान्य करें
openspec schema validate
```

---

### `openspec schema which`

दिखाएं कि एक स्कीमा कहाँ से रिज़ॉल्व होती है (प्राथमिकता डीबगिंग के लिए उपयोगी)।

```
openspec schema which [name] [options]
```

**आर्गुमेंट्स:**

| आर्गुमेंट | आवश्यक | विवरण |
|----------|----------|-------------|
| `name` | नहीं | स्कीमा का नाम |

**विकल्प:**

| विकल्प | विवरण |
|--------|-------------|
| `--all` | उनके स्रोतों के साथ सभी स्कीमाज़ सूचीबद्ध करें |
| `--json` | JSON के रूप में आउटपुट करें |

**उदाहरण:**

```bash
# जांचें कि एक स्कीमा कहाँ से आती है
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
3. पैकेज: बिल्ट-इन स्कीमाज़

---

## कॉन्फ़िगरेशन कमांड्स

### `openspec config`

वैश्विक OpenSpec कॉन्फ़िगरेशन देखें और संशोधित करें।

```
openspec config <subcommand> [options]
```

**सबकमांड्स:**

| सबकमांड | विवरण |
|------------|-------------|
| `path` | कॉन्फ़िग फ़ाइल स्थान दिखाएं |
| `list` | सभी वर्तमान सेटिंग्स दिखाएं |
| `get <key>` | एक विशिष्ट मान प्राप्त करें |
| `set <key> <value>` | एक मान सेट करें |
| `unset <key>` | एक कुंजी हटाएं |
| `reset` | डिफ़ॉल्ट्स पर रीसेट करें |
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

# स्पष्ट रूप से एक स्ट्रिंग मान सेट करें
openspec config set user.name "My Name" --string

# एक कस्टम सेटिंग हटाएं
openspec config unset user.name

# सभी कॉन्फ़िगरेशन रीसेट करें
openspec config reset --all --yes

# अपने एडिटर में कॉन्फ़िग संपादित करें
openspec config edit

# एक्शन-आधारित विज़ार्ड के साथ प्रोफ़ाइल कॉन्फ़िगर करें
openspec config profile

# तेज़ प्रीसेट: वर्कफ़्लोज़ को कोर में स्विच करें (डिलीवरी मोड रखता है)
openspec config profile core
```

`openspec config profile` एक वर्तमान-स्थिति सारांश के साथ शुरू होता है, फिर आपको चुनने देता है:
- डिलीवरी + वर्कफ़्लोज़ बदलें
- केवल डिलीवरी बदलें
- केवल वर्कफ़्लोज़ बदलें
- वर्तमान सेटिंग्स रखें (बाहर निकलें)

यदि आप वर्तमान सेटिंग्स रखते हैं, तो कोई बदलाव नहीं लिखा जाता है और कोई अपडेट प्रॉम्प्ट नहीं दिखाया जाता है।
यदि कोई कॉन्फ़िग बदलाव नहीं हैं लेकिन वर्तमान प्रोजेक्ट फ़ाइलें आपकी वैश्विक प्रोफ़ाइल/डिलीवरी के साथ सिंक में नहीं हैं, तो OpenSpec एक चेतावनी दिखाएगा और `openspec update` चलाने का सुझाव देगा।
`Ctrl+C` दबाने से भी प्रवाह स्वच्छ रूप से रद्द हो जाता है (कोई स्टैक ट्रेस नहीं) और कोड `130` के साथ बाहर निकलता है।
वर्कफ़्लो चेकलिस्ट में, `[x]` का मतलब है कि वर्कफ़्लो वैश्विक कॉन्फ़िग में चयनित है। उन चयनों को प्रोजेक्ट फ़ाइलों पर लागू करने के लिए, `openspec update` चलाएं (या प्रोजेक्ट के अंदर प्रॉम्प्ट किए जाने पर `Apply changes to this project now?` चुनें)।

**इंटरैक्टिव उदाहरण:**

```bash
# केवल डिलीवरी अपडेट
openspec config profile
# चुनें: Change delivery only
# डिलीवरी चुनें: Skills only

# केवल वर्कफ़्लोज़ अपडेट
openspec config profile
# चुनें: Change workflows only
# चेकलिस्ट में वर्कफ़्लोज़ टॉगल करें, फिर पुष्टि करें
```

---

## उपयोगिता कमांड्स

### `openspec feedback`

OpenSpec के बारे में प्रतिक्रिया सबमिट करें। एक GitHub इश्यू बनाता है।

```
openspec feedback <message> [options]
```

**आर्गुमेंट्स:**

| आर्गुमेंट | आवश्यक | विवरण |
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

**सबकमांड्स:**

| सबकमांड | विवरण |
|------------|-------------|
| `generate [shell]` | कम्प्लीशन स्क्रिप्ट को stdout पर आउटपुट करें |
| `install [shell]` | अपने शेल के लिए कम्प्लीशन इंस्टॉल करें |
| `uninstall [shell]` | इंस्टॉल किए गए कम्प्लीशन हटाएं |

**समर्थित शेल्स:** `bash`, `zsh`, `fish`, `powershell`

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

## एग्ज़िट कोड्स

| कोड | अर्थ |
|------|---------|
| `0` | सफलता |
| `1` | त्रुटि (मान्यता विफलता, गायब फ़ाइलें, आदि) |

---

## एनवायरनमेंट वेरिएबल्स

| वेरिएबल | विवरण |
|----------|-------------|
| `OPENSPEC_TELEMETRY` | टेलीमेट्री अक्षम करने के लिए `0` पर सेट करें |
| `DO_NOT_TRACK` | टेलीमेट्री अक्षम करने के लिए `1` पर सेट करें (मानक DNT सिग्नल) |
| `OPENSPEC_CONCURRENCY` | बल्क मान्यता के लिए डिफ़ॉल्ट समानांतरता (डिफ़ॉल्ट: 6) |
| `EDITOR` या `VISUAL` | `openspec config edit` के लिए एडिटर |
| `NO_COLOR` | सेट होने पर रंग आउटपुट अक्षम करें |

---

## संबंधित दस्तावेज़

- [कमांड्स](commands.md) - AI स्लैश कमांड्स (`/opsx:propose`, `/opsx:apply`, आदि)
- [वर्कफ़्लोज़](workflows.md) - सामान्य पैटर्न और प्रत्येक कमांड का उपयोग कब करें
- [कस्टमाइज़ेशन](customization.md) - कस्टम स्कीमाज़ और टेम्पलेट्स बनाएं
- [शुरुआत करना](getting-started.md) - पहली बार सेटअप गाइड
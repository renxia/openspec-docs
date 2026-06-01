# CLI संदर्भ

OpenSpec CLI (`openspec`) परियोजना सेटअप, सत्यापन, स्थिति निरीक्षण और प्रबंधन के लिए टर्मिनल कमांड प्रदान करता है। ये कमांड [कमांड](commands.md) में दस्तावेज़ किए गए AI स्लैश कमांड (जैसे `/opsx:propose`) को पूरक करते हैं।

## सारांश

| श्रेणी | कमांड | उद्देश्य |
|----------|----------|---------|
| **सेटअप** | `init`, `update` | अपने प्रोजेक्ट में OpenSpec को प्रारंभ और अपडेट करें |
| **वर्कस्पेस (बीटा)** | `workspace setup`, `workspace list`, `workspace ls`, `workspace link`, `workspace relink`, `workspace doctor`, `workspace update`, `workspace open` | लिंक किए गए रिपो या फ़ोल्डर्स पर स्थानीय दृश्य सेट करें |
| **साझा संदर्भ (बीटा)** | `context-store setup`, `context-store register`, `context-store unregister`, `context-store remove`, `context-store list`, `context-store doctor`, `initiative create`, `initiative show`, `initiative list` | स्थानीय संदर्भ-स्टोर पंजीकरण और स्थायी पहल संदर्भ प्रबंधित करें |
| **ब्राउज़िंग** | `list`, `view`, `show` | परिवर्तन और स्पेक्स का अन्वेषण करें |
| **सत्यापन** | `validate` | समस्याओं के लिए परिवर्तन और स्पेक्स की जाँच करें |
| **लाइफ़साइकिल** | `archive` | पूर्ण किए गए परिवर्तनों को अंतिम रूप दें |
| **वर्कफ़्लो** | `new change`, `set change`, `status`, `instructions`, `templates`, `schemas` | आर्टिफैक्ट-संचालित वर्कफ़्लो समर्थन |
| **स्कीमा** | `schema init`, `schema fork`, `schema validate`, `schema which` | कस्टम वर्कफ़्लो बनाएँ और प्रबंधित करें |
| **कॉन्फ़िगरेशन** | `config` | सेटिंग्स देखें और संशोधित करें |
| **यूटिलिटी** | `feedback`, `completion` | फ़ीडबैक और शेल एकीकरण |

---

## मानव बनाम एजेंट कमांड

अधिकांश CLI कमांड टर्मिनल में **मानव उपयोग** के लिए डिज़ाइन किए गए हैं। कुछ कमांड JSON आउटपुट के माध्यम से **एजेंट/स्क्रिप्ट उपयोग** को भी समर्थन करते हैं।

### केवल मानव कमांड

ये कमांड इंटरैक्टिव हैं और टर्मिनल उपयोग के लिए डिज़ाइन किए गए हैं:

| कमांड | उद्देश्य |
|---------|---------|
| `openspec init` | प्रोजेक्ट आरंभ करें (इंटरैक्टिव प्रॉम्प्ट) |
| `openspec view` | इंटरैक्टिव डैशबोर्ड |
| `openspec config edit` | एडिटर में कॉन्फ़िगरेशन खोलें |
| `openspec feedback` | GitHub के माध्यम से प्रतिक्रिया सबमिट करें |
| `openspec completion install` | शेल कम्प्लीशन इंस्टॉल करें |

### एजेंट-संगत कमांड

ये कमांड AI एजेंटों और स्क्रिप्ट द्वारा प्रोग्रामेटिक उपयोग के लिए `--json` आउटपुट का समर्थन करते हैं:

| कमांड | मानव उपयोग | एजेंट उपयोग |
|---------|-----------|-----------|
| `openspec list` | परिवर्तन/विनिर्देश ब्राउज़ करें | संरचित डेटा के लिए `--json` |
| `openspec show <item>` | सामग्री पढ़ें | पार्सिंग के लिए `--json` |
| `openspec validate` | समस्याओं के लिए जाँच करें | बल्क वैलिडेशन के लिए `--all --json` |
| `openspec status` | आर्टिफैक्ट प्रगति देखें | संरचित स्थिति के लिए `--json` |
| `openspec instructions` | अगले चरण प्राप्त करें | एजेंट निर्देशों के लिए `--json` |
| `openspec templates` | टेम्पलेट पथ खोजें | पथ रिज़ॉल्यूशन के लिए `--json` |
| `openspec schemas` | उपलब्ध स्कीमा सूची देखें | स्कीमा खोज के लिए `--json` |
| `openspec workspace setup --no-interactive` | स्पष्ट इनपुट के साथ वर्कस्पेस बनाएँ | संरचित सेटअप आउटपुट के लिए `--json` |
| `openspec workspace list` | ज्ञात वर्कस्पेस ब्राउज़ करें | टाइप्ड वर्कस्पेस ऑब्जेक्ट के लिए `--json` |
| `openspec workspace link` | रेपो या फ़ोल्डर लिंक करें | संरचित लिंक आउटपुट के लिए `--json` |
| `openspec workspace relink` | लिंक्ड पथ की मरम्मत करें | संरचित लिंक आउटपुट के लिए `--json` |
| `openspec workspace doctor` | एक वर्कस्पेस जाँचें | संरचित स्थिति आउटपुट के लिए `--json` |
| `openspec workspace update` | वर्कस्पेस-लोकल मार्गदर्शन और एजेंट स्किल रीफ़्रेश करें | `--tools` एजेंट चुनता है; प्रोफ़ाइल वर्कफ़्लो चुनती है |
| `openspec context-store setup <id>` | स्थानीय कॉन्टेक्स्ट स्टोर बनाएँ | संरचित सेटअप आउटपुट के लिए `--json` |
| `openspec context-store register <path>` | मौजूदा कॉन्टेक्स्ट स्टोर रजिस्टर करें | संरचित पंजीकरण आउटपुट के लिए `--json` |
| `openspec context-store unregister <id>` | स्थानीय कॉन्टेक्स्ट-स्टोर पंजीकरण भूल जाएँ | संरचित सफ़ाई आउटपुट के लिए `--json` |
| `openspec context-store remove <id>` | पंजीकृत स्थानीय कॉन्टेक्स्ट-स्टोर फ़ोल्डर हटाएँ | नॉन-इंटरैक्टिव विलोपन के लिए `--yes --json` |
| `openspec context-store list` | पंजीकृत कॉन्टेक्स्ट स्टोर ब्राउज़ करें | संरचित पंजीकरण के लिए `--json` |
| `openspec context-store doctor` | स्थानीय स्टोर सेटअप जाँचें | संरचित डायग्नोस्टिक्स के लिए `--json` |
| `openspec initiative list` | साझा पहल ब्राउज़ करें | संरचित पहल रिकॉर्ड के लिए `--json` |
| `openspec initiative show <id>` | एक पहल का समाधान करें | कैनोनिकल पथ और मेटाडेटा के लिए `--json` |
| `openspec new change <id>` | रेपो-लोकल परिवर्तन स्कैफ़ोल्डिंग बनाएँ | `--json`, और साझा समन्वय लिंक के लिए `--initiative` |
| `openspec set change <id>` | चेक-इन किया गया परिवर्तन मेटाडेटा अपडेट करें | `--json`, और साझा समन्वय लिंक के लिए `--initiative` |

---

## वैश्विक विकल्प

ये विकल्प सभी कमांड के साथ काम करते हैं:

| विकल्प | विवरण |
|--------|-------------|
| `--version`, `-V` | संस्करण संख्या दिखाएँ |
| `--no-color` | रंग आउटपुट अक्षम करें |
| `--help`, `-h` | कमांड के लिए सहायता प्रदर्शित करें |

---

## सेटअप कमांड

### `openspec init`

अपने प्रोजेक्ट में OpenSpec आरंभ करें। फ़ोल्डर संरचना बनाता है और AI टूल इंटीग्रेशन कॉन्फ़िगर करता है।

डिफ़ॉल्ट व्यवहार वैश्विक कॉन्फ़िगरेशन डिफ़ॉल्ट्स का उपयोग करता है: प्रोफ़ाइल `core`, डिलीवरी `both`, वर्कफ़्लो `propose, explore, apply, sync, archive`।

```
openspec init [path] [options]
```

**तर्क:**

| तर्क | आवश्यक | विवरण |
|----------|----------|-------------|
| `path` | नहीं | लक्षित निर्देशिका (डिफ़ॉल्ट: वर्तमान निर्देशिका) |

**विकल्प:**

| विकल्प | विवरण |
|--------|-------------|
| `--tools <list>` | AI टूल नॉन-इंटरैक्टिव रूप से कॉन्फ़िगर करें। `all`, `none`, या अल्पविराम से अलग सूची का उपयोग करें |
| `--force` | प्रॉम्प्ट किए बिना लीगेसी फ़ाइलें स्वतः साफ़ करें |
| `--profile <profile>` | इस इनिशियलाइज़ेशन रन के लिए वैश्विक प्रोफ़ाइल ओवरराइड करें (`core` या `custom`) |

`--profile custom` वैश्विक कॉन्फ़िगरेशन (`openspec config profile`) में वर्तमान में चयनित वर्कफ़्लो का उपयोग करता है।

**समर्थित टूल ID (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `opencode`, `pi`, `qoder`, `lingma`, `qwen`, `roocode`, `trae`, `windsurf`

**उदाहरण:**

```bash
# इंटरैक्टिव इनिशियलाइज़ेशन
openspec init

# एक विशिष्ट निर्देशिका में आरंभ करें
openspec init ./my-project

# नॉन-इंटरैक्टिव: Claude और Cursor के लिए कॉन्फ़िगर करें
openspec init --tools claude,cursor

# सभी समर्थित टूल के लिए कॉन्फ़िगर करें
openspec init --tools all

# इस रन के लिए प्रोफ़ाइल ओवरराइड करें
openspec init --profile core

# प्रॉम्प्ट छोड़ें और लीगेसी फ़ाइलें स्वतः साफ़ करें
openspec init --force
```

**क्या बनाता है:**

```
openspec/
├── specs/              # आपके विनिर्देश (सत्य का स्रोत)
├── changes/            # प्रस्तावित परिवर्तन
└── config.yaml         # प्रोजेक्ट कॉन्फ़िगरेशन

.claude/skills/         # Claude Code कौशल (यदि claude चयनित है)
.cursor/skills/         # Cursor कौशल (यदि cursor चयनित है)
.cursor/commands/       # Cursor OPSX कमांड (यदि डिलीवरी में कमांड शामिल हैं)
... (अन्य टूल कॉन्फ़िगरेशन)
```

---

### `openspec update`

CLI अपग्रेड करने के बाद OpenSpec निर्देश फ़ाइलें अपडेट करें। आपकी वर्तमान वैश्विक प्रोफ़ाइल, चयनित वर्कफ़्लो और डिलीवरी मोड का उपयोग करके AI टूल कॉन्फ़िगरेशन फ़ाइलें पुनर्जनरेट करता है।

```
openspec update [path] [options]
```

**तर्क:**

| तर्क | आवश्यक | विवरण |
|----------|----------|-------------|
| `path` | नहीं | लक्षित निर्देशिका (डिफ़ॉल्ट: वर्तमान निर्देशिका) |

**विकल्प:**

| विकल्प | विवरण |
|--------|-------------|
| `--force` | फ़ाइलें अप-टू-डेट होने पर भी अपडेट करने के लिए बाध्य करें |

**उदाहरण:**

```bash
# npm अपग्रेड के बाद निर्देश फ़ाइलें अपडेट करें
npm update @fission-ai/openspec
openspec update
```

---

## वर्कस्पेस कमांड

वर्कस्पेस कमांड बीटा में हैं। नीचे दिया गया लोकल-व्यू मॉडल वर्तमान दिशा है, लेकिन बाहरी ऑटोमेशन, इंटीग्रेशन और लंबे समय तक चलने वाले वर्कफ़्लो को अभी भी कमांड व्यवहार, स्थिति फ़ाइलें और JSON आउटपुट को विकसित होने वाले मानें।

समन्वय वर्कस्पेस लिंक्ड रेपो या फ़ोल्डर पर मशीन-लोकल व्यू हैं। वर्कस्पेस दृश्यता परिवर्तन प्रतिबद्धता नहीं है: उन रेपो या फ़ोल्डर लिंक करें जिनके बारे में OpenSpec को जानना चाहिए, फिर परिवर्तन बनाएँ जब आप विशिष्ट कार्य की योजना बनाने के लिए तैयार हों।

### `openspec workspace setup`

मानक OpenSpec वर्कस्पेस स्थान में एक वर्कस्पेस बनाएँ और कम से कम एक मौजूदा रेपो या फ़ोल्डर लिंक करें।

```bash
openspec workspace setup [options]
```

**विकल्प:**

| विकल्प | विवरण |
|--------|-------------|
| `--name <name>` | वर्कस्पेस नाम। नाम केबैब-केस होने चाहिए |
| `--link <path>` | मौजूदा रेपो या फ़ोल्डर लिंक करें और फ़ोल्डर नाम से लिंक नाम का अनुमान लगाएँ |
| `--link <name>=<path>` | स्पष्ट लिंक नाम के साथ मौजूदा रेपो या फ़ोल्डर लिंक करें |
| `--opener <id>` | नॉन-इंटरैक्टिव सेटअप के दौरान एक पसंदीदा ओपनर स्टोर करें: `codex-cli`, `claude`, `github-copilot`, या `editor` |
| `--tools <tools>` | एजेंटों के लिए वर्कस्पेस-लोकल OpenSpec कौशल इंस्टॉल करें। `all`, `none`, या अल्पविराम से अलग टूल ID का उपयोग करें |
| `--no-interactive` | प्रॉम्प्ट अक्षम करें; `--name` और कम से कम एक `--link` आवश्यक है |
| `--json` | JSON आउटपुट करें; `--no-interactive` आवश्यक है |

**उदाहरण:**

```bash
openspec workspace setup
openspec workspace setup --no-interactive --name platform --link /repos/api --link web=/repos/web
openspec workspace setup --no-interactive --name platform --link /repos/api --opener codex-cli
openspec workspace setup --no-interactive --name platform --link /repos/api --tools codex,claude
openspec workspace setup --no-interactive --json --name checkout --link /repos/platform/apps/checkout
```

इंटरैक्टिव सेटअप एक पसंदीदा ओपनर के लिए पूछता है और चयनित एजेंटों के लिए वर्कस्पेस-लोकल OpenSpec कौशल इंस्टॉल कर सकता है। नॉन-इंटरैक्टिव सेटअप तभी पसंदीदा ओपनर स्टोर करता है जब `--opener` प्रदान किया जाता है; अन्यथा `workspace open` बाद में इंटरैक्टिव टर्मिनलों में प्रॉम्प्ट करता है जब एक समर्थित ओपनर उपलब्ध हो, या स्क्रिप्ट से `--agent <tool>` या `--editor` पास करने के लिए कहता है।

इस बीटा स्लाइस में वर्कस्पेस कौशल इंस्टॉलेशन केवल-कौशल है: भले ही वैश्विक डिलीवरी `commands` या `both` हो, वर्कस्पेस सेटअप वर्कस्पेस रूट में एजेंट कौशल फ़ोल्डर लिखता है और स्लैश कमांड फ़ाइलें नहीं बनाता है। सक्रिय वैश्विक प्रोफ़ाइल चुनती है कि कौन से वर्कफ़्लो कौशल इंस्टॉल किए जाते हैं; `--tools` चुनता है कि कौन से एजेंट उन्हें प्राप्त करते हैं। यदि नॉन-इंटरैक्टिव सेटअप में `--tools` छोड़ दिया जाता है, तो कोई कौशल इंस्टॉल नहीं किया जाता है और `workspace update --tools <ids>` बाद में उन्हें जोड़ सकता है।

### `openspec workspace list`

स्थानीय रजिस्ट्री से ज्ञात OpenSpec वर्कस्पेस सूचीबद्ध करें।

```bash
openspec workspace list [--json]
openspec workspace ls [--json]
```

सूची प्रत्येक वर्कस्पेस स्थान और लिंक्ड रेपो या फ़ोल्डर दिखाती है। पुरानी रजिस्ट्री रिकॉर्ड रिपोर्ट किए जाते हैं लेकिन बदले नहीं जाते हैं।

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

पथ पहले से मौजूद होना चाहिए। सापेक्ष पथ कमांड की वर्तमान निर्देशिका के विरुद्ध रिज़ॉल्व किए जाते हैं, इससे पहले कि OpenSpec सत्यापित पूर्ण पथ को मशीन-लोकल वर्कस्पेस स्थिति में स्टोर करे। लिंक्ड पथ पूर्ण रेपो, पैकेज, सर्विसेज़, ऐप्स, या रेपो-लोकल `openspec/` स्थिति के बिना फ़ोल्डर हो सकते हैं।

### `openspec workspace relink`

एक मौजूदा लिंक के लिए स्थानीय पथ की मरम्मत या बदलें।

```bash
openspec workspace relink <name> <path> [options]
```

पथ पहले से मौजूद होना चाहिए। Relink केवल स्थिर लिंक नाम के लिए मशीन-लोकल पथ अपडेट करता है।

### `openspec workspace doctor`

जाँचें कि एक वर्कस्पेस वर्तमान मशीन पर क्या रिज़ॉल्व कर सकता है।

```bash
openspec workspace doctor [options]
```

Doctor वर्कस्पेस स्थान, लिंक्ड रेपो या फ़ोल्डर, गायब पथ, मौजूद होने पर रेपो-लोकल विनिर्देश पथ, और सुझाए गए सुधार दिखाता है। JSON आउटपुट में संगतता के लिए वर्कस्पेस प्लानिंग पथ भी शामिल है। यह केवल समस्याएँ रिपोर्ट करता है; यह उन्हें स्वचालित रूप से ठीक नहीं करता है।

जिन कमांड को एक वर्कस्पेस की आवश्यकता होती है, वे वर्कस्पेस फ़ोल्डर या सबडायरेक्टरी के अंदर से चलाने पर वर्तमान वर्कस्पेस का उपयोग करते हैं। कहीं और से, `--workspace <name>` पास करें, एक इंटरैक्टिव टर्मिनल में पिकर से चुनें, या ठीक एक ज्ञात वर्कस्पेस मौजूद होने पर उस पर भरोसा करें। `--json` या `--no-interactive` मोड में, अस्पष्ट चयन एक संरचित स्थिति त्रुटि के साथ विफल हो जाता है और `--workspace <name>` का सुझाव देता है।

JSON प्रतिक्रियाएँ टाइप्ड ऑब्जेक्ट और `status` एरे का उपयोग करती हैं। प्राथमिक डेटा `workspace`, `workspaces`, या `link` में रहता है; चेतावनियाँ और त्रुटियाँ `status` में रहती हैं।

### `openspec workspace update`

वर्कस्पेस-लोकल OpenSpec मार्गदर्शन और एजेंट कौशल रीफ़्रेश करें।

```bash
openspec workspace update [name] [options]
```

**विकल्प:**

| विकल्प | विवरण |
|--------|-------------|
| `--workspace <name>` | स्थानीय रजिस्ट्री से एक ज्ञात वर्कस्पेस चुनें |
| `--tools <tools>` | वर्कस्पेस कौशल के लिए एजेंट चुनें। `all`, `none`, या अल्पविराम से अलग टूल ID का उपयोग करें |
| `--json` | JSON आउटपुट करें |
| `--no-interactive` | वर्कस्पेस पिकर प्रॉम्प्ट अक्षम करें |

**उदाहरण:**

```bash
openspec workspace update
openspec workspace update platform
openspec workspace update --workspace platform --tools codex,claude
openspec workspace update --workspace platform --tools none
```

`workspace update` जनरेट किए गए वर्कस्पेस मार्गदर्शन ब्लॉक और लोकल ओपन सरफेस को रीफ़्रेश करता है। एजेंट कौशल के लिए, जब `--tools` छोड़ दिया जाता है तो यह संग्रहीत वर्कस्पेस कौशल एजेंट चयन का पुन: उपयोग करता है। `--tools` पास करने से वह संग्रहीत चयन बदल जाता है। यह केवल वर्कस्पेस रूट में OpenSpec-प्रबंधित वर्कफ़्लो कौशल निर्देशिकाओं को रीफ़्रेश करता है, अचयनित प्रबंधित वर्कफ़्लो कौशल हटाता है, और लिंक्ड रेपो और फ़ोल्डर को छूता नहीं है।

वर्कस्पेस के अंदर से `openspec update` चलाने से `openspec workspace update` पर रीडायरेक्ट होता है; जब आप चाहते हैं कि रेपो-स्वामित्व वाली टूल फ़ाइलें अपडेट हों तो रेपो-लोकल प्रोजेक्ट के अंदर `openspec update` चलाएँ।

### `openspec workspace open`

संग्रहीत पसंदीदा ओपनर, एक-सत्र एजेंट ओवरराइड, या VS Code एडिटर मोड के माध्यम से एक वर्कस्पेस वर्किंग सेट खोलें।

```bash
openspec workspace open [name] [options]
```

**विकल्प:**

| विकल्प | विवरण |
|--------|-------------|
| `--workspace <name>` | पोज़िशनल वर्कस्पेस नाम के लिए उपनाम |
| `--initiative <id>` | एक स्थानीय वर्कस्पेस व्यू के रूप में एक पहल खोलें। `<id>` या `<store>/<id>` स्वीकार करता है |
| `--store <id>` | `--initiative` के लिए पंजीकृत कॉन्टेक्स्ट स्टोर id |
| `--store-path <path>` | `--initiative` के लिए मौजूदा स्थानीय कॉन्टेक्स्ट स्टोर रूट |
| `--agent <tool>` | एक-सत्र एजेंट ओवरराइड: `codex-cli`, `claude`, या `github-copilot` |
| `--editor` | रखरखाव किए गए VS Code वर्कस्पेस फ़ाइल को सामान्य एडिटर वर्कस्पेस के रूप में खोलें |
| `--no-interactive` | वर्कस्पेस और ओपनर पिकर प्रॉम्प्ट अक्षम करें |

**उदाहरण:**

```bash
openspec workspace open
openspec workspace open platform
openspec workspace open platform --agent github-copilot
openspec workspace open --agent codex-cli
openspec workspace open --editor
openspec workspace open --initiative billing-launch --store platform
openspec workspace open --initiative platform/billing-launch
```

`workspace open` एक के अंदर से चलाने पर वर्तमान वर्कस्पेस का उपयोग करता है, कहीं और से चलाने पर केवल एक ज्ञात वर्कस्पेस का स्वतः चयन करता है, और कई वर्कस्पेस ज्ञात होने पर उपयोगकर्ता से चुनने के लिए कहता है। `--agent` और `--editor` संग्रहीत पसंदीदा ओपनर को नहीं बदलते हैं। दोनों ओपनर ओवरराइड पास करना एक त्रुटि है; `--agent <tool>` या `--editor` में से किसी एक को चुनें।

जब `--initiative` का उपयोग किया जाता है, तो OpenSpec उस पहल के लिए एक निजी स्थानीय वर्कस्पेस व्यू तैयार करता है या चुनता है। रजिस्ट्री-चयनित स्टोर id द्वारा संग्रहीत किए जाते हैं; `--store-path` एक रनटाइम-लोकल पथ चयनकर्ता संग्रहीत करता है क्योंकि वर्कस्पेस व्यू निजी स्थानीय स्थिति हैं।

OpenSpec VS Code एडिटर और GitHub Copilot-in-VS-Code ओपन के लिए वर्कस्पेस रूट में `<workspace-name>.code-workspace` रखता है। वह फ़ाइल मशीन-लोकल वर्कस्पेस व्यू स्थिति है।

रखरखाव किया गया VS Code वर्कस्पेस पहले मान्य लिंक्ड रेपो या फ़ोल्डर सूचीबद्ध करता है, फिर जुड़ी होने पर पहल का कॉन्टेक्स्ट, फिर OpenSpec वर्कस्पेस फ़ाइलें। VS Code उन प्रविष्टियों को एक मल्टी-रूट वर्कस्पेस के रूप में प्रदर्शित करता है।

रूट वर्कस्पेस ओपन अन्वेषण और कॉन्टेक्स्ट के लिए लिंक्ड रेपो या फ़ोल्डर दृश्यमान बनाता है। कार्यान्वयन संपादन केवल एक स्पष्ट उपयोगकर्ता अनुरोध और सामान्य OpenSpec कार्यान्वयन वर्कफ़्लो के बाद ही शुरू होने चाहिए।

## साझा संदर्भ कमांड

संदर्भ स्टोर और पहल बीटा समन्वय सतह हैं। एक संदर्भ स्टोर टिकाऊ साझा संदर्भ के लिए एक स्थानीय पंजीकरण है, आमतौर पर एक गिट-समर्थित फ़ोल्डर या क्लोन। एक पहल एक संदर्भ स्टोर के अंदर साझा समन्वय संदर्भ है; रेपो-स्थानीय परिवर्तन इससे बिना साझा योजना को हर रेपो में कॉपी किए लिंक कर सकते हैं।

### `openspec context-store setup`

एक स्थानीय संदर्भ स्टोर बनाएं और रजिस्टर करें। टर्मिनल में बिना किसी तर्क के,
OpenSpec उपयोगकर्ता को सेटअप के माध्यम से गाइड करता है। एजेंट और स्क्रिप्ट को स्पष्ट
इनपुट पास करने चाहिए और `--json` का उपयोग करना चाहिए।

```bash
openspec context-store setup [id] [options]
```

**विकल्प:**

| विकल्प | विवरण |
|--------|-------------|
| `--path <path>` | संदर्भ स्टोर फ़ोल्डर पथ; डिफ़ॉल्ट रूप से OpenSpec का प्रबंधित स्थानीय डेटा निर्देशिका |
| `--init-git` | संदर्भ स्टोर में एक गिट रिपॉज़िटरी प्रारंभ करें |
| `--no-init-git` | गिट रिपॉज़िटरी प्रारंभ न करें |
| `--json` | JSON आउटपुट करें |

जब `--path` छोड़ दिया जाता है, तो सेटअप `getGlobalDataDir()/context-stores/<id>` के तहत स्टोर बनाता है: `$XDG_DATA_HOME/openspec/context-stores/<id>` जब `XDG_DATA_HOME` सेट हो, या Unix-शैली फॉलबैक पर `~/.local/share/openspec/context-stores/<id>`। जब आप स्टोर को एक दृश्यमान क्लोन या टीम-विशिष्ट फ़ोल्डर में चाहते हैं तो `--path` पास करें।

उदाहरण:

```bash
openspec context-store setup
openspec context-store setup team-context
openspec context-store setup team-context --path /repos/team-context --no-init-git
openspec context-store setup team-context --json --no-init-git
```

### `openspec context-store register`

एक मौजूदा स्थानीय संदर्भ स्टोर फ़ोल्डर को रजिस्टर करें।

```bash
openspec context-store register [path] [options]
```

**विकल्प:**

| विकल्प | विवरण |
|--------|-------------|
| `--id <id>` | संदर्भ स्टोर आईडी; डिफ़ॉल्ट रूप से स्टोर मेटाडेटा या फ़ोल्डर नाम |
| `--json` | JSON आउटपुट करें |

### `openspec context-store unregister`

फ़ाइलों को हटाए बिना एक स्थानीय संदर्भ-स्टोर पंजीकरण भूल जाएं।

```bash
openspec context-store unregister <id> [--json]
```

इसका उपयोग तब करें जब किसी स्टोर को स्थानांतरित किया गया हो, कहीं और क्लोन किया गया हो, या इस मशीन पर OpenSpec द्वारा अब प्रदर्शित नहीं किया जाना चाहिए।

### `openspec context-store remove`

एक स्थानीय संदर्भ-स्टोर पंजीकरण भूल जाएं और इसका स्थानीय फ़ोल्डर हटा दें।

```bash
openspec context-store remove <id> [--yes] [--json]
```

`remove` एक इंटरैक्टिव टर्मिनल में हटाने से पहले सटीक फ़ोल्डर दिखाता है।
एजेंट, स्क्रिप्ट और JSON कॉलर को हटाने की पुष्टि करने के लिए `--yes` पास करना चाहिए।
OpenSpec एक ऐसे फ़ोल्डर को हटाने से इनकार करता है जिसमें मिलान करने वाला
संदर्भ-स्टोर मेटाडेटा नहीं है।

### `openspec context-store list`

स्थानीय रूप से पंजीकृत संदर्भ स्टोर की सूची बनाएं।

```bash
openspec context-store list [--json]
openspec context-store ls [--json]
```

### `openspec context-store doctor`

स्थानीय संदर्भ-स्टोर पंजीकरण, मेटाडेटा और गिट उपस्थिति की जांच करें।

```bash
openspec context-store doctor [id] [--json]
```

Doctor केवल डायग्नोस्टिक है; यह लापता रूट, मेटाडेटा विसंगतियों और अमान्य स्थानीय रजिस्ट्री स्थिति की रिपोर्ट करता है बिना स्टोर को संशोधित किए।

### `openspec initiative create`

एक संदर्भ स्टोर में एक पहल बनाएं।

```bash
openspec initiative create <id> --title <title> --summary <summary> [options]
```

**विकल्प:**

| विकल्प | विवरण |
|--------|-------------|
| `--store <id>` | स्थानीय रजिस्ट्री से संदर्भ स्टोर आईडी |
| `--store-path <path>` | मौजूदा स्थानीय संदर्भ स्टोर रूट |
| `--title <title>` | पहल शीर्षक |
| `--summary <summary>` | पहल सारांश |
| `--json` | JSON आउटपुट करें |

### `openspec initiative list`

पहल की सूची बनाएं। बिना किसी चयनकर्ता के, यह सभी पंजीकृत संदर्भ स्टोर खोजता है और `status` में आंशिक-पठन चेतावनियों की रिपोर्ट करता है।

```bash
openspec initiative list [options]
openspec initiative ls [options]
```

**विकल्प:**

| विकल्प | विवरण |
|--------|-------------|
| `--store <id>` | एक पंजीकृत संदर्भ स्टोर की सूची बनाएं |
| `--store-path <path>` | एक मौजूदा स्थानीय संदर्भ स्टोर रूट की सूची बनाएं |
| `--json` | JSON आउटपुट करें |

### `openspec initiative show`

एक पहल को हल करें और इसका कैनोनिकल स्थान प्रिंट करें।

```bash
openspec initiative show <id> [options]
openspec initiative show <store>/<id> [options]
```

बिना `--store` के, OpenSpec पंजीकृत संदर्भ स्टोर खोजता है। यदि एक ही पहल आईडी कई स्टोर में मौजूद है, तो `--store <id>` पास करें या `<store>/<id>` फ़ॉर्म का उपयोग करें।

---

## ब्राउज़िंग कमांड्स

### `openspec list`

आपके प्रोजेक्ट में परिवर्तन या स्पेक्स की सूची दिखाएं।

```
openspec list [options]
```

**विकल्प:**

| विकल्प | विवरण |
|--------|-------------|
| `--specs` | परिवर्तनों के बजाय स्पेक्स की सूची दिखाएं |
| `--changes` | परिवर्तनों की सूची दिखाएं (डिफ़ॉल्ट) |
| `--sort <order>` | `recent` (डिफ़ॉल्ट) या `name` के अनुसार क्रमबद्ध करें |
| `--json` | JSON के रूप में आउटपुट दें |

**उदाहरण:**

```bash
# सभी सक्रिय परिवर्तनों की सूची दिखाएं
openspec list

# सभी स्पेक्स की सूची दिखाएं
openspec list --specs

# स्क्रिप्ट के लिए JSON आउटपुट
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

**आर्गुमेंट्स:**

| आर्गुमेंट | आवश्यक | विवरण |
|----------|----------|-------------|
| `item-name` | नहीं | परिवर्तन या स्पेक का नाम (छोड़ने पर प्रॉम्प्ट करता है) |

**विकल्प:**

| विकल्प | विवरण |
|--------|-------------|
| `--type <type>` | प्रकार निर्दिष्ट करें: `change` या `spec` (अस्पष्ट न होने पर ऑटो-डिटेक्ट होता है) |
| `--json` | JSON के रूप में आउटपुट दें |
| `--no-interactive` | प्रॉम्प्ट को अक्षम करें |

**परिवर्तन-विशिष्ट विकल्प:**

| विकल्प | विवरण |
|--------|-------------|
| `--deltas-only` | केवल डेल्टा स्पेक्स दिखाएं (JSON मोड) |

**स्पेक-विशिष्ट विकल्प:**

| विकल्प | विवरण |
|--------|-------------|
| `--requirements` | केवल आवश्यकताएं दिखाएं, परिदृश्यों को छोड़ें (JSON मोड) |
| `--no-scenarios` | परिदृश्य सामग्री को छोड़ें (JSON मोड) |
| `-r, --requirement <id>` | 1-आधारित इंडेक्स द्वारा विशिष्ट आवश्यकता दिखाएं (JSON मोड) |

**उदाहरण:**

```bash
# इंटरैक्टिव चयन
openspec show

# विशिष्ट परिवर्तन दिखाएं
openspec show add-dark-mode

# विशिष्ट स्पेक दिखाएं
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

**आर्गुमेंट्स:**

| आर्गुमेंट | आवश्यक | विवरण |
|----------|----------|-------------|
| `item-name` | नहीं | सत्यापित करने के लिए विशिष्ट आइटम (छोड़ने पर प्रॉम्प्ट करता है) |

**विकल्प:**

| विकल्प | विवरण |
|--------|-------------|
| `--all` | सभी परिवर्तनों और स्पेक्स को सत्यापित करें |
| `--changes` | सभी परिवर्तनों को सत्यापित करें |
| `--specs` | सभी स्पेक्स को सत्यापित करें |
| `--type <type>` | नाम अस्पष्ट होने पर प्रकार निर्दिष्ट करें: `change` या `spec` |
| `--strict` | सख्त सत्यापन मोड सक्षम करें |
| `--json` | JSON के रूप में आउटपुट दें |
| `--concurrency <n>` | अधिकतम समानांतर सत्यापन (डिफ़ॉल्ट: 6, या `OPENSPEC_CONCURRENCY` एनवायरनमेंट वेरिएबल) |
| `--no-interactive` | प्रॉम्प्ट को अक्षम करें |

**उदाहरण:**

```bash
# इंटरैक्टिव सत्यापन
openspec validate

# विशिष्ट परिवर्तन सत्यापित करें
openspec validate add-dark-mode

# सभी परिवर्तनों को सत्यापित करें
openspec validate --changes

# JSON आउटपुट के साथ सब कुछ सत्यापित करें (CI/स्क्रिप्ट के लिए)
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

## लाइफसाइकल कमांड्स

### `openspec archive`

एक पूर्ण परिवर्तन को संग्रहित करें और डेल्टा स्पेक्स को मुख्य स्पेक्स में मर्ज करें।

```
openspec archive [change-name] [options]
```

**आर्गुमेंट्स:**

| आर्गुमेंट | आवश्यक | विवरण |
|----------|----------|-------------|
| `change-name` | नहीं | संग्रहित करने के लिए परिवर्तन (छोड़ने पर प्रॉम्प्ट करता है) |

**विकल्प:**

| विकल्प | विवरण |
|--------|-------------|
| `-y, --yes` | पुष्टि प्रॉम्प्ट को छोड़ें |
| `--skip-specs` | स्पेक अपडेट को छोड़ें (इंफ्रास्ट्रक्चर/टूलिंग/केवल-दस्तावेज़ परिवर्तनों के लिए) |
| `--no-validate` | सत्यापन को छोड़ें (पुष्टि की आवश्यकता होती है) |

**उदाहरण:**

```bash
# इंटरैक्टिव संग्रहण
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
2. पुष्टि के लिए प्रॉम्प्ट करता है (जब तक `--yes` न हो)
3. डेल्टा स्पेक्स को `openspec/specs/` में मर्ज करता है
4. परिवर्तन फ़ोल्डर को `openspec/changes/archive/YYYY-MM-DD-<name>/` में ले जाता है

---

## वर्कफ़्लो कमांड्स

ये कमांड्स आर्टिफ़ैक्ट-संचालित OPSX वर्कफ़्लो को सपोर्ट करती हैं। ये प्रगति की जांच करने वाले मनुष्यों और अगले चरण निर्धारित करने वाले एजेंट्स दोनों के लिए उपयोगी हैं।

### `openspec new change`

एक रिपो-लोकल परिवर्तन निर्देशिका और वैकल्पिक चेक-इन मेटाडेटा बनाएं।

```bash
openspec new change <name> [options]
```

**विकल्प:**

| विकल्प | विवरण |
|--------|-------------|
| `--description <text>` | `README.md` में जोड़ने के लिए विवरण |
| `--goal <text>` | परिवर्तन के साथ संग्रहीत करने के लिए वर्कस्पेस उत्पाद लक्ष्य |
| `--areas <names>` | प्रभावित वर्कस्पेस लिंक नामों की अल्पविराम से अलग की गई सूची |
| `--initiative <id>` | रिपो-लोकल परिवर्तन को किसी पहल से लिंक करें |
| `--store <id>` | `--initiative` के लिए कॉन्टेक्स्ट स्टोर आईडी |
| `--store-path <path>` | `--initiative` के लिए मौजूदा स्थानीय कॉन्टेक्स्ट स्टोर रूट |
| `--schema <name>` | उपयोग करने के लिए वर्कफ़्लो स्कीमा |
| `--json` | JSON आउटपुट दें |

उदाहरण:

```bash
openspec new change add-billing-api --initiative billing-launch --store platform
openspec new change add-billing-api --initiative platform/billing-launch --json
```

### `openspec set change`

परिवर्तन को पुनः बनाए बिना चेक-इन किए गए रिपो-लोकल परिवर्तन मेटाडेटा को अपडेट करें।

```bash
openspec set change <name> [options]
```

**विकल्प:**

| विकल्प | विवरण |
|--------|-------------|
| `--initiative <id>` | रिपो-लोकल परिवर्तन को किसी पहल से लिंक करें |
| `--store <id>` | `--initiative` के लिए कॉन्टेक्स्ट स्टोर आईडी |
| `--store-path <path>` | `--initiative` के लिए मौजूदा स्थानीय कॉन्टेक्स्ट स्टोर रूट |
| `--json` | JSON आउटपुट दें |

`set change --initiative` तब इडम्पोटेंट है जब अनुरोधित लिंक पहले से मौजूद हो और किसी भिन्न मौजूदा पहल लिंक को बदलने से इनकार करता है।

### `openspec status`

किसी परिवर्तन के लिए आर्टिफ़ैक्ट पूर्णता स्थिति प्रदर्शित करें।

```
openspec status [options]
```

**विकल्प:**

| विकल्प | विवरण |
|--------|-------------|
| `--change <id>` | परिवर्तन का नाम (छोड़ने पर प्रॉम्प्ट करता है) |
| `--schema <name>` | स्कीमा ओवरराइड (परिवर्तन के कॉन्फ़िग से ऑटो-डिटेक्ट होता है) |
| `--json` | JSON के रूप में आउटपुट दें |

**उदाहरण:**

```bash
# इंटरैक्टिव स्थिति जांच
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

किसी आर्टिफ़ैक्ट बनाने या कार्यों को लागू करने के लिए समृद्ध निर्देश प्राप्त करें। AI एजेंट्स द्वारा यह समझने के लिए उपयोग किया जाता है कि अगला क्या बनाना है।

```
openspec instructions [artifact] [options]
```

**आर्गुमेंट्स:**

| आर्गुमेंट | आवश्यक | विवरण |
|----------|----------|-------------|
| `artifact` | नहीं | आर्टिफ़ैक्ट आईडी: `proposal`, `specs`, `design`, `tasks`, या `apply` |

**विकल्प:**

| विकल्प | विवरण |
|--------|-------------|
| `--change <id>` | परिवर्तन का नाम (गैर-इंटरैक्टिव मोड में आवश्यक) |
| `--schema <name>` | स्कीमा ओवरराइड |
| `--json` | JSON के रूप में आउटपुट दें |

**विशेष मामला:** कार्य कार्यान्वयन निर्देश प्राप्त करने के लिए `apply` को आर्टिफ़ैक्ट के रूप में उपयोग करें।

**उदाहरण:**

```bash
# अगले आर्टिफ़ैक्ट के लिए निर्देश प्राप्त करें
openspec instructions --change add-dark-mode

# विशिष्ट आर्टिफ़ैक्ट निर्देश प्राप्त करें
openspec instructions design --change add-dark-mode

# लागू करें/कार्यान्वयन निर्देश प्राप्त करें
openspec instructions apply --change add-dark-mode

# एजेंट उपभोग के लिए JSON
openspec instructions design --change add-dark-mode --json
```

**आउटपुट में शामिल हैं:**

- आर्टिफ़ैक्ट के लिए टेम्पलेट सामग्री
- कॉन्फ़िग से प्रोजेक्ट कॉन्टेक्स्ट
- निर्भरता आर्टिफ़ैक्ट्स की सामग्री
- कॉन्फ़िग से प्रति-आर्टिफ़ैक्ट नियम

---

### `openspec templates`

किसी स्कीमा में सभी आर्टिफ़ैक्ट्स के लिए रिज़ॉल्व किए गए टेम्पलेट पथ दिखाएं।

```
openspec templates [options]
```

**विकल्प:**

| विकल्प | विवरण |
|--------|-------------|
| `--schema <name>` | निरीक्षण करने के लिए स्कीमा (डिफ़ॉल्ट: `spec-driven`) |
| `--json` | JSON के रूप में आउटपुट दें |

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

उनके विवरण और आर्टिफ़ैक्ट प्रवाह के साथ उपलब्ध वर्कफ़्लो स्कीमा की सूची दिखाएं।

```
openspec schemas [options]
```

**विकल्प:**

| विकल्प | विवरण |
|--------|-------------|
| `--json` | JSON के रूप में आउटपुट दें |

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

कस्टम वर्कफ़्लो स्कीमा बनाने और प्रबंधित करने के लिए कमांड्स।

### `openspec schema init`

एक नई प्रोजेक्ट-लोकल स्कीमा बनाएं।

```
openspec schema init <name> [options]
```

**आर्ग्यूमेंट्स:**

| आर्ग्यूमेंट | आवश्यक | विवरण |
|----------|----------|-------------|
| `name` | हाँ | स्कीमा नाम (kebab-case) |

**विकल्प:**

| विकल्प | विवरण |
|--------|-------------|
| `--description <text>` | स्कीमा विवरण |
| `--artifacts <list>` | कॉमा-सेपरेटेड आर्टिफैक्ट आईडी (डिफ़ॉल्ट: `proposal,specs,design,tasks`) |
| `--default` | प्रोजेक्ट डिफ़ॉल्ट स्कीमा के रूप में सेट करें |
| `--no-default` | डिफ़ॉल्ट के रूप में सेट करने के लिए प्रॉम्प्ट न करें |
| `--force` | मौजूदा स्कीमा को ओवरराइट करें |
| `--json` | JSON के रूप में आउटपुट करें |

**उदाहरण:**

```bash
# इंटरैक्टिव स्कीमा निर्माण
openspec schema init research-first

# विशिष्ट आर्टिफैक्ट्स के साथ गैर-इंटरैक्टिव
openspec schema init rapid \
  --description "तेज़ इटरेशन वर्कफ़्लो" \
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

कस्टमाइज़ेशन के लिए एक मौजूदा स्कीमा को अपने प्रोजेक्ट में कॉपी करें।

```
openspec schema fork <source> [name] [options]
```

**आर्ग्यूमेंट्स:**

| आर्ग्यूमेंट | आवश्यक | विवरण |
|----------|----------|-------------|
| `source` | हाँ | कॉपी की जाने वाली स्कीमा |
| `name` | नहीं | नई स्कीमा का नाम (डिफ़ॉल्ट: `<source>-custom`) |

**विकल्प:**

| विकल्प | विवरण |
|--------|-------------|
| `--force` | मौजूदा गंतव्य को ओवरराइट करें |
| `--json` | JSON के रूप में आउटपुट करें |

**उदाहरण:**

```bash
# बिल्ट-इन स्पेक-ड्रिवन स्कीमा का कांटा बनाएं
openspec schema fork spec-driven my-workflow
```

---

### `openspec schema validate`

किसी स्कीमा की संरचना और टेम्पलेट्स को मान्य करें।

```
openspec schema validate [name] [options]
```

**आर्ग्यूमेंट्स:**

| आर्ग्यूमेंट | आवश्यक | विवरण |
|----------|----------|-------------|
| `name` | नहीं | मान्य करने के लिए स्कीमा (यदि छोड़ दिया जाए तो सभी को मान्य करता है) |

**विकल्प:**

| विकल्प | विवरण |
|--------|-------------|
| `--verbose` | विस्तृत मान्यकरण चरण दिखाएं |
| `--json` | JSON के रूप में आउटपुट करें |

**उदाहरण:**

```bash
# एक विशिष्ट स्कीमा को मान्य करें
openspec schema validate my-workflow

# सभी स्कीमा को मान्य करें
openspec schema validate
```

---

### `openspec schema which`

दिखाएं कि कोई स्कीमा कहाँ से रिज़ॉल्व होती है (डिबगिंग प्राथमिकता के लिए उपयोगी)।

```
openspec schema which [name] [options]
```

**आर्ग्यूमेंट्स:**

| आर्ग्यूमेंट | आवश्यक | विवरण |
|----------|----------|-------------|
| `name` | नहीं | स्कीमा नाम |

**विकल्प:**

| विकल्प | विवरण |
|--------|-------------|
| `--all` | उनके स्रोतों के साथ सभी स्कीमा सूचीबद्ध करें |
| `--json` | JSON के रूप में आउटपुट करें |

**उदाहरण:**

```bash
# जांचें कि कोई स्कीमा कहाँ से आती है
openspec schema which spec-driven
```

**आउटपुट:**

```
spec-driven resolves from: package
  Source: /usr/local/lib/node_modules/@fission-ai/openspec/schemas/spec-driven
```

**स्कीमा प्राथमिकता:**

1. प्रोजेक्ट: `openspec/schemas/<name>/`
2. यूज़र: `~/.local/share/openspec/schemas/<name>/`
3. पैकेज: बिल्ट-इन स्कीमा

---

## कॉन्फ़िगरेशन कमांड्स

### `openspec config`

ग्लोबल OpenSpec कॉन्फ़िगरेशन देखें और संशोधित करें।

```
openspec config <subcommand> [options]
```

**सबकमांड:**

| सबकमांड | विवरण |
|------------|-------------|
| `path` | कॉन्फ़िग फ़ाइल स्थान दिखाएं |
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

# तेज़ प्रीसेट: वर्कफ़्लोज़ को कोर में बदलें (डिलीवरी मोड रखें)
openspec config profile core
```

`openspec config profile` एक वर्तमान-स्थिति सारांश से शुरू होता है, फिर आपको चुनने देता है:
- डिलीवरी + वर्कफ़्लोज़ बदलें
- केवल डिलीवरी बदलें
- केवल वर्कफ़्लोज़ बदलें
- वर्तमान सेटिंग्स रखें (बाहर निकलें)

यदि आप वर्तमान सेटिंग्स रखते हैं, तो कोई बदलाव नहीं लिखे जाते हैं और कोई अपडेट प्रॉम्प्ट नहीं दिखाया जाता है।
यदि कोई कॉन्फ़िग बदलाव नहीं हैं लेकिन वर्तमान प्रोजेक्ट या वर्कस्पेस फ़ाइलें आपकी ग्लोबल प्रोफ़ाइल/डिलीवरी के साथ सिंक नहीं हैं, तो OpenSpec एक चेतावनी दिखाएगा और रेपो-लोकल प्रोजेक्ट्स के लिए `openspec update` या वर्कस्पेस-लोकल गाइडेंस और स्किल्स के लिए `openspec workspace update` का सुझाव देगा।
`Ctrl+C` दबाने से भी प्रवाह साफ तरीके से रद्द हो जाता है (कोई स्टैक ट्रेस नहीं) और कोड `130` के साथ बाहर निकलता है।
वर्कफ़्लो चेकलिस्ट में, `[x]` का मतलब है कि वर्कफ़्लो ग्लोबल कॉन्फ़िग में चयनित है। उन चयनों को प्रोजेक्ट फ़ाइलों पर लागू करने के लिए, `openspec update` चलाएं (या प्रोजेक्ट के अंदर प्रॉम्प्ट किए जाने पर `Apply changes to this project now?` चुनें)। वर्कस्पेस के अंदर से, वर्कस्पेस-लोकल गाइडेंस और स्किल्स को रिफ्रेश करने के लिए `openspec workspace update` का उपयोग करें; यह जनरेटेड एजेंट वर्कफ़्लो फ़ाइलों के लिए केवल स्किल्स तक ही सीमित रहता है और वर्कस्पेस स्लैश कमांड जनरेट नहीं करता है।

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

## यूटिलिटी कमांड्स

### `openspec feedback`

OpenSpec के बारे में प्रतिक्रिया सबमिट करें। एक GitHub इश्यू बनाता है।

```
openspec feedback <message> [options]
```

**आर्ग्यूमेंट्स:**

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

**सबकमांड:**

| सबकमांड | विवरण |
|------------|-------------|
| `generate [shell]` | स्टैंडर्ड आउटपुट पर कम्प्लीशन स्क्रिप्ट आउटपुट करें |
| `install [shell]` | अपने शेल के लिए कम्प्लीशन इंस्टॉल करें |
| `uninstall [shell]` | इंस्टॉल किए गए कम्प्लीशन हटाएं |

**समर्थित शेल:** `bash`, `zsh`, `fish`, `powershell`

**उदाहरण:**

```bash
# कम्प्लीशन इंस्टॉल करें (शेल ऑटो-डिटेक्ट करता है)
openspec completion install

# विशिष्ट शेल के लिए इंस्टॉल करें
openspec completion install zsh

# मैन्युअल इंस्टॉलेशन के लिए स्क्रिप्ट जनरेट करें
openspec completion generate bash > ~/.bash_completion.d/openspec

# अनइंस्टॉल करें
openspec completion uninstall
```

---

## एग्ज़िट कोड्स

| कोड | अर्थ |
|------|---------|
| `0` | सफलता |
| `1` | त्रुटि (मान्यकरण विफलता, गुम फ़ाइलें, आदि) |

---

## एनवायरनमेंट वेरिएबल्स

| वेरिएबल | विवरण |
|----------|-------------|
| `OPENSPEC_TELEMETRY` | टेलीमेट्री अक्षम करने के लिए `0` पर सेट करें |
| `DO_NOT_TRACK` | टेलीमेट्री अक्षम करने के लिए `1` पर सेट करें (मानक DNT सिग्नल) |
| `OPENSPEC_CONCURRENCY` | बल्क मान्यकरण के लिए डिफ़ॉल्ट समानांतरता (डिफ़ॉल्ट: 6) |
| `EDITOR` या `VISUAL` | `openspec config edit` के लिए एडिटर |
| `NO_COLOR` | सेट होने पर रंग आउटपुट अक्षम करें |

---

## संबंधित दस्तावेज़

- [कमांड्स](commands.md) - AI स्लैश कमांड्स (`/opsx:propose`, `/opsx:apply`, आदि)
- [वर्कफ़्लोज़](workflows.md) - सामान्य पैटर्न और कब कौन सा कमांड उपयोग करें
- [कस्टमाइज़ेशन](customization.md) - कस्टम स्कीमा और टेम्पलेट्स बनाएं
- [शुरू करना](getting-started.md) - पहली बार सेटअप गाइड
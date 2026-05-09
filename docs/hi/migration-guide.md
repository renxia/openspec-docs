# OPSX में माइग्रेशन

यह गाइड आपको लेगेसी OpenSpec कार्यप्रवाह से OPSX में संक्रमण करने में मदद करती है। माइग्रेशन को सुगम बनाया गया है—आपका मौजूदा कार्य सुरक्षित रहता है, और नई प्रणाली अधिक लचीलापन प्रदान करती है।

## क्या बदल रहा है?

OPSX पुराने चरण-लॉक्ड कार्यप्रवाह को एक तरल, क्रिया-आधारित दृष्टिकोण से बदल देता है। यहाँ मुख्य बदलाव है:

| पहलू | लेगेसी | OPSX |
|--------|--------|------|
| **कमांड्स** | `/openspec:proposal`, `/openspec:apply`, `/openspec:archive` | डिफ़ॉल्ट: `/opsx:propose`, `/opsx:apply`, `/opsx:sync`, `/opsx:archive` (विस्तारित कार्यप्रवाह कमांड्स वैकल्पिक) |
| **कार्यप्रवाह** | एक बार में सभी आर्टिफैक्ट बनाएं | वृद्धिशील रूप से या एक बार में—आपकी पसंद |
| **वापस जाना** | असहज चरण गेट्स | स्वाभाविक—किसी भी आर्टिफैक्ट को कभी भी अपडेट करें |
| **अनुकूलन** | निश्चित संरचना | स्कीमा-संचालित, पूर्णतः हैकेबल |
| **कॉन्फ़िगरेशन** | मार्कर्स वाला `CLAUDE.md` + `project.md` | `openspec/config.yaml` में स्वच्छ कॉन्फ़िगरेशन |

**दर्शन में बदलाव:** कार्य रैखिक नहीं है। OPSX यह दिखावा करना बंद करता है कि यह है।

---

## शुरू करने से पहले

### आपका मौजूदा काम सुरक्षित है

माइग्रेशन प्रक्रिया को संरक्षण को ध्यान में रखकर डिज़ाइन किया गया है:

- **`openspec/changes/` में सक्रिय परिवर्तन** — पूरी तरह से संरक्षित। आप OPSX कमांड के साथ इन्हें जारी रख सकते हैं।
- **संग्रहीत परिवर्तन** — अछूते। आपका इतिहास बरकरार रहता है।
- **`openspec/specs/` में मुख्य स्पेक्स** — अछूते। ये आपके सत्य के स्रोत हैं।
- **CLAUDE.md, AGENTS.md आदि में आपकी सामग्री** — संरक्षित। केवल OpenSpec मार्कर ब्लॉक हटाए जाते हैं; आपके द्वारा लिखी गई सब कुछ रहता है।

### क्या हटाया जाता है

केवल उन OpenSpec-प्रबंधित फ़ाइलों को जो बदली जा रही हैं:

| क्या | क्यों |
|------|-----|
| लेगेसी स्लैश कमांड निर्देशिकाएँ/फ़ाइलें | नई स्किल्स सिस्टम द्वारा प्रतिस्थापित |
| `openspec/AGENTS.md` | पुराना वर्कफ़्लो ट्रिगर |
| `CLAUDE.md`, `AGENTS.md` आदि में OpenSpec मार्कर | अब आवश्यक नहीं |

**टूल द्वारा लेगेसी कमांड स्थान** (उदाहरण—आपका टूल भिन्न हो सकता है):

- Claude Code: `.claude/commands/openspec/`
- Cursor: `.cursor/commands/openspec-*.md`
- Windsurf: `.windsurf/workflows/openspec-*.md`
- Cline: `.clinerules/workflows/openspec-*.md`
- Roo: `.roo/commands/openspec-*.md`
- GitHub Copilot: `.github/prompts/openspec-*.prompt.md` (केवल IDE एक्सटेंशन; Copilot CLI में समर्थित नहीं)
- और अन्य (Augment, Continue, Amazon Q, आदि)

माइग्रेशन आपके द्वारा कॉन्फ़िगर किए गए टूल्स का पता लगाता है और उनकी लेगेसी फ़ाइलों को साफ करता है।

हटाने की सूची लंबी लग सकती है, लेकिन ये सभी फ़ाइलें हैं जो मूल रूप से OpenSpec ने बनाई थीं। आपकी अपनी सामग्री कभी नहीं हटाई जाती।

### आपका ध्यान क्या चाहिए

एक फ़ाइल को मैन्युअल माइग्रेशन की आवश्यकता है:

**`openspec/project.md`** — यह फ़ाइल स्वचालित रूप से नहीं हटाई जाती क्योंकि इसमें आपके द्वारा लिखा गया प्रोजेक्ट संदर्भ हो सकता है। आपको यह करना होगा:

1. इसकी सामग्री की समीक्षा करें
2. उपयोगी संदर्भ को `openspec/config.yaml` में ले जाएँ (नीचे मार्गदर्शन देखें)
3. तैयार होने पर फ़ाइल को हटा दें

**हमने यह बदलाव क्यों किया:**

पुराना `project.md` निष्क्रिय था—एजेंट इसे पढ़ सकते थे, नहीं भी पढ़ सकते थे, पढ़ी हुई बात भूल सकते थे। हमने पाया कि विश्वसनीयता असंगत थी।

नया `config.yaml` संदर्भ **हर OpenSpec योजना अनुरोध में सक्रिय रूप से इंजेक्ट किया जाता है**। इसका मतलब है कि आपकी प्रोजेक्ट परंपराएँ, टेक स्टैक और नियम हमेशा मौजूद होते हैं जब AI आर्टिफैक्ट बना रहा होता है। अधिक विश्वसनीय।

**समझौता:**

चूंकि संदर्भ हर अनुरोध में इंजेक्ट किया जाता है, आपको संक्षिप्त रहना चाहिए। वास्तव में महत्वपूर्ण चीज़ों पर ध्यान केंद्रित करें:
- टेक स्टैक और प्रमुख परंपराएँ
- गैर-स्पष्ट प्रतिबंध जो AI को जानने की जरूरत है
- नियम जो पहले अक्सर अनदेखे हो जाते थे

इसे परिपूर्ण बनाने की चिंता न करें। हम अभी भी सीख रहे हैं कि यहाँ सबसे अच्छा क्या काम करता है, और हम संदर्भ इंजेक्शन के काम करने के तरीके में सुधार करते रहेंगे क्योंकि हम प्रयोग करते हैं।

---

## माइग्रेशन चलाना

`openspec init` और `openspec update` दोनों लेगेसी फ़ाइलों का पता लगाते हैं और आपको उसी सफाई प्रक्रिया के माध्यम से मार्गदर्शन करते हैं। अपनी स्थिति के अनुसार जो भी उपयुक्त हो उसका उपयोग करें:

- नई इंस्टॉलेशन डिफ़ॉल्ट रूप से प्रोफ़ाइल `core` (`propose`, `explore`, `apply`, `sync`, `archive`) का उपयोग करती हैं।
- माइग्रेट की गई इंस्टॉलेशन आपके पहले से इंस्टॉल किए गए वर्कफ़्लो को संरक्षित करती हैं, जरूरत पड़ने पर `custom` प्रोफ़ाइल लिखकर।

### `openspec init` का उपयोग करना

यह चलाएँ यदि आप नए टूल्स जोड़ना चाहते हैं या यह पुनर्कॉन्फ़िगर करना चाहते हैं कि कौन से टूल्स सेट अप किए गए हैं:

```bash
openspec init
```

init कमांड लेगेसी फ़ाइलों का पता लगाता है और आपको सफाई के माध्यम से मार्गदर्शन करता है:

```
Upgrading to the new OpenSpec

OpenSpec now uses agent skills, the emerging standard across coding
agents. This simplifies your setup while keeping everything working
as before.

Files to remove
No user content to preserve:
  • .claude/commands/openspec/
  • openspec/AGENTS.md

Files to update
OpenSpec markers will be removed, your content preserved:
  • CLAUDE.md
  • AGENTS.md

Needs your attention
  • openspec/project.md
    We won't delete this file. It may contain useful project context.

    The new openspec/config.yaml has a "context:" section for planning
    context. This is included in every OpenSpec request and works more
    reliably than the old project.md approach.

    Review project.md, move any useful content to config.yaml's context
    section, then delete the file when ready.

? Upgrade and clean up legacy files? (Y/n)
```

**जब आप हाँ कहते हैं तो क्या होता है:**

1. लेगेसी स्लैश कमांड निर्देशिकाएँ हटा दी जाती हैं
2. `CLAUDE.md`, `AGENTS.md` आदि से OpenSpec मार्कर हटा दिए जाते हैं (आपकी सामग्री रहती है)
3. `openspec/AGENTS.md` हटा दिया जाता है
4. नई स्किल्स `.claude/skills/` में इंस्टॉल की जाती हैं
5. `openspec/config.yaml` डिफ़ॉल्ट स्कीमा के साथ बनाया जाता है

### `openspec update` का उपयोग करना

यह चलाएँ यदि आप केवल माइग्रेट करना और अपने मौजूदा टूल्स को नवीनतम संस्करण में रिफ्रेश करना चाहते हैं:

```bash
openspec update
```

update कमांड भी लेगेसी आर्टिफैक्ट्स का पता लगाता है और उन्हें साफ करता है, फिर आपकी वर्तमान प्रोफ़ाइल और डिलीवरी सेटिंग्स से मेल खाने के लिए जनरेट की गई स्किल्स/कमांड को रिफ्रेश करता है।

### गैर-इंटरैक्टिव / CI वातावरण

स्क्रिप्टेड माइग्रेशन के लिए:

```bash
openspec init --force --tools claude
```

`--force` फ़्लैग प्रॉम्प्ट को छोड़ देता है और सफाई को स्वतः स्वीकार कर लेता है।

---

## project.md को config.yaml में माइग्रेट करना

पुराना `openspec/project.md` प्रोजेक्ट संदर्भ के लिए एक फ्रीफॉर्म मार्कडाउन फ़ाइल था। नया `openspec/config.yaml` संरचित है और—महत्वपूर्ण रूप से—**हर योजना अनुरोध में इंजेक्ट किया जाता है** ताकि आपकी परंपराएँ हमेशा मौजूद हों जब AI काम कर रहा हो।

### पहले (project.md)

```markdown
# Project Context

This is a TypeScript monorepo using React and Node.js.
We use Jest for testing and follow strict ESLint rules.
Our API is RESTful and documented in docs/api.md.

## Conventions

- All public APIs must maintain backwards compatibility
- New features should include tests
- Use Given/When/Then format for specifications
```

### बाद में (config.yaml)

```yaml
schema: spec-driven

context: |
  Tech stack: TypeScript, React, Node.js
  Testing: Jest with React Testing Library
  API: RESTful, documented in docs/api.md
  We maintain backwards compatibility for all public APIs

rules:
  proposal:
    - Include rollback plan for risky changes
  specs:
    - Use Given/When/Then format for scenarios
    - Reference existing patterns before inventing new ones
  design:
    - Include sequence diagrams for complex flows
```

### प्रमुख अंतर

| project.md | config.yaml |
|------------|-------------|
| फ्रीफॉर्म मार्कडाउन | संरचित YAML |
| टेक्स्ट का एक टुकड़ा | अलग संदर्भ और प्रति-आर्टिफैक्ट नियम |
| अस्पष्ट कि इसका उपयोग कब होता है | संदर्भ सभी आर्टिफैक्ट्स में दिखाई देता है; नियम केवल मिलान करने वाले आर्टिफैक्ट्स में दिखाई देते हैं |
| कोई स्कीमा चयन नहीं | स्पष्ट `schema:` फ़ील्ड डिफ़ॉल्ट वर्कफ़्लो सेट करती है |

### क्या रखें, क्या छोड़ें

माइग्रेशन के दौरान, चयनात्मक रहें। अपने आप से पूछें: "क्या AI को इसकी जरूरत *हर* योजना अनुरोध के लिए है?"

**`context:` के लिए अच्छे उम्मीदवार**
- टेक स्टैक (भाषाएँ, फ्रेमवर्क, डेटाबेस)
- प्रमुख आर्किटेक्चरल पैटर्न (मोनोरेपो, माइक्रोसर्विसेज, आदि)
- गैर-स्पष्ट प्रतिबंध ("हम लाइब्रेरी X का उपयोग नहीं कर सकते क्योंकि...")
- महत्वपूर्ण परंपराएँ जो अक्सर अनदेखी हो जाती हैं

**इसके बजाय `rules:` में ले जाएँ**
- आर्टिफैक्ट-विशिष्ट फ़ॉर्मेटिंग ("स्पेक्स में Given/When/Then का उपयोग करें")
- समीक्षा मानदंड ("प्रस्तावों में रोलबैक योजनाएँ शामिल होनी चाहिए")
- ये केवल मिलान करने वाले आर्टिफैक्ट के लिए दिखाई देते हैं, अन्य अनुरोधों को हल्का रखते हैं

**पूरी तरह से छोड़ दें**
- सामान्य सर्वोत्तम प्रथाएँ जो AI पहले से जानता है
- विस्तृत स्पष्टीकरण जिन्हें संक्षेपित किया जा सकता है
- ऐतिहासिक संदर्भ जो वर्तमान कार्य को प्रभावित नहीं करता

### माइग्रेशन चरण

1. **config.yaml बनाएँ** (यदि पहले से init द्वारा नहीं बनाया गया है):
   ```yaml
   schema: spec-driven
   ```

2. **अपना संदर्भ जोड़ें** (संक्षिप्त रहें—यह हर अनुरोध में जाता है):
   ```yaml
   context: |
     आपकी प्रोजेक्ट पृष्ठभूमि यहाँ जाती है।
     उन चीज़ों पर ध्यान केंद्रित करें जो AI को वास्तव में जानने की जरूरत है।
   ```

3. **प्रति-आर्टिफैक्ट नियम जोड़ें** (वैकल्पिक):
   ```yaml
   rules:
     proposal:
       - आपका प्रस्ताव-विशिष्ट मार्गदर्शन
     specs:
       - आपके स्पेक-लेखन नियम
   ```

4. **project.md को हटा दें** एक बार जब आप सब कुछ उपयोगी स्थानांतरित कर लें।

**इसके बारे में ज्यादा न सोचें।** आवश्यक चीज़ों से शुरू करें और दोहराएँ। यदि आप देखते हैं कि AI कुछ महत्वपूर्ण छोड़ रहा है, तो इसे जोड़ें। यदि संदर्भ भारी लगता है, तो इसे छाँटें। यह एक जीवित दस्तावेज़ है।

### मदद चाहिए? इस प्रॉम्प्ट का उपयोग करें

यदि आप अनिश्चित हैं कि अपने project.md को कैसे संक्षेपित करें, तो अपने AI सहायक से पूछें:

```
मैं OpenSpec के पुराने project.md से नए config.yaml प्रारूप में माइग्रेट कर रहा हूँ।

यहाँ मेरा वर्तमान project.md है:
[अपनी project.md सामग्री पेस्ट करें]

कृपया मुझे इसके साथ एक config.yaml बनाने में मदद करें:
1. एक संक्षिप्त `context:` अनुभाग (यह हर योजना अनुरोध में इंजेक्ट किया जाता है, इसलिए इसे तंग रखें—टेक स्टैक, प्रमुख प्रतिबंधों और अक्सर अनदेखी होने वाली परंपराओं पर ध्यान केंद्रित करें)
2. विशिष्ट आर्टिफैक्ट्स के लिए `rules:` यदि कोई सामग्री आर्टिफैक्ट-विशिष्ट है (जैसे, "Given/When/Then का उपयोग करें" स्पेक्स नियमों में जाता है, वैश्विक संदर्भ में नहीं)

किसी भी सामान्य चीज़ को छोड़ दें जो AI मॉडल पहले से जानते हैं। संक्षिप्तता के बारे में निर्दयी रहें।
```

AI आपको यह पहचानने में मदद करेगा कि क्या आवश्यक है बनाम क्या छाँटा जा सकता है।

---

## नई कमांड्स

कमांड उपलब्धता प्रोफ़ाइल-निर्भर है:

**डिफ़ॉल्ट (`core` प्रोफ़ाइल):**

| कमांड | उद्देश्य |
|---------|---------|
| `/opsx:propose` | एक चरण में परिवर्तन बनाएँ और योजना आर्टिफैक्ट्स जनरेट करें |
| `/opsx:explore` | बिना संरचना के विचारों पर विचार करें |
| `/opsx:apply` | tasks.md से कार्यों को लागू करें |
| `/opsx:archive` | परिवर्तन को अंतिम रूप दें और संग्रहीत करें |

**विस्तारित वर्कफ़्लो (कस्टम चयन):**

| कमांड | उद्देश्य |
|---------|---------|
| `/opsx:new` | एक नया परिवर्तन स्कैफ़ोल्ड शुरू करें |
| `/opsx:continue` | अगला आर्टिफैक्ट बनाएँ (एक समय में एक) |
| `/opsx:ff` | फास्ट-फॉरवर्ड—एक बार में योजना आर्टिफैक्ट्स बनाएँ |
| `/opsx:verify` | मान्य करें कि कार्यान्वयन स्पेक्स से मेल खाता है |
| `/opsx:sync` | डेल्टा स्पेक्स को मुख्य स्पेक्स में मर्ज करें |
| `/opsx:bulk-archive` | एक बार में कई परिवर्तनों को संग्रहीत करें |
| `/opsx:onboard` | निर्देशित एंड-टू-एंड ऑनबोर्डिंग वर्कफ़्लो |

`openspec config profile` के साथ विस्तारित कमांड्स सक्षम करें, फिर `openspec update` चलाएँ।

### लेगेसी से कमांड मैपिंग

| लेगेसी | OPSX समकक्ष |
|--------|-----------------|
| `/openspec:proposal` | `/opsx:propose` (डिफ़ॉल्ट) या `/opsx:new` फिर `/opsx:ff` (विस्तारित) |
| `/openspec:apply` | `/opsx:apply` |
| `/openspec:archive` | `/opsx:archive` |

### नई क्षमताएँ

ये क्षमताएँ विस्तारित वर्कफ़्लो कमांड सेट का हिस्सा हैं।

**सूक्ष्म आर्टिफैक्ट निर्माण:**
```
/opsx:continue
```
निर्भरताओं के आधार पर एक समय में एक आर्टिफैक्ट बनाता है। इसका उपयोग तब करें जब आप प्रत्येक चरण की समीक्षा करना चाहते हैं।

**अन्वेषण मोड:**
```
/opsx:explore
```
किसी परिवर्तन के लिए प्रतिबद्ध होने से पहले एक साथी के साथ विचारों पर विचार करें।

---

## नई आर्किटेक्चर को समझना

### फेज-लॉक्ड से फ्लुइड तक

पुराना कार्यप्रवाह रैखिक प्रगति को बाध्य करता था:

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   PLANNING   │ ───► │ IMPLEMENTING │ ───► │   ARCHIVING  │
│    PHASE     │      │    PHASE     │      │    PHASE     │
└──────────────┘      └──────────────┘      └──────────────┘

यदि आप कार्यान्वयन में हैं और महसूस करते हैं कि डिज़ाइन गलत है?
बहुत बुरा। फेज गेट आपको आसानी से वापस जाने नहीं देते।
```

OPSX कार्रवाइयों (actions) का उपयोग करता है, चरणों (phases) का नहीं:

```
         ┌───────────────────────────────────────────────┐
         │           ACTIONS (not phases)                │
         │                                               │
         │     new ◄──► continue ◄──► apply ◄──► archive │
         │      │          │           │             │   │
         │      └──────────┴───────────┴─────────────┘   │
         │                    any order                  │
         └───────────────────────────────────────────────┘
```

### निर्भरता ग्राफ

आर्टिफैक्ट एक निर्देशित ग्राफ बनाते हैं। निर्भरताएँ सक्षमकर्ता (enablers) हैं, गेट नहीं:

```
                        proposal
                       (root node)
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
           specs                       design
        (requires:                  (requires:
         proposal)                   proposal)
              │                           │
              └─────────────┬─────────────┘
                            │
                            ▼
                         tasks
                     (requires:
                     specs, design)
```

जब आप `/opsx:continue` चलाते हैं, तो यह जाँचता है कि क्या तैयार है और अगला आर्टिफैक्ट प्रदान करता है। आप किसी भी क्रम में कई तैयार आर्टिफैक्ट भी बना सकते हैं।

### स्किल्स बनाम कमांड

पुरानी प्रणाली टूल-विशिष्ट कमांड फ़ाइलों का उपयोग करती थी:

```
.claude/commands/openspec/
├── proposal.md
├── apply.md
└── archive.md
```

OPSX उभरते **स्किल्स** मानक का उपयोग करता है:

```
.claude/skills/
├── openspec-explore/SKILL.md
├── openspec-new-change/SKILL.md
├── openspec-continue-change/SKILL.md
├── openspec-apply-change/SKILL.md
└── ...
```

स्किल्स को कई AI कोडिंग टूल्स में पहचाना जाता है और ये समृद्ध मेटाडेटा प्रदान करती हैं।

---

## मौजूदा परिवर्तनों को जारी रखना

आपके प्रगति पर चल रहे परिवर्तन OPSX कमांड के साथ सहजता से काम करते हैं।

**क्या आपके पास पुराने कार्यप्रवाह से कोई सक्रिय परिवर्तन है?**

```
/opsx:apply add-my-feature
```

OPSX मौजूदा आर्टिफैक्ट पढ़ता है और जहाँ आपने छोड़ा था वहाँ से जारी रखता है।

**क्या आप किसी मौजूदा परिवर्तन में और आर्टिफैक्ट जोड़ना चाहते हैं?**

```
/opsx:continue add-my-feature
```

पहले से मौजूद चीज़ों के आधार पर दिखाता है कि क्या बनाने के लिए तैयार है।

**क्या आपको स्थिति देखने की आवश्यकता है?**

```bash
openspec status --change add-my-feature
```

---

## नई कॉन्फ़िगरेशन प्रणाली

### config.yaml संरचना

```yaml
# Required: Default schema for new changes
schema: spec-driven

# Optional: Project context (max 50KB)
# Injected into ALL artifact instructions
context: |
  Your project background, tech stack,
  conventions, and constraints.

# Optional: Per-artifact rules
# Only injected into matching artifacts
rules:
  proposal:
    - Include rollback plan
  specs:
    - Use Given/When/Then format
  design:
    - Document fallback strategies
  tasks:
    - Break into 2-hour maximum chunks
```

### स्कीमा रिज़ॉल्यूशन

यह निर्धारित करते समय कि कौन सा स्कीमा उपयोग करना है, OPSX क्रम में जाँच करता है:

1.  **CLI फ़्लैग**: `--schema <name>` (सर्वोच्च प्राथमिकता)
2.  **परिवर्तन मेटाडेटा**: परिवर्तन निर्देशिका में `.openspec.yaml`
3.  **प्रोजेक्ट कॉन्फ़िग**: `openspec/config.yaml`
4.  **डिफ़ॉल्ट**: `spec-driven`

### उपलब्ध स्कीमा

| स्कीमा | आर्टिफैक्ट | सर्वोत्तम उपयोग के लिए |
|--------|-----------|----------|
| `spec-driven` | proposal → specs → design → tasks | अधिकांश प्रोजेक्ट |

सभी उपलब्ध स्कीमा सूचीबद्ध करें:

```bash
openspec schemas
```

### कस्टम स्कीमा

अपना स्वयं का कार्यप्रवाह बनाएँ:

```bash
openspec schema init my-workflow
```

या किसी मौजूदा को फोर्क करें:

```bash
openspec schema fork spec-driven my-workflow
```

विवरण के लिए [कस्टमाइज़ेशन](customization.md) देखें।

---

## समस्या निवारण

### "गैर-इंटरैक्टिव मोड में लिगेसी फ़ाइलें पाई गईं"

आप CI या गैर-इंटरैक्टिव वातावरण में चल रहे हैं। इसका उपयोग करें:

```bash
openspec init --force
```

### माइग्रेशन के बाद कमांड दिखाई नहीं दे रही हैं

अपना IDE पुनः आरंभ करें। स्किल्स स्टार्टअप पर पता लगाई जाती हैं।

### "नियमों में अज्ञात आर्टिफैक्ट ID"

जाँचें कि आपकी `rules:` कुंजियाँ आपके स्कीमा के आर्टिफैक्ट ID से मेल खाती हैं:

- **spec-driven**: `proposal`, `specs`, `design`, `tasks`

वैध आर्टिफैक्ट ID देखने के लिए यह चलाएँ:

```bash
openspec schemas --json
```

### कॉन्फ़िग लागू नहीं हो रहा है

1.  सुनिश्चित करें कि फ़ाइल `openspec/config.yaml` पर है (`.yml` नहीं)
2.  YAML सिंटैक्स को मान्य करें
3.  कॉन्फ़िग परिवर्तन तुरंत प्रभावी होते हैं—पुनः आरंभ करने की आवश्यकता नहीं है

### project.md माइग्रेट नहीं हुआ

प्रणाली जानबूझकर `project.md` को संरक्षित करती है क्योंकि इसमें आपकी कस्टम सामग्री हो सकती है। इसे मैन्युअल रूप से समीक्षा करें, उपयोगी भागों को `config.yaml` में ले जाएँ, फिर इसे हटा दें।

### क्या आप देखना चाहते हैं कि क्या साफ़ किया जाएगा?

init चलाएँ और सफ़ाई प्रॉम्प्ट को अस्वीकार करें—आप बिना कोई परिवर्तन किए पूर्ण पहचान सारांश देखेंगे।

---

## त्वरित संदर्भ

### माइग्रेशन के बाद फ़ाइलें

```
project/
├── openspec/
│   ├── specs/                    # Unchanged
│   ├── changes/                  # Unchanged
│   │   └── archive/              # Unchanged
│   └── config.yaml               # NEW: Project configuration
├── .claude/
│   └── skills/                   # NEW: OPSX skills
│       ├── openspec-propose/     # default core profile
│       ├── openspec-explore/
│       ├── openspec-apply-change/
│       ├── openspec-sync-specs/
│       └── ...                   # expanded profile adds new/continue/ff/etc.
├── CLAUDE.md                     # OpenSpec markers removed, your content preserved
└── AGENTS.md                     # OpenSpec markers removed, your content preserved
```

### क्या हटा दिया गया है

- `.claude/commands/openspec/` — `.claude/skills/` से बदल दिया गया
- `openspec/AGENTS.md` — अप्रचलित
- `openspec/project.md` — `config.yaml` में माइग्रेट करें, फिर हटाएँ
- `CLAUDE.md`, `AGENTS.md` आदि में OpenSpec मार्कर ब्लॉक।

### कमांड चीटशीट

```text
/opsx:propose      Start quickly (default core profile)
/opsx:apply        Implement tasks
/opsx:archive      Finish and archive

# Expanded workflow (if enabled):
/opsx:new          Scaffold a change
/opsx:continue     Create next artifact
/opsx:ff           Create planning artifacts
```

---

## सहायता प्राप्त करना

- **Discord**: [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues**: [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **दस्तावेज़**: पूर्ण OPSX संदर्भ के लिए [docs/opsx.md](opsx.md)
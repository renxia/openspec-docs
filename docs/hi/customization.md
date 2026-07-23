# अनुकूलन

OpenSpec तीन स्तरों की अनुकूलन सुविधाएँ प्रदान करता है:

| स्तर | यह क्या करता है | सबसे अच्छा किसके लिए है |
|-------|--------------|----------|
| **परियोजना कॉन्फ़िगरेशन** | डिफ़ॉल्ट सेट करें, संदर्भ/नियम इंजेक्ट करें | अधिकांश टीमें |
| **कस्टम स्कीमा** | अपने स्वयं के वर्कफ़्लो आर्टिफैक्ट्स परिभाषित करें | अनोखे प्रक्रियाओं वाली टीमें |
| **ग्लोबल ओवरराइड** | सभी परियोजनाओं में स्कीमा साझा करें | पावर उपयोगकर्ता |

---

## परियोजना कॉन्फ़िगरेशन

`openspec/config.yaml` फ़ाइल आपकी टीम के लिए OpenSpec को अनुकूलित करने का सबसे आसान तरीका है। यह आपको अनुमति देती है:

- **डिफ़ॉल्ट स्कीमा सेट करें** - हर कमांड पर `--schema` छोड़ें
- **परियोजना संदर्भ इंजेक्ट करें** - AI आपके टेक स्टैक, कन्वेंशन आदि को देखता है
- **प्रत्येक आर्टिफैक्ट के लिए नियम जोड़ें** - विशिष्ट आर्टिफैक्ट्स के लिए कस्टम नियम

### त्वरित सेटअप

```bash
openspec init
```

यह इंटरैक्टिव तरीके से कॉन्फ़िग बनाने में आपका मार्गदर्शन करता है। या मैन्युअली एक बनाएं:

```yaml
# openspec/config.yaml
schema: spec-driven

context: |
  Tech stack: TypeScript, React, Node.js, PostgreSQL
  API style: RESTful, documented in docs/api.md
  Testing: Jest + React Testing Library
  We value backwards compatibility for all public APIs

rules:
  proposal:
    - Include rollback plan
    - Identify affected teams
  specs:
    - Use Given/When/Then format
    - Reference existing patterns before inventing new ones
```

### यह कैसे काम करता है

**डिफ़ॉल्ट स्कीमा:**

```bash
# कॉन्फ़िगरेशन के बिना
openspec new change my-feature --schema spec-driven

# कॉन्फ़िगरेशन के साथ - स्कीमा स्वतः होती है
openspec new change my-feature
```

**संदर्भ और नियम इंजेक्शन:**

किसी भी आर्टिफैक्ट जेनरेट करते समय, आपका संदर्भ और नियम AI प्रॉम्प्ट में इंजेक्ट हो जाते हैं:

```xml
<context>
Tech stack: TypeScript, React, Node.js, PostgreSQL
...
</context>

<rules>
- Include rollback plan
- Identify affected teams
</rules>

<template>
[Schema's built-in template]
</template>
```

- **संदर्भ** सभी आर्टिफैक्ट्स में दिखाई देता है
- **नियम** केवल मैचिंग आर्टिफैक्ट के लिए ही दिखाई देते हैं

### स्कीमा रिज़ॉल्यूशन ऑर्डर

जब OpenSpec को कोई स्कीमा चाहिए होती है, तो यह इस क्रम में चेक करता है:

1. CLI फ्लैग: `--schema <name>`
2. चेंज मेटाडेटा (चेंज फोल्डर में `.openspec.yaml`)
3. परियोजना कॉन्फ़िगरेशन (`openspec/config.yaml`)
4. डिफ़ॉल्ट (`spec-driven`)

---

## कस्टम स्कीमा

जब परियोजना कॉन्फ़िगरेशन काफी न हो, तो पूरी तरह से कस्टम वर्कफ़्लो के साथ अपनी खुद की स्कीमा बनाएं। कस्टम स्कीमाएँ आपकी परियोजना के `openspec/schemas/` डिरेक्ट्री में होती हैं और उन्हें आपके कोड के साथ वर्जन कंट्रोल किया जाता है।

```text
your-project/
├── openspec/
│   ├── config.yaml        # परियोजना कॉन्फ़िगरेशन
│   ├── schemas/           # कस्टम स्कीमाएँ यहां रहती हैं
│   │   └── my-workflow/
│   │       ├── schema.yaml
│   │       └── templates/
│   └── changes/           # आपके परिवर्तन
└── src/
```

### मौजूदा स्कीमा को फॉर्क करें

अनुकूलन करने का सबसे तेज़ तरीका बिल्ट-इन स्कीमा को फॉर्क करना है:

```bash
openspec schema fork spec-driven my-workflow
```

यह पूरी `spec-driven` स्कीमा को `openspec/schemas/my-workflow/` पर कॉपी करता है जहां आप इसे स्वतंत्र रूप से एडिट कर सकते हैं।

**आपको क्या मिलता है:**

```text
openspec/schemas/my-workflow/
├── schema.yaml           # वर्कफ़्लो परिभाषा
└── templates/
    ├── proposal.md       # प्रॉपोज़ल आर्टिफैक्ट के लिए टेम्पलेट
    ├── spec.md           # स्पेक्स के लिए टेम्पलेट
    ├── design.md         # डिज़ाइन के लिए टेम्पलेट
    └── tasks.md          # टास्क के लिए टेम्पलेट
```

अब वर्कफ़्लो बदलने के लिए `schema.yaml` एडिट करें, या AI द्वारा जेनरेट किए जाने वाले कॉन्टेंट बदलने के लिए टेम्पलेट एडिट करें।

### शून्य से स्कीमा बनाएं

पूरी तरह से नए वर्कफ़्लो के लिए:

```bash
# इंटरैक्टिव
openspec schema init research-first

# नॉन-इंटरैक्टिव
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

### स्कीमा संरचना

एक स्कीमा आपके वर्कफ़्लो में आर्टिफैक्ट्स को परिभाषित करती है और यह निर्धारित करती है कि वे एक दूसरे पर कैसे निर्भर हैं:

```yaml
# openspec/schemas/my-workflow/schema.yaml
name: my-workflow
version: 1
description: My team's custom workflow

artifacts:
  - id: proposal
    generates: proposal.md
    description: Initial proposal document
    template: proposal.md
    instruction: |
      Create a proposal that explains WHY this change is needed.
      Focus on the problem, not the solution.
    requires: []

  - id: design
    generates: design.md
    description: Technical design
    template: design.md
    instruction: |
      Create a design document explaining HOW to implement.
    requires:
      - proposal    # डिज़ाइन तब तक नहीं बनाया जा सकता जब तक प्रॉपोज़ल मौजूद न हो

  - id: tasks
    generates: tasks.md
    description: Implementation checklist
    template: tasks.md
    requires:
      - design

apply:
  requires: [tasks]
  tracks: tasks.md
```

**मुख्य फ़ील्ड:**

| फ़ील्ड | उद्देश्य |
|-------|---------|
| `id` | यूनिक आइडेंटिफायर, कमांड और नियमों में उपयोग किया जाता है |
| `generates` | आउटपुट फ़ाइल नाम (`specs/**/*.md` जैसे ग्लॉब्स को सपोर्ट करता है) |
| `template` | `templates/` डिरेक्ट्री में मौजूद टेम्पलेट फ़ाइल |
| `instruction` | इस आर्टिफैक्ट बनाने के लिए AI निर्देश |
| `requires` | निर्भरताएँ - कौन से आर्टिफैक्ट्स पहले मौजूद होने चाहिए |

### टेम्पलेट्स

टेम्पलेट्स मार्कडाउन फ़ाइलें होती हैं जो AI को गाइड करती हैं। जब कोई आर्टिफैक्ट बनाया जाता है तो वे प्रॉम्प्ट में इंजेक्ट हो जाती हैं।

```markdown
<!-- templates/proposal.md -->
## Why

<!-- इस परिवर्तन के लिए प्रेरणा समझाएं। यह किस समस्या का समाधान करता है? -->

## What Changes

<!-- जो बदलाव आएंगा उनका वर्णन करें। नई क्षमताओं या संशोधनों के बारे में विशिष्ट रहें। -->

## Impact

<!-- प्रभावित कोड, APIs, निर्भरताएँ, सिस्टम -->
```

टेम्पलेट्स में निम्नलिखित शामिल हो सकता है:
- AI द्वारा भरने वाले सेक्शन हेडर
- AI के लिए गाइडेंस वाले HTML कमेंट्स
- अपेक्षित संरचना दिखाने वाले उदाहरण फॉर्मेट

### अपनी स्कीमा को वैलिडेट करें

कस्टम स्कीमा का उपयोग करने से पहले, इसे वैलिडेट करें:

```bash
openspec schema validate my-workflow
```

यह निम्नलिखित चेक करता है:
- `schema.yaml` सिंटैस सही है
- सभी संदर्भित टेम्पलेट्स मौजूद हैं
- कोई सर्क्यूलर डिपेंडेंसी नहीं
- आर्टिफैक्ट IDs वैध हैं

### अपनी कस्टम स्कीमा का उपयोग करें

एक बार बन जाने के बाद, अपनी स्कीमा का उपयोग इस तरह करें:

```bash
# कमांड पर निर्दिष्ट करें
openspec new change feature --schema my-workflow

# या config.yaml में डिफ़ॉल्ट के रूप में सेट करें
schema: my-workflow
```

### स्कीमा रिज़ॉल्यूशन डीबग करें

कौन सी स्कीमा उपयोग में है यह सुनिश्चित नहीं है? इनसे चेक करें:

```bash
# देखें कि किसी विशिष्ट स्कीमा का रिज़ॉल्यूशन कहां से हो रहा है
openspec schema which my-workflow

# सभी उपलब्ध स्कीमाओं की सूची बनाएं
openspec schema which --all
```

आउटपुट दिखाता है कि यह आपकी परियोजना, यूजर डिरेक्ट्री या पैकेज से है:

```text
Schema: my-workflow
Source: project
Path: /path/to/project/openspec/schemas/my-workflow
```

---

> **नोट:** OpenSpec प्रोजेक्ट्स में शेयर करने के लिए `~/.local/share/openspec/schemas/` पर यूजर-लेवल स्कीमाओं का भी समर्थन करता है, लेकिन `openspec/schemas/` में परियोजना-लेवल स्कीमाओं की सिफारिश की जाती है क्योंकि उन्हें आपके कोड के साथ वर्जन कंट्रोल किया जाता है।

---

## उदाहरण

### त्वरित इटरेशन वर्कफ़्लो

त्वरित इटरेशन के लिए एक मिनिमल वर्कफ़्लो:

```yaml
# openspec/schemas/rapid/schema.yaml
name: rapid
version: 1
description: Fast iteration with minimal overhead

artifacts:
  - id: proposal
    generates: proposal.md
    description: Quick proposal
    template: proposal.md
    instruction: |
      Create a brief proposal for this change.
      Focus on what and why, skip detailed specs.
    requires: []

  - id: tasks
    generates: tasks.md
    description: Implementation checklist
    template: tasks.md
    requires: [proposal]

apply:
  requires: [tasks]
  tracks: tasks.md
```

### रिव्यू आर्टिफैक्ट जोड़ना

डिफ़ॉल्ट को फॉर्क करें और रिव्यू स्टेप जोड़ें:

```bash
openspec schema fork spec-driven with-review
```

फिर जोड़ने के लिए `schema.yaml` एडिट करें:

```yaml
  - id: review
    generates: review.md
    description: Pre-implementation review checklist
    template: review.md
    instruction: |
      Create a review checklist based on the design.
      Include security, performance, and testing considerations.
    requires:
      - design

  - id: tasks
    # ... मौजूदा टास्क कॉन्फ़िगरेशन ...
    requires:
      - specs
      - design
      - review    # अब टास्क के लिए रिव्यू भी आवश्यक है
```

---

## कम्युनिटी स्कीमा

OpenSpec स्टैंडअलोन रिपॉजिटरी के माध्यम से वितरित कम्युनिटी द्वारा मेन्टेन किए जाने वाली स्कीमाओं का भी समर्थन करता है। ये ऑपिनियनएटेड वर्कफ़्लो प्रदान करती हैं जो OpenSpec को अन्य टूल्स या सिस्टम के साथ इंटीग्रेट करती हैं, जिस तरह [github/spec-kit की कम्युनिटी एक्सटेंशन कैटलॉग](https://github.com/github/spec-kit/tree/main/extensions) spec-kit के लिए काम करती है।

कम्युनिटी स्कीमाएँ OpenSpec कोर में वेंडर नहीं की जाती हैं — ये अपने स्वयं के रिलीज कैडेंस के साथ अपने स्वयं के रिपॉजिट्री में होती हैं। किसी एक का उपयोग करने के लिए, स्कीमा बंडल को अपनी परियोजना की `openspec/schemas/<schema-name>/` डिरेक्ट्री में कॉपी करें (प्रत्येक रिपॉजिट्री के README में इंस्टॉल निर्देश होते हैं)।

| स्कीमा | मेन्टेनर | रिपॉजिट्री | विवरण |
|--------|-----------|-----------|-------------|
| `superpowers-bridge` | @JiangWay | [JiangWay/openspec-schemas](https://github.com/JiangWay/openspec-schemas/tree/main/superpowers-bridge) | OpenSpec के आर्टिफैक्ट गवर्नेंस को [obra/superpowers](https://github.com/obra/superpowers) एक्सीक्यूशन स्किल्स (ब्रेनस्टॉर्मिंग, राइटिंग-प्लान्स, सबएजेंट के माध्यम से TDD, कोड रिव्यू, फिनिशिंग) के साथ इंटीग्रेट करता है। Superpowers द्वारा नेटिवली कवर नहीं की गई खामी को भरने के लिए इविडेंस-फर्स्ट `retrospective` आर्टिफैक्ट जोड़ता है। |
| `nanopm` | @nmrtn | [nmrtn/nanopm](https://github.com/nmrtn/nanopm/tree/main/openspec-schema) | PM-फर्स्ट वर्कफ़्लो। इंप्लीमेंटेशन के अपस्ट्रीम [nanopm](https://github.com/nmrtn/nanopm) की प्लानिंग पाइपलाइन (ऑडिट → स्ट्रैटजी → रोडमैप → PRD) चलाता है। प्रोडक्ट प्लानिंग को OpenSpec के स्पेक-ड्रिवन इंजीनियरिंग वर्कफ़्लो से ब्रिज करता है। यदि `.nanopm/` मौजूद हो तो आर्टिफैक्ट्स उससे रीड करते हैं — प्रॉपोज़ल ऑडिट को सोर्स करता है, डिज़ाइन स्ट्रैटजी को, और टास्क PRD ब्रेकडाउन को सोर्स करते हैं। |
| `e2e-runbooks` | @Lukk17 | [Lukk17/openspec-schemas](https://github.com/Lukk17/openspec-schemas/tree/master/openspec/schemas/e2e-runbooks) | कैपेबिलिटी-लेवल एंड-टू-एंड टेस्ट रनबुक्स। प्रत्येक कैपेबिलिटी को एक इम्यूटेबल स्पेक, एक इम्यूटेबल टास्क-टेम्पलेट, और प्रत्येक एक्सीक्यूशन पर एक टाइमस्टैम्प वाला रन रिकॉर्ड मिलता है। असेर्शन केवल पर्यवेक्षणीय व्यवहार होती है (HTTP स्टेटस, रिस्पॉन्स बॉडी, पर्सिस्टेड स्टेट — कभी लॉग सबस्ट्रिंग नहीं); प्रत्येक रन में शुरू/समाप्त UTC, अवधि, और बेस्ट-एस्टिमेट LLM टोकन कंजंप्शन रिकॉर्ड होता है। |

> कम्युनिटी स्कीमा में योगदान देना चाहते हैं? अपने रिपॉजिटरी का लिंक के साथ एक ओपन करें, या इस तालिका में एक पंक्ति जोड़ने के लिए PR सबमिट करें।

---

## यह भी देखें

- [CLI रेफरेंस: स्कीमा कमांड](cli.md#schema-commands) - पूर्ण कमांड डॉक्यूमेंटेशन
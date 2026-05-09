# अनुकूलन (Customization)

OpenSpec तीन स्तरों पर अनुकूलन प्रदान करता है:

| स्तर | क्या करता है | किसके लिए सर्वोत्तम |
|-------|--------------|----------|
| **प्रोजेक्ट कॉन्फ़िग** | डिफ़ॉल्ट सेट करें, संदर्भ/नियम इंजेक्ट करें | अधिकांश टीमों के लिए |
| **कस्टम स्कीमा** | अपने स्वयं के वर्कफ़्लो आर्टिफ़ैक्ट परिभाषित करें | अनूठी प्रक्रियाओं वाली टीमों के लिए |
| **ग्लोबल ओवरराइड** | सभी प्रोजेक्ट्स में स्कीमा साझा करें | पावर यूज़र्स के लिए |

---

## प्रोजेक्ट कॉन्फ़िगरेशन

`openspec/config.yaml` फ़ाइल आपकी टीम के लिए OpenSpec को अनुकूलित करने का सबसे आसान तरीका है। यह आपको निम्नलिखित सुविधाएँ देता है:

- **डिफ़ॉल्ट स्कीमा सेट करें** - हर कमांड पर `--schema` लिखने की ज़रूरत नहीं
- **प्रोजेक्ट संदर्भ इंजेक्ट करें** - AI आपकी टेक स्टैक, कन्वेंशन आदि देखता है
- **प्रति-आर्टिफ़ैक्ट नियम जोड़ें** - विशिष्ट आर्टिफ़ैक्ट्स के लिए कस्टम नियम

### त्वरित सेटअप

```bash
openspec init
```

यह आपको इंटरैक्टिव रूप से कॉन्फ़िग बनाने में मार्गदर्शन करता है। या मैन्युअल रूप से बनाएँ:

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
# बिना कॉन्फ़िग के
openspec new change my-feature --schema spec-driven

# कॉन्फ़िग के साथ - स्कीमा स्वचालित होता है
openspec new change my-feature
```

**संदर्भ और नियम इंजेक्शन:**

कोई भी आर्टिफ़ैक्ट जनरेट करते समय, आपका संदर्भ और नियम AI प्रॉम्प्ट में इंजेक्ट किए जाते हैं:

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

- **संदर्भ** सभी आर्टिफ़ैक्ट्स में दिखाई देता है
- **नियम** केवल मेल खाने वाले आर्टिफ़ैक्ट के लिए ही दिखाई देते हैं

### स्कीमा रिज़ॉल्यूशन क्रम

जब OpenSpec को किसी स्कीमा की आवश्यकता होती है, तो वह इस क्रम में जाँच करता है:

1. CLI फ़्लैग: `--schema <name>`
2. चेंज मेटाडेटा (चेंज फ़ोल्डर में `.openspec.yaml`)
3. प्रोजेक्ट कॉन्फ़िग (`openspec/config.yaml`)
4. डिफ़ॉल्ट (`spec-driven`)

---

## कस्टम स्कीमा

जब प्रोजेक्ट कॉन्फ़िग पर्याप्त न हो, तो पूरी तरह से कस्टम वर्कफ़्लो के साथ अपना स्वयं का स्कीमा बनाएँ। कस्टम स्कीमा आपके प्रोजेक्ट के `openspec/schemas/` डायरेक्ट्री में रहते हैं और आपके कोड के साथ वर्शन-कंट्रोल किए जाते हैं।

```text
your-project/
├── openspec/
│   ├── config.yaml        # Project config
│   ├── schemas/           # Custom schemas live here
│   │   └── my-workflow/
│   │       ├── schema.yaml
│   │       └── templates/
│   └── changes/           # Your changes
└── src/
```

### मौजूदा स्कीमा को फ़ोर्क करें

अनुकूलन का सबसे तेज़ तरीका है किसी बिल्ट-इन स्कीमा को फ़ोर्क करना:

```bash
openspec schema fork spec-driven my-workflow
```

यह पूरे `spec-driven` स्कीमा को `openspec/schemas/my-workflow/` में कॉपी करता है, जहाँ आप इसे स्वतंत्र रूप से संपादित कर सकते हैं।

**आपको क्या मिलता है:**

```text
openspec/schemas/my-workflow/
├── schema.yaml           # Workflow definition
└── templates/
    ├── proposal.md       # Template for proposal artifact
    ├── spec.md           # Template for specs
    ├── design.md         # Template for design
    └── tasks.md          # Template for tasks
```

अब वर्कफ़्लो बदलने के लिए `schema.yaml` संपादित करें, या AI द्वारा जनरेट की गई सामग्री बदलने के लिए टेम्पलेट्स संपादित करें।

### शुरू से स्कीमा बनाएँ

पूरी तरह से नए वर्कफ़्लो के लिए:

```bash
# इंटरैक्टिव
openspec schema init research-first

# गैर-इंटरैक्टिव
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

### स्कीमा संरचना

एक स्कीमा आपके वर्कफ़्लो में आर्टिफ़ैक्ट्स और उनके आपसी निर्भरता को परिभाषित करता है:

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
      - proposal    # Can't create design until proposal exists

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

**मुख्य फ़ील्ड्स:**

| फ़ील्ड | उद्देश्य |
|-------|---------|
| `id` | यूनिक पहचानकर्ता, कमांड और नियमों में उपयोग होता है |
| `generates` | आउटपुट फ़ाइल नाम (जैसे `specs/**/*.md` ग्लोब सपोर्ट) |
| `template` | `templates/` डायरेक्ट्री में टेम्पलेट फ़ाइल |
| `instruction` | इस आर्टिफ़ैक्ट को बनाने के लिए AI निर्देश |
| `requires` | निर्भरताएँ - कौन से आर्टिफ़ैक्ट पहले मौजूद होने चाहिए |

### टेम्पलेट्स

टेम्पलेट्स मार्कडाउन फ़ाइलें हैं जो AI को मार्गदर्शन देती हैं। उस आर्टिफ़ैक्ट को बनाते समय इन्हें प्रॉम्प्ट में इंजेक्ट किया जाता है।

```markdown
<!-- templates/proposal.md -->
## Why

<!-- Explain the motivation for this change. What problem does this solve? -->

## What Changes

<!-- Describe what will change. Be specific about new capabilities or modifications. -->

## Impact

<!-- Affected code, APIs, dependencies, systems -->
```

टेम्पलेट्स में शामिल हो सकते हैं:
- वे सेक्शन हेडर जिन्हें AI को भरना चाहिए
- AI के लिए मार्गदर्शन वाले HTML कमेंट्स
- अपेक्षित संरचना दिखाने वाले उदाहरण फ़ॉर्मेट

### अपने स्कीमा को वैलिडेट करें

कस्टम स्कीमा का उपयोग करने से पहले, इसे वैलिडेट करें:

```bash
openspec schema validate my-workflow
```

यह निम्नलिखित जाँच करता है:
- `schema.yaml` की सिंटैक्स सही है
- सभी संदर्भित टेम्पलेट्स मौजूद हैं
- कोई सर्कुलर निर्भरता नहीं है
- आर्टिफ़ैक्ट ID वैध हैं

### अपना कस्टम स्कीमा उपयोग करें

बनाने के बाद, अपने स्कीमा को इस प्रकार उपयोग करें:

```bash
# कमांड पर निर्दिष्ट करें
openspec new change feature --schema my-workflow

# या config.yaml में डिफ़ॉल्ट के रूप में सेट करें
schema: my-workflow
```

### स्कीमा रिज़ॉल्यूशन डिबग करें

पता नहीं कौन सा स्कीमा उपयोग हो रहा है? इस प्रकार जाँचें:

```bash
# देखें कि कोई विशिष्ट स्कीमा कहाँ से रिज़ॉल्व होता है
openspec schema which my-workflow

# सभी उपलब्ध स्कीमा सूचीबद्ध करें
openspec schema which --all
```

आउटपुट दिखाता है कि यह आपके प्रोजेक्ट, यूज़र डायरेक्ट्री, या पैकेज से है:

```text
Schema: my-workflow
Source: project
Path: /path/to/project/openspec/schemas/my-workflow
```

---

> **नोट:** OpenSpec प्रोजेक्ट्स में साझा करने के लिए `~/.local/share/openspec/schemas/` पर यूज़र-लेवल स्कीमा भी सपोर्ट करता है, लेकिन `openspec/schemas/` में प्रोजेक्ट-लेवल स्कीमा की अनुशंसा की जाती है क्योंकि ये आपके कोड के साथ वर्शन-कंट्रोल किए जाते हैं।

---

## उदाहरण

### त्वरित पुनरावृत्ति वर्कफ़्लो

त्वरित पुनरावृत्ति के लिए एक न्यूनतम वर्कफ़्लो:

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

### रिव्यू आर्टिफ़ैक्ट जोड़ना

डिफ़ॉल्ट को फ़ोर्क करें और एक रिव्यू चरण जोड़ें:

```bash
openspec schema fork spec-driven with-review
```

फिर `schema.yaml` में निम्नलिखित जोड़ें:

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
    # ... existing tasks config ...
    requires:
      - specs
      - design
      - review    # Now tasks require review too
```

---

## कम्युनिटी स्कीमा

OpenSpec कम्युनिटी-मेंटेन्ड स्कीमा भी सपोर्ट करता है जो स्टैंडअलोन रिपॉज़िटरी के माध्यम से वितरित किए जाते हैं। ये ओपिनियनेटेड वर्कफ़्लो प्रदान करते हैं जो OpenSpec को अन्य टूल्स या सिस्टम के साथ एकीकृत करते हैं, ठीक उसी तरह जैसे [github/spec-kit का कम्युनिटी एक्सटेंशन कैटलॉग](https://github.com/github/spec-kit/tree/main/extensions) spec-kit के लिए काम करता है।

कम्युनिटी स्कीमा OpenSpec कोर में वेंडर नहीं किए जाते — ये अपनी स्वयं की रिपॉज़िटरी में अपनी स्वयं की रिलीज़ गति के साथ रहते हैं। किसी का उपयोग करने के लिए, स्कीमा बंडल को अपने प्रोजेक्ट के `openspec/schemas/<schema-name>/` डायरेक्ट्री में कॉपी करें (प्रत्येक रिपॉज़िटरी के README में इंस्टॉल निर्देश हैं)।

| स्कीमा | मेंटेनर | रिपॉज़िटरी | विवरण |
|--------|-----------|-----------|-------------|
| `superpowers-bridge` | @JiangWay | [JiangWay/openspec-schemas](https://github.com/JiangWay/openspec-schemas/tree/main/superpowers-bridge) | OpenSpec के आर्टिफ़ैक्ट गवर्नेंस को [obra/superpowers](https://github.com/obra/superpowers) एग्ज़ीक्यूशन स्किल्स (ब्रेनस्टॉर्मिंग, राइटिंग-प्लान्स, सबएजेंट्स के माध्यम से TDD, कोड रिव्यू, फ़िनिशिंग) के साथ एकीकृत करता है। एक एविडेंस-फ़र्स्ट `retrospective` आर्टिफ़ैक्ट जोड़ता है जो Superpowers द्वारा मूल रूप से कवर नहीं किए गए अंतर को भरता है। |

> कम्युनिटी स्कीमा में योगदान देना चाहते हैं? अपनी रिपॉज़िटरी के लिंक के साथ एक इश्यू खोलें, या इस तालिका में एक पंक्ति जोड़कर PR सबमिट करें।

---

## यह भी देखें

- [CLI रेफ़रेंस: स्कीमा कमांड](cli.md#schema-commands) - पूर्ण कमांड दस्तावेज़ीकरण
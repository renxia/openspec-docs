# अनुकूलन

OpenSpec तीन स्तरों का अनुकूलन प्रदान करता है:

| स्तर | यह क्या करता है | किसके लिए उपयुक्त है |
|-------|--------------|----------|
| **प्रोजेक्ट कॉन्फ़िगरेशन** | डिफ़ॉल्ट सेट करें, संदर्भ/नियम इंजेक्ट करें | अधिकांश टीमें |
| **कस्टम स्कीमाज़** | अपनी कार्यप्रवाह कलाकृतियाँ परिभाषित करें | अद्वितीय प्रक्रियाओं वाली टीमें |
| **वैश्विक ओवरराइड्स** | सभी प्रोजेक्ट्स में स्कीमाज़ साझा करें | पावर उपयोगकर्ता |

---

## प्रोजेक्ट कॉन्फ़िगरेशन

`openspec/config.yaml` फ़ाइल आपकी टीम के लिए OpenSpec को अनुकूलित करने का सबसे आसान तरीका है। यह आपको यह करने देता है:

- **एक डिफ़ॉल्ट स्कीमा सेट करें** - हर कमांड पर `--schema` छोड़ दें
- **प्रोजेक्ट संदर्भ इंजेक्ट करें** - AI आपकी टेक स्टैक, परंपराओं आदि देखता है
- **प्रति-कलाकृति नियम जोड़ें** - विशिष्ट कलाकृतियों के लिए कस्टम नियम

### त्वरित सेटअप

```bash
openspec init
```

यह आपको इंटरैक्टिव रूप से एक कॉन्फ़िग बनाने के लिए चलता है। या मैन्युअल रूप से एक बनाएं:

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
# कॉन्फ़िग के बिना
openspec new change my-feature --schema spec-driven

# कॉन्फ़िग के साथ - स्कीमा स्वचालित है
openspec new change my-feature
```

**संदर्भ और नियम इंजेक्शन:**

कोई भी कलाकृति बनाते समय, आपका संदर्भ और नियम AI प्रॉम्प्ट में इंजेक्ट किए जाते हैं:

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

- **संदर्भ** सभी कलाकृतियों में दिखाई देता है
- **नियम** केवल मेल खाने वाली कलाकृति के लिए दिखाई देते हैं

### स्कीमा संकल्पना क्रम

जब OpenSpec को एक स्कीमा की आवश्यकता होती है, तो यह इस क्रम में जांचता है:

1. CLI फ़्लैग: `--schema <name>`
2. परिवर्तन मेटाडेटा (परिवर्तन फ़ोल्डर में `.openspec.yaml`)
3. प्रोजेक्ट कॉन्फ़िग (`openspec/config.yaml`)
4. डिफ़ॉल्ट (`spec-driven`)

---

## कस्टम स्कीमाज़

जब प्रोजेक्ट कॉन्फ़िग पर्याप्त न हो, तो पूरी तरह से कस्टम कार्यप्रवाह के साथ अपना स्वयं का स्कीमा बनाएं। कस्टम स्कीमाज़ आपके प्रोजेक्ट के `openspec/schemas/` निर्देशिका में रहते हैं और आपके कोड के साथ संस्करण-नियंत्रित होते हैं।

```text
your-project/
├── openspec/
│   ├── config.yaml        # प्रोजेक्ट कॉन्फ़िग
│   ├── schemas/           # कस्टम स्कीमाज़ यहाँ रहते हैं
│   │   └── my-workflow/
│   │       ├── schema.yaml
│   │       └── templates/
│   └── changes/           # आपके परिवर्तन
└── src/
```

### एक मौजूदा स्कीमा को फ़ोर्क करें

अनुकूलन का सबसे तेज़ तरीका एक अंतर्निहित स्कीमा को फ़ोर्क करना है:

```bash
openspec schema fork spec-driven my-workflow
```

यह पूरे `spec-driven` स्कीमा को `openspec/schemas/my-workflow/` में कॉपी करता है जहाँ आप इसे स्वतंत्र रूप से संपादित कर सकते हैं।

**आपको क्या मिलता है:**

```text
openspec/schemas/my-workflow/
├── schema.yaml           # कार्यप्रवाह परिभाषा
└── templates/
    ├── proposal.md       # प्रस्ताव कलाकृति के लिए टेम्पलेट
    ├── spec.md           # स्पेसिफिकेशन के लिए टेम्पलेट
    ├── design.md         # डिज़ाइन के लिए टेम्पलेट
    └── tasks.md          # टास्क के लिए टेम्पलेट
```

अब कार्यप्रवाह बदलने के लिए `schema.yaml` संपादित करें, या AI जो उत्पन्न करता है उसे बदलने के लिए टेम्पलेट संपादित करें।

### शुरू से एक स्कीमा बनाएं

एक पूरी तरह से नए कार्यप्रवाह के लिए:

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

एक स्कीमा आपके कार्यप्रवाह में कलाकृतियों और उनकी निर्भरताओं को परिभाषित करता है:

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
| `id` | अद्वितीय पहचानकर्ता, कमांड और नियमों में उपयोग किया जाता है |
| `generates` | आउटपुट फ़ाइल नाम (ग्लोब्स जैसे `specs/**/*.md` का समर्थन करता है) |
| `template` | `templates/` निर्देशिका में टेम्पलेट फ़ाइल |
| `instruction` | इस कलाकृति को बनाने के लिए AI निर्देश |
| `requires` | निर्भरताएँ - कौन सी कलाकृतियाँ पहले मौजूद होनी चाहिए |

### टेम्पलेट्स

टेम्पलेट्स मार्कडाउन फ़ाइलें हैं जो AI का मार्गदर्शन करती हैं। उस कलाकृति को बनाते समय इन्हें प्रॉम्प्ट में इंजेक्ट किया जाता है।

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
- अनुभाग शीर्षक जिन्हें AI को भरना चाहिए
- AI के लिए मार्गदर्शन वाली HTML टिप्पणियाँ
- अपेक्षित संरचना दिखाने वाले उदाहरण प्रारूप

### अपने स्कीमा को सत्यापित करें

कस्टम स्कीमा का उपयोग करने से पहले, इसे सत्यापित करें:

```bash
openspec schema validate my-workflow
```

यह जांचता है:
- `schema.yaml` वाक्य-रचना सही है
- सभी संदर्भित टेम्पलेट्स मौजूद हैं
- कोई चक्रीय निर्भरताएँ नहीं हैं
- कलाकृति ID मान्य हैं

### अपने कस्टम स्कीमा का उपयोग करें

बनाने के बाद, अपने स्कीमा का उपयोग करें:

```bash
# कमांड पर निर्दिष्ट करें
openspec new change feature --schema my-workflow

# या config.yaml में डिफ़ॉल्ट के रूप में सेट करें
schema: my-workflow
```

### स्कीमा संकल्पना की डीबगिंग

अनिश्चित हैं कि कौन सा स्कीमा उपयोग हो रहा है? इसकी जांच करें:

```bash
# देखें कि एक विशिष्ट स्कीमा कहाँ से संकल्पित होता है
openspec schema which my-workflow

# सभी उपलब्ध स्कीमाज़ सूचीबद्ध करें
openspec schema which --all
```

आउटपुट दिखाता है कि यह आपके प्रोजेक्ट, उपयोगकर्ता निर्देशिका, या पैकेज से है:

```text
Schema: my-workflow
Source: project
Path: /path/to/project/openspec/schemas/my-workflow
```

---

> **नोट:** OpenSpec प्रोजेक्ट्स में साझा करने के लिए `~/.local/share/openspec/schemas/` में उपयोगकर्ता-स्तरीय स्कीमाज़ का भी समर्थन करता है, लेकिन `openspec/schemas/` में प्रोजेक्ट-स्तरीय स्कीमाज़ की अनुशंसा की जाती है क्योंकि वे आपके कोड के साथ संस्करण-नियंत्रित होते हैं।

---

## उदाहरण

### त्वरित पुनरावृत्ति कार्यप्रवाह

त्वरित पुनरावृत्तियों के लिए एक न्यूनतम कार्यप्रवाह:

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

### एक समीक्षा कलाकृति जोड़ना

डिफ़ॉल्ट को फ़ोर्क करें और एक समीक्षा चरण जोड़ें:

```bash
openspec schema fork spec-driven with-review
```

फिर `schema.yaml` को संपादित करके जोड़ें:

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

## यह भी देखें

- [CLI संदर्भ: स्कीमा कमांड्स](cli.md#schema-commands) - पूरी कमांड दस्तावेज़ीकरण
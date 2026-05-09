---
layout: home

hero:
  name: "OpenSpec"
  text: "एआई सहायकों के लिए स्पेसिफिकेशन-संचालित विकास"
  tagline: एआई सहायक परियोजनाओं के निर्माण और प्रबंधन के लिए एक हल्का स्पेक।
  actions:
    - theme: brand
      text: शुरू करें
      link: ./getting-started
    - theme: alt
      text: होम
      link: /

features:
  - title: स्पेक-प्रथम कार्यप्रवाह
    details: कोड लिखने से पहले आवश्यकताओं को परिभाषित करें।
  - title: एआई-मूल डिज़ाइन
    details: Claude Code, Cursor, Windsurf और अन्य के लिए निर्मित।
  - title: बहु-भाषा
    details: दस्तावेज़ कई भाषाओं में उपलब्ध है।
---


हमारा दर्शन:

```text
→ तरल, कठोर नहीं
→ पुनरावृत्तिशील, वॉटरफॉल नहीं
→ आसान, जटिल नहीं
→ ब्राउनफील्ड के लिए निर्मित, केवल ग्रीनफील्ड के लिए नहीं
→ व्यक्तिगत परियोजनाओं से लेकर उद्यमों तक स्केलेबल
```

> [!टिप]
> **नया कार्यप्रवाह अब उपलब्ध है!** हमने एक नए आर्टिफैक्ट-निर्देशित कार्यप्रवाह के साथ OpenSpec को फिर से बनाया है।
>
> शुरू करने के लिए `/opsx:propose "your idea"` चलाएं। → [यहां और जानें](opsx.md)

<p align="center">
  अपडेट के लिए <a href="https://x.com/0xTab">@0xTab on X</a> को फॉलो करें · सहायता और प्रश्नों के लिए <a href="https://discord.gg/YctCnvvshC">OpenSpec Discord</a> से जुड़ें।
</p>

## इसे कार्रवाई में देखें

```text
You: /opsx:propose add-dark-mode
AI:  Created openspec/changes/add-dark-mode/
     ✓ proposal.md — why we're doing this, what's changing
     ✓ specs/       — requirements and scenarios
     ✓ design.md    — technical approach
     ✓ tasks.md     — implementation checklist
     Ready for implementation!

You: /opsx:apply
AI:  Implementing tasks...
     ✓ 1.1 Add theme context provider
     ✓ 1.2 Create toggle component
     ✓ 2.1 Add CSS variables
     ✓ 2.2 Wire up localStorage
     All tasks complete!

You: /opsx:archive
AI:  Archived to openspec/changes/archive/2025-01-23-add-dark-mode/
     Specs updated. Ready for the next feature.
```

<details>
<summary><strong>OpenSpec डैशबोर्ड</strong></summary>
</details>

## त्वरित शुरुआत

**Node.js 20.19.0 या उच्चतर आवश्यक है।**

OpenSpec को वैश्विक रूप से इंस्टॉल करें:

```bash
npm install -g @fission-ai/openspec@latest
```

फिर अपनी परियोजना निर्देशिका पर जाएं और आरंभ करें:

```bash
cd your-project
openspec init
```

अब अपने एआई को बताएं: `/opsx:propose <what-you-want-to-build>`

यदि आप विस्तारित कार्यप्रवाह (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:sync`, `/opsx:bulk-archive`, `/opsx:onboard`) चाहते हैं, तो इसे `openspec config profile` से चुनें और `openspec update` से लागू करें।

> [!नोट]
> सुनिश्चित नहीं हैं कि आपका टूल समर्थित है? [पूरी सूची देखें](supported-tools.md) – हम 25+ टूल्स का समर्थन करते हैं और यह बढ़ रहा है।
>
> pnpm, yarn, bun, और nix के साथ भी काम करता है। [इंस्टॉलेशन विकल्प देखें](installation.md)।

## दस्तावेज़

→ **[शुरू करना](getting-started.md)**: पहले कदम<br>
→ **[कार्यप्रवाह](workflows.md)**: कॉम्बो और पैटर्न<br>
→ **[कमांड्स](commands.md)**: स्लैश कमांड और कौशल<br>
→ **[CLI](cli.md)**: टर्मिनल संदर्भ<br>
→ **[समर्थित टूल्स](supported-tools.md)**: टूल एकीकरण और इंस्टॉल पथ<br>
→ **[अवधारणाएं](concepts.md)**: यह सब कैसे फिट बैठता है<br>
→ **[बहु-भाषा](multi-language.md)**: बहु-भाषा समर्थन<br>
→ **[अनुकूलन](customization.md)**: इसे अपना बनाएं


## OpenSpec क्यों?

एआई कोडिंग सहायक शक्तिशाली हैं लेकिन अप्रत्याशित होते हैं जब आवश्यकताएं केवल चैट इतिहास में रहती हैं। OpenSpec एक हल्का स्पेक परत जोड़ता है ताकि कोई भी कोड लिखने से पहले आप सहमत हों कि क्या बनाना है।

- **निर्माण से पहले सहमत हों** — कोड लिखे जाने से पहले मनुष्य और एआई स्पेक्स पर संरेखित होते हैं
- **व्यवस्थित रहें** — प्रत्येक परिवर्तन को अपना फ़ोल्डर मिलता है जिसमें प्रस्ताव, स्पेक्स, डिज़ाइन और कार्य होते हैं
- **तरल रूप से काम करें** — किसी भी आर्टिफैक्ट को किसी भी समय अपडेट करें, कोई कठोर चरण गेट नहीं
- **अपने टूल्स का उपयोग करें** — स्लैश कमांड के माध्यम से 20+ एआई सहायकों के साथ काम करता है

### हम कैसे तुलना करते हैं

**vs. [Spec Kit](https://github.com/github/spec-kit)** (GitHub) — विस्तृत लेकिन भारी। कठोर चरण गेट, बहुत सारा मार्कडाउन, पायथन सेटअप। OpenSpec हल्का है और आपको स्वतंत्र रूप से पुनरावृत्ति करने देता है।

**vs. [Kiro](https://kiro.dev)** (AWS) — शक्तिशाली लेकिन आप उनके IDE में बंद हैं और केवल Claude मॉडल तक सीमित हैं। OpenSpec उन टूल्स के साथ काम करता है जिनका आप पहले से उपयोग करते हैं।

**vs. कुछ नहीं** — स्पेक्स के बिना एआई कोडिंग का मतलब है अस्पष्ट प्रॉम्प्ट और अप्रत्याशित परिणाम। OpenSpec बिना किसी औपचारिकता के पूर्वानुमेयता लाता है।

## OpenSpec को अपडेट करना

**पैकेज अपग्रेड करें**

```bash
npm install -g @fission-ai/openspec@latest
```

**एजेंट निर्देश रिफ्रेश करें**

एआई मार्गदर्शन को फिर से उत्पन्न करने और यह सुनिश्चित करने के लिए कि नवीनतम स्लैश कमांड सक्रिय हैं, प्रत्येक परियोजना के अंदर यह चलाएं:

```bash
openspec update
```

## उपयोग नोट्स

**मॉडल चयन**: OpenSpec उच्च-तर्क वाले मॉडल्स के साथ सबसे अच्छा काम करता है। हम योजना और कार्यान्वयन दोनों के लिए Opus 4.5 और GPT 5.2 की सलाह देते हैं।

**संदर्भ स्वच्छता**: OpenSpec को एक स्वच्छ संदर्भ विंडो से लाभ होता है। कार्यान्वयन शुरू करने से पहले अपना संदर्भ साफ़ करें और अपने सत्र के दौरान अच्छी संदर्भ स्वच्छता बनाए रखें।

## योगदान

**छोटे सुधार** — बग फिक्स, टाइपो सुधार, और मामूली सुधार सीधे PR के रूप में सबमिट किए जा सकते हैं।

**बड़े परिवर्तन** — नई सुविधाओं, महत्वपूर्ण रिफैक्टरिंग, या आर्किटेक्चरल परिवर्तनों के लिए, कृपया पहले एक OpenSpec परिवर्तन प्रस्ताव सबमिट करें ताकि कार्यान्वयन शुरू होने से पहले हम इरादे और लक्ष्यों पर संरेखित हो सकें।

प्रस्ताव लिखते समय, OpenSpec दर्शन को ध्यान में रखें: हम विभिन्न कोडिंग एजेंटों, मॉडलों और उपयोग के मामलों में विविध उपयोगकर्ताओं की सेवा करते हैं। परिवर्तन सभी के लिए अच्छी तरह से काम करने चाहिए।

**एआई-जनित कोड का स्वागत है** — जब तक इसका परीक्षण और सत्यापन किया गया हो। एआई-जनित कोड वाले PR में उपयोग किए गए कोडिंग एजेंट और मॉडल का उल्लेख होना चाहिए (जैसे, "Generated with Claude Code using claude-opus-4-5-20251101")।

### विकास

- निर्भरताएं इंस्टॉल करें: `pnpm install`
- बिल्ड: `pnpm run build`
- टेस्ट: `pnpm test`
- CLI को स्थानीय रूप से विकसित करें: `pnpm run dev` या `pnpm run dev:cli`
- पारंपरिक कमिट्स (एक-लाइन): `type(scope): subject`

## अन्य

<details>
<summary><strong>टेलीमेट्री</strong></summary>

OpenSpec अनाम उपयोग आंकड़े एकत्र करता है।

हम उपयोग पैटर्न को समझने के लिए केवल कमांड नाम और संस्करण एकत्र करते हैं। कोई तर्क, पथ, सामग्री, या PII नहीं। CI में स्वचालित रूप से अक्षम।

**ऑप्ट-आउट:** `export OPENSPEC_TELEMETRY=0` या `export DO_NOT_TRACK=1`

</details>

<details>
<summary><strong>मेंटेनर और सलाहकार</strong></summary>

परियोजना का मार्गदर्शन करने वाले मुख्य मेंटेनर और सलाहकारों की सूची के लिए [MAINTAINERS.md](https://github.com/Fission-AI/OpenSpec/blob/main/MAINTAINERS.md) देखें।

</details>



## लाइसेंस

MIT
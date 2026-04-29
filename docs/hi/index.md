---
layout: home

hero:
  name: "OpenSpec"
  text: "AI सहायकों के लिए स्पेसिफिकेशन-ड्रिवन डेवलपमेंट"
  tagline: AI सहायक प्रोजेक्ट बनाने और प्रबंधित करने के लिए एक हल्का स्पेक।
  actions:
    - theme: brand
      text: शुरू करें
      link: ./getting-started
    - theme: alt
      text: होम
      link: /

features:
  - title: स्पेक-फर्स्ट वर्कफ़्लो
    details: कोड लिखने से पहले आवश्यकताओं को परिभाषित करें।
  - title: AI-नेटिव डिज़ाइन
    details: Claude Code, Cursor, Windsurf और अन्य के लिए बनाया गया।
  - title: मल्टी-लैंग्वेज
    details: कई भाषाओं में दस्तावेज़ उपलब्ध।
---


<details>
<summary><strong>सबसे लोकप्रिय स्पेक फ्रेमवर्क।</strong></summary>

[![Stars](https://img.shields.io/github/stars/Fission-AI/OpenSpec?style=flat-square&label=Stars)](https://github.com/Fission-AI/OpenSpec/stargazers)
[![Downloads](https://img.shields.io/npm/dm/@fission-ai/openspec?style=flat-square&label=Downloads/mo)](https://www.npmjs.com/package/@fission-ai/openspec)
[![Contributors](https://img.shields.io/github/contributors/Fission-AI/OpenSpec?style=flat-square&label=Contributors)](https://github.com/Fission-AI/OpenSpec/graphs/contributors)

</details>
<p></p>
हमारा दर्शन:

```text
→ बहता हुआ, न कि कठोर
→ चरणबद्ध नहीं, बल्कि इटरेटिव
→ सरल, न कि जटिल
→ केवल नए प्रोजेक्ट के लिए नहीं, बल्कि पुराने प्रोजेक्ट (ब्राउनफ़ील्ड) के लिए भी बनाया गया
→ व्यक्तिगत प्रोजेक्ट से लेकर एंटरप्राइज़ तक स्केलेबल
```

> [!TIP]
> **नया वर्कफ़्लो अब उपलब्ध है!** हमने OpenSpec को एक नए आर्टिफ़ैक्ट-गाइडेड वर्कफ़्लो के साथ पुनर्निर्मित किया है।
>
> शुरू करने के लिए `/opsx:propose "आपका विचार"` चलाएं। → [यहाँ और जानें](opsx.md)

<p align="center">
  अपडेट के लिए <a href="https://x.com/0xTab">@0xTab को X पर फ़ॉलो करें</a> · मदद और सवालों के लिए <a href="https://discord.gg/YctCnvvshC">OpenSpec Discord</a> से जुड़ें।
</p>

<!-- TODO: Add GIF demo of /opsx:propose → /opsx:archive workflow -->

## इसे कार्यशील देखें

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

**Node.js 20.19.0 या उससे अधिक आवश्यक है।**

OpenSpec को वैश्विक रूप से इंस्टॉल करें:

```bash
npm install -g @fission-ai/openspec@latest
```

फिर अपनी प्रोजेक्ट निर्देशिका में जाएं और इनिशियलाइज़ करें:

```bash
cd your-project
openspec init
```

अब अपने AI को बताएं: `/opsx:propose <आप क्या बनाना चाहते हैं>`

यदि आप विस्तारित वर्कफ़्लो (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:sync`, `/opsx:bulk-archive`, `/opsx:onboard`) चाहते हैं, तो इसे `openspec config profile` से चुनें और `openspec update` से लागू करें।

> [!NOTE]
> अनिश्चित हैं कि आपका टूल समर्थित है? [पूरी सूची देखें](supported-tools.md) – हम 25+ टूल्स का समर्थन करते हैं और बढ़ रहे हैं।
>
> यह pnpm, yarn, bun, और nix के साथ भी काम करता है। [इंस्टॉलेशन विकल्प देखें](installation.md)।

## दस्तावेज़

→ **[शुरू करना](getting-started.md)**: पहले कदम<br>
→ **[वर्कफ़्लो](workflows.md)**: कॉम्बो और पैटर्न<br>
→ **[कमांड](commands.md)**: स्लैश कमांड और स्किल्स<br>
→ **[CLI](cli.md)**: टर्मिनल संदर्भ<br>
→ **[समर्थित टूल्स](supported-tools.md)**: टूल इंटीग्रेशन और इंस्टॉल पाथ<br>
→ **[अवधारणाएँ](concepts.md)**: सब कैसे जुड़ता है<br>
→ **[मल्टी-लैंग्वेज](multi-language.md)**: बहुभाषी समर्थन<br>
→ **[कस्टमाइज़ेशन](customization.md)**: इसे अपना बनाएं


## OpenSpec क्यों?

AI कोडिंग सहायक शक्तिशाली होते हैं, लेकिन जब आवश्यकताएँ केवल चैट इतिहास में रहती हैं तो वे अनिश्चित हो जाते हैं। OpenSpec एक हल्का स्पेक लेयर जोड़ता है ताकि कोई भी कोड लिखने से पहले आप इस बात पर सहमत हो सकें कि क्या बनाना है।

- **बनाने से पहले सहमत हों** — कोड लिखने से पहले इंसान और AI स्पेक्स पर संरेखित होते हैं
- **व्यवस्थित रहें** — प्रत्येक परिवर्तन को अपना फ़ोल्डर मिलता है जिसमें प्रस्ताव, स्पेक्स, डिज़ाइन और टास्क होते हैं
- **बहते हुए काम करें** — किसी भी आर्टिफ़ैक्ट को कभी भी अपडेट करें, कोई कठोर चरण गेट नहीं
- **अपने टूल्स का उपयोग करें** — स्लैश कमांड के माध्यम से 20+ AI सहायकों के साथ काम करता है

### हम कैसे तुलना करते हैं

**vs. [Spec Kit](https://github.com/github/spec-kit)** (GitHub) — विस्तृत लेकिन भारी। कठोर चरण गेट, बहुत सारा Markdown, Python सेटअप। OpenSpec हल्का है और आपको स्वतंत्र रूप से इटरेट करने देता है।

**vs. [Kiro](https://kiro.dev)** (AWS) — शक्तिशाली लेकिन आप उनके IDE में बंधे होते हैं और केवल Claude मॉडल तक सीमित होते हैं। OpenSpec आपके द्वारा पहले से उपयोग किए जा रहे टूल्स के साथ काम करता है।

**vs. कुछ नहीं** — स्पेक्स के बिना AI कोडिंग का मतलब है अस्पष्ट प्रॉम्प्ट और अनिश्चित परिणाम। OpenSpec बिना किसी औपचारिकता के पूर्वानुमेयता लाता है।

## OpenSpec अपडेट करना

**पैकेज अपग्रेड करें**

```bash
npm install -g @fission-ai/openspec@latest
```

**एजेंट निर्देश रीफ्रेश करें**

AI मार्गदर्शन को पुनर्जनित करने और नवीनतम स्लैश कमांड सक्रिय हैं, यह सुनिश्चित करने के लिए प्रत्येक प्रोजेक्ट के अंदर यह चलाएं:

```bash
openspec update
```

## उपयोग नोट्स

**मॉडल चयन**: OpenSpec उच्च-रीज़निंग मॉडल्स के साथ सबसे अच्छा काम करता है। हम योजना और कार्यान्वयन दोनों के लिए Opus 4.5 और GPT 5.2 की सिफारिश करते हैं।

**कॉन्टेक्स्ट हाइजीन**: OpenSpec को एक स्वच्छ कॉन्टेक्स्ट विंडो से लाभ होता है। कार्यान्वयन शुरू करने से पहले अपना कॉन्टेक्स्ट साफ़ करें और अपने सत्र भर में अच्छी कॉन्टेक्स्ट हाइजीन बनाए रखें।

## योगदान

**छोटे फ़िक्स** — बग फ़िक्स, टाइपो सुधार और मामूली सुधार सीधे PR के रूप में जमा किए जा सकते हैं।

**बड़े बदलाव** — नई सुविधाओं, महत्वपूर्ण रीफ़ैक्टरिंग या आर्किटेक्चरल बदलावों के लिए, कृपया पहले एक OpenSpec परिवर्तन प्रस्ताव जमा करें ताकि कार्यान्वयन शुरू होने से पहले हम इरादे और लक्ष्यों पर संरेखित हो सकें।

प्रस्ताव लिखते समय, OpenSpec दर्शन को ध्यान में रखें: हम विभिन्न कोडिंग एजेंट्स, मॉडल्स और उपयोग के मामलों में विविध उपयोगकर्ताओं की सेवा करते हैं। बदलाव सभी के लिए अच्छी तरह से काम करने चाहिए।

**AI-जनित कोड का स्वागत है** — बशर्ते इसका परीक्षण और सत्यापन किया गया हो। AI-जनित कोड वाले PR में उपयोग किए गए कोडिंग एजेंट और मॉडल का उल्लेख करना चाहिए (जैसे, "Generated with Claude Code using claude-opus-4-5-20251101")।

### विकास

- निर्भरताएँ इंस्टॉल करें: `pnpm install`
- बिल्ड: `pnpm run build`
- टेस्ट: `pnpm test`
- CLI को स्थानीय रूप से विकसित करें: `pnpm run dev` या `pnpm run dev:cli`
- पारंपरिक कमिट्स (एक-पंक्ति): `type(scope): subject`

## अन्य

<details>
<summary><strong>टेलीमेट्री</strong></summary>

OpenSpec गुमनाम उपयोग आँकड़े एकत्र करता है।

हम केवल उपयोग पैटर्न को समझने के लिए कमांड नाम और संस्करण एकत्र करते हैं। कोई तर्क, पाथ, सामग्री या PII नहीं। CI में स्वचालित रूप से अक्षम।

**ऑप्ट-आउट:** `export OPENSPEC_TELEMETRY=0` या `export DO_NOT_TRACK=1`

</details>

<details>
<summary><strong>मेंटेनर्स और सलाहकार</strong></summary>

प्रोजेक्ट का मार्गदर्शन करने में मदद करने वाले मुख्य मेंटेनर्स और सलाहकारों की सूची के लिए [MAINTAINERS.md](https://github.com/Fission-AI/OpenSpec/blob/main/MAINTAINERS.md) देखें।

</details>



## लाइसेंस

MIT
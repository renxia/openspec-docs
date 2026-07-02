# OpenSpec डॉक्यूमेंटेशन

स्वागत है। यह OpenSpec से संबंधित हर चीज़ का केंद्र है।

OpenSpec आपको और आपके AI कोडिंग असिस्टेंट को **कोई कोड लिखे जाने से पहले इस बात पर सहमत होने में मदद करता है कि क्या बनाना है।** आप बदलाव का वर्णन करते हैं, AI एक संक्षिप्त spec (विनिर्देश) और एक कार्य सूची का मसौदा तैयार करता है, आप दोनों एक ही योजना को देखते हैं, और फिर काम होता है। अब आपको यह पता लगाने की ज़रूरत नहीं है कि आधी काम होने के बाद AI गलत चीज़ बना गया था।

यदि आप कुछ और नहीं पढ़ते हैं, तो ये दो पेज पढ़ें:

1. [Getting Started](getting-started.md): इंस्टॉलेशन, इनिशियलाइज़ेशन, और अपने पहले बदलाव को शिप करें।
2. [How Commands Work](how-commands-work.md): वह जगह जहाँ आप वास्तव में `/opsx:propose` टाइप करते हैं (संकेत: टर्मिनल में नहीं, बल्कि अपने AI चैट में)। यह लगभग हर किसी के साथ होता है।

दूसरा वाला जितना दिखता है उससे ज़्यादा महत्वपूर्ण है। OpenSpec के दो हिस्से हैं: एक कमांड लाइन टूल जिसे आप अपने टर्मिनल में चलाते हैं, और स्लैश कमांड जो आप अपने AI असिस्टेंट को देते हैं। यह जानना कि कौन सा क्या है, आपको सबसे आम भ्रम की स्थिति से बचाता है।

> **सबसे अच्छी आदत जो पहले बनानी चाहिए: जब आप निश्चित नहीं होते हैं कि क्या बनाना है, तो `/opsx:explore` से शुरुआत करें।** यह एक बिना किसी दांव वाला सोचने वाला साथी (thinking partner) है जो आपके कोड को पढ़ता है, विकल्पों का मूल्यांकन करता है, और किसी भी कलाकृति (artifact) या कोड के अस्तित्व में आने से पहले एक अस्पष्ट विचार को एक ठोस योजना में बदल देता है। [Explore First](explore.md) गाइड यह बात साबित करती है।

## अपना रास्ता चुनें

**मैं बिल्कुल नया हूँ।** [Getting Started](getting-started.md) से शुरुआत करें, फिर [Core Concepts at a Glance](overview.md) पर एक नज़र डालें। जब कुछ रहस्यमय लगे, तो [FAQ](faq.md) और [Glossary](glossary.md) पास में हैं।

**मेरे पास एक समस्या है लेकिन कोई योजना नहीं है।** यह आम मामला है, और इसका एक समर्पित उत्तर है: [Explore First](explore.md)। किसी भी चीज़ के लिए प्रतिबद्ध होने से पहले AI के साथ इसे सोचने के लिए `/opsx:explore` का उपयोग करें।

**मेरे पास एक बड़ा मौजूदा codebase (कोडबेस) है।** आपको इसकी सब कुछ डॉक्यूमेंट करने की ज़रूरत नहीं है। [Using OpenSpec in an Existing Project](existing-projects.md) दिखाता है कि समुद्र को उबाले बिना वास्तविक, ब्राउनफील्ड कोड पर कैसे शुरुआत करें।

**मैं बस इसे काम करवाना चाहता हूँ।** [Install](installation.md), `openspec init` चलाएँ, फिर [How Commands Work](how-commands-work.md) पढ़ें ताकि आपका पहला स्लैश कमांड सही जगह पर जाए।

**मैं उदाहरणों से सीखता हूँ।** [Examples & Recipes](examples.md) पेज वास्तविक बदलावों को शुरू से अंत तक बताता है: एक छोटा फीचर, एक बग फिक्स, एक रीफैक्टर, एक एक्सप्लोरेशन।

**मैं पुराने वर्कफ़्लो (workflow) से आ रहा हूँ।** [Migration Guide](migration-guide.md) समझाता है कि क्या बदला और क्यों, और वादा करता है कि आपका मौजूदा काम सुरक्षित है।

**मैं इसे अपनी टीम की प्रक्रिया के अनुसार ढालना चाहता हूँ।** [Customization](customization.md) प्रोजेक्ट कॉन्फ़िगरेशन, कस्टम स्कीमा और साझा संदर्भ (shared context) को कवर करता है।

**कुछ टूट गया है।** [Troubleshooting](troubleshooting.md) उन विफलताओं (failures) को एकत्र करता है जिनका लोग वास्तव में सामना करते हैं, साथ में समाधान भी दिए गए हैं।

## पूरी रूपरेखा (The whole map)

### यहाँ से शुरू करें

| Doc | यह आपको क्या देता है |
|-----|-------------------|
| [Getting Started](getting-started.md) | इंस्टॉलेशन, इनिशियलाइज़ेशन और अपने पहले बदलाव को एंड-टू-एंड चलाना |
| [Explore First](explore.md) | प्रतिबद्ध होने से पहले एक विचार पर सोचने के लिए `/opsx:explore` का उपयोग करें |
| [How Commands Work](how-commands-work.md) | स्लैश कमांड कहाँ चलते हैं, "इंटरैक्टिव मोड" का क्या मतलब है, टर्मिनल बनाम चैट |
| [Core Concepts at a Glance](overview.md) | एक पेज पर पूरी मानसिक मॉडल: specs, changes, deltas, archive |
| [Installation](installation.md) | npm, pnpm, yarn, bun, Nix और यह सत्यापित करने का तरीका कि यह काम कर गया है |

### रोज़ाना उपयोग करें

| Doc | यह आपको क्या देता है |
|-----|-------------------|
| [Workflows](workflows.md) | सामान्य पैटर्न और किस कमांड का उपयोग कब करना है |
| [Examples & Recipes](examples.md) | वास्तविक बदलावों के पूर्ण walkthroughs, जिन्हें कॉपी-पेस्ट किया जा सकता है |
| [Using OpenSpec in an Existing Project](existing-projects.md) | एक बड़े ब्राउनफील्ड कोडबेस पर OpenSpec को अपनाना |
| [Editing & Iterating on a Change](editing-changes.md) | आर्टिफैक्ट्स अपडेट करना, पीछे जाना, मैन्युअल संपादन (manual edits) का समाधान करना |
| [Commands](commands.md) | हर `/opsx:*` स्लैश कमांड के लिए संदर्भ |
| [CLI](cli.md) | हर `openspec` टर्मिनल कमांड के लिए संदर्भ |

### गहराई से समझें

| Doc | यह आपको क्या देता है |
|-----|-------------------|
| [Concepts](concepts.md) | specs, changes, artifacts, schemas और archive की विस्तृत व्याख्या |
| [OPSX Workflow](opsx.md) | क्यों वर्कफ़्लो चरण-लॉक (phase-locked) होने के बजाय तरल (fluid) है, साथ में आर्किटेक्चर की गहन जानकारी |
| [Glossary](glossary.md) | हर शब्द एक ही जगह पर परिभाषित |

### इसे अपना बनाएं

| Doc | यह आपको क्या देता है |
|-----|-------------------|
| [Customization](customization.md) | प्रोजेक्ट कॉन्फ़िगरेशन, कस्टम स्कीमा, साझा संदर्भ (shared context) |
| [Multi-Language](multi-language.md) | अंग्रेजी के अलावा अन्य भाषाओं में आर्टिफैक्ट्स जनरेट करना |
| [Supported Tools](supported-tools.md) | 25+ AI टूल्स जिनके साथ OpenSpec इंटीग्रेट होता है, और फाइलें कहाँ लैंड होती हैं |

### जब आपको मदद की ज़रूरत हो

| Doc | यह आपको क्या देता है |
|-----|-------------------|
| [FAQ](faq.md) | लोगों द्वारा सबसे अधिक पूछे जाने वाले सवालों के त्वरित जवाब |
| [Troubleshooting](troubleshooting.md) | ठोस विफलताओं (failures) के लिए ठोस समाधान |
| [Migration Guide](migration-guide.md) | लेगेसी वर्कफ़्लो से OPSX में बदलाव करना |

### रिपोस पर समन्वय करें (बीटा)

| Doc | यह आपको क्या देता है |
|-----|-------------------|
| [Stores: User Guide](stores-beta/user-guide.md) | जब आपका काम कई रिपोस या टीमों तक फैला हो तो योजना बनाना |
| [Agent Contract](agent-contract.md) | मशीन-पठनीय (machine-readable) CLI सतहें जिन्हें एजेंट चलाते हैं |

## तीस सेकंड का संस्करण

```text
1. Install        npm install -g @fission-ai/openspec@latest
2. Initialize     cd your-project && openspec init
3. Explore        (in your AI chat)  /opsx:explore           ← optional, but a great habit
4. Propose        (in your AI chat)  /opsx:propose add-dark-mode
5. Build          (in your AI chat)  /opsx:apply
6. Archive        (in your AI chat)  /opsx:archive
```

कदम 1 और 2 आपके टर्मिनल में होते हैं। बाकी आपके AI असिस्टेंट की चैट में होते हैं। यह विभाजन वह एक चीज़ है जिसे याद रखना ज़रूरी है, और [How Commands Work](how-commands-work.md) ठीक से समझाता है कि क्यों। कदम 3 वैकल्पिक है, लेकिन जब आप निश्चित नहीं होते हैं तो `/opsx:explore` से शुरुआत करना सबसे उपयोगी आदत है।

## मदद कहाँ और प्राप्त करें

- **Discord:** सवालों, विचारों और मदद के लिए [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)।
- **GitHub Issues:** बग्स और फीचर अनुरोधों के लिए [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)।
- **`openspec feedback "your message"`** सीधे आपके टर्मिनल से फीडबैक भेजता है (यह एक GitHub issue खोलता है)।

क्या आपको इन डॉक्यूमेंट्स में कुछ गलत, पुराना या भ्रमित करने वाला मिलता है? वह एक बग है। एक इश्यू या PR खोलें। डॉक्यूमेंटेशन सुधार आप द्वारा किए जा सकने वाले सबसे मूल्यवान योगदानों में से हैं।
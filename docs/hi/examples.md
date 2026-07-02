# उदाहरण और नुस्खे

वास्तविक परिवर्तन, शुरुआत से अंत तक। प्रत्येक नुस्खा उन कमांड्स को दिखाता है जिन्हें आप टाइप करेंगे और आपको क्या वापस मिलेगा, ताकि आप अपनी स्थिति को एक पैटर्न से मिला सकें और उसे कॉपी कर सकें। ये डिफ़ॉल्ट **core** कमांड्स (`propose`, `explore`, `apply`, `sync`, `archive`) का उपयोग करते हैं; जहाँ विस्तारित सेट सहायक होता है, उसका उल्लेख किया गया है।

शुरू करने से पहले एक अनुस्मारक: `/opsx:propose` जैसे स्लैश कमांड आपके **AI assistant के चैट** में जाते हैं, और `openspec` कमांड आपके **टर्मिनल** में जाते हैं। यदि यह नया है, तो पहले [How Commands Work](how-commands-work.md) पढ़ें। नीचे दिए गए ट्रांसक्रिप्ट्स में, `You:` और `AI:` चैट हैं, और `$` से शुरू होने वाली लाइनें टर्मिनल हैं।

> **अभी निश्चित नहीं हैं कि आप क्या बना रहे हैं?** इनमें से अधिकांश नुस्खे तब अधिक स्पष्ट होते हैं जब आप पहले `/opsx:explore` के साथ विचार करते हैं। [Recipe 3](#recipe-3-exploring-before-you-commit) इसे कार्य में दिखाता है, और [Explore First](explore.md) गाइड पूरी बात को सामने लाता है।

## नुस्खा 1: एक छोटा फीचर, तेज़ तरीका

**इसका उपयोग कब करें:** आप जानते हैं कि आपको क्या चाहिए, और यह काम का एक सीमित हिस्सा है। यह सबसे आम नुस्खा है।

पूरी प्रक्रिया में तीन कमांड शामिल हैं। Propose, build, archive।

```text
You: /opsx:propose add-logout-button

AI:  Created openspec/changes/add-logout-button/
     ✓ proposal.md — why and what (कारण और क्या)
     ✓ specs/      — the new requirement and its scenarios (नई आवश्यकता और उसके परिदृश्य)
     ✓ design.md   — technical approach (तकनीकी दृष्टिकोण)
     ✓ tasks.md    — implementation checklist (कार्यान्वयन चेकलिस्ट)
     Ready for implementation. Run /opsx:apply.
```

अब योजना पढ़ें। प्रस्ताव (proposal) और डेल्टा स्पेसिफिकेशन (delta spec) को खोलें। यह वह क्षण है जिसके लिए OpenSpec बनाया गया है: जब कोई गलत धारणा अभी भी एक पैराग्राफ में हो, न कि 400 लाइनों के कोड में। यदि कुछ गलत है तो किसी भी कलाकृति (artifact) को सीधे संपादित करें, फिर जारी रखें।

```text
You: /opsx:apply

AI:  Working through tasks... (कार्यों पर काम कर रहा हूँ...)
     ✓ 1.1 Add logout button to header (हेडर में लॉगआउट बटन जोड़ें)
     ✓ 1.2 Clear session on click (क्लिक करने पर सत्र साफ़ करें)
     ✓ 1.3 Add confirmation dialog (पुष्टिकरण संवाद जोड़ें)
     All tasks complete! (सभी कार्य पूरे!)

You: /opsx:archive

AI:  Archiving add-logout-button... (add-logout-button को संग्रहीत कर रहा हूँ...)
     ✓ Merged specs into openspec/specs/auth/spec.md (स्पेसिफिकेशन्स को openspec/specs/auth/spec.md में मर्ज किया गया)
     ✓ Moved to openspec/changes/archive/2026-06-22-add-logout-button/ (openspec/changes/archive/2026-06-22-add-logout-button/ में ले जाया गया)
     Done. Ready for the next change. (हो गया। अगले परिवर्तन के लिए तैयार।)
```

बस इतना ही। लॉगआउट व्यवहार अब आपके स्पेसिफिकेशन्स का हिस्सा है, और परिवर्तन को उसके पूरे संदर्भ के साथ फाइल कर दिया गया है।

## नुस्खा 2: एक बग फिक्स

**इसका उपयोग कब करें:** कुछ टूटा हुआ है और आप चाहते हैं कि इस फिक्स को व्यवहार में जानबूझकर किए गए परिवर्तन के रूप से रिकॉर्ड किया जाए, न कि रहस्यमय कमिट (commit) के रूप में।

बग फिक्स ठीक उसी तरह काम करते हैं जैसे फीचर। अंतर इस बात में है कि आप प्रस्ताव को कैसे फ्रेम करते हैं: केवल "bug fix" करने के बजाय *सही* व्यवहार का वर्णन करें।

```text
You: /opsx:propose fix-login-redirect-loop

AI:  Created openspec/changes/fix-login-redirect-loop/
     The proposal captures the current broken behavior and the
     intended behavior. The delta spec MODIFIES the redirect
     requirement so it's now precise and testable.
     Ready for implementation.
```

चूंकि फिक्स एक `MODIFIED` आवश्यकता के रूप में आता है जिसमें एक नया परिदृश्य (scenario) होता है, इसलिए अगला व्यक्ति (या अगली AI सत्र) यह नहीं देखता कि आपने इसे ठीक कर दिया है, बल्कि यह देखता है कि "सही" का क्या मतलब है। फिर सामान्य रूप से `/opsx:apply` और `/opsx:archive` करें।

टिप: एक फिक्स के लिए, एक अच्छा परिदृश्य प्रतिगमन परीक्षण (regression test) पाठ के रूप में होता है। "GIVEN a logged-out user, WHEN they submit valid credentials, THEN they land on the dashboard and are not redirected again." इसे लिखें, और कार्यान्वयन को एक स्पष्ट लक्ष्य मिल जाएगा।

## नुस्खा 3: कमिट करने से पहले अन्वेषण (Exploring) करना

**इसका उपयोग कब करें:** आपके पास एक समस्या है लेकिन अभी तक कोई योजना नहीं है। आप निश्चित नहीं हैं कि क्या बनाना है, या कौन सा दृष्टिकोण सही है।

`/opsx:explore` के साथ शुरू करें। यह एक विचार भागीदार (thinking partner) है जिसमें कोई संरचना और कोई कलाकृति (artifact) नहीं बनाई जाती। यह आपके कोडबेस को पढ़ता है और आपको निर्णय लेने में मदद करता है।

```text
You: /opsx:explore

AI:  What would you like to explore? (आप क्या अन्वेषण करना चाहेंगे?)

You: Page loads feel slow but I don't know where the time goes. (पेज लोड धीमे लगते हैं लेकिन मुझे नहीं पता कि समय कहाँ जाता है।)

AI:  Let me look... I found three likely culprits:
     1. Large unoptimized images on the product list (उत्पाद सूची पर बड़ी अनऑप्टिमाइज़्ड छवियाँ)
     2. Synchronous data fetching that blocks render (सिंक्रोनस डेटा फेचिंग जो रेंडर को ब्लॉक करती है)
     3. Re-renders triggered by context changes (संदर्भ परिवर्तनों द्वारा ट्रिगर किए गए री-रेंडर)
     Which should we tackle first? (हमें पहले किसे संभालना चाहिए?)

You: The data fetching one. (डेटा फेचिंग वाला।)

You: /opsx:propose optimize-product-list-fetching

AI:  Created the change, with a proposal informed by what we just
     found. Ready for implementation. (वह परिवर्तन बना दिया है, एक ऐसे प्रस्ताव के साथ जो हमने अभी पाया उससे सूचित हुआ है। कार्यान्वयन के लिए तैयार।)
```

अन्वेषण आपके द्वारा इस पर खर्च करने से *पहले* आपकी सोच को स्पष्ट करता है। जब अंतर्दृष्टि क्रिस्टलीकृत हो जाती है, तो प्रस्तावित करें, और AI संदर्भ को आगे बढ़ाता है।

## नुस्खा 4: एक साथ दो परिवर्तनों को संभालना

**इसका उपयोग कब करें:** आप फीचर के बीच में हैं और एक जरूरी फिक्स कतार (queue) को पार कर जाता है।

परिवर्तन स्वतंत्र फ़ोल्डर होते हैं, इसलिए समानांतर कार्य (parallel work) में टकराव नहीं होता। पहले फिक्स शुरू करें, उसे शिप करें, फिर उस फीचर पर वहीं वापस आएं जहाँ आपने छोड़ा था।

```text
You: I'm partway through add-dark-mode, but I need to fix a login bug now. (मैं add-dark-mode के बीच में हूँ, लेकिन मुझे अभी एक लॉगिन बग को ठीक करने की जरूरत है।)

You: /opsx:propose fix-login-redirect

AI:  Created openspec/changes/fix-login-redirect/. Ready for implementation. (कार्यान्वयन के लिए तैयार।)

You: /opsx:apply

AI:  Implemented the fix. All tasks complete. (फिक्स लागू कर दिया गया है। सभी कार्य पूरे।)

You: /opsx:archive

AI:  ✓ Archived fix-login-redirect. (fix-login-redirect को संग्रहीत कर दिया गया।)

You: Back to dark mode. (डार्क मोड पर वापस आ गए।)

You: /opsx:apply add-dark-mode

AI:  Resuming add-dark-mode. Picking up at task 2.3: Update Header... (add-dark-mode को फिर से शुरू कर रहा हूँ। कार्य 2.3: हेडर अपडेट पर उठा रहा हूँ...)
```

`/opsx:apply add-dark-mode` में परिवर्तन का नाम बताना ही वह तरीका है जिससे आप AI को एक विशिष्ट परिवर्तन की ओर इंगित करते हैं जब एक से अधिक सक्रिय हों। चूंकि `tasks.md` में पूर्णता ट्रैक होती है, इसलिए AI ठीक जानता है कि आप कहाँ रुके थे।

जब कई परिवर्तन एक साथ किए जाते हैं, तो विस्तारित `/opsx:bulk-archive` उन्हें एक साथ फाइल करता है और यह जांचकर स्पेसिफिकेशन संघर्षों (spec conflicts) को हल करता है कि वास्तव में क्या कार्यान्वित किया गया है। [Workflows](workflows.md#parallel-changes) देखें।

## नुस्खा 5: व्यवहार परिवर्तन के बिना रीफैक्टर करना

**इसका उपयोग कब करें:** आप कोड की पुनर्रचना (restructuring) कर रहे हैं, और बाहरी रूप से दिखाई देने वाला व्यवहार समान रहना चाहिए।

यह दिलचस्प मामला है, क्योंकि एक शुद्ध रीफैक्टर में *आपके स्पेसिफिकेशन्स में जोड़ने के लिए कुछ नहीं होता*। व्यवहार अनुबंध (behavior contract) नहीं बदलता; केवल कार्यान्वयन बदलता है। इसलिए काम डिज़ाइन और कार्यों में रहता है, और spec delta खाली या अनुपस्थित होता है।

```text
You: /opsx:propose refactor-payment-module

AI:  Created the change. The proposal states the goal (split the
     payment module, no behavior change) and the design captures
     the new structure. No spec changes, since behavior is identical.
     Ready for implementation. (परिवर्तन बना दिया है। प्रस्ताव लक्ष्य बताता है (भुगतान मॉड्यूल को विभाजित करना, कोई व्यवहार परिवर्तन नहीं) और डिज़ाइन नई संरचना को कैप्चर करता है। कोई spec परिवर्तन नहीं, क्योंकि व्यवहार समान है। कार्यान्वयन के लिए तैयार।)
```

जब आप एक ऐसे परिवर्तन को संग्रहीत करते हैं जो स्पेसिफिकेशन्स को छूता नहीं है, तो आप टर्मिनल कमांड को spec चरण को छोड़ने के लिए कह सकते हैं:

```bash
$ openspec archive refactor-payment-module --skip-specs
```

यह फ्लैग टूलिंग, CI और केवल दस्तावेज़ परिवर्तनों के लिए भी उपयोगी है। सिद्धांत यह है: स्पेसिफिकेशन्स व्यवहार का वर्णन करते हैं, इसलिए यदि व्यवहार नहीं बदला है, तो spec को भी नहीं बदलना चाहिए। [Concepts](concepts.md#what-a-spec-is-and-is-not) देखें।

## नुस्खा 6: चरण-दर-चरण नियंत्रण (विस्तारित कमांड्स)

**इसका उपयोग कब करें:** एक जटिल या जोखिम भरा परिवर्तन जहाँ आप आगे बढ़ने से पहले प्रत्येक कलाकृति की समीक्षा करना चाहते हैं।

मूल `/opsx:propose` सब कुछ को एक साथ ड्राफ्ट करता है। जब आप धीरे-धीरे एक-एक कदम पर जाना पसंद करते हैं, तो विस्तारित कमांड्स चालू करें:

```bash
$ openspec config profile      # select the expanded workflows (विस्तारित वर्कफ़्लो चुनें)
$ openspec update              # apply them to this project (उन्हें इस परियोजना पर लागू करें)
```

अब आप क्रमिक रूप से स्केफोल्ड और निर्माण कर सकते हैं:

```text
You: /opsx:new add-2fa

AI:  Created openspec/changes/add-2fa/. Ready to create: proposal. (प्रस्ताव बनाने के लिए तैयार।)

You: /opsx:continue

AI:  Created proposal.md. Now available: specs, design. (proposal.md बना दिया है। अब उपलब्ध हैं: specs, design।)

You: /opsx:continue

AI:  Created specs/auth/spec.md. Now available: design. (specs/auth/spec.md बना दिया है। अब उपलब्ध है: design।)
```

जैसे ही प्रत्येक कलाकृति आती है उसकी समीक्षा करें, स्वतंत्र रूप से संपादित करें, और जब आप खुश हों तो जारी रखें। जब आप बाकी को एक बार में ड्राफ्ट करना चाहते हैं, तो `/opsx:ff` शेष योजनाबद्ध कलाकृतियों के माध्यम से फास्ट-फॉरवर्ड करता है। संग्रहीत करने से पहले, `/opsx:verify` जांचता है कि कार्यान्वयन वास्तव में स्पेसिफिकेशन्स से मेल खाता है या नहीं। [Workflows](workflows.md#opsxff-vs-opsxcontinue) देखें।

## नुस्खा 7: पूरे लूप को हाथों से सीखना

**इसका उपयोग कब करें:** आपने OpenSpec स्थापित कर लिया है और आप एक खिलौना उदाहरण (toy example) पर नहीं, बल्कि अपने वास्तविक कोड पर वर्कफ़्लो को *महसूस* करना चाहते हैं।

विस्तारित कमांड्स चालू करें (नुस्खा 6 देखें), फिर:

```text
You: /opsx:onboard

AI:  Welcome to OpenSpec! I'll walk you through a complete change
     using your actual codebase. Let me scan for a small, safe
     improvement we can make together... (OpenSpec में आपका स्वागत है! मैं आपके वास्तविक कोडबेस का उपयोग करके एक पूर्ण परिवर्तन के माध्यम से आपको मार्गदर्शन करूँगा। मुझे एक छोटे, सुरक्षित सुधार की तलाश करने दें जिसे हम एक साथ कर सकते हैं...)
```

`/opsx:onboard` एक वास्तविक (छोटा) सुधार ढूंढता है, उसके लिए एक परिवर्तन बनाता है, उसे लागू करता है और उसे संग्रहीत करता है, हर कदम का वर्णन करता है। इसमें 15 से 30 मिनट लगते हैं और यह आपको एक वास्तविक परिवर्तन के साथ छोड़ देता है जिसे आप रख सकते हैं या फेंक सकते हैं। यह सीखने का सबसे कोमल तरीका है। [Commands](commands.md#opsxonboard) देखें।

## टर्मिनल से अपने काम की जाँच करना

किसी भी समय, अपने टर्मिनल से, आप चीजों की स्थिति का निरीक्षण कर सकते हैं:

```bash
$ openspec list                      # active changes (सक्रिय परिवर्तन)
$ openspec show add-dark-mode        # one change in detail (एक परिवर्तन विस्तार से)
$ openspec validate add-dark-mode    # check structure (संरचना जांचें)
$ openspec view                      # interactive dashboard (इंटरैक्टिव डैशबोर्ड)
```

ये पढ़ने और निरीक्षण करने वाले उपकरण हैं। प्रस्ताव करना और निर्माण अभी भी चैट में स्लैश कमांड के माध्यम से होता है। [CLI reference](cli.md) में पूर्ण विवरण देखें।

## आगे कहाँ जाना है

- [Explore First](explore.md): जब आप निश्चित न हों तो शुरू करने का अनुशंसित तरीका
- [Workflows](workflows.md): ऊपर दिए गए पैटर्न, यह मार्गदर्शन के साथ कि कब किसका उपयोग करना है
- [Commands](commands.md): हर स्लैश कमांड का विस्तृत विवरण
- [Getting Started](getting-started.md): पहले परिवर्तन की मानक walkthrough (गाइड)
- [Concepts](concepts.md): क्यों ये टुकड़े एक साथ फिट होते हैं
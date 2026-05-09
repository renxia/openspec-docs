# वर्कफ़्लोज़

यह गाइड OpenSpec के लिए सामान्य वर्कफ़्लो पैटर्न और प्रत्येक का उपयोग कब करें, इसे कवर करता है। बुनियादी सेटअप के लिए, [शुरू करना](getting-started.md) देखें। कमांड संदर्भ के लिए, [कमांड्स](commands.md) देखें।

## दर्शन: क्रियाएँ, चरण नहीं

पारंपरिक वर्कफ़्लोज़ आपको चरणों से गुज़रने पर मजबूर करते हैं: योजना, फिर कार्यान्वयन, फिर समाप्त। लेकिन वास्तविक कार्य बॉक्सों में सटीक रूप से फिट नहीं होता।

OPSX एक अलग दृष्टिकोण अपनाता है:

```text
पारंपरिक (चरण-बंद):

  PLANNING ────────► IMPLEMENTING ────────► DONE
      │                    │
      │   "वापस नहीं जा सकते"  │
      └────────────────────┘

OPSX (तरल क्रियाएँ):

  proposal ──► specs ──► design ──► tasks ──► implement
```

**मुख्य सिद्धांत:**

- **क्रियाएँ, चरण नहीं** - कमांड वे चीज़ें हैं जो आप कर सकते हैं, वे चरण नहीं जिनमें आप फँसे हुए हैं
- **निर्भरताएँ सक्षमकर्ता हैं** - वे दिखाते हैं कि क्या संभव है, न कि अगला क्या आवश्यक है

> **अनुकूलन:** OPSX वर्कफ़्लोज़ स्कीमाओं द्वारा संचालित होते हैं जो आर्टिफ़ैक्ट अनुक्रमों को परिभाषित करते हैं। कस्टम स्कीमा बनाने के विवरण के लिए [अनुकूलन](customization.md) देखें।

## दो मोड

### डिफ़ॉल्ट त्वरित पथ (`core` प्रोफ़ाइल)

नई इंस्टॉलेशन डिफ़ॉल्ट रूप से `core` पर सेट होती है, जो निम्नलिखित प्रदान करती है:
- `/opsx:propose`
- `/opsx:explore`
- `/opsx:apply`
- `/opsx:sync`
- `/opsx:archive`

सामान्य प्रवाह:

```text
/opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
```

### विस्तारित/पूर्ण वर्कफ़्लो (कस्टम चयन)

यदि आप स्पष्ट स्कैफ़ोल्ड-एंड-बिल्ड कमांड (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:bulk-archive`, `/opsx:onboard`) चाहते हैं, तो उन्हें इस प्रकार सक्षम करें:

```bash
openspec config profile
openspec update
```

## वर्कफ़्लो पैटर्न (विस्तारित मोड)

### त्वरित फ़ीचर

जब आप जानते हैं कि आपको क्या बनाना है और बस निष्पादित करने की आवश्यकता है:

```text
/opsx:new ──► /opsx:ff ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

**उदाहरण वार्तालाप:**

```text
You: /opsx:new add-logout-button

AI:  Created openspec/changes/add-logout-button/
     Ready to create: proposal

You: /opsx:ff

AI:  Creating all planning artifacts...
     ✓ proposal.md
     ✓ specs/
     ✓ design.md
     ✓ tasks.md
     Ready for implementation!

You: /opsx:apply

AI:  Working through tasks...
     ✓ Added logout button to header
     ✓ Implemented session clearing
     ✓ Added confirmation dialog
     All tasks complete!

You: /opsx:archive

AI:  ✓ Merged specs
     ✓ Archived change
```

**इसके लिए सर्वोत्तम:** छोटे से मध्यम फ़ीचर, बग फ़िक्स, सीधे बदलाव।

### अन्वेषणात्मक

जब आवश्यकताएँ अस्पष्ट हों या आपको पहले जाँच-पड़ताल करनी हो:

```text
/opsx:explore ──► /opsx:new ──► /opsx:continue ──► ... ──► /opsx:apply
```

**उदाहरण वार्तालाप:**

```text
You: /opsx:explore

AI:  What would you like to explore?

You: I want to improve page load performance but I'm not sure
     where the bottlenecks are.

AI:  Let me help investigate...
     [Analyzes bundle sizes, identifies slow queries, reviews
     component render patterns]

     I found three main bottlenecks:
     1. Large unoptimized images
     2. Synchronous data fetching in ProductList
     3. Re-renders from context changes

     Which would you like to address first?

You: Let's tackle the data fetching issue.

You: /opsx:new optimize-product-list-fetching

AI:  Created change. Ready to create: proposal

You: /opsx:continue

AI:  Creating proposal based on our exploration...
     [Writes proposal incorporating investigation insights]

     Ready to create: specs, design
     Which would you like next?

You: /opsx:continue

AI:  Creating specs...
```

**इसके लिए सर्वोत्तम:** प्रदर्शन अनुकूलन, डिबगिंग, आर्किटेक्चर निर्णय, अस्पष्ट आवश्यकताएँ।

### समानांतर बदलाव

एक साथ कई बदलावों पर काम करें:

```text
Change A: /opsx:new ──► /opsx:ff ──► /opsx:apply (in progress)
                                         │
                                    context switch
                                         │
Change B: /opsx:new ──► /opsx:ff ──────► /opsx:apply
```

**उदाहरण वार्तालाप:**

```text
You: I'm working on add-dark-mode but got pulled into a bug fix

You: /opsx:new fix-login-redirect

AI:  Created openspec/changes/fix-login-redirect/

You: /opsx:ff

AI:  ✓ Created planning artifacts

You: /opsx:apply

AI:  Working on fix-login-redirect...
     [Implements the fix]
     All tasks complete!

You: /opsx:archive

AI:  ✓ Archived fix-login-redirect

You: Let's get back to dark mode

You: /opsx:apply add-dark-mode

AI:  Resuming add-dark-mode...
     Picking up at task 2.3: Update Header...
```

**इसके लिए सर्वोत्तम:** समानांतर कार्य धाराएँ, तत्काल बाधाएँ, टीम सहयोग।

जब आपके पास कई पूर्ण किए गए बदलाव हों, तो `/opsx:bulk-archive` का उपयोग करें:

```text
You: /opsx:bulk-archive

AI:  Found 3 completed changes:
     - add-dark-mode (all tasks done)
     - fix-login-redirect (all tasks done)
     - update-footer (all tasks done)

     Checking for spec conflicts...
     ⚠ add-dark-mode and update-footer both touch specs/ui/

     Inspecting codebase to resolve...
     Both changes are implemented. Will apply in chronological order.

     Archive all 3 changes?

You: Yes

AI:  ✓ Archived add-dark-mode
     ✓ Archived fix-login-redirect
     ✓ Archived update-footer
     Specs merged in order: add-dark-mode → update-footer
```

बल्क आर्काइव पता लगाता है जब कई बदलाव एक ही स्पेक्स को प्रभावित करते हैं और वास्तव में क्या लागू किया गया है, यह जाँचकर विरोधों को हल करता है।

### बदलाव को पूरा करना

अनुशंसित पूर्णता प्रवाह:

```text
/opsx:apply ──► /opsx:verify ──► /opsx:archive
                    │                 │
              validates          prompts to sync
              implementation     if needed
```

#### सत्यापन: अपना काम जाँचें

`/opsx:verify` तीन आयामों में आपके आर्टिफ़ैक्ट्स के विरुद्ध कार्यान्वयन को मान्य करता है:

```text
You: /opsx:verify

AI:  Verifying add-auth...

     COMPLETENESS
     ✓ All 12 tasks in tasks.md are checked
     ✓ All requirements in specs have corresponding code
     ⚠ Scenario "Session timeout after inactivity" not tested

     CORRECTNESS
     ✓ Implementation matches spec intent
     ✓ Edge cases from scenarios are handled
     ✓ Error states match spec definitions

     COHERENCE
     ✓ Design decisions reflected in code structure
     ✓ Naming conventions consistent with design.md
     ⚠ Design mentions "event-driven" but implementation uses polling

     SUMMARY
     ─────────────────────────────
     Critical issues: 0
     Warnings: 2
     Ready to archive: Yes (with warnings)

     Recommendations:
     1. Add test for session timeout scenario
     2. Consider refactoring to event-driven as designed, or update design.md
```

**वेरिफ़ाई क्या जाँचता है:**

| आयाम | क्या मान्य करता है |
|-----------|------------------|
| पूर्णता | सभी कार्य पूर्ण, सभी आवश्यकताएँ लागू, परिदृश्य कवर किए गए |
| शुद्धता | कार्यान्वयन स्पेक के इरादे से मेल खाता है, एज केस हैंडल किए गए |
| सुसंगतता | डिज़ाइन निर्णय कोड में प्रतिबिंबित, पैटर्न सुसंगत |

वेरिफ़ाई आर्काइव को ब्लॉक नहीं करेगा, लेकिन यह उन मुद्दों को सामने लाता है जिन्हें आप पहले संबोधित करना चाह सकते हैं।

#### आर्काइव: बदलाव को अंतिम रूप दें

`/opsx:archive` बदलाव को पूरा करता है और इसे आर्काइव में ले जाता है:

```text
You: /opsx:archive

AI:  Archiving add-auth...

     Artifact status:
     ✓ proposal.md exists
     ✓ specs/ exists
     ✓ design.md exists
     ✓ tasks.md exists (12/12 tasks complete)

     Delta specs: Not yet synced to main
     → Would you like to sync now?

You: Yes

AI:  ✓ Synced specs to openspec/specs/auth/spec.md
     ✓ Moved to openspec/changes/archive/2025-01-24-add-auth/

     Change archived successfully.
```

आर्काइव स्पेक्स सिंक नहीं होने पर संकेत देगा। यह अपूर्ण कार्यों पर ब्लॉक नहीं करेगा, लेकिन चेतावनी देगा।

## कब क्या उपयोग करें

### `/opsx:ff` बनाम `/opsx:continue`

| स्थिति | उपयोग करें |
|-----------|-----|
| स्पष्ट आवश्यकताएँ, बनाने के लिए तैयार | `/opsx:ff` |
| अन्वेषण कर रहे हैं, प्रत्येक चरण की समीक्षा करना चाहते हैं | `/opsx:continue` |
| स्पेक्स से पहले प्रस्ताव पर पुनरावृत्ति करना चाहते हैं | `/opsx:continue` |
| समय का दबाव, तेज़ी से आगे बढ़ना है | `/opsx:ff` |
| जटिल बदलाव, नियंत्रण चाहते हैं | `/opsx:continue` |

**अंगूठे का नियम:** यदि आप पूर्ण दायरा पहले से बता सकते हैं, तो `/opsx:ff` उपयोग करें। यदि आप चलते-चलते समझ रहे हैं, तो `/opsx:continue` उपयोग करें।

### अपडेट करें या नया शुरू करें

एक सामान्य प्रश्न: मौजूदा बदलाव को अपडेट करना कब ठीक है, और कब नया शुरू करना चाहिए?

**मौजूदा बदलाव को अपडेट करें जब:**

- समान इरादा, परिष्कृत निष्पादन
- दायरा संकुचित हो (पहले MVP, बाकी बाद में)
- सीखने-आधारित सुधार (कोडबेस वैसा नहीं जैसा आपने अपेक्षा की थी)
- कार्यान्वयन खोजों के आधार पर डिज़ाइन समायोजन

**नया बदलाव शुरू करें जब:**

- इरादा मूल रूप से बदल गया हो
- दायरा पूरी तरह से अलग कार्य में विस्फोटित हो गया हो
- मूल बदलाव को स्वतंत्र रूप से "पूर्ण" चिह्नित किया जा सकता हो
- पैच स्पष्ट करने की तुलना में अधिक भ्रमित करेंगे

```text
                     ┌─────────────────────────────────────┐
                     │     Is this the same work?          │
                     └──────────────┬──────────────────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
          Same intent?      >50% overlap?      Can original
          Same problem?     Same scope?        be "done" without
                 │                  │          these changes?
                 │                  │                  │
       ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
       │                 │  │             │   │               │
      YES               NO YES           NO  NO              YES
       │                 │  │             │   │               │
       ▼                 ▼  ▼             ▼   ▼               ▼
    UPDATE            NEW  UPDATE       NEW  UPDATE          NEW
```

**उदाहरण: "डार्क मोड जोड़ें"**

- "कस्टम थीम का भी समर्थन करना होगा" → नया बदलाव (दायरा विस्फोटित)
- "सिस्टम प्राथमिकता पहचान अपेक्षा से कठिन है" → अपडेट (समान इरादा)
- "पहले टॉगल शिप करें, प्राथमिकताएँ बाद में जोड़ें" → अपडेट, फिर आर्काइव, फिर नया बदलाव

## सर्वोत्तम अभ्यास

### बदलावों को केंद्रित रखें

प्रत्येक बदलाव में एक तार्किक कार्य इकाई। यदि आप "फ़ीचर X जोड़ें और साथ ही Y को रिफ़ैक्टर करें" कर रहे हैं, तो दो अलग-अलग बदलावों पर विचार करें।

**यह क्यों महत्वपूर्ण है:**
- समीक्षा और समझना आसान
- स्वच्छ आर्काइव इतिहास
- स्वतंत्र रूप से शिप कर सकते हैं
- आवश्यकता पड़ने पर सरल रोलबैक

### अस्पष्ट आवश्यकताओं के लिए `/opsx:explore` का उपयोग करें

किसी बदलाव को करने से पहले, समस्या क्षेत्र का अन्वेषण करें:

```text
You: /opsx:explore

AI:  What would you like to explore?

You: How should we handle rate limiting for our API?

AI:  Let me investigate your current setup and options...
     [Researches codebase, considers patterns]

     I see three approaches we could take:
     1. Middleware-based (simple, per-endpoint)
     2. Redis-backed (scalable, shared state)
     3. Token bucket per user (fair, complex)

     Your current stack suggests #1 or #2. What's your scale?
```

अन्वेषण आर्टिफ़ैक्ट बनाने से पहले सोच को स्पष्ट करता है।

### आर्काइव करने से पहले सत्यापित करें

कार्यान्वयन आर्टिफ़ैक्ट्स से मेल खाता है या नहीं, यह जाँचने के लिए `/opsx:verify` का उपयोग करें:

```text
You: /opsx:verify

AI:  Verifying add-dark-mode...

     ✓ All tasks in tasks.md are checked
     ✓ Requirements in specs have corresponding code
     ✓ Design decisions are reflected in implementation

     Ready to archive!
```

बदलाव बंद करने से पहले बेमेल पकड़ता है।

### बदलावों का स्पष्ट नाम रखें

अच्छे नाम `openspec list` को उपयोगी बनाते हैं:

```text
Good:                          Avoid:
add-dark-mode                  feature-1
fix-login-redirect             update
optimize-product-query         changes
implement-2fa                  wip
```

## कमांड त्वरित संदर्भ

पूर्ण कमांड विवरण और विकल्पों के लिए, [Commands](commands.md) देखें।

| कमांड | उद्देश्य | कब उपयोग करें |
|---------|---------|-------------|
| `/opsx:propose` | परिवर्तन + योजना कलाकृतियाँ बनाएँ | तेज़ डिफ़ॉल्ट पथ (`core` प्रोफ़ाइल) |
| `/opsx:explore` | विचारों पर विचार करें | अस्पष्ट आवश्यकताएँ, जाँच |
| `/opsx:new` | एक परिवर्तन स्कैफ़ोल्ड शुरू करें | विस्तारित मोड, स्पष्ट कलाकृति नियंत्रण |
| `/opsx:continue` | अगली कलाकृति बनाएँ | विस्तारित मोड, चरण-दर-चरण कलाकृति निर्माण |
| `/opsx:ff` | सभी योजना कलाकृतियाँ बनाएँ | विस्तारित मोड, स्पष्ट दायरा |
| `/opsx:apply` | कार्यों को लागू करें | कोड लिखने के लिए तैयार |
| `/opsx:verify` | कार्यान्वयन को मान्य करें | विस्तारित मोड, संग्रहीत करने से पहले |
| `/opsx:sync` | डेल्टा स्पेक्स को मर्ज करें | विस्तारित मोड, वैकल्पिक |
| `/opsx:archive` | परिवर्तन पूरा करें | सारा काम पूरा हो गया |
| `/opsx:bulk-archive` | एकाधिक परिवर्तनों को संग्रहीत करें | विस्तारित मोड, समानांतर कार्य |

## अगले कदम

- [Commands](commands.md) - विकल्पों के साथ पूर्ण कमांड संदर्भ
- [Concepts](concepts.md) - स्पेक्स, कलाकृतियों और स्कीमाओं में गहराई से जानकारी
- [Customization](customization.md) - कस्टम वर्कफ़्लो बनाएँ
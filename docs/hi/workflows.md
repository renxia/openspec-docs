# वर्कफ़्लो

यह मार्गदर्शिका OpenSpec के लिए सामान्य वर्कफ़्लो पैटर्न और प्रत्येक का उपयोग कब करना है, इस पर चर्चा करती है। बुनियादी सेटअप के लिए, [शुरुआत कैसे करें](getting-started.md) देखें। कमांड संदर्भ के लिए, [कमांड](commands.md) देखें।

## दर्शन: चरण नहीं, क्रियाएँ

पारंपरिक वर्कफ़्लो आपको चरणों में बाँध देते हैं: योजना बनाना, फिर कार्यान्वयन, फिर समाप्त। लेकिन वास्तविक काम इतनी सफाई से बक्सों में नहीं बैठता।

OPSX एक अलग दृष्टिकोण अपनाता है:

```text
पारंपरिक (चरण-बंधित):

  योजना बनाना ────────► कार्यान्वयन ────────► समाप्त
      │                    │
      │   "पीछे नहीं जा सकते"  │
      └────────────────────┘

OPSX (प्रवाहमान क्रियाएँ):

  प्रस्ताव ──► विनिर्देश ──► डिज़ाइन ──► कार्य ──► कार्यान्वयन
```

**मुख्य सिद्धांत:**

- **क्रियाएँ, चरण नहीं** - कमांड वे चीजें हैं जो आप कर सकते हैं, न कि चरण जिनमें आप फंस जाते हैं
- **निर्भरताएँ सक्षम करने वाली हैं** - ये दिखाती हैं कि क्या संभव है, न कि अगला क्या आवश्यक है

> **अनुकूलन:** OPSX वर्कफ़्लो ऐसे स्कीमा द्वारा संचालित होते हैं जो कृतियों के अनुक्रम परिभाषित करते हैं। कस्टम स्कीमा बनाने के विवरण के लिए, [अनुकूलन](customization.md) देखें।

## दो मोड

### डिफ़ॉल्ट त्वरित पथ (`core` प्रोफ़ाइल)

नई इंस्टॉलेशन डिफ़ॉल्ट रूप से `core` का उपयोग करती हैं, जो निम्नलिखित प्रदान करता है:
- `/opsx:propose`
- `/opsx:explore`
- `/opsx:apply`
- `/opsx:archive`

सामान्य प्रवाह:

```text
/opsx:propose ──► /opsx:apply ──►/opsx:archive
```

### विस्तारित/पूर्ण वर्कफ़्लो (कस्टम चयन)

यदि आप स्पष्ट स्कैफ़ोल्ड-एंड-बिल्ड कमांड (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:sync`, `/opsx:bulk-archive`, `/opsx:onboard`) चाहते हैं, तो उन्हें इसके साथ सक्षम करें:

```bash
openspec config profile
openspec update
```

## वर्कफ़्लो पैटर्न (विस्तारित मोड)

### त्वरित फ़ीचर

जब आप जानते हैं कि आप क्या बनाना चाहते हैं और बस निष्पादित करने की आवश्यकता है:

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

**सर्वोत्तम उपयोग:** छोटे से मध्यम फ़ीचर, बग फ़िक्स, सरल परिवर्तन।

### अन्वेषणात्मक

जब आवश्यकताएँ अस्पष्ट हों या आपको पहले जांच करने की आवश्यकता हो:

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

**सर्वोत्तम उपयोग:** प्रदर्शन अनुकूलन, डीबगिंग, वास्तुकला निर्णय, अस्पष्ट आवश्यकताएँ।

### समानांतर परिवर्तन

एक साथ कई परिवर्तनों पर काम करें:

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

**सर्वोत्तम उपयोग:** समानांतर कार्य स्ट्रीम, तत्काल बाधाएँ, टीम सहयोग।

जब आपके पास कई पूर्ण परिवर्तन हों, तो `/opsx:bulk-archive` का उपयोग करें:

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

बल्क आर्काइव तब पता लगाता है जब कई परिवर्तन एक ही स्पेक्स को छूते हैं और वास्तव में क्या लागू किया गया है, यह जांचकर विवादों को हल करता है।

### परिवर्तन पूरा करना

अनुशंसित पूर्णता प्रवाह:

```text
/opsx:apply ──► /opsx:verify ──► /opsx:archive
                    │                 │
              validates          prompts to sync
              implementation     if needed
```

#### सत्यापन: अपना कार्य जांचें

`/opsx:verify` तीन आयामों में आपकी कलाकृतियों के विरुद्ध कार्यान्वयन को मान्य करता है:

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

**सत्यापन क्या जांचता है:**

| आयाम | यह क्या मान्य करता है |
|-----------|------------------|
| पूर्णता | सभी कार्य पूरे हों, सभी आवश्यकताएँ लागू हों, परिदृश्य कवर हों |
| सटीकता | कार्यान्वयन स्पेक्स के इरादे से मेल खाता हो, किनारे के मामले संभाले जाएँ |
| सुसंगतता | डिज़ाइन निर्णय कोड संरचना में प्रतिबिंबित हों, पैटर्न संगत हों |

सत्यापन आर्काइव को अवरुद्ध नहीं करेगा, लेकिन यह उन मुद्दों को सामने लाता है जिन्हें आप पहले संबोधित करना चाह सकते हैं।

#### आर्काइव: परिवर्तन को अंतिम रूप दें

`/opsx:archive` परिवर्तन को पूरा करता है और इसे आर्काइव में ले जाता है:

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

आर्काइव स्पेक्स सिंक न होने पर प्रॉम्प्ट करेगा। यह अपूर्ण कार्यों पर अवरोध नहीं लगाएगा, लेकिन आपको चेतावनी देगा।

## कब क्या उपयोग करें

### `/opsx:ff` बनाम `/opsx:continue`

| स्थिति | उपयोग करें |
|-----------|-----|
| स्पष्ट आवश्यकताएँ, निर्माण के लिए तैयार | `/opsx:ff` |
| अन्वेषण कर रहे हैं, प्रत्येक चरण की समीक्षा करना चाहते हैं | `/opsx:continue` |
| स्पेक्स से पहले प्रस्ताव पर पुनरावृत्ति करना चाहते हैं | `/opsx:continue` |
| समय का दबाव, तेजी से आगे बढ़ने की आवश्यकता | `/opsx:ff` |
| जटिल परिवर्तन, नियंत्रण चाहते हैं | `/opsx:continue` |

**सामान्य नियम:** यदि आप पूरी सीमा का वर्णन पहले से कर सकते हैं, तो `/opsx:ff` का उपयोग करें। यदि आप इसे चलते-चलते समझ रहे हैं, तो `/opsx:continue` का उपयोग करें।

### कब अपडेट करें बनाम नया शुरू करें

एक सामान्य प्रश्न: कब मौजूदा परिवर्तन को अपडेट करना ठीक है, और कब नया शुरू करना चाहिए?

**मौजूदा परिवर्तन को तब अपडेट करें जब:**

- एक ही इरादा, परिष्कृत निष्पादन
- सीमा संकीर्ण हो (पहले MVP, बाकी बाद में)
- सीख-आधारित सुधार (कोडबेस जैसा आपने अपेक्षित नहीं था)
- कार्यान्वयन खोजों के आधार पर डिज़ाइन समायोजन

**नया परिवर्तन तब शुरू करें जब:**

- इरादा मौलिक रूप से बदल गया हो
- सीमा पूरी तरह से अलग काम में विस्फोट हो गई हो
- मूल परिवर्तन को स्वतंत्र रूप से "पूर्ण" चिह्नित किया जा सकता है
- पैच स्पष्ट करने से अधिक भ्रमित करेंगे

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

- "कस्टम थीम का समर्थन भी करना है" → नया परिवर्तन (सीमा विस्फोट)
- "सिस्टम प्रेफ़रेंस डिटेक्शन अपेक्षा से कठिन है" → अपडेट (एक ही इरादा)
- "पहले टॉगल शिप करें, बाद में प्रेफ़रेंस जोड़ें" → अपडेट करें, फिर आर्काइव करें, फिर नया परिवर्तन

## सर्वोत्तम अभ्यास

### परिवर्तनों को केंद्रित रखें

प्रति परिवर्तन एक तार्किक कार्य इकाई। यदि आप "फ़ीचर X जोड़ें और साथ ही Y को रीफ़ैक्टर करें" कर रहे हैं, तो दो अलग-अलग परिवर्तनों पर विचार करें।

**यह क्यों मायने रखता है:**
- समीक्षा और समझने में आसान
- स्वच्छ आर्काइव इतिहास
- स्वतंत्र रूप से शिप किया जा सकता है
- आवश्यकता पड़ने पर सरल रोलबैक

### अस्पष्ट आवश्यकताओं के लिए `/opsx:explore` का उपयोग करें

परिवर्तन के लिए प्रतिबद्ध होने से पहले, समस्या स्थान का अन्वेषण करें:

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

अन्वेषण कलाकृतियाँ बनाने से पहले सोच को स्पष्ट करता है।

### आर्काइव करने से पहले सत्यापन करें

जांचें कि कार्यान्वयन कलाकृतियों से मेल खाता है:

```text
You: /opsx:verify

AI:  Verifying add-dark-mode...

     ✓ All tasks in tasks.md are checked
     ✓ Requirements in specs have corresponding code
     ✓ Design decisions are reflected in implementation

     Ready to archive!
```

परिवर्तन बंद करने से पहले बेमेल पकड़ता है।

### परिवर्तनों का स्पष्ट नामकरण करें

अच्छे नाम `openspec list` को उपयोगी बनाते हैं:

```text
Good:                          Avoid:
add-dark-mode                  feature-1
fix-login-redirect             update
optimize-product-query         changes
implement-2fa                  wip
```

## आदेश त्वरित संदर्भ

पूर्ण आदेश विवरण और विकल्पों के लिए, [आदेश](commands.md) देखें।

| आदेश | उद्देश्य | कब उपयोग करें |
|---------|---------|-------------|
| `/opsx:propose` | परिवर्तन + योजना कलाकृतियाँ बनाएँ | तेज़ डिफ़ॉल्ट पथ (`core` प्रोफ़ाइल) |
| `/opsx:explore` | विचारों पर विचार करें | अस्पष्ट आवश्यकताएँ, जाँच-पड़ताल |
| `/opsx:new` | एक परिवर्तन स्कैफ़ोल्ड शुरू करें | विस्तारित मोड, स्पष्ट कलाकृति नियंत्रण |
| `/opsx:continue` | अगली कलाकृति बनाएँ | विस्तारित मोड, चरण-दर-चरण कलाकृति निर्माण |
| `/opsx:ff` | सभी योजना कलाकृतियाँ बनाएँ | विस्तारित मोड, स्पष्ट दायरा |
| `/opsx:apply` | कार्य लागू करें | कोड लिखने के लिए तैयार |
| `/opsx:verify` | कार्यान्वयन मान्य करें | विस्तारित मोड, संग्रह से पहले |
| `/opsx:sync` | डेल्टा विनिर्देश मिलाएँ | विस्तारित मोड, वैकल्पिक |
| `/opsx:archive` | परिवर्तन पूरा करें | सभी कार्य समाप्त |
| `/opsx:bulk-archive` | कई परिवर्तन संग्रहीत करें | विस्तारित मोड, समानांतर कार्य |

## अगले कदम

- [आदेश](commands.md) - विकल्पों के साथ पूर्ण आदेश संदर्भ
- [अवधारणाएँ](concepts.md) - विनिर्देशों, कलाकृतियों और स्कीमाओं में गहराई से जानकारी
- [अनुकूलन](customization.md) - कस्टम वर्कफ़्लो बनाएँ
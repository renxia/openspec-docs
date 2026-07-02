# कार्यप्रवाह (Workflows)

यह गाइड OpenSpec के लिए सामान्य कार्यप्रवाह पैटर्न और प्रत्येक का उपयोग कब करना है, इसे कवर करती है। बुनियादी सेटअप के लिए, [Getting Started](getting-started.md) देखें। कमांड संदर्भ के लिए, [Commands](commands.md) देखें।

## दर्शन: चरण नहीं, बल्कि क्रियाएँ (Actions)

पारंपरिक कार्यप्रवाह आपको चरणों से गुजारते हैं: योजना बनाना, फिर कार्यान्वयन (implementation), फिर पूरा होना। लेकिन वास्तविक काम करीने से बक्सों में फिट नहीं होता है।

OPSX एक अलग दृष्टिकोण अपनाता है:

```text
Traditional (phase-locked):

  PLANNING ────────► IMPLEMENTING ────────► DONE
      │                    │
      │   "Can't go back"  │
      └────────────────────┘

OPSX (fluid actions):

  proposal ──► specs ──► design ──► tasks ──► implement
```

**मुख्य सिद्धांत:**

- **चरण नहीं, बल्कि क्रियाएँ (Actions)** - कमांड वे चीज़ें हैं जो आप कर सकते हैं, न कि ऐसे चरण जिनमें आप फँसे हुए हैं।
- **निर्भरताएँ सक्षमकर्ता (enablers) होती हैं** - वे दिखाती हैं कि क्या संभव है, न कि आगे क्या आवश्यक है।

> **अनुकूलन (Customization):** OPSX वर्कफ़्लो उन स्कीमाओं द्वारा संचालित होते हैं जो कलाकृति अनुक्रमों (artifact sequences) को परिभाषित करते हैं। कस्टम स्कीमा बनाने के बारे में विवरण के लिए [Customization](customization.md) देखें।

## दो मोड

### डिफ़ॉल्ट क्विक पाथ (`core` प्रोफ़ाइल)

नए इंस्टॉलेशन `core` पर डिफ़ॉल्ट होते हैं, जो निम्नलिखित प्रदान करता है:
- `/opsx:explore`
- `/opsx:propose`
- `/opsx:apply`
- `/opsx:sync`
- `/opsx:archive`

विशिष्ट प्रवाह:

```text
/opsx:explore ──► /opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
  (optional)
```

#### एक्सप्लोर करने से शुरुआत करें (यह एक ऐसी आदत है जिसे विकसित करना चाहिए)

`/opsx:explore` डिफ़ॉल्ट प्रोफ़ाइल का हिस्सा है, न कि कोई उन्नत ऐड-ऑन। यह वह कदम है जो आपको तब उठाना चाहिए जब आपके पास कोई समस्या हो लेकिन अभी तक कोई योजना नहीं हो, और एक AI सहायक के साथ, यह अधिकांश समय ऐसा ही होता है।

```text
You: /opsx:explore

AI:  What would you like to explore?

You: Our search results feel stale. I'm not sure if it's caching,
     indexing, or the query itself.

AI:  Let me look... [reads the search service and cache layer]
     It's the index: it only rebuilds nightly, so edits don't show
     up until the next day. Two options: rebuild on write (simple,
     more load) or a short-TTL cache invalidation (more moving parts,
     less load). Given your write volume is low, rebuild-on-write is
     the cleaner fix. Want to scope it?

You: Yes.

You: /opsx:propose rebuild-search-index-on-write
```

एक्सप्लोर कोई आर्टिफैक्ट (artifacts) नहीं बनाता है और न ही कोड लिखता है। यह एक मुफ्त, जोखिम-मुक्त बातचीत है जो एक अस्पष्ट चिंता को एक सटीक परिवर्तन में बदल देती है, ताकि बाद वाला प्रस्ताव स्पष्ट हो। क्या आप पहले से ही ठीक जानते हैं कि आपको क्या चाहिए? इसे छोड़ दें और सीधे `/opsx:propose` पर जाएं। पूर्ण गाइड: [Explore First](explore.md)।

### विस्तारित/पूर्ण वर्कफ़्लो (कस्टम चयन)

यदि आप स्पष्ट स्कैफोल्डिंग और बिल्ड कमांड्स (`/opsx:new`, `/opsx:continue`, आदि) चाहते हैं, तो इन्हें निम्नलिखित के साथ सक्षम करें:

```bash
openspec config profile
openspec update
```

## वर्कफ़्लो पैटर्न (विस्तारित मोड)

### त्वरित सुविधा (Quick Feature)

जब आप जानते हैं कि आपको क्या बनाना है और बस उसे निष्पादित करने की आवश्यकता है:

```text
/opsx:new ──► /opsx:ff ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

**उदाहरण बातचीत:**

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

**सर्वश्रेष्ठ के लिए:** छोटे से मध्यम सुविधाएँ, बग फिक्स, सीधी-सादी परिवर्तन।

### अन्वेषणात्मक (Exploratory)

जब आवश्यकताएँ स्पष्ट नहीं होती हैं या आपको पहले जांच करने की आवश्यकता होती है:

```text
/opsx:explore ──► /opsx:new ──► /opsx:continue ──► ... ──► /opsx:apply
```

**उदाहरण बातचीत:**

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

**सर्वश्रेष्ठ के लिए:** प्रदर्शन अनुकूलन (Performance optimization), डीबगिंग, वास्तुशिल्पिक निर्णय (architectural decisions), अस्पष्ट आवश्यकताएँ।

### समानांतर परिवर्तन (Parallel Changes)

एक साथ कई परिवर्तनों पर काम करें:

```text
Change A: /opsx:new ──► /opsx:ff ──► /opsx:apply (in progress)
                                         │
                                    context switch
                                         │
Change B: /opsx:new ──► /opsx:ff ──────► /opsx:apply
```

**उदाहरण बातचीत:**

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

**सर्वश्रेष्ठ के लिए:** समानांतर कार्य धाराएँ, तत्काल रुकावटें (interrupts), टीम सहयोग।

जब आपके पास कई पूरे हो चुके परिवर्तन हों, तो `/opsx:bulk-archive` का उपयोग करें:

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

बल्क आर्काइव यह पता लगाता है कि जब कई परिवर्तन समान स्पेसिफिकेशन्स को छूते हैं तो क्या होता है और यह जाँच करके संघर्षों (conflicts) को हल करता है कि वास्तव में क्या लागू किया गया है।

### एक परिवर्तन को पूरा करना

अनुशंसित समापन प्रवाह:

```text
/opsx:apply ──► /opsx:verify ──► /opsx:archive
                    │                 │
              validates          prompts to sync
              implementation     if needed
```

#### सत्यापित करें (Verify): अपना काम जांचें

`/opsx:verify` तीन आयामों में आपके आर्टिफैक्ट्स के विरुद्ध कार्यान्वयन (implementation) को मान्य करता है:

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

**यह क्या जांचता है:**

| आयाम | यह क्या सत्यापित करता है |
|-----------|------------------|
| Completeness | सभी कार्य पूरे हैं, सभी आवश्यकताएँ लागू की गई हैं, परिदृश्य शामिल हैं |
| Correctness | कार्यान्वयन स्पेसिफिकेशन के इरादे से मेल खाता है, एज केस संभाले गए हैं |
| Coherence | डिज़ाइन निर्णय कोड संरचना में परिलक्षित होते हैं, नामकरण परंपराएँ design.md के अनुरूप हैं |

सत्यापित करना आर्काइव को रोकेगा नहीं, लेकिन यह उन मुद्दों को सामने लाता है जिन्हें आप पहले संबोधित करना चाहेंगे।

#### संग्रह (Archive): परिवर्तन को अंतिम रूप दें

`/opsx:archive` परिवर्तन को पूरा करता है और इसे संग्रह में ले जाता है:

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

यदि स्पेसिफिकेशन्स सिंक नहीं किए गए हैं तो आर्काइव संकेत देगा। यह अधूरे कार्यों पर रुकेगा नहीं, लेकिन यह आपको चेतावनी देगा।

## किसका उपयोग कब करें

### `/opsx:ff` बनाम `/opsx:continue`

| स्थिति | उपयोग करें |
|-----------|-----|
| स्पष्ट आवश्यकताएँ, बनाने के लिए तैयार | `/opsx:ff` |
| अन्वेषण कर रहे हैं, प्रत्येक चरण की समीक्षा करना चाहते हैं | `/opsx:continue` |
| स्पेसिफिकेशन्स से पहले प्रस्ताव पर पुनरावृति (iterate) करना चाहते हैं | `/opsx:continue` |
| समय का दबाव है, तेज़ी से आगे बढ़ना है | `/opsx:ff` |
| जटिल परिवर्तन, नियंत्रण चाहते हैं | `/opsx:continue` |

**सामान्य नियम:** यदि आप शुरुआत में संपूर्ण दायरे का वर्णन कर सकते हैं, तो `/opsx:ff` का उपयोग करें। यदि आप चलते-चलते इसे समझ रहे हैं, तो `/opsx:continue` का उपयोग करें।

### कब अपडेट करना है बनाम नया शुरू करना है

एक सामान्य प्रश्न: क्या मौजूदा परिवर्तन को अपडेट करना ठीक है, और आपको कब एक नया शुरू करना चाहिए?

**मौजूदा परिवर्तन को अपडेट करें जब:**

- समान मंशा (intent), परिष्कृत निष्पादन
- दायरा संकरा हो जाए (पहले MVP, बाकी बाद में)
- सीखने पर आधारित सुधार (कोडबेस वह नहीं था जिसकी आप उम्मीद कर रहे थे)
- कार्यान्वयन की खोजों के आधार पर डिज़ाइन बदलाव

**एक नया परिवर्तन शुरू करें जब:**

- मंशा मौलिक रूप से बदल गई हो
- दायरा पूरी तरह से अलग काम में फट गया हो (exploded)
- मूल परिवर्तन को स्वतंत्र रूप से "पूरा" चिह्नित किया जा सके
- पैच स्पष्ट करने से ज़्यादा भ्रम पैदा करेंगे

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

- "कस्टम थीम का समर्थन करने की भी आवश्यकता है" → नया परिवर्तन (दायरा फट गया)
- "सिस्टम प्राथमिकता का पता लगाना अपेक्षा से अधिक कठिन है" → अपडेट (समान मंशा)
- "पहले टॉगल शिप करें, बाद में प्राथमिकताएँ जोड़ें" → अपडेट फिर संग्रह करें, फिर नया परिवर्तन

## सर्वोत्तम अभ्यास (Best Practices)

### परिवर्तनों को केंद्रित रखें

प्रत्येक परिवर्तन के लिए एक तार्किक कार्य इकाई। यदि आप 'सुविधा X जोड़ना और Y को रीफैक्टर करना' कर रहे हैं, तो दो अलग-अलग परिवर्तनों पर विचार करें।

**यह क्यों मायने रखता है:**
- समीक्षा करना और समझना आसान है
- स्वच्छ संग्रह इतिहास
- स्वतंत्र रूप से शिप किया जा सकता है
- आवश्यकता होने पर सरल रोलबैक

### अस्पष्ट आवश्यकताओं के लिए `/opsx:explore` का उपयोग करें

परिवर्तन के लिए प्रतिबद्ध होने से पहले, समस्या क्षेत्र की जांच करें:

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

एक्सप्लोरेशन आर्टिफैक्ट बनाने से पहले सोच को स्पष्ट करता है।

### संग्रह करने से पहले सत्यापित करें

कार्यान्वयन आर्टिफैक्ट्स से मेल खाता है या नहीं, यह जांचने के लिए `/opsx:verify` का उपयोग करें:

```text
You: /opsx:verify

AI:  Verifying add-dark-mode...

     ✓ All tasks in tasks.md are checked
     ✓ Requirements in specs have corresponding code
     ✓ Design decisions are reflected in implementation

     Ready to archive!
```

यह परिवर्तन को बंद करने से पहले विसंगतियों (mismatches) को पकड़ता है।

### परिवर्तनों का स्पष्ट रूप से नामकरण करें

अच्छे नाम `openspec list` को उपयोगी बनाते हैं:

```text
अच्छा:                          बचें:
add-dark-mode                  feature-1
fix-login-redirect             update
optimize-product-query         changes
implement-2fa                  wip
```

## कमांड त्वरित संदर्भ

पूर्ण कमांड विवरण और विकल्पों के लिए, [Commands](commands.md) देखें।

| Command | उद्देश्य | कब उपयोग करें |
|---------|---------|-------------|
| `/opsx:propose` | परिवर्तन और योजना कलाकृतियों (planning artifacts) का निर्माण करना | तेज़ डिफ़ॉल्ट पथ (`core` प्रोफ़ाइल) |
| `/opsx:explore` | AI के साथ विचारों पर विचार करना | जब अनिश्चित हों तो यहां से शुरू करें: अस्पष्ट आवश्यकताएँ, जांच (investigation), विकल्पों की तुलना करना |
| `/opsx:new` | परिवर्तन स्कैफोल्ड (change scaffold) शुरू करना | विस्तारित मोड, स्पष्ट कलाकृति नियंत्रण |
| `/opsx:continue` | अगली कलाकृति बनाना | विस्तारित मोड, चरण-दर-चरण कलाकृति निर्माण |
| `/opsx:ff` | सभी योजना कलाकृतियाँ (planning artifacts) बनाना | विस्तारित मोड, स्पष्ट दायरा (scope) |
| `/opsx:apply` | कार्यों को लागू करना | कोड लिखने के लिए तैयार |
| `/opsx:verify` | कार्यान्वयन (implementation) को मान्य करना | विस्तारित मोड, संग्रह (archiving) से पहले |
| `/opsx:sync` | डेल्टा स्पेसिफिकेशन्स (delta specs) को मर्ज करना | विस्तारित मोड, वैकल्पिक |
| `/opsx:archive` | परिवर्तन को पूरा करना | सारा काम समाप्त हो गया है |
| `/opsx:bulk-archive` | कई परिवर्तनों का संग्रह (archiving) करना | विस्तारित मोड, समानांतर कार्य (parallel work) |

## अगले चरण

- [Commands](commands.md) - विकल्पों के साथ पूर्ण कमांड संदर्भ
- [Concepts](concepts.md) - स्पेसिफिकेशन्स (specs), कलाकृतियों (artifacts), और स्कीमा में गहन जानकारी
- [Customization](customization.md) - कस्टम वर्कफ़्लो बनाना
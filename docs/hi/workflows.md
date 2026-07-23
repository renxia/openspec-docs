# कार्यप्रवाह
यह गाइड ओपनस्पेक के लिए सामान्य कार्यप्रवाह पैटर्न और प्रत्येक का उपयोग कब करें, इस पर कवर करता है। बुनियादी सेटअप के लिए, [शुरुआत करें](getting-started.md) देखें। कमांड संदर्भ के लिए, [Commands](commands.md) देखें।
## दर्शन: कार्य, न कि चरण
पारंपरिक कार्यप्रवाह आपको चरणों से गुजरने के लिए मजबूर करते हैं: योजना, फिर कार्यान्वयन, फिर पूर्ण। लेकिन वास्तविक कार्य बक्सों में सटीक फिट नहीं होता।
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
- **कार्य, न कि चरण** - कमांड वे चीजें हैं जिन्हें आप कर सकते हैं, न कि वे चरण जिनमें आप फंस जाते हैं
- **निर्भरताएं सक्षम करने वाली हैं** - वे दिखाती हैं कि क्या संभव है, न कि अगला क्या आवश्यक है
> **अनुकूलन:** OPSX कार्यप्रवाह आर्टिफैक्ट अनुक्रमों को परिभाषित करने वाले स्कीमा द्वारा संचालित होते हैं। कस्टम स्कीमा बनाने के विवरण के लिए [अनुकूलन](customization.md) देखें।

## दो मोड

### डिफॉल्ट क्विक पाथ (`core` प्रोफाइल)

नए इंस्टॉल डिफॉल्ट रूप से `core` पर होते हैं, जो निम्नलिखित प्रदान करता है:
- `/opsx:explore`
- `/opsx:propose`
- `/opsx:apply`
- `/opsx:sync`
- `/opsx:archive`

सामान्य प्रवाह:

```text
/opsx:explore ──► /opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
  (optional)
```

#### एक्सप्लोर करके शुरुआत करें (बनाने लायक आदत)

`/opsx:explore` डिफॉल्ट प्रोफाइल का हिस्सा है, उन्नत ऐड-ऑन नहीं है। यह वह कदम है जिसे तब लें जब आपके पास कोई समस्या हो लेकिन अभी तक कोई योजना न हो, जो AI असिस्टेंट के साथ, अधिकांश समय होता है।

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

एक्सप्लोर कोई आर्टिफैक्ट नहीं बनाता और कोई कोड नहीं लिखता। यह एक फ्री, नो-स्टेक्स कॉन्वर्सेशन है जो एक अस्पष्ट चिंता को एक सटीक बदलाव में बदल देता है, इसलिए जो प्रॉपोज़ल आता है वह तेज होता है। पहले ही जानते हैं कि आप क्या चाहते हैं? इसे छोड़ें और सीधे `/opsx:propose` पर जाएं। पूरी गाइड: [पहले एक्सप्लोर करें](explore.md).

### विस्तारित/पूर्ण वर्कफ्लो (कस्टम सिलेक्शन)

यदि आप स्पष्ट स्कैफोल्ड-एंड-बिल्ड कमांड्स (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:bulk-archive`, `/opsx:onboard`) चाहते हैं, तो उन्हें सक्षम करने के लिए:

```bash
openspec config profile
openspec update
```

## वर्कफ्लो पैटर्न (विस्तारित मोड)

### क्विक फीचर

जब आप जानते हैं कि आप क्या बिल्ड करना चाहते हैं और बस एक्जीक्यूट करने की जरूरत है:

```text
/opsx:new ──► /opsx:ff ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

**उदाहरण कॉन्वर्सेशन:**

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

**सबसे अच्छा है:** छोटे से मध्यम फीचर्स, बग फिक्स, सीधे बदलाव के लिए।

### एक्सप्लोरेटरी

जब रिक्वायरमेंट्स अस्पष्ट हों या आपको पहले इन्वेस्टिगेट करने की जरूरत हो:

```text
/opsx:explore ──► /opsx:new ──► /opsx:continue ──► ... ──► /opsx:apply
```

**उदाहरण कॉन्वर्सेशन:**

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

**सबसे अच्छा है:** परफॉर्मेंस ऑप्टिमाइजेशन, डीबगिंग, आर्किटेक्चरल डिसिजन, अस्पष्ट रिक्वायरमेंट्स के लिए।

### समानांतर परिवर्तन

एक साथ कई परिवर्तनों पर काम करें:

```text
Change A: /opsx:new ──► /opsx:ff ──► /opsx:apply (in progress)
                                         │
                                    context switch
                                         │
Change B: /opsx:new ──► /opsx:ff ──────► /opsx:apply
```

**उदाहरण कॉन्वर्सेशन:**

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

**सबसे अच्छा है:** समानांतर कार्य स्ट्रीम्स, जरूरी इंटरप्ट्स, टीम सहयोग के लिए।

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

बल्क आर्काइव पता लगाता है कि कई परिवर्तन एक ही स्पेक्स को टच करते हैं और वास्तव में क्या इंप्लीमेंट किया गया है, उसकी जांच करके कन्फ्लिक्ट्स का समाधान करता है।

### परिवर्तन को पूरा करना

अनुशंसित पूर्णता प्रवाह:

```text
/opsx:apply ──► /opsx:verify ──► /opsx:archive
                    │                 │
              validates          prompts to sync
              implementation     if needed
```

#### वेरिफाई: अपना काम जांचें

`/opsx:verify` आपके आर्टिफैक्ट्स के खिलाफ इंप्लीमेंटेशन को तीन आयामों में वैलिडेट करता है:

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

**वेरिफाई क्या जांचता है:**

| आयाम | यह क्या वैलिडेट करता है |
|-----------|------------------|
| पूर्णता | सभी टास्क्स हो गए, सभी रिक्वायरमेंट्स इंप्लीमेंट किए गए, सिनारियो कवर किए गए |
| सटीकता | इंप्लीमेंटेशन स्पेक इंटेंट से मेल खाता है, एज केस हैंडल किए गए |
| संगति | डिजाइन डिसिजन्स कोड में प्रतिबिंबित हैं, पैटर्न्स संगत हैं |

वेरिफाई आर्काइव को ब्लॉक नहीं करेगा, लेकिन यह उन मुद्दों को सामने लाता है जिन्हें आप पहले हल करना चाह सकते हैं।

#### आर्काइव: परिवर्तन को फाइनलाइज़ करें

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

आर्काइव तब प्रॉम्प्ट करेगा जब स्पेक्स सिंक नहीं हों। यह अनपूर्ण टास्क्स पर ब्लॉक नहीं करेगा, लेकिन यह आपको चेतावनी देगा।

## कब क्या उपयोग करें

### `/opsx:ff` बनाम `/opsx:continue`

| स्थिति | उपयोग |
|-----------|-----|
| स्पष्ट रिक्वायरमेंट्स, बिल्ड करने के लिए तैयार | `/opsx:ff` |
| एक्सप्लोर कर रहे हैं, हर कदम की समीक्षा करना चाहते हैं | `/opsx:continue` |
| स्पेक्स से पहले प्रॉपोज़ल पर इटरेट करना चाहते हैं | `/opsx:continue` |
| समय का दबाव, जल्दी आगे बढ़ने की जरूरत | `/opsx:ff` |
| जटिल परिवर्तन, कंट्रोल चाहते हैं | `/opsx:continue` |

**थंब रूल:** यदि आप पूरे स्कोप को ऊपर से वर्णन कर सकते हैं, तो `/opsx:ff` का उपयोग करें। यदि आप जा रहे हैं तो उसे फिगर आउट कर रहे हैं, तो `/opsx:continue` का उपयोग करें।

### अपडेट करने बनाम नया शुरू करने का समय

एक आम सवाल: मौजूदा परिवर्तन को अपडेट करना कब ठीक है, और कब आपको नया शुरू करना चाहिए?

**मौजूदा परिवर्तन को तब अपडेट करें जब:**

- एक ही इंटेंट, रिफाइंड एक्जीक्यूशन
- स्कोप संकुचित होता है (पहले MVP, बाद में बाकी)
- लर्निंग-ड्रिवन कॉरैक्शन्स (कोडबेस आपके उम्मीद के अनुसार नहीं है)
- इंप्लीमेंटेशन डिस्कवरी के आधार पर डिजाइन ट्वीक्स

**नया परिवर्तन तब शुरू करें जब:**

- इंटेंट मूल रूप से बदल गया
- स्कोप पूरी तरह से अलग काम में फट गया
- ओरिजिनल चेंज को स्टैंडअलोन "डन" मार्क किया जा सकता है
- पैचेस स्पष्ट करने से ज्यादा भ्रमित करेंगे

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

- ""कस्टम थीम्स का भी सपोर्ट करने की जरूरत है" → नया परिवर्तन (स्कोप फट गया)"
- ""सिस्टम प्रिफरेंस डिटेक्शन अपेक्षा से ज्यादा कठिन है" → अपडेट (एक ही इंटेंट)"
- ""चलिए पहले टॉगल शिप करें, बाद में प्रिफरेंस जोड़ें" → पहले अपडेट करें फिर आर्काइव करें, फिर नया परिवर्तन"

## बेस्ट प्रैक्टिसेज

### परिवर्तनों को फोकस्ड रखें

प्रति परिवर्तन एक लॉजिकल यूनिट ऑफ वर्क। यदि आप "फीचर X जोड़ें और साथ ही Y रीफैक्टर करें" कर रहे हैं, तो दो अलग-अलग परिवर्तनों पर विचार करें।

**यह महत्वपूर्ण क्यों है:**

- समीक्षा और समझने में आसान
- साफ आर्काइव हिस्ट्री
- स्वतंत्र रूप से शिप कर सकते हैं
- यदि जरूरी हो तो सरल रोलबैक

### अस्पष्ट रिक्वायरमेंट्स के लिए `/opsx:explore` का उपयोग करें

परिवर्तन के लिए कमिट करने से पहले, समस्या स्पेस एक्सप्लोर करें:

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

एक्सप्लोरेशन आपके आर्टिफैक्ट्स बनाने से पहले सोच को स्पष्ट करता है।

### आर्काइव करने से पहले वेरिफाई करें

इंप्लीमेंटेशन के आर्टिफैक्ट्स से मेल खाता है यह जांचने के लिए `/opsx:verify` का उपयोग करें:

```text
You: /opsx:verify

AI:  Verifying add-dark-mode...

     ✓ All tasks in tasks.md are checked
     ✓ Requirements in specs have corresponding code
     ✓ Design decisions are reflected in implementation

     Ready to archive!
```

परिवर्तन को बंद करने से पहले मिसमैच पकड़ता है।

### परिवर्तनों को स्पष्ट रूप से नाम दें

अच्छे नाम `openspec list` को उपयोगी बनाते हैं:

| अच्छा:                          | बचें: |
|--------------------------------|--------|
| add-dark-mode                  | feature-1 |
| fix-login-redirect             | update |
| optimize-product-query         | changes |
| implement-2fa                  | wip |

## कमांड त्वरित संदर्भ

कमांड की पूरी जानकारी और विकल्पों के लिए, [कमांड](commands.md) देखें।

| कमांड | उद्देश्य | कब उपयोग करें |
|---------|---------|-------------|
| `/opsx:propose` | परिवर्तन + योजना कला-निर्माण बनाएं | तेज़ डिफॉल्ट पथ (`core` प्रोफाइल) |
| `/opsx:explore` | एआई के साथ विचारों पर चिंतन करें | अनिश्चित होने पर यहां से शुरू करें: अस्पष्ट आवश्यकताएं, जांच, विकल्पों की तुलना |
| `/opsx:new` | परिवर्तन स्कैफोल्ड शुरू करें | विस्तारित मोड, स्पष्ट कला-निर्माण नियंत्रण |
| `/opsx:continue` | अगला कला-निर्माण बनाएं | विस्तारित मोड, कदम-दर-कदम कला-निर्माण बनाना |
| `/opsx:ff` | सभी योजना कला-निर्माण बनाएं | विस्तारित मोड, स्पष्ट दायरा |
| `/opsx:apply` | कार्यों को लागू करें | कोड लिखने के लिए तैयार |
| `/opsx:verify` | कार्यान्वयन को मान्य करें | विस्तारित मोड, संग्रहण से पहले |
| `/opsx:sync` | डेल्टा स्पेक को मर्ज करें | विस्तारित मोड, वैकल्पिक |
| `/opsx:archive` | परिवर्तन को पूरा करें | सभी कार्य समाप्त |
| `/opsx:bulk-archive` | कई परिवर्तनों को संग्रहित करें | विस्तारित मोड, समांतर कार्य |

## अगले कदम

- [अच्छे स्पेक लिखना](writing-specs.md) - एक मजबूत आवश्यकता और परिदृश्य कैसे दिखें, और परिवर्तन को सही आकार देना कैसे है
- [परिवर्तन की समीक्षा](reviewing-changes.md) - किसी भी कोड लिखने से पहले तैयार की गई योजना पर दो मिनट का पास
- [टीम पर ओपनस्पेक](team-workflow.md) - परिवर्तन शाखाओं और पुल रिक्वेस्ट में कैसे फिट होते हैं
- [कमांड](commands.md) - विकल्पों सहित पूर्ण कमांड संदर्भ
- [अवधारणाएं](concepts.md) - स्पेक, कला-निर्माण और स्कीमा में गहरा जानकारी
- [अनुकूलन](customization.md) - कस्टम वर्कफ़्लो बनाएं
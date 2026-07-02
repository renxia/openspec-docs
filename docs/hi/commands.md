# कमांड्स

यह OpenSpec के स्लैश कमांड्स का संदर्भ है। इन कमांड्स को आपके AI कोडिंग असिस्टेंट के चैट इंटरफ़ेस (उदाहरण के लिए, Claude Code, Cursor, Windsurf) में कॉल किया जाता है।

वर्कफ़्लो पैटर्न और प्रत्येक कमांड का उपयोग कब करना है, इसके लिए [Workflows](workflows.md) देखें। CLI कमांड्स के लिए, [CLI](cli.md) देखें।

## त्वरित संदर्भ (Quick Reference)

### डिफ़ॉल्ट त्वरित पथ (`core` प्रोफ़ाइल)

| Command | Purpose |
|---------|---------|
| `/opsx:propose` | एक ही चरण में परिवर्तन बनाएं और प्लानिंग आर्टिफैक्ट्स जनरेट करें। |
| `/opsx:explore` | किसी बदलाव को प्रतिबद्ध करने से पहले विचारों पर विचार करें। |
| `/opsx:apply` | बदलाव से कार्यों (tasks) को लागू करें। |
| `/opsx:sync` | मुख्य स्पेसिफिकेशन्स में डेल्टा स्पेसिफिकेशन्स को मर्ज करें। |
| `/opsx:archive` | एक पूर्ण हुए बदलाव को आर्काइव करें। |

### विस्तारित वर्कफ़्लो कमांड्स (Expanded Workflow Commands) (कस्टम वर्कफ़्लो चयन)

| Command | Purpose |
|---------|---------|
| `/opsx:new` | एक नया चेंज स्कैफ़ोल्ड (scaffold) शुरू करें। |
| `/opsx:continue` | निर्भरताओं (dependencies) के आधार पर अगला आर्टिफैक्ट बनाएं। |
| `/opsx:ff` | फास्ट-फ़ॉरवर्ड: एक बार में सभी प्लानिंग आर्टिफैक्ट्स बनाएं। |
| `/opsx:verify` | सत्यापित करें कि कार्यान्वयन (implementation) आर्टिफैक्ट्स से मेल खाता है। |
| `/opsx:bulk-archive` | एक बार में कई बदलावों को आर्काइव करें। |
| `/opsx:onboard` | संपूर्ण वर्कफ़्लो के माध्यम से निर्देशित ट्यूटोरियल (Guided Tutorial)। |

डिफ़ॉल्ट ग्लोबल प्रोफ़ाइल `core` है। विस्तारित वर्कफ़्लो कमांड्स को सक्षम करने के लिए, `openspec config profile` चलाएँ, वर्कफ़्लो चुनें, और फिर अपने प्रोजेक्ट में `openspec update` चलाएँ।

## कमांड संदर्भ (Command Reference)

### `/opsx:propose`

एक ही चरण में एक नया बदलाव (change) बनाएँ और प्लानिंग आर्टिफैक्ट्स (planning artifacts) उत्पन्न करें। यह `core` प्रोफ़ाइल में डिफ़ॉल्ट स्टार्ट कमांड है।

**सिंटेक्स (Syntax):**
```text
/opsx:propose [change-name-or-description]
```

**आर्गुमेंट्स (Arguments):**
| आर्गुमेंट | आवश्यक (Required) | विवरण (Description) |
|----------|--------------------|----------------------|
| `change-name-or-description` | नहीं | केबाब-केस नाम या सामान्य भाषा में बदलाव का विवरण |

**यह क्या करता है (What it does):**
- `openspec/changes/<change-name>/` बनाता है।
- कार्यान्वयन (implementation) से पहले आवश्यक आर्टिफैक्ट्स उत्पन्न करता है (जैसे कि `spec-driven`: proposal, specs, design, tasks)।
- तब तक रुकता है जब बदलाव `/opsx:apply` के लिए तैयार हो जाता है।

**उदाहरण (Example):**
```text
You: /opsx:propose add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     ✓ proposal.md
     ✓ specs/ui/spec.md
     ✓ design.md
     ✓ tasks.md
     Ready for implementation. Run /opsx:apply.
```

**टिप्स (Tips):**
- सबसे तेज़ एंड-टू-एंड पथ के लिए इसका उपयोग करें।
- यदि आप चरण-दर-चरण आर्टिफैक्ट नियंत्रण चाहते हैं, तो विस्तारित वर्कफ़्लो को सक्षम करें और `/opsx:new` + `/opsx:continue` का उपयोग करें।

---

### `/opsx:explore`

> **जब आप निश्चित न हों तो यहाँ से शुरू करें।** Explore एक नो-स्टेक्स (no-stakes) सोचने वाला साथी है: यह आपके कोडबेस को पढ़ता है, विकल्पों की तुलना करता है, और किसी भी बदलाव के होने से पहले एक अस्पष्ट विचार को एक ठोस योजना में बदल देता है। यह डिफ़ॉल्ट प्रोफ़ाइल में शामिल है। पूर्ण केस और अधिक उदाहरणों के लिए, [Explore First](explore.md) गाइड देखें।

बदलाव पर प्रतिबद्ध होने से पहले विचारों पर विचार करें, समस्याओं की जाँच करें और आवश्यकताओं को स्पष्ट करें।

**सिंटेक्स (Syntax):**
```
/opsx:explore [topic]
```

**आर्गुमेंट्स (Arguments):**
| आर्गुमेंट | आवश्यक (Required) | विवरण (Description) |
|----------|--------------------|----------------------|
| `topic` | नहीं | आप क्या एक्सप्लोर करना या जांचना चाहते हैं |

**यह क्या करता है (What it does):**
- बिना किसी संरचना की आवश्यकता के एक अन्वेषी बातचीत (exploratory conversation) शुरू करता है।
- सवालों का जवाब देने के लिए कोडबेस की जाँच करता है।
- विकल्पों और दृष्टिकोणों की तुलना करता है।
- सोचने को स्पष्ट करने के लिए विज़ुअल डायग्राम बनाता है।
- जब अंतर्दृष्टि क्रिस्टलीकृत हो जाती है तो `/opsx:propose` (डिफ़ॉल्ट) या `/opsx:new` (विस्तारित वर्कफ़्लो) पर ट्रांज़िशन कर सकता है।

**उदाहरण (Example):**
```text
You: /opsx:explore

AI:  What would you like to explore?

You: How should we handle authentication for the mobile app?

AI:  Let me investigate your current auth setup...
     [Analyzes codebase]

     I see you're using session-based auth for the web app.
     For mobile, we have three main options:

     1. JWT tokens (stateless, works offline)
     2. OAuth2 (if you need third-party login)
     3. Extend current sessions (simpler, but requires connectivity)

     Your API already has CORS configured. Which direction interests you?

You: Let's go with JWT. Can we start a change for that?

AI:  Ready when you are. Run /opsx:propose add-jwt-auth to begin.
```

**टिप्स (Tips):**
- जब आवश्यकताएँ स्पष्ट न हों या आपको जांच करने की आवश्यकता हो तो इसका उपयोग करें।
- अन्वेषण के दौरान कोई आर्टिफैक्ट नहीं बनाया जाता है।
- निर्णय लेने से पहले कई दृष्टिकोणों की तुलना करने के लिए अच्छा है।
- फ़ाइलों को पढ़ सकता है और कोडबेस में खोज कर सकता है।

---

### `/opsx:new`

एक नया बदलाव स्कैफोल्ड (scaffold) शुरू करें। यह चेंज फोल्डर बनाता है और आपको `/opsx:continue` या `/opsx:ff` के साथ आर्टिफैक्ट उत्पन्न करने की प्रतीक्षा करता है।

यह कमांड विस्तारित वर्कफ़्लो सेट का हिस्सा है (डिफ़ॉल्ट `core` प्रोफ़ाइल में शामिल नहीं है)।

**सिंटेक्स (Syntax):**
```
/opsx:new [change-name] [--schema <schema-name>]
```

**आर्गुमेंट्स (Arguments):**
| आर्गुमेंट | आवश्यक (Required) | विवरण (Description) |
|----------|--------------------|----------------------|
| `change-name` | नहीं | चेंज फोल्डर के लिए नाम (यदि प्रदान नहीं किया जाता है तो प्रॉम्प्ट किया जाएगा) |
| `--schema` | नहीं | उपयोग करने वाला वर्कफ़्लो स्कीमा (डिफ़ॉल्ट: config से या `spec-driven`) |

**यह क्या करता है (What it does):**
- `openspec/changes/<change-name>/` डायरेक्टरी बनाता है।
- चेंज फोल्डर में `.openspec.yaml` मेटाडेटा फ़ाइल बनाता है।
- निर्माण के लिए तैयार पहले आर्टिफैक्ट टेम्पलेट को दिखाता है।
- यदि प्रदान नहीं किया गया है तो चेंज नाम और स्कीमा के लिए प्रॉम्प्ट करता है।

**यह क्या बनाता है (What it creates):**
```
openspec/changes/<change-name>/
└── .openspec.yaml    # Change metadata (schema, created date)
```

**उदाहरण (Example):**
```
You: /opsx:new add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     Schema: spec-driven

     Ready to create: proposal
     Use /opsx:continue to create it, or /opsx:ff to create all artifacts.
```

**टिप्स (Tips):**
- वर्णनात्मक नामों का उपयोग करें: `add-feature`, `fix-bug`, `refactor-module`
- `update`, `changes`, `wip` जैसे सामान्य नामों से बचें।
- स्कीमा को प्रोजेक्ट कॉन्फ़िग (`openspec/config.yaml`) में भी सेट किया जा सकता है।

---

### `/opsx:continue`

निर्भरता श्रृंखला (dependency chain) में अगला आर्टिफैक्ट बनाएँ। यह क्रमिक प्रगति के लिए एक समय में एक आर्टिफैक्ट बनाता है।

**सिंटेक्स (Syntax):**
```
/opsx:continue [change-name]
```

**आर्गुमेंट्स (Arguments):**
| आर्गुमेंट | आवश्यक (Required) | विवरण (Description) |
|----------|--------------------|----------------------|
| `change-name` | नहीं | किस बदलाव को जारी रखना है (यदि प्रदान नहीं किया जाता है तो संदर्भ से अनुमानित किया जाता है) |

**यह क्या करता है (What it does):**
- आर्टिफैक्ट निर्भरता ग्राफ़ (artifact dependency graph) की जाँच करता है।
- दिखाता है कि कौन से आर्टिफैक्ट तैयार हैं बनाम अवरुद्ध (blocked)।
- पहले तैयार आर्टिफैक्ट को बनाता है।
- संदर्भ के लिए निर्भरता फ़ाइलों को पढ़ता है।
- बताता है कि निर्माण के बाद क्या उपलब्ध हो जाता है।

**उदाहरण (Example):**
```
You: /opsx:continue

AI:  Change: add-dark-mode

     Artifact status:
     ✓ proposal    (done)
     ◆ specs       (ready)
     ◆ design      (ready)
     ○ tasks       (blocked - needs: specs)

     Creating specs...

     [Reads proposal.md, creates specs based on requirements]

     ✓ Created openspec/changes/add-dark-mode/specs/ui/spec.md

     Now available: tasks
     Run /opsx:continue to create the next artifact.
```

**टिप्स (Tips):**
- जब आप आगे बढ़ने से पहले प्रत्येक आर्टिफैक्ट की समीक्षा करना चाहते हैं तो इसका उपयोग करें।
- जटिल बदलावों के लिए अच्छा है जहाँ आप नियंत्रण चाहते हैं।
- एक साथ कई आर्टिफैक्ट तैयार हो सकते हैं।
- जारी रखने से पहले आप बनाए गए आर्टिफैक्ट को संपादित कर सकते हैं।

---

### `/opsx:ff`

आर्टिफैक्ट निर्माण में फास्ट-फॉरवर्ड (Fast-forward) करें। सभी प्लानिंग आर्टिफैक्ट्स एक बार में बनाते हैं।

**सिंटेक्स (Syntax):**
```
/opsx:ff [change-name]
```

**आर्गुमेंट्स (Arguments):**
| आर्गुमेंट | आवश्यक (Required) | विवरण (Description) |
|----------|--------------------|----------------------|
| `change-name` | नहीं | किस बदलाव को फास्ट-फॉरवर्ड करना है (यदि प्रदान नहीं किया जाता है तो संदर्भ से अनुमानित किया जाता है) |

**यह क्या करता है (What it does):**
- निर्भरता क्रम में सभी आर्टिफैक्ट्स बनाता है।
- टूडू लिस्ट के माध्यम से प्रगति को ट्रैक करता है।
- तब तक रुकता है जब तक कि सभी `apply-required` आर्टिफैक्ट पूरे नहीं हो जाते।
- अगला आर्टिफैक्ट बनाने से पहले प्रत्येक निर्भरता को पढ़ता है।

**उदाहरण (Example):**
```
You: /opsx:ff add-dark-mode

AI:  Fast-forwarding add-dark-mode...

     ✓ Creating proposal.md
     ✓ Creating specs/ui/spec.md
     ✓ Creating design.md
     ✓ Creating tasks.md

     All planning artifacts complete!
     Ready for implementation. Run /opsx:apply to begin.
```

**टिप्स (Tips):**
- जब आपके पास यह स्पष्ट तस्वीर हो कि आप क्या बना रहे हैं तो इसका उपयोग करें।
- सीधे बदलावों के लिए `/opsx:continue` से तेज़ है।
- आप बाद में अभी भी आर्टिफैक्ट को संपादित कर सकते हैं।
- छोटे से मध्यम आकार की सुविधाओं (features) के लिए अच्छा है।

---

### `/opsx:apply`

बदलाव से कार्यों (tasks) को कार्यान्वित करें। यह कार्य सूची पर काम करता है, कोड लिखता है और आइटमों को चिह्नित करता है।

**सिंटेक्स (Syntax):**
```
/opsx:apply [change-name]
```

**आर्गुमेंट्स (Arguments):**
| आर्गुमेंट | आवश्यक (Required) | विवरण (Description) |
|----------|--------------------|----------------------|
| `change-name` | नहीं | किस बदलाव को कार्यान्वित करना है (यदि प्रदान नहीं किया जाता है तो संदर्भ से अनुमानित किया जाता है) |

**यह क्या करता है (What it does):**
- `tasks.md` को पढ़ता है और अधूरे कार्यों की पहचान करता है।
- एक-एक करके कार्यों पर काम करता है।
- कोड लिखता है, फाइलें बनाता है, आवश्यकतानुसार परीक्षण चलाता है।
- चेकबॉक्स `[x]` के साथ कार्यों को पूरा चिह्नित करता है।

**उदाहरण (Example):**
```
You: /opsx:apply

AI:  Implementing add-dark-mode...

     Reading tasks.md:
     - [ ] 1.1 Create ThemeContext
     - [ ] 1.2 Add CSS custom properties
     - [ ] 1.3 Implement localStorage persistence

     Working on 1.1: Create ThemeContext...
     [Creates src/context/ThemeContext.tsx]

     ✓ 1.1 Complete

     Working on 1.2: Add CSS custom properties...
     [Updates src/styles/globals.css]

     ✓ 1.2 Complete
     ...
```

**टिप्स (Tips):**
- यदि बाधित हो जाए तो यह वहीं से फिर से शुरू कर सकता है।
- बदलाव के नाम को निर्दिष्ट करके समानांतर बदलावों (parallel changes) के लिए उपयोग करें।
- पूर्णता की स्थिति `tasks.md` चेकबॉक्स में ट्रैक की जाती है।

---

### `/opsx:verify`

सत्यापित करें कि कार्यान्वयन आपके चेंज आर्टिफैक्ट्स से मेल खाता है। यह पूर्णता, शुद्धता और सुसंगति (coherence) की जाँच करता है।

**सिंटेक्स (Syntax):**
```
/opsx:verify [change-name]
```

**आर्गुमेंट्स (Arguments):**
| आर्गुमेंट | आवश्यक (Required) | विवरण (Description) |
|----------|--------------------|----------------------|
| `change-name` | नहीं | किस बदलाव को सत्यापित करना है (यदि प्रदान नहीं किया जाता है तो संदर्भ से अनुमानित किया जाता है) |

**यह क्या करता है (What it does):**
- कार्यान्वयन की तीन आयामों की जाँच करता है।
- कार्यान्वयन साक्ष्य के लिए कोडबेस में खोज करता है।
- मुद्दों की रिपोर्ट करता है जिन्हें CRITICAL, WARNING, या SUGGESTION के रूप में वर्गीकृत किया जाता है।
- आर्काइव को अवरुद्ध नहीं करता है, लेकिन मुद्दों को सामने लाता है।

**सत्यापन आयाम (Verification dimensions):**

| आयाम | यह क्या सत्यापित करता है |
|-----------|-------------------|
| **Completeness** | सभी कार्य पूरे हैं, सभी आवश्यकताएँ कार्यान्वित की गई हैं, परिदृश्य कवर किए गए हैं |
| **Correctness** | कार्यान्वयन स्पेसिफिकेशन के इरादे से मेल खाता है, एज केस (edge cases) संभाले गए हैं |
| **Coherence** | डिज़ाइन निर्णय कोड में परिलक्षित होते हैं, पैटर्न सुसंगत हैं |

**उदाहरण (Example):**
```
You: /opsx:verify

AI:  Verifying add-dark-mode...

     COMPLETENESS
     ✓ All 8 tasks in tasks.md are checked
     ✓ All requirements in specs have corresponding code
     ⚠ Scenario "System preference detection" has no test coverage

     CORRECTNESS
     ✓ Implementation matches spec intent
     ✓ Edge cases from scenarios are handled
     ✓ Error states match spec definitions

     COHERENCE
     ✓ Design decisions reflected in code structure
     ✓ Naming conventions consistent with design.md
     ⚠ Design mentions "CSS variables" but implementation uses Tailwind classes

     SUMMARY
     ─────────────────────────────
     Critical issues: 0
     Warnings: 2
     Ready to archive: Yes (with warnings)

     Recommendations:
     1. Add test for system preference detection
     2. Update design.md to reflect Tailwind usage, or refactor to use CSS variables
```

**टिप्स (Tips):**
- जल्द पता लगाने के लिए आर्काइव करने से पहले चलाएँ।
- चेतावनी आर्काइव को अवरुद्ध नहीं करती हैं लेकिन संभावित मुद्दों का संकेत देती हैं।
- प्रतिबद्ध होने से पहले AI के काम की समीक्षा करने के लिए अच्छा है।
- आर्टिफैक्ट और कार्यान्वयन के बीच विचलन (drift) प्रकट कर सकता है।

---

### `/opsx:sync`

**वैकल्पिक कमांड।** एक बदलाव से डेल्टा स्पेसिफिकेशन्स (delta specs) को मुख्य स्पेसिफिकेशन्स में मर्ज करें। यदि आवश्यक हो तो आर्काइव प्रॉम्प्ट करेगा, इसलिए आमतौर पर आपको इसे मैन्युअल रूप से चलाने की आवश्यकता नहीं होती है।

**सिंटेक्स (Syntax):**
```
/opsx:sync [change-name]
```

**आर्गुमेंट्स (Arguments):**
| आर्गुमेंट | आवश्यक (Required) | विवरण (Description) |
|----------|--------------------|----------------------|
| `change-name` | नहीं | किस बदलाव को सिंक करना है (यदि प्रदान नहीं किया जाता है तो संदर्भ से अनुमानित किया जाता है) |

**यह क्या करता है (What it does):**
- चेंज फोल्डर से डेल्टा स्पेसिफिकेशन्स को पढ़ता है।
- ADDED/MODIFIED/REMOVED/RENAMED सेक्शन का पार्स करता है।
- परिवर्तनों को मुख्य `openspec/specs/` डायरेक्टरी में मर्ज करता है।
- डेल्टा में उल्लेखित न होने वाले मौजूदा कंटेंट को संरक्षित रखता है।
- बदलाव को आर्काइव नहीं करता है (सक्रिय रहता है)।

**उदाहरण (Example):**
```text
You: /opsx:sync

AI:  Syncing add-dark-mode delta specs...

     Reading: openspec/changes/add-dark-mode/specs/ui/spec.md
     Target:  openspec/specs/ui/spec.md

     Changes to apply:
     ✓ ADDED: Theme Selection requirement (2 scenarios)
     ✓ ADDED: Accessibility requirement (1 scenario)

     Merging...
     ✓ openspec/specs/ui/spec.md updated

     Change remains active. Run /opsx:archive when ready to complete.
```

**मैन्युअल रूप से कब उपयोग करें (When to use manually):**

| परिदृश्य (Scenario) | सिंक का उपयोग करें? |
|----------|-----------|
| लंबे समय तक चलने वाला बदलाव, आर्काइव करने से पहले मुख्य में स्पेसिफिकेशन्स चाहते हैं | हाँ |
| कई समानांतर बदलावों को अद्यतन आधार स्पेसिफिकेशन्स की आवश्यकता है | हाँ |
| मर्ज की समीक्षा/पूर्वावलोकन करना चाहते हैं | हाँ |
| त्वरित बदलाव, सीधे आर्काइव पर जा रहे हैं | नहीं (आर्काइव इसे संभालता है) |

**टिप्स (Tips):**
- सिंक इंटेलिजेंट होता है, कॉपी-पेस्ट नहीं।
- बिना डुप्लिकेट किए मौजूदा आवश्यकताओं में परिदृश्य जोड़ सकता है।
- सिंक के बाद बदलाव सक्रिय रहता है (आर्काइव नहीं किया जाता)।
- अधिकांश उपयोगकर्ताओं को इसे सीधे कॉल करने की आवश्यकता कभी नहीं होगी—आवश्यकता होने पर आर्काइव प्रॉम्प्ट करता है।

---

### `/opsx:archive`

एक पूर्ण हुए बदलाव को आर्काइव करें। यह बदलाव को अंतिम रूप देता है और इसे आर्काइव फोल्डर में ले जाता है।

**सिंटेक्स (Syntax):**
```
/opsx:archive [change-name]
```

**आर्गुमेंट्स (Arguments):**
| आर्गुमेंट | आवश्यक (Required) | विवरण (Description) |
|----------|--------------------|----------------------|
| `change-name` | नहीं | किस बदलाव को आर्काइव करना है (यदि प्रदान नहीं किया जाता है तो संदर्भ से अनुमानित किया जाता है) |

**यह क्या करता है (What it does):**
- आर्टिफैक्ट पूर्णता स्थिति की जाँच करता है।
- कार्य पूर्णता की जाँच करता है (अधूरे होने पर चेतावनी देता है)।
- यदि पहले से सिंक नहीं किया गया है तो डेल्टा स्पेसिफिकेशन्स को सिंक करने की पेशकश करता है।
- चेंज फोल्डर को `openspec/changes/archive/YYYY-MM-DD-<name>/` में ले जाता है।
- ऑडिट ट्रेल के लिए सभी आर्टिफैक्ट्स को संरक्षित रखता है।

**उदाहरण (Example):**
```text
You: /opsx:archive

AI:  Archiving add-dark-mode...

     Artifact status:
     ✓ proposal.md exists
     ✓ specs/ exists
     ✓ design.md exists
     ✓ tasks.md exists (8/8 tasks complete)

     Delta specs: Not yet synced
     → Sync now? (recommended)

You: Yes

AI:  ✓ Synced specs to openspec/specs/ui/spec.md
     ✓ Moved to openspec/changes/archive/2025-01-24-add-dark-mode/

     Change archived successfully.
```

**टिप्स (Tips):**
- आर्काइव अधूरे कार्यों पर ब्लॉक नहीं होगा, लेकिन चेतावनी देगा।
- डेल्टा स्पेसिफिकेशन्स को आर्काइव के दौरान या पहले सिंक किया जा सकता है।
- आर्काइव किए गए बदलाव इतिहास के लिए संरक्षित रहते हैं।
- मुद्दों को पकड़ने के लिए पहले `/opsx:verify` चलाएँ।

---

### `/opsx:bulk-archive`

एक साथ में कई पूर्ण हुए बदलावों को आर्काइव करें। यह बदलावों के बीच स्पेसिफिकेशन संघर्षों (spec conflicts) को संभालता है।

**सिंटेक्स (Syntax):**
```
/opsx:bulk-archive [change-names...]
```

**आर्गुमेंट्स (Arguments):**
| आर्गुमेंट | आवश्यक (Required) | विवरण (Description) |
|----------|--------------------|----------------------|
| `change-names` | नहीं | आर्काइव करने के लिए विशिष्ट बदलाव (यदि प्रदान नहीं किया जाता है तो चयन करने के लिए प्रॉम्प्ट करता है) |

**यह क्या करता है (What it does):**
- सभी पूर्ण हुए बदलावों को सूचीबद्ध करता है।
- आर्काइव करने से पहले प्रत्येक बदलाव का सत्यापन करता है।
- बदलावों में स्पेसिफिकेशन संघर्षों का पता लगाता है।
- वास्तव में कार्यान्वित किए गए चीजों की जाँच करके संघर्षों को हल करता है।
- कालानुक्रमिक क्रम (chronological order) में आर्काइव करता है।

**उदाहरण (Example):**
```
You: /opsx:bulk-archive

AI:  Found 3 completed changes:
     - add-dark-mode (8/8 tasks complete)
     - fix-login-bug (3/3 tasks complete)
     - update-footer (2/2 tasks complete)

     Checking for spec conflicts...
     ⚠ add-dark-mode and update-footer both touch specs/ui/

     Inspecting codebase to resolve...
     Both changes are implemented. Will merge in chronological order:
     1. add-dark-mode (created Jan 20)
     2. update-footer (created Jan 22)

     Archive all 3 changes?

You: Yes

AI:  ✓ Archived add-dark-mode
     ✓ Archived fix-login-bug
     ✓ Archived update-footer
     Specs merged: add-dark-mode → update-footer
```

**टिप्स (Tips):**
- समानांतर कार्य स्ट्रीम्स (parallel work streams) के लिए अच्छा है।
- संघर्ष समाधान एजेंटिक होता है (कोडबेस की जाँच करता है)।
- बदलाव निर्माण के क्रम में आर्काइव किए जाते हैं।
- स्पेसिफिकेशन सामग्री को ओवरराइट करने से पहले प्रॉम्प्ट करता है।

---

### `/opsx:onboard`

संपूर्ण OpenSpec वर्कफ़्लो के माध्यम से निर्देशित ऑनबोर्डिंग (Guided onboarding)। आपके वास्तविक कोडबेस का उपयोग करके एक इंटरैक्टिव ट्यूटोरियल।

**सिंटेक्स (Syntax):**
```
/opsx:onboard
```

**यह क्या करता है (What it does):**
- कथन (narration) के साथ संपूर्ण वर्कफ़्लो चक्र के माध्यम से चलता है।
- वास्तविक सुधार अवसरों के लिए आपके कोडबेस को स्कैन करता है।
- एक वास्तविक बदलाव बनाता है जिसमें वास्तविक आर्टिफैक्ट्स होते हैं।
- वास्तविक कार्य कार्यान्वित करता है (छोटे, सुरक्षित बदलाव)।
- पूर्ण हुए बदलाव को आर्काइव करता है।
- जैसे ही यह होता है, प्रत्येक चरण की व्याख्या करता है।

**चरण (Phases):**
1. स्वागत और कोडबेस विश्लेषण (Welcome and codebase analysis)
2. एक सुधार अवसर ढूँढना (Finding an improvement opportunity)
3. एक बदलाव बनाना (`/opsx:new`)
4. प्रस्ताव लिखना (Writing the proposal)
5. स्पेसिफिकेशन्स बनाना (Creating specs)
6. डिज़ाइन लिखना (Writing the design)
7. कार्य बनाना (Creating tasks)
8. कार्यों को कार्यान्वित करना (`/opsx:apply`)
9. कार्यान्वयन का सत्यापन करना (Verifying implementation)
10. बदलाव को आर्काइव करना (Archiving the change)
11. सारांश और अगले कदम (Summary and next steps)

**उदाहरण (Example):**
```
You: /opsx:onboard

AI:  Welcome to OpenSpec!

     I'll walk you through the complete workflow using your actual codebase.
     We'll find something small to improve, create a proper change for it,
     implement it, and archive it.

     Let me scan your codebase for opportunities...

     [Analyzes codebase]

     I found a few things we could work on:
     1. Add input validation to the contact form
     2. Improve error messages in the auth flow
     3. Add loading states to async buttons

     Which interests you? (or suggest something else)
```

**टिप्स (Tips):**
- वर्कफ़्लो सीखने वाले नए उपयोगकर्ताओं के लिए सबसे अच्छा है।
- वास्तविक कोड का उपयोग करता है, खिलौनेनुमा उदाहरणों (toy examples) का नहीं।
- एक वास्तविक बदलाव बनाता है जिसे आप रख सकते हैं या खारिज कर सकते हैं।
- पूरा करने में 15-30 मिनट लगते हैं।

## AI टूल द्वारा कमांड सिंटैक्स

विभिन्न AI टूल्स थोड़े अलग कमांड सिंटैक्स का उपयोग करते हैं। अपने टूल से मेल खाने वाले फॉर्मेट का उपयोग करें:

| टूल | सिंटैक्स उदाहरण |
|------|----------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| Kimi CLI | Skill-based invocations such as `/skill:openspec-propose`, `/skill:openspec-apply-change` (no generated `opsx-*` command files) |
| Trae | Skill-based invocations such as `/openspec-propose`, `/openspec-apply-change` (no generated `opsx-*` command files) |

सभी टूल्स में इरादा (intent) समान है, लेकिन कमांड को कैसे प्रस्तुत किया जाता है यह इंटीग्रेशन के आधार पर भिन्न हो सकता है।

> **नोट:** GitHub Copilot कमांड्स (.github/prompts/*.prompt.md) केवल IDE एक्सटेंशन (VS Code, JetBrains, Visual Studio) में उपलब्ध हैं। GitHub Copilot CLI वर्तमान में कस्टम प्रॉम्प्ट फ़ाइलों का समर्थन नहीं करता है — विवरण और वर्कअराउंड के लिए [Supported Tools](supported-tools.md) देखें।

---

## लेगेसी कमांड्स

ये कमांड पुराने "एक साथ सब कुछ" (all-at-once) वर्कफ़्लो का उपयोग करते हैं। वे अभी भी काम करते हैं, लेकिन OPSX कमांड्स की सिफारिश की जाती है।

| कमांड | यह क्या करता है |
|---------|--------------|
| `/openspec:proposal` | एक ही बार में सभी आर्टिफैक्ट बनाना (प्रस्ताव, स्पेसिफिकेशन्स, डिज़ाइन, कार्य) |
| `/openspec:apply` | परिवर्तन को लागू करना |
| `/openspec:archive` | परिवर्तन को आर्काइव करना |

**लेगेसी कमांड्स का उपयोग कब करें:**
- पुराने वर्कफ़्लो का उपयोग करने वाली मौजूदा परियोजनाएं
- साधारण परिवर्तन जहाँ आपको वृद्धिशील (incremental) आर्टिफैक्ट निर्माण की आवश्यकता नहीं है
- ऑल-ऑर-नथिंग दृष्टिकोण की प्राथमिकता

**OPSX पर माइग्रेट करना:**
लेगेसी परिवर्तनों को OPSX कमांड्स के साथ जारी रखा जा सकता है। आर्टिफैक्ट संरचना संगत (compatible) है।

---

## समस्या निवारण (Troubleshooting)

### "Change not found"

कमांड यह निर्धारित नहीं कर सका कि किस परिवर्तन पर काम करना है।

**समाधान:**
- स्पष्ट रूप से परिवर्तन का नाम निर्दिष्ट करें: `/opsx:apply add-dark-mode`
- जांचें कि परिवर्तन फ़ोल्डर मौजूद है: `openspec list`
- सत्यापित करें कि आप सही प्रोजेक्ट डायरेक्टरी में हैं

### "No artifacts ready"

सभी आर्टिफैक्ट या तो पूरे हैं या लापता निर्भरताओं (missing dependencies) के कारण अवरुद्ध (blocked) हैं।

**समाधान:**
- यह देखने के लिए `openspec status --change <name>` चलाएँ कि क्या रोक रहा है
- जांचें कि आवश्यक आर्टिफैक्ट मौजूद हैं
- पहले लापता निर्भरता वाले आर्टिफैक्ट बनाएं

### "Schema not found"

निर्दिष्ट स्कीमा मौजूद नहीं है।

**समाधान:**
- उपलब्ध स्कीमा सूचीबद्ध करें: `openspec schemas`
- स्कीमा नाम की वर्तनी (spelling) की जाँच करें
- यदि यह कस्टम है तो स्कीमा बनाएं: `openspec schema init <name>`

### कमांड्स को नहीं पहचाना गया

AI टूल OpenSpec कमांड्स को नहीं पहचानता है।

**समाधान:**
- सुनिश्चित करें कि OpenSpec आरंभ (initialized) है: `openspec init`
- स्किल्स को पुनर्जीवित करें: `openspec update`
- जांचें कि `.claude/skills/` डायरेक्टरी मौजूद है (Claude Code के लिए)
- नए स्किल्स को पहचानने के लिए अपने AI टूल को रीस्टार्ट करें

### आर्टिफैक्ट्स ठीक से जनरेट नहीं हो रहे हैं

AI अधूरे या गलत आर्टिफैक्ट बनाता है।

**समाधान:**
- `openspec/config.yaml` में प्रोजेक्ट संदर्भ जोड़ें
- विशिष्ट मार्गदर्शन के लिए प्रति-आर्टिफैक्ट नियम (per-artifact rules) जोड़ें
- अपने परिवर्तन विवरण में अधिक विवरण प्रदान करें
- अधिक नियंत्रण के लिए `/opsx:ff` के बजाय `/opsx:continue` का उपयोग करें

---

## अगले कदम (Next Steps)

- [Workflows](workflows.md) - सामान्य पैटर्न और प्रत्येक कमांड का उपयोग कब करना है
- [CLI](cli.md) - प्रबंधन और सत्यापन के लिए टर्मिनल कमांड्स
- [Customization](customization.md) - कस्टम स्कीमा और वर्कफ़्लो बनाना
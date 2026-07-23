# अवधारणाएँ

यह गाइड ओपनस्पेक के पीछे के मुख्य विचारों और उनके एक साथ कैसे फिट होने की व्याख्या करता है। व्यावहारिक उपयोग के लिए, [Getting Started](getting-started.md) और [Workflows](workflows.md) देखें।

## दर्शन

ओपनस्पेक चार सिद्धांतों पर आधारित है:

```
तरल न कठोर         — कोई फेज गेट नहीं, जो काम के लिए उपयुक्त हो उस पर काम करें
पुनरावृत्त न वॉटरफॉल — बनाते-बनाते सीखें, चलते-चलते सुधार करें
आसान न जटिल        — हल्का सेटअप, न्यूनतम औपचारिकता
brownfield-first        — केवल ग्रीनफील्ड नहीं, मौजूदा कोडबेस के साथ काम करता है
```

### ये सिद्धांत क्यों महत्वपूर्ण हैं

**तरल न कठोर.** पारंपरिक विशिष्टता प्रणालियाँ आपको फेजों में बंध कर देती हैं: पहले आप योजना बनाते हैं, फिर आप इंप्लीमेंट करते हैं, फिर कार्य समाप्त हो जाता है। ओपनस्पेक अधिक लचीला है — आप अपने कार्य के लिए उपयुक्त किसी भी क्रम में आर्टिफैक्ट बना सकते हैं।

**पुनरावृत्त न वॉटरफॉल.** आवश्यकताएँ बदलती रहती हैं। समझ गहराती रहती है। शुरुआत में अच्छा दिखने वाला तरीका कोडबेस देखने के बाद वैध नहीं रह सकता है। ओपनस्पेक इस वास्तविकता को अपनाता है।

**आसान न जटिल.** कुछ विशिष्टता फ्रेमवर्क्स व्यापक सेटअप, कठोर फॉर्मेट या भारी प्रक्रियाओं की आवश्यकता होती है। ओपनस्पेक आपके रास्ते में नहीं आता। सेकंडों में इनिशियलाइज़ करें, तुरंत काम शुरू करें, केवल तब कस्टमाइज़ करें जब आपको जरूरत हो।

**Brownfield-first.** अधिकांश सॉफ्टवेयर कार्य शून्य से निर्माण नहीं होता है — यह मौजूदा सिस्टमों को संशोधित करना है। ओपनस्पेक का डेल्टा-आधारित तरीका मौजूदा व्यवहार में बदलावों को निर्दिष्ट करना आसान बनाता है, केवल नए सिस्टम का वर्णन नहीं करता है।

## समग्र दृष्टिकोण

OpenSpec आपके काम को दो मुख्य क्षेत्रों में व्यवस्थित करता है:

```
┌────────────────────────────────────────────────────────────────────┐
│                        openspec/                                   │
│                                                                    │
│   ┌─────────────────────┐      ┌───────────────────────────────┐   │
│   │       specs/        │      │         changes/              │   │
│   │                     │      │                               │   │
│   │  Source of truth    │◄─────│  Proposed modifications       │   │
│   │  How your system    │ merge│  Each change = one folder     │   │
│   │  currently works    │      │  Contains artifacts + deltas  │   │
│   │                     │      │                               │   │
│   └─────────────────────┘      └───────────────────────────────┘   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**स्पेक्स** सत्य का मूल स्रोत हैं — ये बताते हैं कि आपका सिस्टम वर्तमान में कैसे कार्य करता है।

**चेंजेस** प्रस्तावित संशोधन हैं — ये अलग-अलग फोल्डर में तब तक रहते हैं जब तक आप उन्हें मर्ज करने के लिए तैयार नहीं हो जाते।

यह अलगाव ही मुख्य बात है। आप कई चेंजेस को समानांतर में काम कर सकते हैं बिना किसी टकराव के। आप मुख्य स्पेक्स को प्रभावित करने से पहले किसी चेंज की समीक्षा कर सकते हैं। और जब आप किसी चेंज को आर्काइव करते हैं, तो उसके डेल्टा सत्य के मूल स्रोत में साफ-सुथरे मर्ज हो जाते हैं।

## स्पेक्स

स्पेक्स संरचित आवश्यकताओं और परिदृश्यों का उपयोग करके आपके सिस्टम के व्यवहार का वर्णन करते हैं।

### संरचना

```
openspec/specs/
├── auth/
│   └── spec.md           # Authentication behavior
├── payments/
│   └── spec.md           # Payment processing
├── notifications/
│   └── spec.md           # Notification system
└── ui/
    └── spec.md           # UI behavior and themes
```

अपने सिस्टम के लिए उपयुक्त तर्कसंगत समूहों के आधार पर स्पेक्स को व्यवस्थित करें। सामान्य पैटर्न:

- **फीचर एरिया के अनुसार**: `auth/`, `payments/`, `search/`
- **कॉम्पोनेंट के अनुसार**: `api/`, `frontend/`, `workers/`
- **बाउंडेड कॉन्टेक्स्ट के अनुसार**: `ordering/`, `fulfillment/`, `inventory/`

### स्पेक फॉर्मेट

एक स्पेक में आवश्यकताएं होती हैं, और प्रत्येक आवश्यकता के परिदृश्य होते हैं:

```markdown
# Auth Specification

## Purpose
Authentication and session management for the application.

## Requirements

### Requirement: User Authentication
The system SHALL issue a JWT token upon successful login.

#### Scenario: Valid credentials
- GIVEN a user with valid credentials
- WHEN the user submits login form
- THEN a JWT token is returned
- AND the user is redirected to dashboard

#### Scenario: Invalid credentials
- GIVEN invalid credentials
- WHEN the user submits login form
- THEN an error message is displayed
- AND no token is issued

### Requirement: Session Expiration
The system MUST expire sessions after 30 minutes of inactivity.

#### Scenario: Idle timeout
- GIVEN an authenticated session
- WHEN 30 minutes pass without activity
- THEN the session is invalidated
- AND the user must re-authenticate
```

**मुख्य तत्व:**

| तत्व | उद्देश्य |
|---------|---------|
| `## Purpose` | इस स्पेक के डोमेन का उच्च स्तरीय विवरण |
| `### Requirement:` | सिस्टम को होना अनिवार्य है वह एक विशिष्ट व्यवहार |
| `#### Scenario:` | आवश्यकता के कार्य में एक ठोस उदाहरण |
| SHALL/MUST/SHOULD | आवश्यकता के मजबूती को इंगित करने वाले RFC 2119 कीवर्ड्स |

### स्पेक्स को इस तरह संरचित करने का कारण

**आवश्यकताएं "क्या" हैं** — ये बिना कार्यान्वयन की विशिष्टता किए बताते हैं कि सिस्टम को क्या करना चाहिए।

**परिदृश्य "कब" हैं** — ये ठोस उदाहरण प्रदान करते हैं जिनकी सत्यापन की जा सकती है। अच्छे परिदृश्य:
- परीक्षण योग्य हों (आप उनके लिए एक स्वचालित परीक्षण लिख सकते हैं)
- हैपी पाथ और एज केस दोनों को कवर करें
- Given/When/Then या समान संरचित फॉर्मेट का उपयोग करें

**RFC 2119 कीवर्ड्स** (SHALL, MUST, SHOULD, MAY) इरादे को संप्रेषित करते हैं:
- **MUST/SHALL** — पूर्ण अनिवार्य आवश्यकता
- **SHOULD** — अनुशंसित, लेकिन अपवाद मौजूद हैं
- **MAY** — वैकल्पिक

### स्पेक क्या है (और क्या नहीं)

स्पेक एक **व्यवहार अनुबंध** है, कार्यान्वयन योजना नहीं।

अच्छे स्पेक की सामग्री:
- उपयोगकर्ताओं या डाउनस्ट्रीम सिस्टम्स द्वारा निर्भरता व्यक्त की जाने वाला देखने योग्य व्यवहार
- इनपुट, आउटपुट और त्रुटि स्थितियां
- बाह्य बाधाएं (सुरक्षा, गोपनीयता, विश्वसनीयता, संगतता)
- परीक्षित या स्पष्ट रूप से सत्यापित किए जा सकने वाले परिदृश्य

स्पेक्स में इनसे बचें:
- आंतरिक क्लास/फंक्शन नाम
- लाइब्रेरी या फ्रेमवर्क का चयन
- चरणबद्ध कार्यान्वयन विवरण
- विस्तृत कार्यान्वयन योजनाएं (ये `design.md` या `tasks.md` में होती हैं)

त्वरित परीक्षण:
- यदि कार्यान्वयन को बाहरी रूप से दिखने वाले व्यवहार को बदले बिना बदला जा सकता है, तो संभवतः यह स्पेक में शामिल नहीं होना चाहिए।

### इसे हल्का रखें: क्रमिक कठोरता

OpenSpec नौकरशाही से बचने का लक्ष्य रखता है। उस सबसे हल्के स्तर का उपयोग करें जो फिर भी चेंज को सत्यापन योग्य बनाता हो।

**लाइट स्पेक (डिफॉल्ट):**
- छोटे व्यवहार-प्रथम आवश्यकताएं
- स्पष्ट दायरा और गैर-लक्ष्य
- कुछ ठोस स्वीकृति जांचें

**फुल स्पेक (उच्च जोखिम के लिए):**
- क्रॉस-टीम या क्रॉस-रेपो चेंजेस
- API/कॉन्ट्रैक्ट बदलाव, माइग्रेशन, सुरक्षा/गोपनीयता संबंधी चिंताएं
- ऐसे बदलाव जहां अनिश्चितता से महंगे फिर से काम करने का खतरा हो

अधिकांश चेंजेस लाइट मोड में ही रहनी चाहिए।

### मानव + एजेंट सहयोग

कई टीमों में, मानव अन्वेषण करते हैं और एजेंट कलाकृतियों का मसौदा तैयार करते हैं। इच्छित लूप यह है:
1. मानव इरादा, संदर्भ और बाधाएं प्रदान करता है।
2. एजेंट इसे व्यवहार-प्रथम आवश्यकताओं और परिदृश्यों में परिवर्तित करता है।
3. एजेंट कार्यान्वयन विवरण को `design.md` और `tasks.md` में रखता है, `spec.md` में नहीं।
4. कार्यान्वयन से पहले सत्यापन संरचना और स्पष्टता की पुष्टि करता है।

यह स्पेक्स को मानवों के लिए पठनीय और एजेंट के लिए संगत बनाए रखता है।

## चेंजेस

एक चेंज आपके सिस्टम का एक प्रस्तावित संशोधन है, जिसे समझने और कार्यान्वयन करने के लिए जरूरी सभी चीजों के साथ एक फोल्डर के रूप में पैक किया गया है।

### चेंज संरचना

```
openspec/changes/add-dark-mode/
├── proposal.md           # Why and what
├── design.md             # How (technical approach)
├── tasks.md              # Implementation checklist
├── .openspec.yaml        # Change metadata (optional): schema, created, skip_specs
└── specs/                # Delta specs
    └── ui/
        └── spec.md       # What's changing in ui/spec.md
```

प्रत्येक चेंज स्वयं में पूर्ण होती है। इसमें होता है:
- **कलाकृतियां** — इरादा, डिजाइन और कार्यों को कैप्चर करने वाले दस्तावेज
- **डेल्टा स्पेक्स** — जो जोड़ा, संशोधित या हटाया जा रहा है उनके लिए विनिर्देश
- **मेटाडेटा** — इस विशिष्ट चेंज के लिए वैकल्पिक कॉन्फ़िगरेशन

### चेंजेस को फोल्डर में क्यों रखा जाता है

किसी चेंज को फोल्डर के रूप में पैक करने के कई फायदे हैं:
1. **सभी कुछ एक साथ।** प्रस्ताव, डिजाइन, कार्य और स्पेक्स एक ही जगह रहते हैं। अलग-अलग स्थानों में खोजने की जरूरत नहीं।
2. **समानांतर कार्य।** कई चेंजेस एक साथ मौजूद रह सकते हैं बिना टकराव के। `fix-auth-bug` भी प्रगति पर होने के दौरान `add-dark-mode` पर काम करें।
3. **साफ इतिहास।** आर्काइव होने पर, चेंजेस अपना पूरा संदर्भ बनाए रखते हुए `changes/archive/` में चली जाती हैं। आप पीछे देखकर केवल यह नहीं समझ सकते कि क्या बदला, बल्कि क्यों बदला भी समझ सकते हैं।
4. **समीक्षा-फ्रेंडली।** एक चेंज फोल्डर की समीक्षा करना आसान है — इसे खोलें, प्रस्ताव पढ़ें, डिजाइन की जांच करें, स्पेक डेल्टा देखें।

## कलाकृतियां

कलाकृतियां उन दस्तावेजों हैं जो काम का मार्गदर्शन करती हैं जो किसी चेंज के अंदर होती हैं।

### कलाकृति फ्लो

```
proposal ──────► specs ──────► design ──────► tasks ──────► implement
    │               │             │              │
   why            what           how          steps
 + scope        changes       approach      to take
```

कलाकृतियां एक दूसरे पर आधारित होती हैं। प्रत्येक कलाकृति अगली के लिए संदर्भ प्रदान करती है।

### कलाकृति प्रकार

#### प्रस्ताव (`proposal.md`)

प्रस्ताव उच्च स्तर पर **इरादा**, **दायरा** और **पद्धति** को कैप्चर करता है।

```markdown
# Proposal: Add Dark Mode

## Intent
Users have requested a dark mode option to reduce eye strain
during nighttime usage and match system preferences.

## Scope
In scope:
- Theme toggle in settings
- System preference detection
- Persist preference in localStorage

Out of scope:
- Custom color themes (future work)
- Per-page theme overrides

## Approach
Use CSS custom properties for theming with a React context
for state management. Detect system preference on first load,
allow manual override.
```

**प्रस्ताव को कब अपडेट करें:**
- दायरे में बदलाव (संकुचन या विस्तार)
- इरादा स्पष्ट होता है (समस्या की बेहतर समझ)
- पद्धति में मूलभूत बदलाव

#### स्पेक्स (`specs/` में डेल्टा स्पेक्स)

डेल्टा स्पेक्स वर्तमान स्पेक्स के सापेक्ष **क्या बदल रहा है** उसका वर्णन करते हैं। नीचे [डेल्टा स्पेक्स](#delta-specs) देखें।

#### डिजाइन (`design.md`)

डिजाइन **तकनीकी पद्धति** और **आर्किटेक्चर निर्णय** को कैप्चर करता है।

````markdown
# Design: Add Dark Mode

## Technical Approach
Theme state managed via React Context to avoid prop drilling.
CSS custom properties enable runtime switching without class toggling.

## Architecture Decisions

### Decision: Context over Redux
Using React Context for theme state because:
- Simple binary state (light/dark)
- No complex state transitions
- Avoids adding Redux dependency

### Decision: CSS Custom Properties
Using CSS variables instead of CSS-in-JS because:
- Works with existing stylesheet
- No runtime overhead
- Browser-native solution

## Data Flow
```
ThemeProvider (context)
       │
       ▼
ThemeToggle ◄──► localStorage
       │
       ▼
CSS Variables (applied to :root)
```

## File Changes
- `src/contexts/ThemeContext.tsx` (new)
- `src/components/ThemeToggle.tsx` (new)
- `src/styles/globals.css` (modified)
````

**डिजाइन को कब अपडेट करें:**
- कार्यान्वयन पता चलता है कि पद्धति काम नहीं करेगी
- बेहतर समाधान मिल जाता है
- निर्भरताएं या बाधाएं बदल जाती हैं

#### कार्य (`tasks.md`)

कार्य **कार्यान्वयन चेकलिस्ट** हैं — चेकबॉक्स वाले ठोस चरण।

```markdown
# Tasks

## 1. Theme Infrastructure
- [ ] 1.1 Create ThemeContext with light/dark state
- [ ] 1.2 Add CSS custom properties for colors
- [ ] 1.3 Implement localStorage persistence
- [ ] 1.4 Add system preference detection

## 2. UI Components
- [ ] 2.1 Create ThemeToggle component
- [ ] 2.2 Add toggle to settings page
- [ ] 2.3 Update Header to include quick toggle

## 3. Styling
- [ ] 3.1 Define dark theme color palette
- [ ] 3.2 Update components to use CSS variables
- [ ] 3.3 Test contrast ratios for accessibility
```

**कार्य सर्वोत्तम प्रथाएं:**
- संबंधित कार्यों को शीर्षकों के तहत समूहित करें
- हाइरार्किकल नंबरिंग का उपयोग करें (1.1, 1.2 आदि)
- कार्यों को इतना छोटा रखें कि एक सत्र में पूरा हो जाएं
- पूरा करने पर कार्यों को चेक कर लें

## डेल्टा स्पेक्स

डेल्टा स्पेक्स वह मुख्य अवधारणा है जो ब्राउनफील्ड डेवलपमेंट के लिए OpenSpec को कार्य करने में सक्षम बनाती है। ये पूरे स्पेक को फिर से कहने के बजाय **क्या बदल रहा है** उसका वर्णन करती हैं।

### फॉर्मेट

```markdown
# Delta for Auth

## ADDED Requirements

### Requirement: Two-Factor Authentication
The system MUST support TOTP-based two-factor authentication.

#### Scenario: 2FA enrollment
- GIVEN a user without 2FA enabled
- WHEN the user enables 2FA in settings
- THEN a QR code is displayed for authenticator app setup
- AND the user must verify with a code before activation

#### Scenario: 2FA login
- GIVEN a user with 2FA enabled
- WHEN the user submits valid credentials
- THEN an OTP challenge is presented
- AND login completes only after valid OTP

## MODIFIED Requirements

### Requirement: Session Expiration
The system MUST expire sessions after 15 minutes of inactivity.
(Previously: 30 minutes)

#### Scenario: Idle timeout
- GIVEN an authenticated session
- WHEN 15 minutes pass without activity
- THEN the session is invalidated

## REMOVED Requirements

### Requirement: Remember Me
(Deprecated in favor of 2FA. Users should re-authenticate each session.)
```

### डेल्टा सेक्शन

| सेक्शन | अर्थ | आर्काइव होने पर क्या होता है |
|---------|---------|------------------------|
| `## ADDED Requirements` | नया व्यवहार | मुख्य स्पेक में संलग्न किया जाता है |
| `## MODIFIED Requirements` | बदला हुआ व्यवहार | मौजूदा आवश्यकता को प्रतिस्थापित करता है |
| `## REMOVED Requirements` | अप्रचलित व्यवहार | मुख्य स्पेक से हटा दिया जाता है |

### पूरे स्पेक्स के बजाय डेल्टा क्यों

**स्पष्टता।** एक डेल्टा बिल्कुल बताता है कि क्या बदल रहा है। पूरे स्पेक को पढ़ते समय, आपको इसे मानसिक रूप से वर्तमान संस्करण से उसका अंतर निकालना पड़ता है।

**टकराव से बचाव।** दो चेंजेस जब तक कि वे अलग-अलग आवश्यकताओं को संशोधित करें, तब तक एक ही स्पेक फाइल को बिना किसी टकराव के छू सकती हैं।

**समीक्षा दक्षता।** समीक्षक केवल बदलाव देखते हैं, बदले नहीं हुए संदर्भ को नहीं। जरूरी बातों पर ध्यान केंद्रित करें।

**ब्राउनफील्ड फिट।** अधिकांश कार्य मौजूदा व्यवहार को संशोधित करता है। डेल्टा संशोधनों को प्राथमिक स्तर के बनाते हैं, बाद में सोचे गए काम नहीं।

## स्कीमा

स्कीमा वर्कफ्लो के लिए आर्टिफैक्ट प्रकारों और उनकी निर्भरताओं को परिभाषित करती हैं।

### स्कीमा कैसे काम करती है

```yaml
# openspec/schemas/spec-driven/schema.yaml
name: spec-driven
artifacts:
  - id: proposal
    generates: proposal.md
    requires: []              # कोई निर्भरता नहीं, पहले बनाया जा सकता है

  - id: specs
    generates: specs/**/*.md
    requires: [proposal]      # बनाने से पहले प्रस्ताव की जरूरत है

  - id: design
    generates: design.md
    requires: [proposal]      # स्पेक्स के साथ समानांतर में बनाया जा सकता है

  - id: tasks
    generates: tasks.md
    requires: [specs, design] # पहले दोनों स्पेक्स और डिजाइन की जरूरत है
```

**आर्टिफैक्ट एक निर्भरता ग्राफ बनाते हैं:**

```
                    proposal
                   (root node)
                       │
         ┌─────────────┴─────────────┐
         │                           │
         ▼                           ▼
      specs                       design
   (requires:                  (requires:
    proposal)                   proposal)
         │                           │
         └─────────────┬─────────────┘
                       │
                       ▼
                    tasks
                (requires:
                specs, design)
```

**निर्भरताएं सक्षम करने वाली हैं, न कि बाधा।** ये दिखाती हैं कि क्या बनाना संभव है, न कि क्या आपको अगला बनाना चाहिए। अगर आपको डिजाइन की जरूरत नहीं है तो आप इसे छोड़ सकते हैं। आप डिजाइन से पहले या बाद में स्पेक्स बना सकते हैं — दोनों केवल प्रस्ताव पर निर्भर हैं।

### इन-बिल्ट स्कीमा

**स्पेक-ड्रिवन** (डिफॉल्ट)

स्पेक-ड्रिवन डेवलपमेंट के लिए मानक वर्कफ्लो:

```
proposal → specs → design → tasks → implement
```

सबसे उपयुक्त है: जब आप इम्प्लीमेंटेशन से पहले स्पेक्स पर सहमत होना चाहते हैं, तब अधिकांश फीचर वर्क के लिए।

### कस्टम स्कीमा

अपनी टीम के वर्कफ्लो के लिए कस्टम स्कीमा बनाएं:

```bash
# शुरू से बनाएं
openspec schema init research-first

# या मौजूदा को फॉर्क करें
openspec schema fork spec-driven research-first
```

**कस्टम स्कीमा का उदाहरण:**

```yaml
# openspec/schemas/research-first/schema.yaml
name: research-first
artifacts:
  - id: research
    generates: research.md
    requires: []           # पहले रिसर्च करें

  - id: proposal
    generates: proposal.md
    requires: [research]   # प्रस्ताव रिसर्च से सूचित हो

  - id: tasks
    generates: tasks.md
    requires: [proposal]   # स्पेक्स/डिजाइन छोड़ें, सीधे टास्क्स पर जाएं
```

कस्टम स्कीमा बनाने और उपयोग करने के पूर्ण विवरण के लिए [कस्टमाइज़ेशन](customization.md) देखें।

## आर्काइव

आर्काइविंग एक चेंज को पूरा करती है, उसके डेल्टा स्पेक्स को मुख्य स्पेक्स में मर्ज करके और चेंज को इतिहास के लिए संरक्षित करके।

### जब आप आर्काइव करते हैं तो क्या होता है

```
Before archive:

openspec/
├── specs/
│   └── auth/
│       └── spec.md ◄────────────────┐
└── changes/                         │
    └── add-2fa/                     │
        ├── proposal.md              │ merge
        ├── design.md                │
        ├── tasks.md                 │
        └── specs/                   │
            └── auth/                │
                └── spec.md ─────────┘


After archive:

openspec/
├── specs/
│   └── auth/
│       └── spec.md        # Now includes 2FA requirements
└── changes/
    └── archive/
        └── 2025-01-24-add-2fa/    # Preserved for history
            ├── proposal.md
            ├── design.md
            ├── tasks.md
            └── specs/
                └── auth/
                    └── spec.md
```

### आर्काइव प्रक्रिया

1. **डेल्टा मर्ज करें।** प्रत्येक डेल्टा स्पेक्स सेक्शन (ADDED/MODIFIED/REMOVED) को संबंधित मुख्य स्पेक्स पर लागू किया जाता है।
2. **आर्काइव में स्थानांतरित करें।** चेंज फोल्डर को कालानुक्रमिक क्रमण के लिए दिनांक उपसर्ग के साथ `changes/archive/` में स्थानांतरित हो जाता है।
3. **संदर्भ संरक्षित करें।** आर्काइव में सभी आर्टिफैक्ट्स अखंड रहते हैं। आप हमेशा यह समझने के लिए पीछे देख सकते हैं कि चेंज क्यों की गई थी।

### आर्काइव क्यों महत्वपूर्ण है

**साफ स्थिति।** सक्रिय चेंज (`changes/`) केवल प्रगति पर काम को दिखाती है। पूर्ण काम को अलग रख दिया जाता है।

**ऑडिट ट्रेल।** आर्काइव हर चेंज का पूरा संदर्भ संरक्षित करती है — केवल यह नहीं कि क्या बदला, बल्कि प्रस्ताव जो बदलाव के कारण समझाता है, डिजाइन जो बदलाव की विधि समझाता है, और टास्क्स जो किए गए काम को दिखाते हैं, उन्हें भी संरक्षित करती है।

**स्पेक्स का विकास।** चेंज को आर्काइव करने के साथ स्पेक्स स्वाभाविक रूप से बढ़ते हैं। प्रत्येक आर्काइव अपने डेल्टा को मर्ज करता है, समय के साथ एक व्यापक स्पेसिफिकेशन बनाता है।

## यह सब कैसे एक साथ फिट होता है

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              OPENSPEC FLOW                                   │
│                                                                              │
│   ┌────────────────┐                                                         │
│   │  1. START      │  /opsx:propose (core) or /opsx:new (expanded)           │
│   │     CHANGE     │                                                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  2. CREATE     │  /opsx:ff or /opsx:continue (expanded workflow)         │
│   │     ARTIFACTS  │  Creates proposal → specs → design → tasks              │
│   │                │  (based on schema dependencies)                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  3. IMPLEMENT  │  /opsx:apply                                            │
│   │     TASKS      │  Work through tasks, checking them off                  │
│   │                │◄──── Update artifacts as you learn                      │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  4. VERIFY     │  /opsx:verify (optional)                                │
│   │     WORK       │  Check implementation matches specs                     │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐     ┌──────────────────────────────────────────────┐    │
│   │  5. ARCHIVE    │────►│  Delta specs merge into main specs           │    │
│   │     CHANGE     │     │  Change folder moves to archive/             │    │
│   └────────────────┘     │  Specs are now the updated source of truth   │    │
│                          └──────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**सुंदर चक्र:**

1. स्पेक्स वर्तमान व्यवहार का वर्णन करते हैं
2. चेंज संशोधन प्रस्तावित करते हैं (डेल्टा के रूप में)
3. इम्प्लीमेंटेशन बदलावों को वास्तविक बनाता है
4. आर्काइव डेल्टा को स्पेक्स में मर्ज करता है
5. अब स्पेक्स नए व्यवहार का वर्णन करते हैं
6. अगली चेंज अपडेट की गई स्पेक्स पर आधारित होती है

## शब्दावली

| शब्द | परिभाषा |
|------|------------|
| **आर्टिफैक्ट** | चेंज के भीतर एक दस्तावेज (प्रस्ताव, डिजाइन, टास्क्स, या डेल्टा स्पेक्स) |
| **आर्काइव** | एक चेंज को पूरा करने और उसके डेल्टा को मुख्य स्पेक्स में मर्ज करने की प्रक्रिया |
| **चेंज** | सिस्टम में एक प्रस्तावित संशोधन, जिसे आर्टिफैक्ट्स के साथ एक फोल्डर के रूप में पैकेज किया गया है |
| **डेल्टा स्पेक** | वर्तमान स्पेक्स के सापेक्ष बदलावों (ADDED/MODIFIED/REMOVED) का वर्णन करने वाला स्पेक |
| **डोमेन** | स्पेक्स के लिए एक तार्किक समूह (उदाहरण: `auth/`, `payments/`) |
| **आवश्यकता** | एक विशिष्ट व्यवहार जिसका सिस्टम में होना अनिवार्य है |
| **सिनारियो** | एक आवश्यकता का एक ठोस उदाहरण, आमतौर पर Given/When/Then फॉर्मेट में |
| **स्कीमा** | आर्टिफैक्ट प्रकारों और उनकी निर्भरताओं की परिभाषा |
| **स्पेक** | सिस्टम के व्यवहार का वर्णन करने वाला स्पेसिफिकेशन, जिसमें आवश्यकताएं और सिनारियो शामिल हैं |
| **सोर्स ऑफ ट्रूथ** | `openspec/specs/` डिरेक्ट्री, जिसमें वर्तमान में सहमत व्यवहार शामिल है |

## अगले कदम

- [शुरुआत करें](getting-started.md) - व्यावहारिक पहले कदम
- [वर्कफ्लो](workflows.md) - सामान्य पैटर्न और प्रत्येक का उपयोग कब करें
- [कमांड](commands.md) - पूर्ण कमांड संदर्भ
- [कस्टमाइज़ेशन](customization.md) - कस्टम स्कीमा बनाएं और अपना प्रोजेक्ट कॉन्फ़िगर करें
# शुरुआत करना

यह मार्गदर्शिका बताती है कि OpenSpec कैसे काम करता है, इंस्टॉलेशन और इनिशियलाइज़ेशन के बाद। इंस्टॉलेशन निर्देशों के लिए, [मुख्य README](index.md#quick-start) देखें।

## यह कैसे काम करता है

OpenSpec आपको और आपके AI कोडिंग सहायक को किसी भी कोड को लिखने से पहले यह तय करने में मदद करता है कि क्या बनाना है।

**डिफ़ॉल्ट त्वरित मार्ग (कोर प्रोफ़ाइल):**

```text
/opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
```

**विस्तृत मार्ग (कस्टम वर्कफ़्लो चयन):**

```text
/opsx:new ──► /opsx:ff or /opsx:continue ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

डिफ़ॉल्ट ग्लोबल प्रोफ़ाइल `core` है, जिसमें `propose`, `explore`, `apply`, `sync`, और `archive` शामिल हैं। आप `openspec config profile` और फिर `openspec update` के साथ विस्तृत वर्कफ़्लो कमांड सक्षम कर सकते हैं।

## OpenSpec क्या बनाता है

`openspec init` चलाने के बाद, आपके प्रोजेक्ट में यह संरचना होती है:

```
openspec/
├── specs/              # सत्य का स्रोत (आपके सिस्टम का व्यवहार)
│   └── <domain>/
│       └── spec.md
├── changes/            # प्रस्तावित अपडेट (प्रत्येक परिवर्तन के लिए एक फ़ोल्डर)
│   └── <change-name>/
│       ├── proposal.md
│       ├── design.md
│       ├── tasks.md
│       └── specs/      # डेल्टा स्पेक्स (क्या बदल रहा है)
│           └── <domain>/
│               └── spec.md
└── config.yaml         # प्रोजेक्ट कॉन्फ़िगरेशन (वैकल्पिक)
```

**दो प्रमुख निर्देशिकाएँ:**

- **`specs/`** - सत्य का स्रोत। ये स्पेक्स बताते हैं कि आपका सिस्टम वर्तमान में कैसे व्यवहार करता है। डोमेन के अनुसार व्यवस्थित (जैसे, `specs/auth/`, `specs/payments/`)।

- **`changes/`** - प्रस्तावित संशोधन। प्रत्येक परिवर्तन को अपना फ़ोल्डर मिलता है जिसमें सभी संबंधित आर्टिफ़ैक्ट्स होते हैं। जब कोई परिवर्तन पूरा हो जाता है, तो उसके स्पेक्स मुख्य `specs/` निर्देशिका में विलीन हो जाते हैं।

## आर्टिफ़ैक्ट्स को समझना

प्रत्येक परिवर्तन फ़ोल्डर में आर्टिफ़ैक्ट्स होते हैं जो कार्य का मार्गदर्शन करते हैं:

| आर्टिफ़ैक्ट | उद्देश्य |
|----------|---------|
| `proposal.md` | "क्यों" और "क्या" - उद्देश्य, दायरा और दृष्टिकोण को कैप्चर करता है |
| `specs/` | डेल्टा स्पेक्स जो जोड़े गए/संशोधित/हटाए गए आवश्यकताओं को दिखाते हैं |
| `design.md` | "कैसे" - तकनीकी दृष्टिकोण और आर्किटेक्चर निर्णय |
| `tasks.md` | चेकबॉक्स के साथ कार्यान्वयन चेकलिस्ट |

**आर्टिफ़ैक्ट्स एक-दूसरे पर आधारित होते हैं:**

```
proposal ──► specs ──► design ──► tasks ──► implement
   ▲           ▲          ▲                    │
   └───────────┴──────────┴────────────────────┘
            जैसे-जैसे आप सीखते हैं अपडेट करें
```

कार्यान्वयन के दौरान जैसे-जैसे आप अधिक जानते हैं, आप हमेशा पिछले आर्टिफ़ैक्ट्स को परिष्कृत करने के लिए वापस जा सकते हैं।

## डेल्टा स्पेक्स कैसे काम करते हैं

डेल्टा स्पेक्स OpenSpec में एक प्रमुख अवधारणा हैं। ये दिखाते हैं कि आपके वर्तमान स्पेक्स के सापेक्ष क्या बदल रहा है।

### प्रारूप

डेल्टा स्पेक्स परिवर्तन के प्रकार को इंगित करने के लिए अनुभागों का उपयोग करते हैं:

```markdown
# Delta for Auth

## ADDED Requirements

### Requirement: Two-Factor Authentication
The system MUST require a second factor during login.

#### Scenario: OTP required
- GIVEN a user with 2FA enabled
- WHEN the user submits valid credentials
- THEN an OTP challenge is presented

## MODIFIED Requirements

### Requirement: Session Timeout
The system SHALL expire sessions after 30 minutes of inactivity.
(Previously: 60 minutes)

#### Scenario: Idle timeout
- GIVEN an authenticated session
- WHEN 30 minutes pass without activity
- THEN the session is invalidated

## REMOVED Requirements

### Requirement: Remember Me
(Deprecated in favor of 2FA)
```

### आर्काइव पर क्या होता है

जब आप किसी परिवर्तन को आर्काइव करते हैं:

1. **जोड़ी गई** आवश्यकताएँ मुख्य स्पेक में जोड़ दी जाती हैं
2. **संशोधित** आवश्यकताएँ मौजूदा संस्करण को प्रतिस्थापित करती हैं
3. **हटाई गई** आवश्यकताएँ मुख्य स्पेक से हटा दी जाती हैं

ऑडिट इतिहास के लिए परिवर्तन फ़ोल्डर `openspec/changes/archive/` में चला जाता है।

## उदाहरण: आपका पहला परिवर्तन

आइए किसी एप्लिकेशन में डार्क मोड जोड़ने की प्रक्रिया से गुज़रते हैं।

### 1. परिवर्तन शुरू करें (डिफ़ॉल्ट)

```text
You: /opsx:propose add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     ✓ proposal.md — why we're doing this, what's changing
     ✓ specs/       — requirements and scenarios
     ✓ design.md    — technical approach
     ✓ tasks.md     — implementation checklist
     Ready for implementation!
```

यदि आपने विस्तृत वर्कफ़्लो प्रोफ़ाइल सक्षम की है, तो आप यह दो चरणों में भी कर सकते हैं: `/opsx:new` फिर `/opsx:ff` (या क्रमिक रूप से `/opsx:continue`)।

### 2. क्या बनाया जाता है

**proposal.md** - उद्देश्य को कैप्चर करता है:

```markdown
# Proposal: Add Dark Mode

## Intent
Users have requested a dark mode option to reduce eye strain
during nighttime usage.

## Scope
- Add theme toggle in settings
- Support system preference detection
- Persist preference in localStorage

## Approach
Use CSS custom properties for theming with a React context
for state management.
```

**specs/ui/spec.md** - नई आवश्यकताएँ दिखाने वाला डेल्टा:

```markdown
# Delta for UI

## ADDED Requirements

### Requirement: Theme Selection
The system SHALL allow users to choose between light and dark themes.

#### Scenario: Manual toggle
- GIVEN a user on any page
- WHEN the user clicks the theme toggle
- THEN the theme switches immediately
- AND the preference persists across sessions

#### Scenario: System preference
- GIVEN a user with no saved preference
- WHEN the application loads
- THEN the system's preferred color scheme is used
```

**tasks.md** - कार्यान्वयन चेकलिस्ट:

```markdown
# Tasks

## 1. Theme Infrastructure
- [ ] 1.1 Create ThemeContext with light/dark state
- [ ] 1.2 Add CSS custom properties for colors
- [ ] 1.3 Implement localStorage persistence

## 2. UI Components
- [ ] 2.1 Create ThemeToggle component
- [ ] 2.2 Add toggle to settings page
- [ ] 2.3 Update Header to include quick toggle

## 3. Styling
- [ ] 3.1 Define dark theme color palette
- [ ] 3.2 Update components to use CSS variables
```

### 3. कार्यान्वयन

```
You: /opsx:apply

AI:  Working through tasks...
     ✓ 1.1 Created ThemeContext with light/dark state
     ✓ 1.2 Added CSS custom properties to globals.css
     ✓ 1.3 Implemented localStorage persistence
     ✓ 2.1 Created ThemeToggle component
     ...
     All tasks complete!
```

कार्यान्वयन के दौरान, यदि आपको पता चलता है कि डिज़ाइन में समायोजन की आवश्यकता है, तो बस आर्टिफ़ैक्ट को अपडेट करें और जारी रखें।

### 4. आर्काइव

```
You: /opsx:archive

AI:  Archiving add-dark-mode...
     ✓ Merged specs into openspec/specs/ui/spec.md
     ✓ Moved to openspec/changes/archive/2025-01-24-add-dark-mode/
     Done! Ready for the next feature.
```

आपके डेल्टा स्पेक्स अब मुख्य स्पेक्स का हिस्सा हैं, जो दस्तावेज़ करते हैं कि आपका सिस्टम कैसे काम करता है।

## सत्यापन और समीक्षा

अपने परिवर्तनों की जाँच करने के लिए CLI का उपयोग करें:

```bash
# List active changes
openspec list

# View change details
openspec show add-dark-mode

# Validate spec formatting
openspec validate add-dark-mode

# Interactive dashboard
openspec view
```

## अगले कदम

- [वर्कफ़्लोज़](workflows.md) - सामान्य पैटर्न और प्रत्येक कमांड का उपयोग कब करें
- [कमांड्स](commands.md) - सभी स्लैश कमांड्स का पूर्ण संदर्भ
- [अवधारणाएँ](concepts.md) - स्पेक्स, परिवर्तन और स्कीमास की गहरी समझ
- [कस्टमाइज़ेशन](customization.md) - OpenSpec को अपने तरीके से काम करें
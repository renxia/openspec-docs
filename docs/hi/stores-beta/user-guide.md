# Stores: Plan in Its Own Repo

> **Beta.** Stores, references, working context, and worksets are
> नए। Command names, flags, file formats, और JSON output अभी भी releases के बीच बदल सकते हैं। हर walkthrough नीचे दिए गए build के विरुद्ध चलाया गया था, लेकिन अपग्रेड करने के बाद इस गाइड को दोबारा पढ़ें।

## The problem this solves

OpenSpec आमतौर पर एक कोड repo के अंदर रहता है: आपके कोड के बगल में एक `openspec/` फ़ोल्डर, जो उस repo के लिए specs और changes रखता है।

यह तब फिट होना बंद हो जाता है जब आपकी प्लानिंग एक से अधिक repos तक फैल जाती है:

- आपका काम कई repos तक फैला हुआ है — एक feature API server, web app, और एक shared library को छूता है। प्लान किस `openspec/` फ़ोल्डर में रहता है?
- आपकी टीम कोड बनने से पहले योजना बनाती है, या ऐसी चीज़ों की योजना बनाती है जो *इस* repo में कभी कोड नहीं बनतीं।
- Requirements एक टीम द्वारा स्वामित्व रखे जाते हैं और दूसरों द्वारा उपयोग किए जाते हैं। Wiki version बदल जाता है, और आपका coding agent इसे वैसे भी पढ़ नहीं सकता।

एक **store** इसका उत्तर है: एक standalone repo जिसका एकमात्र काम प्लानिंग करना है। इसमें वही `openspec/` shape है जो आप पहले से जानते हैं — specs और changes — साथ में एक छोटा identity file। आप इसे अपनी मशीन पर एक बार, नाम के द्वारा रजिस्टर करते हैं, और फिर हर सामान्य OpenSpec command कहीं से भी इसके अंदर काम कर सकता है।

## आकार (The shape)

```
            team-plans  (a store: planning in its own repo)
            ├── .openspec-store/store.yaml     identity: "I am team-plans"
            └── openspec/
                ├── specs/      what is true
                └── changes/    what is in motion
                      ▲
                      │ registered on each machine by name;
                      │ shared by pushing/cloning like any repo
        ┌─────────────┼─────────────┐
        │             │             │
    web-app       api-server     mobile-app
   (code repo)   (code repo)    (code repo)
```

दो नियम इसे सरल रखते हैं:

1. **एक स्टोर बस एक git रेपो है।** आप इसे स्वयं कमिट करते हैं, पुश करते हैं, पुल करते हैं और इसकी समीक्षा करते हैं। OpenSpec अपने आप कुछ भी क्लोन नहीं करता, सिंक नहीं करता या पुश नहीं करता।
2. **मशीनरी नहीं, घोषणाएँ (Declarations)।** रेपोस स्टोर से कैसे संबंधित हैं, यह *घोषित* कर सकते हैं (नीचे दिखाया गया है)। ये घोषणाएं वह बदलती हैं जो OpenSpec आपको बता सकता है — कभी भी यह नहीं कि आपके कमांड कहाँ कार्य करते हैं।

## पहले स्टोर तक पाँच मिनट

दो कमांड आपको कुछ भी न होने की स्थिति से एक काम करने वाले, स्टोर-स्कोप किए गए परिवर्तन तक ले जाते हैं:

```bash
openspec store setup team-plans --path ~/openspec/team-plans
```

```
Store ready: team-plans
Location: /Users/you/openspec/team-plans
OpenSpec root: ready
Registry: registered

Next: run normal OpenSpec commands against this store, for example:
  openspec new change <change-id> --store team-plans
Share this store by committing and pushing it like any Git repo.
```

```bash
openspec new change add-login --store team-plans
```

```
Using OpenSpec root: team-plans (/Users/you/openspec/team-plans)
Created change 'add-login' at /Users/you/openspec/team-plans/openspec/changes/add-login/
Schema: spec-driven
Next: openspec status --change add-login --store team-plans
```

यही पूरा मॉडल है। यहाँ से जीवनचक्र (lifecycle) बिल्कुल वही है जो आप जानते हैं — `status`, `instructions`, `validate`, `archive` — हर कमांड पर `--store team-plans` के साथ, और हर छपी हुई संकेत आपको झंडा (flag) देती है। `Using OpenSpec root:` लाइन हमेशा बताती है कि कोई कमांड कहाँ कार्य कर रही है।

## कहानी: एक टीम, एक प्लानिंग रेपो

एक टीम कोड रेपोस में उन्हें बिखेरने के बजाय `team-plans` में अपने स्पेसिफिकेशन्स और परिवर्तनों को रखती है।

**पहला दिन (जो भी इसे सेट करता है):**

```bash
openspec store setup team-plans --path ~/openspec/team-plans \
  --remote git@github.com:acme/team-plans.git
git -C ~/openspec/team-plans push -u origin main
```

`--remote` पास करने से स्टोर की अपनी पहचान फ़ाइल (`.openspec-store/store.yaml`) के अंदर, प्रारंभिक कमिट में क्लोन URL रिकॉर्ड हो जाता है। हर भविष्य का क्लोन यह जानते हुए पैदा होता है कि वह कहाँ से आया है, ताकि स्वास्थ्य जांच (health checks) और त्रुटि संदेश सहकर्मियों के लिए एक पूर्ण, पेस्ट करने योग्य सुधार प्रिंट कर सकें जिनके पास यह अभी तक नहीं है।

**हर टीममेट (एक बार प्रति मशीन):**

```bash
git clone git@github.com:acme/team-plans.git ~/openspec/team-plans
openspec store register ~/openspec/team-plans
```

इसके बाद, हर कोई नाम द्वारा एक ही प्लानिंग रेपो में काम करता है:

```bash
openspec status --store team-plans --change add-login
openspec show add-login --store team-plans
```

**काम साझा करना git है, जानबूझकर।** एक परिवर्तन जो आप बनाते हैं वह केवल आपके चेकआउट में मौजूद होता है जब तक कि आप इसे कमिट और पुश नहीं करते — यह कोड जैसा ही है। प्लान शाखाएँ (branches), पुल रिक्वेस्ट और समीक्षा मुफ्त में प्राप्त करते हैं, क्योंकि एक स्टोर एक सामान्य रेपो है।

**टीम के कोड रेपोस को जोड़ना।** एक कोड रेपो जिसकी प्लानिंग पूरी तरह से बाहरीकृत (externalized) हो गई है, उसे `openspec/config.yaml` में ठीक एक लाइन की आवश्यकता होती है:

```yaml
# web-app/openspec/config.yaml
store: team-plans
```

अब `web-app` के अंदर चलाए गए हर OpenSpec कमांड का `team-plans` पर कोई झंडे (flags) के बिना कार्य होता है:

```bash
cd ~/src/web-app
openspec status --change add-login
```

```
Using OpenSpec root: team-plans (/Users/you/openspec/team-plans)
...
```

यह पॉइंटर एक फॉलबैक (fallback) है, कभी भी ओवरराइड नहीं: एक स्पष्ट `--store` हमेशा जीतता है, और यदि रेपो की अपनी वास्तविक प्लानिंग फ़ोल्डर हैं, तो वे जीतते हैं (असंगत पॉइंटर को हटाने के लिए चेतावनी के साथ)।

## कहानी: आवश्यकताएँ जो टीम की सीमाओं को पार करती हैं

एक प्लेटफॉर्म टीम आवश्यकताओं का मालिक होता है। उत्पाद टीमें उन्हें अपने रेपोस में, अपनी खुद की डिज़ाइन के साथ, उनके विरुद्ध बनाती हैं। एक संदर्भ उस संबंध का वर्णन करता है बिना किसी के काम को हिलाए।

```
   platform-reqs (store)                 api-server (code repo)
   owned by the platform team            owned by a product team
   ┌──────────────────────────┐          ┌──────────────────────────┐
   │ openspec/specs/          │ ◀────────│ openspec/config.yaml     │
   │   payments/spec.md       │ reads    │   references:            │
   │   auth/spec.md           │          │     - platform-reqs      │
   │                          │          │ openspec/specs/          │
   │ openspec/changes/        │          │   (their own designs)    │
   │   platform work          │          │ openspec/changes/        │
   │                          │          │   (their own work)       │
   │                          │          │          └──────────────────────────┘
   └──────────────────────────┘
```

**उत्पाद टीम घोषित करती है कि वह अपने रेपो में किस पर निर्भर करता है** `openspec/config.yaml` में:

```yaml
references:
  - platform-reqs
```

संदर्भ केवल पढ़ने योग्य संदर्भ हैं। रेपो अपनी स्वयं की `openspec/` रूट रखता है; काम वहीं रहता है। क्या बदलता है: उस रेपो में `openspec instructions` अब संदर्भित स्टोर के स्पेसिफिकेशन्स का एक इंडेक्स शामिल करता है — प्रत्येक का एक पंक्ति का सारांश और सटीक फ़ेच कमांड (`openspec show <spec-id> --type spec --store platform-reqs`)। `api-server` में काम करने वाला कोई एजेंट अपस्ट्रीम भुगतान आवश्यकताओं को ढूंढ सकता है, उनका हवाला दे सकता है, और रेपो की अपनी रूट में अपना निम्न-स्तरीय डिज़ाइन लिख सकता है — बिना किसी के संदर्भ को पेस्ट किए।

एक संदर्भ अपने क्लोन स्रोत को ले जा सकता है, इसलिए वे टीममेट्स जिनके पास अभी स्टोर नहीं है, उन्हें मृत अंत (dead end) के बजाय एक पूर्ण सुधार प्राप्त होता है:

```yaml
references:
  - { id: platform-reqs, remote: "git@github.com:acme/platform-reqs.git" }
```

**जब आप योजना और कोड को एक साथ चाहते हैं, तो एक वर्कसेट बनाएं।** यह व्यक्तिगत और स्पष्ट है: प्रत्येक व्यक्ति उन फ़ोल्डरों का चयन करता है जिन पर वह वास्तव में अपनी मशीन पर काम करता है। स्थानीय चेकआउट पथों के बारे में कुछ भी साझा प्लानिंग रेपो में कमिट नहीं किया जाता।

```bash
openspec workset create platform \
  --member ~/openspec/platform-reqs \
  --member ~/src/api-server \
  --member ~/src/web-app
```

## दो प्रश्न जो आप हमेशा पूछ सकते हैं

**"क्या मेरा सेटअप स्वस्थ है?"** — `openspec doctor` वर्तमान रूट और इसके संदर्भित स्टोर की जांच करता है, केवल पढ़ने के लिए, प्रत्येक निष्कर्ष के लिए एक पेस्ट करने योग्य सुधार के साथ:

```
Doctor

Root
  Location: /Users/you/src/api-server
  OpenSpec root: ok

References
  - platform-reqs: ok (/Users/you/openspec/platform-reqs)
  - design-system: Referenced store 'design-system' is not registered on this machine.
    Fix: git clone -- git@github.com:acme/design-system.git '/Users/you/openspec/design-system' && openspec store register '/Users/you/openspec/design-system' --id design-system

```

**"मैं किस पर काम कर रहा हूँ?"** — `openspec context` OpenSpec घोषणाओं से कार्य सेट को इकट्ठा करता है: रूट और वे स्टोर जिन्हें यह संदर्भित करता है।

```
Working context for api-server (/Users/you/src/api-server)

OpenSpec root
  api-server  /Users/you/src/api-server

Referenced stores
  platform-reqs  /Users/you/openspec/platform-reqs
    Fetch: openspec show <spec-id> --type spec --store platform-reqs
```

दोनों एजेंटों के लिए `--json` का समर्थन करते हैं। `openspec context --code-workspace <path>` अतिरिक्त रूप से एक VS Code वर्कस्पेस फ़ाइल लिखता है जिसमें पूरे सेट को शामिल किया जाता है — यह एकमात्र लेखन कार्य जो यह कमांड करती है।

## वर्कसेट: उन फ़ोल्डरों को फिर से खोलें जिन पर आप साथ काम करते हैं

उपरोक्त सभी से अलग: अधिकांश लोग हर सत्र में कुछ ही फ़ोल्डर एक साथ खोलते हैं — प्लानिंग रेपो और दो या तीन कोड रेपोस। **एक वर्कसेट** ठीक उसी का एक व्यक्तिगत, नामित दृश्य है, जिसे आपके चुने हुए टूल में एक कमांड के साथ फिर से खोला जाता है।

```
  workset "platform"                 openspec workset open platform
  ├── team-plans   ~/openspec/team-plans         │
  ├── api-server   ~/src/api-server              ▼
  └── web-app      ~/src/web-app       all three open in your tool
```

```bash
openspec workset create platform \
  --member ~/openspec/team-plans --member ~/src/api-server \
  --tool code
openspec workset list
```

```
platform  (opens in VS Code)
  team-plans  /Users/you/openspec/team-plans
  api-server  /Users/you/src/api-server
```

`openspec workset open platform` फिर सहेजे गए टूल को लॉन्च करता है: संपादक (editors) (VS Code, Cursor) हर सदस्य के साथ एक विंडो खोलते हैं और लौट आते हैं। पहला सदस्य प्राथमिक होता है। आप किसी भी समय `--tool <id>` के साथ टूल को ओवरराइड कर सकते हैं।

वर्कसेट जानबूझकर *साझा स्थिति* नहीं होते हैं। वे आपकी मशीन पर रहते हैं, कभी कमिट नहीं किए जाते हैं, और काम के बारे में कोई दावा नहीं करते — वे केवल यह रिकॉर्ड करते हैं कि आप क्या एक साथ खोलना पसंद करते हैं। किसी को हटा देने से सदस्य फ़ोल्डर को छूता नहीं है। नए टूल कॉन्फ़िगरेशन होते हैं, कोड नहीं: वर्कस्पेस फ़ाइल या प्रति-फ़ोल्डर अटैच झंडों के माध्यम से लॉन्च की गई कुछ भी वैश्विक कॉन्फ़िग (`openspec config edit`) में `openers` कुंजी के तहत जोड़ी जा सकती है।

## कमांड कैसे तय करते हैं कि कहाँ कार्य करना है

हर सामान्य कमांड अपने रूट को एक ही तरीके से हल करता है, इस क्रम में:

```
1. --store <id>          आपने स्पष्ट रूप से कहा → वह स्टोर
2. nearest openspec/     एक वास्तविक प्लानिंग रूट यहाँ है → यह रेपो
   (cwd से ऊपर की ओर चलना)
3. store: pointer        config.yaml एक स्टोर घोषित करता है → वह स्टोर
4. none of the above     क्या कोई मशीन पर पंजीकृत स्टोर हैं? → चयन संकेत के साथ त्रुटि
                         नहीं तो?         → वर्तमान डायरेक्टरी (classic behavior)
```

`Using OpenSpec root:` लाइन (और `--json` आउटपुट में `root` ब्लॉक) आपको बताता है कि आप किस मामले में हैं।

## ज्ञात सीमाएँ

- **बीटा आकार।** इस पृष्ठ पर सब कुछ रिलीज़ के बीच बदल सकता है — नाम, झंडे, फ़ाइल प्रारूप, JSON कुंजियाँ।
- **प्रति मशीन स्टोर आईडी एक चेकआउट।** उसी आईडी के तहत दूसरे चेकआउट को पंजीकृत करने से `store unregister` पहले संकेत के साथ विफल हो जाता है।
- **कभी सिंक नहीं, डिज़ाइन द्वारा।** OpenSpec कभी क्लोन नहीं करता, पुल नहीं करता या पुश नहीं करता। एक पुराना चेकआउट तब तक पुराने स्पेसिफिकेशन्स दिखाता रहता है जब तक कि *आप* पुल नहीं करते; संदर्भ डिस्क पर जो कुछ भी है उससे लाइव इंडेक्स किए जाते हैं।
- **कुछ कमांड वहीं रहते हैं।** `view`, `templates`, `schemas`, और अप्रचलित संज्ञा रूप (`openspec change show`, ...) केवल वर्तमान डायरेक्टरी पर कार्य करते हैं — कोई `--store` नहीं।
- **प्रति-मशीन स्थिति प्रति-मशीन है।** स्टोर रजिस्ट्री और वर्कसेट स्थानीय सेटिंग्स हैं। आपकी मशीन के लेआउट के बारे में कुछ भी कभी साझा प्लानिंग में कमिट नहीं किया जाता।
- **वर्कसेट के लिए दो लॉन्च शैलियाँ।** एक टूल जिसे वर्कस्पेस फ़ाइल या प्रति-फ़ोल्डर अटैच झंडों के साथ लॉन्च नहीं किया जा सकता, उसे ओपनर के रूप में जोड़ा नहीं जा सकता।
- **एजेंट JSON में एक ज्ञात केसिंग स्प्लिट है** (स्टोर-परिवार कुंजियाँ snake_case हैं, वर्कफ़्लो-परिवार camelCase)। [agent contract](../agent-contract.md) में प्रलेखित; इसे एकीकृत करना एक संस्करणित रिलीज़ के लिए स्थगित कर दिया गया है।

## चीज़ें कहाँ रहती हैं

| क्या | कहाँ | साझा? |
|---|---|---|
| एक स्टोर की प्लानिंग | `<store>/openspec/` (specs, changes) | हाँ — कमिट करें और पुश करें |
| एक स्टोर की पहचान | `<store>/.openspec-store/store.yaml` | हाँ — स्टोर के साथ कमिट किया गया है |
| स्टोर रजिस्ट्री | `<data dir>/openspec/stores/registry.yaml` | नहीं — यह केवल इस मशीन पर है |
| वर्कसेट | `<data dir>/openspec/worksets/` | नहीं — यह केवल इस मशीन पर है |

`<data dir>` macOS और Linux पर `~/.local/share/openspec` और Windows पर `$XDG_DATA_HOME/openspec` (जब सेट हो) या `%LOCALAPPDATA%\openspec` है।
## संदर्भ

इस पृष्ठ पर हर कमांड के लिए सटीक झंडे और JSON आकार:
[CLI reference](../cli.md) (Stores, Doctor, Working context, Personal worksets) और [agent contract](../agent-contract.md)।
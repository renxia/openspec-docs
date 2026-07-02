# इंस्टॉलेशन

## पूर्व आवश्यकताएँ (Prerequisites)

- **Node.js 20.19.0 या उच्चतर** — अपना संस्करण जांचें: `node --version`

## पैकेज मैनेजर (Package Managers)

### npm

```bash
npm install -g @fission-ai/openspec@latest
```

### pnpm

```bash
pnpm add -g @fission-ai/openspec@latest
```

### yarn

```bash
yarn global add @fission-ai/openspec@latest
```

### bun

Bun OpenSpec को ग्लोबली इंस्टॉल कर सकता है, लेकिन OpenSpec वर्तमान में Node.js पर चलता है। आपको अभी भी `PATH` पर Node.js 20.19.0 या उच्चतर उपलब्ध कराने की आवश्यकता है।

```bash
bun add -g @fission-ai/openspec@latest
```

## Nix

इंस्टॉलेशन के बिना सीधे OpenSpec चलाएँ:

```bash
nix run github:Fission-AI/OpenSpec -- init
```

या अपने प्रोफ़ाइल में इंस्टॉल करें:

```bash
nix profile install github:Fission-AI/OpenSpec
```

या `flake.nix` में अपने डेवलपमेंट एनवायरनमेंट में जोड़ें:

```nix
{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    openspec.url = "github:Fission-AI/OpenSpec";
  };

  outputs = { nixpkgs, openspec, ... }: {
    devShells.x86_64-linux.default = nixpkgs.legacyPackages.x86_64-linux.mkShell {
      buildInputs = [ openspec.packages.x86_64-linux.default ];
    };
  };
}
```

## इंस्टॉलेशन सत्यापित करें (Verify Installation)

```bash
openspec --version
```

## अपडेट करना (Updating)

पैकेज को अपग्रेड करें, फिर प्रत्येक प्रोजेक्ट की जनरेट की गई फ़ाइलों को रिफ्रेश करें:

```bash
npm install -g @fission-ai/openspec@latest   # or pnpm/yarn/bun equivalent
openspec update                              # run inside each project
```

`openspec update`, आपके द्वारा कॉन्फ़िगर किए गए टूल्स के लिए स्किल और कमांड फ़ाइलों को रीजेनरेट करता है, ताकि आपकी स्लैश कमांड्स (slash commands) इंस्टॉल किए गए संस्करण के साथ अद्यतन रहें।

## अनइंस्टॉल करना (Uninstalling)

कोई `openspec uninstall` कमांड नहीं है, क्योंकि OpenSpec केवल एक ग्लोबल पैकेज और आपके प्रोजेक्ट में कुछ फ़ाइलें हैं। इसे हटाने के लिए कुछ मैन्युअल चरणों की आवश्यकता होती है, और इनमें से कुछ भी आपके सोर्स कोड को छूता नहीं है।

**1. ग्लोबल पैकेज हटाएँ:**

```bash
npm uninstall -g @fission-ai/openspec   # or: pnpm rm -g / yarn global remove / bun rm -g
```

**2. प्रोजेक्ट से OpenSpec हटाएँ (वैकल्पिक)।** यदि आप अब इसके स्पेसिफिकेशन्स (specs) और परिवर्तनों (changes) को नहीं चाहते हैं, तो `openspec/` डायरेक्टरी को हटा दें:

```bash
rm -rf openspec/
```

ऐसा करने से पहले सोचें: `openspec/specs/` और `openspec/changes/archive/` सिस्टम के व्यवहार और यह क्यों बदला, इसका आपका रिकॉर्ड हैं। यदि आप उस इतिहास को चाहते हैं, तो अनइंस्टॉल करने के बाद भी फ़ोल्डर को रखें (या इसे git में रखें)।

**3. जनरेट की गई AI टूल फ़ाइलें हटाएँ (वैकल्पिक)।** OpenSpec प्रत्येक टूल की डायरेक्टरी में स्किल और कमांड फाइलें लिखता है, जैसे `.claude/skills/openspec-*/`, `.cursor/commands/opsx-*`, आदि। अपने द्वारा कॉन्फ़िगर किए गए टूल्स के लिए `openspec-*` स्किल्स और `opsx-*` कमांड्स को हटा दें। प्रत्येक टूल के सटीक पाथ [Supported Tools](supported-tools.md) में सूचीबद्ध हैं।

यदि आपके पास `CLAUDE.md` या `AGENTS.md` जैसी फ़ाइलों में OpenSpec मार्कर ब्लॉक भी हैं, तो उन्हें मैन्युअल रूप से हटा दें; उन फ़ाइलों में आपकी अपनी सामग्री आपकी है और उसे आप रख सकते हैं।

## अगले कदम (Next Steps)

इंस्टॉल करने के बाद, अपने प्रोजेक्ट में OpenSpec को इनिशियलाइज़ करें:

```bash
cd your-project
openspec init
```

पूरी walkthrough के लिए [Getting Started](getting-started.md) देखें।
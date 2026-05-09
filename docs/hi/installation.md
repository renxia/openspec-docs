# स्थापना

## पूर्वापेक्षाएँ

- **Node.js 20.19.0 या उच्चतर** — अपना संस्करण जाँचें: `node --version`

## पैकेज प्रबंधक

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

Bun OpenSpec को वैश्विक रूप से स्थापित कर सकता है, लेकिन OpenSpec वर्तमान में Node.js पर चलता है।
आपको अभी भी `PATH` पर Node.js 20.19.0 या उच्चतर उपलब्ध होना चाहिए।

```bash
bun add -g @fission-ai/openspec@latest
```

## Nix

स्थापना के बिना सीधे OpenSpec चलाएँ:

```bash
nix run github:Fission-AI/OpenSpec -- init
```

या अपनी प्रोफ़ाइल में स्थापित करें:

```bash
nix profile install github:Fission-AI/OpenSpec
```

या अपने `flake.nix` में अपने विकास वातावरण में जोड़ें:

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

## स्थापना सत्यापित करें

```bash
openspec --version
```

## अगले कदम

स्थापना के बाद, अपनी परियोजना में OpenSpec को प्रारंभ करें:

```bash
cd your-project
openspec init
```

पूर्ण वॉकथ्रू के लिए [शुरू करना](getting-started.md) देखें।
# स्थापना

## पूर्वावश्यकताएँ

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

```bash
bun add -g @fission-ai/openspec@latest
```

## Nix

बिना स्थापना के सीधे OpenSpec चलाएँ:

```bash
nix run github:Fission-AI/OpenSpec -- init
```

या अपनी प्रोफ़ाइल में स्थापित करें:

```bash
nix profile install github:Fission-AI/OpenSpec
```

या अपने विकास वातावरण में `flake.nix` में जोड़ें:

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

## स्थापना की पुष्टि करें

```bash
openspec --version
```

## अगले चरण

स्थापना के बाद, अपनी परियोजना में OpenSpec को प्रारंभ करें:

```bash
cd your-project
openspec init
```

पूरी वॉकथ्रू के लिए [आरंभ करना](getting-started.md) देखें।
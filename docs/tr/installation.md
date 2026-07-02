# Kurulum

## Önkoşullar

- **Node.js 20.19.0 veya üzeri** — Sürümünüzü kontrol edin: `node --version`

## Paket Yöneticileri

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

Bun, OpenSpec'i global olarak kurabilir, ancak OpenSpec şu anda Node.js üzerinde çalışmaktadır. Hala `PATH` üzerinde Node.js 20.19.0 veya üzeri bulundurmanız gerekmektedir.

```bash
bun add -g @fission-ai/openspec@latest
```

## Nix

Kurulum yapmadan doğrudan OpenSpec'i çalıştırın:

```bash
nix run github:Fission-AI/OpenSpec -- init
```

Veya profilinize kurun:

```bash
nix profile install github:Fission-AI/OpenSpec
```

Veya `flake.nix` dosyasında geliştirme ortamınıza ekleyin:

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

## Kurulumu Doğrulama

```bash
openspec --version
```

## Güncelleme

Paketi yükseltin, ardından her projenin oluşturulan dosyalarını yenileyin:

```bash
npm install -g @fission-ai/openspec@latest   # veya pnpm/yarn/bun karşılığı
openspec update                              # her proje içinde çalıştırın
```

`openspec update`, yapılandırdığınız araçlar için beceri (skill) ve komut dosyalarını yeniden oluşturur, böylece eğik çizgi (slash) komutlarınız kurulu sürümle güncel kalır.

## Kaldırma

`openspec uninstall` komutu yoktur, çünkü OpenSpec sadece bir global paket ve projenizdeki bazı dosyalardan oluşur. Kaldırma birkaç manuel adımdan ibarettir ve burada hiçbir şey kaynak kodunuza dokunmaz.

**1. Global paketi kaldırın:**

```bash
npm uninstall -g @fission-ai/openspec   # veya: pnpm rm -g / yarn global remove / bun rm -g
```

**2. Bir projeden OpenSpec'i kaldırın (isteğe bağlı).** Eğer artık onun spesifikasyonlarını ve değişikliklerini istemiyorsanız, `openspec/` dizinini silin:

```bash
rm -rf openspec/
```

Bunu yapmadan önce düşünün: `openspec/specs/` ve `openspec/changes/archive/`, sistemin nasıl davrandığına ve neden değiştiğine dair kaydınızdır. Bu geçmişe ihtiyaç duyarsanız, kaldırıldıktan sonra bile klasörü saklayın (veya git'te tutun).

**3. Oluşturulan yapay zeka (AI) araç dosyalarını kaldırın (isteğe bağlı).** OpenSpec, `.claude/skills/openspec-*`, `.cursor/commands/opsx-*` gibi her araca özel dizinlere beceri ve komut dosyaları yazar. Yapılandırdığınız hangi araçlar için ise `openspec-*` becerilerini ve `opsx-*` komutlarını silin. Araçlara ait kesin yollar [Desteklenen Araçlar](supported-tools.md)'da listelenmiştir.

Eğer `CLAUDE.md` veya `AGENTS.md` gibi dosyalarda OpenSpec işaretleyici blokları da varsa, bu blokları elle silin; o dosyalardaki kendi içeriğiniz size aittir.

## Sonraki Adımlar

Kurulumdan sonra projede OpenSpec'i başlatın:

```bash
cd your-project
openspec init
```

Tam bir rehber için [Başlangıç Rehberi](getting-started.md)'ne bakın.
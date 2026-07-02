# Instalación

## Requisitos Previos

- **Node.js 20.19.0 o superior** — Comprueba tu versión: `node --version`

## Gestores de Paquetes

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

Bun puede instalar OpenSpec globalmente, pero OpenSpec se ejecuta en Node.js. Todavía necesitas tener disponible Node.js 20.19.0 o superior en `PATH`.

```bash
bun add -g @fission-ai/openspec@latest
```

## Nix

Ejecuta OpenSpec directamente sin instalación:

```bash
nix run github:Fission-AI/OpenSpec -- init
```

O instálalo en tu perfil:

```bash
nix profile install github:Fission-AI/OpenSpec
```

O añádelo a tu entorno de desarrollo en `flake.nix`:

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

## Verificar la Instalación

```bash
openspec --version
```

## Actualización

Actualiza el paquete y luego refresca los archivos generados de cada proyecto:

```bash
npm install -g @fission-ai/openspec@latest   # o equivalente de pnpm/yarn/bun
openspec update                              # ejecuta dentro de cada proyecto
```

`openspec update` regenera los archivos de habilidades y comandos para las herramientas que has configurado, por lo que tus comandos de barra (slash) se mantienen actualizados con la versión instalada.

## Desinstalación

No existe un comando `openspec uninstall`, ya que OpenSpec es simplemente un paquete global más algunos archivos en tu proyecto. Eliminarlo requiere varios pasos manuales, y nada de esto toca tu código fuente.

**1. Eliminar el paquete global:**

```bash
npm uninstall -g @fission-ai/openspec   # o: pnpm rm -g / yarn global remove / bun rm -g
```

**2. Eliminar OpenSpec de un proyecto (opcional).** Borra el directorio `openspec/` si ya no deseas sus especificaciones y cambios:

```bash
rm -rf openspec/
```

Piensa bien antes de hacerlo: `openspec/specs/` y `openspec/changes/archive/` son tu registro de cómo se comporta el sistema y por qué cambió. Si pudieras querer ese historial, mantén la carpeta (o guárdala en git) incluso después de desinstalar.

**3. Eliminar los archivos de herramientas de IA generados (opcional).** OpenSpec escribe los archivos de habilidades y comandos en directorios por herramienta, como `.claude/skills/openspec-`, `.cursor/commands/opsx-`, y así sucesivamente. Elimina las habilidades `openspec-` y los comandos `opsx-` para las herramientas que hayas configurado. Las rutas exactas por herramienta se enumeran en [Supported Tools](supported-tools.md).

Si también tienes bloques de marcador de OpenSpec en archivos como `CLAUDE.md` o `AGENTS.md`, elimina esos bloques manualmente; tu propio contenido en esos archivos es tuyo.

## Próximos Pasos

Después de instalarlo, inicializa OpenSpec en tu proyecto:

```bash
cd your-project
openspec init
```

Consulta [Getting Started](getting-started.md) para un recorrido completo.
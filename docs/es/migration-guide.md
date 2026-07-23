# Migración a OPSX

Esta guía te ayuda a realizar la transición desde el flujo de trabajo heredado de OpenSpec a OPSX. La migración está diseñada para ser fluida —tu trabajo existente se conserva—, y el nuevo sistema ofrece mayor flexibilidad.

## ¿Qué está cambiando?

OPSX reemplaza el antiguo flujo de trabajo bloqueado por fases por un enfoque fluido basado en acciones. Este es el cambio clave:

| Aspecto | Heredado | OPSX |
|--------|--------|------|
| **Comandos** | `/openspec:proposal`, `/openspec:apply`, `/openspec:archive` | Predeterminado: `/opsx:propose`, `/opsx:apply`, `/opsx:sync`, `/opsx:archive` (comandos de flujo de trabajo ampliados opcionales) |
| **Flujo de trabajo** | Crear todos los artefactos de una sola vez | Crear de forma incremental o todos a la vez —tú eliges— |
| **Volver atrás** | Puertas de fase incómodas | Natural —actualiza cualquier artefacto en cualquier momento— |
| **Personalización** | Estructura fija | Basado en esquemas, totalmente hackeable |
| **Configuración** | `CLAUDE.md` con marcadores + `project.md` | Configuración limpia en `openspec/config.yaml` |

**El cambio de filosofía:** El trabajo no es lineal. OPSX deja de fingir que lo es.

---

## Antes de Empezar

### Tu trabajo existente está a salvo

El proceso de migración está diseñado pensando en la preservación:

- **Cambios activos en `openspec/changes/`** — Completamente conservados. Puedes continuarlos con comandos OPSX.
- **Cambios archivados** — Sin modificar. Tu historial se mantiene intacto.
- **Especificaciones principales en `openspec/specs/`** — Sin modificar. Estas son tu fuente de verdad.
- **Tu contenido en `CLAUDE.md`, `AGENTS.md`, etc.** — Conservado. Solo se eliminan los bloques de marcadores de OpenSpec; todo lo que escribiste se mantiene.

### Qué se elimina

Solo los archivos gestionados por OpenSpec que se están reemplazando:

| Qué | Por qué |
|------|-----|
| Directorios/archivos de comandos slash heredados | Reemplazados por el nuevo sistema de habilidades |
| `openspec/AGENTS.md` | Desencadenador de flujo de trabajo obsoleto |
| Marcadores de OpenSpec en `CLAUDE.md`, `AGENTS.md`, etc. | Ya no son necesarios |

**Ubicaciones de comandos heredados por herramienta** (ejemplos; tu herramienta puede variar):

- Claude Code: `.claude/commands/openspec/`
- Cursor: `.cursor/commands/openspec-*.md`
- Windsurf: `.windsurf/workflows/openspec-*.md`
- Cline: `.cinerules/workflows/openspec-*.md`
- Roo: `.roo/commands/openspec-*.md`
- GitHub Copilot: `.github/prompts/openspec-*.prompt.md` (solo extensiones de IDE; no compatible con Copilot CLI)
- Codex: OpenSpec ahora usa `.codex/skills/openspec-*`; la limpieza de elementos heredados solo se dirige a los nombres de archivo de prompts permitidos por OpenSpec en `$CODEX_HOME/prompts` o `~/.codex/prompts`, y solo los elimina después de que existan las habilidades de reemplazo.
- Y otras (Augment, Continue, Amazon Q, etc.)

La migración detecta las herramientas que tengas configuradas y limpia sus archivos heredados.

La lista de eliminación puede parecer larga, pero todos estos son archivos que OpenSpec creó originalmente. Tu propio contenido nunca se elimina.

### Qué requiere tu atención

Un archivo requiere migración manual:

**`openspec/project.md`** — Este archivo no se elimina automáticamente porque puede contener contexto del proyecto que hayas escrito. Necesitarás:

1. Revisar su contenido
2. Mover el contexto útil a `openspec/config.yaml` (ver la guía a continuación)
3. Eliminar el archivo cuando estés listo

**Por qué hicimos este cambio:**

El antiguo `project.md` era pasivo: los agentes podían leerlo, no, o olvidar lo que leyeron. Descubrimos que la fiabilidad era inconsistente.

El contexto del nuevo `config.yaml` se **inyecta activamente en cada solicitud de planificación de OpenSpec**. Esto significa que tus convenciones de proyecto, pila tecnológica y reglas siempre están presentes cuando la IA está creando artefactos. Mayor fiabilidad.

**La contrapartida:**

Como el contexto se inyecta en cada solicitud, querrás ser conciso. Céntrate en lo que realmente importa:
- Pila tecnológica y convenciones clave
- Restricciones no obvias que la IA necesita conocer
- Reglas que se ignoraban con frecuencia antes

No te preocupes por hacerlo perfecto. Todavía estamos aprendiendo qué funciona mejor aquí, y mejoraremos cómo funciona la inyección de contexto a medida que experimentemos.

---

## Ejecutar la migración

Tanto `openspec init` como `openspec update` detectan archivos heredados y te guían por el mismo proceso de limpieza. Usa el que se adapte a tu situación:

- Las instalaciones nuevas usan el perfil `core` por defecto (`propose`, `explore`, `apply`, `sync`, `archive`).
- Las instalaciones migradas conservan tus flujos de trabajo previamente instalados escribiendo un perfil `custom` cuando sea necesario.

### Usando `openspec init`

Ejecuta esto si quieres agregar nuevas herramientas o reconfigurar qué herramientas están configuradas:

```bash
openspec init
```

El comando `init` detecta archivos heredados y te guía por la limpieza:

```
Actualizando a la nueva versión de OpenSpec

OpenSpec ahora usa habilidades de agente, el estándar emergente entre los
agentes de codificación. Esto simplifica tu configuración mientras mantiene
todo funcionando como antes.

Archivos a eliminar
No hay contenido de usuario que conservar:
  • .claude/commands/openspec/
  • openspec/AGENTS.md

Archivos a actualizar
Se eliminarán los marcadores de OpenSpec, se conservará tu contenido:
  • CLAUDE.md
  • AGENTS.md

Requiere tu atención
  • openspec/project.md
    No eliminaremos este archivo. Puede contener contexto de proyecto útil.

    El nuevo openspec/config.yaml tiene una sección "context:" para el contexto
    de planificación. Esto se incluye en cada solicitud de OpenSpec y funciona
    de forma más fiable que el antiguo enfoque de project.md.

    Revisa project.md, mueve cualquier contenido útil a la sección context
    de config.yaml, luego elimina el archivo cuando estés listo.

¿Actualizar y limpiar archivos heredados? (S/n)
```

**Qué sucede cuando respondas que sí:**

1. Se eliminan los directorios de comandos slash heredados
2. Se eliminan los marcadores de OpenSpec de `CLAUDE.md`, `AGENTS.md`, etc. (tu contenido se mantiene)
3. Se elimina `openspec/AGENTS.md`
4. Se instalan nuevas habilidades en `.claude/skills/`
5. Se crea `openspec/config.yaml` con un esquema predeterminado

### Usando `openspec update`

Ejecuta esto si solo quieres migrar y actualizar tus herramientas existentes a la última versión:

```bash
openspec update
```

El comando `update` también detecta y limpia artefactos heredados, luego actualiza las habilidades/comandos generados para que coincidan con tu perfil y configuración de entrega actuales.

### Entornos no interactivos / de CI

Para migraciones con scripts:

```bash
openspec init --force --tools claude
```

El flag `--force` omite las solicitudes y acepta automáticamente la limpieza.

Esto incluye la limpieza de archivos de prompts de Codex gestionados por OpenSpec en el directorio global de prompts de Codex. La limpieza solo se dirige a los nombres de archivo de prompts heredados de Codex permitidos por OpenSpec, los elimina solo después de que existan las habilidades de reemplazo `.codex/skills/openspec-*`, y conserva todos los demás archivos.

---

## Migrar `project.md` a `config.yaml`

El antiguo `openspec/project.md` era un archivo markdown de formato libre para el contexto del proyecto. El nuevo `openspec/config.yaml` es estructurado y, lo que es más importante, se **inyecta en cada solicitud de planificación** para que tus convenciones siempre estén presentes cuando la IA trabaja.

### Antes (project.md)

```markdown
# Contexto del proyecto

Este es un monorepo de TypeScript que usa React y Node.js.
Usamos Jest para las pruebas y seguimos reglas estrictas de ESLint.
Nuestra API es RESTful y está documentada en docs/api.md.

## Convenciones

- Todas las APIs públicas deben mantener la compatibilidad con versiones anteriores
- Las nuevas funcionalidades deben incluir pruebas
- Usar el formato Given/When/Then para las especificaciones
```

### Después (config.yaml)

```yaml
schema: spec-driven

context: |
  Pila tecnológica: TypeScript, React, Node.js
  Pruebas: Jest con React Testing Library
  API: RESTful, documentada en docs/api.md
  Mantenemos la compatibilidad con versiones anteriores para todas las APIs públicas

rules:
  proposal:
    - Incluir plan de reversión para cambios riesgosos
  specs:
    - Usar el formato Given/When/Then para los escenarios
    - Referenciar patrones existentes antes de inventar nuevos
  design:
    - Incluir diagramas de secuencia para flujos complejos
```

### Diferencias clave

| project.md | config.yaml |
|------------|-------------|
| Markdown de formato libre | YAML estructurado |
| Un solo bloque de texto | Contexto separado y reglas por artefacto |
| No queda claro cuándo se usa | El contexto aparece en TODOS los artefactos; las reglas solo aparecen en los artefactos coincidentes |
| Sin selección de esquema | El campo explícito `schema:` establece el flujo de trabajo predeterminado |

### Qué conservar, qué eliminar

Al migrar, sé selectivo. Pregúntate: "¿Necesita la IA esto para *cada* solicitud de planificación?"

**Buenos candidatos para `context:`**
- Pila tecnológica (lenguajes, frameworks, bases de datos)
- Patrones arquitectónicos clave (monorepo, microservicios, etc.)
- Restricciones no obvias ("no podemos usar la biblioteca X porque...")
- Convenciones críticas que se ignoran con frecuencia

**Mueve esto a `rules:` en su lugar**
- Formato específico de artefacto ("usa Given/When/Then en las especificaciones")
- Criterios de revisión ("las propuestas deben incluir planes de reversión")
- Estos solo aparecen para el artefacto coincidente, manteniendo las demás solicitudes más ligeras

**Omite completamente**
- Buenas prácticas generales que la IA ya conoce
- Explicaciones extensas que se podrían resumir
- Contexto histórico que no afecta el trabajo actual

### Pasos de migración

1. **Crea `config.yaml`** (si no lo ha creado ya `init`):
   ```yaml
   schema: spec-driven
   ```

2. **Agrega tu contexto** (sé conciso; esto va en cada solicitud):
   ```yaml
   context: |
     El contexto de tu proyecto va aquí.
     Céntrate en lo que la IA necesita saber genuinamente.
   ```

3. **Agrega reglas por artefacto** (opcional):
   ```yaml
   rules:
     proposal:
       - Tu guía específica para propuestas
     specs:
       - Tus reglas para escribir especificaciones
   ```

4. **Elimina `project.md`** una vez que hayas movido todo lo útil.

**No le des demasiadas vueltas.** Empieza con lo esencial e itera. Si notas que la IA se pierde algo importante, agrégalo. Si el contexto se siente inflado, recórtalo. Este es un documento vivo.

### ¿Necesitas ayuda? Usa este prompt

Si no estás seguro de cómo resumir tu `project.md`, pregunta a tu asistente de IA:

```
Estoy migrando del antiguo project.md de OpenSpec al nuevo formato config.yaml.

Aquí está mi project.md actual:
[pega el contenido de tu project.md]

Por favor, ayúdame a crear un config.yaml con:
1. Una sección `context:` concisa (se inyecta en cada solicitud de planificación, así que mantenla ajustada: céntrate en la pila tecnológica, restricciones clave y convenciones que se ignoran con frecuencia)
2. `rules:` para artefactos específicos si hay contenido específico de artefacto (por ejemplo, "usa Given/When/Then" pertenece a las reglas de especificaciones, no al contexto global)

Omite cualquier cosa genérica que los modelos de IA ya conozcan. Sé implacable con la brevedad.
```

La IA te ayudará a identificar qué es esencial y qué se puede recortar.

---

## Los nuevos comandos

La disponibilidad de los comandos depende del perfil:

**Perfil predeterminado (`core`):**

| Comando | Propósito |
|---------|---------|
| `/opsx:propose` | Crea un cambio y genera artefactos de planificación en un solo paso |
| `/opsx:explore` | Reflexiona sobre ideas sin estructura |
| `/opsx:apply` | Implementa tareas desde `tasks.md` |
| `/opsx:archive` | Finaliza y archiva el cambio |

**Flujo de trabajo ampliado (selección personalizada):**

| Comando | Propósito |
|---------|---------|
| `/opsx:new` | Inicia un andamiaje de cambio nuevo |
| `/opsx:continue` | Crea el siguiente artefacto (uno a la vez) |
| `/opsx:ff` | Avance rápido: crea todos los artefactos de planificación de una vez |
| `/opsx:verify` | Valida que la implementación coincida con las especificaciones |
| `/opsx:sync` | Fusiona las especificaciones delta en las especificaciones principales |
| `/opsx:bulk-archive` | Archiva múltiples cambios a la vez |
| `/opsx:onboard` | Flujo de trabajo de incorporación guiado de extremo a extremo |

Habilita los comandos ampliados con `openspec config profile`, luego ejecuta `openspec update`.

### Mapeo de comandos desde la versión heredada

| Heredado | Equivalente en OPSX |
|---------|-----------------|
| `/openspec:proposal` | `/opsx:propose` (predeterminado) o `/opsx:new` seguido de `/opsx:ff` (ampliado) |
| `/openspec:apply` | `/opsx:apply` |
| `/openspec:archive` | `/opsx:archive` |

### Nuevas capacidades

Estas capacidades son parte del conjunto de comandos del flujo de trabajo ampliado.

**Creación de artefactos granular:**
```
/opsx:continue
```
Crea un artefacto a la vez en función de las dependencias. Úsalo cuando quieras revisar cada paso.

**Modo de exploración:**
```
/opsx:explore
```
Reflexiona sobre ideas con un compañero antes de comprometerte con un cambio.

---

## Entender la nueva arquitectura

### De fases bloqueadas a fluido

El flujo de trabajo heredado obligaba a una progresión lineal:

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│ PLANIFICACIÓN │ ───► │ IMPLEMENTACIÓN │ ───► │  ARCHIVADO  │
│    FASE     │      │    FASE     │      │    FASE     │
└──────────────┘      └──────────────┘      └──────────────┘

¿Estás en la fase de implementación y te das cuenta de que el diseño es incorrecto?
Qué lástima. Las puertas de fase no te permiten volver atrás fácilmente.
```

OPSX usa acciones, no fases:

```
         ┌───────────────────────────────────────────────┐
         │           ACCIONES (no fases)                 │
         │                                               │
         │     new ◄──► continue ◄──► apply ◄──► archive │
         │      │          │           │             │   │
         │      └──────────┴───────────┴─────────────┘   │
         │                    cualquier orden            │
         └───────────────────────────────────────────────┘
```

### Grafo de dependencias

Los artefactos forman un grafo dirigido. Las dependencias son habilitadores, no puertas:

```
                        proposal
                       (nodo raíz)
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
           specs                       design
        (requiere:                  (requiere:
         proposal)                   proposal)
              │                           │
              └─────────────┬─────────────┘
                            │
                            ▼
                         tasks
                     (requiere:
                     specs, design)
```

Cuando ejecutes `/opsx:continue`, comprueba qué está listo y ofrece el siguiente artefacto. También puedes crear múltiples artefactos listos en cualquier orden.

### Habilidades frente a comandos

El sistema heredado usaba archivos de comandos específicos de cada herramienta:

```
.claude/commands/openspec/
├── proposal.md
├── apply.md
└── archive.md
```

OPSX usa el estándar emergente de **habilidades**:

```
.claude/skills/
├── openspec-explore/SKILL.md
├── openspec-new-change/SKILL.md
├── openspec-continue-change/SKILL.md
├── openspec-apply-change/SKILL.md
└── ...
```

Las habilidades son reconocidas por múltiples herramientas de codificación con IA y proporcionan metadatos más ricos.

Codex solo usa habilidades en OPSX. OpenSpec ya no genera archivos de prompts personalizados de Codex; usa en su lugar los directorios `.codex/skills/openspec-*` generados.

## Continuando Cambios Existentes

Sus cambios en progreso funcionan perfectamente con los comandos de OPSX.

**¿Tiene un cambio activo del flujo de trabajo heredado?**

```
/opsx:apply add-my-feature
```

OPSX lee los artefactos existentes y continúa desde donde lo dejó.

**¿Desea agregar más artefactos a un cambio existente?**

```
/opsx:continue add-my-feature
```

Muestra lo que está listo para crear basado en lo que ya existe.

**¿Necesita ver el estado?**

```bash
openspec status --change add-my-feature
```

---

## El Nuevo Sistema de Configuración

### Estructura de config.yaml

```yaml
# Requerido: Esquema predeterminado para nuevos cambios
schema: spec-driven

# Opcional: Contexto del proyecto (máx. 50KB)
# Inyectado en TODAS las instrucciones de artefactos
context: |
  Antecedentes de su proyecto, pila tecnológica,
  convenciones y restricciones.

# Opcional: Reglas por artefacto
# Solo inyectado en artefactos coincidentes
rules:
  proposal:
    - Incluir plan de reversión
  specs:
    - Usar formato Given/When/Then
  design:
    - Documentar estrategias de respaldo
  tasks:
    - Dividir en partes de máximo 2 horas
```

### Resolución de Esquemas

Al determinar qué esquema usar, OPSX verifica en el siguiente orden:

1. **Bandera CLI**: `--schema <name>` (mayor prioridad)
2. **Metadatos del cambio**: `.openspec.yaml` en el directorio del cambio
3. **Configuración del proyecto**: `openspec/config.yaml`
4. **Predeterminado**: `spec-driven`

### Esquemas Disponibles

| Esquema | Artefactos | Mejor Para |
|--------|-----------|------------|
| `spec-driven` | proposal → specs → design → tasks | La mayoría de proyectos |

Listar todos los esquemas disponibles:

```bash
openspec schemas
```

### Esquemas Personalizados

Cree su propio flujo de trabajo:

```bash
openspec schema init my-workflow
```

O bifurque uno existente:

```bash
openspec schema fork spec-driven my-workflow
```

Consulte [Personalización](customization.md) para obtener más detalles.

---

## Solución de Problemas

### "Archivos heredados detectados en modo no interactivo"

Está ejecutando en un entorno de CI o no interactivo. Use:

```bash
openspec init --force
```

### Comandos que no aparecen después de la migración

Reinicie su IDE. Las habilidades se detectan al inicio.

### "ID de artefacto desconocido en las reglas"

Verifique que las claves de su `rules:` coincidan con los IDs de artefacto de su esquema:

- **spec-driven**: `proposal`, `specs`, `design`, `tasks`

Ejecute esto para ver los IDs de artefacto válidos:

```bash
openspec schemas --json
```

### La configuración no se está aplicando

1. Asegúrese de que el archivo esté en `openspec/config.yaml` (no `.yml`)
2. Valide la sintaxis YAML
3. Los cambios de configuración surten efecto inmediatamente, no es necesario reiniciar

### project.md no migrado

El sistema preserva intencionalmente `project.md` porque puede contener su contenido personalizado. Revíselo manualmente, mueva las partes útiles a `config.yaml`, luego elimínelo.

### ¿Desea ver qué se limpiaría?

Ejecute init y rechace el aviso de limpieza, verá el resumen completo de detección sin que se realicen cambios.

---

## Referencia Rápida

### Archivos Después de la Migración

```
project/
├── openspec/
│   ├── specs/                    # Sin cambios
│   ├── changes/                  # Sin cambios
│   │   └── archive/              # Sin cambios
│   └── config.yaml               # NUEVO: Configuración del proyecto
├── .claude/
│   └── skills/                   # NUEVO: Habilidades de OPSX
│       ├── openspec-propose/     # perfil core predeterminado
│       ├── openspec-explore/
│       ├── openspec-apply-change/
│       ├── openspec-sync-specs/
│       └── ...                   # el perfil expandido agrega new/continue/ff/etc.
├── CLAUDE.md                     # Marcadores de OpenSpec eliminados, su contenido preservado
└── AGENTS.md                     # Marcadores de OpenSpec eliminados, su contenido preservado
```

### Qué se eliminó

- `.claude/commands/openspec/` — reemplazado por `.claude/skills/`
- `openspec/AGENTS.md` — obsoleto
- `openspec/project.md` — migrar a `config.yaml`, luego eliminar
- Bloques de marcadores de OpenSpec en `CLAUDE.md`, `AGENTS.md`, etc.

### Hoja de Referencia de Comandos

```text
/opsx:propose      Iniciar rápidamente (perfil core predeterminado)
/opsx:apply        Implementar tareas
/opsx:archive      Finalizar y archivar

# Flujo de trabajo expandido (si está habilitado):
/opsx:new          Generar estructura de un cambio
/opsx:continue     Crear siguiente artefacto
/opsx:ff           Crear artefactos de planificación
```

---

## Obteniendo Ayuda

- **Discord**: [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **Problemas de GitHub**: [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **Documentación**: [docs/opsx.md](opsx.md) para la referencia completa de OPSX
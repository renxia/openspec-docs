# Migración a OPSX

Esta guía te ayuda a transicionar del flujo de trabajo heredado de OpenSpec a OPSX. La migración está diseñada para ser fluida: tu trabajo existente se conserva, y el nuevo sistema ofrece mayor flexibilidad.

## ¿Qué está cambiando?

OPSX reemplaza el antiguo flujo de trabajo bloqueado por fases con un enfoque fluido basado en acciones. Aquí está el cambio clave:

| Aspecto | Heredado | OPSX |
|--------|--------|------|
| **Comandos** | `/openspec:proposal`, `/openspec:apply`, `/openspec:archive` | Por defecto: `/opsx:propose`, `/opsx:apply`, `/opsx:archive` (comandos de flujo de trabajo extendidos opcionales) |
| **Flujo de trabajo** | Crear todos los artefactos de una vez | Crear incrementalmente o todos a la vez—tú eliges |
| **Retroceso** | Puertas de fase incómodas | Natural—actualizar cualquier artefacto en cualquier momento |
| **Personalización** | Estructura fija | Basado en esquema, totalmente hackeable |
| **Configuración** | `CLAUDE.md` con marcadores + `project.md` | Configuración limpia en `openspec/config.yaml` |

**El cambio de filosofía:** El trabajo no es lineal. OPSX deja de pretender que lo es.

---

## Antes de Comenzar

### Tu Trabajo Existente está Seguro

El proceso de migración está diseñado con la preservación en mente:

- **Cambios activos en `openspec/changes/`** — Completamente preservados. Puedes continuarlos con los comandos OPSX.
- **Cambios archivados** — Intactos. Tu historial permanece intacto.
- **Especificaciones principales en `openspec/specs/`** — Intactas. Estas son tu fuente de verdad.
- **Tu contenido en CLAUDE.md, AGENTS.md, etc.** — Preservado. Solo se eliminan los bloques de marcadores de OpenSpec; todo lo que escribiste permanece.

### Qué se Elimina

Solo los archivos gestionados por OpenSpec que están siendo reemplazados:

| Qué | Por qué |
|------|---------|
| Directorios/archivos de comandos slash heredados | Reemplazados por el nuevo sistema de habilidades |
| `openspec/AGENTS.md` | Disparador de flujo de trabajo obsoleto |
| Marcadores de OpenSpec en `CLAUDE.md`, `AGENTS.md`, etc. | Ya no son necesarios |

**Ubicaciones de comandos heredados por herramienta** (ejemplos—tu herramienta puede variar):

- Claude Code: `.claude/commands/openspec/`
- Cursor: `.cursor/commands/openspec-*.md`
- Windsurf: `.windsurf/workflows/openspec-*.md`
- Cline: `.clinerules/workflows/openspec-*.md`
- Roo: `.roo/commands/openspec-*.md`
- GitHub Copilot: `.github/prompts/openspec-*.prompt.md` (solo extensiones IDE; no compatible con Copilot CLI)
- Y otros (Augment, Continue, Amazon Q, etc.)

La migración detecta las herramientas que tengas configuradas y limpia sus archivos heredados.

La lista de eliminación puede parecer larga, pero estos son todos archivos que OpenSpec creó originalmente. Tu propio contenido nunca se elimina.

### Lo que Requiere tu Atención

Un archivo requiere migración manual:

**`openspec/project.md`** — Este archivo no se elimina automáticamente porque puede contener contexto del proyecto que hayas escrito. Necesitarás:

1. Revisar su contenido
2. Mover el contexto útil a `openspec/config.yaml` (consulta la guía a continuación)
3. Eliminar el archivo cuando estés listo

**Por qué hicimos este cambio:**

El antiguo `project.md` era pasivo—los agentes podrían leerlo, podrían no hacerlo, podrían olvidar lo que leyeron. Encontramos que la fiabilidad era inconsistente.

El nuevo contexto en `config.yaml` se **inyecta activamente en cada solicitud de planificación de OpenSpec**. Esto significa que tus convenciones de proyecto, pila tecnológica y reglas siempre están presentes cuando la IA está creando artefactos. Mayor fiabilidad.

**El compromiso:**

Debido a que el contexto se inyecta en cada solicitud, querrás ser conciso. Concéntrate en lo que realmente importa:
- Pila tecnológica y convenciones clave
- Restricciones no obvias que la IA necesita conocer
- Reglas que frecuentemente se ignoraban antes

No te preocupes por hacerlo perfecto. Aún estamos aprendiendo qué funciona mejor aquí, y mejoraremos cómo funciona la inyección de contexto a medida que experimentemos.

---

## Ejecutando la Migración

Tanto `openspec init` como `openspec update` detectan archivos heredados y te guían a través del mismo proceso de limpieza. Usa el que se ajuste a tu situación:

- Las instalaciones nuevas usan por defecto el perfil `core` (`propose`, `explore`, `apply`, `archive`).
- Las instalaciones migradas preservan tus flujos de trabajo previamente instalados escribiendo un perfil `custom` cuando sea necesario.

### Usando `openspec init`

Ejecuta esto si quieres agregar nuevas herramientas o reconfigurar qué herramientas están configuradas:

```bash
openspec init
```

El comando init detecta archivos heredados y te guía a través de la limpieza:

```
Actualizando al nuevo OpenSpec

OpenSpec ahora usa habilidades de agente, el estándar emergente en agentes de
codificación. Esto simplifica tu configuración mientras mantiene todo funcionando
como antes.

Archivos a eliminar
Sin contenido de usuario que preservar:
  • .claude/commands/openspec/
  • openspec/AGENTS.md

Archivos a actualizar
Los marcadores de OpenSpec se eliminarán, tu contenido se preservará:
  • CLAUDE.md
  • AGENTS.md

Requiere tu atención
  • openspec/project.md
    No eliminaremos este archivo. Puede contener contexto útil del proyecto.

    El nuevo openspec/config.yaml tiene una sección "context:" para el contexto
    de planificación. Esto se incluye en cada solicitud de OpenSpec y funciona de
    manera más fiable que el antiguo enfoque de project.md.

    Revisa project.md, mueve cualquier contenido útil a la sección context de
    config.yaml, luego elimina el archivo cuando estés listo.

¿Actualizar y limpiar archivos heredados? (S/n)
```

**Qué sucede cuando dices sí:**

1. Se eliminan los directorios de comandos slash heredados
2. Se eliminan los marcadores de OpenSpec de `CLAUDE.md`, `AGENTS.md`, etc. (tu contenido permanece)
3. Se elimina `openspec/AGENTS.md`
4. Se instalan nuevas habilidades en `.claude/skills/`
5. Se crea `openspec/config.yaml` con un esquema predeterminado

### Usando `openspec update`

Ejecuta esto si solo quieres migrar y actualizar tus herramientas existentes a la última versión:

```bash
openspec update
```

El comando update también detecta y limpia artefactos heredados, luego actualiza las habilidades/comandos generados para que coincidan con tu perfil y configuración de entrega actuales.

### Entornos No Interactivos / CI

Para migraciones scripteadas:

```bash
openspec init --force --tools claude
```

La bandera `--force` omite las preguntas y acepta automáticamente la limpieza.

---

## Migrando project.md a config.yaml

El antiguo `openspec/project.md` era un archivo markdown libre para el contexto del proyecto. El nuevo `openspec/config.yaml` es estructurado y—críticamente—**se inyecta en cada solicitud de planificación** para que tus convenciones siempre estén presentes cuando la IA trabaje.

### Antes (project.md)

```markdown
# Contexto del Proyecto

Este es un monorepo de TypeScript usando React y Node.js.
Usamos Jest para pruebas y seguimos reglas estrictas de ESLint.
Nuestra API es RESTful y está documentada en docs/api.md.

## Convenciones

- Todas las APIs públicas deben mantener compatibilidad hacia atrás
- Las nuevas características deben incluir pruebas
- Usar el formato Given/When/Then para especificaciones
```

### Después (config.yaml)

```yaml
schema: spec-driven

context: |
  Pila tecnológica: TypeScript, React, Node.js
  Pruebas: Jest con React Testing Library
  API: RESTful, documentada en docs/api.md
  Mantenemos compatibilidad hacia atrás para todas las APIs públicas

rules:
  proposal:
    - Incluir plan de reversión para cambios riesgosos
  specs:
    - Usar formato Given/When/Then para escenarios
    - Referenciar patrones existentes antes de inventar nuevos
  design:
    - Incluir diagramas de secuencia para flujos complejos
```

### Diferencias Clave

| project.md | config.yaml |
|------------|-------------|
| Markdown libre | YAML estructurado |
| Un bloque de texto | Contexto separado y reglas por artefacto |
| No está claro cuándo se usa | El contexto aparece en TODOS los artefactos; las reglas aparecen solo en los artefactos correspondientes |
| Sin selección de esquema | Campo explícito `schema:` establece el flujo de trabajo predeterminado |

### Qué Conservar, Qué Descartar

Al migrar, sé selectivo. Pregúntate: "¿La IA necesita esto para *cada* solicitud de planificación?"

**Buenos candidatos para `context:`**
- Pila tecnológica (lenguajes, frameworks, bases de datos)
- Patrones arquitectónicos clave (monorepo, microservicios, etc.)
- Restricciones no obvias ("no podemos usar la biblioteca X porque...")
- Convenciones críticas que frecuentemente se ignoran

**Mover a `rules:` en su lugar**
- Formato específico de artefacto ("usar Given/When/Then en specs")
- Criterios de revisión ("las propuestas deben incluir planes de reversión")
- Estos solo aparecen para el artefacto correspondiente, manteniendo otras solicitudes más ligeras

**Omitir por completo**
- Mejores prácticas generales que la IA ya conoce
- Explicaciones verbosas que podrían resumirse
- Contexto histórico que no afecta el trabajo actual

### Pasos de Migración

1. **Crear config.yaml** (si no fue creado ya por init):
   ```yaml
   schema: spec-driven
   ```

2. **Agregar tu contexto** (sé conciso—esto va en cada solicitud):
   ```yaml
   context: |
     El contexto de tu proyecto va aquí.
     Concéntrate en lo que la IA realmente necesita saber.
   ```

3. **Agregar reglas por artefacto** (opcional):
   ```yaml
   rules:
     proposal:
       - Tu guía específica para propuestas
     specs:
       - Tus reglas de escritura de especificaciones
   ```

4. **Eliminar project.md** una vez que hayas movido todo lo útil.

**No lo pienses demasiado.** Comienza con lo esencial e itera. Si notas que la IA se pierde algo importante, agrégalo. Si el contexto se siente inflado, recórtalo. Este es un documento vivo.

### ¿Necesitas Ayuda? Usa Este Prompt

Si no estás seguro de cómo destilar tu project.md, pregunta a tu asistente de IA:

```
Estoy migrando del antiguo project.md de OpenSpec al nuevo formato config.yaml.

Aquí está mi project.md actual:
[pega el contenido de tu project.md]

Por favor, ayúdame a crear un config.yaml con:
1. Una sección `context:` concisa (esto se inyecta en cada solicitud de planificación, así que mantenla enfocada—concéntrate en la pila tecnológica, restricciones clave y convenciones que frecuentemente se ignoran)
2. `rules:` para artefactos específicos si algún contenido es específico de un artefacto (por ejemplo, "usar Given/When/Then" pertenece a las reglas de specs, no al contexto global)

Omite cualquier cosa genérica que los modelos de IA ya sepan. Sé implacable con la brevedad.
```

La IA te ayudará a identificar qué es esencial y qué puede recortarse.

---

## Los Nuevos Comandos

La disponibilidad de comandos depende del perfil:

**Predeterminado (perfil `core`):**

| Comando | Propósito |
|---------|---------|
| `/opsx:propose` | Crear un cambio y generar artefactos de planificación en un solo paso |
| `/opsx:explore` | Pensar en ideas sin estructura |
| `/opsx:apply` | Implementar tareas desde tasks.md |
| `/opsx:archive` | Finalizar y archivar el cambio |

**Flujo de trabajo ampliado (selección personalizada):**

| Comando | Propósito |
|---------|---------|
| `/opsx:new` | Iniciar un nuevo andamiaje de cambio |
| `/opsx:continue` | Crear el siguiente artefacto (uno a la vez) |
| `/opsx:ff` | Avance rápido—crear artefactos de planificación todos a la vez |
| `/opsx:verify` | Validar que la implementación coincida con las especificaciones |
| `/opsx:sync` | Vista previa/fusión de especificaciones sin archivar |
| `/opsx:bulk-archive` | Archivar múltiples cambios a la vez |
| `/opsx:onboard` | Flujo de trabajo guiado de incorporación de principio a fin |

Habilita los comandos ampliados con `openspec config profile`, luego ejecuta `openspec update`.

### Mapeo de Comandos desde el Heredado

| Heredado | Equivalente OPSX |
|----------|------------------|
| `/openspec:proposal` | `/opsx:propose` (predeterminado) o `/opsx:new` luego `/opsx:ff` (ampliado) |
| `/openspec:apply` | `/opsx:apply` |
| `/openspec:archive` | `/opsx:archive` |

### Nuevas Capacidades

Estas capacidades son parte del conjunto de comandos del flujo de trabajo ampliado.

**Creación granular de artefactos:**
```
/opsx:continue
```
Crea un artefacto a la vez basado en dependencias. Usa esto cuando quieras revisar cada paso.

**Modo exploración:**
```
/opsx:explore
```
Piensa en ideas con un compañero antes de comprometerte con un cambio.

---

## Comprendiendo la Nueva Arquitectura

### De Bloqueado por Fases a Fluido

El flujo de trabajo heredado forzaba una progresión lineal:

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   PLANIFICACIÓN   │ ───► │ IMPLEMENTACIÓN │ ───► │   ARCHIVADO  │
│    FASE     │      │    FASE     │      │    FASE     │
└──────────────┘      └──────────────┘      └──────────────┘

Si estás en la implementación y te das cuenta de que el diseño es incorrecto?
Mala suerte. Las compuertas de fase no te permiten volver fácilmente.
```

OPSX usa acciones, no fases:

```
         ┌───────────────────────────────────────────────┐
         │           ACCIONES (no fases)                 │
         │                                               │
         │     new ◄──► continue ◄──► apply ◄──► archive │
         │      │          │           │             │   │
         │      └──────────┴───────────┴─────────────┘   │
         │                    en cualquier orden         │
         └───────────────────────────────────────────────┘
```

### Grafo de Dependencias

Los artefactos forman un grafo dirigido. Las dependencias son habilitadores, no compuertas:

```
                        propuesta
                       (nodo raíz)
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
           especificaciones               diseño
        (requiere:                  (requiere:
         propuesta)                   propuesta)
              │                           │
              └─────────────┬─────────────┘
                            │
                            ▼
                         tareas
                     (requiere:
                     especificaciones, diseño)
```

Cuando ejecutas `/opsx:continue`, verifica qué está listo y ofrece el siguiente artefacto. También puedes crear múltiples artefactos listos en cualquier orden.

### Habilidades vs Comandos

El sistema heredado usaba archivos de comandos específicos para herramientas:

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

---

## Continuando Cambios Existentes

Tus cambios en progreso funcionan sin problemas con los comandos de OPSX.

**¿Tienes un cambio activo del flujo de trabajo heredado?**

```
/opsx:apply add-my-feature
```

OPSX lee los artefactos existentes y continúa desde donde lo dejaste.

**¿Quieres agregar más artefactos a un cambio existente?**

```
/opsx:continue add-my-feature
```

Muestra qué está listo para crear basándose en lo que ya existe.

**¿Necesitas ver el estado?**

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
# Se inyecta en TODAS las instrucciones de artefactos
context: |
  Antecedentes de tu proyecto, pila tecnológica,
  convenciones y restricciones.

# Opcional: Reglas por artefacto
# Solo se inyectan en los artefactos correspondientes
rules:
  proposal:
    - Incluir plan de reversión
  specs:
    - Usar formato Dado/Cuando/Entonces
  design:
    - Documentar estrategias de respaldo
  tasks:
    - Dividir en bloques máximos de 2 horas
```

### Resolución del Esquema

Al determinar qué esquema usar, OPSX verifica en este orden:

1. **Bandera de CLI**: `--schema <nombre>` (mayor prioridad)
2. **Metadatos del cambio**: `.openspec.yaml` en el directorio del cambio
3. **Configuración del proyecto**: `openspec/config.yaml`
4. **Predeterminado**: `spec-driven`

### Esquemas Disponibles

| Esquema | Artefactos | Ideal para |
|--------|-----------|----------|
| `spec-driven` | propuesta → especificaciones → diseño → tareas | La mayoría de los proyectos |

Lista todos los esquemas disponibles:

```bash
openspec schemas
```

### Esquemas Personalizados

Crea tu propio flujo de trabajo:

```bash
openspec schema init my-workflow
```

O bifurca uno existente:

```bash
openspec schema fork spec-driven my-workflow
```

Consulta [Personalización](customization.md) para más detalles.

---

## Solución de Problemas

### "Legacy files detected in non-interactive mode"

Estás ejecutando en un entorno CI o no interactivo. Usa:

```bash
openspec init --force
```

### Los comandos no aparecen después de la migración

Reinicia tu IDE. Las habilidades se detectan al iniciar.

### "Unknown artifact ID in rules"

Verifica que las claves de `rules:` coincidan con los IDs de artefacto de tu esquema:

- **spec-driven**: `proposal`, `specs`, `design`, `tasks`

Ejecuta esto para ver los IDs de artefacto válidos:

```bash
openspec schemas --json
```

### La configuración no se aplica

1. Asegúrate de que el archivo esté en `openspec/config.yaml` (no `.yml`)
2. Valida la sintaxis YAML
3. Los cambios de configuración surten efecto inmediatamente—no se necesita reinicio

### project.md no se migra

El sistema preserva intencionalmente `project.md` porque puede contener tu contenido personalizado. Revísalo manualmente, mueve las partes útiles a `config.yaml`, y luego elimínalo.

### ¿Quieres ver qué se limpiaría?

Ejecuta init y rechaza el aviso de limpieza—verás el resumen completo de detección sin que se realice ningún cambio.

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
│   └── skills/                   # NUEVO: Habilidades OPSX
│       ├── openspec-propose/     # perfil principal predeterminado
│       ├── openspec-explore/
│       ├── openspec-apply-change/
│       └── ...                   # perfil expandido añade new/continue/ff/etc.
├── CLAUDE.md                     # Marcadores OpenSpec eliminados, tu contenido preservado
└── AGENTS.md                     # Marcadores OpenSpec eliminados, tu contenido preservado
```

### Qué se Eliminó

- `.claude/commands/openspec/` — reemplazado por `.claude/skills/`
- `openspec/AGENTS.md` — obsoleto
- `openspec/project.md` — migrar a `config.yaml`, luego eliminar
- Bloques de marcadores OpenSpec en `CLAUDE.md`, `AGENTS.md`, etc.

### Hoja de Referencia de Comandos

```text
/opsx:propose      Iniciar rápidamente (perfil principal predeterminado)
/opsx:apply        Implementar tareas
/opsx:archive      Finalizar y archivar

# Flujo de trabajo expandido (si está habilitado):
/opsx:new          Crear estructura para un cambio
/opsx:continue     Crear siguiente artefacto
/opsx:ff           Crear artefactos de planificación
```

---

## Obtener Ayuda

- **Discord**: [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues**: [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **Documentación**: [docs/opsx.md](opsx.md) para la referencia completa de OPSX
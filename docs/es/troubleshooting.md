# Solución de Problemas (Troubleshooting)

Soluciones concretas para problemas concretos. Cada entrada nombra un síntoma, explica la causa probable en una oración y te da la solución. Si no ves tu problema aquí, el [FAQ](faq.md) puede ayudar, y el [Discord](https://discord.gg/YctCnvvshC) definitivamente lo hará.

## Instalación y configuración (Installation and setup)

### `openspec: command not found`

El CLI no está instalado o tu shell no puede encontrarlo. Instálalo globalmente y comprueba:

```bash
npm install -g @fission-ai/openspec@latest
openspec --version
```

Si se instaló pero aún no se encuentra, es probable que el directorio binario global de npm no esté en tu `PATH`. Ejecuta `npm bin -g` para ver dónde residen los binarios globales y asegúrate de que esa ruta esté en el perfil de tu shell.

### "Requires Node.js 20.19.0 or higher"

OpenSpec se ejecuta con Node 20.19.0+. Comprueba tu versión y actualiza si es necesario:

```bash
node --version
```

Si utilizas bun para instalar OpenSpec, ten en cuenta que OpenSpec sigue *ejecutándose* con Node, por lo que necesitas tener disponible Node 20.19.0+ en tu `PATH` de todos modos. Consulta [Instalación](installation.md).

### `openspec init` no configuró mi herramienta de IA

Init pregunta qué herramientas configurar. Si omitiste tu herramienta o quieres añadir otra, simplemente ejecútalo de nuevo o usa la forma no interactiva:

```bash
openspec init --tools claude,cursor
```

La lista completa de IDs de herramientas está en [Supported Tools](supported-tools.md). Usa `--tools all` para todo y `--tools none` para omitir la configuración de herramientas.

## Los comandos no aparecen (Commands don't show up)

Si `/opsx:propose` (o el equivalente de tu herramienta) no aparece o no hace nada, revisa esta lista. Están ordenados del más rápido de comprobar al primero.

1. **Es posible que estés en el lugar equivocado.** Los comandos slash van en el chat de tu asistente de IA, no en tu terminal. Si escribiste `/opsx:propose` en tu shell, ese es el problema. Consulta [Cómo funcionan los Comandos](how-commands-work.md).

2. **Regenera los archivos.** Desde la raíz de tu proyecto:

   ```bash
   openspec update
   ```

   Esto reescribe los archivos de habilidades y comandos para cada herramienta que has configurado.

3. **Reinicia tu asistente.** La mayoría de las herramientas escanean en busca de habilidades y comandos al iniciarse. Una ventana fresca suele hacerlo.

4. **Confirma que los archivos existen.** Para Claude Code, comprueba que `.claude/skills/` contiene carpetas `openspec-*`. Otras herramientas usan sus propios directorios, todos listados en [Supported Tools](supported-tools.md).

5. **Confirma que inicializaste este proyecto.** Las habilidades se escriben por proyecto. Si clonaste un repositorio o cambiaste de carpeta, ejecuta `openspec init` (o `openspec update`) allí.

6. **Confirma que tu herramienta soporta archivos de comandos.** Algunas herramientas (Kimi CLI, Trae, ForgeCode, Mistral Vibe) no generan archivos de comandos `opsx-*`; utilizan invocaciones basadas en habilidades en su lugar. Las formas son diferentes para cada herramienta: consulta [Supported Tools](supported-tools.md) y [Cómo funcionan los Comandos](how-commands-work.md#slash-command-syntax-by-tool).

## Trabajando con cambios (Working with changes)

### "Change not found" (Cambio no encontrado)

El comando no pudo indicar qué cambio querías. Nómbralo explícitamente o comprueba lo que existe:

```bash
openspec list                    # ver los cambios activos
/opsx:apply add-dark-mode        # nombrar el cambio en el chat
```

Confirma también que estás en el directorio de proyecto correcto.

### "No artifacts ready" (Ningún artefacto listo)

Cada artefacto está ya creado o bloqueado esperando una dependencia. Mira qué lo está bloqueando:

```bash
openspec status --change <name>
```

Luego crea la dependencia faltante primero. Recuerda el orden: propuesta habilita especificaciones y diseño; las especificaciones y el diseño juntos habilitan tareas.

### `openspec validate` reporta advertencias o errores

La validación comprueba tus especificaciones y cambios en busca de problemas estructurales. Lee el mensaje: nombra el archivo y el problema.

```bash
openspec validate <name>           # validar un elemento
openspec validate --all            # validar todo
openspec validate --all --strict   # comprobaciones más estrictas, bueno para CI
```

Las causas comunes son una sección requerida faltante (como una especificación sin escenarios) o un encabezado delta malformado. Arregla el archivo y vuelve a ejecutar. La [referencia CLI](cli.md#openspec-validate) documenta el formato de salida.

### La IA creó artefactos incompletos o incorrectos

La IA no tuvo suficiente contexto. Algunas palancas ayudan:

- Añade contexto del proyecto en `openspec/config.yaml` para que tu pila y convenciones se inyecten en cada solicitud. Consulta [Personalización](customization.md#project-configuration).
- Añade `rules:` por artefacto para orientación que solo aplique a, digamos, las especificaciones.
- Proporciona una descripción más detallada cuando propongas algo.
- Usa el expandido `/opsx:continue` para crear un artefacto a la vez y revisarlos cada uno, en lugar de que `/opsx:ff` los haga todos a la vez.

### Archive no termina o advierte sobre tareas incompletas

Archive no va a *bloquear* por tareas incompletas, pero te advierte, porque archivar generalmente significa que el trabajo está hecho. Si las tareas permanecen intencionalmente (estás archivando un cambio parcial), procede. De lo contrario, termina primero las tareas. Archive también ofrecerá sincronizar tus especificaciones delta con las especificaciones principales si aún no has sincronizado; di sí a menos que tengas una razón para no hacerlo.

## Configuración (Configuration)

### Mi `config.yaml` no está siendo aplicado

Tres sospechosos habituales:

1. **Nombre de archivo incorrecto.** Debe ser `openspec/config.yaml`, no `.yml`.
2. **YAML inválido.** Ejecútalo a través de cualquier validador YAML; el CLI también reporta errores de sintaxis con números de línea.
3. **Esperabas un reinicio.** No lo necesitas. Los cambios de configuración surten efecto inmediatamente.

### "Unknown artifact ID in rules: X" (ID de artefacto desconocido en reglas: X)

Una clave bajo `rules:` no coincide con ningún artefacto en tu esquema. Para el esquema predeterminado `spec-driven`, los IDs válidos son `proposal`, `specs`, `design` y `tasks`. Para ver los IDs de cualquier esquema:

```bash
openspec schemas --json
```

### "Context too large" (Contexto demasiado grande)

El campo `context:` está limitado a 50KB, deliberadamente, porque se inyecta en cada solicitud. Resúmelo o enlaza a documentación más larga en lugar de pegarlo. Un contexto conciso también produce resultados mejores y más rápidos.

### "Schema not found" (Esquema no encontrado)

El nombre del esquema que referenciaste no existe. Lista lo disponible y comprueba la ortografía:

```bash
openspec schemas                    # listar esquemas disponibles
openspec schema which <name>        # ver de dónde se resuelve un esquema
openspec schema init <name>         # crear uno personalizado
```

Consulta [Personalización](customization.md#custom-schemas).

## Migración del flujo de trabajo heredado (Migration from the legacy workflow)

### "Legacy files detected in non-interactive mode" (Archivos heredados detectados en modo no interactivo)

Estás en CI o en un shell no interactivo, y OpenSpec encontró archivos antiguos para limpiar pero no puede preguntarte. Aprueba automáticamente:

```bash
openspec init --force
```

### Los comandos no aparecieron después de la migración

Reinicia tu IDE. Las habilidades se detectan al iniciar. Si aún no aparecen, ejecuta `openspec update` y comprueba las ubicaciones de los archivos en [Supported Tools](supported-tools.md).

### Mi antiguo `project.md` no fue migrado

Eso es intencional. OpenSpec nunca elimina automáticamente `project.md` porque puede contener contexto que tú escribiste. Mueve las partes útiles a la sección `context:` de `config.yaml`, y luego bórralo tú mismo. La [Guía de Migración](migration-guide.md#migrating-projectmd-to-configyaml) lo explica, incluyendo una indicación que puedes darle a tu IA para que haga la destilación.

## ¿Sigues atascado? (Still stuck?)

- **Discord:** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues:** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **Desde tu terminal:** `openspec feedback "what went wrong"` abre un issue para ti.

Cuando reportes un problema, incluye tu versión de OpenSpec (`openspec --version`), tu versión de Node (`node --version`), tu herramienta de IA y el comando y la salida exactos. Esto hace que la ayuda sea mucho más rápida.
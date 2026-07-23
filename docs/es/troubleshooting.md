# Solución de problemas

Soluciones concretas para problemas concretos. Cada entrada describe un síntoma, explica la causa probable en una oración y te proporciona la solución. Si no encuentras tu problema aquí, las [Preguntas frecuentes](faq.md) pueden ayudarte, y el [Discord](https://discord.gg/YctCnvvshC) sin duda también.

## Instalación y configuración

### `openspec: command not found`

La CLI no está instalada, o tu shell no la puede encontrar. Instálala globalmente y verifica:

```bash
npm install -g @fission-ai/openspec@latest
openspec --version
```

Si se instaló pero sigue sin encontrarse, es probable que el directorio bin global de npm no esté en tu `PATH`. Ejecuta `npm bin -g` para ver dónde se almacenan los binarios globales, y asegúrate de que esa ruta esté en el perfil de tu shell.

### "Requires Node.js 20.19.0 or higher"

OpenSpec se ejecuta en Node 20.19.0 o superior. Verifica tu versión y actualízala si es necesario:

```bash
node --version
```

Si usas bun para instalar OpenSpec, ten en cuenta que OpenSpec sigue *ejecutándose* en Node, por lo que necesitas Node 20.19.0 o superior disponible en tu `PATH` de todos modos. Consulta [Instalación](installation.md).

### `openspec init` didn't configure my AI tool

El comando `init` pregunta qué herramientas configurar. Si omitiste tu herramienta o quieres agregar otra, simplemente vuelve a ejecutarlo, o usa la forma no interactiva:

```bash
openspec init --tools claude,cursor
```

La lista completa de IDs de herramientas está en [Herramientas compatibles](supported-tools.md). Usa `--tools all` para configurar todas, `--tools none` para omitir la configuración de herramientas.

## Los comandos no aparecen

Si `/opsx:propose` (o el equivalente de tu herramienta) no aparece o no hace nada, revisa esta lista en orden. Está ordenada de la comprobación más rápida a la más lenta.

1. **Es posible que estés en el lugar equivocado.** Los comandos con barra diagonal se usan en el chat de tu asistente de IA, no en tu terminal. Si escribiste `/opsx:propose` en tu shell, ese es el problema. Consulta [Cómo funcionan los comandos](how-commands-work.md).

2. **Vuelve a generar los archivos.** Desde la raíz de tu proyecto:

   ```bash
   openspec update
   ```

   Esto vuelve a escribir los archivos de habilidades y comandos para cada herramienta que hayas configurado.

3. **Reinicia tu asistente.** La mayoría de las herramientas escanean las habilidades y los comandos al iniciarse. A menudo, abrir una ventana nueva lo soluciona.

4. **Confirma que los archivos existen.** Para Claude Code, verifica que la carpeta `.claude/skills/` contenga carpetas `openspec-*`. Otras herramientas usan sus propios directorios, todos listados en [Herramientas compatibles](supported-tools.md).

5. **Verifica que hayas inicializado este proyecto.** Las habilidades se escriben por proyecto. Si clonaste un repositorio o cambiaste de carpeta, ejecuta `openspec init` (o `openspec update`) en esa ubicación.

6. **Confirma que tu herramienta sea compatible con archivos de comandos.** Codex y algunas otras herramientas (CodeArts, Kimi CLI, ForgeCode, Mistral Vibe) no generan archivos de comando `opsx-*`; en su lugar usan invocaciones basadas en habilidades. Para Codex, verifica la carpeta `.codex/skills/openspec-*`. Los formatos varían según la herramienta: consulta [Herramientas compatibles](supported-tools.md) y [Cómo funcionan los comandos](how-commands-work.md#slash-command-syntax-by-tool).

## Trabajo con cambios

### "Change not found"

El comando no pudo identificar qué cambio te referías. Nómbralo explícitamente, o verifica qué cambios existen:

```bash
openspec list                    # ver cambios activos
/opsx:apply add-dark-mode        # nombrar el cambio en el chat
```

También confirma que estés en el directorio del proyecto correcto.

### "No artifacts ready"

Cada artefacto está o bien ya creado, o bien bloqueado esperando una dependencia. Verifica qué está bloqueando:

```bash
openspec status --change <name>
```

Luego crea primero la dependencia faltante. Recuerda el orden: la propuesta habilita las especificaciones y el diseño; las especificaciones y el diseño juntos habilitan las tareas.

### `openspec validate` reports warnings or errors

La validación verifica que tus especificaciones y cambios no tengan problemas estructurales. Lee el mensaje: indica el archivo y el problema.

```bash
openspec validate <name>           # validar un elemento
openspec validate --all            # validar todo
openspec validate --all --strict   # comprobaciones más estrictas, ideal para CI
```

Las causas más comunes son una sección requerida faltante (por ejemplo, una especificación sin escenarios) o un encabezado delta mal formado. Corrige el archivo y vuelve a ejecutar el comando. La [Referencia de la CLI](cli.md#openspec-validate) documenta el formato de salida.

### La IA creó artefactos incompletos o incorrectos

La IA no tenía suficiente contexto. Algunas opciones te ayudan:

- Agrega contexto del proyecto en `openspec/config.yaml` para que tu stack y tus convenciones se inyecten en cada solicitud. Consulta [Personalización](customization.md#project-configuration).
- Agrega `rules:` por artefacto para obtener orientación que solo aplique, por ejemplo, a las especificaciones.
- Proporciona una descripción más detallada al crear una propuesta.
- Usa el `/opsx:continue` ampliado para crear un artefacto a la vez y revisar cada uno, en lugar de usar `/opsx:ff` que los crea todos de una vez.

### La operación de archivado no finaliza, o advierte sobre tareas incompletas

El archivado no *bloqueará* el proceso por tareas incompletas, pero te advertirá, ya que archivar un cambio suele significar que el trabajo está terminado. Si las tareas se mantienen de forma intencional (estás registrando un cambio parcial), continúa. De lo contrario, finaliza las tareas primero. El archivado también te ofrecerá sincronizar tus especificaciones delta en las especificaciones principales si aún no lo has hecho; acepta a menos que tengas un motivo para no hacerlo.

## Configuración

### Mi `config.yaml` no se está aplicando

Tres causas habituales:

1. **Nombre de archivo incorrecto.** Debe ser `openspec/config.yaml`, no `.yml`.
2. **YAML no válido.** Ejecútalo a través de cualquier validador de YAML; la CLI también informa errores de sintaxis con sus números de línea.
3. **Esperabas un reinicio.** No lo necesitas. Los cambios de configuración se aplican de inmediato.

### "Unknown artifact ID in rules: X"

Una clave en `rules:` no coincide con ningún artefacto en tu esquema. Para el esquema `spec-driven` predeterminado, los IDs válidos son `proposal`, `specs`, `design`, `tasks`. Para ver los IDs de cualquier esquema:

```bash
openspec schemas --json
```

### "Context too large"

El campo `context:` tiene un límite de 50 KB de forma intencional, ya que se inyecta en cada solicitud. Resúmelo, o agrega enlaces a documentos más largos en lugar de pegarlos. Un contexto reducido también produce resultados mejores y más rápidos.

### "Schema not found"

El nombre de esquema al que hiciste referencia no existe. Lista los disponibles y verifica la ortografía:

```bash
openspec schemas                    # listar esquemas disponibles
openspec schema which <name>        # ver desde dónde se resuelve un esquema
openspec schema init <name>         # crear uno personalizado
```

Consulta [Personalización](customization.md#custom-schemas).

## Migración desde el flujo de trabajo heredado

### "Legacy files detected in non-interactive mode"

Estás en un entorno de CI o en una shell no interactiva, y OpenSpec encontró archivos antiguos para limpiar pero no puede solicitarte confirmación. Aprueba automáticamente:

```bash
openspec init --force
```

Para Codex, OpenSpec puede detectar archivos de indicaciones administrados antiguos en `$CODEX_HOME/prompts` o `~/.codex/prompts`. Esa limpieza se limita a los nombres de archivo de indicaciones de Codex heredados incluidos en la lista permitida de OpenSpec, y el `openspec init` no interactivo solo elimina los archivos cuyas habilidades de reemplazo `.codex/skills/openspec-*` existen. El `openspec update` no interactivo deja toda la limpieza de archivos heredados intacta a menos que pases el parámetro `--force`.

### Los comandos no aparecieron después de la migración

Reinicia tu IDE. Las habilidades se detectan al iniciarse. Si siguen sin aparecer, ejecuta `openspec update` y verifica las ubicaciones de los archivos en [Herramientas compatibles](supported-tools.md).

### Mi antiguo `project.md` no se migró

Es intencional. OpenSpec nunca elimina `project.md` de forma automática, ya que puede contener contexto que tú escribiste. Mueve las partes útiles a la sección `context:` de `config.yaml`, y luego elimínalo tú mismo. La [Guía de migración](migration-guide.md#migrating-projectmd-to-configyaml) explica el proceso paso a paso, e incluye una indicación que puedes darle a tu IA para que realice la síntesis del contenido.

## ¿Sigues con problemas?

- **Discord:** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues:** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **Desde tu terminal:** `openspec feedback "what went wrong"` abre una incidencia por ti.

Cuando informes de un problema, incluye tu versión de OpenSpec (`openspec --version`), tu versión de Node (`node --version`), tu herramienta de IA, y el comando y la salida exactos. Esto agiliza mucho la ayuda.
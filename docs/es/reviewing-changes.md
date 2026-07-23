# Revisar un cambio

Toda la propuesta de OpenSpec es que tú y tu IA **acuerden qué construir antes de escribir cualquier código.** Ese acuerdo solo tiene sentido si realmente lees lo que la IA ha redactado. Esta página trata sobre esos dos minutos en los que haces precisamente eso: qué abrir, en qué orden y qué debes revisar.

La apuesta es sencilla: detectar un error de rumbo en un plan de un párrafo es prácticamente gratuito. Detectar el mismo error en 300 líneas de código no lo es. La revisión es donde obtienes el rendimiento de esa apuesta.

## Los dos momentos en los que revisas

Hay exactamente dos:

```
/opsx:propose ──► REVISAR EL PLAN ──► /opsx:apply ──► REVISAR EL CÓDIGO ──► /opsx:archive
                  (antes de cualquier código)                    (/opsx:verify)
```

1. **Después de `/opsx:propose`** (o `/opsx:ff`), antes de `/opsx:apply`: lee el plan mientras todavía solo sean palabras.
2. **Después de compilar**, con `/opsx:verify`: comprueba que el código haya hecho realmente lo que indicaba el plan.

La primera revisión es la que más te ahorra trabajo, y también la que más se suele omitir. Esta página dedica la mayor parte de su contenido a ella.

## Léelo en este orden

Un cambio es una carpeta de Markdown sin formato en `openspec/changes/<name>/`. Lee los archivos en el orden que te permita abandonar la revisión lo antes posible si algo no encaja:

```
openspec/changes/add-dark-mode/
├── proposal.md      1. la intención y el alcance   ← si esto es incorrecto, detente aquí
├── specs/…/spec.md  2. los requisitos       ← el corazón de la revisión
├── design.md        (solo para cambios más grandes) — el enfoque técnico
└── tasks.md         3. el plan de trabajo
```

No necesitas leer cada línea. Solo debes responder tres preguntas, una por cada archivo.

## La propuesta: ¿es este el problema correcto?

Abre `proposal.md` primero. Recoge el «por qué» y el «qué»: la intención, el alcance y el enfoque en uno o dos párrafos.

**Qué aspecto tiene una propuesta válida:** una intención clara, un alcance que reconozcas y una razón por la que merece la pena hacerlo ahora.

**Señales de alerta:**

- Resuelve un problema ligeramente *distinto* al que solicitaste.
- El alcance se ha ampliado: pediste un selector de tema y la propuesta también incluye cambios en la autenticación «mientras estamos aquí».
- Es vago. «Mejorar la página de ajustes» no es un alcance válido; «añadir un selector de modo oscuro que respete la preferencia del sistema operativo» sí lo es.

**La pregunta que debes responder:** *¿Esto coincide con lo que solicité realmente, y no se está colando nada extra?* Si la respuesta es no, detente: no leas más, corrige la propuesta (consulta [Devolver cambios es barato](#pushing-back-is-cheap)).

## Las especificaciones delta: ¿está definido correctamente qué es "terminado"?

Esta es el corazón de la revisión. Las especificaciones delta de la carpeta `specs/` indican qué será *cierto* cuando se publique el cambio: como requisitos y los escenarios que los demuestran:

```markdown
## ADDED Requirements

### Requirement: Dark Mode Toggle
The system SHALL let a user switch between light and dark themes.

#### Scenario: Respects the OS preference on first load
- GIVEN a user who has never set a theme
- WHEN they open the app on a device set to dark mode
- THEN the app renders in dark mode
```

**Qué aspecto tiene un requisito válido:** una declaración clara con `SHALL`/`MUST` que podrías entregar a un tester, y al menos un escenario cuyo GIVEN/WHEN/THEN evalúe realmente esa declaración.

**Señales de alerta:**

- **Un requisito vago.** «El sistema SHALL ser rápido» no se puede construir ni probar. ¿Qué es rápido?
- **Un requisito sin escenario**, o un escenario que no evalúa el requisito al que está asociado.
- **La detección más valiosa de todas: lo que falta.** La IA escribe fielmente lo que *tú dijiste*. Tu trabajo es darte cuenta de lo que *se te olvidó decir*. Si lo que más te importaba era el caso de la preferencia del sistema operativo y ningún escenario lo menciona, esa es la revisión que se paga sola.

Lee las especificaciones delta preguntándote *¿estaría satisfecho si el sistema hiciera exactamente — y solo — esto?* Aquí todavía no se habla de código, por lo que sigue siendo barato modificarlo.

## Las tareas: ¿el plan de trabajo es coherente?

Abre `tasks.md` en último lugar. Es la lista de comprobación de implementación que la IA seguirá.

**Qué aspecto tiene un plan válido:** pasos ordenados, cada uno trazable hasta un requisito, sin nada ambiguo.

**Señales de alerta:**

- Una tarea sin un requisito asociado (¿de dónde ha salido?).
- Una única tarea gigante de «implementar la funcionalidad» que oculta todas las decisiones reales.
- Una tarea que modifica algo fuera del alcance que acabas de aprobar.

Aquí no tienes que estimar tiempos ni microgestionar: solo compruebas que el plan coincida con los requisitos que ya has aceptado.

## Devolver cambios es barato

Si la respuesta a cualquiera de las tres preguntas es negativa, dilo. No hay fases ni nada bloqueado: lo corriges y sigues adelante. Hay dos formas de hacerlo, exactamente como se explica en [Editar un cambio](editing-changes.md):

- **Edita el archivo tú mismo.** Es Markdown sin formato: cambia la línea de alcance, ajusta un requisito, elimina una tarea.
- **Indícale a la IA qué está mal** y deja que lo revise: *«elimina los cambios de autenticación — están fuera del alcance»,* *«añade un escenario para cuando el usuario ya haya seleccionado un tema»,* *«divide la tarea 3 en esquema e interfaz de usuario».*

Después vuelve a leer la parte que modificaste. Reescala el borrador hasta que sea un plan que firmarías sin dudar. Esa ida y vuelta *es* el producto funcionando.

## Después del código: verificación

Una vez que el trabajo está compilado, `/opsx:verify` es tu segunda revisión. Vuelve a leer los artefactos y el código, e informa de las discrepancias en tres dimensiones:

| Dimensión | Qué comprueba |
|-----------|----------------|
| **Completitud** | Que todas las tareas estén hechas, todos los requisitos implementados y los escenarios cubiertos |
| **Corrección** | Que la implementación coincida con la intención de la especificación, y que los casos límite estén gestionados |
| **Coherencia** | Que las decisiones de diseño aparezcan realmente en el código |

```
You: /opsx:verify

AI:  Verifying add-dark-mode...

     COMPLETENESS
     ✓ All 8 tasks in tasks.md are checked
     ✓ All requirements in specs have corresponding code
     ⚠ Scenario "Respects the OS preference on first load" has no test coverage
```

Marca los problemas como CRITICAL, WARNING o SUGGESTION, y **no** bloquea el archivado: solo muestra las carencias y te deja tomar la decisión. Esta es la diferencia entre «¿la IA escribió código?» y «¿construyó lo que acordamos?».

`/opsx:verify` está en el perfil ampliado. Si no lo tienes, actívalo con `openspec config profile` (después ejecuta `openspec update`), o simplemente vuelve a leer el cambio y el diff tú mismo.

## Ajusta la revisión al tamaño adecuado

No todos los cambios merecen una revisión completa. La corrección de una errata en un solo archivo basta con un vistazo de veinte segundos. Un cambio que toque la autenticación, los pagos o datos que no puedes recuperar merece responder a todas las preguntas anteriores. El objetivo nunca fue el ceremonial: se trata de dedicar tu atención donde un error sería costoso, y de hacer un vistazo rápido donde no lo sería.

## La lista de comprobación de dos minutos

- [ ] La intención de la propuesta coincide con lo que solicité.
- [ ] No se ha colado nada extra en el alcance.
- [ ] Todos los requisitos son lo suficientemente específicos para poder probarlos.
- [ ] Cada requisito tiene un escenario que lo evalúa realmente.
- [ ] El caso que más me importa está cubierto.
- [ ] Las tareas se corresponden con los requisitos; no hay nada ambiguo o fuera del alcance.
- [ ] Estaría cómodo si la IA construyera exactamente esto y nada más.

Si las siete se cumplen, ejecuta `/opsx:apply` con confianza. Si alguna falla, no es un revés: son los dos minutos haciendo su trabajo.

## Por dónde seguir

- [Escribir buenas especificaciones](writing-specs.md) — la otra cara: cómo redactar requisitos y escenarios que merezcan ser aprobados.
- [Editar e iterar sobre un cambio](editing-changes.md) — la mecánica para modificar un plan después de haber empezado.
- [Flujos de trabajo](workflows.md) — dónde encaja la revisión en el ciclo general.
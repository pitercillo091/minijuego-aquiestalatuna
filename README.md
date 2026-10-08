# Una ronda más · campaña MP3

Juego web de la Rondalla de Lopera. Cada nivel combina una preparación en la plaza y una actuación musical de 60 segundos. Conserva el motor, la selección de cinco, las dos dificultades y el guardado anterior; el reparto tiene doce personajes pixel art.

## Jugar

Abre `index.html` en un navegador moderno o sirve esta carpeta con un servidor estático:

```sh
python -m http.server 8765 --bind 127.0.0.1
```

Abre `http://localhost:8765/`. La partida funciona sin cuenta. El progreso y los récords personales son locales; la clasificación pública usa una Edge Function y la base de datos Supabase existente. La web original permanece intacta.

Los navegadores requieren un primer toque o pulsación para activar el sonido. Puedes usar el nombre de la canción, «Otra canción» o empezar la partida. En Sonido se controlan música, efectos y volumen por separado.

## Controles

| Acción | Ordenador | Táctil / ratón |
| --- | --- | --- |
| Caminar | WASD o flechas | Cruceta o tocar la plaza |
| Recoger / entrar al escenario | Espacio cerca del objetivo | Tocar un objeto o escenario; el músico busca una ruta |
| Actuación | A, S, W, D, J, K según las teclas de la etapa | Botones musicales que aparecen según el nivel |
| Primeras cuatro columnas | También ←, ↓, ↑, → | Columnas con el mismo color que los botones |
| Alternativa de un botón | Espacio toca la nota más cercana; hay que acertar el tiempo | Botones musicales |
| Pausa | Escape o Pausa | Pausa |

Pulsa cuando la nota llegue a la línea dorada. Los aciertos iluminan el botón y producen partículas; los fallos muestran feedback rojo y reducen el ánimo. Al cambiar de pestaña se pausa. J y K solo actúan durante la música y no interfieren con el movimiento.

## Campaña musical MP3 · 26 niveles

La biblioteca de juego contiene 13 grabaciones MP3 disponibles y autorizadas por el usuario. Se juegan dos vueltas: niveles 1–13 en dificultad normal y 14–26 en difícil. Cada actuación dura 60 segundos; la preparación sigue durando 30. El menú y la recogida reproducen MP3 aleatorios de la misma biblioteca mediante una bolsa que evita repetir inmediatamente. El MIDI original se conserva como respaldo técnico, no como música de estos niveles.

| Normal | Difícil | Canción |
| ---: | ---: | --- |
| 1 | 14 | Clavelitos |
| 2 | 15 | Cielito Lindo |
| 3 | 16 | Estudiantina Madrileña |
| 4 | 17 | Las Cintas de mi Capa |
| 5 | 18 | La Isa Canaria |
| 6 | 19 | La Morena de mi Copla |
| 7 | 20 | María la Portuguesa |
| 8 | 21 | Soy Cordobés |
| 9 | 22 | Guantanamera |
| 10 | 23 | Viva España |
| 11 | 24 | Isa de Ronda |
| 12 | 25 | San Cayetano |
| 13 | 26 | Todos los Besos |

Faltan Adelita, El Rey y Cartagenera. No tienen archivos MP3 utilizables en la biblioteca disponible, por eso no generan niveles sin música. Si se incorporan después, se pueden añadir al catálogo y regenerar ambas vueltas.

Clavelitos conserva el MP3 y el mapa que el usuario aprobó. Las otras doce canciones además de Clavelitos tienen mapas separados derivados de pulsos y ataques medidos en cada MP3; no reutilizan los tiempos MIDI. La segunda vuelta usa más entradas y más teclas, sin acelerar la grabación. Los datos de offsets, BPM aproximados, cobertura y densidad están en `docs/mp3-migration/analysis-summary.json`. Las estimaciones automáticas se contrastan con el archivo real y la continuidad de los 60 segundos; una escucha musical final por parte del usuario sigue siendo la mejor revisión de fraseo.

«Ritmo tranquilo» da un margen de ±230 ms, perfecto ±110 ms, daño de charco −12 y nota perdida −3,5. Normal: ±160 ms, perfecto ±75 ms, charco −18 y nota perdida −5. Al empezar la actuación se recupera el ánimo hasta un mínimo de 75. Espacio permite disfrutar del ritmo sin memorizar seis teclas.

## Puntos y progresión

Cada objeto suma 100 puntos una sola vez. Una nota perfecta suma 120 y una buena 80. El multiplicador crece 0,25 cada ocho notas consecutivas, hasta ×1,75. El tiempo de preparación restante da cinco puntos por segundo. Tres estrellas requieren 90% de aciertos; dos, 72%; una, superar el mínimo. Pierdes si se agota el tiempo, el ánimo o no alcanzas el mínimo musical. Puedes reiniciar y repetir niveles desbloqueados. Repetir una etapa completada sustituye su aportación al total, sin duplicarla.

Se conserva la clave `rondalla-una-ronda-mas-v1` de localStorage. La migración mantiene personaje, preferencias, marcas y estrellas anteriores; el tamaño de las listas se adapta a la campaña de 26 niveles. Las partidas MIDI anteriores conservan sus marcas por canción y vuelta; los tres temas que salen se archivan localmente, sin reasignar sus resultados a otros MP3. Guardados corruptos o almacenamiento bloqueado no impiden jugar. El origen `file://` puede usar un guardado distinto al de HTTP.

## Tecnología y estructura

HTML, CSS y JavaScript sin dependencias de producción. Canvas 2D para el juego, SVG con las imágenes originales y atlas PNG para los personajes. Web Audio reproduce los eventos MIDI con perfiles General MIDI ligeros: cada nota conserva programa, velocidad, volumen, expresión, panoramización, pitch bend y tempo. No se depende del soporte MIDI nativo del navegador ni de bancos de sonido remotos.

La salida de sonido usa un único `AudioContext` por partida. Las voces MIDI pasan por un bus de música; los efectos y los sonidos de interfaz pasan por buses separados. Los tres buses convergen en una ganancia maestra calibrada para el control de volumen, un compresor suave y un limitador final antes de la salida. Esto recupera nivel útil en móviles sin cambiar notas, tempo ni sincronización y evita picos al sonar varios instrumentos a la vez.

El contexto se crea y se reanuda únicamente después de una pulsación, toque o botón de sonido, respetando las políticas de autoplay de Chrome, Firefox, Edge y Safari/iOS. Al pausar o cambiar de pantalla se detienen las voces activas; al volver a jugar se reutiliza el mismo contexto, evitando acumulación de contextos o nodos. Si el navegador no ofrece Web Audio, el juego continúa en modo silencioso.

```text
JUEGO/
  index.html                   Menús, controles, HUD y diálogos
  css/game.css                 Interfaz responsive y feedback
  src/data.js                  Reparto, niveles, teclas y dificultad
  src/engine.js                Movimiento, rutas, colisiones, ritmo y guardado
  src/art.js                   Escenarios, atlas, público y partículas
  src/game.js                  Controlador e integración
  src/songs.js                 Catálogo MIDI y copia binaria de respaldo
  src/midi.js                  Lector SMF, tempos y carga segura
  src/audio.js                 Reproducción, mezcla, rotación y efectos
  assets/audio/midi/           Copias MIDI originales conservadas como respaldo
  midi/                        Copias originales descargadas de las fuentes públicas accesibles
  assets/audio/partituras.json  Frases editables y tempos
  assets/audio/generar-midi.py  Exportador MIDI, Python sin dependencias
  assets/audio/FUENTES.md      Procedencia, atribución y alcance musical
  assets/personajes/           Doce diseños, doce atlas y generadores
  assets/referencias/          Fotografías optimizadas y referencia del reparto
  assets/ui/escudo.webp        Escudo original optimizado
  PERSONAJES/                  Imagen aportada por el usuario, preservada
  docs/                       Fichas, análisis y resultados visuales
  tests/                      Pruebas y evidencias
```

Los fondos se dibujan una vez y se guardan en caché. El grupo, los ojos, instrumentos y ropa reutilizan diseños canónicos. La densidad de píxeles se limita a ×2, las voces de sonido están limitadas y no hay descargas externas durante la partida. Las fotografías se usan en versiones WebP pequeñas.

## Música: organización y edición

## Gira y encargos narrativos

Cada etapa carga un encargo compuesto por una localidad, un tipo de evento y la canción del nivel. `src/data.js` contiene los catálogos `locations` y `events`, además de `createPerformance`, que mezcla ambos datos y evita repetir inmediatamente la misma combinación. La pantalla previa a la recogida presenta el contrato de la actuación; la recogida conserva sus 30 segundos y el cierre muestra el lugar, el evento y un texto de misión cumplida.

La actuación se crea una sola vez al iniciar una etapa y se conserva en `game.performance` durante la introducción, la recogida, la fase musical y el resultado. Un reintento reutiliza el mismo encargo; la siguiente etapa genera la nueva combinación.

### Selección de grupo

El catálogo incluye doce personajes. LEGÍA toca la guitarra, confirmado por el usuario; su referencia está en `assets/personajes/referencias/legia.png`. Andrés y Coki tocan la pandereta. Peña y Ponder tocan la bandurria. Pedro V. es bailarín y no tiene instrumento asignado. Cada encargo empieza sin selección: el jugador elige cinco en una pantalla propia, con el contador `TUNA: n/5`. El mismo grupo aparece en la tira «GRUPO EN RUTA», en la actuación y en el resultado. El jugador que recoge los instrumentos rota entre esos cinco.

Las reglas futuras viven en los campos de restricciones del evento. Ahora `evento-benefico` declara `guitarra` como personaje prohibido y muestra `Pone una escusa para no actuar` para Pacheco´s. El motor valida de nuevo el grupo al comenzar, aunque se manipule el estado desde fuera de la interfaz.

La actuación generada también incluye `allowedCharacters`, `recommendedCharacters`, `requiredCharacters` y `unavailableCharacters`. Permanecen vacíos por ahora, pero dejan preparada la futura selección de cinco músicos y sus condiciones por encargo sin alterar el motor actual.

Los 26 niveles activos usan MP3: trece grabaciones disponibles, cada una en una ronda normal y otra difícil. Cada canción tiene mapas de notas independientes, medidos sobre sus propios ataques y pulsos; los niveles difíciles añaden densidad sin acelerar la grabación. Las actuaciones duran 60 segundos y el menú y la recogida usan una rotación aleatoria de la misma biblioteca MP3. Los MIDI originales se conservan como respaldo, pero no son la música de la campaña activa.

Las grabaciones incluidas en la campaña fueron autorizadas por el usuario para su publicación. Los MP3 originales no se transforman; se decodifica el fragmento seleccionado al iniciar la actuación. La biblioteca preparatoria y las herramientas de revisión locales no se publican.

En menú y recogida, una bolsa aleatoria recorre las trece grabaciones y evita repetir la misma inmediatamente. «Otra canción» elige otra pista. Durante la actuación, el reloj del MP3 sincroniza el mapa de notas. Pausar detiene audio y notas; reanudar continúa desde la posición musical guardada.

El reproductor mantiene una sola cadena Web Audio para grabaciones, efectos e interfaz. Los MP3 se precargan, se decodifican una vez por pista seleccionada y se limitan al fragmento jugable. Si falta Web Audio, la página sigue siendo navegable y el fallo de audio no bloquea el juego.

Para añadir una canción MP3, incorpora su entrada con ruta y hash en `src/charts/`, agrégala al registro de `src/recordings.js` y al conjunto ambiental de `src/ambient-recordings.js`. Ajusta mapas normal y difícil contra el audio real, mantén 60 segundos de objetivos musicales y añade validación de duraciones y coberturas en las pruebas. La cantidad de niveles se calcula a partir de grabaciones activas.

## Personajes y escenarios

Los cinco personajes originales mantienen sus bases y atlas. Andrés y Coki utilizan ilustraciones pixel art creadas con la herramienta ImageGen integrada de ChatGPT, guiada por las fotografías de identidad y el elenco original. Las ilustraciones maestras están en `assets/personajes/ilustraciones/`; las fotografías originales no se convierten ni se cargan como sprites. Los dos llevan traje oscuro y pandereta: Andrés conserva barba y pelo oscuro; Coki conserva gafas de sol, sonrisa y beca roja.

Cada personaje tiene una base SVG con imagen de 192 × 320 y un atlas PNG de 768 × 1280: cuatro columnas por cuatro filas (reposo, caminar, tocar, victoria). Las 16 poses comparten exactamente el rostro y reutilizan los píxeles de la base. Los movimientos de torso y piernas son pequeños; se conservan el salto de victoria y la orientación del dibujado anterior. Se reemplazaron bases y atlas completos. Las fichas y correspondencias con las imágenes están en `docs/PERSONAJES.md`.

Para volver a empaquetar Andrés y Coki, ejecuta `python assets/personajes/generar_nuevos.py`. Usa las ilustraciones maestras ya generadas y conserva el formato y las funciones de animación de los originales; no genera caras ni aplica filtros a fotografías. Requiere Pillow para mantenimiento, pero jugar no necesita dependencias. `tests/personajes-browser.html` muestra el elenco completo y `tests/sprites-integration.html` comprueba selección, ambos conductores, actuación y resultado. Las referencias, especificación visual, prompts, copia de seguridad y capturas están en `docs/sprites-andres-coki/`.

Las plazas incorporan fachadas claras, macetas, banderines, luces, escenario, micrófonos, altavoces y público animado. Universidad, jardín y fiesta tienen detalles propios. La decoración conserva las rutas y colisiones originales. Para sustituir fotografías cambia `photo`/`reference` en `data.js`; usa imágenes optimizadas y conserva el escudo original.

## Añadir niveles

La campaña crea una vuelta normal y otra difícil por cada grabación MP3 activa. Al añadir una pista, incluye sus dos mapas en `src/charts/`, sus metadatos de audio en el registro y los datos del ranking de servidor. El progreso y la numeración se basan en la longitud de la campaña.

## Pruebas

```sh
node tests/engine.test.cjs --report
node tests/audio.test.cjs
node tests/mp3-campaign.test.cjs
python tests/personajes.test.py
python tests/integrity.py
```

Desde el servidor, abre `tests/browser-integration.html`: usa el controlador, dibujo y menús reales para completar las 26 etapas con un reloj controlado y guardado en memoria. `#qa` solo se habilita dentro del iframe de pruebas. `tests/music-browser.html` mide la señal de Web Audio de las diez canciones; su enlace de recursos ausentes comprueba las copias de respaldo. `tests/responsive.html` muestra escritorio y móvil, incluida la actuación de seis columnas. Resultados y límites de la campaña: `docs/PRUEBAS.md`. La sustitución posterior de los personajes y sus comprobaciones se documentan en `docs/PRUEBAS-PERSONAJES.md`.

## Siguientes ampliaciones

Una transcripción más detallada de la referencia de Cartagenera, calibración de latencia de audio y nombres confirmados de los músicos. La curva de dificultad puede ajustarse después de observar partidas de jugadores reales.


## Doce componentes y recompensas (8 de octubre de 2026)

El catálogo único de `src/data.js` incluye a Miguel A., Pacheco´s, C15, Piter, Pesetas, Andrés, Coki, LEGÍA, PEDRO V., PONDER, PEÑA y CAÑERO. El jugador elige exactamente cinco antes de preparar cada encargo. La localidad, el evento, la canción, el nivel y `selectedCharacters` permanecen en la misma actuación. Repetir conserva ese encargo; avanzar crea uno nuevo con la selección vacía.

| Personaje | Función | Disponible desde | Victoria necesaria |
| --- | --- | --- | --- |
| CAÑERO | Acompañante, sin instrumento | 2 | 1 |
| PEDRO V. | Bailarín, sin instrumento | 3 | 2 |
| Andrés | Pandereta | 5 | 4 |
| PONDER | Bandurria | 6 | 5 |
| PEÑA | Bandurria | 8 | 7 |
| LEGÍA | Guitarra | 10 | 9 |

Se puede repetir un nivel anterior usando personajes ya conseguidos. Perder no concede recompensas. Todos los personajes aparecen en «ELIGE TU TUNA»; los bloqueados muestran el nivel necesario. Pacheco´s sigue excluido de los eventos benéficos con «Pone una escusa para no actuar». El motor vuelve a validar el catálogo, desbloqueos, duplicados y restricciones al comenzar, aunque la interfaz se haya manipulado. La generación admite únicamente encargos con al menos cinco componentes elegibles.

El guardado conserva su clave y pasa a versión 3. `characterUnlocks` registra personajes ganados y `characterRewardsSeen` registra las tarjetas confirmadas con «CONTINUAR». Al leer una partida anterior, las estrellas y el avance desbloquean automáticamente lo ya conseguido sin borrar marcas, ajustes ni progreso. Las tarjetas pendientes se muestran en orden y sobreviven a una recarga antes de confirmarlas. Las confirmadas no vuelven a aparecer.

Los nuevos dibujos se generaron con ImageGen integrado, usando las fotografías individuales como identidad y los ocho sprites aprobados como estilo. Los originales no se modificaron. `assets/personajes/generar_ampliacion.py` empaqueta las ilustraciones maestras en celdas de 192 × 320; la línea de apoyo es y=315. Peña y Ponder usan atlas de cuatro columnas y cuatro filas. Pedro usa ocho columnas y cuatro filas; su fila de actuación incluye ocho poses de baile, con brazos, torso y piernas en movimiento y rostro constante. El motor selecciona dos poses por pulso usando el reloj musical existente, también después de una pausa. La recogida sigue tratando objetos de equipo compartido y no exige al bailarín un instrumento personal.

Para añadir personajes: agrega su registro con `id`, `name`, `instrument` (o `kind:'dancer'` e `instrument:null`), `unlockLevel`, `unlockMessage` y, si corresponde, `animationColumns`; incorpora su base y atlas. Las reglas se combinan centralmente desde localidad, evento, canción y nivel: `forbiddenCharacters`, `requiredCharacters`, `recommendedCharacters`, `incompatibleCharacters` y `reasons`. No hay reglas nuevas activas fuera de los desbloqueos y la exclusión benéfica de Pacheco´s.

Pruebas de esta ampliación: `node tests/progression.test.cjs`, `node tests/engine.test.cjs`, `node tests/audio.test.cjs` y `tests/ampliacion-browser.html`. El último usa el controlador real, un reloj controlado y guardado aislado para completar las 26 etapas, verificar las cinco tarjetas y capturar a los once juntos. `tests/run-ampliacion.cjs` automatiza esa revisión con Playwright; `tests/run-publicacion.cjs` comprueba además recargas, migración, selección móvil y una actuación completa con reloj normal. Solo el mantenimiento necesita esas herramientas; jugar continúa sin dependencias. Las capturas e informes locales están en `docs/ampliacion-once/`, sin publicar las copias de seguridad ni la biblioteca MP3.
# Piloto local de Clavelitos MP3

Clavelitos (niveles 1 y 14) usa el MP3 aprobado de 60 segundos y sus mapas normal/difícil versionados. Las otras doce canciones también usan MP3 con mapas por grabación; menú y recogida usan la biblioteca MP3 aleatoria. Los recursos de revisión no se copian al juego público.

Documentación, resultados y limitaciones: [docs/clavelitos-mp3/INFORME.md](docs/clavelitos-mp3/INFORME.md). La herramienta local para revisar la onda y el audio no forma parte del despliegue público. Prueba de ambas dificultades con progreso aislado: `tests/clavelitos-browser.html`.

## CAÑERO · acompañante disponible desde el nivel 2

El catálogo contiene doce personajes. CAÑERO usa `kind:'companion'`, `instrument:null` y `unlockLevel:2`. Ganar el nivel 1 lo incorpora al mismo sistema de recompensas y guardado. Las partidas anteriores que ya lo hayan superado lo reciben automáticamente; confirmar su tarjeta se guarda en `characterRewardsSeen`. Entrar o perder un nivel no concede el desbloqueo.

Su fotografía sentada sirve únicamente como referencia de identidad. `assets/personajes/ilustraciones/canero-base.png` es una ilustración de pie creada con ImageGen integrado y los sprites aprobados como referencia artística. `generar_canero.py` la empaqueta con el mismo procedimiento del elenco: celda 192 × 320, pies en y=315 y atlas de ocho columnas por cuatro filas (32 poses). La cerveza Mahou está dibujada dentro del sprite, unida a su mano; no es una imagen superpuesta. La actuación utiliza un gesto discreto de acompañamiento por pulso, sin instrumento, y la marcha reutiliza el sistema existente. Los once atlas anteriores permanecen intactos.

Comprobaciones: `node tests/canero.test.cjs`, `python tests/canero-assets.test.py` y `node tests/run-canero.cjs` (Playwright solo para mantenimiento). El último revisa el controlador real, recompensas y recargas, doce personajes juntos, selección de cinco, vistas de 1440, 390 y 320 píxeles y una actuación de 60 segundos con reloj real. Acepta `GAME_URL` para repetir las pruebas sobre la versión publicada, sin enviar resultados a clasificaciones.

## Clasificaciones públicas

El juego ofrece una tabla por nivel y otra general sin crear cuentas. Los nombres se muestran en mayúsculas y quedan en el dispositivo; las puntuaciones públicas se conservan doce meses. Un UUID local distingue una instalación, no identifica ni verifica a una persona y no se sincroniza entre dispositivos. No se guardan correos ni direcciones IP. El navegador que envió una marca conserva un recibo privado para poder retirarla.

Los registros están en `public.game_rankings` y las sesiones temporales en `public.game_rank_sessions`, con RLS activa y sin permisos de lectura o escritura para los roles del navegador. La Edge Function `tuna-rankings` valida origen, clave publicable, apodo, nivel, mapa, duración mínima, notas y puntuación. Cada sesión se usa una vez y caduca a los quince minutos; se limitan los inicios por instalación local. Solo se conserva la mejor marca por jugador local y nivel. La general suma la mejor precisión de cada nivel y divide entre 26 niveles; los niveles no jugados valen cero. Sin cuentas ni ejecución confiable en servidor, no se pueden eliminar todas las trampas.

El ranking usa el proyecto Supabase gratuito existente; no se abrió otro servicio. El coste depende de mantenerse dentro de las cuotas del plan. El SQL está en `supabase/migrations/20261008_game_rankings.sql` y la API en `supabase/functions/tuna-rankings/index.ts`.

## Disponibilidad de MP3

Hay 13 pistas MP3 publicadas para 26 niveles. Faltan Adelita, El Rey y Cartagenera; no se sustituyen por otras versiones. `MP3/catalogo.json` documenta origen, intérprete, duración, formato y estado. El archivo MP4 utilizado como origen de Todos los Besos se conserva localmente y no se publica.

El resto de los archivos de revisión, informes y fuentes preparatorias de `MP3/` no forma parte del despliegue; solo se publican las trece grabaciones que usa la campaña.

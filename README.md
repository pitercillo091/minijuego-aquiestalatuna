# Una ronda más · versión 4

Juego web de la Rondalla de Lopera. Cada nivel combina una preparación en la plaza y una actuación musical de 60 segundos. Conserva el motor, la selección de cinco, las dos dificultades y el guardado anterior; el reparto tiene once personajes pixel art.

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

## Las veinte etapas musicales

Los niveles 1–10 usan el repertorio base. Los niveles 11–20 repiten las mismas canciones en una segunda ronda: conservan el tempo musical, añaden teclas cuando corresponde y aumentan la densidad de notas. Cada actuación dura 60 segundos. Clavelitos usa el MP3 aprobado y su mapa medido; las otras nueve canciones siguen con la música MIDI existente.
La preparación para recoger el equipo dura 30 segundos. El músico encargado rota entre los cinco diseños y lleva un pequeño icono de coche sobre la cabeza.

| Etapa | Canción | Lugar y preparación | Teclas | Notas | BPM | Aciertos mínimos |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Clavelitos | Lopera: tres instrumentos | A S | 18 | 108 | 50% |
| 2 | Cielito Lindo | Marmolejo: tres compañeros | A S | 24 | 112 | 50% |
| 3 | Adelita | Baños de la Encina: cuatro flores | A S W | 30 | 104 | 53% |
| 4 | El Rey | Arjona: cuatro partituras | A S W | 36 | 108 | 53% |
| 5 | Estudiantina Madrileña | Lopera: cuatro músicos de cuerda | A S W D | 42 | 112 | 55% |
| 6 | Las Cintas de mi Capa | Marmolejo: flores, partitura e instrumentos | A S W D | 48 | 116 | 55% |
| 7 | La Isa Canaria | Baños: cuatro instrumentos de cuerda | A S W D J | 54 | 120 | 58% |
| 8 | La Morena de mi Copla | Arjona: flores, partitura y guitarra | A S W D J | 60 | 124 | 58% |
| 9 | María la Portuguesa | Lopera: partitura y equipo | A S W D J K | 66 | 128 | 60% |
| 10 | Cartagenera | Lopera: los cinco músicos | A S W D J K | 72 | 132 | 60% |

El porcentaje mostrado redondea los umbrales internos de 52,5% y 57,5%. Completar una etapa desbloquea la siguiente. Cada nueva tecla se presenta en las instrucciones y aparece entre las primeras notas. La segunda ronda aumenta la densidad y la velocidad visual sin acelerar artificialmente las canciones; disminuye la separación mínima entre ataques elegibles. Se introducen notas a contratiempo y patrones derivados de las alturas del MIDI. Los charcos crecen de cero a cuatro y la preparación dura 30 segundos en todas las etapas.

«Ritmo tranquilo» da un margen de ±230 ms, perfecto ±110 ms, daño de charco −12 y nota perdida −3,5. Normal: ±160 ms, perfecto ±75 ms, charco −18 y nota perdida −5. Al empezar la actuación se recupera el ánimo hasta un mínimo de 75. Espacio permite disfrutar del ritmo sin memorizar seis teclas.

## Puntos y progresión

Cada objeto suma 100 puntos una sola vez. Una nota perfecta suma 120 y una buena 80. El multiplicador crece 0,25 cada ocho notas consecutivas, hasta ×1,75. El tiempo de preparación restante da cinco puntos por segundo. Tres estrellas requieren 90% de aciertos; dos, 72%; una, superar el mínimo. Pierdes si se agota el tiempo, el ánimo o no alcanzas el mínimo musical. Puedes reiniciar y repetir niveles desbloqueados. Repetir una etapa completada sustituye su aportación al total, sin duplicarla.

Se conserva la clave `rondalla-una-ronda-mas-v1` de localStorage. La migración mantiene personaje, preferencias, marcas y estrellas anteriores; el tamaño de las listas se adapta automáticamente a las veinte etapas. Guardados corruptos o almacenamiento bloqueado no impiden jugar. El origen `file://` puede usar un guardado distinto al de HTTP.

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
  assets/audio/midi/           Diez archivos MIDI reutilizados en veinte etapas SMF-1 reutilizados en veinte etapas
  midi/                        Copias originales descargadas de las fuentes públicas accesibles
  assets/audio/partituras.json  Frases editables y tempos
  assets/audio/generar-midi.py  Exportador MIDI, Python sin dependencias
  assets/audio/FUENTES.md      Procedencia, atribución y alcance musical
  assets/personajes/           Once diseños, once atlas y generadores
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

El catálogo incluye ocho músicos. LEGÍA toca la guitarra, confirmado por el usuario; su referencia está en `assets/personajes/referencias/legia.png`. Se incorporó con el mismo proceso artístico de Andrés y Coki, con 16 poses en `legia-atlas.png`, y se empaqueta con `python assets/personajes/generar_legia.py`. Las pruebas específicas están en `tests/legia.test.py` y `tests/legia-browser.html`; documentación y capturas en `docs/sprites-legia/`. Andrés y Coki tocan la pandereta. Sus referencias originales están en `assets/personajes/referencias/andres.png` y `assets/personajes/referencias/coki.png`; los sprites y las cuatro filas de animación se generan con `assets/personajes/generar_nuevos.py`. Cada encargo empieza sin selección: el jugador elige cinco en una pantalla propia, con el contador `TUNA: n/5`. El mismo grupo aparece en la tira «GRUPO EN RUTA», en la actuación y en el resultado. El jugador que recoge los instrumentos rota entre esos cinco.

Las reglas futuras viven en los campos de restricciones del evento. Ahora `evento-benefico` declara `guitarra` como personaje prohibido y muestra `Pone una escusa para no actuar` para Pacheco´s. El motor valida de nuevo el grupo al comenzar, aunque se manipule el estado desde fuera de la interfaz.

La actuación generada también incluye `allowedCharacters`, `recommendedCharacters`, `requiredCharacters` y `unavailableCharacters`. Permanecen vacíos por ahora, pero dejan preparada la futura selección de cinco músicos y sus condiciones por encargo sin alterar el motor actual.

El lector acepta MIDI formato 0 y 1 y elige automáticamente el canal melódico principal; no exige que todos los archivos tengan tres pistas. Clavelitos usa el MP3 local aprobado por el usuario y conserva el MIDI original como respaldo. Las otras actuaciones mantienen el repertorio MIDI existente. Si un MIDI termina antes del límite, se repite su frase y se distribuyen ataques para cubrir 60 segundos.

Las fuentes, cambios y atribuciones están en `assets/audio/FUENTES.md` y en créditos. La licencia de los arreglos de Tablatunas no concede por sí misma derechos sobre las composiciones. La publicación de los temas protegidos requiere comprobar los permisos que cubren el repertorio del grupo; esta revisión no acredita tales permisos. No se distribuyen PDFs ajenos ni grabaciones comerciales.

En menú y recogida se usa una bolsa aleatoria con los diez temas MIDI. «Otra canción» cambia el tema del menú. En la actuación Clavelitos reproduce el MP3 y sus notas usan el reloj de audio; el resto usa el MIDI del nivel. En MIDI se conserva el patrón y se amplía la densidad para cubrir 60 segundos. Pausar detiene el audio y reanudar mantiene la posición musical.

El lector admite SMF 0/1, PPQN, cambios de tempo, running status, Program Change, bancos, controladores de volumen, expresión, panoramización y pitch bend. Si falta un archivo, es inválido o tarda demasiado, usa los mismos bytes integrados en `songs.js`. Con `file://` se usa directamente esa copia. El juego sigue funcionando sin Web Audio. Imágenes secundarias ausentes tienen alternativas.

Para editar una canción:

1. Cambia su entrada en `assets/audio/partituras.json`. `phrase` contiene notas `G4:1` (una negra), `G#4:.5` (corchea), `R:1` (silencio) o TAB `20:.5` (segunda cuerda, traste 0). La afinación de referencia está en el generador.
2. Ejecuta `python assets/audio/generar-midi.py` desde JUEGO. Regenera los `.mid` y su copia integrada, sin instalar librerías.
3. Ajusta las pistas de acompañamiento en el generador si necesitas otra armonía. Cambia los timbres, envolventes y efectos en `src/audio.js`.
4. Comprueba los ataques, cantidad de objetivos, duración y permisos. Para importar otro MIDI, exporta los bytes en el catálogo y deja que el lector detecte el canal melódico principal; `trimBefore` permite empezar un MIDI desde un punto concreto. No basta con sustituir el `.mid`: actualiza también su respaldo.

## Personajes y escenarios

Los cinco personajes originales mantienen sus bases y atlas. Andrés y Coki utilizan ilustraciones pixel art creadas con la herramienta ImageGen integrada de ChatGPT, guiada por las fotografías de identidad y el elenco original. Las ilustraciones maestras están en `assets/personajes/ilustraciones/`; las fotografías originales no se convierten ni se cargan como sprites. Los dos llevan traje oscuro y pandereta: Andrés conserva barba y pelo oscuro; Coki conserva gafas de sol, sonrisa y beca roja.

Cada personaje tiene una base SVG con imagen de 192 × 320 y un atlas PNG de 768 × 1280: cuatro columnas por cuatro filas (reposo, caminar, tocar, victoria). Las 16 poses comparten exactamente el rostro y reutilizan los píxeles de la base. Los movimientos de torso y piernas son pequeños; se conservan el salto de victoria y la orientación del dibujado anterior. Se reemplazaron bases y atlas completos. Las fichas y correspondencias con las imágenes están en `docs/PERSONAJES.md`.

Para volver a empaquetar Andrés y Coki, ejecuta `python assets/personajes/generar_nuevos.py`. Usa las ilustraciones maestras ya generadas y conserva el formato y las funciones de animación de los originales; no genera caras ni aplica filtros a fotografías. Requiere Pillow para mantenimiento, pero jugar no necesita dependencias. `tests/personajes-browser.html` muestra el elenco completo y `tests/sprites-integration.html` comprueba selección, ambos conductores, actuación y resultado. Las referencias, especificación visual, prompts, copia de seguridad y capturas están en `docs/sprites-andres-coki/`.

Las plazas incorporan fachadas claras, macetas, banderines, luces, escenario, micrófonos, altavoces y público animado. Universidad, jardín y fiesta tienen detalles propios. La decoración conserva las rutas y colisiones originales. Para sustituir fotografías cambia `photo`/`reference` en `data.js`; usa imágenes optimizadas y conserva el escudo original.

## Añadir niveles

Añade la canción a `partituras.json` y una preparación a `settings` de `data.js`. Amplía los arrays de la primera ronda y, si quieres una segunda vuelta, añade su objetivo y separación en `secondTargets`. Configura lugar, tema, foto, tiempo, charcos, objetos, textos, teclas, separación entre objetivos y velocidad. Hay cinco posiciones de recogida: añade posiciones y verifica rutas si necesitas más de cinco objetivos. El guardado usa la cantidad de niveles automáticamente. Para superar seis teclas debes ampliar `keys`, `codes`, colores y distribución visual. Comprueba que el MIDI ofrece suficientes ataques para cubrir los 60 segundos.

## Pruebas

```sh
node tests/engine.test.cjs --report
node tests/audio.test.cjs
python tests/personajes.test.py
python tests/integrity.py
```

Desde el servidor, abre `tests/browser-integration.html`: usa el controlador, dibujo y menús reales para completar las veinte etapas con un reloj controlado y guardado en memoria. `#qa` solo se habilita dentro del iframe de pruebas. `tests/music-browser.html` mide la señal de Web Audio de las diez canciones; su enlace de recursos ausentes comprueba las copias de respaldo. `tests/responsive.html` muestra escritorio y móvil, incluida la actuación de seis columnas. Resultados y límites de la campaña: `docs/PRUEBAS.md`. La sustitución posterior de los personajes y sus comprobaciones se documentan en `docs/PRUEBAS-PERSONAJES.md`.

## Siguientes ampliaciones

Una transcripción más detallada de la referencia de Cartagenera, calibración de latencia de audio y nombres confirmados de los músicos. La curva de dificultad puede ajustarse después de observar partidas de jugadores reales.


## Once componentes y recompensas (8 de octubre de 2026)

El catálogo único de `src/data.js` incluye a Miguel A., Pacheco´s, C15, Piter, Pesetas, Andrés, Coki, LEGÍA, PEDRO V., PONDER y PEÑA. El jugador elige exactamente cinco antes de preparar cada encargo. La localidad, el evento, la canción, el nivel y `selectedCharacters` permanecen en la misma actuación. Repetir conserva ese encargo; avanzar crea uno nuevo con la selección vacía.

| Personaje | Función | Disponible desde | Victoria necesaria |
| --- | --- | --- | --- |
| PEDRO V. | Bailarín, sin instrumento | 3 | 2 |
| Andrés | Pandereta | 5 | 4 |
| PONDER | Bandurria | 6 | 5 |
| PEÑA | Bandurria | 8 | 7 |
| LEGÍA | Guitarra | 10 | 9 |

Se puede repetir un nivel anterior usando personajes ya conseguidos. Perder no concede recompensas. Todos los personajes aparecen en «ELIGE TU TUNA»; los bloqueados muestran el nivel necesario. Pacheco´s sigue excluido de los eventos benéficos con «Pone una escusa para no actuar». El motor vuelve a validar el catálogo, desbloqueos, duplicados y restricciones al comenzar, aunque la interfaz se haya manipulado. La generación admite únicamente encargos con al menos cinco componentes elegibles.

El guardado conserva su clave y pasa a versión 3. `characterUnlocks` registra personajes ganados y `characterRewardsSeen` registra las tarjetas confirmadas con «CONTINUAR». Al leer una partida anterior, las estrellas y el avance desbloquean automáticamente lo ya conseguido sin borrar marcas, ajustes ni progreso. Las tarjetas pendientes se muestran en orden y sobreviven a una recarga antes de confirmarlas. Las confirmadas no vuelven a aparecer.

Los nuevos dibujos se generaron con ImageGen integrado, usando las fotografías individuales como identidad y los ocho sprites aprobados como estilo. Los originales no se modificaron. `assets/personajes/generar_ampliacion.py` empaqueta las ilustraciones maestras en celdas de 192 × 320; la línea de apoyo es y=315. Peña y Ponder usan atlas de cuatro columnas y cuatro filas. Pedro usa ocho columnas y cuatro filas; su fila de actuación incluye ocho poses de baile, con brazos, torso y piernas en movimiento y rostro constante. El motor selecciona dos poses por pulso usando el reloj musical existente, también después de una pausa. La recogida sigue tratando objetos de equipo compartido y no exige al bailarín un instrumento personal.

Para añadir personajes: agrega su registro con `id`, `name`, `instrument` (o `kind:'dancer'` e `instrument:null`), `unlockLevel`, `unlockMessage` y, si corresponde, `animationColumns`; incorpora su base y atlas. Las reglas se combinan centralmente desde localidad, evento, canción y nivel: `forbiddenCharacters`, `requiredCharacters`, `recommendedCharacters`, `incompatibleCharacters` y `reasons`. No hay reglas nuevas activas fuera de los desbloqueos y la exclusión benéfica de Pacheco´s.

Pruebas de esta ampliación: `node tests/progression.test.cjs`, `node tests/engine.test.cjs`, `node tests/audio.test.cjs` y `tests/ampliacion-browser.html`. El último usa el controlador real, un reloj controlado y guardado aislado para completar las veinte etapas, verificar las cinco tarjetas y capturar a los once juntos. `tests/run-ampliacion.cjs` automatiza esa revisión con Playwright; `tests/run-publicacion.cjs` comprueba además recargas, migración, selección móvil y una actuación completa con reloj normal. Solo el mantenimiento necesita esas herramientas; jugar continúa sin dependencias. Las capturas e informes locales están en `docs/ampliacion-once/`, sin publicar las copias de seguridad ni la biblioteca MP3.
# Piloto local de Clavelitos MP3

Clavelitos (niveles 1 y 11) usa el MP3 aprobado de 60 segundos y sus mapas normal/difícil versionados. Las demás canciones siguen usando MIDI; el menú y la recogida permanecen en MIDI. Los MP3 de revisión no se copian al juego público sin permiso documentado de distribución.

Documentación, resultados y limitaciones: [docs/clavelitos-mp3/INFORME.md](docs/clavelitos-mp3/INFORME.md). La herramienta local para revisar la onda y el audio no forma parte del despliegue público. Prueba de ambas dificultades con progreso aislado: `tests/clavelitos-browser.html`.

## Clasificaciones públicas

El juego ofrece una tabla por nivel y otra general sin crear cuentas. Los nombres se muestran en mayúsculas y quedan en el dispositivo; las puntuaciones públicas se conservan doce meses. Un UUID local distingue una instalación, no identifica ni verifica a una persona y no se sincroniza entre dispositivos. No se guardan correos ni direcciones IP. El navegador que envió una marca conserva un recibo privado para poder retirarla.

Los registros están en `public.game_rankings` y las sesiones temporales en `public.game_rank_sessions`, con RLS activa y sin permisos de lectura o escritura para los roles del navegador. La Edge Function `tuna-rankings` valida origen, clave publicable, apodo, nivel, mapa, duración mínima, notas y puntuación. Cada sesión se usa una vez y caduca a los quince minutos; se limitan los inicios por instalación local. Solo se conserva la mejor marca por jugador local y nivel. La general suma la mejor precisión de cada nivel y divide entre veinte; los niveles no jugados valen cero. Sin cuentas ni ejecución confiable en servidor, no se pueden eliminar todas las trampas.

El ranking usa el proyecto Supabase gratuito existente; no se abrió otro servicio. El coste depende de mantenerse dentro de las cuotas del plan. El SQL está en `supabase/migrations/20261008_game_rankings.sql` y la API en `supabase/functions/tuna-rankings/index.ts`.

## Disponibilidad de MP3

En la biblioteca local `MP3/` hay doce MP3 y un vídeo; el vídeo no es un MP3. El sitio público distribuye solo Clavelitos, cuya publicación aprobó el usuario. Los nueve temas MIDI restantes siguen jugables. Faltan MP3 de Adelita, El Rey, Cartagenera y Todos los Besos; los otros archivos de escucha se mantienen fuera del despliegue mientras no conste permiso de distribución. El catálogo local `MP3/catalogo.json` registra fuentes y autorizaciones. Por eso esta versión tiene diez canciones y veinte niveles, no treinta y dos.

Para restaurar solo Clavelitos MIDI, cambiar su registro a `enabled:false` en `src/recordings.js`; el MIDI original y el resto del repertorio se conservan. El resto de MP3 locales y las herramientas de revisión no forman parte del despliegue.

# CAÑERO — integración del duodécimo personaje

Se añade un acompañante de pie, sin instrumento, con una botella Mahou dibujada dentro del sprite. La fotografía sentada aportada por el usuario se conserva intacta como referencia de rostro, pelo, complexión y vestuario. La pose vertical se creó como ilustración artística nueva con ImageGen integrado, tomando Peña, Andrés y Legía como referencias de estilo. Se revisaron dos versiones: la segunda ajusta la capa y acerca el brazo al cuerpo para encajar sin deformaciones en el formato existente.

## Assets y animación

- `assets/personajes/referencias/canero.jpg`: copia exacta de la fotografía aportada.
- `assets/personajes/ilustraciones/canero-base.png`: dibujo maestro transparente.
- `assets/personajes/ilustraciones/canero-celda.png`: celda 192 × 320; figura 152 × 304, apoyo en y=315.
- `assets/personajes/canero.svg`: envoltorio del mismo PNG, para selección y respaldo.
- `assets/personajes/canero-atlas.png`: 1536 × 1280; ocho columnas, cuatro estados, 32 poses.
- `assets/personajes/generar_canero.py`: empaquetado y animación; reutiliza la marcha aprobada del elenco. Reposo con desplazamiento leve de torso, actuación con mano/botella y brazo libre, celebración discreta. El rostro conserva sus píxeles entre poses.
- `assets/personajes/canero-referencias.json`: dimensiones, anclajes, procedencia y hashes.

La botella y el agarre se desplazan juntos. Las transiciones en el brazo se suavizan hacia el codo; no se añade una imagen externa al renderizado. La actuación usa una pose por pulso y la celebración tiene un rebote menor que el de los músicos. Los once sprites y atlas existentes no se regeneran.

## Código

- `src/data.js`: registro `canero`, nombre CAÑERO, función `companion`, instrumento nulo, nivel disponible 2 y mensaje de recompensa solicitado.
- `src/game.js`: etiqueta «🍺 Acompañante» y el icono de cerveza en el sistema de tarjetas existente.
- `src/art.js`: cadencia de acompañante y celebración discreta; usa el mismo renderer, celda, sombra y apoyo.
- `index.html`: versiones de caché de esos tres scripts.
- `README.md`: catálogo y documentación del nuevo personaje.
- `tests/engine.test.cjs`, `tests/progression.test.cjs`: catálogo de doce y seis desbloqueos.
- Nuevos tests: `tests/canero.test.cjs`, `tests/canero-assets.test.py`, `tests/run-canero.cjs`.

No se modifica el motor, la música, los mapas, el audio ni el backend de clasificaciones. `protected-before.json` registra los hashes previos de los once sprites, MP3, mapas y módulos protegidos; el test de integridad comprueba que no cambian. La copia de restauración de los archivos modificados está en `backup/` y no se despliega.

## Desbloqueo y guardado

Se reutilizan `unlockLevel`, `characterUnlocks` y `characterRewardsSeen`. Una victoria en nivel 1 concede CAÑERO. Perder o comenzar nivel 2 no lo concede. La tarjeta pendiente sobrevive a una recarga; confirmar CONTINUAR la reconoce permanentemente. Una partida anterior con nivel 1 superado recibe automáticamente el personaje sin perder marcas ni los otros desbloqueos. Se mantienen Pedro V. 3, Andrés 5, Ponder 6, Peña 8 y Legía 10.

La selección sigue exigiendo cinco, almacena el grupo dentro del encargo y rechaza un sexto. CAÑERO no tiene restricciones de evento. Pacheco´s sigue bloqueado en eventos benéficos con el mensaje existente. La preparación continúa recogiendo equipo compartido y no asigna un instrumento personal al acompañante.

## Verificación

Pruebas de motor, audio, progreso, biblioteca MP3 y clasificaciones; integridad de recursos anteriores; rostro, botella, transparencia y anclajes de las 32 poses. Playwright ejecuta Edge/Chromium real con guardado aislado. El controlador de prueba completa el nivel 1 y comprueba su tarjeta; además se juega una actuación MP3 completa con CAÑERO usando el reloj real del audio y pulsaciones de espacio. Se prueba selección/deselección, cuatro y seis integrantes, resultado con cinco, recargas y partidas antiguas.

Vistas revisadas: 1440 × 1000, 390 × 844 y 320 × 740. Son emulaciones de tamaño/táctil, no pruebas físicas de Safari iOS o Android. Se capturan los doce juntos, los cuatro estados, preparación, actuación, resultado, recompensa y selección móvil. Los resultados exactos se guardan en `local-browser-results.json` y, tras publicar, `online-browser-results.json`. No se guardan puntuaciones de prueba en los rankings públicos.

## Generación artística

Se utilizó la herramienta ImageGen integrada, sin API ni conversión automática de la fotografía. El texto de generación y de ajuste de la pose se conserva en `PROMPTS.md`.

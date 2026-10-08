# LEGÍA · incorporación del octavo músico

## Identidad y arte

La referencia es `PERSONAJES/LEGIA.png`, localizada sin depender del acento o extensión del nombre solicitado. La guitarra fue confirmada explícitamente por el usuario. La referencia original permanece intacta; su copia para créditos está en `assets/personajes/referencias/legia.png`.

Se utilizó ImageGen integrado de ChatGPT con dos referencias: LEGIA.png para identidad y vestimenta, y la comparación de los siete sprites para estilo. Se pidió un dibujo nuevo, completo y transparente, con contorno intencional, sombreado dibujado y proporciones equivalentes; sin recortar ni pixelizar la referencia. Se conservan el pelo corto oscuro con entradas, rostro ancho, barba muy corta, beca roja, puños y cuello blancos, guitarra de madera y capa negra con forro rojo.

La ilustración maestra está en `assets/personajes/ilustraciones/legia-base.png`. Su celda canónica de 192 × 320 está en `legia-celda.png`; el atlas es de 768 × 1280 con dieciséis poses. El empaquetador `generar_legia.py` reutiliza las funciones aprobadas de Andrés y Coki y las de los originales, sin regenerar ningún otro músico. Mantiene la cabeza idéntica en las poses, apoyo y=315, paso de dos píxeles y movimiento localizado de rasgueo. El SVG solo envuelve la celda PNG para el respaldo existente. No hay conversión fotográfica a SVG.

## Integración

El catálogo incorpora un registro añadido a `src/data.js` con id `legia`, nombre `LEGÍA`, instrumento `guitarra` y referencia de créditos. `index.html` renueva la caché del catálogo y renderizador. En `src/art.js` se limita la posición del elenco de la portada cuando hay más de siete músicos para evitar que el octavo quede cortado; no se cambia tamaño, dibujo ni la representación durante las fases. La selección, rotación del conductor, grupo durante la recogida, actuación y resultado funcionan automáticamente con el sistema existente. LEGÍA no tiene restricciones; sigue vigente únicamente la prohibición de Pacheco´s en Evento benéfico. No se cambia el máximo de cinco.

`antes.json` guarda SHA-256 del estado previo, incluidos los siete sprites y los recursos musicales; `backup/` conserva los archivos de integración anteriores. No se publican los respaldos ni documentos de referencia privados.

## Archivos nuevos

- `assets/personajes/legia.svg`, `legia-atlas.png`, `legia-referencias.json` y `generar_legia.py`.
- `assets/personajes/ilustraciones/legia-base.png` y `legia-celda.png`.
- `assets/personajes/referencias/legia.png`.
- `tests/legia.test.py` y `tests/legia-browser.html`.
- Documentación, referencias, respaldo y capturas en esta carpeta.

## Archivos actualizados

- `src/art.js`: encaje en la portada para el catálogo ampliado, sin cambiar el dibujado de sprites.
- `src/data.js`: octavo personaje, sin alterar los siete registros anteriores.
- `index.html`: versión del catálogo para invalidar caché.
- `README.md`: catálogo y mantenimiento de LEGÍA.
- `tests/engine.test.cjs` y `tests/browser-integration.html`: expectativas de ocho músicos.
- `tests/personajes-browser.html`: comparación adaptable a ocho o más personajes.

No se modifican motor, renderizado de sprites, CSS, audio, MIDI, controles, duración, niveles ni puntuaciones.

## Pruebas locales

- `tests/legia.test.py`: referencia y fuente artística verificadas, transparencia, dieciséis poses, rostro estable, pies y transiciones; siete sprites y recursos protegidos sin cambios.
- Motor: 24/24, incluidos los veinte niveles en ambas dificultades y restricciones.
- Audio: 22 comprobaciones correctas.
- Los cinco sprites originales y Andrés/Coki pasan sus pruebas anteriores.
- Navegador: 253 comprobaciones generales y 26 específicas de LEGÍA, cero fallos. Actuación completa con LEGÍA; recogida como conductor, resultado, grupo sin LEGÍA y evento benéfico con bloqueo de Pacheco.
- Selección a 390 × 844: ocho fichas visibles, nombre e instrumento completos, contador 0/5 y 5/5, botón y límite correctos. Capturas `seleccion-movil*.png`.
- Comparación del elenco completo con el renderizador real: `elenco-final.png`, `caminar.png` y `victoria.png`. Capturas de recogida, actuación y resultado: `flujo-1.png` a `flujo-3.png`.

En los recorridos acelerados locales dentro de iframe, el navegador de automatización registra ocasionalmente un error externo de MutationObserver sin URL. El proyecto no utiliza MutationObserver; el juego normal tiene consola limpia. Las pruebas funcionales se completan. No se modificó el juego para ocultar ese mensaje.

La revisión móvil utiliza viewport; no se ha probado en un teléfono físico.

## Repetir o ampliar

Para empaquetar de nuevo: `python assets/personajes/generar_legia.py`. No ejecuta los generadores de los otros siete. Para crear otro dibujo artístico, proporcionar la identidad de la referencia y el elenco aprobado como guía, pedir transparencia real y comprobar el resultado junto al resto antes de empaquetarlo. Para añadir futuros personajes, seguir el catálogo actual y las reglas de selección existentes.

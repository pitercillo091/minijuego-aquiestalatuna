# Clavelitos MP3 — candidata local para revisión

8 de octubre de 2026. **No publicada. No se presenta como sincronización musical definitiva.** Las comprobaciones de reproducción, reloj, puntuación e integridad han pasado; la correspondencia artística de los patrones necesita escucha humana y aprobación del usuario.

## Grabación y fragmento

- Original: `MP3/01_Clavelitos_Tuna_de_Distrito_de_Murcia.mp3`.
- Intérprete confirmado por metadatos y catálogo: Tuna de Distrito de Murcia.
- Duración del contenedor: 134,568 s. Duración PCM decodificada por FFmpeg: 134,551474 s. La diferencia corresponde a la representación/codificación MP3; se usan muestras decodificadas para el fragmento.
- Estéreo, 32 kHz, 128 kb/s, 2.153.543 bytes.
- SHA-256: `87ab886883baadb702891b9d110aab8142743a9152325a51cb7e9cfafc8c9955`.
- Fragmento candidato: **0,320–60,320 s**, 60 segundos efectivos. Evita el silencio de entrada y mantiene el comienzo de la interpretación. La cuenta atrás de tres segundos es independiente, anterior a la música.
- Sin recortar, transcodificar, acelerar, normalizar destructivamente ni sobrescribir el original. En memoria se conserva solo el fragmento PCM, compartido por las dos dificultades.
- FFmpeg emitió avisos de reserva de bits al decodificar el archivo; se conservan en `decoder-warnings.txt`. Web Audio lo decodificó sin errores en los dos motores Chromium comprobados. Conviene escuchar la calidad de la fuente y probar su decodificación en Safari/Firefox antes de aprobarla definitivamente.

## Mapa propio de esta interpretación

`analizar.py` mide flujo espectral y ataques a resolución de 5,805 ms. Un seguimiento de pulsos con programación dinámica admite variaciones temporales. Los candidatos de periodicidad son 116,13, 76,56 y 156,61 pulsos/minuto; la secuencia elegida tiene mediana 117,45. **Es una estimación de pulsos, no una afirmación de tempo/compás auditivamente confirmado.** No modifica la velocidad de reproducción ni utiliza tiempos del MIDI.

`crear_mapa.py` produce tiempos explícitos a partir de esos ataques medidos:

- Normal, nivel 1: **46 notas**, carriles A/S, ataques principales y respuestas de frase espaciadas.
- Difícil, nivel 11: **156 notas**, carriles A/S/W, mismos ataques principales más pulsos y ataques de paso detectados, separación mínima 200 ms.
- Ambas versiones usan la misma grabación, sin acelerar la canción. Última nota: **59,674558 s**. Con la ventana máxima original de 230 ms sigue siendo acertable antes del segundo 60.
- Hay notas en todos los bloques de cinco segundos, incluido 55–60. No se repite audio, no se inventan subdivisiones regulares para rellenar el final y no se importa la melodía MIDI.
- El mapa registra versión, intérprete, archivo, hash, fragmento, duración, compensación temporal, carriles, tipo, acento y tiempo de origen de cada nota. La asignación de carriles representa patrones jugables, no alturas musicales.

**Limitación:** seleccionar ataques y agruparlos en frases mediante análisis no sustituye una escucha crítica. No se ha podido efectuar una audición humana por parte del agente ni identificar con certeza entradas de voces, letra o secciones formales. El mapa y el fragmento son candidatos; el revisor permite escucharlos, comparar los instantes y proponer correcciones antes de aprobarlos. No se afirma que cada nota coincida con el acento musical deseado únicamente porque coincide con un ataque detectado.

## Transporte y sincronización

`src/recordings.js` registra canciones con formato MP3, mapa, fragmento, duración y configuración. Solo Clavelitos está habilitado. El resto conserva la ruta MIDI anterior. Menú y recogida siguen usando MIDI.

`TunaAudio.prepareRecording()` verifica la identidad del archivo, decodifica antes de reproducir y reutiliza un único buffer de 60 s. Se anticipa la carga al abrir el encargo; si falta el archivo, se ofrece reintentar sin ejecutar el nivel a ciegas ni sustituirlo silenciosamente por MIDI.

La fuente se programa en el único AudioContext ya existente. El reloj de juego de Clavelitos se obtiene de su ancla de reproducción y de `getOutputTimestamp()` cuando está disponible, con alternativa basada en las latencias del contexto. Se incluye la anticipación de 6 ms del compresor. El renderizado y la valoración de pulsaciones usan esa misma posición; no acumulan un contador separado por fotogramas. Las otras canciones conservan su reloj y algoritmo anteriores.

En pausa se conserva la posición musical, se destruye la fuente y al reanudar se crea una nueva desde esa posición. Segundo plano e interrupción del contexto pausan la partida. Música silenciada conserva el transporte y reloj, con ganancia cero. Salir/reiniciar invalida cualquier carga pendiente para evitar que una grabación antigua comience en otra pantalla.

La duración PCM es exactamente 60 s. El resultado se muestra en el primer fotograma disponible después del final audible; esa presentación puede demorarse un fotograma. El cierre tiene fundido no destructivo de 160 ms, posterior a la última nota. Se mantienen las ventanas, las puntuaciones, penalizaciones y teclas originales.

Referencias técnicas: [inicio y offset de AudioBufferSourceNode](https://developer.mozilla.org/en-US/docs/Web/API/AudioBufferSourceNode/start), [reloj de salida](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/getOutputTimestamp), [decodificación](https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/decodeAudioData).

## Nivel de audio

Fragmento medido: aproximadamente **−14,6 LUFS**, pico verdadero **−1,0 dBFS**. No requiere aumento de ganancia. El ajuste no destructivo por grabación es 0,9, seguido por los buses, volumen principal, compresión y limitación existentes.

Una renderización offline de la cadena real, con todos los efectos de acierto de la versión normal, midió:

| Volumen del usuario | Pico de salida | RMS de salida |
|---|---:|---:|
| 45 % | −5,17 dBFS | −22,20 dBFS |
| 100 % | −1,55 dBFS | −17,64 dBFS |

No hubo muestras recortadas en esta prueba. No se ha medido volumen percibido en altavoces físicos de teléfonos. El buffer retenido ocupa unos 23 MB a 48 kHz estéreo; la decodificación completa requiere temporalmente más memoria. Una única carga/buffer por grabación evita acumulación en partidas consecutivas.

## Pruebas y evidencias

- 24 pruebas de motor, 23 de MIDI/audio, cuatro suites de progresión y seis de mapas, reloj, integridad y restauración.
- Partidas reales completas, con rAF y fuentes Web Audio sin acelerar el reloj: Clavelitos normal, difícil, normal repetido, normal móvil táctil emulado y Cielito Lindo MIDI.
- Muestreos en 5, 15, 30, 45 y 55 s: diferencias entre reloj de render y audio inferiores a 2 ms en estas ejecuciones. El segundo 60 cierra el nivel y libera la fuente. Esta medida comprueba transporte, no calidad del acento elegido.
- Difícil: 156/156 aciertos; repetición normal y móvil: 46/46. Normal con pausa y silencio: 45/46, con una nota perdida mientras el controlador de prueba esperaba durante el silencio. Cielito Lindo: 24/24. Puntuación y cierre correctos.
- Pausa/reanudación, silencio sin detener reloj, estado suspended, cambio de visibilidad simulado, fotograma bloqueado 650 ms, ajustes conservados tras recarga.
- Archivo ausente con reintento, cancelación de carga al volver al menú, cache de un buffer/contexto estable, liberación de fuentes/nodos.
- Comparación exacta de mapas MIDI anteriores para las 18 actuaciones no migradas. Hashes iguales de todos los MP3/MIDI, sprites, CSS y datos originales.
- Edge instalado y Chromium 1228, con pantalla 390×844 y entradas táctiles emuladas. Sin errores JavaScript ni recursos fallidos en la comprobación de consola e interrupciones.
- Pendientes: audición y evaluación de disfrute por una persona, Android/iOS físicos, Safari y Firefox. La emulación no prueba hardware de audio ni Bluetooth. El fallback sin getOutputTimestamp se ha revisado en código, pero no se ha medido en esos dispositivos.

Evidencias: `pruebas-navegador.json`, `pruebas-audio.json`, `pruebas-interrupciones.json`, `escritorio.png`, `movil.png`, `analisis.json`, `mapa-revision.json`.

## Revisión y reversibilidad

Con un servidor local en la raíz JUEGO, abrir `docs/clavelitos-mp3/REVISAR_CLAVELITOS.html`. Permite escuchar el original, ver onda/notas, desplazarse, proponer un offset y exportar un mapa revisado. No altera la grabación ni el juego. `tests/clavelitos-browser.html` permite jugar ambas versiones con almacenamiento temporal aislado.

Para volver solo a Clavelitos MIDI, poner `enabled:false` en su entrada de `src/recordings.js`. El MIDI original permanece intacto. `backup/` contiene las fuentes anteriores y un manifiesto SHA-256; no se ha creado ningún commit ni se ha desplegado.

Archivos funcionales modificados: `index.html`, `src/engine.js`, `src/audio.js`, `src/game.js`, `src/art.js` (cuenta atrás y evitar progreso negativo durante ella). Nuevos: `src/recordings.js`, `src/charts/clavelitos.js`. README y pruebas actualizados; documentación/herramientas separadas dentro de `docs/clavelitos-mp3` y `tests`.

## Publicación pendiente

El catálogo confirma la importación local desde TUNA PENDRIVE y **no confirma autorización para distribuir esta grabación en el videojuego público**. Debe aportarse esa confirmación y aprobarse la candidata. No se ha cambiado la web publicada.

Una publicación posterior deberá incluir únicamente el MP3 aprobado (sin publicar la biblioteca completa), el mapa y fuentes del juego; excluir `docs`, herramientas, pruebas, backups y otros MP3. Ninguna otra canción ha sido migrada.

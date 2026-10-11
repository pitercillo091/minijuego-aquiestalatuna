# Tres vueltas y EL LEGÍA · 11 de octubre de 2026

## Catálogo real y orden

El catálogo aprobado contiene 14 grabaciones. Adelita, El Rey y Cartagenera no estaban implementadas en la campaña MP3; se mantiene el orden real de las trece existentes y se añade EL LEGÍA al final. Son 42 niveles calculados como 14 canciones × 3 vueltas.

| Canción | Normal (60 s) | Difícil (60 s) | Experto (120 s) | Inicio del archivo | Notas N / D / E |
|---|---:|---:|---:|---:|---|
| Clavelitos | 1 | 15 | 29 | 0.320 s | 46 / 156 / 391 |
| Cielito Lindo | 2 | 16 | 30 | 0.270 s | 54 / 121 / 401 |
| Estudiantina Madrileña | 3 | 17 | 31 | 1.090 s | 45 / 111 / 386 |
| Las Cintas de mi Capa | 4 | 18 | 32 | 0.320 s | 49 / 130 / 499 |
| La Isa Canaria | 5 | 19 | 33 | 1.180 s | 51 / 110 / 364 |
| La Morena de mi Copla | 6 | 20 | 34 | 35.213 s | 50 / 107 / 340 |
| María la Portuguesa | 7 | 21 | 35 | 35.364 s | 48 / 112 / 397 |
| Soy Cordobés | 8 | 22 | 36 | 0.160 s | 46 / 108 / 410 |
| Guantanamera | 9 | 23 | 37 | 45.625 s | 47 / 126 / 477 |
| Viva España | 10 | 24 | 38 | 0.540 s | 47 / 127 / 330 |
| Isa de Ronda | 11 | 25 | 39 | 0.010 s | 51 / 103 / 233 |
| San Cayetano | 12 | 26 | 40 | 1.120 s | 50 / 133 / 384 |
| Todos los Besos | 13 | 27 | 41 | 1.010 s | 48 / 129 / 321 |
| EL LEGÍA | 14 | 28 | 42 | 0.000 s | 50 / 138 / 425 |

## EL LEGÍA y presentación bonus

Original conservado: `MP3/EL LEGIA.mp4`. Archivo reproducible: `MP3/17_El_Legia_desde_original.mp3`, 271,116190 segundos, MP3 VBR de calidad procedente del AAC original. No se altera la velocidad ni se recorta el original. El usuario confirmó la autorización de publicación y aprobó por escucha la entrada desde 0:00. El intérprete no está documentado; no se ha inventado uno.

Los niveles 14, 28 y 42 muestran una tarjeta con la imagen original `Legionario y Morita.png`, copiada íntegramente a `assets/referencias/legionario-y-morita.png`. Se reutilizan el diálogo, tipografía y botón existentes. La entrada al nivel 29 anuncia brevemente la tercera vuelta.

## Mapas y sincronización

Los mapas normal y difícil de las trece canciones existentes conservan exactamente sus notas y sus puntos de inicio. Guantanamera mantiene 45,625 segundos. Experto analiza los 120 segundos reales posteriores a cada entrada: pulsos de tempo variable y ataques medidos con librosa sobre PCM mono de 22050 Hz, con paso de 128 muestras. Se añaden ataques destacados respetando una separación mínima efectiva de 156 ms y seis teclas existentes. No se duplica el primer minuto ni se crean bucles de audio.

EL LEGÍA tiene mapas nuevos de 50, 138 y 425 notas, respectivamente. Cada evento contiene instante relativo, instante absoluto del MP3, tecla, carril y tipo. Los mapas tienen una huella/versionado estable. Todas las grabaciones contienen audio suficiente para los 120 segundos; todas las ventanas de cinco segundos tienen actividad. En San Cayetano la última nota experta está en 117,580 s: el acorde final decae de forma natural durante el cierre, sin añadir ataques ficticios.

El reloj único es el transporte de Web Audio existente. Pausar guarda el tiempo musical, detiene la fuente y reanudar la recrea desde ese instante; la caída visual conserva los instantes de acierto. La caché ahora distingue archivo, huella, inicio y duración: jugar el mismo tema en 60 y 120 segundos no reutiliza un fragmento corto por error. Se conserva un único contexto y una sola grabación decodificada en caché.

Experto aumenta la densidad, utiliza seis teclas y acelera la anticipación visual. No se acelera el MP3 ni se estrechan artificialmente las ventanas de acierto. EL LEGÍA no entra en la lista aleatoria de menú/recogida, conservando las trece pistas ambientales existentes.

## Progreso y clasificaciones

Guardado versión 5: `levelKeys` y `chartIds` identifican canción/dificultad/mapa. Se migran las partidas de 26 niveles sin atribuir estrellas o récords a otra canción. Los niveles bonus y experto nuevos no se marcan como superados. Se conservan personajes, recompensas vistas, preferencias y avances; los registros incompatibles se archivan en `legacyCampaigns`/`archivedRecords`.

El servidor tiene un catálogo de 42 mapas y sesiones con su duración correspondiente. Se conservan los registros históricos, su ID, canción y número original. Las tablas actuales usan la identidad estable de canción/dificultad/mapa; «Mapas anteriores» permite consultar versiones incompatibles por separado, sin presentarlas como competición entre mapas diferentes. Los recibos privados conservan el permiso de retirada. La general suma la mejor precisión de cada mapa actual y divide entre 42, contando como cero los no jugados: no favorece los niveles más largos por sus puntos brutos.

Los doce registros presentes en la copia inicial continúan en la base de datos, con la misma canción. Un jugador mejoró legítimamente una marca durante el trabajo; no se ha revertido su resultado. Las pruebas API emplearon un identificador temporal distinto y retiraron todas sus marcas de prueba.

## Comprobaciones realizadas

- 14 suites de pruebas locales: motor, audio, progresión, selección flexible, restricciones, eventos, promoción, mapas, migración y coherencia cliente/servidor.
- 42 actuaciones completas en tiempo real con audio decodificado y pulsaciones mediante controles reales. Duración efectiva exacta 60/120 s, todas las notas acertables, identidad conservada y cero errores de página.
- Muestreo experto en 10, 30, 60, 90, 110 y 119,9 s; diferencia observada entre lecturas sucesivas del reloj visual/audio por debajo de 40 ms, sin desviación acumulativa. Es una prueba de relojes, no una medición física de latencia del altavoz.
- Pausa/reanudación en cada actuación, liberación de fuentes, un solo contexto y una sola grabación en caché.
- API de los 42 niveles; pruebas de resultados de 60/120 s, rechazo de envío prematuro y datos manipulados, token de un uso, puntuación experta superior a 100000, histórico y retirada.
- Tarjeta bonus y presentación experta a 1365, 390 y 320 píxeles; Dúo Dinámico y certamen continúan funcionando.
- Navegadores probados: Chromium y Microsoft Edge. Móvil mediante emulación táctil y viewport correcto, sin prueba física en Android/iPhone.

## Límites de la revisión

Se han contrastado los mapas nuevos con ataques/pulsos medidos del audio y su llegada visual mediante el reloj real. Esta sesión no permite escuchar directamente: la entrada de EL LEGÍA fue confirmada por el usuario; no se afirma una escucha humana completa de los catorce mapas expertos. La revisión musical subjetiva de patrones y latencia en dispositivos físicos sigue siendo aconsejable. Safari/iOS y Firefox no se han ejecutado físicamente aquí.

## Archivos y reversibilidad

Cambios de ejecución: `src/recordings.js`, `src/data.js`, `src/engine.js`, `src/audio.js`, `src/ambient-recordings.js`, `src/game.js`, `src/leaderboards.js`, catorce archivos de `src/charts/`, `index.html`, `css/game.css`. Nuevos recursos: MP3 de EL LEGÍA e imagen bonus. Backend: catálogo `manifest.json`, Edge Function `tuna-rankings` y migración SQL `20261011000100_stable_music_rankings.sql`. Documentación y pruebas locales actualizadas.

Copia previa completa: `E:/PROYECTOS/_backups/third-round-20261011/production-before.zip`, además de código y definiciones/filas previas del backend. Los MP4 originales, trece MP3 previos y sprites no se modifican. Las herramientas de análisis y muestras de revisión permanecen locales.

## Publicación

Versión candidata preparada. La comprobación online se realiza después del despliegue y se registra en el informe local final.

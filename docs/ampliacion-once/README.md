# Once integrantes — versión 4

8 de octubre de 2026. Se incorporan PEDRO V. (bailarín), PONDER y PEÑA (bandurria). Los ocho personajes anteriores y los recursos musicales permanecen idénticos.

## Arte y animación

Las tres fotografías originales se conservaron sin cambios. ImageGen integrado creó dibujos nuevos guiados por cada identidad y por el elenco aprobado. Las ilustraciones maestras están en `assets/personajes/ilustraciones/`; los SVG contienen únicamente una celda PNG transparente. El juego carga estos SVG y sus atlas, nunca las fotos como sprites.

Se reutilizó el empaquetado aprobado para Andrés, Coki y Legía: celda 192 × 320, figura de 304 píxeles de alto, punto de apoyo y=315, cuatro estados. Peña y Ponder usan cuatro columnas; Pedro usa ocho. Todas las poses mantienen el rostro. El baile combina brazos, torso y pasos laterales y se reproduce a dos poses por pulso del reloj musical existente. La pausa detiene ese reloj y reanuda la misma secuencia. El anclaje y la sombra de contacto son los comunes del motor.

## Progresión

Un único catálogo declara los niveles disponibles: Pedro 3, Andrés 5, Ponder 6, Peña 8, Legía 10. Solo una victoria habilita el siguiente nivel y sus personajes. Las tarjetas celebran cada incorporación; el personaje conseguido y la tarjeta confirmada se guardan por separado. La migración aprovecha estrellas y avance existentes, conserva marcas y preferencias y recupera tarjetas sin confirmar después de recargar.

Las reglas se combinan centralmente por localidad, evento, canción y nivel. Pacheco´s permanece excluido de los eventos benéficos. La disponibilidad se valida otra vez dentro del motor, sin confiar en listas modificadas por la interfaz. La actuación conserva su identidad y sus cinco componentes; el bailarín no tiene instrumento propio y transporta equipo compartido si le toca recoger.

## Verificación

- 24 pruebas del motor, incluida campaña de veinte niveles en ambas dificultades.
- Cuatro grupos de pruebas de progresión, migración, restricciones y bailarín.
- 22 comprobaciones del audio y MIDI existentes.
- 244 comprobaciones de navegador por tamaño (escritorio y móvil) completando los veinte niveles y las cinco recompensas.
- Actuación completa con reloj normal, selección de los tres nuevos y conservación del mismo grupo en resultado.
- Recarga antes y después de confirmar recompensas; partida antigua con nivel 12 conservada.
- Selección real de once fichas en anchos 1440, 390 y 320, sin desbordamiento horizontal y con controles accesibles.
- Comparación visual de los once juntos en el escenario y validación de atlas, rostros y transparencia.
- Comparación SHA-256 con el estado anterior: todos los archivos protegidos intactos, incluidos los ocho pares de sprites, música, audio y MP3.

Navegadores usados: Edge y Chromium en Windows; móvil mediante emulación táctil. No se han probado dispositivos físicos iPhone/Android en esta fase. Los informes y capturas se conservan localmente en esta carpeta. La copia de seguridad y la biblioteca MP3 quedan fuera de la publicación.

`tests/ampliacion-browser.html` ejecuta la campaña con el controlador real y guardado aislado. `tests/progression.test.cjs` verifica las reglas. Los dos ejecutores `run-ampliacion.cjs` y `run-publicacion.cjs` requieren Playwright solo para mantenimiento.

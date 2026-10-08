'use strict';
const assert = require('node:assert/strict');
require('../src/rankings-config.js');
const config = globalThis.TunaRankingsConfig;
const Engine = require('../src/engine.js');
const origin = 'http://localhost:8765';
const playerId = '08f986b2-d45e-4a0c-b138-8b6413ec8341';
let token = null, row = null, deleteToken = null;
async function call(body, { apiKey = config.key, requestOrigin = origin } = {}) {
  const response = await fetch(`${config.url}/functions/v1/tuna-rankings`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', Origin: requestOrigin, ...(apiKey ? { apikey: apiKey } : {}) },
    body: JSON.stringify(body), cache: 'no-store',
  });
  let json = {}; try { json = await response.json(); } catch {}
  return { status: response.status, json };
}
async function main() {
  assert.ok(config.url && config.key, 'La clasificación pública está configurada');
  const before = await call({ action: 'list', mode: 'level', level: 1 });
  assert.equal(before.status, 200); assert.equal(before.json.total, 0, 'La prueba empieza sin puntuaciones');
  assert.equal((await call({ action: 'list', mode: 'level', level: 21 })).status, 400);
  assert.equal((await call({ action: 'list', mode: 'level', level: 1 }, { apiKey: '' })).status, 401);
  assert.equal((await call({ action: 'list', mode: 'level', level: 1 }, { requestOrigin: 'https://example.org' })).status, 403);
  const started = await call({ action: 'start', level: 1, playerId });
  assert.equal(started.status, 200); token = started.json.token; assert.ok(token);
  const game = new Engine.Game(); game.start(0);
  game.performance.allowedCharacters.slice(0, 5).forEach(id => game.toggleCharacter(id));
  game.begin(); game.startRhythm();
  assert.equal(game.notes.length, started.json.expectedNotes);
  assert.equal((await call({ action: 'finish', token, playerName: 'PRUEBA TEMPORAL', score: 8000, accuracy: 1, hits: game.notes.length, misses: 0, notes: game.notes.length })).status, 409, 'Rechaza terminar antes del tiempo mínimo');
  assert.equal((await call({ action: 'finish', token, playerName: 'alguien@example.org', score: 8000, accuracy: 1, hits: game.notes.length, misses: 0, notes: game.notes.length })).status, 400, 'Rechaza datos de contacto');
  for (const note of game.notes) { game.tick(0, {}, note.at); game.hit(note.lane); }
  game.tick(0, {}, 60);
  assert.equal(game.phase, 'result'); assert.equal(game.hits, game.notes.length); assert.equal(game.misses, 0);
  await new Promise(resolve => setTimeout(resolve, 56000));
  const saved = await call({ action: 'finish', token, playerName: 'Prueba temporal', score: game.score, accuracy: game.hits / game.notes.length, hits: game.hits, misses: game.misses, notes: game.notes.length });
  assert.equal(saved.status, 200); assert.equal(saved.json.improved, true); row = saved.json.id; deleteToken = saved.json.deleteToken; assert.ok(row && deleteToken);
  const listed = await call({ action: 'list', mode: 'level', level: 1 });
  assert.equal(listed.status, 200); assert.equal(listed.json.total, 1); assert.equal(listed.json.rows[0].player_name, 'PRUEBA TEMPORAL');
  assert.equal((await fetch(`${config.url}/rest/v1/game_rankings?select=*`, { headers: { apikey: config.key } })).ok, false, 'Las tablas no son accesibles directamente desde el navegador');
  assert.equal((await call({ action: 'finish', token, playerName: 'Prueba temporal', score: game.score, accuracy: 1, hits: game.hits, misses: 0, notes: game.notes.length })).status, 409, 'Una sesión se usa una sola vez');
  const removed = await call({ action: 'delete', id: row, token: deleteToken });
  assert.equal(removed.status, 200); assert.equal(removed.json.deleted, true); row = null;
  const after = await call({ action: 'list', mode: 'level', level: 1 });
  assert.equal(after.status, 200); assert.equal(after.json.total, 0, 'La puntuación de prueba se ha retirado');
  console.log('PASS: API pública, origen/clave, nivel, nombre, tiempo mínimo, sesión de un uso, partida completa, clasificación, tablas cerradas y retirada.');
}
main().catch(async error => {
  if (row && deleteToken) await call({ action: 'delete', id: row, token: deleteToken }).catch(() => {});
  console.error(error.message); process.exitCode = 1;
});

'use strict';
const assert=require('node:assert/strict');
const Rank=require('../src/leaderboards.js');
let passed=0;
function test(name,fn){fn();passed++;console.log('PASS',name);}
test('El apodo permite nombres comunes, acentos, eñe y apóstrofo y los normaliza',()=>{
  assert.equal(Rank.safeName('  peña   loca  '),'PEÑA LOCA');
  assert.equal(Rank.safeName('Pacheco´s'),'PACHECO´S');
  assert.equal(Rank.safeName('Coki_15'),'COKI_15');
});
test('El formulario rechaza HTML, contacto, lenguaje ofensivo y longitud excesiva',()=>{
  for(const name of ['<img src=x>','pedro@example.es','teléfono 612345678','puta tuna','a'.repeat(25),''])assert.equal(Rank.safeName(name),null,name);
});
test('El identificador anónimo es UUID local persistente sin identidad verificada',()=>{
  const values=new Map(),storage={getItem:key=>values.get(key)||null,setItem:(key,value)=>values.set(key,value)};
  const first=Rank.playerId(storage);assert.match(first,/^[0-9a-f-]{36}$/i);assert.equal(Rank.playerId(storage),first);
});
test('Los nombres de clasificaciones se escapan antes de insertarse en HTML',()=>{
  assert.equal(Rank.escapeHtml(`<Tuna & "Ronda">`),'&lt;Tuna &amp; &quot;Ronda&quot;&gt;');
});
console.log(`${passed} comprobaciones del cliente de ranking superadas.`);

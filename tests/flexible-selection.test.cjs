'use strict';
const assert=require('node:assert/strict');
const D=require('../src/data.js');
global.TunaData=D;
require('../src/art.js');
const formation=global.TunaArt.castFormation;
const E=require('../src/engine.js');
let passed=0;
function test(name,fn){fn();passed++;console.log('PASS',name);}
const progress=()=>({unlocked:D.levels.length-1,stars:Array(D.levels.length).fill(3),characterUnlocks:D.characters.map(c=>c.id)});
const gameAt=(level=0,save=progress())=>{const g=new E.Game({progress:save});g.start(level);return g;};

test('Las reglas del grupo son configurables y la pareja especial tiene exactamente dos IDs',()=>{
 assert.equal(D.selectionPolicy.minimum,3);assert.deepEqual(D.selectionPolicy.dynamicDuo,['andres','legia']);
 assert.equal(D.isDynamicDuo(['legia','andres']),true);assert.equal(D.isDynamicDuo(['andres','legia','coki']),false);assert.equal(D.isDynamicDuo(['andres','piter']),false);
});

test('El motor acepta grupos de 3, 5, 8 y todo el elenco elegible',()=>{
 for(const size of [3,5,8,D.characters.length]){const g=gameAt();g.performance.locationId='andujar';g.performance.location=D.locations.find(item=>item.id==='andujar');g.performance.eventId='boda';g.performance.event=D.events.find(item=>item.id==='boda');D.refreshPerformanceAvailability(g.performance,g.progress);const ids=g.performance.allowedCharacters.slice(0,size);assert.equal(ids.length,size);for(const id of ids)assert.equal(g.toggleCharacter(id),true);assert.equal(g.selectionStatus().valid,true);assert.equal(g.begin(),true);assert.equal(g.performance.selectedCharacters.length,size);assert.equal(g.performance.groupMode,'ensemble');}
});

test('Una persona y las parejas ordinarias no inician; Andrés más Legía sí desde sus desbloqueos',()=>{
 const g=gameAt(9);g.performance.selectedCharacters=['andres'];assert.equal(g.begin(),false);g.performance.selectedCharacters=['andres','piter'];assert.equal(g.begin(),false);
 const locked=gameAt(0,{});locked.performance.selectedCharacters=['andres','legia'];assert.equal(locked.begin(),false);
 const ready=gameAt(9);ready.performance.selectedCharacters=['legia','andres'];assert.equal(ready.selectionStatus().valid,true);assert.equal(ready.begin(),true);assert.equal(ready.performance.groupMode,'dynamic-duo');
});

test('Todas las restricciones de evento y localidad siguen bloqueando en la lógica del motor',()=>{
 const cases=[['puente-genil',['guitarra-gafas','guitarra','ponder']],['puertollano',['guitarra-gafas','guitarra','ponder']],['ciudad-real',['guitarra-gafas','guitarra','ponder']],['baena',['ponder']],['porcuna',['canero']]];
 for(const [locationId,ids] of cases){const g=gameAt(9);g.performance.locationId=locationId;g.performance.location=D.locations.find(item=>item.id===locationId);D.refreshPerformanceAvailability(g.performance,g.progress);for(const id of ids){assert.ok(g.performance.unavailableCharacters.includes(id),`${id} must be blocked at ${locationId}`);g.performance.selectedCharacters=[id,'pandereta','bandurria'];assert.equal(g.begin(),false,`${id} cannot bypass ${locationId}`);}}
 const g=gameAt(9);g.performance.eventId='evento-benefico';g.performance.event=D.events.find(item=>item.id==='evento-benefico');D.refreshPerformanceAvailability(g.performance,g.progress);assert.equal(g.performance.restrictionReasons.guitarra,'Pone una escusa para no actuar');g.performance.selectedCharacters=['guitarra','andres','legia'];assert.equal(g.begin(),false);
});

test('La generación de encargos solo escoge combinaciones con una formación válida',()=>{
 for(let level=0;level<D.levels.length;level++){const save=progress();save.unlocked=level;for(let i=0;i<100;i++){const act=D.createPerformance(D.levels[level],'',save);assert.ok(D.canFormGroup({locationId:act.locationId,eventId:act.eventId,song:act.song,levelId:act.levelId},save));assert.ok(act.allowedCharacters.length>=D.selectionPolicy.minimum||D.selectionPolicy.dynamicDuo.every(id=>act.allowedCharacters.includes(id)));}}
});

test('Distribución adaptable mantiene a todos dentro del escenario y deja espacio al área de notas',()=>{
 for(const count of [2,3,5,8,11,12]){const slots=formation(count,'rhythm');assert.equal(slots.length,count);for(const slot of slots){assert.ok(slot.x-40*slot.scale>=0);assert.ok(slot.x+40*slot.scale<=414);assert.ok(slot.y>=132&&slot.y<=500);assert.ok(slot.scale>=.6);}
   if(count>5){assert.ok(new Set(slots.map(s=>s.y)).size===2);const rows=[...new Set(slots.map(s=>s.y))];for(const y of rows){const row=slots.filter(s=>s.y===y).sort((a,b)=>a.x-b.x);for(let i=1;i<row.length;i++)assert.ok(row[i].x-40*row[i].scale>=row[i-1].x+40*row[i-1].scale);}}
 }
});

console.log(`${passed} pruebas de selección flexible superadas.`);

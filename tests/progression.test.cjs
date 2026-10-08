'use strict';
const assert=require('node:assert/strict'),E=require('../src/engine.js'),D=require('../src/data.js');
const storage=value=>({getItem:()=>JSON.stringify(value),setItem(){}});
const fresh=()=>E.readSave(storage({}));
const milestones=[[1,'canero',2],[2,'pedro-v',3],[4,'andres',5],[5,'ponder',6],[7,'pena',8],[9,'legia',10]];
let passed=0;function test(name,fn){fn();passed++;console.log('PASS',name);}
test('Six unlock thresholds, losses and persistent acknowledgments',()=>{
 const save=fresh();for(let level=1;level<=10;level++){
  const g=new E.Game({progress:save});g.start(level-1);g.performance.selectedCharacters=g.performance.allowedCharacters.slice(0,5);assert.ok(g.begin());g.fail('prueba');assert.equal(save.unlocked,level-1);
  const before=[...save.characterUnlocks];assert.deepEqual(save.characterUnlocks,before);E.recordCompletion(save,level-1,level*1200,3);
  for(const [win,id] of milestones)assert.equal(save.characterUnlocks.includes(id),level>=win);
  const due=milestones.find(([win])=>win===level);if(due){assert.deepEqual(E.pendingCharacterRewards(save).map(c=>c.id),[due[1]]);const reload=E.readSave(storage(save));assert.deepEqual(E.pendingCharacterRewards(reload).map(c=>c.id),[due[1]]);assert.ok(E.ackCharacterReward(save,due[1]));assert.equal(E.pendingCharacterRewards(E.readSave(storage(save))).length,0);E.recordCompletion(save,level-1,100,1);assert.equal(E.pendingCharacterRewards(save).length,0);}
 }
 assert.equal(E.ackCharacterReward(fresh(),'pena'),false);
});
test('Migration retains old results, settings and all six earned rewards',()=>{
 const old={version:2,unlocked:12,best:Array(20).fill(4444),stars:Array.from({length:20},(_,i)=>i<12?2:0),volume:.28,music:false,effects:false,character:'legia',easy:false};
 const save=E.readSave(storage(old));assert.equal(save.unlocked,15);assert.ok(save.legacyCampaigns['midi-20-v3']);assert.equal(save.best.length,D.levels.length);for(let i=0;i<12;i++){const song=D.legacySongIds[i%10],round=i<10?1:2,index=D.levels.findIndex(level=>level.song===song&&level.round===round);if(index>=0)assert.equal(save.stars[index],2);}assert.equal(save.volume,.28);assert.equal(save.character,'legia');assert.equal(save.easy,false);assert.equal(save.music,false);assert.deepEqual(save.characterUnlocks,['canero','pedro-v','andres','ponder','pena','legia']);assert.equal(E.pendingCharacterRewards(save).length,6);
 E.ackCharacterReward(save,'pedro-v');const reload=E.readSave(storage(save));assert.equal(E.pendingCharacterRewards(reload).length,5);
 // Replaying earlier levels never locks a previously earned character.
 reload.unlocked=0;reload.stars=[];assert.ok(D.isCharacterUnlocked(D.characters.find(c=>c.id==='pena'),reload));
});
test('Level and charity rules are validated in the engine against tampered UI lists',()=>{
 const save=fresh(),g=new E.Game({progress:save});g.start();g.performance.selectedCharacters=['pedro-v','pandereta','bandurria','guitarra-gafas','laud'];g.performance.allowedCharacters=D.characters.map(c=>c.id);assert.equal(g.begin(),false);assert.equal(g.toggleCharacter('pena'),false);
 g.performance.eventId='evento-benefico';g.performance.event=D.events.find(e=>e.id===g.performance.eventId);g.performance.selectedCharacters=['guitarra','pandereta','bandurria','guitarra-gafas','laud'];assert.equal(g.begin(),false);assert.equal(g.performance.restrictionReasons.guitarra,'Pone una escusa para no actuar');
 for(let level=0;level<D.levels.length;level++){save.unlocked=level;for(let repeat=0;repeat<60;repeat++){const p=D.createPerformance(D.levels[level],'',save);assert.ok(p.allowedCharacters.length>=5);if(p.eventId==='evento-benefico')assert.equal(p.allowedCharacters.includes('guitarra'),false);}}
});
test('Dancer remains in a stable five-person act without a personal instrument',()=>{
 const save=E.readSave(storage({version:2,unlocked:12})),g=new E.Game({progress:save});g.start(2);g.performance.eventId='evento-benefico';g.performance.event=D.events.find(e=>e.id===g.performance.eventId);D.refreshPerformanceAvailability(g.performance,save);
 const ids=['pedro-v','pena','ponder','coki','legia'];ids.forEach(id=>assert.ok(g.toggleCharacter(id)));assert.equal(g.toggleCharacter('andres'),false);assert.ok(g.begin());const act=g.performance;assert.equal(D.characters.find(c=>c.id==='pedro-v').instrument,null);assert.ok(g.items.every(i=>i.type!=='pedro-v'&&i.type!=='bailarin'));
  g.items.forEach(i=>i.collected=true);g.startRhythm();assert.equal(g.duration,60);assert.strictEqual(g.performance,act);assert.deepEqual(act.selectedCharacters,ids);assert.ok(g.notes.some(n=>n.at>57));g.pause();g.resume();g.retry();assert.strictEqual(g.performance,act);assert.deepEqual(act.selectedCharacters,ids);
});
console.log(`${passed} progression suites passed`);

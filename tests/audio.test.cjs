'use strict';
const assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const Music=require('../src/midi.js'),Songs=require('../src/songs.js'),D=require('../src/data.js'),E=require('../src/engine.js');
let passed=0;function test(name,fn){fn();passed++;console.log('PASS',name);}
for(const song of Songs)test('MIDI válido y copia integrada idéntica: '+song.title,()=>{
 const binary=fs.readFileSync(path.join(__dirname,'..',song.file));assert.deepEqual(binary,Buffer.from(song.bytes,'base64'));
 const a=Music.parse(binary);assert.ok(a.format===0||a.format===1);assert.ok(a.tracks>=1);assert.ok(a.melody.length>=60);assert.ok(a.notes.every(n=>Number.isFinite(n.at)&&n.duration>0&&n.pitch>=0&&n.pitch<=127));assert.ok(a.duration>25);
});
test('Parser rechaza recursos incompletos y cabeceras inválidas',()=>{assert.throws(()=>Music.parse(new Uint8Array()));for(const s of Songs){assert.throws(()=>Music.parse(Music.decode(s.bytes).slice(0,35)));}});
test('Las trece canciones MP3 tienen mapas completos, con notas en los segundos finales',()=>{const R=require('../src/recordings.js');assert.equal(R.list().length,13);for(const l of D.levels){const g=new E.Game();g.start(l.id);g.begin();g.startRhythm();const entry=R.get(l.song),chart=R.chart(entry,l.config||l);assert.ok(entry);assert.ok(g.recording);assert.equal(g.duration,60);assert.equal(g.notes.length,chart.notes.length);assert.ok(g.notes.at(-1).at>=58,'Notas hasta el final');assert.equal(new Set(g.notes.map(n=>n.lane)).size,l.laneCount);}});
test('Dificultad progresa y la segunda vuelta densifica patrones',()=>{const N=D.levels.length/2;for(let i=1;i<N;i++){const a=D.levels[i-1],b=D.levels[i];assert.ok(b.laneCount>=a.laneCount&&b.threshold>=a.threshold);}for(let i=0;i<N;i++){const a=D.levels[i],b=D.levels[i+N];assert.equal(b.song,a.song);assert.ok(b.notes>a.notes&&b.laneCount>=a.laneCount&&b.scrollSpeed>a.scrollSpeed&&b.threshold>a.threshold);}});

test('Guardar progreso antiguo conserva desbloqueos y preferencias',()=>{const old={unlocked:4,best:[100,200,300,400,500],stars:[3,2,1,2,3],character:'laud',music:false,volume:.24};const save=E.readSave({getItem:()=>JSON.stringify(old)});assert.equal(save.unlocked,5);assert.deepEqual(save.best.slice(0,5),old.best);assert.deepEqual(save.stars.slice(0,5),old.stars);assert.equal(save.character,'laud');assert.equal(save.music,false);assert.equal(save.volume,.24);assert.equal(save.best.length,26);});
test('Migración de campaña conserva marcas por canción y archiva los niveles que salen',()=>{const old={version:3,unlocked:20,best:Array.from({length:20},(_,i)=>100+i),stars:Array(20).fill(3),character:'bandurria'};const save=E.readSave({getItem:()=>JSON.stringify(old)});assert.equal(save.campaignId,D.campaignId);assert.ok(save.legacyCampaigns['midi-20-v3']);for(let i=0;i<20;i++){const song=D.legacySongIds[i%10],round=i<10?1:2,index=D.levels.findIndex(l=>l.song===song&&l.round===round);if(index>=0){assert.equal(save.stars[index],3);assert.equal(save.best[index],100+i);}}assert.equal(save.stars.length,26);});
let created=0,stopped=0,mediaSources=0;
class Context {
 constructor(){this.state='suspended';this.currentTime=0;this.destination={};}
 async resume(){this.state='running';}
 createGain(){return {gain:{value:0,setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){},setTargetAtTime(){}},connect(){},disconnect(){}};}
 createDynamicsCompressor(){return {threshold:{value:0},knee:{value:0},ratio:{value:0},attack:{value:0},release:{value:0},connect(){},disconnect(){}};}
 createMediaElementSource(){mediaSources++;return {connect(){},disconnect(){}};}
 createOscillator(){created++;return {frequency:{value:0},connect(){},disconnect(){},start(){},stop(){stopped++;}};}
}
(async()=>{
 const Ambient=require('../src/ambient-recordings.js'),scope={AudioContext:Context,TunaMusic:Music,TunaSongs:Songs,TunaAmbientRecordings:Ambient};vm.createContext(scope);vm.runInContext(fs.readFileSync(path.join(__dirname,'../src/audio.js'),'utf8'),scope);
 const settings={music:true,effects:true,volume:.5},bus=new scope.TunaAudio(settings);await bus.unlock();assert.equal(bus.ctx.state,'running');
 bus.available=false;bus.ctx.state='interrupted';await bus.unlock();assert.equal(bus.available,true);assert.equal(bus.ctx.state,'running');passed++;console.log('PASS Un gesto puede recuperar un contexto interrumpido sin crear otro');
 test('Cadena de mezcla única con buses y protección de nivel',()=>{assert.ok(bus.musicGain&&bus.effectsGain&&bus.uiGain);assert.ok(bus.compressor&&bus.limiter);assert.ok(bus.calibratedMaster()>.28&&bus.calibratedMaster()<.85);settings.volume=0;assert.equal(bus.calibratedMaster(),0);settings.volume=.5;});
 test('Rotación cubre diez canciones y evita repetición inmediata en 1000 cambios',()=>{let last=null;for(let i=0;i<100;i++){const cycle=[];for(let j=0;j<10;j++){const id=bus.random();assert.notEqual(id,last);last=id;cycle.push(id);}assert.equal(new Set(cycle).size,10);}});
 test('Menú y recogida usan MP3 aleatorios sin repetir la canción inmediatamente',()=>{bus.ambient('menu');const first=bus.ambientConfig.id;assert.equal(bus.track,null);bus.ambient('explore');assert.notEqual(bus.ambientConfig.id,first);assert.ok(Ambient.tracks.some(t=>t.id===bus.ambientConfig.id));});
 class MediaMock{static instances=[];constructor(){this.dataset={};this.paused=true;this.currentTime=0;this.src='';this.playCalls=0;MediaMock.instances.push(this);}pause(){this.paused=true;}async play(){this.paused=false;this.playCalls++;}}
 scope.Audio=MediaMock;bus.ambient('menu');await new Promise(resolve=>setImmediate(resolve));
 test('El reproductor ambiente transmite un MP3 por un único nodo Web Audio',()=>{assert.equal(MediaMock.instances.length,1);assert.ok(bus.ambientElement instanceof MediaMock);assert.match(bus.ambientElement.src,/\.mp3$/);assert.equal(bus.ambientElement.paused,false);assert.equal(mediaSources,1);});
 const ambientElement=bus.ambientElement,ambientId=bus.ambientConfig.id;ambientElement.currentTime=12.5;bus.stop();bus.resumeAmbient();await new Promise(resolve=>setImmediate(resolve));
 test('Pausa y reanudación conservan la canción y la posición ambiente',()=>{assert.equal(bus.ambientElement,ambientElement);assert.equal(bus.ambientConfig.id,ambientId);assert.equal(ambientElement.currentTime,12.5);assert.equal(ambientElement.paused,false);assert.equal(mediaSources,1);});
 test('La biblioteca ambiental sólo apunta a MP3 existentes de al menos 60 segundos',()=>{assert.equal(Ambient.tracks.length,13);for(const t of Ambient.tracks){const file=path.join(__dirname,'..',t.file);assert.ok(fs.existsSync(file),t.file);assert.equal(path.extname(file).toLowerCase(),'.mp3');}});
 test('La bolsa de MP3 recorre la biblioteca sin repeticiones consecutivas',()=>{let last=null;for(let i=0;i<100;i++){const chosen=bus.randomAmbient();assert.notEqual(chosen.id,last);last=chosen.id;}});
 test('Volver al menú detiene la actuación y prepara otro MP3 ambiente',()=>{bus.select('clavelitos');bus.ambient('menu');assert.ok(bus.ambientConfig?.file.endsWith('.mp3'));assert.equal(bus.ambientWanted,true);});
 test('Todas las canciones generan voces MIDI en Web Audio',()=>{for(const s of Songs){bus.select(s.id,{context:'performance',offset:3});const before=created;for(let t=0;t<3;t+=.05){bus.ctx.currentTime=t;bus.update({phase:'playing',clock:3+t});}assert.ok(created>before);bus.stop();}});
 test('Música y efectos son independientes, con volumen y silencio seguro',()=>{settings.music=false;bus.select(Songs[0].id);let before=created;bus.update({phase:'playing',clock:0});bus.strum();assert.equal(created,before);bus.effect('collect');assert.equal(created,before+3);settings.effects=false;before=created;bus.effect('damage');assert.equal(created,before);bus.volume();assert.ok(stopped>0);});
 test('Pausa para todas las voces y reanuda desde la posición musical correcta',()=>{settings.music=true;bus.select('cielito-lindo',{offset:3});bus.ctx.currentTime=10;bus.update({phase:'playing',clock:5});bus.stop();assert.equal(bus.nodes.size,0);bus.ctx.currentTime=50;bus.update({phase:'playing',clock:5});assert.equal(bus.anchor,48);});
 const noAudio={TunaMusic:Music,TunaSongs:Songs};vm.createContext(noAudio);vm.runInContext(fs.readFileSync(path.join(__dirname,'../src/audio.js'),'utf8'),noAudio);const silent=new noAudio.TunaAudio(settings);await silent.unlock();assert.equal(silent.available,false);silent.ambient('menu');silent.update({phase:'menu'});passed++;console.log('PASS Navegador sin AudioContext sigue funcionando');
 console.log(passed+' comprobaciones de MIDI, audio, rotación, sincronía y migración correctas');
})().catch(e=>{console.error(e);process.exitCode=1;});

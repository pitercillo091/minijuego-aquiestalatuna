// Development-only browser checks; never writes scores to the public rankings.
'use strict';
const {chromium}=require('playwright'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const origin=process.env.GAME_URL||'http://127.0.0.1:8770/',out=path.join(__dirname,'../docs/canero');
const prefix=origin.startsWith('https')?'online':'local';
const key='rondalla-una-ronda-mas-v1';
const seen=['pedro-v','andres','ponder','pena','legia'];
(async()=>{
 fs.mkdirSync(out,{recursive:true});const browser=await chromium.launch({channel:'msedge',headless:true}),report=[];
 const context=await browser.newContext({viewport:{width:1440,height:1000}}),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.route(origin+'__qa_canero__',route=>route.fulfill({contentType:'text/html',body:`<html><body style="margin:0"><iframe style="border:0;width:100%;height:100vh" src="${origin}index.html?v=20261008-canero1#qa"></iframe></body></html>`}));
 await page.goto(origin+'__qa_canero__');const frame=page.frames().find(f=>f.parentFrame());
 await frame.waitForFunction(()=>window.TunaQA&&TunaData.characters.every(c=>TunaQA.art.images[c.id+'-atlas']));
 const result=await frame.evaluate(async()=>{
  const q=TunaQA,D=TunaData,g=q.game,E=TunaEngine,checks=[];
  const check=(label,valid)=>{if(!valid)throw Error(label);checks.push(label);};
  const click=s=>{const el=document.querySelector(s);if(!el)throw Error(s);el.click();};
  const choose=()=>g.performance.allowedCharacters.slice(0,5).forEach(id=>click(`[data-character-pick="${id}"]`));
  check('Twelve canonical atlas files',D.characters.length===12&&D.characters.every(c=>q.art.images[c.id+'-atlas'].naturalWidth===192*(c.animationColumns||4)));
  check('Locked without level 1 victory',document.querySelector('[data-character="canero"]').disabled&&q.save.characterUnlocks.length===0);
  // Twelve drawn with the real renderer, sharing the same two stage planes.
  const canvas=document.createElement('canvas'),a=new TunaArt(canvas);a.images=q.art.images;a.resize();a.background('plaza');a.time=0;
  [280,510].forEach(y=>{a.rect(8,y,944,9,'#ad8063');a.rect(8,y+9,944,12,'#503949');});
  D.characters.forEach((c,i)=>{const x=108+(i%6)*148,y=i<6?280:510;a.character(c.id,x,y,1.3,'idle');a.text(c.name,x,y+29,12);});
  const captures={'doce-juntos':canvas.toDataURL()};
  q.start(0);click('[data-action="choose-group"]');check('Twelve selection cards',document.querySelectorAll('[data-character-pick]').length===12);choose();click('[data-action="begin"]');g.fail('test');q.step(0);check('Defeat does not unlock',!q.save.characterUnlocks.includes('canero'));
  click('[data-action="retry"]');click('[data-action="choose-group"]');click('[data-action="begin"]');
  for(const item of g.items){g.navigate(item.x,item.y,item.id);for(let i=0;g.target!==null&&i<500;i++)q.step(.05);}
  check('Thirty second pickup unchanged',g.config.time===30&&g.items.every(i=>i.collected));g.navigate(g.stage.x,g.stage.y,'stage');for(let i=0;g.target!==null&&i<500;i++)q.step(.05);
  await q.audio.prepareRecording(g.recording);q.audio.recordingClock=()=>g.clock;
  for(const n of g.notes){q.step(.001,{},n.at);document.dispatchEvent(new KeyboardEvent('keydown',{code:D.codes[n.lane],bubbles:true}));document.dispatchEvent(new KeyboardEvent('keyup',{code:D.codes[n.lane],bubbles:true}));}
  q.step(.001,{},60);check('Complete level one awards CAÑERO '+JSON.stringify({stats:g.stats(),save:q.save.characterUnlocks,modal:document.querySelector('#modal-content').textContent}),q.save.characterUnlocks.includes('canero')&&document.querySelector('.unlock-card h2').textContent.includes('CAÑERO'));check('Exact reward copy',document.querySelector('.unlock-card').textContent.includes('¡Una nueva incorporación llega a la Tuna... y viene con la Mahou en la mano!'));
  captures['recompensa']=document.getElementById('game').toDataURL();click('[data-action="reward-continue"]');check('Acknowledgment persisted',q.save.characterRewardsSeen.includes('canero'));
  click('[data-action="continue"]');click('[data-action="choose-group"]');check('Unlocked in level two',!document.querySelector('[data-character-pick="canero"]').disabled&&document.querySelector('[data-character-pick="canero"] small').textContent==='🍺 Acompañante');
  const ids=['canero',...g.performance.allowedCharacters.filter(id=>id!=='canero').slice(0,4)];ids.slice(0,4).forEach(id=>click(`[data-character-pick="${id}"]`));check('Four cannot begin',document.querySelector('[data-action="begin"]').disabled);click(`[data-character-pick="${ids[4]}"]`);const extra=g.performance.allowedCharacters.find(id=>!ids.includes(id));if(extra)click(`[data-character-pick="${extra}"]`);check('Sixth rejected',g.performance.selectedCharacters.length===5);
  click('[data-action="begin"]');g.collectorCharacter='canero';const act=g.performance;
  for(const state of ['idle','walk','playing','victory']){a.background('plaza');a.character('canero',480,455,2.5,state,1,3);captures[state]=canvas.toDataURL();}
  q.step(0);captures['preparacion']=document.getElementById('game').toDataURL();check('No personal instrument',D.characters.find(c=>c.id==='canero').instrument===null&&g.items.every(i=>i.type!=='canero'));
  g.items.forEach(i=>i.collected=true);g.startRhythm();q.step(.001,{},5);captures['actuacion']=document.getElementById('game').toDataURL();for(const n of g.notes){if(n.at<5)continue;q.step(.001,{},n.at);g.hit(n.lane);}q.step(.001,{},60);check('Same group reaches result',g.performance===act&&JSON.stringify(act.selectedCharacters)===JSON.stringify(ids)&&['result','victory'].includes(g.phase));
  check('No duplicate CAÑERO reward',!document.querySelector('.unlock-card h2')?.textContent.includes('CAÑERO'));
  return {checks,captures};
 });
 for(const [name,data] of Object.entries(result.captures))fs.writeFileSync(path.join(out,`${prefix}-${name}.png`),Buffer.from(data.split(',')[1],'base64'));
 report.push({test:'QA real controller and renderer',checks:result.checks,errors});assert.deepEqual(errors,[]);await context.close();
 // Actual responsive interface, legacy save, reward reload and one full real-clock act.
 for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844],['mobile-small',320,740]]){
  const ctx=await browser.newContext({viewport:{width,height},isMobile:name!=='desktop',hasTouch:name!=='desktop'}),p=await ctx.newPage(),errs=[];p.on('pageerror',e=>errs.push(e.message));
  await ctx.addInitScript(({key,seen})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify({version:4,campaignId:'mp3-13-two-rounds-v1',unlocked:1,best:[3210],stars:[3],characterRewardsSeen:seen,characterUnlocks:[],music:true,effects:true,volume:.45}));},{key,seen});
  await p.goto(origin+'?v=20261008-canero1');await p.locator('.unlock-card').waitFor();assert.match(await p.locator('.unlock-card').innerText(),/CAÑERO/);await p.reload();await p.locator('.unlock-card').waitFor();
  await p.screenshot({path:path.join(out,`${prefix}-${name}-recompensa.png`)});await p.locator('[data-action="reward-continue"]').click();await p.reload();assert.equal(await p.locator('.unlock-card').count(),0);
  await p.locator('[data-level="1"]').click();await p.locator('[data-action="choose-group"]').click();assert.equal(await p.locator('[data-character-pick]').count(),12);assert.equal(await p.locator('[data-character-pick="canero"]').isDisabled(),false);
  await p.locator('[data-character-pick="canero"]').click();await p.locator('[data-character-pick="canero"]').click();
  const allowed=await p.locator('[data-character-pick]:not(:disabled)').evaluateAll(els=>els.map(e=>e.dataset.characterPick));const ids=['canero',...allowed.filter(id=>id!=='canero').slice(0,4)];for(const id of ids)await p.locator(`[data-character-pick="${id}"]`).click();if(allowed.length>5)await p.locator(`[data-character-pick="${allowed.find(id=>!ids.includes(id))}"]`).click();assert.equal(await p.locator('.party-card.is-selected').count(),5);
  const layout=await p.evaluate(()=>({cards:document.querySelectorAll('[data-character-pick]').length,body:document.documentElement.scrollWidth>innerWidth,modal:document.getElementById('modal').scrollWidth>document.getElementById('modal').clientWidth,buttonHeight:document.querySelector('[data-action="begin"]').getBoundingClientRect().height}));assert.equal(layout.body,false);assert.equal(layout.modal,false);assert.ok(layout.buttonHeight>=40);
  await p.locator('[data-character-pick="canero"]').scrollIntoViewIfNeeded();await p.screenshot({path:path.join(out,`${prefix}-${name}-seleccion.png`)});
  if(name==='desktop'){
   await p.locator('[data-action="begin"]').click();const targets=await p.locator('[data-target]:not(.stage)').evaluateAll(els=>els.map(e=>e.dataset.target));for(const target of targets){await p.locator(`[data-target="${target}"]`).click();await p.waitForFunction(id=>document.querySelector(`[data-target="${id}"]`).hidden,target,{timeout:11000});}
   await p.locator('[data-target="stage"]').click();await p.waitForFunction(()=>document.getElementById('play-area').dataset.mode==='rhythm',{timeout:11000});await p.screenshot({path:path.join(out,`${prefix}-actuacion-reloj-real.png`)});
   const started=Date.now();let pressed=0;while(Date.now()-started<75000&&!await p.locator('.result-cast').count()&&!await p.locator('.unlock-card').count()){
    const text=await p.locator('#next-note').textContent(),seconds=Number(text.match(/([\d.]+) s/)?.[1]);if(Number.isFinite(seconds)&&seconds<=.12&&seconds>=-.08){await p.locator('#game').focus();await p.keyboard.press('Space');pressed++;}await p.waitForTimeout(40);
   }
   while(await p.locator('[data-action="reward-continue"]').count())await p.locator('[data-action="reward-continue"]').click();
   assert.ok(await p.locator('.result-cast').count(),'Real-clock act did not complete: '+await p.locator('body').innerText());const cast=await p.locator('.result-cast span').allTextContents();assert.ok(cast.includes('CAÑERO'));assert.equal(cast.length,5);await p.screenshot({path:path.join(out,`${prefix}-resultado-real.png`)});report.push({test:name,layout,pressed,elapsedMs:Date.now()-started,cast,errors:errs});
  }else report.push({test:name,layout,errors:errs});assert.deepEqual(errs,[]);await ctx.close();
 }
 fs.writeFileSync(path.join(out,`${prefix}-browser-results.json`),JSON.stringify(report,null,2));console.log(JSON.stringify(report));await browser.close();
})().catch(error=>{console.error(error);process.exit(1);});

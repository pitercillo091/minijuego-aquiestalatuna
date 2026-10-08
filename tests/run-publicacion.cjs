const {chromium}=require('playwright'),fs=require('node:fs'),path=require('node:path');
const root=process.env.GAME_URL||'http://127.0.0.1:8765/',out=path.join(__dirname,'../docs/ampliacion-once');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true}),reports=[];
 for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844],['mobile-small',320,740]]){
  const context=await browser.newContext({viewport:{width,height},isMobile:name!=='desktop',hasTouch:name!=='desktop'}),page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('favicon.ico'))errors.push(`${r.status()} ${r.url()}`);});
  await context.addInitScript(()=>{if(!localStorage.getItem('rondalla-una-ronda-mas-v1'))localStorage.setItem('rondalla-una-ronda-mas-v1',JSON.stringify({version:2,unlocked:12,best:Array(20).fill(5678),stars:Array.from({length:20},(_,i)=>i<12?2:0),music:false,effects:false,volume:.28}));});
  await page.goto(root);await page.locator('[data-action="reward-continue"]').waitFor();
  await page.reload();await page.locator('[data-action="reward-continue"]').waitFor();
  if(!await page.locator('.unlock-card').textContent().then(s=>s.includes('PEDRO V.')))throw Error('Recompensa perdida al recargar');
  const rewards=[];while(await page.locator('[data-action="reward-continue"]').isVisible()){rewards.push(await page.locator('.unlock-card h2').textContent());await page.locator('[data-action="reward-continue"]').click();}
  if(rewards.length!==5)throw Error('Faltan recompensas migradas');await page.reload();if(await page.locator('[data-action="reward-continue"]').count())throw Error('Recompensas repetidas');
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('rondalla-una-ronda-mas-v1')));if(saved.unlocked!==12||saved.best[11]!==5678||saved.volume!==.28||saved.characterUnlocks.length!==5||saved.characterRewardsSeen.length!==5)throw Error('Progreso alterado');
  await page.locator('[data-level="2"]').click();await page.locator('[data-action="choose-group"]').click();
  const cards=await page.locator('[data-character-pick]').count();if(cards!==11)throw Error('No hay once fichas');
  await page.locator('#modal').evaluate(e=>{e.scrollTop=e.scrollHeight;});await page.screenshot({path:path.join(out,`${root.startsWith('https')?'online':'local'}-${name}-seleccion-real.png`)});
  await page.locator('[data-character-pick="pedro-v"]').click();await page.locator('[data-character-pick="pedro-v"]').click();
  for(const id of ['pedro-v','ponder','pena','andres'])await page.locator(`[data-character-pick="${id}"]`).click();if(!await page.locator('[data-action="begin"]').isDisabled())throw Error('Permite grupo de cuatro');await page.locator('[data-character-pick="legia"]').click();await page.locator('[data-character-pick="coki"]').click();if(await page.locator('.party-card.is-selected').count()!==5)throw Error('Permite seis');
  const overflow=await page.evaluate(()=>({body:document.documentElement.scrollWidth>innerWidth,modal:document.getElementById('modal').scrollWidth>document.getElementById('modal').clientWidth}));if(overflow.body||overflow.modal)throw Error('Desbordamiento móvil');
  await page.locator('[data-action="begin"]').click();await page.locator('#pause').click();await page.locator('[data-action="resume"]').waitFor();
  if(name==='desktop'){
   await page.locator('[data-action="resume"]').click();
   for(let i=0;i<4;i++){await page.locator(`[data-target="${i}"]`).click();await page.waitForFunction(id=>document.querySelector(`[data-target="${id}"]`).hidden,i,{timeout:12000});}
   await page.locator('[data-target="stage"]').click();await page.waitForFunction(()=>document.getElementById('play-area').dataset.mode==='rhythm',{timeout:12000});
   await page.screenshot({path:path.join(out,`${root.startsWith('https')?'online':'local'}-actuacion-real.png`)});
   const start=Date.now();let pressed=0;
   while(Date.now()-start<46000&&!await page.locator('.result-cast').count()){
    const text=await page.locator('#next-note').textContent(),seconds=Number(text.match(/([\d.]+) s/)?.[1]);
    if(Number.isFinite(seconds)&&seconds<=.14){await page.locator('#game').focus();await page.keyboard.press('Space');pressed++;}
    await page.waitForTimeout(60);
   }
   if(!await page.locator('.result-cast').count())throw Error('La actuación real no acabó con victoria');
   const cast=await page.locator('.result-cast span').allTextContents();if(cast.join()!=='PEDRO V.,PONDER,PEÑA,Andrés,LEGÍA')throw Error('Grupo distinto en resultado');
   reports.push({name,cards,rewards,overflow,realPerformanceMs:Date.now()-start,pressed,cast,errors});
  }else reports.push({name,cards,rewards,overflow,errors});
  console.log(JSON.stringify(reports.at(-1)));if(errors.length)process.exitCode=1;await context.close();
 }
 fs.writeFileSync(path.join(out,root.startsWith('https')?'online-real-results.json':'local-real-results.json'),JSON.stringify(reports,null,2));await browser.close();
})().catch(e=>{console.error(e);process.exitCode=1;});

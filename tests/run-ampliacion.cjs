const {chromium}=require('playwright'),fs=require('node:fs'),path=require('node:path');
const destination=path.join(__dirname,'../docs/ampliacion-once');
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.TEST_EXECUTABLE?{executablePath:process.env.TEST_EXECUTABLE}:{channel:'msedge'})});
 const origin=process.env.GAME_URL||'http://127.0.0.1:8765/',online=origin.startsWith('https');
 const report=[];
 for(const [name,viewport] of [['desktop',{width:1440,height:1000}],['mobile',{width:390,height:844}]]){
  const context=await browser.newContext({viewport,isMobile:name==='mobile',hasTouch:name==='mobile'}),page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error'&&!m.text().startsWith('Failed to load resource:'))errors.push(m.text());});
  page.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('favicon.ico'))errors.push(`${r.status()} ${r.url()}`);});
  await page.goto(origin+'tests/ampliacion-browser.html?v=20261008-once1');await page.locator('#run').click();await page.waitForFunction(()=>window.testResult,{timeout:180000});
  const result=await page.evaluate(()=>window.testResult);report.push({name,...result,errors});console.log(name,JSON.stringify({passed:result.passed,failed:result.failed,error:result.error,errors}));
  const captures=await page.evaluate(()=>window.captures);for(const [id,data] of Object.entries(captures))fs.writeFileSync(path.join(destination,`${online?'online-':''}${name}-${id}.png`),Buffer.from(data.split(',')[1],'base64'));
  const frame=page.frames().find(f=>f.url().includes('#qa'));
  await frame.evaluate(()=>{TunaQA.game.pause();TunaQA.step(0);document.querySelector('[data-action="home"]').click();document.getElementById('play').click();document.querySelector('[data-action="choose-group"]').click();});
  const layout=await frame.evaluate(()=>{const modal=document.getElementById('modal');return {cards:document.querySelectorAll('[data-character-pick]').length,bodyOverflow:document.documentElement.scrollWidth>innerWidth,modalOverflow:modal.scrollWidth>modal.clientWidth,columns:getComputedStyle(document.querySelector('.party-grid')).gridTemplateColumns,buttonHeight:document.querySelector('[data-action="begin"]').getBoundingClientRect().height};});
  report[report.length-1].layout=layout;console.log('layout',name,layout);await frame.locator('#modal').screenshot({path:path.join(destination,`${online?'online-':''}${name}-seleccion.png`)});
  await context.close();if(result.failed||errors.length||layout.bodyOverflow||layout.modalOverflow)process.exitCode=1;
 }
 fs.writeFileSync(path.join(destination,online?'online-browser-results.json':'browser-results.json'),JSON.stringify(report,null,2));await browser.close();
})().catch(e=>{console.error(e);process.exitCode=1;});

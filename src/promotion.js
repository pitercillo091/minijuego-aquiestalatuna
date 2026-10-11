(function(root){
  'use strict';
  // Verified against the official site's footer / #videos on 2026-10-11.
  const links=Object.freeze({
    whatsapp:'https://wa.me/34622358110',
    website:'https://www.aquiestalatuna.es/',
    instagram:'https://www.instagram.com/rondalladelopera/',
    facebook:'https://www.facebook.com/RondallaDeLopera/',
    videos:'https://www.aquiestalatuna.es/#videos'
  });
  const themes=Object.freeze({
    wedding:{support:'draped',heading:'MÚSICA PARA CELEBRAR',ornament:'floral'},
    serenade:{support:'noticeboard',heading:'DE RONDA EN RONDA',ornament:'lantern'},
    birthday:{support:'party',heading:'QUE SUENE LA FIESTA',ornament:'bunting'},
    retirement:{support:'plaque',heading:'UNA VIDA, MUCHAS CANCIONES',ornament:'laurel'},
    silver:{support:'anniversary',heading:'25 AÑOS DE HISTORIAS',ornament:'25'},
    gold:{support:'anniversary',heading:'50 AÑOS DE HISTORIAS',ornament:'50'},
    charity:{support:'booth',heading:'LA MÚSICA NOS UNE',ornament:'heart'},
    procession:{support:'stone',heading:'LA TUNA TE ACOMPAÑA',ornament:'olive'}
  });
  // Integer-grid artwork: stepped silhouettes, no curves or external logo files.
  function icon(name){
    const pixels=[];const rect=(x,y,w,h,color)=>pixels.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${color}"/>`);
    if(name==='instagram'){
      for(let y=0;y<16;y++){const inset=y===0||y===15?3:y===1||y===14?1:0;rect(inset,y,16-inset*2,1,['#74619d','#945591','#b64c80','#d76677','#e9916d','#edb677'][Math.min(5,Math.floor(y/3))]);}
      for(const [x,y,w,h] of [[5,3,6,1],[3,5,1,6],[12,5,1,6],[5,12,6,1],[4,4,1,1],[11,4,1,1],[4,11,1,1],[11,11,1,1],[7,6,3,1],[6,7,1,3],[10,7,1,3],[7,10,3,1],[10,5,1,1]])rect(x,y,w,h,'#fff3df');
    }else if(name==='facebook'){
      rect(2,0,12,16,'#577eae');rect(0,2,16,12,'#577eae');rect(5,6,7,2,'#fff3df');rect(7,4,3,12,'#fff3df');rect(8,2,5,2,'#fff3df');rect(10,4,3,1,'#fff3df');
    }else{
      rect(2,2,12,12,'#bf455b');rect(0,4,16,8,'#bf455b');rect(1,3,14,10,'#bf455b');
      for(let x=6;x<=10;x++)rect(x,4+x-6,1,8-(x-6)*2,'#fff3df');
    }
    return `<svg class="promo-pixel-icon" viewBox="0 0 16 16" width="32" height="32" aria-hidden="true" focusable="false" shape-rendering="crispEdges">${pixels.join('')}</svg>`;
  }
  let element=null,lastKey='',currentGame=null;
  function mount(){
    element=document.getElementById('scene-promotion');if(!element)return false;
    const social=(id,label,description)=>`<a class="promo-social" data-promo="${id}" href="${links[id]}" target="_blank" rel="noopener noreferrer" aria-label="${description}" title="${description}">${icon(id)}<span>${label}</span></a>`;
    element.innerHTML=`<div class="promo-decoration" aria-hidden="true"><i></i><i></i><i></i></div><div class="promo-props"><div class="promo-main-prop"><div class="promo-awning" aria-hidden="true"></div><div class="promo-main-sign"><div class="promo-sign-brand"><img src="assets/ui/escudo.webp" width="26" height="30" alt=""><span>AQUÍ ESTÁ LA TUNA</span></div><p class="promo-heading"></p><a class="promo-booking" data-promo="whatsapp" href="${links.whatsapp}" target="_blank" rel="noopener noreferrer" aria-label="Contrataciones: 622 358 110. Contactar por WhatsApp">Contrataciones: <strong>622 358 110</strong></a><a class="promo-website" data-promo="website" href="${links.website}" target="_blank" rel="noopener noreferrer">www.aquiestalatuna.es</a></div><div class="promo-legs" aria-hidden="true"></div></div><div class="promo-social-prop"><div class="promo-social-sign"><p>LA RONDA CONTINÚA</p><div class="promo-social-links">${social('instagram','Instagram','Instagram oficial de Aquí Está la Tuna')}${social('facebook','Facebook','Facebook oficial de Aquí Está la Tuna')}${social('videos','Vídeos','Ver vídeos en la web de Aquí Está la Tuna')}</div></div><div class="promo-legs" aria-hidden="true"></div></div></div>`;
    // Preserve the current song before opening an explicitly requested destination.
    // The existing pause button manages the audio clock and resume dialog.
    element.addEventListener('click',event=>{if(event.target.closest('a[data-promo]')&&currentGame?.phase==='playing')document.getElementById('pause')?.click();});
    element.addEventListener('keydown',event=>{if(event.code!=='Escape')event.stopPropagation();});
    return true;
  }
  function sync(game){
    if(!element&&!mount())return;
    currentGame=game;
    const act=game?.performance,visible=Boolean(act&&game.phase!=='menu');if(element.hidden!==!visible)element.hidden=!visible;
    if(!visible)return;
    const scene=themes[act.visual?.sceneId]?act.visual.sceneId:(act.event?.scene||'serenade'),theme=themes[scene]||themes.serenade,key=`${act.id}:${scene}`;
    if(key===lastKey)return;lastKey=key;
    element.dataset.scene=scene;element.dataset.support=theme.support;element.dataset.ornament=theme.ornament;element.dataset.act=act.id;
    element.querySelector('.promo-heading').textContent=theme.heading;
    element.querySelector('.promo-social-sign').dataset.years=['25','50'].includes(theme.ornament)?theme.ornament:'';
  }
  const api={links,themes,icon,sync};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.TunaPromotion=api;
})(globalThis);

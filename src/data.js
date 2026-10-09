(function (root) {
  'use strict';
  const songs=typeof module!=='undefined'&&module.exports?require('./songs.js'):root.TunaSongs;
  const recordings=typeof module!=='undefined'&&module.exports?require('./recordings.js'):root.TunaRecordings;
  const campaignSongs=recordings.list();
  const songCatalog=[...songs,...campaignSongs.filter(recording=>!songs.some(song=>song.id===recording.songId)).map(recording=>({id:recording.songId,title:recording.title,bpm:recording.bpmApproximate}))];
  const characters = [
    {id:'pandereta',name:'Miguel A.',role:'La capa también lleva el ritmo.',instrument:'pandereta',reference:'reparto.webp',referencePath:'assets/referencias/reparto.webp',detail:'Primero por la izquierda: gafas, barba poblada castaña y gris, cabello ondulado, complexión ancha y capa con cintas.'},
    {id:'guitarra',name:'Pacheco´s',role:'Que nadie olvide el estuche.',instrument:'guitarra',reference:'reparto.webp',referencePath:'assets/referencias/reparto.webp',detail:'Segundo: cabeza despejada, cabello en las sienes, cara sin barba, beca roja y guitarra grande de madera.'},
    {id:'bandurria',name:'C15',role:'Una púa y toda la plaza.',instrument:'bandurria',reference:'reparto.webp',referencePath:'assets/referencias/reparto.webp',detail:'Tercero: cabello corto oscuro con canas, bigote y barba corta, rostro alargado, beca roja y bandurria dorada.'},
    {id:'guitarra-gafas',name:'Piter',role:'El compás se ve venir.',instrument:'guitarra',reference:'reparto.webp',referencePath:'assets/referencias/reparto.webp',detail:'Cuarto: gafas rectangulares, cabello corto gris oscuro, sin barba, guitarra clara y beca roja colgando al costado.'},
    {id:'laud',name:'Pesetas',role:'La última nunca es la última.',instrument:'laud',reference:'reparto.webp',referencePath:'assets/referencias/reparto.webp',detail:'Quinto: cabello castaño corto, sonrisa, barba muy corta, beca roja y pequeño instrumento de cuerda. La identificación del instrumento es una interpretación visual.'},
    {id:'andres',name:'Andrés',role:'La pandereta marca el camino.',instrument:'pandereta',unlockLevel:5,unlockMessage:'¡Una nueva pandereta se une a la Tuna!',reference:'andres.png',referencePath:'assets/personajes/referencias/andres.png',detail:'Sexto: cabello corto oscuro, barba poblada, rostro ancho y traje negro; toca la pandereta.'},
    {id:'coki',name:'Coki',role:'Pandereta con gafas de sol.',instrument:'pandereta',reference:'coki.png',referencePath:'assets/personajes/referencias/coki.png',detail:'Séptimo: pelo corto, gafas de sol, sonrisa, beca roja y pandereta.'},
    {id:'legia',name:'LEGÍA',role:'La guitarra está lista para la ronda.',instrument:'guitarra',unlockLevel:10,unlockMessage:'¡Una nueva guitarra se une a la Tuna!',reference:'legia.png',referencePath:'assets/personajes/referencias/legia.png',detail:'Octavo: pelo corto oscuro con entradas, rostro ancho, barba muy corta, beca roja y capa negra con forro rojo. Toca la guitarra, confirmado por el usuario.'},
    {id:'pedro-v',name:'PEDRO V.',role:'El baile también lleva el compás.',kind:'dancer',instrument:null,unlockLevel:3,unlockMessage:'¡Un nuevo bailarín se une a la Tuna!',animationColumns:8,assetVersion:'20261008-once1',reference:'pedro-v.png',referencePath:'assets/personajes/referencias/pedro-v.png',detail:'Cabello oscuro peinado hacia atrás, rostro sin barba, hombros anchos, cuello negro y beca roja. Bailarín sin instrumento.'},
    {id:'ponder',name:'PONDER',role:'Una bandurria y una sonrisa.',instrument:'bandurria',unlockLevel:6,unlockMessage:'¡Una nueva bandurria se une a la Tuna!',assetVersion:'20261008-once1',reference:'ponder.png',referencePath:'assets/personajes/referencias/ponder.png',detail:'Cabello corto rizado con entradas, rostro redondeado, sonrisa amplia y barba corta con canas. Bandurria.'},
    {id:'pena',name:'PEÑA',role:'La púa está lista para otra ronda.',instrument:'bandurria',unlockLevel:8,unlockMessage:'¡Otro bandurrista se incorpora a la Tuna!',assetVersion:'20261008-once1',reference:'pena.png',referencePath:'assets/personajes/referencias/pena.png',detail:'Frente despejada, cabello corto, cejas marcadas, bigote y perilla, rostro alargado, cuello blanco y beca roja. Bandurria.'},
    {id:'canero',name:'CAÑERO',role:'Acompaña la ronda con la Mahou en la mano.',kind:'companion',instrument:null,unlockLevel:2,unlockMessage:'¡Una nueva incorporación llega a la Tuna... y viene con la Mahou en la mano!',animationColumns:8,assetVersion:'20261008-canero1',reference:'canero.jpg',referencePath:'assets/personajes/referencias/canero.jpg',detail:'Pelo castaño corto peinado hacia un lado, rostro ancho sin barba, sonrisa, beca roja y traje negro. Acompañante de pie con una cerveza Mahou; no toca instrumentos.'}
  ];
  // Catalogue for the touring layer. New places and events can be added here
  // without changing the level engine or the screen templates.
  const locations = [
    {id:'andujar',name:'Andújar',description:'Una plaza con ganas de escuchar una ronda completa.',scene:'plaza'},
    {id:'porcuna',name:'Porcuna',description:'Calles blancas, balcones atentos y una noche por delante.',scene:'street',restrictions:{forbiddenCharacters:['canero']}},
    {id:'puente-genil',name:'Puente Genil',description:'El público ya está reunido cuando llega la Tuna.',scene:'festival',restrictions:{forbiddenCharacters:['guitarra-gafas','guitarra','ponder']}},
    {id:'jaen',name:'Jaén',description:'La ciudad de los olivares también tiene oído para las cuerdas.',scene:'university'},
    {id:'villa-del-rio',name:'Villa del Río',description:'Una celebración familiar donde nadie quiere quedarse sentado.',scene:'garden'},
    {id:'montoro',name:'Montoro',description:'La noche baja hacia el río y pide una serenata.',scene:'castle'},
    {id:'baena',name:'Baena',description:'Una nueva parada de la gira, con las cuerdas a punto.',scene:'plaza',restrictions:{forbiddenCharacters:['ponder']}},
    {id:'el-carpio',name:'El Carpio',description:'Otra celebración y un público que espera la primera canción.',scene:'street'},
    {id:'canete',name:'Cañete',description:'La Tuna llega con capas, estuches y ganas de ronda.',scene:'garden'},
    {id:'migueltanze',name:'Migueltanze',description:'Una nueva localidad en el cuaderno de encargos.',scene:'plaza'},
    {id:'puertollano',name:'Puertollano',description:'La siguiente actuación ya tiene público esperando.',scene:'festival',restrictions:{forbiddenCharacters:['guitarra-gafas','guitarra','ponder']}},
    {id:'ciudad-real',name:'Ciudad Real',description:'La gira continúa con otra noche de canciones.',scene:'university',restrictions:{forbiddenCharacters:['guitarra-gafas','guitarra','ponder']}}
  ];
  const events = [
    {id:'boda',name:'Boda',icon:'💍',description:'Música para uno de los días más importantes de sus vidas.',narrative:'Nos han contratado para poner música a uno de los días más importantes de sus vidas. Afinad bien: hoy hasta los novios llevan el compás.'},
    {id:'serenata',name:'Serenata',icon:'🌙',description:'Una ronda nocturna para conquistar al público desde el primer acorde.',narrative:'Esta noche toca sacar las capas y demostrar que todavía sabemos conquistar con una canción. El balcón espera y el silencio también.'},
    {id:'cumpleanos',name:'Cumpleaños',icon:'🎂',description:'Tarta, invitados y una Tuna dispuesta a montar el espectáculo.',narrative:'Hay tarta, invitados y una Tuna dispuesta a montar el espectáculo. Procurad que el cumpleaños recuerde la canción y no los fallos.'},
    {id:'jubilacion',name:'Jubilación',icon:'🎉',description:'Una despedida con más alegría que prisa y muchas historias que celebrar.',narrative:'Nos piden una despedida a la altura de toda una vida de trabajo. Traed alegría, capas y una canción que dure más que el discurso.'},
    {id:'bodas-plata',name:'Bodas de plata',icon:'🥈',description:'Veinticinco años juntos merecen una ronda con brillo propio.',narrative:'Veinticinco años juntos merecen una ronda con brillo propio. Hoy tocamos para una pareja que ya conoce todos los estribillos.'},
    {id:'bodas-oro',name:'Bodas de oro',icon:'🏆',description:'Medio siglo de historias y una Tuna lista para celebrarlo.',narrative:'Cincuenta años de historias no se celebran en silencio. Nos toca levantar el ánimo, cuidar cada nota y hacer que la plaza pida otra.'},
    {id:'evento-benefico',name:'Evento benéfico',icon:'❤️',description:'Una ronda solidaria para echar una mano con música y buen humor.',narrative:'Hoy tocamos por una buena causa. Afinad, sonreíd y que cada nota ayude a llenar la hucha.',restrictions:{forbiddenCharacters:['guitarra'],reasons:{guitarra:'Pone una escusa para no actuar'}}},
    {id:'procesion',name:'Procesión',icon:'🕯️',description:'La Tuna canta ante el paso de la Virgen, entre flores y cirios.',narrative:'El paso de la Virgen se detiene y la Tuna prepara sus cuerdas. Entre flores y cirios, acompañamos la procesión con una canción. Hoy toca cantar juntos y cuidar cada compás.',preparation:'Antes de salir hacia {localidad}, reunid los instrumentos: la procesión nos espera.',ready:'Todo preparado. En {localidad}, el paso de la Virgen espera nuestra canción.',closing:'La canción termina ante el paso de la Virgen en {localidad}. Gracias por acompañar la procesión con la Tuna.'}
  ];
  // Stable scene IDs belong to the event catalogue, not to individual screens.
  const eventScenes={'boda':'wedding','serenata':'serenade','cumpleanos':'birthday','jubilacion':'retirement','bodas-plata':'silver','bodas-oro':'gold','evento-benefico':'charity','procesion':'procession'};
  events.forEach(event=>{event.scene=eventScenes[event.id];});
  // Location variants are opt-in and must cite a verified photo/news reference.
  // These slots intentionally use the shared scene until real assets are supplied.
  const religiousScenes={
    default:{id:'marian-procession',sceneId:'procession',references:['virgen-gracia-arjona-2026','virgen-cabeza-marmolejo-2026']},
    byLocation:{andujar:null,porcuna:null,montoro:null}
  };
  function performanceVisual(location,event) {
    const variant=event.id==='procesion'?(religiousScenes.byLocation[location.id]||religiousScenes.default):null;
    return {sceneId:variant?.sceneId||event.scene,locationId:location.id,...(variant?{variantId:variant.id}:{} )};
  }
  let lastPerformanceKey=null;
  function completedLevel(progress={}) {
    return Math.max(Math.max(0,Math.min(levels.length-1,Number.isInteger(progress.unlocked)?progress.unlocked:0)),...(Array.isArray(progress.stars)?progress.stars.slice(0,levels.length).map((stars,i)=>stars>0?i+1:0):[0]));
  }
  function isCharacterUnlocked(character,progress={}) {
    return !character.unlockLevel||completedLevel(progress)>=character.unlockLevel-1||(Array.isArray(progress.characterUnlocks)&&progress.characterUnlocks.includes(character.id));
  }
  function characterAsset(character,atlas=false) {
    const version=character.assetVersion||(['andres','coki'].includes(character.id)?'20261008-art1':'6');
    return `assets/personajes/${character.id}${atlas?'-atlas.png':'.svg'}?v=${version}`;
  }
  // Rules are resolved from catalogues, never from the UI's editable availability list.
  function selectionRules(performance) {
    const location=locations.find(l=>l.id===performance.locationId);
    const sources=[location,events.find(e=>e.id===performance.eventId),songCatalog.find(s=>s.id===performance.song),levels.find(l=>l.id===performance.levelId)].map(item=>item?.restrictions||{});
    const list=key=>[...new Set(sources.flatMap(source=>source[key]||[]))];
    const localReasons=Object.fromEntries((location?.restrictions?.forbiddenCharacters||[]).map(id=>[id,`No disponible en ${location.name}`]));
    return {forbiddenCharacters:list('forbiddenCharacters'),requiredCharacters:list('requiredCharacters'),recommendedCharacters:list('recommendedCharacters'),incompatibleCharacters:sources.flatMap(source=>source.incompatibleCharacters||[]),reasons:Object.assign(localReasons,...sources.map(source=>source.reasons||{}))};
  }
  function characterAvailability(character,performance,progress={}) {
    const rules=selectionRules(performance);
    if(rules.forbiddenCharacters.includes(character.id))return {available:false,reason:rules.reasons[character.id]||'No disponible para esta actuación'};
    if(!isCharacterUnlocked(character,progress))return {available:false,reason:`🔒 Disponible en nivel ${character.unlockLevel}`};
    return {available:true,reason:''};
  }
  function refreshPerformanceAvailability(performance,progress={}) {
    const rules=selectionRules(performance);performance.allowedCharacters=[];performance.unavailableCharacters=[];performance.restrictionReasons={};
    for(const character of characters){const status=characterAvailability(character,performance,progress);if(status.available)performance.allowedCharacters.push(character.id);else{performance.unavailableCharacters.push(character.id);performance.restrictionReasons[character.id]=status.reason;}}
    // Discard stale or injected selections without making any new selections.
    performance.selectedCharacters=[...new Set(Array.isArray(performance.selectedCharacters)?performance.selectedCharacters:[])].filter(id=>performance.allowedCharacters.includes(id)).slice(0,5);
    performance.requiredCharacters=rules.requiredCharacters;performance.recommendedCharacters=rules.recommendedCharacters;return performance;
  }
  function canFormGroup(performance,progress={}) {
    const allowed=characters.filter(c=>characterAvailability(c,performance,progress).available).map(c=>c.id),rules=selectionRules(performance);
    if(allowed.length<5||rules.requiredCharacters.length>5||rules.requiredCharacters.some(id=>!allowed.includes(id)))return false;
    const chosen=[...rules.requiredCharacters],pool=allowed.filter(id=>!chosen.includes(id));
    const compatible=ids=>!rules.incompatibleCharacters.some(pair=>pair.every(id=>ids.includes(id)));
    const search=start=>{if(!compatible(chosen))return false;if(chosen.length===5)return true;if(chosen.length+pool.length-start<5)return false;for(let i=start;i<pool.length;i++){chosen.push(pool[i]);if(search(i+1))return true;chosen.pop();}return false;};
    return search(0);
  }
  function createPerformance(level,previousKey='',progress={}) {
    const previous=previousKey||lastPerformanceKey;
    const pairs=[];for(const location of locations)for(const event of events){const candidate={locationId:location.id,eventId:event.id,song:level.song,levelId:level.id};if(canFormGroup(candidate,progress))pairs.push({location,event});}
    if(!pairs.length)throw new Error('No hay un encargo con cinco componentes disponibles.');
    const available=pairs.filter(pair=>`${pair.location.id}:${pair.event.id}`!==previous);
    const pair=(available.length?available:pairs)[Math.floor(Math.random()*(available.length?available.length:pairs.length))];
    const key=`${pair.location.id}:${pair.event.id}`;lastPerformanceKey=key;
    const narrative=(template,fallback)=>template?template.replaceAll('{localidad}',pair.location.name):fallback;
    return refreshPerformanceAvailability({id:`${level.id}-${key}`,key,levelId:level.id,song:level.song,locationId:pair.location.id,eventId:pair.event.id,location:pair.location,event:pair.event,visual:performanceVisual(pair.location,pair.event),difficulty:{round:level.round,notes:level.notes,laneCount:level.laneCount,threshold:level.threshold},selectedCharacters:[],prepText:narrative(pair.event.preparation,`Antes de salir hacia ${pair.location.name} tenemos que reunir todo el equipo.`),readyText:narrative(pair.event.ready,`Todo preparado. ${pair.location.name} nos espera: es hora de demostrar lo que sabe hacer la Tuna.`),closingText:narrative(pair.event.closing,`El público de ${pair.location.name} ha quedado encantado y, milagrosamente, nadie nos ha pedido que dejemos de tocar.`)},progress);
  }
  const settings=[
    ['Lopera · El ensayo','rehearsal','ensayo',105,0,['guitarra','bandurria','pandereta'],'Recoge los tres instrumentos y prepara Clavelitos.','Hay quien trae la voz. Tú trae también los instrumentos.','La primera ya suena. El ensayo empieza a parecer una actuación.'],
    ['Marmolejo · La primera ronda','street','marmolejo',105,1,['bandurria','guitarra','pandereta'],'Reúne a los compañeros antes de la serenata.','La hora de quedar y la hora de llegar se parecen poco.','Todos presentes. Nadie ha tocado desde el aparcamiento.'],
    ['Baños de la Encina · Serenata','castle','banos',100,1,['flor','flor','flor','flor'],'Recoge cuatro flores para abrir el balcón.','Las flores abren el balcón. El ritmo hace que se queden.','Se ha abierto el balcón. No era para pedir silencio.'],
    ['Arjona · La verbena','plaza','arjona',100,2,['partitura','partitura','partitura','partitura'],'Encuentra las partituras antes de la verbena.','Reyes en el escenario. Puntuales todavía estamos aprendiendo.','La plaza canta con vosotros. Hasta el que decía que solo venía a mirar.'],
    ['Lopera · Noche universitaria','university','grupo',95,2,['bandurria','guitarra','guitarra-gafas','laud'],'Reúne las cuerdas para la estudiantina.','El balcón no se abre con un mensaje: hay que afinar.','Hasta los balcones han marcado el compás.'],
    ['Marmolejo · Las cintas','festival','marmolejo',95,2,['flor','partitura','pandereta','guitarra'],'Recoge flores, partitura e instrumentos.','La capa lleva muchas cintas. Ninguna sustituye a las cuerdas.','Capa al viento, cuerdas afinadas y otra plaza ganada.'],
    ['Baños de la Encina · La isa','garden','banos',90,3,['bandurria','laud','guitarra','guitarra-gafas'],'Reúne los instrumentos de púa y las guitarras.','El viaje a Canarias lo ponemos en la música.','La isa ha puesto a bailar hasta al que guardaba los estuches.'],
    ['Arjona · Noche de copla','plaza','arjona',90,3,['flor','flor','partitura','guitarra-gafas'],'Prepara las flores y la guitarra para la copla.','La copla pide sentimiento. El jurado pide que no corramos.','La copla se ha quedado en la plaza. Vosotros vais a por otra.'],
    ['Lopera · El certamen','castle','caras',85,3,['partitura','bandurria','guitarra','laud','pandereta'],'Encuentra la partitura y reúne al equipo.','El jurado toma notas. Procura que las tuyas lleguen a tiempo.','El jurado también pide otra, aunque no lo diga.'],
    ['Lopera · La gran actuación','finale','grupo',85,4,['pandereta','guitarra','bandurria','guitarra-gafas','laud'],'Reúne a los cinco músicos para el gran final.','Última canción. Lo de irnos después lo hablamos después.','Veinte etapas. Cinco músicos. Y el público sigue pidiendo otra.']
  ];
  const settingBySong=new Map(songs.map((song,i)=>[song.id,settings[i]]));
  const firstRound=campaignSongs.map((recording,i)=>{
    const s={id:recording.songId,title:recording.title,bpm:recording.bpmApproximate};
    const [place,theme,photo,_time,hazards,items,goal,intro,after]=settingBySong.get(s.id)||settings[i%settings.length];
    const chart=recording.charts.normal,laneCount=chart.laneCount;
    return {id:i,round:1,song:s.id,title:s.title,short:s.title,place,theme,photo,time:30,hazards,items,goal,intro,after,bpm:s.bpm,notes:chart.notes.length,laneCount,minGap:1.35,scrollSpeed:140+i*5,threshold:.5+Math.floor(i/3)*.025};
  });
  const secondRound=firstRound.map((level,i)=>{
    const recording=recordings.get(level.song),chart=recording.charts.hard;
    return {...level,id:i+campaignSongs.length,round:2,title:`${level.title} · Segunda ronda`,short:`${level.short} · Ronda 2`,notes:chart.notes.length,laneCount:chart.laneCount,minGap:.2,scrollSpeed:level.scrollSpeed+20,threshold:Math.min(.9,level.threshold+.045)};
  });
  const levels=[...firstRound,...secondRound];
  const data={characters,locations,events,religiousScenes,performanceVisual,createPerformance,canFormGroup,levels,completedLevel,isCharacterUnlocked,characterAsset,selectionRules,characterAvailability,refreshPerformanceAvailability,legacySongIds:songs.map(song=>song.id),campaignId:'mp3-13-two-rounds-v1',lanes:['←','↓','↑','→','J','K'],keys:['A','S','W','D','J','K'],codes:['KeyA','KeyS','KeyW','KeyD','KeyJ','KeyK'],laneColors:['#ffc471','#ff89a5','#72dfd0','#b8abff','#86ceff','#f2d66d'],version:7};
  if(typeof module!=='undefined'&&module.exports)module.exports=data;else root.TunaData=data;
})(globalThis);

(function (root) {
  'use strict';
  const songs=typeof module!=='undefined'&&module.exports?require('./songs.js'):root.TunaSongs;
  const characters = [
    {id:'pandereta',name:'Miguel A.',role:'La capa también lleva el ritmo.',instrument:'pandereta',reference:'reparto.webp',detail:'Primero por la izquierda: gafas, barba poblada castaña y gris, cabello ondulado, complexión ancha y capa con cintas.'},
    {id:'guitarra',name:'Pacheco´s',role:'Que nadie olvide el estuche.',instrument:'guitarra',reference:'reparto.webp',detail:'Segundo: cabeza despejada, cabello en las sienes, cara sin barba, beca roja y guitarra grande de madera.'},
    {id:'bandurria',name:'C15',role:'Una púa y toda la plaza.',instrument:'bandurria',reference:'reparto.webp',detail:'Tercero: cabello corto oscuro con canas, bigote y barba corta, rostro alargado, beca roja y bandurria dorada.'},
    {id:'guitarra-gafas',name:'Piter',role:'El compás se ve venir.',instrument:'guitarra',reference:'reparto.webp',detail:'Cuarto: gafas rectangulares, cabello corto gris oscuro, sin barba, guitarra clara y beca roja colgando al costado.'},
    {id:'laud',name:'Pesetas',role:'La última nunca es la última.',instrument:'laud',reference:'reparto.webp',detail:'Quinto: cabello castaño corto, sonrisa, barba muy corta, beca roja y pequeño instrumento de cuerda. La identificación del instrumento es una interpretación visual.'}
  ];
  // Catalogue for the touring layer. New places and events can be added here
  // without changing the level engine or the screen templates.
  const locations = [
    {id:'andujar',name:'Andújar',description:'Una plaza con ganas de escuchar una ronda completa.',scene:'plaza'},
    {id:'porcuna',name:'Porcuna',description:'Calles blancas, balcones atentos y una noche por delante.',scene:'street'},
    {id:'puente-genil',name:'Puente Genil',description:'El público ya está reunido cuando llega la Tuna.',scene:'festival'},
    {id:'jaen',name:'Jaén',description:'La ciudad de los olivares también tiene oído para las cuerdas.',scene:'university'},
    {id:'villa-del-rio',name:'Villa del Río',description:'Una celebración familiar donde nadie quiere quedarse sentado.',scene:'garden'},
    {id:'montoro',name:'Montoro',description:'La noche baja hacia el río y pide una serenata.',scene:'castle'}
  ];
  const events = [
    {id:'boda',name:'Boda',icon:'💍',description:'Música para uno de los días más importantes de sus vidas.',narrative:'Nos han contratado para poner música a uno de los días más importantes de sus vidas. Afinad bien: hoy hasta los novios llevan el compás.'},
    {id:'serenata',name:'Serenata',icon:'🌙',description:'Una ronda nocturna para conquistar al público desde el primer acorde.',narrative:'Esta noche toca sacar las capas y demostrar que todavía sabemos conquistar con una canción. El balcón espera y el silencio también.'},
    {id:'cumpleanos',name:'Cumpleaños',icon:'🎂',description:'Tarta, invitados y una Tuna dispuesta a montar el espectáculo.',narrative:'Hay tarta, invitados y una Tuna dispuesta a montar el espectáculo. Procurad que el cumpleaños recuerde la canción y no los fallos.'},
    {id:'jubilacion',name:'Jubilación',icon:'🎉',description:'Una despedida con más alegría que prisa y muchas historias que celebrar.',narrative:'Nos piden una despedida a la altura de toda una vida de trabajo. Traed alegría, capas y una canción que dure más que el discurso.'},
    {id:'bodas-plata',name:'Bodas de plata',icon:'🥈',description:'Veinticinco años juntos merecen una ronda con brillo propio.',narrative:'Veinticinco años juntos merecen una ronda con brillo propio. Hoy tocamos para una pareja que ya conoce todos los estribillos.'},
    {id:'bodas-oro',name:'Bodas de oro',icon:'🏆',description:'Medio siglo de historias y una Tuna lista para celebrarlo.',narrative:'Cincuenta años de historias no se celebran en silencio. Nos toca levantar el ánimo, cuidar cada nota y hacer que la plaza pida otra.'}
  ];
  let lastPerformanceKey=null;
  function createPerformance(level,previousKey='') {
    const previous=previousKey||lastPerformanceKey;
    const pairs=[];for(const location of locations)for(const event of events)pairs.push({location,event});
    const available=pairs.filter(pair=>`${pair.location.id}:${pair.event.id}`!==previous);
    const pair=(available.length?available:pairs)[Math.floor(Math.random()*(available.length?available.length:pairs.length))];
    const key=`${pair.location.id}:${pair.event.id}`;lastPerformanceKey=key;
    return {id:`${level.id}-${key}`,key,levelId:level.id,song:level.song,locationId:pair.location.id,eventId:pair.event.id,location:pair.location,event:pair.event,difficulty:{round:level.round,notes:level.notes,laneCount:level.laneCount,threshold:level.threshold},allowedCharacters:[],recommendedCharacters:[],requiredCharacters:[],unavailableCharacters:[],prepText:`Antes de salir hacia ${pair.location.name} tenemos que reunir todo el equipo.`,readyText:`Todo preparado. ${pair.location.name} nos espera: es hora de demostrar lo que sabe hacer la Tuna.`,closingText:`El público de ${pair.location.name} ha quedado encantado y, milagrosamente, nadie nos ha pedido que dejemos de tocar.`};
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
  const counts=[2,2,3,3,4,4,5,5,6,6],targets=[18,24,30,36,42,47,54,60,66,71],gaps=[.76,.708,.656,.42,.552,.5,.448,.2,.23,.39];
  const firstRound=songs.map((s,i)=>{const [place,theme,photo,_time,hazards,items,goal,intro,after]=settings[i];const time=30;return {id:i,round:1,song:s.id,title:s.title,short:s.title,place,theme,photo,time,hazards,items,goal,intro,after,bpm:s.bpm,notes:targets[i],laneCount:counts[i],minGap:gaps[i],scrollSpeed:140+i*7,threshold:.5+Math.floor(i/2)*.025};});
  const secondTargets=[42,48,54,48,66,71,78,78,90,96];
  const secondRound=firstRound.map((level,i)=>({...level,id:i+10,round:2,title:`${level.title} · Segunda ronda`,short:`${level.short} · Ronda 2`,notes:secondTargets[i],laneCount:Math.min(6,level.laneCount+1),minGap:.2,scrollSpeed:level.scrollSpeed+24,threshold:Math.min(.9,level.threshold+.045)}));
  const levels=[...firstRound,...secondRound];
  const data={characters,locations,events,createPerformance,levels,lanes:['←','↓','↑','→','J','K'],keys:['A','S','W','D','J','K'],codes:['KeyA','KeyS','KeyW','KeyD','KeyJ','KeyK'],laneColors:['#ffc471','#ff89a5','#72dfd0','#b8abff','#86ceff','#f2d66d'],version:4};
  if(typeof module!=='undefined'&&module.exports)module.exports=data;else root.TunaData=data;
})(globalThis);

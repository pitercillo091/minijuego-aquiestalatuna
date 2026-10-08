(function(root){
  'use strict';
  const source={
    clavelitos:typeof module!=='undefined'&&module.exports?require('./charts/clavelitos.js'):root.TunaClavelitosChart,
    'cielito-lindo':typeof module!=='undefined'&&module.exports?require('./charts/cielito-lindo.js'):root.TunaChart_cielito_lindo,
    'estudiantina-madrilena':typeof module!=='undefined'&&module.exports?require('./charts/estudiantina-madrilena.js'):root.TunaChart_estudiantina_madrilena,
    'cintas-capa':typeof module!=='undefined'&&module.exports?require('./charts/cintas-capa.js'):root.TunaChart_cintas_capa,
    'isa-canaria':typeof module!=='undefined'&&module.exports?require('./charts/isa-canaria.js'):root.TunaChart_isa_canaria,
    'morena-copla':typeof module!=='undefined'&&module.exports?require('./charts/morena-copla.js'):root.TunaChart_morena_copla,
    'maria-portuguesa':typeof module!=='undefined'&&module.exports?require('./charts/maria-portuguesa.js'):root.TunaChart_maria_portuguesa,
    'soy-cordobes':typeof module!=='undefined'&&module.exports?require('./charts/soy-cordobes.js'):root.TunaChart_soy_cordobes,
    guantanamera:typeof module!=='undefined'&&module.exports?require('./charts/guantanamera.js'):root.TunaChart_guantanamera,
    'viva-espana':typeof module!=='undefined'&&module.exports?require('./charts/viva-espana.js'):root.TunaChart_viva_espana,
    'isa-de-ronda':typeof module!=='undefined'&&module.exports?require('./charts/isa-de-ronda.js'):root.TunaChart_isa_de_ronda,
    'san-cayetano':typeof module!=='undefined'&&module.exports?require('./charts/san-cayetano.js'):root.TunaChart_san_cayetano,
    'todos-los-besos':typeof module!=='undefined'&&module.exports?require('./charts/todos-los-besos.js'):root.TunaChart_todos_los_besos
  };
  const registry=Object.fromEntries(Object.entries(source).filter(([,chart])=>chart&&chart.format==='mp3').map(([id,chart])=>[id,{enabled:true,...chart}]));
  function get(songId){const entry=registry[songId];return entry?.enabled?entry:null;}
  function chart(recording,level){return recording.charts[level.round===2?'hard':'normal'];}
  function list(){return Object.values(registry).filter(recording=>recording.enabled);}
  const api={registry,get,chart,list};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.TunaRecordings=api;
})(globalThis);

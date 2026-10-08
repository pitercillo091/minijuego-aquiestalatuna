(function(root){
  'use strict';
  const clavelitos=typeof module!=='undefined'&&module.exports?require('./charts/clavelitos.js'):root.TunaClavelitosChart;
  // Set enabled=false to restore Clavelitos MIDI without deleting any resource.
  const registry={clavelitos:{enabled:true,...clavelitos}};
  function get(songId){const entry=registry[songId];return entry?.enabled?entry:null;}
  function chart(recording,level){return recording.charts[level.round===2||level.id>=10?'hard':'normal'];}
  const api={registry,get,chart};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.TunaRecordings=api;
})(globalThis);

(function(root){
  'use strict';
  const recordings=typeof module!=='undefined'&&module.exports?require('./recordings.js'):root.TunaRecordings;
  const tracks=recordings.list().map(recording=>({
    id:recording.songId,
    title:recording.title,
    performer:recording.performer,
    file:recording.audioFile
  }));
  const api={tracks};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.TunaAmbientRecordings=api;
})(globalThis);

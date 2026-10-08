const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {spawnSync}=require('node:child_process');
const D=require('../src/data.js');
const R=require('../src/recordings.js');

const tracks=R.list();
assert.equal(tracks.length,13,'Expected thirteen available MP3 recordings');
assert.equal(D.levels.length,26,'The campaign must contain two rounds per recording');
for(const [index,track] of tracks.entries()){
  const file=path.join(__dirname,'..',track.audioFile);
  assert.ok(fs.existsSync(file),`${track.songId}: MP3 exists`);
  const probe=spawnSync('ffprobe',['-v','error','-show_entries','stream=codec_name','-show_entries','format=duration','-of','json',file],{encoding:'utf8'});
  assert.equal(probe.status,0,`${track.songId}: ffprobe decodes the file`);
  const media=JSON.parse(probe.stdout);
  assert.ok(media.streams.some(stream=>stream.codec_name==='mp3'),`${track.songId}: actual MP3 codec`);
  assert.ok(Number(media.format.duration)>=track.sourceOffset+60,`${track.songId}: enough source audio for 60 seconds`);
  for(const mode of ['normal','hard']){
    const chart=track.charts[mode];
    assert.ok(chart.notes.length>0,`${track.songId}/${mode}: notes exist`);
    assert.ok(chart.notes[0].at>=0&&chart.notes.at(-1).at<60,`${track.songId}/${mode}: note times stay inside the 60 second level`);
    for(let t=0;t<60;t+=5)assert.ok(chart.notes.some(note=>note.at>=t&&note.at<t+5),`${track.songId}/${mode}: notes cover ${t}-${t+5}s`);
  }
  assert.ok(track.charts.hard.notes.length>track.charts.normal.notes.length,`${track.songId}: hard map is denser`);
  assert.equal(D.levels[index].song,track.songId,`${track.songId}: normal level order`);
  assert.equal(D.levels[index+tracks.length].song,track.songId,`${track.songId}: hard level order`);
  assert.equal(D.levels[index].round,1);
  assert.equal(D.levels[index+tracks.length].round,2);
}
assert.ok(D.levels.every(level=>R.get(level.song)), 'Every campaign level uses a registered MP3');
console.log(`PASS ${tracks.length} MP3 files decode; ${D.levels.length} levels have normal and dense maps with 60-second note coverage`);

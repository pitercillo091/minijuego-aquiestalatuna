(function(root){
  'use strict';
  const clamp=(v,min=0,max=1)=>Math.min(max,Math.max(min,Number(v)||0));
  const profile=program=>{
    if(program<8)return {waves:['triangle','sine'],harmonics:[1,2],mix:[.72,.16],attack:.008,release:.18,decay:1.2};
    if(program<16)return {waves:['sine','triangle'],harmonics:[1,2],mix:[.78,.12],attack:.012,release:.2,decay:1};
    if(program<24)return {waves:['sine','square'],harmonics:[1,2],mix:[.64,.1],attack:.025,release:.28,decay:1.4};
    if(program<32)return {waves:['triangle','sawtooth'],harmonics:[1,2],mix:[.62,.12],attack:.004,release:.16,decay:.7};
    if(program<40)return {waves:['sine','triangle'],harmonics:[.5,1],mix:[.78,.14],attack:.012,release:.2,decay:1};
    if(program<52)return {waves:['sawtooth','triangle'],harmonics:[1,2],mix:[.18,.3],attack:.08,release:.38,decay:1.5};
    if(program<56)return {waves:['sine','triangle'],harmonics:[1,2],mix:[.66,.12],attack:.1,release:.35,decay:1.8};
    if(program<64)return {waves:['sawtooth','square'],harmonics:[1,2],mix:[.22,.14],attack:.025,release:.22,decay:1.4};
    if(program<72)return {waves:['square','triangle'],harmonics:[1,2],mix:[.18,.2],attack:.02,release:.2,decay:1.1};
    if(program<80)return {waves:['sine','triangle'],harmonics:[1,2],mix:[.72,.12],attack:.04,release:.3,decay:1.5};
    return {waves:['sawtooth','sine'],harmonics:[1,2],mix:[.18,.14],attack:.02,release:.24,decay:1.2};
  };
  const set=(p,v,t)=>{if(!p)return;if(typeof p.setValueAtTime==='function')p.setValueAtTime(v,t);else p.value=v};
  const ramp=(p,m,v,t)=>{if(p&&typeof p[m]==='function')p[m](v,t);else if(p)p.value=v};
  class AudioBus{
    constructor(settings){this.settings=settings;this.ctx=null;this.available=true;this.nodes=new Set;this.bag=[];this.lastRandom=settings.lastSong||null;this.track=null;this.sequence=0;this.cursor=0;this.cycle=0;this.chainReady=false;this.recordingBuffers=new Map;this.recordingLoads=new Map;this.recordingTransport=null;this.recordingRequest=0}
    calibratedMaster(){const value=clamp(this.settings.volume);return value===0?0:.84*Math.pow(value,.72)}
    makeChain(){
      if(this.chainReady)return;
      this.master=this.ctx.createGain();this.musicGain=this.ctx.createGain();this.effectsGain=this.ctx.createGain();this.uiGain=this.ctx.createGain();
      set(this.musicGain.gain,.96,0);set(this.effectsGain.gain,.88,0);set(this.uiGain.gain,.8,0);set(this.master.gain,this.calibratedMaster(),0);
      this.musicGain.connect(this.master);this.effectsGain.connect(this.master);this.uiGain.connect(this.master);
      this.compressor=typeof this.ctx.createDynamicsCompressor==='function'?this.ctx.createDynamicsCompressor():null;
      this.limiter=typeof this.ctx.createDynamicsCompressor==='function'?this.ctx.createDynamicsCompressor():null;
      if(this.compressor){set(this.compressor.threshold,-16,0);set(this.compressor.knee,18,0);set(this.compressor.ratio,3.5,0);set(this.compressor.attack,.004,0);set(this.compressor.release,.24,0);this.master.connect(this.compressor)}
      const post=this.compressor||this.master;
      if(this.limiter){set(this.limiter.threshold,-3,0);set(this.limiter.knee,4,0);set(this.limiter.ratio,12,0);set(this.limiter.attack,.001,0);set(this.limiter.release,.12,0);post.connect(this.limiter);this.limiter.connect(this.ctx.destination)}else this.master.connect(this.ctx.destination);
      this.chainReady=true
    }
    async unlock(){
      if(!this.available&&!this.ctx)return;
      try{if(!this.ctx){const Context=root.AudioContext||root.webkitAudioContext;if(!Context){this.available=false;return}this.ctx=new Context;this.makeChain()}if(this.ctx.state==='suspended'||this.ctx.state==='interrupted')await this.ctx.resume();if(this.ctx.state==='running')this.available=true;}catch{this.available=false}
    }
    async resume(){return this.unlock()}
    volume(){if(this.master&&this.ctx){const value=this.calibratedMaster(),now=this.ctx.currentTime;if(typeof this.master.gain.setTargetAtTime==='function')this.master.gain.setTargetAtTime(value,now,.02);else set(this.master.gain,value,now)}}
    output(bus){return bus==='music'?this.musicGain:bus==='ui'?this.uiGain:this.effectsGain}
    tone(freq,duration=.24,delay=0,type='triangle',gain=.55,bus='effects'){
      if(!this.ctx||this.ctx.state!=='running'||this.nodes.size>128)return;
      const t=this.ctx.currentTime+Math.max(0,delay),o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type=type;o.frequency.value=freq;set(g.gain,0,t);ramp(g.gain,'linearRampToValueAtTime',gain,t+.008);ramp(g.gain,'exponentialRampToValueAtTime',.001,t+Math.max(.04,duration));o.connect(g);g.connect(this.output(bus)||this.master);o.start(t);o.stop(t+duration+.025);this.nodes.add(o);o.onended=()=>{this.nodes.delete(o);try{o.disconnect();g.disconnect()}catch{}}
    }
    note(n,delay,current,lead){
      if(!this.ctx||this.ctx.state!=='running'||this.nodes.size>128)return;
      const p=profile(n.program||0),base=440*2**((n.pitch-69+(n.bendSemitones||0))/12),t=this.ctx.currentTime+Math.max(0,delay),velocity=(n.velocity||80)/127,channel=(n.channelVolume??100)/127,expression=(n.expression??127)/127,level=(lead?.34:.15)*velocity*channel*expression*(n.channel===9?.8:1),duration=Math.min(Math.max(.05,n.duration),lead?1.8:1.1);
      p.waves.forEach((wave,i)=>{const o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type=wave;o.frequency.value=base*p.harmonics[i];const a=t+p.attack,d=t+Math.min(duration*.35,t+p.decay),r=t+duration+p.release;set(g.gain,0,t);ramp(g.gain,'linearRampToValueAtTime',level*p.mix[i],a);ramp(g.gain,'exponentialRampToValueAtTime',Math.max(.001,level*p.mix[i]*.42),d);ramp(g.gain,'exponentialRampToValueAtTime',.001,r);let out=g;if(this.ctx.createStereoPanner){const pan=this.ctx.createStereoPanner();pan.pan.value=((n.pan??64)-64)/64;g.connect(pan);out=pan}out.connect(this.musicGain||this.master);o.connect(g);o.start(t);o.stop(r+.03);this.nodes.add(o);o.onended=()=>{this.nodes.delete(o);try{o.disconnect();g.disconnect()}catch{}}})
    }
    strum(chord=[0,4,7]){if(!this.settings.music)return;chord.forEach((p,i)=>this.tone(130.8128*2**(p/12),.32,i*.024,'triangle',.15,'ui'))}
    effect(type){if(!this.settings.effects)return;const sounds={collect:[523,659,784],hit:[880],damage:[140,100],wrong:[160],miss:[190],result:[523,659,784,1047],victory:[523,659,784,1047,1319],defeat:[330,294,220]};(sounds[type]||[]).forEach((f,i)=>this.tone(f,.16,i*.08,'sine',.34,'effects'))}
    random(){if(!this.bag.length||(this.bag.length===1&&this.bag[0]===this.lastRandom)){this.bag=root.TunaSongs.map(s=>s.id);for(let i=this.bag.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[this.bag[i],this.bag[j]]=[this.bag[j],this.bag[i]]}}let index=this.bag.length-1;if(this.bag[index]===this.lastRandom&&index>0)index--;this.lastRandom=this.bag.splice(index,1)[0];this.settings.lastSong=this.lastRandom;return this.lastRandom}
    select(id,{loop=false,offset=0,context='performance',end=null}={}){this.stop();this.track=root.TunaMusic.get(id);this.loop=loop;this.offset=offset;this.trim=this.track.trimBefore||0;this.context=context;this.end=end;this.sequence++;this.cursor=0;this.cycle=0;this.anchor=null;this.title=this.track.title;this.lastRandom=id;this.settings.lastSong=id}
    ambient(context){this.select(this.random(),{loop:true,context})}
    async prepareRecording(config){
      if(this.recordingBuffers.has(config.audioFile))return this.recordingBuffers.get(config.audioFile);
      if(this.recordingLoads.has(config.audioFile))return this.recordingLoads.get(config.audioFile);
      const load=(async()=>{
        await this.unlock();if(!this.ctx)throw new Error('Este navegador no permite reproducir el MP3.');
        const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),20000);
        try{
          const response=await fetch(config.audioFile,{signal:controller.signal});
          if(!response.ok)throw new Error('No se pudo cargar la grabación.');
          const bytes=await response.arrayBuffer();
          if(root.crypto?.subtle&&config.audioSha256){const digest=await root.crypto.subtle.digest('SHA-256',bytes);const hash=Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join('');if(hash!==config.audioSha256)throw new Error('La grabación no coincide con su mapa de notas.');}
          // Callback form also supports older Safari; decode only once. Keep
          // only the selected PCM fragment, releasing the full-song buffer.
          const decoded=await new Promise((resolve,reject)=>this.ctx.decodeAudioData(bytes,resolve,reject));
          const start=Math.round(config.sourceOffset*decoded.sampleRate),length=Math.round(config.playableSeconds*decoded.sampleRate);
          if(start+length>decoded.length)throw new Error('La grabación no contiene el fragmento completo.');
          const excerpt=this.ctx.createBuffer(decoded.numberOfChannels,length,decoded.sampleRate);
          for(let c=0;c<decoded.numberOfChannels;c++)excerpt.getChannelData(c).set(decoded.getChannelData(c).subarray(start,start+length));
          this.recordingBuffers.clear();this.recordingBuffers.set(config.audioFile,excerpt);return excerpt;
        }finally{clearTimeout(timer);}
      })();
      this.recordingLoads.set(config.audioFile,load);
      try{return await load;}finally{this.recordingLoads.delete(config.audioFile);}
    }
    async selectRecording(config,position=-config.leadInSeconds){
      this.stop();const request=this.recordingRequest;
      const transport={config,position,anchor:null,source:null,gain:null,status:'loading',buffer:null,error:null};
      this.recordingTransport=transport;this.track=null;this.context='recording';this.title=config.title+' · MP3';
      try{transport.buffer=await this.prepareRecording(config);if(request!==this.recordingRequest)return;transport.status='ready';}
      catch(error){if(request===this.recordingRequest){transport.status='error';transport.error=error.message;}}
    }
    outputTime(){
      const ctx=this.ctx;
      if(typeof ctx.getOutputTimestamp==='function'){
        const ts=ctx.getOutputTimestamp();
        if(ts.contextTime>0&&ts.performanceTime>0)return Math.min(ctx.currentTime,ts.contextTime+(performance.now()-ts.performanceTime)/1000);
      }
      return ctx.currentTime-Math.max(0,(ctx.outputLatency||0)+(ctx.baseLatency||0));
    }
    recordingClock(){
      const t=this.recordingTransport;if(!t)return null;
      if(t.anchor!==null&&this.ctx.state==='running')t.position=Math.min(t.config.playableSeconds,Math.max(t.position,this.outputTime()-t.anchor-.006));
      return t.position;
    }
    releaseRecordingSource(t){
      if(t?.source){const source=t.source;t.source=null;try{source.stop();source.disconnect();t.gain.disconnect();}catch{}}
      if(t)t.gain=null;
    }
    pauseRecording(){
      const t=this.recordingTransport;if(!t)return;
      this.recordingClock();this.releaseRecordingSource(t);t.anchor=null;
      if(t.status==='playing'||t.status==='ready')t.status='ready';
    }
    recordingVolume(){
      const t=this.recordingTransport;if(!t?.gain||t.muted===!this.settings.music)return;
      t.muted=!this.settings.music;
      // Muting the music must not remove the authoritative playback clock.
      const now=this.ctx.currentTime,base=t.muted?0:t.config.recordingGain;
      t.gain.gain.cancelScheduledValues(now);t.gain.gain.setTargetAtTime(base,now,.01);
      const end=t.anchor+t.config.playableSeconds;
      t.gain.gain.setValueAtTime(base,Math.max(now+.03,end-t.config.fadeOutSeconds));t.gain.gain.linearRampToValueAtTime(0,end);
    }
    updateRecording(game){
      const t=this.recordingTransport;if(!t||game.phase!=='playing')return;
      if(t.status==='ready'&&this.ctx?.state==='running'){
        const pos=Math.max(0,t.position),when=this.ctx.currentTime+Math.max(.04,-t.position),left=t.config.playableSeconds-pos;
        if(left<=0)return;
        const source=this.ctx.createBufferSource(),gain=this.ctx.createGain();source.buffer=t.buffer;
        t.source=source;t.gain=gain;t.anchor=when-pos;t.status='playing';t.muted=!this.settings.music;
        const base=t.muted?0:t.config.recordingGain;
        set(gain.gain,0,when);ramp(gain.gain,'linearRampToValueAtTime',base,when+.012);
        set(gain.gain,base,Math.max(when+.012,t.anchor+t.config.playableSeconds-t.config.fadeOutSeconds));ramp(gain.gain,'linearRampToValueAtTime',0,t.anchor+t.config.playableSeconds);
        source.connect(gain);gain.connect(this.musicGain);source.start(when,pos,left);
        source.onended=()=>{try{source.disconnect();gain.disconnect();}catch{}if(t.source===source){t.source=null;t.gain=null;}};
      }
      this.recordingVolume();this.recordingClock();
    }
    update(game){
      if(this.recordingTransport){this.updateRecording(game);return;}
      if(!this.ctx||this.ctx.state!=='running'||!this.settings.music||!this.track)return;if(this.context==='performance'&&game.phase!=='playing')return;if(this.context==='explore'&&game.phase!=='playing')return;
      const clock=this.context==='performance'?game.clock-this.offset:null;if(clock!==null&&clock<-.08){this.anchor=null;return}if(clock!==null&&this.anchor!==null&&Math.abs(this.ctx.currentTime-this.anchor-clock)>.12)this.stop();
      if(this.anchor===null){const pos=Math.max(0,clock||0);this.anchor=this.ctx.currentTime-pos;this.cursor=this.track.notes.findIndex(n=>n.at>=this.trim+pos-.04);if(this.cursor<0)this.cursor=this.track.notes.length}
      const current=this.ctx.currentTime-this.anchor,horizon=current+.1,duration=Math.max(.35,this.track.duration-this.trim+.35);
      while(this.cursor<this.track.notes.length){const n=this.track.notes[this.cursor],at=n.at-this.trim+this.cycle*duration;if(at>horizon)break;this.cursor++;if(at<current-.08||this.end!==null&&at>this.end)continue;this.note(n,at-current,current,n.channel===(this.track.melodyChannel??0))}
      if(this.loop&&current>duration*(this.cycle+1)){this.cycle++;this.cursor=this.track.notes.findIndex(n=>n.at>=this.trim-.04);if(this.cursor<0)this.cursor=this.track.notes.length}
      if(this.loop&&this.cycle>=1&&this.context!=='performance')this.ambient(this.context)
    }
    stop(){this.recordingRequest++;this.releaseRecordingSource(this.recordingTransport);this.recordingTransport=null;this.nodes.forEach(o=>{try{o.stop()}catch{}});this.nodes.clear();this.anchor=null}
  }
  root.TunaAudio=AudioBus
})(globalThis);

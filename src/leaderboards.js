(function(root){
  'use strict';
  const config=typeof module!=='undefined'&&module.exports?{url:'',key:''}:root.TunaRankingsConfig||{};
  let active=null, inFlight=false;
  function playerId(storage){
    const key='tuna-ranking-player-v1';
    try{let value=storage.getItem(key);if(value&&/^[0-9a-f-]{36}$/i.test(value))return value;value=root.crypto?.randomUUID?.()||'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,c=>{const r=Math.random()*16|0;return(c==='x'?r:(r&3|8)).toString(16)});storage.setItem(key,value);return value;}catch{return root.crypto?.randomUUID?.()||'00000000-0000-4000-8000-000000000000';}
  }
  function safeName(value){if(typeof value!=='string')return null;const name=value.normalize('NFC').trim().replace(/\s+/gu,' ').toLocaleUpperCase('es-ES');if(name.length<1||name.length>24||!/^[-\p{L}\p{N} ._'´’]+$/u.test(name)||/[<>/&\\@]/u.test(name)||/\d{7,}/u.test(name)||/(puta|puto|mierda|coño|cabr[oó]n|fuck|shit|nazi)/iu.test(name))return null;return name;}
  async function request(body){if(!config.url||!config.key)throw new Error('El ranking no está configurado.');const response=await fetch(`${config.url}/functions/v1/tuna-rankings`,{method:'POST',headers:{'Content-Type':'application/json','apikey':config.key},body:JSON.stringify(body),cache:'no-store'});let data={};try{data=await response.json();}catch{}if(!response.ok)throw new Error(data.error||'El servicio de clasificaciones no responde.');return data;}
  async function start(level,id){active={level,token:null,failed:false};const current=active;try{const data=await request({action:'start',level:level+1,playerId:id});if(active===current)current.token=data.token;return data;}catch(error){if(active===current)current.failed=true;throw error;}}
  async function submit(result){if(!active?.token)throw new Error('No se pudo validar esta partida para la clasificación. Puedes conservar tu récord en este dispositivo.');if(inFlight)throw new Error('El resultado se está guardando.');inFlight=true;try{const playerName=safeName(result.playerName);if(!playerName)throw new Error('Escribe un apodo válido de hasta 24 caracteres.');const response=await request({action:'finish',token:active.token,playerName,score:result.score,accuracy:result.accuracy,hits:result.hits,misses:result.misses,notes:result.notes});if(response.deleteToken)response.receipt={id:response.id,token:response.deleteToken,level:active.level+1,playerName};active=null;return response;}finally{inFlight=false;}}
  async function list({mode='level',level=1,limit=10,offset=0}={}){return request({action:'list',mode,level,limit,offset});}
  async function remove(receipt){if(!receipt?.id||!receipt?.token)throw new Error('No se encontró el permiso local para retirar este resultado.');return request({action:'delete',id:receipt.id,token:receipt.token});}
  function escapeHtml(text){return String(text??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));}
  const api={playerId,safeName,start,submit,list,remove,escapeHtml,get active(){return active;}};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.TunaRankings=api;
})(globalThis);

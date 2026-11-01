'use strict';
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./functions/pokemon.json'),require('./olympics'));else root.RoomLogic=factory(POKEMON,root.Olympics)})(globalThis,function(pokemon,Olympics){
const byId=new Map(pokemon.map(p=>[p.id,p]));
const caps={'Sub-Legendary':3,Legendary:1,Mythical:1};
function pools(room){const player=room.players[room.turn%room.players.length],picked=new Set(room.players.flatMap(p=>p.team)),groups=new Map();for(const p of pokemon){if((room.fullyEvolvedOnly&&!p.fullyEvolved)||picked.has(p.id)||(caps[p.category]&&player.team.filter(id=>byId.get(id).category===p.category).length>=caps[p.category]))continue;for(const type of p.types){const key=p.generation+'|'+type;if(!groups.has(key))groups.set(key,[]);groups.get(key).push(p.id)}}return groups}
function roll(room){const keys=[...pools(room).keys()],other=keys.filter(k=>k!==room.roll),choices=other.length?other:keys;if(!choices.length)throw Error('No eligible choices remain.');room.roll=choices[Math.floor(Math.random()*choices.length)]}
function dealRandomTeams(room,random=Math.random){
 const quotas={'Sub-Legendary':3,Legendary:1,Mythical:1,'':7},buckets={};
 const shuffle=items=>{for(let i=items.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[items[i],items[j]]=[items[j],items[i]]}return items};
 for(const [category,count] of Object.entries(quotas)){
  buckets[category]=shuffle(pokemon.filter(p=>p.fullyEvolved&&p.category===category).map(p=>p.id));
  if(buckets[category].length<room.players.length*count)throw Error('Not enough fully evolved '+(category||'regular')+' Pokémon for this many players.');
 }
 const teams=room.players.map(()=>[]);
 for(const [category,count] of Object.entries(quotas))for(let i=0;i<teams.length;i++)teams[i].push(...buckets[category].slice(i*count,(i+1)*count));
 room.players.forEach((player,i)=>{player.team=shuffle(teams[i]);player.rerolls=2});
 room.turn=room.players.length*12;room.roll=null;room.status='complete';return room;
}
function joinRoom(room,uid,data){const admin=data.adminCode==='Sethupathi';if(data.adminCode&&!admin)throw Error('Incorrect admin code.');if(!room){if(!admin)throw Error('Room not found. An admin must create it first.');room={version:1,status:'lobby',turn:0,roll:null,players:[],memberIds:[],adminIds:[],revision:0}}
 if(!room.memberIds.includes(uid)){if(room.status!=='lobby')throw Error('This draft has already started.');if(room.players.length>=12)throw Error('Room is full (12 players).');const name=String(data.name||'').trim().slice(0,24);if(!name)throw Error('Enter your player name.');room.memberIds.push(uid);room.players.push({uid,name,team:[],rerolls:2})}
 if(admin&&!room.adminIds.includes(uid))room.adminIds.push(uid);room.revision++;return room}
function applyAction(room,uid,data){if(!room.memberIds.includes(uid))throw Error('Join this room first.');if(data.expectedRevision!==room.revision)throw Error('The room changed. Try again.');
 if(data.action==='setRules'){if(!room.adminIds.includes(uid)||room.status!=='lobby')throw Error('Only admins may change rules before drafting.');if(Object.hasOwn(data,'fullyEvolvedOnly'))room.fullyEvolvedOnly=!!data.fullyEvolvedOnly;if(Object.hasOwn(data,'randomDraft'))room.randomDraft=!!data.randomDraft;room.revision++;return room}
 if(['startGames','enterEvent','nextEvent'].includes(data.action)){Olympics.apply(room,uid,data,pokemon);room.revision++;return room}
 if(['start','reset'].includes(data.action)){if(!room.adminIds.includes(uid))throw Error('Only an admin can do that.');if(data.action==='start'){if(room.status!=='lobby')throw Error('Draft already started.');if(room.randomDraft)dealRandomTeams(room);else{room.status='draft';roll(room)}}else{delete room.games;room.status='lobby';room.turn=0;room.roll=null;room.players.forEach(p=>{p.team=[];p.rerolls=2})}}
 else {if(room.status!=='draft')throw Error('The draft is not active.');const player=room.players[room.turn%room.players.length];if(player.uid!==uid)throw Error('Wait for your turn.');if(data.action==='reroll'){if(!player.rerolls)throw Error('No rerolls remaining.');player.rerolls--;roll(room)}else if(data.action==='pick'){const id=Number(data.pokemonId);if(!(pools(room).get(room.roll)||[]).includes(id))throw Error('That Pokémon is not an available choice.');player.team.push(id);room.turn++;if(room.turn===room.players.length*12)room.status='complete';else roll(room)}else throw Error('Unknown action.');}
 room.revision++;return room}
// Realtime Database omits empty arrays and null fields in snapshots.
function normalizeRoom(value){if(!value)return null;const room=JSON.parse(JSON.stringify(value));room.players=Object.values(room.players||{}).map(p=>({...p,team:Object.values(p.team||{})}));room.memberIds=Object.values(room.memberIds||{});room.adminIds=Object.values(room.adminIds||{});room.roll=room.roll||null;if(room.games){room.games.entries=room.games.entries||{};room.games.results=Object.values(room.games.results||{});}return room}
async function transactRoom(runTransaction,roomRef,uid,data){
 let rejection=null;
 const result=await runTransaction(roomRef,raw=>{
  rejection=null;
  try {
   const value=normalizeRoom(raw);
   if(data.action==='join')return joinRoom(value,uid,data);
   if(!value)throw Error('Room not found.');
   return applyAction(value,uid,data);
  }catch(error){
   rejection=error;
   // An initial null can mean an empty SDK cache, not a missing server room.
   // Preserve the original value so Firebase checks it against the server and
   // retries with current data. Returning undefined would abort immediately.
   // Never return the normalized/mutated value from a rejected action.
   return raw;
  }
 },{applyLocally:false});
 if(!result.committed)throw Error('Room update was cancelled. Try again.');
 if(rejection)throw rejection;
 return result;
}
return {dealRandomTeams,joinRoom,applyAction,pools,normalizeRoom,transactRoom};
});

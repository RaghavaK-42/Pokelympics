'use strict';
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.Olympics=factory()})(globalThis,function(){
const events=[
 {id:'dash',name:'100 Meter Dash',stats:[5],types:['Electric','Normal','Fire'],duration:12000,mode:'race'},
 {id:'shot',name:'Shot Put',stats:[2,1],types:['Fighting','Rock','Steel'],duration:6000,mode:'turn'},
 {id:'archery',name:'Archery',stats:[3,4],types:['Grass','Psychic','Dark'],duration:6000,mode:'turn'},
 {id:'run',name:'1500 Meter Run',stats:[5,0],types:['Ground','Bug','Dragon'],duration:22000,mode:'race'},
 {id:'swim',name:'200 Meter Freestyle',stats:[0,5,4],types:['Water','Ice','Flying'],duration:16000,mode:'race'},
 {id:'jump',name:'Long Jump',stats:[1,5,2],types:['Flying','Ground','Fighting'],duration:6500,mode:'turn'},
 {id:'gym',name:'Floor Gymnastics',stats:[1,3,4],types:['Fairy','Psychic','Ghost'],duration:7500,mode:'turn'},
 {id:'lift',name:'Weightlifting',stats:[2,0],types:['Steel','Rock','Fire'],duration:6500,mode:'turn'},
 {id:'fence',name:'Fencing Target Challenge',stats:[1,3],types:['Bug','Dark','Poison'],duration:6500,mode:'turn'},
 {id:'balance',name:'Balance Beam',stats:[2,3,4,0],types:['Normal','Grass','Fairy'],duration:7500,mode:'turn'},
 {id:'hurdles',name:'110 Meter Hurdles',stats:[0,1,5],types:['Normal','Electric','Ground'],duration:14000,mode:'race'},
 {id:'highjump',name:'High Jump',stats:[1,2,5],types:['Flying','Dragon'],duration:7000,mode:'turn'},
 {id:'javelin',name:'Javelin Throw',stats:[2,3,4],types:['Fighting','Steel','Poison'],duration:7000,mode:'turn'},
 {id:'discus',name:'Discus Throw',stats:[2,3,0],types:['Rock','Fire','Dark'],duration:7000,mode:'turn'},
 {id:'dive',name:'Platform Diving',stats:[1,3,4],types:['Water','Psychic','Ghost','Fairy'],duration:7500,mode:'turn'},
 {id:'climb',name:'Speed Climbing',stats:[0,2,4],types:['Grass','Bug','Poison'],duration:15000,mode:'race'},
 {id:'skate',name:'500 Meter Speed Skating',stats:[1,4,5],types:['Ice','Ghost'],duration:17000,mode:'race'},
 {id:'canoe',name:'200 Meter Canoe Sprint',stats:[0,3,5],types:['Water','Electric','Dragon','Ice'],duration:17000,mode:'race'}
];
// Internal scoring: sum each event's listed star ratings, then apply one
// non-stacking 12% affinity bonus and a single uniform 0.9–1.1 performance factor.
function scorePokemon(mon,event,random=Math.random){const base=event.stats.reduce((sum,i)=>sum+rating(mon.stats[i]),0),typeBonus=mon.types.some(t=>event.types.includes(t))?1.12:1,factor=.9+random()*.2;return {base,typeBonus,factor,score:base*typeBonus*factor}}

function rating(v){return v<20?.5:v<40?1:v<53?1.5:v<66?2:v<79?2.5:v<92?3:v<105?3.5:v<118?4:v<131?4.5:5}
function eventFor(room){return events.find(e=>e.id===room.games.order[room.games.index])}
function duration(room){const e=eventFor(room);return e.mode==='turn'?e.duration*room.players.length:e.duration}
function usedPokemon(room,uid){return new Set((room.games?.results||[]).flatMap(r=>r.standings.filter(s=>s.uid===uid).map(s=>s.pokemonId)))}
function performance(event,score){switch(event.id){
 case 'dash':return {value:7+30/score,unit:'s',lower:true};
 case 'run':return {value:180+900/score,unit:'s',lower:true};
 case 'swim':return {value:70+300/score,unit:'s',lower:true};
 case 'hurdles':return {value:11+45/score,unit:'s',lower:true};
 case 'climb':return {value:4+35/score,unit:'s',lower:true};
 case 'skate':return {value:30+100/score,unit:'s',lower:true};
 case 'canoe':return {value:35+130/score,unit:'s',lower:true};
 case 'highjump':return {value:score*.25,unit:'m',lower:false};
 case 'javelin':return {value:score*6,unit:'m',lower:false};
 case 'discus':return {value:score*5,unit:'m',lower:false};
 case 'shot':return {value:score*3,unit:'m',lower:false};
 case 'jump':return {value:score*.7,unit:'m',lower:false};
 case 'lift':return {value:score*12,unit:'kg',lower:false};
 default:return {value:100*score/(event.stats.length*5*1.12*1.1),unit:'points',lower:false};
}}
function apply(room,uid,data,pokemon){const admin=(room.adminIds||[]).includes(uid),now=data.now||Date.now();
 if(data.action==='startGames'){if(!admin)throw Error('Only an admin can start the games.');if(room.turn!==room.players.length*12||room.games)throw Error('Finish the draft before starting the games.');const order=events.map(e=>e.id);for(let i=order.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[order[i],order[j]]=[order[j],order[i]]}room.games={order:order.slice(0,10),index:0,phase:'select',entries:{},results:[]};room.status='games';}
 else {if(room.status!=='games'||!room.games)throw Error('The games are not active.');const g=room.games;
 if(data.action==='enterEvent'){if(g.phase!=='select')throw Error('Entries are closed.');const player=room.players.find(p=>p.uid===uid);if(!player||!player.team.includes(Number(data.pokemonId)))throw Error('Choose a Pokémon from your own team.');if(usedPokemon(room,uid).has(Number(data.pokemonId)))throw Error('This Pokémon has already competed. Choose an unused team member.');if(room.fullyEvolvedOnly&&!pokemon.find(p=>p.id===Number(data.pokemonId)).fullyEvolved)throw Error('Only fully evolved Pokémon may compete.');if(g.entries[uid])throw Error('Your entry is already locked.');g.entries[uid]=Number(data.pokemonId);
 if(room.players.every(p=>g.entries[p.uid])){const e=eventFor(room);g.results=g.results||[];const standings=room.players.map(p=>{const id=g.entries[p.uid],mon=pokemon.find(x=>x.id===id);return {uid:p.uid,pokemonId:id,...scorePokemon(mon,e)}}).sort((a,b)=>b.score-a.score);g.results.push({event:e.id,standings});g.phase='animate';g.startsAt=now+4000;g.endsAt=g.startsAt+duration(room);}}
 else if(data.action==='nextEvent'){if(!admin)throw Error('Only an admin can advance the games.');if(g.phase!=='animate'||now<g.endsAt)throw Error('Wait until the event finishes.');if(g.index===g.order.length-1){g.phase='finished';room.status='finished'}else{g.index++;g.phase='select';g.entries={};delete g.startsAt;delete g.endsAt}}
 else throw Error('Unknown games action.');}
 return room;}
function medals(room,now=Infinity){const totals=room.players.map(p=>({uid:p.uid,name:p.name,golds:0}));for(const [i,r] of (room.games.results||[]).entries()){if(room.games.phase==='animate'&&i===room.games.index&&now<room.games.endsAt)continue;for(const s of r.standings.filter(s=>s.score===r.standings[0].score))totals.find(p=>p.uid===s.uid).golds++}return totals.sort((a,b)=>b.golds-a.golds)}
return {events,usedPokemon,performance,scorePokemon,rating,eventFor,duration,apply,medals};
});

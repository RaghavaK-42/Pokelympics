'use strict';
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.Olympics=factory()})(globalThis,function(){
const events=[
 {
  "id": "dash",
  "name": "100 Meter Dash",
  "stats": [
   5
  ],
  "types": [
   "Normal",
   "Electric",
   "Dark"
  ],
  "duration": 6000,
  "mode": "race"
 },
 {
  "id": "shot",
  "name": "Shot Put",
  "stats": [
   1,
   2
  ],
  "types": [
   "Fighting",
   "Rock",
   "Steel"
  ],
  "duration": 3000,
  "mode": "turn"
 },
 {
  "id": "archery",
  "name": "Archery",
  "stats": [
   3,
   4,
   5
  ],
  "types": [
   "Grass",
   "Psychic"
  ],
  "duration": 3000,
  "mode": "turn"
 },
 {
  "id": "run",
  "name": "1500 Meter Run",
  "stats": [
   0
  ],
  "types": [
   "Ground",
   "Bug",
   "Dragon"
  ],
  "duration": 11000,
  "mode": "race"
 },
 {
  "id": "swim",
  "name": "200 Meter Freestyle",
  "stats": [
   0,
   5
  ],
  "types": [
   "Water",
   "Ice",
   "Flying"
  ],
  "duration": 8000,
  "mode": "race"
 },
 {
  "id": "jump",
  "name": "Long Jump",
  "stats": [
   1,
   5
  ],
  "types": [
   "Fighting"
  ],
  "duration": 3250,
  "mode": "turn"
 },
 {
  "id": "gym",
  "name": "Floor Gymnastics",
  "stats": [
   1,
   3,
   4
  ],
  "types": [
   "Psychic",
   "Ghost"
  ],
  "duration": 3750,
  "mode": "turn"
 },
 {
  "id": "lift",
  "name": "Weightlifting",
  "stats": [
   0,
   2
  ],
  "types": [
   "Fire",
   "Rock",
   "Steel"
  ],
  "duration": 3250,
  "mode": "turn"
 },
 {
  "id": "fence",
  "name": "Fencing Target Challenge",
  "stats": [
   1
  ],
  "types": [
   "Poison",
   "Dark"
  ],
  "duration": 3250,
  "mode": "turn"
 },
 {
  "id": "balance",
  "name": "Balance Beam",
  "stats": [
   4
  ],
  "types": [
   "Normal",
   "Fairy"
  ],
  "duration": 3750,
  "mode": "turn"
 },
 {
  "id": "hurdles",
  "name": "110 Meter Hurdles",
  "stats": [
   0,
   2,
   5
  ],
  "types": [
   "Normal",
   "Electric",
   "Ground"
  ],
  "duration": 7000,
  "mode": "race"
 },
 {
  "id": "highjump",
  "name": "High Jump",
  "stats": [
   2
  ],
  "types": [
   "Flying",
   "Rock",
   "Dragon"
  ],
  "duration": 3500,
  "mode": "turn"
 },
 {
  "id": "javelin",
  "name": "Javelin Throw",
  "stats": [
   2,
   4
  ],
  "types": [
   "Fighting",
   "Poison",
   "Bug"
  ],
  "duration": 3500,
  "mode": "turn"
 },
 {
  "id": "discus",
  "name": "Discus Throw",
  "stats": [
   0,
   2,
   3
  ],
  "types": [
   "Fire",
   "Rock",
   "Dark"
  ],
  "duration": 3500,
  "mode": "turn"
 },
 {
  "id": "dive",
  "name": "Platform Diving",
  "stats": [
   1,
   4
  ],
  "types": [
   "Water",
   "Fairy"
  ],
  "duration": 3750,
  "mode": "turn"
 },
 {
  "id": "climb",
  "name": "Speed Climbing",
  "stats": [
   0,
   1,
   4
  ],
  "types": [
   "Grass",
   "Poison",
   "Bug"
  ],
  "duration": 7500,
  "mode": "race"
 },
 {
  "id": "skate",
  "name": "500 Meter Speed Skating",
  "stats": [
   1,
   2,
   4
  ],
  "types": [
   "Ice",
   "Ghost"
  ],
  "duration": 8500,
  "mode": "race"
 },
 {
  "id": "canoe",
  "name": "200 Meter Canoe Sprint",
  "stats": [
   0,
   3,
   5
  ],
  "types": [
   "Electric",
   "Ice",
   "Dragon"
  ],
  "duration": 8500,
  "mode": "race"
 },
 {
  "id": "sprint400",
  "name": "400 Meter Sprint",
  "stats": [
   3,
   5
  ],
  "types": [
   "Normal",
   "Electric"
  ],
  "duration": 8000,
  "mode": "race",
  "animation": "sprint",
  "distance": 400,
  "metric": {
   "unit": "s",
   "offset": 40,
   "scale": 800,
   "lower": true
  }
 },
 {
  "id": "steeple",
  "name": "3000 Meter Steeplechase",
  "stats": [
   0,
   4,
   5
  ],
  "types": [
   "Electric",
   "Grass",
   "Ground"
  ],
  "duration": 8000,
  "mode": "race",
  "animation": "steeple",
  "distance": 3000,
  "metric": {
   "unit": "s",
   "offset": 300,
   "scale": 6000,
   "lower": true
  }
 },
 {
  "id": "butterfly",
  "name": "50 Meter Butterfly",
  "stats": [
   0,
   1,
   5
  ],
  "types": [
   "Water",
   "Ice"
  ],
  "duration": 8000,
  "mode": "race",
  "animation": "water",
  "distance": 50,
  "metric": {
   "unit": "s",
   "offset": 5,
   "scale": 100,
   "lower": true
  }
 },
 {
  "id": "rowing",
  "name": "Single Sculls Rowing",
  "stats": [
   3,
   4
  ],
  "types": [
   "Water",
   "Ghost",
   "Dragon"
  ],
  "duration": 8000,
  "mode": "race",
  "animation": "boat",
  "distance": 1000,
  "metric": {
   "unit": "s",
   "offset": 100,
   "scale": 2000,
   "lower": true
  }
 },
 {
  "id": "cycling",
  "name": "Track Cycling",
  "stats": [
   2,
   4,
   5
  ],
  "types": [
   "Normal",
   "Steel"
  ],
  "duration": 8000,
  "mode": "race",
  "animation": "bike",
  "distance": 1000,
  "metric": {
   "unit": "s",
   "offset": 100,
   "scale": 2000,
   "lower": true
  }
 },
 {
  "id": "ski",
  "name": "Alpine Slalom",
  "stats": [
   1,
   3
  ],
  "types": [
   "Water",
   "Ice",
   "Ghost"
  ],
  "duration": 8000,
  "mode": "race",
  "animation": "ski",
  "distance": 500,
  "metric": {
   "unit": "s",
   "offset": 50,
   "scale": 1000,
   "lower": true
  }
 },
 {
  "id": "crosscountry",
  "name": "Cross-Country Run",
  "stats": [
   4,
   5
  ],
  "types": [
   "Ground",
   "Psychic",
   "Dragon"
  ],
  "duration": 8000,
  "mode": "race",
  "animation": "trail",
  "distance": 5000,
  "metric": {
   "unit": "s",
   "offset": 500,
   "scale": 10000,
   "lower": true
  }
 },
 {
  "id": "polevault",
  "name": "Pole Vault",
  "stats": [
   0,
   1
  ],
  "types": [
   "Ground",
   "Flying",
   "Steel"
  ],
  "duration": 3250,
  "mode": "turn",
  "animation": "vault",
  "metric": {
   "unit": "m",
   "scale": 0.3,
   "lower": false
  }
 },
 {
  "id": "triplejump",
  "name": "Triple Jump",
  "stats": [
   1,
   2,
   5
  ],
  "types": [
   "Fighting",
   "Bug",
   "Dark"
  ],
  "duration": 3250,
  "mode": "turn",
  "animation": "hops",
  "metric": {
   "unit": "m",
   "scale": 1.1,
   "lower": false
  }
 },
 {
  "id": "hammer",
  "name": "Hammer Throw",
  "stats": [
   2,
   5
  ],
  "types": [
   "Fire",
   "Steel",
   "Fairy"
  ],
  "duration": 3250,
  "mode": "turn",
  "animation": "hammer",
  "metric": {
   "unit": "m",
   "scale": 7,
   "lower": false
  }
 },
 {
  "id": "bowling",
  "name": "Ten-Pin Bowling",
  "stats": [
   2,
   3,
   5
  ],
  "types": [
   "Flying",
   "Rock"
  ],
  "duration": 3250,
  "mode": "turn",
  "animation": "pins"
 },
 {
  "id": "tabletennis",
  "name": "Table Tennis Rally",
  "stats": [
   1,
   2,
   3
  ],
  "types": [
   "Electric",
   "Bug"
  ],
  "duration": 3250,
  "mode": "turn",
  "animation": "table"
 },
 {
  "id": "badminton",
  "name": "Badminton Accuracy",
  "stats": [
   1,
   3,
   5
  ],
  "types": [
   "Grass",
   "Flying",
   "Fairy"
  ],
  "duration": 3250,
  "mode": "turn",
  "animation": "shuttle"
 },
 {
  "id": "tennis",
  "name": "Tennis Serve",
  "stats": [
   2,
   3,
   4
  ],
  "types": [
   "Fire",
   "Grass",
   "Psychic"
  ],
  "duration": 3250,
  "mode": "turn",
  "animation": "tennis"
 },
 {
  "id": "soccer",
  "name": "Football Free Kick",
  "stats": [
   3
  ],
  "types": [
   "Fighting",
   "Poison",
   "Dark"
  ],
  "duration": 3250,
  "mode": "turn",
  "animation": "goal"
 },
 {
  "id": "basketball",
  "name": "Basketball Free Throw",
  "stats": [
   2,
   3
  ],
  "types": [
   "Flying",
   "Psychic",
   "Bug"
  ],
  "duration": 3250,
  "mode": "turn",
  "animation": "hoop"
 },
 {
  "id": "golf",
  "name": "Golf Approach",
  "stats": [
   0,
   3
  ],
  "types": [
   "Grass",
   "Ground",
   "Dragon"
  ],
  "duration": 3250,
  "mode": "turn",
  "animation": "golf"
 },
 {
  "id": "curling",
  "name": "Curling Precision",
  "stats": [
   0,
   1,
   2
  ],
  "types": [
   "Water",
   "Ice",
   "Steel"
  ],
  "duration": 3250,
  "mode": "turn",
  "animation": "curl"
 },
 {
  "id": "trampoline",
  "name": "Trampoline Routine",
  "stats": [
   0,
   4
  ],
  "types": [
   "Psychic",
   "Ghost",
   "Fairy"
  ],
  "duration": 3250,
  "mode": "turn",
  "animation": "bounce"
 },
 {
  "id": "rings",
  "name": "Still Rings",
  "stats": [
   0,
   2,
   4
  ],
  "types": [
   "Fire",
   "Fighting",
   "Rock"
  ],
  "duration": 3250,
  "mode": "turn",
  "animation": "rings"
 },
 {
  "id": "ribbon",
  "name": "Rhythmic Ribbon",
  "stats": [
   0,
   1,
   3
  ],
  "types": [
   "Poison",
   "Ghost",
   "Fairy"
  ],
  "duration": 3250,
  "mode": "turn",
  "animation": "ribbon"
 },
 {
  "id": "karate",
  "name": "Karate Kata",
  "stats": [
   0,
   3,
   4
  ],
  "types": [
   "Fire",
   "Poison",
   "Dark"
  ],
  "duration": 3250,
  "mode": "turn",
  "animation": "kata"
 },
 {
  "id": "skateboard",
  "name": "Skateboard Park",
  "stats": [
   1,
   4,
   5
  ],
  "types": [
   "Normal"
  ],
  "duration": 3250,
  "mode": "turn",
  "animation": "ramp"
 }
];
// Internal scoring: sum each event's listed star ratings, then apply one
// non-stacking 12% affinity bonus and a single uniform 0.9–1.1 performance factor.
function scorePokemon(mon,event,random=Math.random){const base=event.stats.reduce((sum,i)=>sum+rating(mon.stats[i]),0),typeBonus=mon.types.some(t=>event.types.includes(t))?1.12:1,factor=.9+random()*.2;return {base,typeBonus,factor,score:base*typeBonus*factor}}

function rating(v){return v<20?.5:v<40?1:v<53?1.5:v<66?2:v<79?2.5:v<92?3:v<105?3.5:v<118?4:v<131?4.5:5}
function eventFor(room){return events.find(e=>e.id===room.games.order[room.games.index])}
function duration(room){const e=eventFor(room);return e.mode==='turn'?e.duration*room.players.length:e.duration}
function usedPokemon(room,uid){return new Set((room.games?.results||[]).flatMap(r=>r.standings.filter(s=>s.uid===uid).map(s=>s.pokemonId)))}
function performance(event,score){if(event.metric){const m=event.metric;return {value:(m.offset||0)+(m.lower?m.scale/score:m.scale*score),unit:m.unit,lower:m.lower}}switch(event.id){
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
 if(room.players.every(p=>g.entries[p.uid])){const e=eventFor(room);g.results=g.results||[];const standings=room.players.map(p=>{const id=g.entries[p.uid],mon=pokemon.find(x=>x.id===id);return {uid:p.uid,pokemonId:id,...scorePokemon(mon,e)}}).sort((a,b)=>b.score-a.score);g.results.push({event:e.id,standings});g.phase='animate';g.startsAt=now+2000;g.endsAt=g.startsAt+duration(room);}}
 else if(data.action==='nextEvent'){if(!admin)throw Error('Only an admin can advance the games.');if(g.phase!=='animate'||now<g.endsAt)throw Error('Wait until the event finishes.');if(g.index===g.order.length-1){g.phase='finished';room.status='finished'}else{g.index++;g.phase='select';g.entries={};delete g.startsAt;delete g.endsAt}}
 else throw Error('Unknown games action.');}
 return room;}
function medals(room,now=Infinity){const totals=room.players.map(p=>({uid:p.uid,name:p.name,golds:0}));for(const [i,r] of (room.games.results||[]).entries()){if(room.games.phase==='animate'&&i===room.games.index&&now<room.games.endsAt)continue;for(const s of r.standings.filter(s=>s.score===r.standings[0].score))totals.find(p=>p.uid===s.uid).golds++}return totals.sort((a,b)=>b.golds-a.golds)}
return {events,usedPokemon,performance,scorePokemon,rating,eventFor,duration,apply,medals};
});

const assert=require('node:assert/strict'),Olympics=require('../olympics'),Logic=require('../room-logic'),pokemon=require('../functions/pokemon.json');
let room=Logic.joinRoom(null,'a',{name:'A',adminCode:'Sethupathi'});room=Logic.joinRoom(room,'b',{name:'B'});room.players[0].team=pokemon.slice(0,12).map(p=>p.id);room.players[1].team=pokemon.slice(12,24).map(p=>p.id);room.turn=24;room.status='complete';
let now=1000000;const act=(uid,action,extra={})=>Logic.applyAction(room,uid,{action,expectedRevision:room.revision,now,...extra});
assert.throws(()=>act('b','startGames'),/admin/);act('a','startGames');assert.equal(new Set(room.games.order).size,10);
assert.throws(()=>act('a','startGames'),/Finish/);
for(let i=0;i<10;i++){
 const event=Olympics.eventFor(room);assert.equal(room.games.phase,'select');
 assert.throws(()=>act('a','enterEvent',{pokemonId:room.players[1].team[0]}),/own team/);
 if(i>0)assert.throws(()=>act('a','enterEvent',{pokemonId:room.players[0].team[0]}),/already competed/);
 act('a','enterEvent',{pokemonId:room.players[0].team[i]});assert.equal(room.games.phase,'select');
 assert.throws(()=>act('a','enterEvent',{pokemonId:room.players[0].team[i]}),/already locked/);
 act('b','enterEvent',{pokemonId:room.players[1].team[i]});assert.equal(room.games.phase,'animate');assert.equal(room.games.results.length,i+1);
 const result=room.games.results[i];assert(result.standings[0].score>=result.standings[1].score);
 for(const entry of result.standings){const mon=pokemon.find(p=>p.id===entry.pokemonId);assert.equal(entry.base,event.stats.reduce((sum,k)=>sum+Olympics.rating(mon.stats[k]),0));assert(entry.factor>=.9&&entry.factor<=1.1);assert.equal(entry.score,entry.base*entry.typeBonus*entry.factor)}
 assert.equal(Olympics.medals(room,now).reduce((sum,p)=>sum+p.golds,0),i);
 assert.equal(room.games.endsAt-room.games.startsAt,event.mode==='turn'?event.duration*2:event.duration);
 assert.throws(()=>act('a','nextEvent'),/finishes/);now=room.games.endsAt;
 assert.throws(()=>act('b','nextEvent'),/admin/);act('a','nextEvent');
 room=Logic.normalizeRoom(JSON.parse(JSON.stringify(room)));
}
assert.equal(room.status,'finished');assert.equal(Olympics.medals(room).reduce((sum,p)=>sum+p.golds,0),10);
act('a','reset');assert.equal(room.games,undefined);assert.equal(room.status,'lobby');
console.log('PASS: all ten formulas, entrant ownership, duplicate entries, admin gates, saved outcomes, timing, normalization, medals, full games and reset.');

const stats=Array(6).fill(0),types={};for(const e of Olympics.events){assert(e.types.length>=1&&e.types.length<=3);e.stats.forEach(i=>stats[i]++);e.types.forEach(t=>types[t]=(types[t]||0)+1)}assert.deepEqual(stats,[16,16,16,16,16,16]);assert.equal(Object.keys(types).length,18);assert(Object.values(types).every(n=>n===6));
for(const e of Olympics.events){const mon={stats:[100,100,100,100,100,100],types:[e.types[0]]},one=Olympics.scorePokemon(mon,e,()=>.5);assert.equal(one.typeBonus,1.12);assert.equal(one.factor,1);assert.equal(one.score,one.base*1.12);mon.types=e.types.slice(0,2);assert.equal(Olympics.scorePokemon(mon,e,()=>.5).typeBonus,1.12);mon.types=['Unknown'];assert.equal(Olympics.scorePokemon(mon,e,()=>.5).typeBonus,1)}
const fs=require('node:fs');const ui=fs.readFileSync('games-ui.js','utf8');assert(!ui.includes('e.formula'));assert(!ui.includes('of 4'));assert(!ui.includes('g.index===3'));console.log('PASS: each stat appears sixteen times, all 18 types appear six times, type bonuses do not stack, UI hides formulas.');

for(const event of Olympics.events){const low=Olympics.performance(event,3),high=Olympics.performance(event,4);assert(Number.isFinite(low.value));assert(low.lower?high.value<low.value:high.value>low.value)}
console.log('PASS: no Pokémon reuse across all ten events; every performance metric preserves winner ordering.');

assert.equal(Olympics.events.length,41);assert(new Set(Olympics.events.map(e=>e.types.length)).size>1);
const observed=new Set();for(let i=0;i<200;i++){const r={players:[{uid:'a',team:Array(12).fill(1)}],turn:12,adminIds:['a']};Olympics.apply(r,'a',{action:'startGames'},pokemon);assert.equal(r.games.order.length,10);assert.equal(new Set(r.games.order).size,10);r.games.order.forEach(id=>observed.add(id))}assert.equal(observed.size,41);
console.log('PASS: 200 independent tournament draws select exactly 10 distinct events from 41; every event is reachable.');

for(const event of Olympics.events){assert(event.stats.length>=1&&event.stats.length<=3);assert(event.duration<=16500)}
const statSets=Olympics.events.map(e=>[...e.stats].sort().join('|')),typeSets=Olympics.events.map(e=>[...e.types].sort().join('|'));
assert.equal(new Set(statSets).size,41);assert.equal(new Set(typeSets).size,41);
assert(!Olympics.events.some(e=>e.id==='obstacle'));
console.log('PASS: all 41 stat sets and boosted-type sets are unique, each uses 1–3 entries, and Obstacle Sprint is removed.');

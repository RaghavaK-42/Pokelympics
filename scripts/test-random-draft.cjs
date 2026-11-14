const assert=require('node:assert/strict'),Logic=require('../room-logic'),pokemon=require('../functions/pokemon.json'),fs=require('node:fs'),vm=require('node:vm');
const context=vm.createContext({});vm.runInContext(fs.readFileSync('pokemon-data.js','utf8')+';globalThis.pokemon=POKEMON',context);
const all=context.pokemon,byId=new Map(pokemon.map(p=>[p.id,p]));
for(const p of all.filter(p=>[...Array.from({length:12},(_,i)=>984+i),1005,1006,1009,1010,1020,1021,1022,1023,...Array.from({length:7},(_,i)=>793+i),803,804,805,806].includes(p.dex)))assert.equal(p.category,'Sub-Legendary',p.name);
for(const p of all.filter(p=>[1007,1008].includes(p.dex)))assert.equal(p.category,'Legendary',p.name);
for(const n of [1,3,12])for(let trial=0;trial<20;trial++){
 const room={players:Array.from({length:n},(_,i)=>({name:'Player '+i,team:[],rerolls:2})),randomDraft:true,fullyEvolvedOnly:trial%2===0};Logic.dealRandomTeams(room);
 assert.equal(room.status,'complete');assert.equal(room.turn,n*12);assert.equal(room.roll,null);
 assert.equal(new Set(room.players.flatMap(p=>p.team)).size,n*12);
 for(const player of room.players){assert.equal(player.team.length,12);const team=player.team.map(id=>byId.get(id));assert(team.every(p=>p.fullyEvolved));for(const [category,count] of Object.entries({'Sub-Legendary':3,Legendary:1,Mythical:1,'':7}))assert.equal(team.filter(p=>p.category===category).length,count)}
}
let room=Logic.joinRoom(null,'a',{name:'Admin',adminCode:'Sethupathi'});room=Logic.joinRoom(room,'b',{name:'B'});const act=(uid,action,extra={})=>Logic.applyAction(room,uid,{action,expectedRevision:room.revision,...extra});assert.throws(()=>act('b','setRules',{randomDraft:true}),/admins/);act('a','setRules',{fullyEvolvedOnly:true});act('a','setRules',{randomDraft:true});assert.equal(room.fullyEvolvedOnly,true);assert.equal(room.randomDraft,true);act('a','setRules',{fullyEvolvedOnly:false});assert.equal(room.randomDraft,true);assert.throws(()=>act('b','start'),/admin/);act('a','start');assert.equal(room.status,'complete');assert.equal(room.turn,24);assert.throws(()=>act('a','start'),/already started/);act('a','startGames');assert.equal(room.status,'games');
console.log('PASS: all Paradox/Ultra Beast tiers, 60 random deals (1/3/12 players), exact category quotas, full evolution, unique shared pool, independent admin settings, skip-to-games flow.');

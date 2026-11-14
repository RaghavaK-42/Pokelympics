const fs=require('fs'),vm=require('vm'),assert=require('assert');
const context=vm.createContext({});vm.runInContext(fs.readFileSync('pokemon-data.js','utf8')+'\n'+fs.readFileSync('app.js','utf8').split('const app=document')[0]+'\nglobalThis.api={Draft,POKEMON};',context);const {Draft,POKEMON}=context.api;
for(const [v,r] of [[1,.5],[19,.5],[20,1],[39,1],[40,1.5],[52,1.5],[53,2],[65,2],[66,2.5],[78,2.5],[79,3],[91,3],[92,3.5],[104,3.5],[105,4],[117,4],[118,4.5],[130,4.5],[131,5],[255,5]])assert.equal(Draft.rating(v),r);
assert(!POKEMON.some(p=>/mega|gigantamax/i.test(p.form)));
const signatures=new Set();
for(const p of POKEMON){const key=JSON.stringify([p.dex,p.stats,[...p.types].sort()]);assert(!signatures.has(key),`Duplicate stats and typing for #${p.dex}`);signatures.add(key)}
assert.equal(POKEMON.filter(p=>p.dex===586).length,1,'Only one Sawsbuck form should remain');
assert.equal(POKEMON.find(p=>p.dex===586).form,'Spring','Keep the first Sawsbuck form in CSV order');
for(const p of POKEMON){assert(fs.existsSync(p.image),p.image);if(/alola/i.test(p.form))assert.equal(p.generation,7);if(/galar|hisui/i.test(p.form))assert.equal(p.generation,8);if(/paldea/i.test(p.form))assert.equal(p.generation,9)}
for(const [category,limit] of Object.entries(Draft.caps)){const entries=POKEMON.filter(p=>p.category===category);assert(!Draft.eligible(entries[limit],{team:entries.slice(0,limit).map(p=>p.id)},new Set()));}
for(const count of [1,3,12]){for(let trial=0;trial<15;trial++){const players=Array.from({length:count},()=>({team:[]})),picked=new Set();for(let turn=0;turn<count*12;turn++){const player=players[turn%count],pools=[...Draft.pools(player,picked).values()];assert(pools.length);const pool=pools[Math.floor(Math.random()*pools.length)],p=pool[Math.floor(Math.random()*pool.length)];assert(!picked.has(p.id));player.team.push(p.id);picked.add(p.id)}for(const p of players){assert.equal(p.team.length,12);for(const [category,limit] of Object.entries(Draft.caps))assert(p.team.filter(id=>Draft.byId.get(id).category===category).length<=limit)}}}
console.log('PASS: rating boundaries, all artwork paths, exclusions, regional generations, category limits, and 45 complete randomized drafts.');

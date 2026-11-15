const assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const hidden={id:25,name:'Secret Opponent Pokémon',image:'assets/pokemon/secret.webp'};let lookups=0;const context=vm.createContext({Draft:{byId:{get(id){lookups++;return hidden}}},escapeHTML:s=>String(s)});vm.runInContext(fs.readFileSync('games-ui.js','utf8')+'\nglobalThis.tile=entrantTile',context);const tile=context.tile;
const opponent={uid:'opponent',name:'Player 2'},entries={opponent:25};
for(const viewer of ['player1','admin','next-local-player',undefined]){const html=tile(opponent,entries,viewer);assert(html.includes('Locked in'));assert(!html.includes(hidden.name));assert(!html.includes(hidden.image));assert(!html.includes('<img'));assert(!html.includes('25'))}
assert.equal(lookups,0,'Do not resolve private opponent artwork at all');
const own=tile(opponent,entries,'opponent');assert(own.includes(hidden.name));assert(own.includes(hidden.image));assert.equal(lookups,1);
const waiting=tile(opponent,{},'player1');assert(waiting.includes('Choosing'));assert(!waiting.includes('Locked in'));assert(!waiting.includes('<img'));
console.log('PASS: opponent selections concealed for players/admins/local handoffs; no identity leaks in URLs/alt/markup; own entry visible; readiness retained.');

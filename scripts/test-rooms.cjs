const assert=require('node:assert/strict');
const {joinRoom,applyAction,pools}=require('../room-logic');
assert.throws(()=>joinRoom(null,'a',{adminCode:'wrong',name:'A'}),/Incorrect/);
assert.throws(()=>joinRoom(null,'a',{name:'A'}),/admin/);
let room=joinRoom(null,'a',{adminCode:'Sethupathi',name:'Admin'});
room=joinRoom(room,'b',{name:'Player B'});room=joinRoom(room,'c',{name:'Player C'});
assert.equal(room.players.length,3);room=joinRoom(room,'b',{name:'Duplicate'});assert.equal(room.players.length,3);
const act=(uid,action,extra={})=>applyAction(room,uid,{action,expectedRevision:room.revision,...extra});
assert.throws(()=>act('b','start'),/admin/);act('a','start');assert(room.roll);
assert.throws(()=>act('b','pick',{pokemonId:pools(room).get(room.roll)[0]}),/turn/);
assert.throws(()=>act('a','pick',{pokemonId:-1}),/available/);
assert.throws(()=>applyAction(room,'a',{action:'reroll',expectedRevision:room.revision-1}),/changed/);
act('a','reroll');act('a','reroll');assert.equal(room.players[0].rerolls,0);assert.throws(()=>act('a','reroll'),/No rerolls/);
assert.throws(()=>joinRoom(room,'d',{name:'Late'}),/already started/);
while(room.status==='draft'){const player=room.players[room.turn%3];act(player.uid,'pick',{pokemonId:pools(room).get(room.roll)[0]})}
assert.equal(room.status,'complete');assert(room.players.every(p=>p.team.length===12));assert.equal(new Set(room.players.flatMap(p=>p.team)).size,36);
assert.throws(()=>act('b','reset'),/admin/);act('a','reset');assert.equal(room.status,'lobby');assert.equal(room.turn,0);assert(room.players.every(p=>p.team.length===0&&p.rerolls===2));
const normalized=require('../room-logic').normalizeRoom({players:[{uid:'a',name:'A',rerolls:2}],memberIds:['a'],revision:1,status:'lobby',turn:0});assert.deepEqual(normalized.players[0].team,[]);assert.deepEqual(normalized.adminIds,[]);assert.equal(normalized.roll,null);
console.log('PASS: admin/join permissions, reconnect identity, turn ownership, stale revisions, legal picks, reroll limits, full online draft, admin reset.');

async function testTransactionCache(){
 const {transactRoom}=require('../room-logic');
 const existing=joinRoom(null,'host',{adminCode:'Sethupathi',name:'Host'});
 const original=JSON.stringify(existing);
 const retry=async(ref,update,options)=>{
  assert.equal(options.applyLocally,false);
  assert.equal(update(null),null,'A cold-cache null must reach the server, not abort');
  const joined=update(existing);
  assert.equal(joined.players.length,2);
  assert.equal(joined.players[1].uid,'guest');
  assert.equal(JSON.stringify(existing),original,'Do not mutate the snapshot');
  return {committed:true};
 };
 await transactRoom(retry,{},'guest',{action:'join',name:'Guest'});
 await assert.rejects(transactRoom(async(ref,update)=>{assert.equal(update(null),null);return {committed:true}}, {},'guest',{action:'join',name:'Guest'}),/admin must create/);
 await assert.rejects(transactRoom(async(ref,update)=>{assert.equal(update(existing),existing);assert.equal(JSON.stringify(existing),original);return {committed:true}}, {},'guest',{action:'join',name:'Guest',adminCode:'wrong'}),/Incorrect/);
 const draft=JSON.parse(JSON.stringify(existing));applyAction(draft,'host',{action:'start',expectedRevision:draft.revision});
 await transactRoom(async(ref,update)=>{assert.equal(update(null),null);const next=update(draft);assert.equal(next.status,'lobby');return {committed:true}}, {},'host',{action:'reset',expectedRevision:draft.revision});
 console.log('PASS: cold-cache join and action retries, truly missing room, rejected-action preservation.');
}
testTransactionCache().catch(error=>{console.error(error);process.exitCode=1});

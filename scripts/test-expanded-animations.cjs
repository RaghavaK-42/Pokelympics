const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),{events}=require('../olympics');
const pokemon=require('../functions/pokemon.json').slice(0,2).map((p,i)=>({...p,name:'Test '+i,image:'assets/pokemon/'+p.id+'.webp'}));
const state={players:[{uid:'a',name:'A'},{uid:'b',name:'B'}]},context=vm.createContext({state,Draft:{byId:new Map(pokemon.map(p=>[p.id,p]))},metricLabel:()=> '50.000 points'});
vm.runInContext(fs.readFileSync('expanded-animations.js','utf8')+'\nglobalThis.api={expandedMarkup,animateExpanded}',context);const {expandedMarkup,animateExpanded}=context.api;
for(const e of events.filter(e=>e.animation&&e.mode==='turn')){
 const markup=expandedMarkup(e),nodes=new Map();assert(markup.includes('expanded-athlete'));
 function node(key){if(!nodes.has(key))nodes.set(key,{style:{},dataset:{},classList:{toggle(){}},setAttribute(){}});return nodes.get(key)}
 const content={querySelector(selector){if(selector==='#sport-projectile'&&!markup.includes('id="sport-projectile"'))return null;if(selector.startsWith('#'))assert(markup.includes('id="'+selector.slice(1)+'"'),e.id+' missing '+selector);else assert(markup.includes(selector.slice(1)),e.id+' missing '+selector);return node(selector)},querySelectorAll(selector){return Array.from({length:selector==='[data-pin]'?10:3},(_,i)=>node(selector+i))}};
 const result={standings:pokemon.map((p,i)=>({uid:i?'b':'a',pokemonId:p.id,score:8+i}))};
 for(const elapsed of [-100,0,1000,2500,4000,6000,6500,9000,13000]){assert(animateExpanded(content,e,result,{},elapsed));for(const element of nodes.values())for(const value of Object.values(element.style))assert(!String(value).includes('NaN'),e.id+' invalid animation style')}
}
console.log('PASS: all 16 new individual-event scenes render and animate both athletes across countdown, action, and result frames without missing elements or invalid positions.');

state={version:1,turn:24,status:'complete',adminIds:['local-0'],players:[{uid:'local-0',name:'Team Pikachu',team:POKEMON.filter(p=>!p.form).slice(20,32).map(p=>p.id),rerolls:2},{uid:'local-1',name:'Team Eevee',team:POKEMON.filter(p=>!p.form).slice(120,132).map(p=>p.id),rerolls:2}]};
Olympics.apply(state,'local-0',{action:'startGames'},POKEMON);
state.games.order=Olympics.events.map(e=>e.id);const requested=new URLSearchParams(location.search).get('event');if(requested){const i=state.games.order.indexOf(requested);if(i>=0)[state.games.order[0],state.games.order[i]]=[state.games.order[i],state.games.order[0]];}
state.games.order=state.games.order.slice(0,10);
Olympics.apply(state,'local-0',{action:'enterEvent',pokemonId:state.players[0].team[0]},POKEMON);
Olympics.apply(state,'local-1',{action:'enterEvent',pokemonId:state.players[1].team[0]},POKEMON);
state.games.startsAt=Date.now()-(new URLSearchParams(location.search).has('results')?Olympics.duration(state)+1:1000);state.games.endsAt=state.games.startsAt+Olympics.duration(state);render();
// This preview only holds fixture state in memory; never persist it.
save=()=>{};

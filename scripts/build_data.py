import csv,json,pathlib
root=pathlib.Path(__file__).resolve().parent.parent
fields=['Health Stat','Attack Stat','Defense Stat','Special Attack Stat','Special Defense Stat','Speed Stat']
rows=[{k:('' if v=='NULL' else v.strip('"')) for k,v in r.items()} for r in csv.DictReader((root/'PokemonDB.csv').open(encoding='utf-8-sig'))]
# Ultra Beasts use their National Dex numbers; all Paradox entries are identified
# by the CSV classification, except Legendary Koraidon and Miraidon.
ultra_beasts=set(range(793,800))|set(range(803,807))
parents={r['Pre-Evolution Pokemon Id'] for r in rows if r['Pre-Evolution Pokemon Id']}
def fully_evolved(r):
 if r['Pokemon Id'] in parents: return False
 # Regional evolution lines are distinct; cosmetic/battle forms inherit the base line.
 if not any(region in r['Alternate Form Name'].lower() for region in ['alola','galar','hisui','paldea']):
  original=r['Original Pokemon ID']
  if original and original in parents: return False
 return True
images=list((root/'Sugimori Pokémon Gen1-9 DLC3').glob('*.png'))
out=[]; missing=[]; image_sources={}
seen=set()
for r in rows:
 form=r['Alternate Form Name']; dex=int(r['Pokedex Number'])
 if 'mega' in form.lower() or 'gigantamax' in form.lower(): continue
 # Keep the first eligible CSV entry for each species/stat/type combination.
 signature=(dex,tuple(int(r[k]) for k in fields),tuple(sorted(t for t in [r['Primary Type'],r['Secondary Type']] if t)))
 if signature in seen: continue
 seen.add(signature)
 gen=next((i+1 for i,end in enumerate([151,251,386,493,649,721,809,905,1025]) if dex<=end),9)
 if 'alola' in form.lower(): gen=7
 if any(x in form.lower() for x in ['galar','hisui']): gen=8
 if 'paldea' in form.lower(): gen=9
 candidates=[p for p in images if p.name.startswith(f'{dex:04d} ')]
 exact=[p for p in candidates if p.stem==f'{dex:04d} {r["Pokemon Name"]}'+(' '+form if form else '')]
 if not exact and form: exact=[p for p in candidates if p.stem.endswith(' '+form)]
 if not exact: exact=[p for p in candidates if p.stem==f'{dex:04d} {r["Pokemon Name"]}']
 if not exact and candidates: exact=[min(candidates,key=lambda p:len(p.stem))]
 path=exact[0].relative_to(root).as_posix() if exact else ''
 if not path: missing.append((dex,r['Pokemon Name'],form))
 image_sources[int(r['Pokemon Id'])]=path
 optimized=root/'assets'/'pokemon'/f"{r['Pokemon Id']}.webp"
 if optimized.is_file(): path=optimized.relative_to(root).as_posix()
 out.append(dict(id=int(r['Pokemon Id']),dex=dex,name=r['Pokemon Name'],form=form,generation=gen,category=('Sub-Legendary' if ('Paradox' in r['Classification'] and dex not in {1007,1008}) or dex in ultra_beasts else r['Legendary Type']),types=[r[k] for k in ['Primary Type','Secondary Type'] if r[k]],stats=[int(r[k]) for k in fields],image=path,fullyEvolved=fully_evolved(r)))
(root/'pokemon-data.js').write_text('/* Generated from PokemonDB.csv by scripts/build_data.py. */\nconst POKEMON = '+json.dumps(out,ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf-8')
print(f'{len(out)} eligible entries. Missing images: {missing}')

(root/'functions'/'pokemon.json').write_text(json.dumps([{k:p[k] for k in ['id','generation','category','types','stats','fullyEvolved']} for p in out],separators=(',',':')),encoding='utf-8')

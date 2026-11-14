"""Assign distinct stat/type sets with exact pool-wide appearance counts."""
import itertools,json,math,pathlib,random,subprocess
root=pathlib.Path(__file__).resolve().parent.parent
rows=json.loads(subprocess.check_output(['node','-e',"process.stdout.write(JSON.stringify(require('./olympics').events))"],cwd=root,text=True))
def solve(field,n,target,seed):
 rng=random.Random(seed);desired=[frozenset(e[field]) for e in rows]
 universe=list(range(n)) if field=='stats' else ['Normal','Fire','Water','Electric','Grass','Ice','Fighting','Poison','Ground','Flying','Psychic','Bug','Rock','Ghost','Dragon','Dark','Steel','Fairy']
 def semantic(i,s):
  original=desired[i];first=rows[i][field][0]
  return len(original-s)*6+len(s-original)*2+(8 if first not in s else 0)
 choices=[frozenset(c) for k in range(1,5) for c in itertools.combinations(universe,k)]
 assigned=[];used=set()
 for i,s in enumerate(desired):
  pick=min((x for x in choices if x not in used),key=lambda x:semantic(i,x))
  assigned.append(pick);used.add(pick)
 counts={v:sum(v in s for s in assigned) for v in universe}
 penalty=lambda c:sum((v-target)**2 for v in c.values())*180
 cost=sum(semantic(i,s) for i,s in enumerate(assigned))+penalty(counts)
 best=None
 for step in range(450000):
  i=rng.randrange(len(rows));old=assigned[i];j=None
  if rng.random()<.3:
   j=rng.randrange(len(rows))
   if j==i:continue
   oldj=assigned[j];a=rng.choice(tuple(old));b=rng.choice(tuple(oldj))
   if a==b or b in old or a in oldj:continue
   new=(old-{a})|{b};newj=(oldj-{b})|{a}
   if new==newj or new in used-{old,oldj} or newj in used-{old,oldj}:continue
   nextcounts=counts;delta=semantic(i,new)+semantic(j,newj)-semantic(i,old)-semantic(j,oldj)
  else:
   new=set(old);mode=rng.random()
   if mode<.76:
    new.remove(rng.choice(tuple(old)));new.add(rng.choice(universe))
   elif mode<.88 and len(new)<4:new.add(rng.choice(universe))
   elif len(new)>1:new.remove(rng.choice(tuple(old)))
   new=frozenset(new)
   if new==old or new in used:continue
   nextcounts=counts.copy()
   for v in old-new:nextcounts[v]-=1
   for v in new-old:nextcounts[v]+=1
   delta=semantic(i,new)-semantic(i,old)+penalty(nextcounts)-penalty(counts)
  temperature=35*(1-step/450000)**3+.12
  if delta<=0 or rng.random()<math.exp(-delta/temperature):
   used.remove(old)
   if j is not None:used.remove(oldj)
   assigned[i]=new;used.add(new)
   if j is not None:assigned[j]=newj;used.add(newj)
   counts=nextcounts;cost+=delta
   if all(v==target for v in counts.values()) and (best is None or cost<best[0]):best=(cost,list(assigned))
 if best is None:raise RuntimeError('Could not reach exact balance for '+field)
 for event,values in zip(rows,best[1]):event[field]=[v for v in universe if v in values]
 print(field,'unique sets',len(set(best[1])),'counts', {v:sum(v in s for s in best[1]) for v in universe},'semantic cost',best[0])
solve('stats',6,20,42)
solve('types',18,7,43)
source=(root/'olympics.js').read_text(encoding='utf-8');start=source.index('const events=');end=source.index('\n];',start)+3
(root/'olympics.js').write_text(source[:start]+'const events='+json.dumps(rows,ensure_ascii=False,indent=1)+';'+source[end:],encoding='utf-8')

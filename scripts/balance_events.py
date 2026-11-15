"""41 unique event profiles, balanced stats/types, at most three per profile."""
import itertools,json,math,pathlib,random,subprocess
root=pathlib.Path(__file__).resolve().parent.parent
rows=json.loads(subprocess.check_output(['node','-e',"process.stdout.write(JSON.stringify(require('./olympics').events))"],cwd=root,text=True))
rows=[e for e in rows if e['id']!='obstacle']
assert len(rows)==41

def assignment(cost):
 n=len(cost);u=[0]*(n+1);v=[0]*(n+1);p=[0]*(n+1);way=[0]*(n+1)
 for i in range(1,n+1):
  p[0]=i;j0=0;minimum=[10**9]*(n+1);used=[False]*(n+1)
  while True:
   used[j0]=True;i0=p[j0];delta=10**9;j1=0
   for j in range(1,n+1):
    if not used[j]:
     cur=cost[i0-1][j-1]-u[i0]-v[j]
     if cur<minimum[j]:minimum[j]=cur;way[j]=j0
     if minimum[j]<delta:delta=minimum[j];j1=j
   for j in range(n+1):
    if used[j]:u[p[j]]+=delta;v[j]-=delta
    else:minimum[j]-=delta
   j0=j1
   if p[j0]==0:break
  while j0:
   j1=way[j0];p[j0]=p[j1];j0=j1
 result=[None]*n
 for j in range(1,n+1):result[p[j]-1]=j-1
 return result
choices=[frozenset(c) for k in range(1,4) for c in itertools.combinations(range(6),k)]
cost=[]
for e in rows:
 desired=set(e['stats']);primary=e['stats'][0]
 cost.append([len(desired-s)*6+len(s-desired)*3+(12 if primary not in s else 0) for s in choices])
for e,j in zip(rows,assignment(cost)):e['stats']=sorted(choices[j])

universe=['Normal','Fire','Water','Electric','Grass','Ice','Fighting','Poison','Ground','Flying','Psychic','Bug','Rock','Ghost','Dragon','Dark','Steel','Fairy']
rng=random.Random(41);desired=[frozenset(e['types']) for e in rows]
def semantic(i,s):return len(desired[i]-s)*6+len(s-desired[i])*2+(8 if rows[i]['types'][0] not in s else 0)
choices=[frozenset(c) for k in range(1,4) for c in itertools.combinations(universe,k)]
assigned=[];used=set()
for i in range(len(rows)):
 choice=min((s for s in choices if s not in used),key=lambda s:semantic(i,s));assigned.append(choice);used.add(choice)
counts={v:sum(v in s for s in assigned) for v in universe}
penalty=lambda c:sum((v-6)**2 for v in c.values())*180
cost=sum(semantic(i,s) for i,s in enumerate(assigned))+penalty(counts);best=None
for step in range(450000):
 i=rng.randrange(len(rows));old=assigned[i];j=None
 if rng.random()<.3:
  j=rng.randrange(len(rows))
  if j==i:continue
  oldj=assigned[j];a=rng.choice(tuple(sorted(old)));b=rng.choice(tuple(sorted(oldj)))
  if a==b or b in old or a in oldj:continue
  new=(old-{a})|{b};newj=(oldj-{b})|{a}
  if new==newj or new in used-{old,oldj} or newj in used-{old,oldj}:continue
  nextcounts=counts;delta=semantic(i,new)+semantic(j,newj)-semantic(i,old)-semantic(j,oldj)
 else:
  new=set(old);mode=rng.random()
  if mode<.76:new.remove(rng.choice(tuple(sorted(old))));new.add(rng.choice(universe))
  elif mode<.88 and len(new)<3:new.add(rng.choice(universe))
  elif len(new)>1:new.remove(rng.choice(tuple(sorted(old))))
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
  if all(v==6 for v in counts.values()) and (best is None or cost<best[0]):best=(cost,list(assigned))
if best is None:raise RuntimeError('No exactly balanced type assignment found; files unchanged.')
for e,types in zip(rows,best[1]):e['types']=[v for v in universe if v in types]
assert [sum(i in e['stats'] for e in rows) for i in range(6)]==[16]*6
assert all(sum(t in e['types'] for e in rows)==6 for t in universe)
source=(root/'olympics.js').read_text(encoding='utf-8');a=source.index('const events=');b=source.index('\n];',a)+3
(root/'olympics.js').write_text(source[:a]+'const events='+json.dumps(rows,indent=1)+';'+source[b:],encoding='utf-8')
print('41 events: unique stat/type sets; 1–3 entries per set; each stat 16 times; each type 6 times.')

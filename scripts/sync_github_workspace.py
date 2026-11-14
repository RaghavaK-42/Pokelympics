from pathlib import Path
import hashlib, shutil
source=Path(r'C:\Users\Ragha\OneDrive\Desktop\Scrap Code\Pokelympics').resolve()
target=Path(r'C:\Users\Ragha\OneDrive\Desktop\Pokelympics').resolve()
assert source!=target and (target/'.git').is_dir()
excluded={'.git','node_modules','.firebase','github-pages-upload','Sugimori Pokémon Gen1-9 DLC3','__pycache__'}
files=[p for p in source.rglob('*') if p.is_file() and not any(part in excluded for part in p.relative_to(source).parts) and p.name!='github-pages-upload.zip']
digest=lambda p:hashlib.sha256(p.read_bytes()).digest()
copied=0
for original in files:
 relative=original.relative_to(source)
 destination=target/relative
 destination.parent.mkdir(parents=True,exist_ok=True)
 if not destination.is_file() or digest(original)!=digest(destination):
  shutil.copy2(original,destination)
  copied+=1
 assert digest(original)==digest(destination),str(relative)
(target/'.nojekyll').write_text('',encoding='utf-8')
assert (target/'.git').is_dir()
print(f'Copied {copied} changed/missing files; verified all {len(files)} source, artwork, script, and documentation files. Added .nojekyll. Git metadata preserved.')

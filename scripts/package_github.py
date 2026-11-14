"""Build a static GitHub Pages folder/ZIP with all required artwork."""
import pathlib, shutil, zipfile, json
root=pathlib.Path(__file__).resolve().parent.parent
web_files=['index.html','style.css','app.js','pokemon-data.js','olympics.js','room-logic.js','event-animations.js','expanded-animations.js','games-ui.js','multiplayer.js']
text=(root/'pokemon-data.js').read_text(encoding='utf-8')
pokemon=json.loads(text.split('const POKEMON = ',1)[1].rstrip(';\n'))
assets=sorted({p['image'] for p in pokemon})
if any(not path.startswith('assets/pokemon/') or not (root/path).is_file() for path in assets):
 raise SystemExit('Run python scripts/build_web_assets.py to finish generating portable artwork first.')
output=root/'github-pages-upload'
output.mkdir(exist_ok=True)
for name in web_files+assets:
 target=output/name
 target.parent.mkdir(parents=True,exist_ok=True)
 source=root/name
 if not target.exists() or source.stat().st_size!=target.stat().st_size or source.stat().st_mtime_ns!=target.stat().st_mtime_ns:
  shutil.copy2(source,target)
(output/'.nojekyll').write_text('',encoding='utf-8')
with zipfile.ZipFile(root/'github-pages-upload.zip','w',zipfile.ZIP_DEFLATED) as archive:
 for name in web_files+assets+['.nojekyll']:
  archive.write(output/name,name)
print(f'GitHub Pages package: {len(assets)} images; {(root/"github-pages-upload.zip").stat().st_size/1024/1024:.1f} MiB ZIP.')

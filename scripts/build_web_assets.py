"""Generate lightweight, transparent WebP artwork with portable ASCII paths."""
import concurrent.futures, pathlib, runpy
from PIL import Image, ImageOps
root=pathlib.Path(__file__).resolve().parent.parent
namespace=runpy.run_path(str(root/'scripts'/'build_data.py'))
output=root/'assets'/'pokemon'
output.mkdir(parents=True,exist_ok=True)
def convert(item):
 pokemon_id,source=item
 target=output/f'{pokemon_id}.webp'
 with Image.open(root/source) as image:
  image=ImageOps.exif_transpose(image).convert('RGBA')
  image.thumbnail((384,384),Image.Resampling.LANCZOS)
  image.save(target,'WEBP',quality=84,method=2)
 return target.stat().st_size
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
 sizes=list(pool.map(convert,namespace['image_sources'].items()))
runpy.run_path(str(root/'scripts'/'build_data.py'))
print(f'Optimized {len(sizes)} images: {sum(sizes)/1024/1024:.1f} MiB total.')

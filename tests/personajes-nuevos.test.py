from pathlib import Path
from PIL import Image
import base64, xml.etree.ElementTree as ET
ROOT=Path(__file__).resolve().parents[1]/'assets'/'personajes'
for ident in ('andres','coki'):
 ref=ROOT/'referencias'/f'{ident}.png'; svg=ET.parse(ROOT/f'{ident}.svg').getroot(); atlas=Image.open(ROOT/f'{ident}-atlas.png').convert('RGBA')
 assert ref.exists() and ref.stat().st_size>100000
 assert svg.attrib['viewBox']=='0 0 192 320'
 embedded=svg.find('{http://www.w3.org/2000/svg}image').attrib['href'].split(',',1)[1]
 sprite=Image.open(__import__('io').BytesIO(base64.b64decode(embedded))).convert('RGBA')
 assert sprite.size==(192,320) and sprite.getchannel('A').getbbox()
 assert atlas.size==(768,1280)
 for row in range(4):
  for col in range(4):
   frame=atlas.crop((col*192,row*320,(col+1)*192,(row+1)*320))
   assert frame.getchannel('A').getbbox()
 print(f'PASS {ident}: referencia, SVG y 16 poses cargadas')

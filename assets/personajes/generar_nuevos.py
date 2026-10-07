from pathlib import Path
from PIL import Image, ImageDraw, ImageChops, ImageFilter
from io import BytesIO
import base64

ROOT=Path(__file__).resolve().parent
refs=ROOT/'../../PERSONAJES'
# Manual silhouettes follow the visible contour in each supplied full-body photo.
FIGURES={
 'andres':('ANDRES.png',[(97,22),(157,22),(176,47),(177,85),(166,113),(184,132),(205,200),(216,300),(207,450),(203,600),(215,780),(213,956),(176,960),(159,805),(140,760),(121,810),(93,960),(58,950),(45,770),(45,650),(52,520),(39,420),(25,300),(33,205),(58,160),(75,120)]),
 'coki':('COKI.png',[(165,10),(224,8),(252,33),(260,80),(252,110),(277,135),(299,200),(309,280),(300,320),(288,450),(277,600),(287,760),(305,990),(270,1000),(239,790),(215,998),(160,1000),(147,760),(118,580),(104,440),(72,280),(73,200),(112,140),(144,95)])
}
SIZE=(192,320)
def make_mask(size,points,ident):
 m=Image.new('L',size,0);ImageDraw.Draw(m).polygon(points,fill=255)
 # Trim the hand-drawn boundary by one source pixel to avoid background halos.
 m=m.filter(ImageFilter.MinFilter(5))
 draw=ImageDraw.Draw(m)
 if ident=='andres': draw.rectangle((190,150,255,967),fill=0)
 if ident=='coki': draw.rectangle((276,155,370,1005),fill=0)
 return m
def frame(source,mask):
 bbox=mask.getbbox(); cut=source.crop(bbox); cut.putalpha(mask.crop(bbox))
 w,h=cut.size; ratio=min(184/w,304/h); fit=(round(w*ratio),round(h*ratio)); base=Image.new('RGBA',SIZE); base.paste(cut.resize(fit,Image.Resampling.LANCZOS),((192-fit[0])//2,316-fit[1]))
 # Pixel-art pass: reduce to a small logical grid and enlarge without smoothing.
 small=base.resize((96,160),Image.Resampling.LANCZOS).resize(SIZE,Image.Resampling.NEAREST)
 return small,bbox,fit,((192-fit[0])//2,316-fit[1])
def png_bytes(im):
 out=BytesIO();im.save(out,format='PNG',optimize=True);return out.getvalue()
for ident,(filename,points) in FIGURES.items():
 source=Image.open(refs/filename).convert('RGBA');mask=make_mask(source.size,points,ident);base,bbox,fit,offset=frame(source,mask)
 (ROOT/'referencias').mkdir(exist_ok=True)
 source.save(ROOT/'referencias'/f'{ident}.png',optimize=True)
 encoded=base64.b64encode(png_bytes(base)).decode('ascii')
 (ROOT/f'{ident}.svg').write_text(f'<svg xmlns="http://www.w3.org/2000/svg" width="192" height="320" viewBox="0 0 192 320" preserveAspectRatio="xMidYMax meet"><image width="192" height="320" href="data:image/png;base64,{encoded}"/></svg>',encoding='utf8')
 atlas=Image.new('RGBA',(768,1280)); phases=[0,1,0,-1]
 for row,state in enumerate(['idle','walk','playing','victory']):
  for col in range(4):
   pose=base.copy()
   if state=='walk' and col%2:
    pose=Image.new('RGBA',SIZE);pose.paste(base,(1 if col==1 else -1,2 if col==1 else -2),base)
   elif state in ('playing','victory'):
    pose=Image.new('RGBA',SIZE);pose.paste(base,(0,phases[col]*(1 if state=='playing' else 2)),base)
   atlas.paste(pose,(col*192,row*320))
 atlas.save(ROOT/f'{ident}-atlas.png',optimize=True)
 print(ident,source.size,bbox,fit,offset)

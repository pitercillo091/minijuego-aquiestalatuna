"""Pack artist-generated Andrés/Coki PNGs into the existing animation format.

This script never converts photos into sprites or draws substitute characters.
Canonical artwork lives in ilustraciones/<id>-base.png. Photos are references
only. The existing roster's frame, torso and gait helpers remain unchanged.
"""
from pathlib import Path
from io import BytesIO
import base64
import hashlib
import json
import math
import generar as original
from PIL import Image, ImageDraw, ImageChops

ROOT = Path(__file__).resolve().parent
SIZE = (192, 320)
ROWS = ['idle', 'walk', 'playing', 'victory']


def canonical(path):
    artwork = Image.open(path).convert('RGBA')
    # Discard disconnected transparent-margin specks, retaining original RGB
    # values of the illustrated figure, including shaded edge pixels.
    mask = original.connected(artwork.getchannel('A').point(lambda a: 255 if a > 16 else 0))
    artwork.putalpha(ImageChops.multiply(artwork.getchannel('A'), mask))
    crop = artwork.getchannel('A').getbbox()
    if not crop:
        raise ValueError(f'Ilustración vacía: {path}')
    cut = artwork.crop(crop)
    fit = (round(cut.width * 304 / cut.height), 304)
    if fit[0] > 184:
        raise ValueError('La ilustración es demasiado ancha para la celda: revisar la pose artística.')
    cut = cut.resize(fit, Image.Resampling.NEAREST)
    frame = Image.new('RGBA', SIZE)
    offset = ((192-fit[0])//2, 12)
    frame.alpha_composite(cut, offset)
    return frame, crop, fit, offset


def gait_masks(base):
    masks = []
    for rect in ((0, 213, 95, 319), (96, 213, 191, 319)):
        mask = Image.new('L', SIZE)
        ImageDraw.Draw(mask).rectangle(rect, fill=255)
        masks.append(ImageChops.multiply(mask, base.getchannel('A').point(lambda a: 255 if a else 0)))
    return masks


def tambourine(base, phase):
    """Move the striking forearm/hand and membrane together with soft joints.

    Inverse sampling is continuous at the region boundary, so there are no
    erased patches or pasted hand silhouettes. Face and feet stay immutable.
    """
    out = original.torso(base, phase)
    if not phase:
        return out
    before = out.copy()
    src, dest = before.load(), out.load()
    for y in range(95, 150):
        vertical = math.sin(math.pi*(y-95)/55)**2
        for x in range(54, 136):
            horizontal = math.sin(math.pi*(x-54)/82)**2
            dy = round(phase * 3 * vertical * horizontal)
            dest[x,y] = src[x,y-dy]
    return out


def png_bytes(im):
    out = BytesIO()
    im.save(out, format='PNG', optimize=True)
    return out.getvalue()


def build():
    manifest = []
    for ident in ('andres', 'coki'):
        source = ROOT/'ilustraciones'/f'{ident}-base.png'
        base, crop, fit, offset = canonical(source)
        (ROOT/'ilustraciones'/f'{ident}-celda.png').write_bytes(png_bytes(base))
        embedded = base64.b64encode(png_bytes(base)).decode('ascii')
        # SVG is only the backwards-compatible wrapper of the illustrated PNG;
        # it performs no vectorization, photo conversion or pixel filtering.
        svg = (f'<svg xmlns="http://www.w3.org/2000/svg" width="192" height="320" '
               f'viewBox="0 0 192 320" preserveAspectRatio="xMidYMax meet">'
               f'<image width="192" height="320" href="data:image/png;base64,{embedded}"/></svg>')
        (ROOT/f'{ident}.svg').write_text(svg, encoding='utf-8')
        atlas = Image.new('RGBA', (768,1280))
        for row, state in enumerate(ROWS):
            for frame, phase in enumerate((0,1,0,-1)):
                if state == 'walk':
                    pose = original.walk(base, gait_masks(base), frame)
                elif state == 'playing':
                    pose = tambourine(base, phase)
                else:
                    pose = original.torso(base, phase*.5)
                atlas.paste(pose, (frame*192,row*320))
        atlas.save(ROOT/f'{ident}-atlas.png', optimize=True)
        reference = ROOT/'referencias'/f'{ident}.png'
        manifest.append(dict(id=ident, reference=f'referencias/{ident}.png',
            referenceSha256=hashlib.sha256(reference.read_bytes()).hexdigest(),
            artwork=f'ilustraciones/{ident}-base.png',
            artworkSha256=hashlib.sha256(source.read_bytes()).hexdigest(),
            rendering='Ilustración artística generada con ImageGen integrado; fotos solo como referencia de identidad.',
            frame=list(SIZE), rows=ROWS, crop=list(crop), fit=list(fit), offset=list(offset),
            immutableHead=[0,0,192,96], ground=315, traits=['pandereta','traje negro'],
            distinguishingTraits=(['pelo oscuro','barba poblada','rostro ancho'] if ident=='andres'
                                  else ['pelo corto','gafas de sol','sonrisa','beca roja'])))
        print(f'{ident}: ilustración integrada, 16 poses, pies en y315.')
    (ROOT/'nuevos-referencias.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
    comparison=Image.new('RGBA',(1680,380),(28,30,42,255))
    draw=ImageDraw.Draw(comparison)
    for i, ident in enumerate(['pandereta','guitarra','bandurria','guitarra-gafas','laud','andres','coki']):
        base=Image.open(ROOT/f'{ident}-atlas.png').convert('RGBA').crop((0,0,192,320))
        comparison.alpha_composite(base,(i*240+24,25))
        draw.text((i*240+24,355),ident,fill='#f4deb9')
    comparison.save(ROOT/'comparacion-reparto.png',optimize=True)


if __name__ == '__main__':
    build()

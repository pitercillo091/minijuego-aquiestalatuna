"""Pack LEGÍA's artist-generated PNG with the approved roster animation helpers.

Never redraws or repacks the other seven sprites. Photos are identity references.
"""
from pathlib import Path
import base64
import hashlib
import json
import math
from PIL import Image, ImageDraw
import generar_nuevos as packing

ROOT = Path(__file__).resolve().parent


def strum(base, phase):
    pose = packing.original.torso(base, phase)
    if not phase:
        return pose
    source = pose.copy().load()
    target = pose.load()
    # Small right-hand stroke across the soundhole; no head/feet displacement.
    for y in range(98, 151):
        for x in range(21, 98):
            weight = math.sin(math.pi * (y - 98) / 53) ** 2 * math.sin(math.pi * (x - 21) / 77) ** 2
            target[x, y] = source[x, y - round(phase * 3 * weight)]
    return pose


def build():
    artwork = ROOT / 'ilustraciones/legia-base.png'
    base, crop, fit, offset = packing.canonical(artwork)
    raw = packing.png_bytes(base)
    (ROOT / 'ilustraciones/legia-celda.png').write_bytes(raw)
    encoded = base64.b64encode(raw).decode('ascii')
    (ROOT / 'legia.svg').write_text(
        '<svg xmlns="http://www.w3.org/2000/svg" width="192" height="320" '
        'viewBox="0 0 192 320" preserveAspectRatio="xMidYMax meet">'
        f'<image width="192" height="320" href="data:image/png;base64,{encoded}"/></svg>', encoding='utf-8')
    atlas = Image.new('RGBA', (768, 1280))
    for row, state in enumerate(packing.ROWS):
        for column, phase in enumerate((0, 1, 0, -1)):
            if state == 'walk':
                pose = packing.original.walk(base, packing.gait_masks(base), column)
            elif state == 'playing':
                pose = strum(base, phase)
            else:
                pose = packing.original.torso(base, phase * .5)
            atlas.paste(pose, (column * 192, row * 320))
    atlas.save(ROOT / 'legia-atlas.png', optimize=True)
    manifest = dict(id='legia', name='LEGÍA', instrument='guitarra', instrumentConfirmedBy='Usuario, 8 octubre 2026',
                    reference='referencias/legia.png', artwork='ilustraciones/legia-base.png',
                    referenceSha256=hashlib.sha256((ROOT / 'referencias/legia.png').read_bytes()).hexdigest(),
                    artworkSha256=hashlib.sha256(artwork.read_bytes()).hexdigest(),
                    frame=[192, 320], atlas=[768, 1280], rows=packing.ROWS,
                    immutableHead=[0, 0, 192, 96], ground=315, crop=list(crop), fit=list(fit), offset=list(offset),
                    method='ImageGen integrado: reinterpretación artística; mismo empaquetado y animación del elenco aprobado.',
                    traits=['pelo corto oscuro con entradas', 'rostro ancho', 'barba muy corta', 'beca roja',
                            'capa negra con forro rojo', 'guitarra clásica'])
    (ROOT / 'legia-referencias.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding='utf-8')
    print('LEGÍA: ilustración transparente, 16 poses, misma cara y anclaje y315.')


if __name__ == '__main__':
    build()

"""Pack the artist-drawn CAÑERO, reusing the approved roster's frame and gait.

The seated photo is an identity reference only. The standing illustration is
generated with the integrated ImageGen tool; this never pixelizes a photograph.
"""
import base64
import hashlib
import json
import math
from PIL import Image
import generar_nuevos as packing

ROOT = packing.ROOT


def ease(value):
    value = max(0, min(1, value))
    return value * value * (3 - 2 * value)


def accompany(base, phase):
    """A modest toast and free-hand sway. Bottle, grip and cuff move together.

    Displacement is constant throughout the bottle/grip and eases to zero at
    the elbow. Head, costume palette and ground line are never redrawn.
    """
    pose = Image.new('RGBA', packing.SIZE)
    source, target = base.load(), pose.load()
    for y in range(320):
        for x in range(192):
            beer = ease((y-65)/4) * ease((160-y)/29) * ease((78-x)/24)
            free = (math.sin(math.pi*(y-123)/81)**2 if 123 < y < 204 else 0)
            free *= ease((x-111)/12) * ease((167-x)/12)
            dy = round(-phase * 3 * beer - phase * 2 * free)
            dx = round(phase * 2 * free)
            sx, sy = x-dx, y-dy
            if 0 <= sx < 192 and 0 <= sy < 320:
                target[x, y] = source[sx, sy]
    return pose


def build():
    artwork = ROOT/'ilustraciones/canero-base.png'
    base, crop, fit, offset = packing.canonical(artwork)
    raw = packing.png_bytes(base)
    (ROOT/'ilustraciones/canero-celda.png').write_bytes(raw)
    encoded = base64.b64encode(raw).decode('ascii')
    (ROOT/'canero.svg').write_text(
        '<svg xmlns="http://www.w3.org/2000/svg" width="192" height="320" '
        'viewBox="0 0 192 320" preserveAspectRatio="xMidYMax meet">'
        f'<image width="192" height="320" href="data:image/png;base64,{encoded}"/></svg>',
        encoding='utf-8')
    columns = 8
    atlas = Image.new('RGBA', (192*columns, 1280))
    for row, state in enumerate(packing.ROWS):
        for col in range(columns):
            phase = math.sin(col*math.tau/columns)
            if state == 'walk':
                pose = packing.original.walk(base, packing.gait_masks(base), col % 4)
            elif state in ('playing', 'victory'):
                pose = accompany(base, phase)
            else:
                pose = packing.original.torso(base, phase*.5)
            atlas.paste(pose, (192*col, 320*row))
    atlas.save(ROOT/'canero-atlas.png', optimize=True)
    manifest = dict(id='canero', name='CAÑERO', kind='companion', instrument=None,
        prop='botella Mahou dibujada; etiqueta roja y marca blanca simplificada',
        frame=[192,320], columns=columns, rows=packing.ROWS, ground=315,
        immutableHead=[48,0,115,65], bottleAndGrip=[25,69,51,123],
        crop=list(crop), fit=list(fit), offset=list(offset),
        reference='referencias/canero.jpg', artwork='ilustraciones/canero-base.png',
        referenceSha256=hashlib.sha256((ROOT/'referencias/canero.jpg').read_bytes()).hexdigest(),
        artworkSha256=hashlib.sha256(artwork.read_bytes()).hexdigest(),
        method='ImageGen integrado; dibujo de pie basado en identidad de foto sentada. Mismo empaquetado y marcha aprobados.',
        traits=['pelo castaño corto hacia un lado','rostro ancho sin barba','sonrisa','beca roja','traje negro','cerveza Mahou'])
    (ROOT/'canero-referencias.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
    print('CAÑERO: 32 poses, ocho columnas, anclaje y315; sin instrumento.')


if __name__ == '__main__':
    build()

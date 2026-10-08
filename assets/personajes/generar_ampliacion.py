"""Pack three new ImageGen drawings. Never regenerates existing characters.

References are identities only. Atlas layout, footing and gait reuse the
approved Andrés/Coki/Legía pipeline. Pedro has an eight-pose dance row.
"""
import base64
import hashlib
import json
import math
from pathlib import Path
from PIL import Image
import generar_nuevos as packing
import generar_legia as strings

ROOT = Path(__file__).resolve().parent


def dance(base, column):
    angle = column * math.tau / 8
    source = base.load()
    pose = Image.new('RGBA', packing.SIZE)
    target = pose.load()
    for y in range(320):
        for x in range(192):
            dx = dy = 0
            # Arms swing from the shoulder with smooth joints. The canonical
            # head (y<96) and the grounded toe line are never resampled.
            if 100 <= y < 190:
                vertical = math.sin(math.pi * (y-100)/90)**2
                left = max(0, 1-abs(x-38)/34)
                right = max(0, 1-abs(x-153)/31)
                dx = round(math.sin(angle)*7*vertical*(left+right))
                dy = round(math.cos(angle)*6*vertical*(left-right))
            elif 190 <= y < 270:
                dx = round(math.sin(angle)*3*math.sin(math.pi*(y-190)/80))
            elif 270 <= y < 316:
                leg = -1 if x < 96 else 1
                dx = round(math.sin(angle)*leg*5*math.sin(math.pi*(y-270)/92))
            sx, sy = x-dx, y-dy
            if 0 <= sx < 192 and 0 <= sy < 320:
                target[x, y] = source[sx, sy]
    return pose


def build():
    records = []
    for ident in ('pena', 'ponder', 'pedro-v'):
        artwork = ROOT / 'ilustraciones' / f'{ident}-base.png'
        base, crop, fit, offset = packing.canonical(artwork)
        raw = packing.png_bytes(base)
        (ROOT / 'ilustraciones' / f'{ident}-celda.png').write_bytes(raw)
        encoded = base64.b64encode(raw).decode('ascii')
        (ROOT / f'{ident}.svg').write_text(
            '<svg xmlns="http://www.w3.org/2000/svg" width="192" height="320" '
            'viewBox="0 0 192 320" preserveAspectRatio="xMidYMax meet">'
            f'<image width="192" height="320" href="data:image/png;base64,{encoded}"/></svg>',
            encoding='utf-8')
        columns = 8 if ident == 'pedro-v' else 4
        atlas = Image.new('RGBA', (192*columns, 1280))
        for row, state in enumerate(packing.ROWS):
            for col in range(columns):
                phase = math.sin(col*math.tau/columns)
                if state == 'walk':
                    pose = packing.original.walk(base, packing.gait_masks(base), col%4)
                elif state == 'playing':
                    pose = dance(base, col) if ident == 'pedro-v' else strings.strum(base, phase)
                elif state == 'victory' and ident == 'pedro-v':
                    pose = dance(base, col)
                else:
                    pose = packing.original.torso(base, phase*.5)
                atlas.paste(pose, (192*col, 320*row))
        atlas.save(ROOT / f'{ident}-atlas.png', optimize=True)
        records.append(dict(id=ident,frame=[192,320],columns=columns,rows=packing.ROWS,
            ground=315,crop=list(crop),fit=list(fit),offset=list(offset),
            reference=f'referencias/{ident}.png',artwork=f'ilustraciones/{ident}-base.png',
            referenceSha256=hashlib.sha256((ROOT/'referencias'/f'{ident}.png').read_bytes()).hexdigest(),
            artworkSha256=hashlib.sha256(artwork.read_bytes()).hexdigest(),
            method='ImageGen integrado; mismo empaquetado artístico aprobado. Fotos solo como referencia.',
            function='bailarín sin instrumento' if ident=='pedro-v' else 'bandurria'))
        print(ident, 'frame', fit, 'columns', columns, 'ground=315')
    (ROOT/'ampliacion-referencias.json').write_text(json.dumps(records,ensure_ascii=False,indent=2),encoding='utf-8')


if __name__ == '__main__':
    build()

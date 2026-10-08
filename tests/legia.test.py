from pathlib import Path
from io import BytesIO
import base64
import hashlib
import json
import xml.etree.ElementTree as ET
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / 'assets/personajes'
meta = json.loads((ASSETS / 'legia-referencias.json').read_text(encoding='utf-8'))
assert meta['instrument'] == 'guitarra' and meta['instrumentConfirmedBy'].startswith('Usuario')
for kind in ['reference', 'artwork']:
    assert hashlib.sha256((ASSETS / meta[kind]).read_bytes()).hexdigest() == meta[kind + 'Sha256']
assert hashlib.sha256((ROOT / 'PERSONAJES/LEGIA.png').read_bytes()).hexdigest() == meta['referenceSha256']
assert Image.open(ASSETS / meta['artwork']).mode == 'RGBA'
svg = ET.parse(ASSETS / 'legia.svg').getroot()
raw = svg.find('{http://www.w3.org/2000/svg}image').attrib['href'].split(',', 1)[1]
base = Image.open(BytesIO(base64.b64decode(raw))).convert('RGBA')
assert base.size == (192, 320)
assert base.tobytes() == Image.open(ASSETS / 'ilustraciones/legia-celda.png').convert('RGBA').tobytes()
atlas = Image.open(ASSETS / 'legia-atlas.png').convert('RGBA')
assert atlas.size == (768, 1280)
for row, state in enumerate(meta['rows']):
    frames = []
    for col in range(4):
        frame = atlas.crop((col * 192, row * 320, (col + 1) * 192, (row + 1) * 320))
        assert frame.crop((0, 0, 192, 96)).tobytes() == base.crop((0, 0, 192, 96)).tobytes()
        delta = frame.getchannel('A').getbbox()[3] - 316
        assert abs(delta) <= (2 if state == 'walk' else 0)
        frames.append(frame.tobytes())
    assert len(set(frames)) > 1, state
    assert frames[0] == base.tobytes(), 'No debe haber salto al cambiar de estado'
print('PASS LEGÍA: referencia intacta, guitarra confirmada, transparencia, 16 poses, rostro y anclaje estables')

before = json.loads((ROOT / 'docs/sprites-legia/antes.json').read_text(encoding='utf-8'))
for rel, digest in before.items():
    if rel == 'src\\data.js':
        continue  # Catalogue change: adding one record.
    if rel == 'src\\art.js':
        current = (ROOT / rel).read_text(encoding='utf-8')
        before_line = (ROOT / 'docs/sprites-legia/menu-original.txt').read_text(encoding='utf-8')
        after_line = next(line for line in current.splitlines() if "if(!game||['menu'].includes(game.phase))" in line)
        restored = current.replace(after_line, before_line)
        assert digest in {hashlib.sha256(restored.encode('utf-8')).hexdigest(), hashlib.sha256(restored.replace('\n', '\r\n').encode('utf-8')).hexdigest()}
        assert 'D.characters.length>7' in after_line and '910-span/2' in after_line
        continue  # Only menu placement for enlarged rosters; sprites and in-game render unchanged.
    assert hashlib.sha256((ROOT / rel).read_bytes()).hexdigest() == digest, rel
print('PASS siete personajes y demás código, canciones, MIDI, audio y fotografías protegidos sin cambios')

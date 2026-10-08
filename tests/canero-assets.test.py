from pathlib import Path
import json
from PIL import Image

root = Path(__file__).resolve().parents[1]
manifest = json.loads((root/'assets/personajes/canero-referencias.json').read_text(encoding='utf-8'))
base = Image.open(root/'assets/personajes/ilustraciones/canero-celda.png').convert('RGBA')
atlas = Image.open(root/'assets/personajes/canero-atlas.png').convert('RGBA')
assert base.size == (192, 320) and atlas.size == (1536,1280)
assert base.getchannel('A').getextrema()[0] == 0
assert atlas.crop((0,0,192,320)).tobytes() == base.tobytes()
head = tuple(manifest['immutableHead'])
for row, state in enumerate(manifest['rows']):
    frames = []
    for col in range(8):
        frame=atlas.crop((col*192,row*320,(col+1)*192,(row+1)*320))
        assert frame.crop(head).tobytes() == base.crop(head).tobytes(), state
        assert abs(frame.getchannel('A').getbbox()[3]-316) <= (2 if state=='walk' else 0)
        # The label stays red and the amber bottle is visible in every state.
        label = frame.crop((25,75,53,118)).getdata()
        assert sum(a>100 and r>120 and r>g*1.4 and r>b*1.2 for r,g,b,a in label)>20
        frames.append(frame.tobytes())
    assert len(set(frames))>1, state+' frozen'
print('PASS CAÑERO: 32 poses, rostro constante, botella presente, transparencia y anclaje del elenco')

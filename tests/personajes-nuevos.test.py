from pathlib import Path
from io import BytesIO
import base64
import hashlib
import json
import xml.etree.ElementTree as ET

from PIL import Image

ROOT = Path(__file__).resolve().parents[1] / "assets" / "personajes"
manifest = json.loads((ROOT / "nuevos-referencias.json").read_text(encoding="utf-8"))
assert {item["id"] for item in manifest} == {"andres", "coki"}

for item in manifest:
    ident = item["id"]
    reference = ROOT / "referencias" / f"{ident}.png"
    assert reference.exists() and reference.stat().st_size > 100_000
    assert hashlib.sha256(reference.read_bytes()).hexdigest() == item["referenceSha256"]
    artwork = ROOT / item["artwork"]
    assert hashlib.sha256(artwork.read_bytes()).hexdigest() == item["artworkSha256"]
    assert Image.open(artwork).mode == "RGBA", "El dibujo fuente debe tener transparencia real"
    assert item["frame"] == [192, 320] and item["rows"] == ["idle", "walk", "playing", "victory"]
    assert "pandereta" in item["traits"]

    svg = ET.parse(ROOT / f"{ident}.svg").getroot()
    assert svg.attrib["viewBox"] == "0 0 192 320"
    encoded = svg.find("{http://www.w3.org/2000/svg}image").attrib["href"].split(",", 1)[1]
    base = Image.open(BytesIO(base64.b64decode(encoded))).convert("RGBA")
    atlas = Image.open(ROOT / f"{ident}-atlas.png").convert("RGBA")
    assert base.size == (192, 320) and base.getchannel("A").getbbox()
    assert atlas.size == (768, 1280)
    assert atlas.crop((0, 0, 192, 320)).tobytes() == base.tobytes()

    poses = []
    for row in range(4):
        cells = []
        for column in range(4):
            frame = atlas.crop((column * 192, row * 320, (column + 1) * 192, (row + 1) * 320))
            assert frame.getchannel("A").getbbox()
            assert frame.crop(tuple(item["immutableHead"])).tobytes() == base.crop(tuple(item["immutableHead"])).tobytes(), "La cara no debe cambiar entre poses"
            foot_delta = frame.getchannel("A").getbbox()[3] - (item["ground"] + 1)
            assert abs(foot_delta) <= (2 if row == 1 else 0), "El apoyo debe respetar el paso de dos píxeles del elenco original"
            cells.append(frame.tobytes())
        assert len(set(cells)) > 1, f"Animación sin movimiento: {ident}/{item['rows'][row]}"
        poses.extend(cells)
    assert len(poses) == 16

    raw = base.tobytes()
    colors = {tuple(raw[offset:offset + 4]) for offset in range(0, len(raw), 4) if raw[offset + 3]}
    if ident == "andres":
        assert any(r < 90 and g < 75 and b < 70 for r, g, b, _ in colors), "Debe conservar pelo/barba oscuros"
    else:
        assert any(r > 120 and g < 80 and b < 90 for r, g, b, _ in colors), "Debe conservar la beca roja"
        assert any(r < 55 and g < 55 and b < 65 for r, g, b, _ in colors), "Debe conservar gafas y traje oscuros"
    print(f"PASS {ident}: foto de referencia, sprite pixel art, SVG y 16 poses animadas")

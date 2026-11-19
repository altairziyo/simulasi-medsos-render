# Generator plate desa kembar (640x720 per dunia) gaya plate Pemimpin.
# Digambar pada kanvas sel 160x180 (1 sel = 4px) lalu upscale NEAREST x4.
import random
from PIL import Image, ImageDraw

CELL = 4
CW, CH = 160, 180
random.seed(20261119)

GRASS = (96, 168, 76)
GRASS_L = (110, 178, 82)
GRASS_LL = (112, 184, 92)
GRASS_D = (82, 150, 62)
GRASS_DD = (88, 142, 65)
DIRT = (188, 170, 126)
DIRT_D = (178, 160, 116)
SAND = (222, 196, 138)
WATER = (56, 138, 220)
WATER_L = (127, 196, 240)
FENCE = (138, 107, 66)
FENCE_D = (110, 84, 48)
CROP = (82, 150, 62)
WALL = (146, 96, 52)
WALL_D = (120, 76, 40)
ROOF = (176, 84, 45)
ROOF_D = (150, 66, 36)
WIN = (255, 217, 138)
TREE_D = (52, 110, 44)
TREE_L = (74, 148, 60)
TRUNK = (110, 76, 44)
ROCK = (150, 146, 138)
HAY = (232, 198, 92)

img = Image.new('RGB', (CW, CH), GRASS)
d = ImageDraw.Draw(img)

# --- tekstur rumput ---
for _ in range(5200):
    x, y = random.randrange(CW), random.randrange(CH)
    d.point((x, y), fill=random.choice([GRASS_L, GRASS_LL, GRASS_D, GRASS_DD]))
for _ in range(260):
    x, y = random.randrange(CW), random.randrange(CH)
    d.point((x, y), fill=random.choice([(255, 240, 245), (255, 250, 180), (250, 200, 220)]))

def sawah(x0, y0, x1, y1):
    d.rectangle([x0, y0, x1, y1], fill=(104, 172, 78))
    # baris tanaman
    for yy in range(y0 + 3, y1 - 1, 4):
        d.line([x0 + 2, yy, x1 - 2, yy], fill=CROP)
    for _ in range(46):
        x = random.randrange(x0 + 2, x1 - 2)
        y = random.randrange(y0 + 2, y1 - 2)
        d.point((x, y), fill=(240, 248, 235))
    # pagar: tiang + rel
    for xx in range(x0, x1 + 1, 6):
        d.rectangle([xx, y0 - 1, xx, y0 + 1], fill=FENCE_D)
        d.rectangle([xx, y1 - 1, xx, y1 + 1], fill=FENCE_D)
    for yy in range(y0, y1 + 1, 6):
        d.rectangle([x0 - 1, yy, x0 + 1, yy], fill=FENCE_D)
        d.rectangle([x1 - 1, yy, x1 + 1, yy], fill=FENCE_D)
    d.line([x0, y0, x1, y0], fill=FENCE)
    d.line([x0, y1, x1, y1], fill=FENCE)
    d.line([x0, y0, x0, y1], fill=FENCE)
    d.line([x1, y0, x1, y1], fill=FENCE)

sawah(6, 26, 52, 58)
sawah(6, 104, 52, 142)
sawah(104, 108, 150, 142)

# --- jalan tanah ---
d.rectangle([0, 79, CW - 1, 85], fill=DIRT)
d.rectangle([76, 0, 84, 79], fill=DIRT)
for _ in range(700):
    x, y = random.randrange(CW), random.randrange(79, 86)
    d.point((x, y), fill=DIRT_D)
for _ in range(160):
    x, y = random.randrange(76, 85), random.randrange(0, 79)
    d.point((x, y), fill=DIRT_D)

# --- plaza tanah ---
d.ellipse([34, 67, 126, 97], fill=DIRT)
for _ in range(500):
    x = random.randrange(40, 121)
    y = random.randrange(70, 95)
    d.point((x, y), fill=random.choice([DIRT_D, (198, 178, 132)]))

def house(cx, cy, w=15, h=12, roof=ROOF):
    x0, y0 = cx - w // 2, cy - h // 2
    x1, y1 = x0 + w, y0 + h
    d.rectangle([x0 - 1, y0 - 3, x1 + 1, y0 + 1], fill=ROOF_D)  # atap belakang
    d.polygon([(x0 - 2, y0), (cx, y0 - 6), (x1 + 2, y0)], fill=roof)
    d.rectangle([x0, y0, x1, y1], fill=WALL)
    d.rectangle([x0, y1 - 2, x1, y1], fill=WALL_D)
    d.rectangle([cx - 1, y0 + 5, cx + 1, y1], fill=(70, 44, 26))  # pintu
    d.rectangle([x0 + 2, y0 + 4, x0 + 4, y0 + 7], fill=WIN)
    d.rectangle([x1 - 4, y0 + 4, x1 - 2, y0 + 7], fill=WIN)

# balai desa (besar) di utara plaza
house(80, 46, w=30, h=17, roof=(164, 70, 40))
d.rectangle([63, 56, 97, 58], fill=WALL_D)
# rumah warga
house(116, 47, w=14, h=11)
house(22, 95, w=13, h=10)
house(120, 101, w=13, h=10)
house(66, 152, w=14, h=11)

# --- warung (kanopi garis) di tepi kanan plaza ---
wx, wy = 106, 68
d.rectangle([wx, wy + 6, wx + 20, wy + 13], fill=(122, 84, 50))
for i in range(5):
    col = (214, 74, 56) if i % 2 == 0 else (245, 240, 230)
    d.rectangle([wx - 1 + i * 4, wy, wx + 2 + i * 4, wy + 3], fill=col)
d.rectangle([wx + 2, wy + 8, wx + 5, wy + 10], fill=WIN)
d.rectangle([wx + 13, wy + 8, wx + 16, wy + 10], fill=WIN)

# --- menara sinyal (kanan atas) ---
tx, ty = 146, 6
d.line([tx - 4, ty + 30, tx, ty], fill=(90, 90, 96), width=1)
d.line([tx + 4, ty + 30, tx, ty], fill=(90, 90, 96), width=1)
d.line([tx - 4, ty + 30, tx + 4, ty + 30], fill=(90, 90, 96), width=1)
for i in range(4):
    yy = ty + 6 + i * 6
    d.line([tx - 3, yy, tx + 3, yy], fill=(110, 110, 118), width=1)
d.rectangle([tx - 2, ty - 2, tx + 2, ty + 1], fill=(70, 70, 78))
d.point((tx, ty - 3), fill=(240, 60, 50))

def tree(cx, cy, s=5):
    d.rectangle([cx, cy + s - 1, cx, cy + s + 2], fill=TRUNK)
    d.ellipse([cx - s, cy - s, cx + s, cy + s], fill=TREE_D)
    d.ellipse([cx - s + 1, cy - s, cx + s - 2, cy + s - 3], fill=TREE_L)
    d.point((cx - 1, cy - 1), fill=(200, 90, 60))
    d.point((cx + 2, cy + 1), fill=(200, 90, 60))

tree(140, 62)
tree(30, 70)
tree(124, 124)
tree(58, 128)
tree(148, 148)
tree(16, 152)

# batu + jerami
for (rx, ry) in [(96, 120), (40, 60), (132, 88)]:
    d.ellipse([rx, ry, rx + 5, ry + 3], fill=ROCK)
d.polygon([(88, 146), (93, 138), (98, 146)], fill=HAY)
d.rectangle([88, 146, 98, 147], fill=(200, 164, 70))

# --- sungai di tepi bawah ---
d.rectangle([0, 156, CW - 1, 159], fill=SAND)
d.rectangle([0, 172, CW - 1, 175], fill=SAND)
d.rectangle([0, 159, CW - 1, 172], fill=WATER)
for _ in range(120):
    x = random.randrange(CW)
    y = random.randrange(161, 171)
    d.line([x, y, x + 2, y], fill=WATER_L)
# jembatan kayu kecil di jalan vertikal
d.rectangle([75, 157, 85, 174], fill=(150, 110, 66))
for i in range(4):
    d.line([75, 159 + i * 4, 85, 159 + i * 4], fill=(120, 86, 50))

img = img.resize((640, 720), Image.NEAREST)
img.save('/home/hatch/workspace/produksi-video-simulasi/medsos/remotion-v3/public/sprites/plate_desa_y0.png')
print('plate_desa_y0.png', img.size)

# --- backdrop senja per separuh (potong bg_sunset Pemimpin) ---
bg = Image.open('/home/hatch/workspace/produksi-video-simulasi/medsos/remotion-v3/public/sprites/bg_sunset.png')
half = bg.crop((0, 0, 640, 720))
half.save('/home/hatch/workspace/produksi-video-simulasi/medsos/remotion-v3/public/sprites/bg_sunset_half.png')
print('bg_sunset_half.png', half.size)

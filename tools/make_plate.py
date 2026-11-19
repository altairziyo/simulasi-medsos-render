# Generator plate desa kembar MODERN (640x720 per dunia) gaya plate Pemimpin.
# Keputusan Bos (19 Nov 2026): setting tetap desa, peta DIMODERNKAN TANPA SAWAH.
# Digambar pada kanvas unit 320x180*2 (1 sel logis 160x180 = 2x2 unit) lalu
# upscale NEAREST x2 -> grain piksel 2px, dekat dengan kehalusan plate Pemimpin.
#
# Pola era: build_plate(era) — era 'y0' dipakai Blok 1-3 (Tahun 0, dua desa
# identik). Era berikutnya (Tahun 20, festival, banjir, dst.) dibuat sebagai
# varian dari generator ini dengan mengubah ERA_TWEAKS + daftar bangunan,
# BUKAN generator baru, supaya satu gaya.
import random
from PIL import Image, ImageDraw

S = 2                      # unit per sel logis
CW, CH = 160, 180          # sel logis
W, H = CW * S, CH * S      # 320x360 unit -> 640x720 px
random.seed(20261119)

# ---------- palet (keluarga plate Pemimpin, lembut, tidak norak) ----------
GRASS = (101, 172, 84)
GRASS_L = (112, 180, 90)
GRASS_LL = (118, 186, 98)
GRASS_D = (88, 156, 68)
GRASS_DD = (92, 148, 70)
ASPHALT = (86, 88, 98)
ASPHALT_D = (76, 78, 88)
ASPHALT_L = (99, 101, 112)
MARK = (233, 229, 205)
MARK_Y = (238, 199, 92)
SIDEWALK = (172, 170, 161)
SIDEWALK_D = (156, 154, 146)
PAVED = (183, 176, 160)
PAVED_D = (168, 161, 146)
DIRT = (198, 180, 134)
DIRT_D = (184, 166, 120)
FIELD = (126, 178, 90)      # lapangan: rumput kering terang
FIELD_D = (114, 166, 80)
LINE_W = (242, 242, 236)
WATER = (86, 160, 220)
WATER_L = (150, 205, 245)
WOOD = (122, 84, 50)
WOOD_D = (102, 68, 40)
DOOR = (74, 48, 28)
WIN_DAY = (168, 205, 220)
WIN_WARM = (255, 217, 138)
STONE = (150, 148, 140)
POLE = (96, 74, 50)
WIRE = (58, 58, 64)
LAMP_HEAD = (255, 230, 160)
TREE_D = (50, 108, 42)
TREE_M = (64, 134, 52)
TREE_L = (82, 156, 66)
TRUNK = (110, 76, 44)
HEDGE = (56, 118, 48)
FLOWERS = [(240, 190, 200), (245, 235, 190), (200, 190, 230), (250, 205, 150)]

ROOFS = [(176, 84, 45), (150, 66, 36), (96, 110, 128), (70, 90, 110), (140, 90, 60), (164, 70, 40)]
WALLS = [(238, 228, 205), (245, 242, 235), (240, 214, 160), (214, 164, 128), (196, 216, 228), (220, 200, 180)]

img = Image.new('RGB', (W, H), GRASS)
d = ImageDraw.Draw(img)

def X(c):
    return int(round(c * S))

def rect(x0, y0, x1, y1, fill):
    d.rectangle([X(x0), X(y0), X(x1) - 1, X(y1) - 1], fill=fill)

def ell(cx, cy, rx, ry, fill):
    d.ellipse([X(cx - rx), X(cy - ry), X(cx + rx) - 1, X(cy + ry) - 1], fill=fill)

def line(x0, y0, x1, y1, fill, w=1):
    d.line([X(x0), X(y0), X(x1), X(y1)], fill=fill, width=max(1, int(w * S)))

def pt(x, y, fill):
    d.point((X(x), X(y)), fill=fill)

def poly(pts, fill):
    d.polygon([(X(x), X(y)) for x, y in pts], fill=fill)

# ================= 1. rumput dasar + tekstur lembut =================
for _ in range(9000):
    x, y = random.randrange(W), random.randrange(H)
    d.point((x, y), fill=random.choice([GRASS_L, GRASS_LL, GRASS_D, GRASS_DD]))
for _ in range(150):  # bunga kecil warna redup (bukan putih menyilaukan)
    x, y = random.randrange(W), random.randrange(H)
    d.point((x, y), fill=random.choice(FLOWERS))
# bercak tanah tipis acak
for _ in range(26):
    cx, cy = random.randrange(6, CW - 6), random.randrange(6, CH - 6)
    ell(cx, cy, random.uniform(2, 4.5), random.uniform(1.2, 2.4), random.choice([DIRT, DIRT_D]))

# ================= 2. plaza, halaman, lapangan =================
rect(54, 60, 106, 76, PAVED)                       # plaza di depan balai
for gx in range(58, 106, 8):
    line(gx, 60, gx, 76, PAVED_D, 0.5)
for gy in range(64, 76, 6):
    line(54, gy, 106, gy, PAVED_D, 0.5)
for _ in range(420):                               # tekstur plaza
    pt(random.uniform(54.5, 105.5), random.uniform(60.5, 75.5), random.choice([PAVED_D, DIRT]))
rect(12, 40, 43, 57, DIRT)                         # halaman sekolah (tanah padat)
for _ in range(300):
    pt(random.uniform(12.5, 42.5), random.uniform(40.5, 56.5), random.choice([DIRT_D, PAVED]))
rect(24, 40, 30, 57, PAVED)                        # jalur paving ke gerbang sekolah
rect(34, 51, 42, 55, (92, 150, 66))                # petak kebun sekolah
for _ in range(22):
    pt(random.uniform(34.5, 41.5), random.uniform(51.5, 54.5), random.choice(FLOWERS))
rect(58, 54, 102, 59, DIRT)                       # halaman balai
rect(88, 117, 152, 145, FIELD)                    # lapangan (blok timur-selatan)
for i, gx in enumerate(range(88, 152, 10)):       # garis potong rumput lapangan
    if i % 2 == 0:
        rect(gx, 117, gx + 10, 145, FIELD_D)
# garis lapangan (putih)
d.rectangle([X(96), X(122), X(144) - 1, X(140) - 1], outline=LINE_W, width=S)
line(120, 122, 120, 140, LINE_W, 0.7)
d.ellipse([X(115), X(126), X(125) - 1, X(136) - 1], outline=LINE_W, width=S)
rect(94.5, 128, 96, 134, LINE_W)                  # gawang barat
rect(144, 128, 145.5, 134, LINE_W)                # gawang timur

# ================= 3. trotoar =================
rect(72, 0, 74, 27, SIDEWALK); rect(86, 0, 88, 27, SIDEWALK)       # utama vertikal (utara balai)
rect(72, 53, 74, 180, SIDEWALK); rect(86, 53, 88, 180, SIDEWALK)   # utama vertikal (selatan balai)
rect(0, 77, 160, 79, SIDEWALK); rect(0, 88, 160, 90, SIDEWALK)     # jalan utama horizontal

# ================= 4. jalan aspal (grid) =================
def road(x0, y0, x1, y1):
    rect(x0, y0, x1, y1, ASPHALT)
    for _ in range(int((x1 - x0) * (y1 - y0) * 0.55)):
        x = random.uniform(x0 + 0.5, x1 - 0.5)
        y = random.uniform(y0 + 0.5, y1 - 0.5)
        pt(x, y, random.choice([ASPHALT_D, ASPHALT_L]))

road(74, 0, 86, 27)           # utama vertikal utara (berhenti di balai)
road(74, 53, 86, 180)         # utama vertikal selatan
road(0, 79, 160, 88)          # utama horizontal
road(0, 112, 74, 116); road(86, 112, 160, 116)      # H2
road(0, 129, 48, 133)         # H3 barat saja (timur = lapangan)
road(0, 148, 160, 152)        # H4
road(0, 163, 160, 167)        # H5 bawah
road(44, 0, 48, 79)           # V2 ke sekolah
road(112, 88, 116, 112)       # V3 (stub ke H2)
road(130, 88, 134, 112)       # V4 (stub ke H2)

# marka: garis tepi + garis tengah putus-putus
def dashes_v(cx, y0, y1, skip):
    y = y0
    while y < y1:
        if not any(a - 1 <= y <= b + 1 for a, b in skip):
            rect(cx - 0.4, y, cx + 0.4, y + 3, MARK_Y)
        y += 6
def dashes_h(cy, x0, x1, skip):
    x = x0
    while x < x1:
        if not any(a - 1 <= x <= b + 1 for a, b in skip):
            rect(x, cy - 0.4, x + 3, cy + 0.4, MARK_Y)
        x += 6
dashes_v(80, 0, 180, [(27, 53), (79, 88), (112, 116), (129, 133), (148, 152), (163, 167)])
dashes_h(83.5, 0, 160, [(74, 86), (112, 116), (130, 134)])
# zebra cross di empat sisi plaza
for zx in range(66, 72):
    if (zx - 66) % 2 == 0:
        rect(zx, 80, zx + 1.2, 87, MARK)
for zx in range(89, 95):
    if (zx - 89) % 2 == 0:
        rect(zx, 80, zx + 1.2, 87, MARK)
for zy in range(71, 77):
    if (zy - 71) % 2 == 0:
        rect(75, zy, 85, zy + 1.2, MARK)
for zy in range(91, 97):
    if (zy - 91) % 2 == 0:
        rect(75, zy, 85, zy + 1.2, MARK)

# ================= 5. tiang listrik + kabel & lampu jalan =================
for py in [12, 48, 104, 140]:
    line(88.6, py - 6, 88.6, py, POLE, 0.8)
    line(87.2, py - 5.4, 90, py - 5.4, POLE, 0.6)
for a, b in [(6, 73), (95, 106), (119, 122), (136, 142), (155, 160)]:
    line(88.6, a, 88.6, b, WIRE, 0.45)
def lamp(cx, cy):
    line(cx, cy - 3.5, cx, cy, (70, 70, 76), 0.55)
    line(cx, cy - 3.5, cx + 1.2, cy - 3.5, (70, 70, 76), 0.55)
    rect(cx + 1, cy - 4, cx + 2, cy - 3.1, LAMP_HEAD)
for lx, ly in [(56, 61), (104, 61), (56, 75), (104, 75), (20, 92), (140, 92), (70, 30), (70, 122), (40, 161), (120, 161)]:
    lamp(lx, ly)

# ================= 6. bangunan =================
def windows(x0, y0, x1, cols, warm=False):
    for i in range(cols):
        wx = x0 + 2 + i * ((x1 - x0 - 4) / max(1, cols - 1) if cols > 1 else 0)
        col = WIN_WARM if (warm or i % 2 == 0) else WIN_DAY
        rect(wx, y0, wx + 2.6, y0 + 3.2, (70, 52, 36))
        rect(wx + 0.4, y0 + 0.4, wx + 2.2, y0 + 2.8, col)

def house(cx, cy, w=14, h=11, wall=None, roof=None, chimney=False, awning=None, dish=False):
    wall = wall or random.choice(WALLS)
    roof = roof or random.choice(ROOFS)
    roof_d = tuple(max(0, c - 26) for c in roof)
    x0, y0, x1, y1 = cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2
    ell(cx, cy + h / 2 + 0.6, w / 2 + 1.4, 1.6, GRASS_D)                 # bayangan tanah
    rect(x0 - 0.8, y0 - 1.6, x1 + 0.8, y0 + 2.2, roof_d)                  # atap belakang
    poly([(x0 - 1.6, y0 + 0.6), (cx, y0 - 4.6), (x1 + 1.6, y0 + 0.6)], roof)
    line(x0 - 0.6, y0 - 1.4, x1 + 0.6, y0 - 1.4, roof_d, 0.7)            # garis genteng
    line(x0 - 1.1, y0 + 0.4, x1 + 1.1, y0 + 0.4, roof_d, 0.7)
    rect(x0, y0, x1, y1, wall)                                           # dinding
    for _ in range(int(w * h * 0.35)):                                   # tekstur dinding
        pt(random.uniform(x0 + 0.4, x1 - 0.4), random.uniform(y0 + 0.4, y1 - 0.4),
           tuple(max(0, c - 14) for c in wall))
    rect(x0, y1 - 1.6, x1, y1, tuple(max(0, c - 22) for c in wall))      # alas gelap
    rect(cx - 1.1, y0 + 4.6, cx + 1.1, y1, DOOR)                         # pintu
    rect(cx - 1.5, y1 - 0.7, cx + 1.5, y1, STONE)                        # anak tangga
    windows(x0, y0 + 3.4, x1, 2)
    if awning:
        for i in range(4):
            rect(cx - 2.4 + i * 1.2, y0 + 3.4, cx - 1.2 + i * 1.2, y0 + 4.4,
                 awning if i % 2 == 0 else (245, 240, 230))
    if chimney:
        rect(cx + w / 2 - 3.4, y0 - 4.4, cx + w / 2 - 1.4, y0 - 0.6, (128, 124, 118))
        rect(cx + w / 2 - 3.6, y0 - 4.8, cx + w / 2 - 1.2, y0 - 4.3, (84, 80, 76))
    if dish:
        ell(cx - w / 2 + 2.4, y0 - 2.4, 1.7, 1.2, (196, 200, 206))
        line(cx - w / 2 + 2.4, y0 - 2.4, cx - w / 2 + 3.6, y0 - 3.6, (120, 124, 130), 0.5)
    return (cx, cy)

# --- balai desa (terbesar, utara plaza) ---
bx, by, bw, bh = 80, 41, 36, 19
ell(bx, by + bh / 2 + 0.8, bw / 2 + 2, 2, GRASS_D)
rect(bx - bw / 2 - 0.8, by - bh / 2 - 1.6, bx + bw / 2 + 0.8, by - bh / 2 + 2.2, (138, 60, 34))
poly([(bx - bw / 2 - 1.6, by - bh / 2 + 0.6), (bx, by - bh / 2 - 5.2), (bx + bw / 2 + 1.6, by - bh / 2 + 0.6)], (164, 70, 40))
line(bx - bw / 2, by - bh / 2 - 1.6, bx + bw / 2, by - bh / 2 - 1.6, (138, 60, 34), 0.7)
rect(bx - bw / 2, by - bh / 2, bx + bw / 2, by + bh / 2, (240, 232, 210))
windows(bx - bw / 2, by - bh / 2 + 3.2, bx + bw / 2, 5, warm=True)
rect(bx - 7, by + bh / 2 - 4.6, bx + 7, by + bh / 2, (226, 216, 192))          # teras
for px_ in [bx - 6.4, bx - 2.2, bx + 2.2, bx + 6.4]:
    rect(px_ - 0.35, by + bh / 2 - 4.6, px_ + 0.35, by + bh / 2, (250, 248, 240))
rect(bx - 1.8, by + bh / 2 - 4.2, bx + 1.8, by + bh / 2, DOOR)                  # pintu ganda
rect(bx - 5.5, by - bh / 2 + 0.6, bx + 5.5, by - bh / 2 + 3, (60, 50, 44))      # papan nama
rect(bx - 5.5, by - bh / 2 + 0.6, bx + 5.5, by - bh / 2 + 1.1, (150, 130, 90))
rect(bx - 8, by + bh / 2, bx + 8, by + bh / 2 + 1.2, STONE)                    # tangga
# tiang bendera di halaman balai
line(66, 49, 66, 58, (120, 120, 126), 0.5)
rect(66, 49, 68.6, 50.3, (216, 60, 50)); rect(66, 50.3, 68.6, 51.6, (245, 245, 245))

# --- sekolah (barat laut) ---
sx, sy, sw, sh = 28.5, 30.5, 31, 15
ell(sx, sy + sh / 2 + 0.8, sw / 2 + 2, 2, GRASS_D)
poly([(sx - sw / 2 - 1.6, sy - sh / 2 + 0.6), (sx, sy - sh / 2 - 4.6), (sx + sw / 2 + 1.6, sy - sh / 2 + 0.6)], (96, 110, 128))
rect(sx - sw / 2 - 0.8, sy - sh / 2 - 1.6, sx + sw / 2 + 0.8, sy - sh / 2 + 2.2, (76, 88, 104))
rect(sx - sw / 2, sy - sh / 2, sx + sw / 2, sy + sh / 2, (240, 214, 160))
windows(sx - sw / 2, sy - sh / 2 + 3.4, sx + sw / 2, 6)
rect(sx - 1.4, sy + sh / 2 - 4.6, sx + 1.4, sy + sh / 2, DOOR)
rect(sx - 5, sy - sh / 2 + 0.6, sx + 5, sy - sh / 2 + 2.8, (60, 50, 44))
for gx in range(12, 44, 2):  # pagar semak halaman sekolah
    pt(gx, 40.2, HEDGE); pt(gx, 56.8, HEDGE)
line(38, 47, 38, 55, (120, 120, 126), 0.5)                                     # tiang bendera sekolah
rect(38, 47, 40.4, 48.2, (216, 60, 50)); rect(38, 48.2, 40.4, 49.4, (245, 245, 245))

# --- rumah-rumah warga (bervariasi) ---
house(58, 19, w=14, h=11)
house(58, 50, w=13, h=10, dish=True)
house(106, 26, w=15, h=12)
house(126, 24, w=13, h=11)
house(108, 48, w=14, h=11, chimney=True)          # cerobong A -> asap px (448,152)
house(128, 50, w=13, h=10, awning=(216, 84, 60))
house(146, 50, w=12, h=10)
house(24, 121, w=14, h=11)
house(24, 140, w=13, h=10, chimney=True)          # cerobong B -> asap px (112,514)
house(58, 124, w=13, h=10)
house(120, 157, w=12, h=9, dish=True)
house(146, 157, w=13, h=9)
house(97, 157, w=12, h=9)
house(60, 157, w=12, h=9, awning=(90, 140, 190))
# tandon air oranye di samping rumah (128,50)
rect(136.4, 47, 139.4, 52, (232, 128, 52)); rect(136.4, 46.4, 139.4, 47.4, (200, 104, 40))

# --- warung Bu Lastri (kanopi garis merah-putih) ---
wx, wy = 27, 100
ell(wx, wy + 6.4, 10, 1.6, GRASS_D)
rect(wx - 8.5, wy - 5, wx + 8.5, wy + 6, WOOD)
for i in range(int(wx - 8.5), int(wx + 8.5), 2):
    line(i, wy - 5, i, wy + 6, WOOD_D, 0.4)
for i in range(6):  # kanopi
    rect(wx - 9.5 + i * 3.2, wy - 9.6, wx - 6.3 + i * 3.2, wy - 6.4,
         (214, 74, 56) if i % 2 == 0 else (245, 240, 230))
line(wx - 9, wy - 6.4, wx - 9, wy - 3, WOOD_D, 0.6); line(wx + 9, wy - 6.4, wx + 9, wy - 3, WOOD_D, 0.6)
rect(wx - 6, wy - 3.4, wx + 6, wy - 0.6, (90, 60, 34))                          # meja counter
rect(wx - 3, wy + 1.4, wx - 0.4, wy + 4, WIN_WARM); rect(wx + 1, wy + 1.4, wx + 3.6, wy + 4, WIN_WARM)
rect(wx - 11, wy + 6.8, wx - 8.6, wy + 9.2, (226, 138, 60))                     # peti jeruk
rect(wx - 8.2, wy + 6.8, wx - 5.8, wy + 9.2, (110, 170, 90))                    # peti hijau
rect(wx + 6.4, wy + 6.8, wx + 8.8, wy + 9.2, (120, 150, 200))                   # galon

# --- deretan toko kecil ---
def shop(cx, cy, awn, sign=(240, 236, 220)):
    w, h = 12, 10
    x0, y0, x1, y1 = cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2
    ell(cx, cy + h / 2 + 0.6, w / 2 + 1.2, 1.4, GRASS_D)
    rect(x0 - 0.6, y0 - 1.4, x1 + 0.6, y0 + 1.6, (120, 118, 112))
    rect(x0, y0, x1, y1, (236, 230, 216))
    rect(x0 + 0.8, y0 + 3.2, x0 + 5.4, y1 - 1.2, WIN_DAY)                       # etalase
    rect(x0 + 0.8, y0 + 3.2, x0 + 5.4, y0 + 4, (90, 100, 110))
    rect(x1 - 2.6, y0 + 4, x1 - 0.6, y1, DOOR)
    for i in range(4):
        rect(x0 - 0.6 + i * 3.2, y0 - 3.2, x0 + 2.6 + i * 3.2, y0 - 1.2, awn if i % 2 == 0 else (245, 240, 230))
    rect(x0 + 1.4, y0 - 5.6, x1 - 1.4, y0 - 3.8, sign)                           # papan nama
shop(52, 100, (70, 110, 160))
shop(65, 100, (80, 140, 90))
shop(122, 100, (150, 90, 140))
shop(140, 100, (226, 138, 60))
# musholla kecil (atap hijau) di blok tengah-selatan
house(88, 101, w=13, h=9, wall=(232, 238, 226), roof=(64, 128, 84))
ell(88, 94.6, 1.3, 1.1, (210, 190, 90))                                        # kubah kecil

# ================= 7. menara sinyal (kanan atas, jangkar RadioWaves px 584,16) =================
tx, ty = 147, 4
line(tx - 5, ty + 30, tx, ty + 2, (90, 90, 96), 0.8)
line(tx + 5, ty + 30, tx, ty + 2, (90, 90, 96), 0.8)
line(tx - 5, ty + 30, tx + 5, ty + 30, (90, 90, 96), 0.8)
for i in range(4):
    yy = ty + 8 + i * 6
    line(tx - 3.4, yy, tx + 3.4, yy, (110, 110, 118), 0.6)
rect(tx - 2.2, ty - 1.6, tx + 2.2, ty + 1.8, (70, 70, 78))
pt(tx, ty - 2.4, (240, 60, 50))
rect(tx - 6, ty + 30, tx + 6, ty + 32.4, SIDEWALK)                             # fondasi menara

# ================= 8. gapura di jalan utama bawah =================
for gx in [71.5, 88.5]:
    rect(gx - 0.9, 154, gx + 0.9, 163, (150, 66, 36))
rect(69.5, 152.4, 90.5, 154.6, (164, 70, 40))
poly([(69.5, 152.4), (80, 149.6), (90.5, 152.4)], (176, 84, 45))

# ================= 9. pohon, semak, detail hijau =================
def tree(cx, cy, s=5.2, fruit=True):
    ell(cx, cy + s + 1.4, s * 0.9, 1.3, GRASS_D)
    rect(cx - 0.45, cy + s - 1.4, cx + 0.45, cy + s + 1.6, TRUNK)
    ell(cx, cy, s, s * 0.92, TREE_D)
    ell(cx - 0.7, cy - 0.8, s * 0.78, s * 0.7, TREE_M)
    ell(cx - 1.4, cy - 1.8, s * 0.5, s * 0.42, TREE_L)
    if fruit:
        pt(cx - 1.4, cy + 0.4, (226, 96, 60)); pt(cx + 1.8, cy + 1.6, (226, 96, 60)); pt(cx + 0.4, cy - 2.2, (240, 170, 70))
tree(18, 50, 4.6)            # halaman sekolah
tree(12, 66); tree(50, 70, 4.4); tree(112, 68)
tree(18, 96, 4.4); tree(84, 96, 4.2); tree(98, 104, 4.6)
tree(140, 108, 4.4); tree(36, 156, 4.6); tree(106, 108, 4.2); tree(72, 138, 4.4); tree(154, 122, 4.2)
tree(16, 173); tree(44, 174, 4.6); tree(104, 173); tree(136, 174, 4.6); tree(152, 170, 4.2)
# titik pohon bergoyang (hanya tanah + bayangan; pohonnya sprite overlay di TwinMapBg)
for gx, gy in [(37, 75), (64, 110), (24, 171)]:
    ell(gx, gy + 2.4, 4.4, 1.2, GRASS_D)
    ell(gx, gy + 2.2, 2.6, 1, DIRT)
# semak bunga di dekat rumah & taman bawah
def bush(cx, cy):
    ell(cx, cy, 1.9, 1.4, HEDGE)
    pt(cx - 0.7, cy - 0.3, random.choice(FLOWERS)); pt(cx + 0.8, cy + 0.4, random.choice(FLOWERS))
for bx_, by_ in [(44, 14), (70, 58), (94, 58), (120, 40), (34, 109), (100, 109), (150, 108), (56, 168), (112, 176)]:
    bush(bx_, by_)
# hamparan bunga taman bawah
rect(56, 169.5, 68, 172.5, (92, 150, 66)); rect(108, 174, 118, 177, (92, 150, 66))
for _ in range(60):
    pt(random.uniform(56.5, 67.5), random.uniform(170, 172), random.choice(FLOWERS))
    pt(random.uniform(108.5, 117.5), random.uniform(174.5, 176.5), random.choice(FLOWERS))
# bangku taman & plaza
for bx_, by_ in [(60, 73.5), (100, 73.5), (30, 176.5), (88, 176.5), (120, 176.5)]:
    rect(bx_ - 2, by_ - 0.7, bx_ + 2, by_ + 0.7, WOOD)
    rect(bx_ - 2, by_ + 0.7, bx_ + 2, by_ + 1.1, WOOD_D)
# tiang jemuran + tali (kainnya overlay berkibar di TwinMapBg) — px tali y=521, x 54..98
line(13.5, 129, 13.5, 134, POLE, 0.6); line(24.5, 129, 24.5, 134, POLE, 0.6)
line(13.5, 130.2, 24.5, 130.2, (210, 205, 195), 0.4)
# air mancur plaza (di paving barat plaza, BUKAN di tengah jalan)
ell(64, 68, 4.6, 4.6, STONE); ell(64, 68, 3.6, 3.6, WATER); ell(64, 68, 1.6, 1.6, WATER_L)
pt(63, 67, (255, 255, 255)); pt(65.4, 69, (255, 255, 255))

img = img.resize((640, 720), Image.NEAREST)
img.save('/home/hatch/workspace/produksi-video-simulasi/medsos/remotion-v3/public/sprites/plate_desa_y0.png')
print('plate_desa_y0.png', img.size)

# --- backdrop senja per separuh (potong bg_sunset Pemimpin) ---
bg = Image.open('/home/hatch/workspace/produksi-video-simulasi/medsos/remotion-v3/public/sprites/bg_sunset.png')
half = bg.crop((0, 0, 640, 720))
half.save('/home/hatch/workspace/produksi-video-simulasi/medsos/remotion-v3/public/sprites/bg_sunset_half.png')
print('bg_sunset_half.png', half.size)

# Sprite ambience peta hidup: kendaraan, burung, pohon bergoyang.
# Digambar pada kanvas setengah ukuran lalu upscale NEAREST x2 (grain 2px,
# sama dengan plate desa modern). Dipakai TwinMapBg sebagai overlay animasi.
from PIL import Image, ImageDraw

OUT = '/home/hatch/workspace/produksi-video-simulasi/medsos/remotion-v3/public/sprites/'

def canvas(w, h):
    img = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    return img, ImageDraw.Draw(img)

def save(img, name):
    img = img.resize((img.width * 2, img.height * 2), Image.NEAREST)
    img.save(OUT + name)
    print(name, img.size)

def wheel(d, cx, cy, r=2.6):
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(38, 38, 44, 255))
    d.ellipse([cx - 1.1, cy - 1.1, cx + 1.1, cy + 1.1], fill=(150, 150, 158, 255))

# ---------- motor + pengendara (30x19) ----------
img, d = canvas(30, 19)
wheel(d, 5, 15.5); wheel(d, 24, 15.5)
d.polygon([(3, 15), (8, 8), (11, 8), (10, 12), (13, 15)], fill=(198, 66, 54, 255))       # bodi depan
d.rectangle([9, 11, 20, 13.4], fill=(178, 56, 46, 255))                                   # bodi tengah
d.polygon([(18, 11), (23, 8.6), (25.5, 10), (24, 13), (19, 13)], fill=(198, 66, 54, 255))  # ekor
d.rectangle([10.5, 9.2, 17, 10.6], fill=(40, 40, 46, 255))                                 # jok
d.line([8.6, 8, 10.4, 4.6], fill=(52, 52, 58, 255), width=1)                              # setang
d.rectangle([16.5, 3.4, 19.5, 8.6], fill=(52, 128, 140, 255))                             # torso pengendara
d.polygon([(17, 8.6), (20.5, 8.6), (23, 13.4), (20.6, 13.8), (18.2, 10.4)], fill=(52, 58, 88, 255))  # kaki
d.line([18.8, 4.6, 11, 5.4], fill=(232, 178, 138, 255), width=1)                          # lengan
d.ellipse([16.2, 0.2, 20.2, 3.6], fill=(216, 60, 50, 255))                                # helm
d.rectangle([16.2, 2.2, 20.2, 3.2], fill=(240, 240, 240, 255))
save(img, 'veh_motor.png')

# ---------- angkot (50x23) ----------
img, d = canvas(50, 23)
wheel(d, 10, 19); wheel(d, 39, 19)
d.rectangle([2, 5, 47, 18.4], fill=(70, 110, 170, 255))
d.rectangle([2, 5, 47, 7.6], fill=(240, 240, 238, 255))                                   # atap putih
d.rectangle([2, 16.4, 47, 18.4], fill=(52, 84, 134, 255))
for i in range(5):                                                                        # jendela
    x = 5 + i * 8.6
    d.rectangle([x, 8.8, x + 6.4, 13.4], fill=(186, 216, 236, 255))
d.rectangle([36.5, 8.8, 42, 18.4], outline=(40, 60, 96, 255))                             # pintu
d.rectangle([45.5, 13.5, 47.5, 15.5], fill=(255, 224, 130, 255))                          # lampu
d.rectangle([1, 13.5, 2.6, 15.5], fill=(220, 70, 60, 255))
save(img, 'veh_angkot.png')

# ---------- pickup (48x22) ----------
img, d = canvas(48, 22)
wheel(d, 10, 18); wheel(d, 38, 18)
d.rectangle([24, 9, 46, 16.6], fill=(110, 130, 118, 255))                                 # bak
d.rectangle([25.5, 5.8, 30.5, 9], fill=(226, 138, 60, 255))                               # peti
d.rectangle([32, 6.6, 36.5, 9], fill=(120, 150, 200, 255))                                # galon
d.polygon([(4, 16.6), (4, 10), (10, 6.4), (20, 6.4), (24, 9), (24, 16.6)], fill=(96, 116, 104, 255))  # kabin
d.polygon([(11, 7.6), (19, 7.6), (22, 10.4), (11, 10.4)], fill=(186, 216, 236, 255))       # kaca
d.rectangle([3, 16.6, 46, 18], fill=(70, 84, 76, 255))
d.rectangle([3.4, 12.4, 5, 14.2], fill=(255, 224, 130, 255))
save(img, 'veh_pickup.png')

# ---------- burung (10x5) ----------
img, d = canvas(10, 5)
for (x, y) in [(0, 1), (1, 0), (2, 1), (3, 2), (4, 2), (5, 2), (6, 1), (7, 0), (8, 1), (9, 2)]:
    d.point((x, y), fill=(40, 44, 52, 255))
d.point((4, 3), fill=(40, 44, 52, 255)); d.point((5, 3), fill=(40, 44, 52, 255))
save(img, 'bird.png')

# ---------- pohon bergoyang (26x30) ----------
img, d = canvas(26, 30)
d.rectangle([12.2, 21, 13.8, 29], fill=(110, 76, 44, 255))
d.ellipse([2, 2, 24, 22], fill=(50, 108, 42, 255))
d.ellipse([4, 1, 21, 18], fill=(64, 134, 52, 255))
d.ellipse([6, 0, 17, 12], fill=(82, 156, 66, 255))
for (x, y, c) in [(8, 12, (226, 96, 60)), (17, 15, (226, 96, 60)), (13, 7, (240, 170, 70))]:
    d.point((x, y), fill=c + (255,))
save(img, 'tree_sway.png')

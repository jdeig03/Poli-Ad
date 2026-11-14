# Share of the orb that reads blue / purple / red (by hue), and smile contrast along its length.
import sys, colorsys
from PIL import Image
im = Image.open(sys.argv[1]).convert('RGB'); W = im.size[0]; k = W / 270
cnt = {'blue': 0, 'purple': 0, 'red': 0}
for y in range(0, W, 3):
    for x in range(0, W, 3):
        if (x - W / 2) ** 2 + (y - W / 2) ** 2 > (W / 2 - 4) ** 2: continue
        r, g, b = [v / 255 for v in im.getpixel((x, y))]
        h, l, s = colorsys.rgb_to_hls(r, g, b)
        if s < 0.12 or l > 0.93: continue
        h *= 360
        cnt['blue' if 200 <= h < 255 else 'purple' if 255 <= h < 305 else 'red'] += 1
t = sum(cnt.values())
f = lambda v: (v / 255) / 12.92 if v / 255 <= 0.03928 else (((v / 255) + 0.055) / 1.055) ** 2.4
lum = lambda c: 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2])
con = []
for tt in [0.06, 0.25, 0.5, 0.75, 0.94]:
    x = (1 - tt) ** 2 * 40 + 2 * (1 - tt) * tt * 135 + tt * tt * 230; y = (1 - tt) ** 2 * 134 + 2 * (1 - tt) * tt * 216 + tt * tt * 134
    con.append(round(1.05 / (lum(im.getpixel((int(x * k), int((y - 17) * k)))) + 0.05), 1))
print(' '.join(f'{c} {100 * v / t:.0f}%' for c, v in cnt.items()), '| smile contrast L->R', con)
